import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ShippingService, DelhiveryShipmentPayload } from './shipping.service';

@ApiTags('Delhivery Logistics & Shipping')
@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Get('serviceability/:pincode')
  @ApiOperation({ summary: 'Check live PIN code serviceability via Delhivery API' })
  @ApiResponse({ status: 200, description: 'Serviceability details' })
  async checkServiceability(@Param('pincode') pincode: string) {
    return this.shippingService.checkServiceability(pincode);
  }

  @Post('create-shipment')
  @ApiOperation({ summary: 'Create Delhivery shipment, generate AWB and packing slip' })
  async createShipment(@Body() payload: DelhiveryShipmentPayload) {
    return this.shippingService.createShipment(payload);
  }

  @Get('track/:awb')
  @ApiOperation({ summary: 'Track shipment status and live scans from Delhivery API' })
  async trackByAwb(@Param('awb') awb: string) {
    return this.shippingService.trackShipment(awb);
  }

  @Post('track')
  @ApiOperation({ summary: 'Track shipment status (POST)' })
  async trackShipment(@Body('trackingNumber') trackingNumber: string) {
    return this.shippingService.trackShipment(trackingNumber || 'DEL14389201928');
  }

  @Post('request-pickup')
  @ApiOperation({ summary: 'Schedule a Delhivery courier executive pickup' })
  async requestPickup(
    @Body('pickupDate') pickupDate?: string,
    @Body('expectedCount') expectedCount?: number,
  ) {
    return this.shippingService.requestPickup(pickupDate, expectedCount);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Receive real-time tracking updates from Delhivery Webhook' })
  async webhook(@Body() body: any) {
    return this.shippingService.handleWebhook(body);
  }
}
