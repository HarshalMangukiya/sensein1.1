import { Controller, Post, Body, Get, Patch, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InquiriesService } from './inquiries.service';
import { CreateBulkInquiryDto } from './inquiries.dto';

@ApiTags('Corporate Inquiries')
@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Post('bulk')
  @ApiOperation({ summary: 'Submit corporate and wholesale partnership inquiry' })
  @ApiResponse({ status: 201, description: 'Inquiry received and saved to MongoDB' })
  async create(@Body() dto: CreateBulkInquiryDto) {
    return this.inquiriesService.create(dto);
  }

  @Get('bulk')
  @ApiOperation({ summary: 'List all corporate wholesale inquiries from MongoDB (Admin)' })
  async findAll() {
    return this.inquiriesService.findAll();
  }

  @Patch('bulk/:idOrRef/status')
  @ApiOperation({ summary: 'Update status of wholesale inquiry in MongoDB' })
  async updateStatus(
    @Param('idOrRef') idOrRef: string,
    @Body('status') status: string,
  ) {
    return this.inquiriesService.updateStatus(idOrRef, status);
  }
}
