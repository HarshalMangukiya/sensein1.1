import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import {
  CreateCouponDto,
  UpdateCouponDto,
  ToggleCouponStatusDto,
  ValidateCouponDto,
} from './coupons.dto';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('Coupons & Promotions')
@Controller(['coupons', 'api/coupons'])
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'List all coupons from MongoDB Atlas with optional search and status filter' })
  @ApiQuery({ name: 'search', required: false, description: 'Search query for code or description' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status (ALL, ACTIVE, PAUSED, EXPIRED)' })
  async findAll(
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.couponsService.findAll({ search, status });
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate coupon code against cart subtotal (Storefront / Checkout)' })
  @ApiResponse({ status: 200, description: 'Coupon is valid, returns calculated discount' })
  @ApiResponse({ status: 400, description: 'Coupon is invalid, paused, expired or does not meet threshold' })
  async validateCoupon(@Body() dto: ValidateCouponDto) {
    return this.couponsService.validateCoupon(dto);
  }

  @Get(':idOrCode')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get coupon details by ID or Code' })
  async findOne(@Param('idOrCode') idOrCode: string) {
    return this.couponsService.findOne(idOrCode);
  }

  @Post()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Create a new coupon (Admin Console)' })
  @ApiResponse({ status: 201, description: 'Coupon successfully registered in MongoDB' })
  async create(@Body() dto: CreateCouponDto) {
    return this.couponsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Edit an existing coupon (Admin Console)' })
  async update(@Param('id') id: string, @Body() dto: UpdateCouponDto) {
    return this.couponsService.update(id, dto);
  }

  @Patch(':id/toggle')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Toggle or set coupon status (LIVE / PAUSED)' })
  async toggleStatus(
    @Param('id') id: string,
    @Body() body?: ToggleCouponStatusDto,
  ) {
    return this.couponsService.toggleStatus(id, body?.status);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Delete a coupon (Admin Console)' })
  async delete(@Param('id') id: string) {
    return this.couponsService.delete(id);
  }
}
