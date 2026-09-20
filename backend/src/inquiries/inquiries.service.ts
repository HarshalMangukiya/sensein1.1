import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inquiry, InquiryDocument } from './inquiry.schema';
import { CreateBulkInquiryDto } from './inquiries.dto';

@Injectable()
export class InquiriesService implements OnModuleInit {
  private readonly logger = new Logger(InquiriesService.name);

  constructor(
    @InjectModel(Inquiry.name) private readonly inquiryModel: Model<InquiryDocument>,
  ) {}

  async onModuleInit() {
    try {
      const count = await this.inquiryModel.countDocuments();
      if (count === 0) {
        const seedInquiries = [
          {
            referenceCode: 'B2B-SEN-91024',
            organizationName: 'The Oberoi Spas & Luxury Salons',
            contactPerson: 'Sunita Mehra (VP Spa Operations)',
            email: 's.mehra@oberoigroup.com',
            phone: '+91 98102 77610',
            distributionType: 'Luxury Hotel / Resort Spa',
            estimatedQuantity: 'Tier 3 (500+ Units / Month)',
            status: 'In Contract',
            productLines: ['Haircare', 'Scalp Therapy', 'Amenities'],
            submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
          },
          {
            referenceCode: 'B2B-SEN-84319',
            organizationName: 'Maison De Beauté Salon Group',
            contactPerson: 'Kabir Vohra (Founder)',
            email: 'kabir@maisonbeaute.in',
            phone: '+91 98200 11984',
            distributionType: 'High-End Salon Chain (8 Branches)',
            estimatedQuantity: 'Tier 2 (200 - 500 Units)',
            status: 'Contacted',
            productLines: ['Hair Masks', 'Serums & Oils'],
            submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          },
          {
            referenceCode: 'B2B-SEN-71283',
            organizationName: 'Aura Trichology & Wellness Clinic',
            contactPerson: 'Dr. Radhika Sen',
            email: 'dr.radhika@auraclinics.com',
            phone: '+91 97401 22910',
            distributionType: 'Dermatology & Scalp Clinic',
            estimatedQuantity: 'Tier 1 (50 - 200 Units)',
            status: 'New Inquiry',
            productLines: ['Scalp Elixirs', 'Shampoos'],
            submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
          },
        ];
        await this.inquiryModel.insertMany(seedInquiries);
        this.logger.log('Initial wholesale inquiries seeded into MongoDB Atlas.');
      }
    } catch (err: any) {
      this.logger.warn(`Failed to seed inquiries: ${err.message}`);
    }
  }

  async create(dto: CreateBulkInquiryDto): Promise<any> {
    const referenceCode = `B2B-SEN-${Math.floor(100000 + Math.random() * 900000)}`;
    const newRecord = {
      ...dto,
      referenceCode,
      status: 'RECEIVED',
      submittedAt: new Date().toISOString(),
    };

    const saved = await this.inquiryModel.create(newRecord);
    this.logger.log(`New B2B Corporate Wholesale Inquiry saved to MongoDB Atlas: ${referenceCode} from ${dto.organizationName}`);

    return {
      success: true,
      referenceCode,
      id: saved._id.toString(),
      message: `Thank you, ${dto.contactPerson}. Your wholesale partnership dossier has been saved to MongoDB and forwarded to our Enterprise Concierge.`,
      catalogPdfUrl: '/downloads/SENSEIN-Professional-Wholesale-Lookbook-2026.pdf',
    };
  }

  async findAll(): Promise<any[]> {
    const docs = await this.inquiryModel.find().sort({ createdAt: -1 }).lean();
    return (docs || []).map((d: any) => ({
      ...d,
      id: d._id.toString(),
    }));
  }

  async updateStatus(idOrRef: string, status: string): Promise<any> {
    const condition = idOrRef.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: idOrRef }
      : { referenceCode: idOrRef };
    return this.inquiryModel.findOneAndUpdate(condition, { status }, { new: true });
  }
}
