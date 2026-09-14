import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ShippingService } from './shipping.service';

@ApiTags('Shipping')
@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Get('serviceability/:pincode')
  @ApiOperation({ summary: 'Check live PIN code serviceability, SLA and courier' })
  @ApiResponse({ status: 200, description: 'Serviceability details' })
  async checkServiceability(@Param('pincode') pincode: string) {
    return this.shippingService.checkServiceability(pincode);
  }

  @Post('track')
  @ApiOperation({ summary: 'Track shipment status and courier milestone events' })
  async trackShipment(@Body('trackingNumber') trackingNumber: string) {
    return this.shippingService.trackShipment(trackingNumber || 'AWB992817291');
  }
}
