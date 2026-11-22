import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true, strict: false })
export class Product {
  @Prop({ index: true })
  id?: string;

  @Prop({ default: 'single', index: true })
  productType?: string; // 'single' | 'combo'

  @Prop({ type: Array, default: [] })
  comboItems?: Array<{
    name: string;
    quantity?: string;
    description?: string;
  }>;

  @Prop({ default: 50 })
  stock?: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop()
  subtitle: string;

  @Prop()
  description: string;

  @Prop({ required: true, index: true })
  category: string;

  @Prop({ default: 'Bestsellers' })
  curatedCollection: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  mrp: number;

  @Prop({ default: 0 })
  discountPercentage: number;

  @Prop({ default: '250ml' })
  netVolume: string;

  @Prop({ type: Array, default: [] })
  variants: Array<{
    size: string;
    price: number;
    mrp: number;
    inStock: boolean;
  }>;

  @Prop({ default: 4.8 })
  rating: number;

  @Prop({ default: 35 })
  reviewCount: number;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: [String], default: [] })
  badges: string[];

  @Prop({ default: true })
  inStock: boolean;

  @Prop({ type: Object })
  ingredients: {
    keyActives: string[];
    fullList: string;
  };

  @Prop()
  overview: string;

  @Prop({ type: Array, default: [] })
  howToUse: Array<{
    step: number;
    title: string;
    instruction: string;
  }>;

  @Prop()
  usageAdvice?: string;

  @Prop({ type: Object })
  productDetails?: Record<string, any>;

  @Prop({ type: [String], default: [] })
  benefits?: string[];

  @Prop({ type: Array, default: [] })
  faqs?: Array<{
    question: string;
    answer: string;
  }>;

  @Prop({ type: Object })
  additionalInfo?: Record<string, any>;

  @Prop({ type: Array, default: [] })
  reviews: Array<{
    id: string;
    author: string;
    rating: number;
    title: string;
    content: string;
    date: string;
    verifiedBuyer: boolean;
  }>;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
