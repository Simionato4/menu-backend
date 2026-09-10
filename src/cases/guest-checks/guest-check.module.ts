import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuestCheckController } from './guest-check.controler';
import { GuestCheck } from './guest-check.entity';
import { GuestCheckService } from './guest-check.service';
import { Spot } from '../spots/spot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GuestCheck, Spot])],
  controllers: [GuestCheckController],
  providers: [GuestCheckService],
  exports: [GuestCheckService],
})
export class GuestCheckModule {}
