import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BannerDocument = Banner & Document;

@Schema({ _id: false })
export class BannerSlide {
  @Prop({ default: () => `slide-${Date.now()}` })
  id: string;

  @Prop({ default: '' })
  badge: string;

  @Prop({ required: true, default: 'SALON LUXURY RE-ENGINEERED' })
  title: string;

  @Prop({
    required: true,
    default:
      'High-performance botanical formulas crafted with clean ingredients for Indian hair textures.',
  })
  subtitle: string;

  @Prop({ default: 'EXPLORE COLLECTION' })
  ctaText: string;

  @Prop({ default: '/shop' })
  ctaLink: string;

  @Prop({
    default:
      'https://res.cloudinary.com/dqddawu42/image/upload/v1789820352/sensein/hero/sensein-perfume-bottle.jpg',
  })
  imageUrl: string;

  @Prop({ default: 40 })
  overlayDarkness: number;

  @Prop({ default: 'center' })
  textAlign: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const BannerSlideSchema = SchemaFactory.createForClass(BannerSlide);

@Schema({ timestamps: true, strict: false })
export class Banner {
  @Prop({ required: true, default: 'hero-banner', unique: true, index: true })
  key: string;

  @Prop({ default: 'OFFICIAL SENSEIN® PARIS' })
  badge: string;

  @Prop({ required: true, default: 'SALON LUXURY RE-ENGINEERED' })
  title: string;

  @Prop({
    required: true,
    default:
      'High-performance botanical formulas crafted with clean ingredients for Indian hair textures.',
  })
  subtitle: string;

  @Prop({ default: 'EXPLORE COLLECTION' })
  ctaText: string;

  @Prop({ default: '/shop' })
  ctaLink: string;

  @Prop({
    default:
      'https://res.cloudinary.com/dqddawu42/image/upload/v1789820352/sensein/hero/sensein-perfume-bottle.jpg',
  })
  imageUrl: string;

  @Prop({ default: 40 })
  overlayDarkness: number;

  @Prop({ default: 'center' })
  textAlign: string;

  @Prop({ default: true })
  showArc: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: [BannerSlideSchema], default: [] })
  slides: BannerSlide[];

  @Prop({ default: true })
  autoplay: boolean;

  @Prop({ default: 5 })
  autoplayIntervalSeconds: number;
}

export const BannerSchema = SchemaFactory.createForClass(Banner);
