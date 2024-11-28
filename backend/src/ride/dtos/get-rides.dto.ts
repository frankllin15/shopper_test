import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetRidesParams {
  @IsInt()
  @Type(() => Number)
  readonly customer_id: number;
}

export class GetRidesQuery {
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  readonly driver_id?: number;
}

export class GetRidesResponse {
  customer_id: string;
  rides: {
    id: number;
    date: Date;
    origin: string;
    destination: string;
    distance: number;
    duration: string;
    driver: {
      id: number;
      name: string;
      vehicle_image: string;
    };
    value: number;
  }[];
}
