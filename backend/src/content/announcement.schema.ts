import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AnnouncementDocument = Announcement & Document;

@Schema({ _id: false })
export class AnnouncementItemSchema {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  text: string;

  @Prop({ default: false })
  isTag: boolean;

  @Prop({ default: '' })
  link: string;
}

@Schema({ timestamps: true })
export class Announcement {
  @Prop({ required: true, default: 'announcement-bar', unique: true, index: true })
  key: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 30 })
  speedSeconds: number;

  @Prop({ default: '✦' })
  separator: string;

  @Prop({ default: '#432542' })
  backgroundColor: string;

  @Prop({ default: '#FFFFFF' })
  textColor: string;

  @Prop({ type: [AnnouncementItemSchema], default: [] })
  items: AnnouncementItemSchema[];
}

export const AnnouncementSchema = SchemaFactory.createForClass(Announcement);
