import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InquiryDocument = Inquiry & Document;

@Schema({ timestamps: true, collection: 'inquiries' })
export class Inquiry {
  @Prop({ required: true, unique: true })
  referenceCode: string;

  @Prop({ required: true })
  organizationName: string;

  @Prop({ required: true })
  contactPerson: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  distributionType: string;

  @Prop({ required: true })
  estimatedQuantity: string;

  @Prop({ default: '' })
  gstin?: string;

  @Prop({ default: '' })
  expectedDeliveryDate?: string;

  @Prop({ type: [String], default: [] })
  productLines: string[];

  @Prop({ default: '' })
  notes?: string;

  @Prop({ default: 'RECEIVED' })
  status: string;

  @Prop({ default: () => new Date().toISOString() })
  submittedAt: string;
}

export const InquirySchema = SchemaFactory.createForClass(Inquiry);
