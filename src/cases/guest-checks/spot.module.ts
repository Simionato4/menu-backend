import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Spot } from './guest-check.entity';
import { SpotController } from './spot.controler';
import { SpotService } from './guest-check.service';

@Module({
  imports: [TypeOrmModule.forFeature([Spot])],
  controllers: [SpotController],
  providers: [SpotService],
})
export class SpotModule {}
