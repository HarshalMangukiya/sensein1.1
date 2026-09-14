import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import * as nodemailer from 'nodemailer';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private transporter: nodemailer.Transporter | null = null;
  private readonly jwtSecret = process.env.JWT_SECRET || 'sensein_luxury_secret_key_2026';
  private usersStore = new Map<string, { id: string; email: string; name: string; role: string; createdAt: Date }>();

  constructor(private readonly redisService: RedisService) {
    this.initMailer();
  }

  private initMailer() {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = Number(process.env.SMTP_PORT) || 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
      this.logger.log(`Nodemailer configured for SMTP user: ${user}`);
    } else {
      this.logger.warn('SMTP credentials not provided in .env. Running in development mode with simulated email delivery.');
    }
  }

  async sendOtp(email: string): Promise<{ success: boolean; message: string; expiresInSeconds: number; debugOtp?: string }> {
    const normalizedEmail = email.toLowerCase().trim();
    // Generate secure 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const ttl = 300; // 5 minutes

    // Store in Redis with TTL
    await this.redisService.set(`otp:${normalizedEmail}`, otp, ttl);

    // Send email or simulate
    const emailHtml = `
      <div style="font-family: 'Playfair Display', Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #FAF7F5; color: #1A1A1A;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4A1528; letter-spacing: 0.2em; font-size: 24px; margin: 0;">SENSEIN</h1>
          <p style="letter-spacing: 0.3em; font-size: 11px; color: #6E6E6E; margin-top: 4px;">PROFESSIONAL • PARIS</p>
        </div>
        <div style="background-color: #FFFFFF; border: 1px solid #EAE5E0; padding: 32px; border-radius: 4px; text-align: center;">
          <h2 style="font-size: 20px; font-weight: 500; color: #1A1A1A; margin-bottom: 12px;">Your Luxury Access Code</h2>
          <p style="color: #6E6E6E; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
            Please enter the following one-time verification code to securely access your SENSEIN PROFESSIONAL ritual account:
          </p>
          <div style="display: inline-block; background-color: #4A1528; color: #FFFFFF; font-size: 32px; font-weight: 700; letter-spacing: 8px; padding: 14px 28px; border-radius: 2px; margin-bottom: 20px;">
            ${otp}
          </div>
          <p style="color: #8E8E8E; font-size: 12px;">This code will expire in 5 minutes (300 seconds).</p>
        </div>
        <div style="text-align: center; margin-top: 30px; color: #9E9E9E; font-size: 11px; letter-spacing: 0.05em;">
          © ${new Date().getFullYear()} SENSEIN PROFESSIONAL. Pure Botanicals • Engineered Formulations.
        </div>
      </div>
    `;

    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: `"SENSEIN PROFESSIONAL" <${process.env.SMTP_USER}>`,
          to: normalizedEmail,
          subject: `${otp} is your SENSEIN Verification Code`,
          html: emailHtml,
        });
        this.logger.log(`Live OTP sent to ${normalizedEmail}`);
      } catch (error) {
        this.logger.error(`Failed to send email via SMTP: ${error.message}`);
      }
    } else {
      this.logger.log(`[SIMULATED EMAIL] To: ${normalizedEmail} | OTP: [${otp}]`);
    }

    return {
      success: true,
      message: `Verification code sent to ${normalizedEmail}. Valid for 5 minutes.`,
      expiresInSeconds: ttl,
      debugOtp: process.env.NODE_ENV === 'production' ? undefined : otp,
    };
  }

  async verifyOtp(email: string, otp: string): Promise<{ success: boolean; token: string; user: any }> {
    const normalizedEmail = email.toLowerCase().trim();
    const storedOtp = await this.redisService.get(`otp:${normalizedEmail}`);

    if (!storedOtp) {
      throw new UnauthorizedException('Verification code has expired or was not requested. Please request a new code.');
    }

    if (storedOtp !== otp.trim()) {
      throw new UnauthorizedException('Invalid verification code. Please check and try again.');
    }

    // Clear OTP after successful verification
    await this.redisService.del(`otp:${normalizedEmail}`);

    // Fetch or create user
    let user = this.usersStore.get(normalizedEmail);
    if (!user) {
      const name = normalizedEmail.split('@')[0].replace(/[^a-zA-Z]/g, ' ');
      user = {
        id: 'usr_' + Math.random().toString(36).substring(2, 10),
        email: normalizedEmail,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        role: 'customer',
        createdAt: new Date(),
      };
      this.usersStore.set(normalizedEmail, user);
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload, this.jwtSecret, { expiresIn: '7d' });

    return {
      success: true,
      token,
      user,
    };
  }

  async getProfile(userId: string): Promise<any> {
    for (const user of this.usersStore.values()) {
      if (user.id === userId) return user;
    }
    return null;
  }
}
