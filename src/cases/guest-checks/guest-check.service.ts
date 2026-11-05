import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { GuestCheck, GuestCheckStatus } from "./guest-check.entity";
import { CreateGuestCheckDto } from "./dto/create-guest-check";
import { Spot } from "../spots/spot.entity";
import { GuestCheckWithTotal } from "./dto/guest-check-with-total";

@Injectable()
export class GuestCheckService {

    constructor( 
        @InjectRepository(GuestCheck)
        private readonly guestCheckRepository: Repository<GuestCheck>,

        @InjectRepository(Spot)
        private readonly spotRepository: Repository<Spot> 

    ) {} 

    async create(dto: CreateGuestCheckDto): Promise<GuestCheck> {
        
        //regra 1: não se abre comanda em mesa inexistente ou inativa
        const spot = await this.spotRepository.findOneBy({
            id: dto.SpotId,
            active: true
        })

        if (!spot) {
            throw new NotFoundException('Spot not found or inactive');
        }

        //regra 2: não se abre comanda em mesa que já tenha comanda aberta
        const opened = await this.guestCheckRepository.exists({
            where: {
                spot: { id: dto.SpotId},
                status: GuestCheckStatus.OPENED
            }
        })
        if (opened) {
            throw new ConflictException('There is already an opened guest check for this spot');
        }

        //Se chegou ate aqui deu boa
        const guestCheck = this.guestCheckRepository.create({
            spot,
            status: GuestCheckStatus.OPENED
        });

        return this.guestCheckRepository.save(guestCheck);
        
    }

    async findAll(status?: GuestCheckStatus): Promise<GuestCheckWithTotal[]> {
        const guestChecks = await this.guestCheckRepository.find({
            where: status ? { status } : {},
            relations: { spot: true, orders: true },
            order: { createdAt: 'ASC' }
        });

        return guestChecks.map((guestCheck) => ({
            id: guestCheck.id,
            createdAt: guestCheck.createdAt,
            status: guestCheck.status,
            spot: guestCheck.spot,
            total: guestCheck.orders.reduce((sum, order) => sum + Number(order.total), 0)
        }));
    }

    async findOne(id: string): Promise<GuestCheck> {
        const guestCheck = await this.guestCheckRepository.findOne({
            where: { id },
            relations: { spot: true }
        });
     
        if (!guestCheck) {
            throw new NotFoundException(`Guest check with id ${id} not found`);
        }
    
        return guestCheck;
    }

    async close(id: string): Promise<GuestCheck> {
        const guestCheck = await this.findOne(id);

        //regra 1: so posso fechar uma comanda que esteja aberta
        if (guestCheck.status === GuestCheckStatus.CLOSED) {
            throw new BadRequestException('Guest check is already closed');
        }

        //regra 2: Não posso fechar uma comanda com pedidos que não forem entregues
        //TO_DO: implementar essa regra depois (dívida técnica)
        //se chegou aqui deu boa!
        guestCheck.status = GuestCheckStatus.CLOSED;
        return this.guestCheckRepository.save(guestCheck);
    }

    findOpendBySpotid(spotId: string): Promise<GuestCheck | null> {
        return this.guestCheckRepository.findOne({
            where: {
                spot: { id: spotId },
                status: GuestCheckStatus.OPENED
            },
            relations: { spot: true}
        })
    }

    async findOrCreateOpened(spotId: string): Promise<GuestCheck> {
        const opened = await this.findOpendBySpotid(spotId);

        // Fluxo do Sim
        if (opened) {
            return opened;
        }

        return this.create({ SpotId: spotId });
    }
}