import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: 2498, description: 'Amount in INR' })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ example: 'INR', default: 'INR' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ example: 'receipt_order_001', required: false })
  @IsOptional()
  @IsString()
  receipt?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  notes?: Record<string, any>;
}

export class VerifyPaymentDto {
  @ApiProperty({ example: 'order_NxXXXXXXXX' })
  @IsString()
  @IsNotEmpty()
  razorpay_order_id: string;

  @ApiProperty({ example: 'pay_NyXXXXXXXX' })
  @IsString()
  @IsNotEmpty()
  razorpay_payment_id: string;

  @ApiProperty({ example: '9a9b8c...' })
  @IsString()
  @IsNotEmpty()
  razorpay_signature: string;
}
