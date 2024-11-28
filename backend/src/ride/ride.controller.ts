import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import { RideService } from './ride.service';
import { GetRidesParams, GetRidesQuery } from './dtos/get-rides.dto';
import { ConfirmRideDto } from './dtos/confirm-ride.dto';
import { ValidationExceptionFilter } from '../filters/validation-exception.filter';
import { EstimateRideDto } from './dtos/estimate-ride.dto';

@UseFilters(ValidationExceptionFilter)
@Controller('ride')
export class RideController {
  constructor(private readonly rideService: RideService) {}

  @Get(':customer_id')
  getRideByCustomerId(
    @Param() params: GetRidesParams,
    @Query() query: GetRidesQuery,
  ) {
    const { customer_id } = params;
    const { driver_id } = query;

    return this.rideService.getRideByCustomerId(customer_id, driver_id);
  }

  @Post('estimate')
  async estimateRide(@Body() data: EstimateRideDto) {
    const estimative = await this.rideService.estimateRide(data);
    return {
      ...estimative,
    };
  }

  @Patch('confirm')
  async confirmRide(@Body() data: ConfirmRideDto) {
    await this.rideService.confirmRide(data);
  }
}
