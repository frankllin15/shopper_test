import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaClient, Rating } from '@prisma/client';
import { Driver } from '.prisma/client';

const prisma = new PrismaClient();

async function initializeData() {
  const defaultDrivers: Driver[] = [
    {
      id: 1,
      name: 'Homer Simpson',
      resume:
        'Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).',
      car: 'Plymouth Valiant 1973 rosa e enferrujado',
      carImage: '/images/cars/homer_car.png',
      tax: 2.5,
      minDistance: 1,
    },
    {
      id: 2,
      name: 'Dominic Toretto',
      resume:
        'Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.',
      car: 'Dodge Charger R/T 1970 modificado',
      carImage: '/images/cars/dominic_toretto_car.png',
      tax: 5,
      minDistance: 5,
    },
    {
      id: 3,
      name: 'James Bond',
      resume:
        'Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.',
      car: 'Aston Martin DB5 clássico',
      carImage: '/images/cars/james_bond_car.png',
      tax: 10,
      minDistance: 10,
    },
  ];

  const defaultRatings: Rating[] = [
    {
      id: 1,
      driverId: 1,
      value: 2,
      comment:
        'Motorista simpático, mas errou o caminho 3 vezes. O carro cheira a donuts.',
    },
    {
      id: 2,
      driverId: 2,
      value: 4,
      comment:
        'Que viagem incrível! O carro é um show à parte e o motorista, apesar de ter uma cara de poucos amigos, foi super gente boa. Recomendo!',
    },
    {
      id: 3,
      driverId: 3,
      value: 5,
      comment:
        'Serviço impecável! O motorista é a própria definição de classe e o carro é simplesmente magnífico. Uma experiência digna de um agente secreto.',
    },
  ];

  for (const role of defaultDrivers) {
    await prisma.driver.upsert({
      where: { id: role.id },
      update: {},
      create: { ...role },
    });
  }

  for (const rating of defaultRatings) {
    await prisma.rating.upsert({
      where: { id: rating.id },
      update: {},
      create: { ...rating },
    });
  }
  console.log('Valores padrão inicializados com sucesso.');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Habilita a transformação dos dados
      whitelist: true, // Remove campos não declarados nos DTOs
      forbidNonWhitelisted: true, // Rejeita solicitações com campos não permitidos
    }),
  );
  app.enableCors();
  await initializeData();
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
