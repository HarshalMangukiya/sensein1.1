import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBulkInquiryDto {
  @ApiProperty({ example: 'Salon & Spa Chain' })
  @IsString()
  @IsNotEmpty()
  distributionType: string;

  @ApiProperty({ example: 'Luxe Hair & Wellness Atelier' })
  @IsString()
  @IsNotEmpty()
  organizationName: string;

  @ApiProperty({ example: '07AAAAA0000A1Z5', required: false })
  @IsOptional()
  @IsString()
  gstin?: string;

  @ApiProperty({ example: 'Vikramaditya Mehta' })
  @IsString()
  @IsNotEmpty()
  contactPerson: string;

  @ApiProperty({ example: 'concierge@luxeatelier.in' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+91 98110 22334' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: '200-500 units' })
  @IsString()
  @IsNotEmpty()
  estimatedQuantity: string;

  @ApiProperty({ example: '2026-10-15' })
  @IsString()
  @IsNotEmpty()
  expectedDeliveryDate: string;

  @ApiProperty({ example: ['Haircare', 'Scalp Therapy', 'Amenities'] })
  @IsArray()
  productLines: string[];

  @ApiProperty({ example: 'Looking to stock SENSEIN in 8 flagship salons across Delhi and Mumbai.', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
