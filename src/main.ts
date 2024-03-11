import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as ejs from 'ejs';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(3000);
}
bootstrap();
