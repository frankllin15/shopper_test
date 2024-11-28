import { IsString } from 'class-validator';

export class EstimateRideDto {
  @IsString()
  readonly customer_id: string;

  @IsString()
  readonly origin: string;

  @IsString()
  readonly destination: string;
}

export class EstimateRideResponseDto {
  readonly origin: {
    latitude: number;
    longitude: number;
  };
  readonly destination: {
    latitude: number;
    longitude: number;
  };
  readonly distance: number;
  readonly duration: string;
  readonly options: {
    id: number;
    name: string;
    description: string;
    vehicle: string;
    vehicle_image: string;
    review: {
      rating: number;
      comment: string;
    };
    value: number;
  }[];
  readonly routeResponse: object;
}
