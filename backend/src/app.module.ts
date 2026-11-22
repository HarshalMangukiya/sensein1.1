import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { PaymentsModule } from './payments/payments.module';
import { ShippingModule } from './shipping/shipping.module';
import { OrdersModule } from './orders/orders.module';
import { InquiriesModule } from './inquiries/inquiries.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CouponsModule } from './coupons/coupons.module';
import { ContentModule } from './content/content.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/sensein',
      }),
    }),
    CloudinaryModule,
    RedisModule,
    AuthModule,
    ProductsModule,
    PaymentsModule,
    ShippingModule,
    OrdersModule,
    InquiriesModule,
    CouponsModule,
    ContentModule,
  ],
})
export class AppModule {}
