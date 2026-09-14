import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { CreateOrderDto } from './orders.dto';

export interface OrderRecord {
  id: string;
  orderNumber: string;
  customer: any;
  items: any[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED';
  orderStatus: 'CONFIRMED' | 'PROCESSING' | 'DISPATCHED' | 'DELIVERED';
  awbNumber: string;
  carrier: string;
  createdAt: string;
  freeGifts: string[];
}

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  private ordersStore = new Map<string, OrderRecord>();

  async create(dto: CreateOrderDto): Promise<OrderRecord> {
    const orderNumber = `SEN-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const id = `ord_${Math.random().toString(36).substring(2, 10)}`;
    const awbNumber = `BD${Math.floor(100000000 + Math.random() * 900000000)}IN`;

    const order: OrderRecord = {
      id,
      orderNumber,
      customer: dto.customer,
      items: dto.items,
      subtotal: dto.subtotal,
      discount: dto.discount,
      couponCode: dto.couponCode,
      shippingFee: dto.shippingFee,
      total: dto.total,
      paymentMethod: dto.paymentMethod,
      paymentStatus: dto.paymentMethod === 'razorpay' ? 'PAID' : 'PENDING',
      orderStatus: 'CONFIRMED',
      awbNumber,
      carrier: 'Blue Dart Luxury Priority Express',
      createdAt: new Date().toISOString(),
      freeGifts: dto.freeGifts || [],
    };

    this.ordersStore.set(id, order);
    this.ordersStore.set(orderNumber, order);

    this.logger.log(`New Order Placed: ${orderNumber} | Total: ₹${dto.total} | Method: ${dto.paymentMethod}`);
    return order;
  }

  async findOne(idOrNumber: string): Promise<OrderRecord> {
    const order = this.ordersStore.get(idOrNumber);
    if (!order) {
      throw new NotFoundException(`Order not found: ${idOrNumber}`);
    }
    return order;
  }
}
