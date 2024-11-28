import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ApiExeption } from '../utils/api.exeption';
import { GetRidesResponse } from './dtos/get-rides.dto';
import { ConfirmRideDto } from './dtos/confirm-ride.dto';
import {
  EstimateRideDto,
  EstimateRideResponseDto,
} from './dtos/estimate-ride.dto';
import axios from 'axios';
import { SaveCalculatedRouteDto } from './dtos/save-calculated-route.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RideService {
  private readonly googleApiKey: string;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.googleApiKey = this.configService.get<string>('GOOGLE_API_KEY');
  }

  private readonly directionsUrl =
    'https://routes.googleapis.com/directions/v2:computeRoutes';

  private readonly geocodingUrl =
    'https://maps.googleapis.com/maps/api/geocode/json';

  async getCoordinates(address: string) {
    try {
      const response = await axios.get(this.geocodingUrl, {
        params: {
          address,
          key: this.googleApiKey,
        },
      });

      if (response.data.results.length === 0) {
        throw new ApiExeption(
          'ADDRESS_NOT_FOUND',
          'Endereço não encontrado',
          HttpStatus.NOT_FOUND,
        );
      }

      const location = response.data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng,
      };
    } catch (error) {
      console.error(
        'Erro ao obter coordenadas:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  async computeRoutes(originAddress: string, destinationAddress: string) {
    try {
      // Obter coordenadas de origem e destino
      const origin = await this.getCoordinates(originAddress);
      const destination = await this.getCoordinates(destinationAddress);

      const data = {
        origin: {
          location: {
            latLng: origin,
          },
        },
        destination: {
          location: {
            latLng: destination,
          },
        },
        travelMode: 'DRIVE',
        routingPreference: 'TRAFFIC_AWARE',
        computeAlternativeRoutes: false,
        routeModifiers: {
          avoidTolls: false,
          avoidHighways: false,
          avoidFerries: false,
        },
        languageCode: 'pt-BR',
        units: 'IMPERIAL',
      };

      const headers = {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': this.googleApiKey,
        'X-Goog-FieldMask':
          'routes.duration,routes.distanceMeters,routes.legs,routes.polyline.encodedPolyline',
      };

      const response = await axios.post(this.directionsUrl, data, { headers });
      return response.data;
    } catch (error) {
      console.error(
        'Erro ao calcular rotas:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  async getRideByCustomerId(
    customerId: number,
    driverId?: number,
  ): Promise<GetRidesResponse> {
    if (driverId) {
      const driver = await this.prismaService.driver.findUnique({
        where: {
          id: driverId,
        },
      });

      if (!driver) {
        throw new ApiExeption(
          'DRIVER_NOT_FOUND',
          'Motorista invalido',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    const rides = await this.prismaService.ride.findMany({
      where: {
        customerId: customerId,
        ...(driverId && { driverId: driverId }),
      },
      include: {
        route: true,
        driver: true,
      },
    });

    if (rides.length === 0) {
      throw new ApiExeption(
        'NO_RIDES_FOUND',
        'Nenhum registro encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      customer_id: customerId.toString(),
      rides: rides.map((ride) => ({
        id: ride.id,
        date: ride.date,
        origin: ride.route.origin,
        destination: ride.route.destination,
        distance: ride.route.distance,
        duration: ride.route.duration.toString(),
        value: ride.value,
        driver: {
          id: ride.driverId,
          name: ride.driver.name,
          vehicle_image: ride.driver.carImage,
        },
      })),
    };
  }

  async estimateRide(data: EstimateRideDto): Promise<EstimateRideResponseDto> {
    const calculatedRoute = await this.getCalculatedRoute(
      data.origin,
      data.destination,
    );

    let response: { routes: { legs: any[] }[] };

    if (calculatedRoute) {
      response = JSON.parse(calculatedRoute.apiResponse);
    } else {
      response = await this.computeRoutes(data.origin, data.destination);
      //verifica se não é um objeto vazio
      if (!Object.keys(response).length) {
        throw new ApiExeption(
          'ROUTE_NOT_FOUND',
          'Rota não encontrada',
          HttpStatus.NOT_FOUND,
        );
      }
      await this.saveCalculatedRoute({
        origin: data.origin,
        destination: data.destination,
        distance: response.routes[0].legs[0].distanceMeters / 1000,
        duration: response.routes[0].legs[0].duration,
        apiResponse: JSON.stringify(response),
      });
    }

    const route = response.routes[0].legs[0];
    const distanceKilometers = route.distanceMeters / 1000;
    const duration = route.duration;

    const availableDrivers = await this.getAvailableDrivers(distanceKilometers);
    const options = availableDrivers.map((driver) => ({
      id: driver.id,
      name: driver.name,
      description: driver.resume,
      vehicle: driver.car,
      vehicle_image: driver.carImage,
      review: {
        rating: driver.ratings[0]?.value || 0,
        comment: driver.ratings[0]?.comment || '',
      },
      value: this.calculatePrice(distanceKilometers, driver.tax),
    }));

    return {
      origin: {
        latitude: route.startLocation.latLng.latitude,
        longitude: route.startLocation.latLng.longitude,
      },
      destination: {
        latitude: route.endLocation.latLng.latitude,
        longitude: route.endLocation.latLng.longitude,
      },
      distance: distanceKilometers,
      duration,
      options: options,
      routeResponse: response,
    };
  }

  async getAvailableDrivers(distance: number) {
    return this.prismaService.driver.findMany({
      where: {
        minDistance: {
          lte: distance,
        },
      },
      include: {
        ratings: { take: 1, orderBy: { id: 'desc' } },
      },
    });
  }

  private async getCalculatedRoute(origin: string, destination: string) {
    return this.prismaService.calculatedRoute.findUnique({
      where: {
        destination_origin: {
          origin,
          destination,
        },
      },
    });
  }

  private saveCalculatedRoute(data: SaveCalculatedRouteDto) {
    return this.prismaService.calculatedRoute.create({
      data,
    });
  }

  async confirmRide(data: ConfirmRideDto) {
    const driver = await this.prismaService.driver.findUnique({
      where: {
        id: data.driver.id,
      },
    });

    if (!driver) {
      throw new ApiExeption(
        'DRIVER_NOT_FOUND',
        'Motorista não encontrado ',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prismaService.ride.create({
      data: {
        driver: {
          connect: { id: data.driver.id },
        },
        customer: {
          connect: { id: data.customer_id },
        },
        route: {
          connect: {
            destination_origin: {
              origin: data.origin,
              destination: data.destination,
            },
          },
        },
        value: data.value,
      },
    });

    return;
  }

  private calculatePrice(distance: number, tax: number) {
    return Math.round(distance * tax * 100) / 100;
  }
}
