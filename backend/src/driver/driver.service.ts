import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DriverService {
  constructor(readonly prismaService: PrismaService) {}

  async getAll() {
    return this.prismaService.driver.findMany();
  }
}
