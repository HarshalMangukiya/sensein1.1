import { Controller, Post, Body, Get, Param, Patch, Query, UseGuards, Logger, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './orders.dto';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('Orders')
@Controller(['orders', 'api/orders'])
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Place a new luxury order' })
  @ApiResponse({ status: 201, description: 'Order successfully created and stored in MongoDB' })
  async create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Get()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get all orders from MongoDB with server-side search and filtering (Admin Console)' })
  @ApiQuery({ name: 'search', required: false, description: 'Search term for order ID, customer name, phone, city, or AWB' })
  @ApiQuery({ name: 'status', required: false, description: 'Status filter (ALL, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)' })
  async findAll(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Req() req?: any,
  ) {
    this.logger.log(`findAll orders called: search="${search || ''}", status="${status || ''}", origin="${req?.headers?.origin || ''}"`);
    const res = await this.ordersService.findAll({ search, status });
    this.logger.log(`findAll returning ${res.length} orders from MongoDB`);
    return res;
  }

  @Get('user/:userIdOrEmail')
  @ApiOperation({ summary: 'Get all orders for a specific user ID or email from MongoDB' })
  async findByUser(@Param('userIdOrEmail') userIdOrEmail: string) {
    return this.ordersService.findByUser(userIdOrEmail);
  }

  @Get(':idOrNumber/shipment')
  @ApiOperation({ summary: 'Get live Delhivery shipment dossier and tracking timeline for an order' })
  async getShipment(@Param('idOrNumber') idOrNumber: string) {
    return this.ordersService.getShipment(idOrNumber);
  }

  @Get(':idOrNumber')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get order details by order ID or Order Number from MongoDB' })
  async findOne(@Param('idOrNumber') idOrNumber: string) {
    return this.ordersService.findOne(idOrNumber);
  }

  @Patch(':idOrNumber/status')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update order status in MongoDB Atlas' })
  async updateStatus(
    @Param('idOrNumber') idOrNumber: string,
    @Body('status') status: string,
  ) {
    return this.ordersService.updateStatus(idOrNumber, status);
  }
}
