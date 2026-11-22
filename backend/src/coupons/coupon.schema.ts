import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CouponDocument = Coupon & Document;

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

export enum CouponStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  EXPIRED = 'EXPIRED',
}

@Schema({ timestamps: true, collection: 'coupons' })
export class Coupon {
  @Prop({ required: true, unique: true, uppercase: true, trim: true })
  code: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true, enum: DiscountType, default: DiscountType.PERCENTAGE })
  discountType: DiscountType;

  @Prop({ required: true, min: 0 })
  discountValue: number;

  @Prop({ default: 0, min: 0 })
  minOrderValue: number;

  @Prop({ default: null })
  maxDiscountAmount?: number;

  @Prop({ required: true, enum: CouponStatus, default: CouponStatus.ACTIVE })
  status: CouponStatus;

  @Prop({ default: null })
  validFrom?: Date;

  @Prop({ default: null })
  validUntil?: Date;

  @Prop({ default: 0 })
  usageLimit: number; // 0 = unlimited

  @Prop({ default: 0 })
  usageCount: number;

  @Prop({ default: 1 })
  perUserLimit: number;

  @Prop({ default: true })
  isPublic: boolean;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);

// Helpful index on code and status
CouponSchema.index({ code: 1 }, { unique: true });
CouponSchema.index({ status: 1 });
