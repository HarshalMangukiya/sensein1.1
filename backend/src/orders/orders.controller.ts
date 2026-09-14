import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './orders.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Place a new luxury order' })
  @ApiResponse({ status: 201, description: 'Order successfully created' })
  async create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Get(':idOrNumber')
  @ApiOperation({ summary: 'Get order details by order ID or Order Number' })
  async findOne(@Param('idOrNumber') idOrNumber: string) {
    return this.ordersService.findOne(idOrNumber);
  }
}
