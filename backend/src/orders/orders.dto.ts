import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderCustomerDto {
  @ApiProperty({ example: 'Aditi Sharma' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'aditi.sharma@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '9876543210' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'Villa 14, Magnolia Gardens' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 'Golf Course Road' })
  @IsOptional()
  @IsString()
  landmark?: string;

  @ApiProperty({ example: '122001' })
  @IsString()
  @IsNotEmpty()
  pincode: string;

  @ApiProperty({ example: 'Gurugram' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'Haryana' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  userId?: string;
}

export class OrderItemDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  image?: string;
}

export class CreateOrderDto {
  @ApiProperty({ type: CreateOrderCustomerDto })
  @ValidateNested()
  @Type(() => CreateOrderCustomerDto)
  @IsDefined()
  customer: CreateOrderCustomerDto;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ example: 2598 })
  @IsNumber()
  subtotal: number;

  @ApiProperty({ example: 259 })
  @IsNumber()
  discount: number;

  @ApiProperty({ example: 'LUXE10', required: false })
  @IsOptional()
  @IsString()
  couponCode?: string;

  @ApiProperty({ example: 0 })
  @IsNumber()
  shippingFee: number;

  @ApiProperty({ example: 2339 })
  @IsNumber()
  total: number;

  @ApiProperty({ example: 'razorpay', enum: ['razorpay', 'cod'] })
  @IsString()
  paymentMethod: string;

  @ApiProperty({ required: false })
  @IsOptional()
  razorpayPaymentId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  razorpayOrderId?: string;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  freeGifts?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  userId?: string;
}
