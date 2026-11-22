import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DiscountType, CouponStatus } from './coupon.schema';

export class CreateCouponDto {
  @ApiProperty({ example: 'LUXE20' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: '20% off on premium botanical formulations' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: DiscountType, default: DiscountType.PERCENTAGE })
  @IsEnum(DiscountType)
  discountType: DiscountType;

  @ApiProperty({ example: 20 })
  @IsNumber()
  @Min(0)
  discountValue: number;

  @ApiProperty({ example: 1499, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minOrderValue?: number;

  @ApiProperty({ example: 500, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxDiscountAmount?: number;

  @ApiProperty({ enum: CouponStatus, default: CouponStatus.ACTIVE, required: false })
  @IsOptional()
  @IsEnum(CouponStatus)
  status?: CouponStatus;

  @ApiProperty({ example: '2026-12-31T23:59:59.000Z', required: false })
  @IsOptional()
  validUntil?: string | Date;

  @ApiProperty({ example: 100, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  usageLimit?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  perUserLimit?: number;
}

export class UpdateCouponDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: DiscountType, required: false })
  @IsOptional()
  @IsEnum(DiscountType)
  discountType?: DiscountType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountValue?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minOrderValue?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxDiscountAmount?: number;

  @ApiProperty({ enum: CouponStatus, required: false })
  @IsOptional()
  @IsEnum(CouponStatus)
  status?: CouponStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  validUntil?: string | Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  usageLimit?: number;
}

export class ToggleCouponStatusDto {
  @ApiProperty({ enum: CouponStatus, example: CouponStatus.PAUSED })
  @IsEnum(CouponStatus)
  status: CouponStatus;
}

export class ValidateCouponDto {
  @ApiProperty({ example: 'LUXE10' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 1999 })
  @IsNumber()
  @Min(0)
  subtotal: number;
}
