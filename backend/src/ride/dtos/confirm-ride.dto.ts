import {
  IsNumber,
  IsString,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class Driver {
  @IsNumber()
  @Type(() => Number)
  readonly id: number;

  @IsString()
  readonly name: string;
}

export class ConfirmRideDto {
  @IsNumber()
  @Type(() => Number)
  readonly customer_id: number;

  @IsString()
  readonly origin: string;

  @IsString()
  readonly destination: string;

  @IsNumber()
  @Type(() => Number)
  readonly distance: number;

  @IsString() // Se confirmar que é um número
  readonly duration: string;

  @ValidateNested() // Valida o objeto aninhado
  @Type(() => Driver) // Converte para a classe `Driver`
  readonly driver: Driver;

  @IsNumber()
  @Type(() => Number)
  readonly value: number;
}
