import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DriverModule } from './driver/driver.module';
import { RideModule } from './ride/ride.module';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './config/env.validation';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [
    DriverModule,
    RideModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv, // Adiciona a validação de variáveis de ambiente
    }),
    CustomerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
