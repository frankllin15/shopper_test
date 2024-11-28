import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';

@Injectable()
export class CustomerService {
  constructor(readonly prismaService: PrismaService) {}

  async createCustomer(data: CreateCustomerDto) {
    return this.prismaService.customer.create({ data });
  }

  async getCustomerByDocument(document: string) {
    return this.prismaService.customer.findUnique({ where: { document } });
  }
}
