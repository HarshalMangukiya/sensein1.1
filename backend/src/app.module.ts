import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { PaymentsModule } from './payments/payments.module';
import { ShippingModule } from './shipping/shipping.module';
import { OrdersModule } from './orders/orders.module';
import { InquiriesModule } from './inquiries/inquiries.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    RedisModule,
    AuthModule,
    ProductsModule,
    PaymentsModule,
    ShippingModule,
    OrdersModule,
    InquiriesModule,
  ],
})
export class AppModule {}
