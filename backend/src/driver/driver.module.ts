import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [DriverController],
  providers: [DriverService, PrismaService],
})
export class DriverModule {}
