import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InquiriesService } from './inquiries.service';
import { CreateBulkInquiryDto } from './inquiries.dto';

@ApiTags('Corporate Inquiries')
@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Post('bulk')
  @ApiOperation({ summary: 'Submit corporate and wholesale partnership inquiry' })
  @ApiResponse({ status: 201, description: 'Inquiry received' })
  async create(@Body() dto: CreateBulkInquiryDto) {
    return this.inquiriesService.create(dto);
  }

  @Get('bulk')
  @ApiOperation({ summary: 'List all corporate wholesale inquiries (Admin)' })
  async findAll() {
    return this.inquiriesService.findAll();
  }
}
