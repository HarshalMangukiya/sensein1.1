import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { RedisService } from '../redis/redis.service';
import * as nodemailer from 'nodemailer';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private transporter: nodemailer.Transporter | null = null;
  private readonly jwtSecret = process.env.JWT_SECRET || 'sensein_luxury_secret_key_2026_paris';
  private usersStore = new Map<string, any>();

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly redisService: RedisService,
  ) {
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
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const ttl = 300;

    await this.redisService.set(`otp:${normalizedEmail}`, otp, ttl);

    const emailHtml = `
      <div style="font-family: 'Playfair Display', Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #FAF7F5; color: #1A1A1A;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #5A3859; letter-spacing: 0.2em; font-size: 24px; margin: 0;">SENSEIN</h1>
          <p style="letter-spacing: 0.3em; font-size: 11px; color: #6E6E6E; margin-top: 4px;">PROFESSIONAL • PARIS</p>
        </div>
        <div style="background-color: #FFFFFF; border: 1px solid #EAE5E0; padding: 32px; border-radius: 4px; text-align: center;">
          <h2 style="font-size: 20px; font-weight: 500; color: #1A1A1A; margin-bottom: 12px;">Your Luxury Access Code</h2>
          <p style="color: #6E6E6E; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
            Please enter the following one-time verification code to securely access your SENSEIN PROFESSIONAL ritual account:
          </p>
          <div style="display: inline-block; background-color: #5A3859; color: #FFFFFF; font-size: 32px; font-weight: 700; letter-spacing: 8px; padding: 14px 28px; border-radius: 2px; margin-bottom: 20px;">
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

    await this.redisService.del(`otp:${normalizedEmail}`);

    // Fetch or create user in MongoDB Atlas
    let user: any = null;
    try {
      user = await this.userModel.findOne({ email: normalizedEmail });
      if (!user) {
        const rawName = normalizedEmail.split('@')[0].replace(/[^a-zA-Z]/g, ' ');
        const name = (rawName.charAt(0).toUpperCase() + rawName.slice(1)) || 'Patron';
        user = await this.userModel.create({
          email: normalizedEmail,
          name,
          role: 'customer',
          avatarUrl: 'https://res.cloudinary.com/dqddawu42/image/upload/v1/sensein/users/default_avatar.png',
        });
        this.logger.log(`New user registered in MongoDB Atlas: ${user.email} (ID: ${user._id})`);
      }
    } catch (err) {
      this.logger.warn(`MongoDB operation failed in verifyOtp, falling back to local store: ${err.message}`);
      user = this.usersStore.get(normalizedEmail);
      if (!user) {
        const name = normalizedEmail.split('@')[0].replace(/[^a-zA-Z]/g, ' ');
        user = {
          id: 'usr_' + Math.random().toString(36).substring(2, 10),
          email: normalizedEmail,
          name: name.charAt(0).toUpperCase() + name.slice(1),
          role: 'customer',
        };
        this.usersStore.set(normalizedEmail, user);
      }
    }

    const userId = user._id ? user._id.toString() : user.id;
    const payload = { sub: userId, email: user.email, role: user.role };
    const token = jwt.sign(payload, this.jwtSecret, { expiresIn: '7d' });

    return {
      success: true,
      token,
      user: {
        id: userId,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
        phone: user.phone,
      },
    };
  }

  async getProfile(userId: string): Promise<any> {
    try {
      const user = await this.userModel.findById(userId).lean();
      if (user) return { ...user, id: (user as any)._id?.toString() };
    } catch (e) {
      for (const user of this.usersStore.values()) {
        if (user.id === userId || user.email === userId) return user;
      }
    }
    return null;
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<any> {
    try {
      const updated = await this.userModel.findByIdAndUpdate(
        userId,
        { avatarUrl },
        { new: true }
      ).lean();
      return updated;
    } catch (err) {
      this.logger.error(`Failed to update avatar in MongoDB: ${err.message}`);
      return null;
    }
  }
}
