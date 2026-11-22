import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupon, CouponDocument, CouponStatus, DiscountType } from './coupon.schema';
import { CreateCouponDto, UpdateCouponDto, ValidateCouponDto } from './coupons.dto';

@Injectable()
export class CouponsService implements OnModuleInit {
  private readonly logger = new Logger(CouponsService.name);

  constructor(
    @InjectModel(Coupon.name)
    private readonly couponModel: Model<CouponDocument>,
  ) {}

  async onModuleInit() {
    await this.seedDefaultCoupons();
  }

  private async seedDefaultCoupons() {
    try {
      const count = await this.couponModel.countDocuments();
      if (count === 0) {
        this.logger.log('Seeding initial luxury coupon portfolio for SENSEIN...');
        const initialCoupons = [
          {
            code: 'LUXE10',
            description: '10% off on all signature botanical hair formulations',
            discountType: DiscountType.PERCENTAGE,
            discountValue: 10,
            minOrderValue: 999,
            maxDiscountAmount: 500,
            status: CouponStatus.ACTIVE,
            validUntil: new Date('2026-12-31T23:59:59.000Z'),
            usageLimit: 500,
            usageCount: 14,
            isPublic: true,
          },
          {
            code: 'SENSEIN200',
            description: 'Flat ₹200 savings on orders above ₹1,499',
            discountType: DiscountType.FIXED,
            discountValue: 200,
            minOrderValue: 1499,
            maxDiscountAmount: null,
            status: CouponStatus.ACTIVE,
            validUntil: new Date('2026-12-31T23:59:59.000Z'),
            usageLimit: 300,
            usageCount: 8,
            isPublic: true,
          },
          {
            code: 'VIP500',
            description: 'Privilege Member Offer: Flat ₹500 off on premium orders',
            discountType: DiscountType.FIXED,
            discountValue: 500,
            minOrderValue: 2500,
            maxDiscountAmount: null,
            status: CouponStatus.ACTIVE,
            validUntil: new Date('2026-12-31T23:59:59.000Z'),
            usageLimit: 150,
            usageCount: 22,
            isPublic: true,
          },
          {
            code: 'PARISFEST15',
            description: 'Limited Autumn Collection 15% promotional grant',
            discountType: DiscountType.PERCENTAGE,
            discountValue: 15,
            minOrderValue: 1800,
            maxDiscountAmount: 600,
            status: CouponStatus.PAUSED,
            validUntil: new Date('2026-11-30T23:59:59.000Z'),
            usageLimit: 200,
            usageCount: 0,
            isPublic: false,
          },
        ];

        await this.couponModel.insertMany(initialCoupons);
        this.logger.log(`Successfully seeded ${initialCoupons.length} default luxury coupons`);
      }
    } catch (err) {
      this.logger.warn(`Default coupon seed skipped: ${err?.message || err}`);
    }
  }

