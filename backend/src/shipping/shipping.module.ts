import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShippingController } from './shipping.controller';
import { ShippingService } from './shipping.service';
import { Order, OrderSchema } from '../orders/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  controllers: [ShippingController],
  providers: [ShippingService],
  exports: [ShippingService],
})
export class ShippingModule {}
