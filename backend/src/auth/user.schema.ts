import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, index: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ default: 'customer' })
  role: string;

  @Prop({ default: '' })
  phone: string;

  @Prop({ default: '' })
  avatarUrl: string; // Cloudinary secure media URL

  @Prop({ type: Array, default: [] })
  addresses: Array<{
    street: string;
    city: string;
    state: string;
    pincode: string;
    isDefault?: boolean;
  }>;
}

export const UserSchema = SchemaFactory.createForClass(User);
