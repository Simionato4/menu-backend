import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from "@nestjs/common";
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
    findAll(
        @Query('guestCheckId', new ParseUUIDPipe({ optional: true }))
        guestCheckId?: string
    ): Promise<Order[]>{
         return this.service.findAll(guestCheckId);
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Order>{
        return this.service.findOne(id); 
    }

    // patch ou put vai cair na prova a diferença
    @Patch(':id/status')
    updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateOrderStatusDto): Promise<Order>{
        return this.service.updateStatus(id, dto);
    }
}