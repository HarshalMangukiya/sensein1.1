import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';

const express = require('express');

const server = express();
let isReady = false;

async function bootstrapServerless() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  await app.init();
  isReady = true;
}

export default async function handler(req: any, res: any) {
  if (!isReady) {
    await bootstrapServerless();
  }
  return server(req, res);
}
