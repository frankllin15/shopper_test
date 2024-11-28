import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('login')
  async createCustomer(@Body() data: CreateCustomerDto) {
    const existingCustomer = await this.customerService.getCustomerByDocument(
      data.document,
    );

    if (existingCustomer) {
      return existingCustomer;
    }

    return this.customerService.createCustomer(data);
  }

  @Get(':document')
  getCustomerByDocument(@Param('document') document: string) {
    return this.customerService.getCustomerByDocument(document);
  }
}
