import { Controller, Post, Body, Get, Param, Headers, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreateOrderDto, VerifyPaymentDto } from './payments.dto';
import { AdminGuard } from '../auth/admin.guard';

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

  @Get(':paymentId/details')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Retrieve verified Razorpay payment transaction details (Admin Console)' })
  async getPaymentDetails(@Param('paymentId') paymentId: string) {
    return this.paymentsService.getPaymentDetails(paymentId);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Razorpay payment events webhook listener' })
  async handleWebhook(
    @Body() body: any,
    @Headers('x-razorpay-signature') signature: string,
  ) {
    return this.paymentsService.handleWebhook(body, signature);
  }
}
