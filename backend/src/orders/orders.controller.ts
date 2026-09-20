import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './orders.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Place a new luxury order' })
  @ApiResponse({ status: 201, description: 'Order successfully created and stored in MongoDB' })
  async create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders from MongoDB (Admin Console)' })
  async findAll() {
    return this.ordersService.findAll();
  }

  @Get('user/:userIdOrEmail')
  @ApiOperation({ summary: 'Get all orders for a specific user ID or email from MongoDB' })
  async findByUser(@Param('userIdOrEmail') userIdOrEmail: string) {
    return this.ordersService.findByUser(userIdOrEmail);
  }

  @Get(':idOrNumber')
  @ApiOperation({ summary: 'Get order details by order ID or Order Number from MongoDB' })
  async findOne(@Param('idOrNumber') idOrNumber: string) {
    return this.ordersService.findOne(idOrNumber);
  }

  @Patch(':idOrNumber/status')
  @ApiOperation({ summary: 'Update order status in MongoDB Atlas' })
  async updateStatus(
    @Param('idOrNumber') idOrNumber: string,
    @Body('status') status: string,
  ) {
    return this.ordersService.updateStatus(idOrNumber, status);
  }
}
