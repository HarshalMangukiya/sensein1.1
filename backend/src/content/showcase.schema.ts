import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ShowcaseDocument = Showcase & Document;

@Schema({ _id: false })
export class ShowcaseCardItem {
  @Prop({ required: true })
  id: string;

  @Prop({ default: 'image' })
  mediaType: string; // 'image' | 'video'

  @Prop({ default: '' })
  videoUrl?: string;

  @Prop({ default: '' })
  mediaUrl?: string;

  @Prop()
  productId?: string;

  @Prop()
  productSlug?: string;

  @Prop({ default: '' })
  tag?: string;

  @Prop({ default: 4.9 })
  rating?: number;

  @Prop({ default: '' })
  name?: string;

  @Prop({ default: 0 })
  price?: number;

  @Prop({ default: 0 })
  mrp?: number;

  @Prop({ default: '' })
  image: string;

  @Prop({ default: '/shop' })
  href?: string;
}

export const ShowcaseCardItemSchema = SchemaFactory.createForClass(ShowcaseCardItem);

@Schema({ timestamps: true })
export class Showcase {
  @Prop({ required: true, default: 'real-results-showcase', unique: true, index: true })
  key: string;

  @Prop({ default: 'REAL PEOPLE REAL RESULTS' })
  badge: string;

  @Prop({ default: 'REAL PEOPLE. REAL RESULTS.' })
  title: string;

  @Prop({
    default: 'Experience salon-grade transformations verified by clinical hair specialists.',
  })
  subtitle: string;

  @Prop({ default: 'single-product' })
  mode: string;

  @Prop({ default: 'hair-wax' })
  selectedProductId?: string;

  @Prop({ type: [ShowcaseCardItemSchema], default: [] })
  cards: ShowcaseCardItem[];

  @Prop({ default: true })
  autoRotate: boolean;

  @Prop({ default: 2000 })
  rotationIntervalMs: number;
}

export const ShowcaseSchema = SchemaFactory.createForClass(Showcase);
