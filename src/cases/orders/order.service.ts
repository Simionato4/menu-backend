import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateOrderDto, CreateOrderItemDto } from "./dto/create-order";
import { Order, OrderStatus } from "./entities/order-entity";
import { OrderItem } from "./entities/order-item.entity";
import { GuestCheckService } from "../guest-checks/guest-check.service";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductService } from "../products/product.service";
import { UpdateOrderStatusDto } from "./dto/update-order-status";

@Injectable()
export class OrderService {
    constructor(
        private readonly guestCheckService: GuestCheckService,
        private readonly productService: ProductService,

        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,

        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>,
    ) {}

    private async prepareItems(itemDto: CreateOrderItemDto): Promise<OrderItem> {
        const product = await this.productService.findOne(itemDto.productId);
        const price = Number(product.price);
        const subtotal = price * itemDto.quantity;

        return this.orderItemRepository.create({
            product,
            quantity: itemDto.quantity,
            price,
            subtotal
        });
    }

    async create(dto: CreateOrderDto): Promise<Order> {
        // Regra #1: Verificar se tem comnanda aberta para a mesa
        const guestCheck = await this.guestCheckService.findOrCreateOpened(dto.spotId);

        // Monta o totalizador do pedido
        const items: OrderItem[] = [];
        let total = 0;

        for (const itemDto of dto.items) {
            const item = await this.prepareItems(itemDto); // prepara para inserir no banco
            items.push(item);
            total += Number(item.subtotal);
        }

        // Monta o pedido
        const order = this.orderRepository.create({
            guestCheck,
            status: OrderStatus.NEW,
            total,
            items
        });

        //Gravar no banco o pedido
        return this.orderRepository.save(order);
    }

    findAll(guestCheckId?: string): Promise<Order[]> {
        return this.orderRepository.find({
            where: guestCheckId ? { guestCheck: { id: guestCheckId } } : {},
            relations: { guestCheck: { spot: true }, items: { product: true } },
            order: { createdAt: 'ASC' }
        });
    }

    async findOne(id: string): Promise<Order> {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: { guestCheck: { spot: true }, items: { product: true } }
        });

        if (!order) {
            throw new NotFoundException(`Order with id ${id} not found`);
        }

        return order;
    }

    async updateStatus(id: string, dto: UpdateOrderStatusDto ): Promise<Order> {
        const order = await this.findOne(id);

        if (!Object.values(OrderStatus).includes(dto.status)){
            throw new BadRequestException('Status invalido')
        }

        // Forço a mudança de status
        order.status = dto.status

        // Grava a alteração no banco
        return this.orderRepository.save(order)
    }
}