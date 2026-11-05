import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseEnumPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { GuestCheckService } from './guest-check.service';
import { GuestCheck, GuestCheckStatus } from './guest-check.entity';
import { CreateGuestCheckDto } from './dto/create-guest-check';
import { GuestCheckWithTotal } from './dto/guest-check-with-total';

@Controller('guest-checks')
export class GuestCheckController {
  constructor(private readonly service: GuestCheckService) {}

  @Get()
  findAll(
    @Query('status', new ParseEnumPipe(GuestCheckStatus, { optional: true }))
    status?: GuestCheckStatus,
  ): Promise<GuestCheckWithTotal[]> {
    return this.service.findAll(status);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe)
    id: string,
  ): Promise<GuestCheck> {
    return this.service.findOne(id);
  }

  @Post()
  create(
    @Body()
    dto: CreateGuestCheckDto,
  ): Promise<GuestCheck> {
    return this.service.create(dto);
  }

  @Patch(':id/close')
  close(
    @Param('id', ParseUUIDPipe)
    id: string,
  ): Promise<GuestCheck> {
    return this.service.close(id);
  }

}
