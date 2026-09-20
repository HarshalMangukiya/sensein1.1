import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true, strict: false })
export class Order {
  @Prop({ required: true, unique: true, index: true })
  orderNumber: string;

  @Prop({ index: true })
  userId?: string;

  @Prop({ type: Object, required: true })
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
    userId?: string;
  };

  @Prop({ type: Array, required: true })
  items: Array<any>;

  @Prop({ required: true })
  subtotal: number;

  @Prop({ default: 0 })
  discount: number;

  @Prop()
  couponCode?: string;

  @Prop({ default: 0 })
  shippingFee: number;

  @Prop({ required: true })
  total: number;

  @Prop({ default: 'razorpay' })
  paymentMethod: string;

  @Prop({ default: 'PAID' })
  paymentStatus: string;

  @Prop({ default: 'CONFIRMED' })
  orderStatus: string;

  @Prop()
  razorpayOrderId?: string;

  @Prop()
  razorpayPaymentId?: string;

  @Prop({ required: true })
  awbNumber: string;

  @Prop({ default: 'Blue Dart Luxury Priority Express' })
  carrier: string;

  @Prop({ type: [String], default: [] })
  freeGifts: string[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
