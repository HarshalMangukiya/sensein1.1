import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('SENSEIN-API');
  const app = await NestFactory.create(AppModule);

  // Global CORS configuration for Next.js frontend
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global DTO validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Swagger OpenAPI Documentation
  const config = new DocumentBuilder()
    .setTitle('SENSEIN PROFESSIONAL — Luxury Cosmetics & Haircare API')
    .setDescription('Enterprise microservice architecture for SENSEIN luxury cosmetics. Features OTP auth with Redis, Razorpay payments, pincode logistics SLA, and B2B corporate inquiries.')
    .setVersion('1.0.0')
    .addTag('Authentication')
    .addTag('Products')
    .addTag('Payments')
    .addTag('Shipping')
    .addTag('Orders')
    .addTag('Corporate Inquiries')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'SENSEIN API Docs',
    customCss: `
      .swagger-ui .topbar { background-color: #4A1528; }
      .swagger-ui .btn.authorize { background-color: #4A1528; color: #fff; border-color: #4A1528; }
    `,
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`SENSEIN PROFESSIONAL Backend is active on http://localhost:${port}`);
  logger.log(`Swagger OpenAPI documentation available at http://localhost:${port}/api/docs`);
}
bootstrap();
