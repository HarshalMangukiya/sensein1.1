import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BeforeAfterDocument = BeforeAfter & Document;

@Schema({ _id: false })
export class BeforeAfterItem {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  beforeImage: string;

  @Prop({ required: true })
  afterImage: string;

  @Prop({ default: 50 })
  initialPos?: number;
}

export const BeforeAfterItemSchema = SchemaFactory.createForClass(BeforeAfterItem);

@Schema({ timestamps: true })
export class BeforeAfter {
  @Prop({ required: true, unique: true, default: 'before-after-section' })
  key: string;

  @Prop({ default: "DIGITS DON'T LIE" })
  title: string;

  @Prop({ default: '98%' })
  stat1Value: string;

  @Prop({ default: 'Frizz Control Index' })
  stat1Label: string;

  @Prop({ default: '+140%' })
  stat2Value: string;

  @Prop({ default: 'Mirror Gloss Radiance' })
  stat2Label: string;

  @Prop({ default: '24h' })
  stat3Value: string;

  @Prop({ default: 'Humidity Shield Hold' })
  stat3Label: string;

  @Prop({ default: '*based on Independent Clinical Studies, 2026' })
  disclaimer: string;

  @Prop({ type: [BeforeAfterItemSchema], default: [] })
  items: BeforeAfterItem[];

  @Prop({ default: true })
  isActive: boolean;
}

export const BeforeAfterSchema = SchemaFactory.createForClass(BeforeAfter);
