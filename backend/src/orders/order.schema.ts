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

  @Prop({ default: 'CONFIRMED', index: true })
  orderStatus: string;

  @Prop()
  razorpayOrderId?: string;

  @Prop()
  razorpayPaymentId?: string;

  @Prop({ index: true })
  awbNumber?: string;

  @Prop({ default: 'Delhivery Express Priority' })
  carrier: string;

  @Prop()
  trackingUrl?: string;

  @Prop({ type: Object })
  shipment?: {
    provider: string;
    awb?: string;
    status?: string;
    currentLocation?: string;
    estimatedDelivery?: string;
    trackingUrl?: string;
    lastSyncedAt?: Date;
    error?: string;
    events?: Array<{
      status: string;
      description?: string;
      location?: string;
      timestamp?: string | Date;
    }>;
  };

  @Prop({ type: [String], default: [] })
  freeGifts: string[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.index({ 'customer.name': 1 });
OrderSchema.index({ 'customer.phone': 1 });
OrderSchema.index({ 'customer.email': 1 });
OrderSchema.index({ 'customer.city': 1 });
OrderSchema.index({ createdAt: -1 });
