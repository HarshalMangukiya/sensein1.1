import { Injectable, Logger } from '@nestjs/common';
import { CreateBulkInquiryDto } from './inquiries.dto';

export interface BulkInquiryRecord extends CreateBulkInquiryDto {
  id: string;
  referenceCode: string;
  status: 'RECEIVED' | 'IN_REVIEW' | 'PROPOSAL_DISPATCHED';
  submittedAt: string;
}

@Injectable()
export class InquiriesService {
  private readonly logger = new Logger(InquiriesService.name);
  private inquiries: BulkInquiryRecord[] = [];

  async create(dto: CreateBulkInquiryDto): Promise<any> {
    const referenceCode = `B2B-SEN-${Math.floor(100000 + Math.random() * 900000)}`;
    const record: BulkInquiryRecord = {
      id: `inq_${Math.random().toString(36).substring(2, 10)}`,
      referenceCode,
      ...dto,
      status: 'RECEIVED',
      submittedAt: new Date().toISOString(),
    };

    this.inquiries.push(record);
    this.logger.log(`New B2B Corporate Wholesale Inquiry: ${referenceCode} from ${dto.organizationName} (${dto.contactPerson})`);

    return {
      success: true,
      referenceCode,
      message: `Thank you, ${dto.contactPerson}. Your wholesale partnership dossier has been forwarded to our Enterprise Concierge. We will get in touch within 24 hours.`,
      catalogPdfUrl: '/downloads/SENSEIN-Professional-Wholesale-Lookbook-2026.pdf',
    };
  }

  async findAll(): Promise<BulkInquiryRecord[]> {
    return this.inquiries;
  }
}
