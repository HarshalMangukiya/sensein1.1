import { Controller, Post, Body, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SendOtpDto, VerifyOtpDto } from './auth.dto';
import * as jwt from 'jsonwebtoken';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('send-otp')
  @ApiOperation({ summary: 'Send 6-digit verification code to email' })
  @ApiResponse({ status: 200, description: 'OTP generated and sent' })
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto.email);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP and issue JWT access token' })
  @ApiResponse({ status: 200, description: 'Authentication successful' })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto.email, dto.otp);
  }

  @Post('admin/login')
  @ApiOperation({ summary: 'Executive Admin Login via Username / Password' })
  @ApiResponse({ status: 200, description: 'Admin authentication successful and JWT issued' })
  async adminLogin(@Body() body: { email?: string; username?: string; pass?: string; password?: string }) {
    const identifier = body.username || body.email || '';
    const pass = body.password || body.pass || '';
    return this.authService.adminLogin(identifier, pass);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get authenticated user profile' })
  async getMe(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization token required');
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'sensein_luxury_secret_key_2026_paris');
      const user = await this.authService.getProfile(decoded.sub);
      return { success: true, user: user || { id: decoded.sub, email: decoded.email, role: decoded.role } };
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
