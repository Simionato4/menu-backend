import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order";
import { UpdateOrderStatusDto } from "./dto/update-order-status";
import { Order } from "./entities/order-entity";

// vai cair na prova
@Controller('orders')
export class OrderController {

    constructor(private readonly service: OrderService){}

    @Post()
    create(@Body() dto: CreateOrderDto): Promise<Order>{
        return this.service.create(dto);
    }

    @Get()
    findAll(): Promise<Order[]>{
         return this.service.findAll();  
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Order>{
        return this.service.findOne(id); 
    }

    // pacht ou pucht vai cair na prova a diferença
    @Patch(':id/status')
    updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateOrderStatusDto): Promise<Order>{
        return this.service,this.updateStatus(id, dto);
    }
}