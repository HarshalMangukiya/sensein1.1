import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreateOrderDto, VerifyPaymentDto } from './payments.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-order')
  @ApiOperation({ summary: 'Create Razorpay payment order in INR' })
  @ApiResponse({ status: 200, description: 'Order created with Razorpay Order ID' })
  async createOrder(@Body() dto: CreateOrderDto) {
    return this.paymentsService.createOrder(dto);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify Razorpay cryptographic HMAC-SHA256 signature' })
  @ApiResponse({ status: 200, description: 'Payment signature verified' })
  async verifyPayment(@Body() dto: VerifyPaymentDto) {
    return this.paymentsService.verifyPayment(dto);
  }
}