  async findAll(query?: { search?: string; status?: string }): Promise<CouponDocument[]> {
    const filter: any = {};

    if (query?.status && query.status !== 'ALL' && query.status !== 'all') {
      filter.status = query.status.toUpperCase();
    }

    if (query?.search && query.search.trim()) {
      const q = query.search.trim();
      filter.$or = [
        { code: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }

    return this.couponModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findOne(idOrCode: string): Promise<CouponDocument> {
    let coupon: CouponDocument | null = null;
    if (idOrCode.match(/^[0-9a-fA-F]{24}$/)) {
      coupon = await this.couponModel.findById(idOrCode).exec();
    }
    if (!coupon) {
      coupon = await this.couponModel
        .findOne({ code: idOrCode.toUpperCase().trim() })
        .exec();
    }
    if (!coupon) {
      throw new NotFoundException(`Coupon with reference '${idOrCode}' not found`);
    }
    return coupon;
  }

  async create(dto: CreateCouponDto): Promise<CouponDocument> {
    const cleanCode = dto.code.trim().toUpperCase();
    const existing = await this.couponModel.findOne({ code: cleanCode }).exec();
    if (existing) {
      throw new ConflictException(`Coupon code '${cleanCode}' already exists`);
    }

    const newCoupon = new this.couponModel({
      ...dto,
      code: cleanCode,
      status: dto.status || CouponStatus.ACTIVE,
      validUntil: dto.validUntil ? new Date(dto.validUntil) : null,
    });

    return newCoupon.save();
  }

  async update(id: string, dto: UpdateCouponDto): Promise<CouponDocument> {
    const coupon = await this.couponModel.findById(id).exec();
    if (!coupon) {
      throw new NotFoundException(`Coupon with id '${id}' not found`);
    }

    if (dto.code) {
      const cleanCode = dto.code.trim().toUpperCase();
      if (cleanCode !== coupon.code) {
        const existing = await this.couponModel.findOne({ code: cleanCode }).exec();
        if (existing) {
          throw new ConflictException(`Coupon code '${cleanCode}' is already in use`);
        }
        coupon.code = cleanCode;
      }
    }

    if (dto.description !== undefined) coupon.description = dto.description;
    if (dto.discountType !== undefined) coupon.discountType = dto.discountType;
    if (dto.discountValue !== undefined) coupon.discountValue = dto.discountValue;
    if (dto.minOrderValue !== undefined) coupon.minOrderValue = dto.minOrderValue;
    if (dto.maxDiscountAmount !== undefined) coupon.maxDiscountAmount = dto.maxDiscountAmount;
    if (dto.status !== undefined) coupon.status = dto.status;
    if (dto.validUntil !== undefined) {
      coupon.validUntil = dto.validUntil ? new Date(dto.validUntil) : (null as any);
    }
    if (dto.usageLimit !== undefined) coupon.usageLimit = dto.usageLimit;

    return coupon.save();
  }

  async toggleStatus(id: string, targetStatus?: CouponStatus): Promise<CouponDocument> {
    const coupon = await this.couponModel.findById(id).exec();
    if (!coupon) {
      throw new NotFoundException(`Coupon with id '${id}' not found`);
    }

    if (targetStatus) {
      coupon.status = targetStatus;
    } else {
      // Toggle between ACTIVE and PAUSED
      coupon.status =
        coupon.status === CouponStatus.ACTIVE
          ? CouponStatus.PAUSED
          : CouponStatus.ACTIVE;
    }

    return coupon.save();
  }

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    const result = await this.couponModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Coupon with id '${id}' not found`);
    }
    return { success: true, message: `Coupon '${result.code}' removed successfully` };
  }

  async validateCoupon(dto: ValidateCouponDto): Promise<{
    valid: boolean;
    code: string;
    description: string;
    discountType: string;
    discountValue: number;
    discountAmount: number;
    finalTotal: number;
    message?: string;
  }> {
    const cleanCode = dto.code?.trim().toUpperCase();
    if (!cleanCode) {
      throw new BadRequestException('Please enter a valid coupon code');
    }

    const coupon = await this.couponModel.findOne({ code: cleanCode }).exec();
    if (!coupon) {
      throw new NotFoundException(`Coupon code '${cleanCode}' is invalid`);
    }

    // Check status: PAUSED or EXPIRED
    if (coupon.status === CouponStatus.PAUSED) {
      throw new BadRequestException(`Coupon code '${cleanCode}' is currently paused and cannot be applied`);
    }

    if (coupon.status === CouponStatus.EXPIRED) {
      throw new BadRequestException(`Coupon code '${cleanCode}' has expired`);
    }

    // Check date expiration if set
    if (coupon.validUntil && new Date() > new Date(coupon.validUntil)) {
      coupon.status = CouponStatus.EXPIRED;
      await coupon.save();
      throw new BadRequestException(`Coupon code '${cleanCode}' has expired`);
    }

    // Check usage limits if set
    if (coupon.usageLimit > 0 && coupon.usageCount >= coupon.usageLimit) {
      throw new BadRequestException(`Coupon code '${cleanCode}' redemption limit has been reached`);
    }

    // Check min cart value
    const subtotal = Number(dto.subtotal) || 0;
    if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
      throw new BadRequestException(
        `Coupon '${cleanCode}' requires a minimum cart value of ₹${coupon.minOrderValue.toLocaleString('en-IN')}`,
      );
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.discountType === DiscountType.PERCENTAGE) {
      discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscountAmount && coupon.maxDiscountAmount > 0) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
      }
    } else {
      discountAmount = Math.min(coupon.discountValue, subtotal);
    }

    const finalTotal = Math.max(0, subtotal - discountAmount);

    return {
      valid: true,
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
      finalTotal,
      message: `Coupon '${coupon.code}' applied successfully! Savings: ₹${discountAmount}`,
    };
  }
}
