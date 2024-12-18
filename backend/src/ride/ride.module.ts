import { Module } from '@nestjs/common';
import { RideService } from './ride.service';
import { RideController } from './ride.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [RideController],
  providers: [RideService, PrismaService],
})
export class RideModule {}
