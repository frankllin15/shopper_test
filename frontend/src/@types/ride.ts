export type EstimateRideResponseDto = {
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
  readonly options: DriverOption[];
  readonly routeResponse: any;
}

export type DriverOption = {
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
}

export type ConfirmRideDto = {
  readonly customer_id: number;
  readonly origin: string;
  readonly destination: string;
  readonly distance: number;
  readonly duration: string;
  readonly driver: Driver;
  readonly value: number;
}

type Driver = {
  readonly id: number;
  readonly name: string;
}
export type GetRidesResponse = {
  customer_id: string;
  rides: RideDto[];
}
export type RideDto = {

  id: number;
  date: string;
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

}