import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty({ example: 'guest@sensein-luxe.com', description: 'Customer email address' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty()
  email: string;
}

export class VerifyOtpDto {
  @ApiProperty({ example: 'guest@sensein-luxe.com', description: 'Customer email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456', description: '6-digit OTP code' })
  @IsString()
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  otp: string;
}
