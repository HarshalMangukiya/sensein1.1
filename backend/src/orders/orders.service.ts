import { Injectable, NotFoundException, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './order.schema';
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
export class OrdersService implements OnModuleInit {
  private readonly logger = new Logger(OrdersService.name);
  private ordersStore = new Map<string, OrderRecord>();

  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
  ) {}

  async onModuleInit() {
    try {
      const count = await this.orderModel.countDocuments();
      if (count === 0) {
        const seedOrders = [
          {
            orderNumber: 'SEN-2026-89021',
            userId: 'aarav.singhania@gmail.com',
            customer: {
              name: 'Aarav Singhania',
              email: 'aarav.singhania@gmail.com',
              phone: '+91 98201 44552',
              address: 'Penthouse 4B, Imperial Towers, Tardeo',
              city: 'Mumbai',
              state: 'Maharashtra',
              pincode: '400034',
            },
            items: [
              {
                id: 'sensein-serum-01',
                name: 'French Plum Ente Super-Gloss Hair Serum',
                price: 1499,
                quantity: 1,
                image: 'https://res.cloudinary.com/dqddawu42/image/upload/v1789820326/sensein/products/serum-1.jpg',
              },
              {
                id: 'sensein-mask-01',
                name: 'Keratin Bond Intense Restorative Hair Mask',
                price: 1999,
                quantity: 1,
                image: 'https://res.cloudinary.com/dqddawu42/image/upload/v1789820271/sensein/products/mask-1.jpg',
              },
            ],
            subtotal: 3498,
            discount: 0,
            shippingFee: 0,
            total: 3498,
            paymentMethod: 'Prepaid (Razorpay)',
            paymentStatus: 'PAID',
            orderStatus: 'DISPATCHED',
            awbNumber: 'BD982341120IN',
            carrier: 'Blue Dart Luxury Priority Express',
            freeGifts: ['Silk Hair Wrap (Complimentary)'],
          },
          {
            orderNumber: 'SEN-2026-77341',
            userId: 'meera.kapoor@outlook.com',
            customer: {
              name: 'Meera Kapoor',
              email: 'meera.kapoor@outlook.com',
              phone: '+91 98110 33214',
              address: 'A-14 Friends Colony East',
              city: 'New Delhi',
              state: 'Delhi',
              pincode: '110065',
            },
            items: [
              {
                id: 'sensein-shampoo-01',
                name: 'Biomimetic Cellular Hair Growth Shampoo',
                price: 1299,
                quantity: 2,
                image: 'https://res.cloudinary.com/dqddawu42/image/upload/v1789820330/sensein/products/shampoo-1.jpg',
              },
            ],
            subtotal: 2598,
            discount: 0,
            shippingFee: 0,
            total: 2598,
            paymentMethod: 'Prepaid (Razorpay)',
            paymentStatus: 'PAID',
            orderStatus: 'CONFIRMED',
            awbNumber: 'BD449210492IN',
            carrier: 'Blue Dart Luxury Priority Express',
            freeGifts: [],
          },
        ];
        await this.orderModel.insertMany(seedOrders);
        this.logger.log('Initial orders seeded into MongoDB Atlas.');
      }
    } catch (err: any) {
      this.logger.warn(`Failed to seed orders: ${err.message}`);
    }
  }

  async create(dto: CreateOrderDto): Promise<OrderRecord> {
    const orderNumber = `SEN-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const id = `ord_${Math.random().toString(36).substring(2, 10)}`;
    const awbNumber = `BD${Math.floor(100000000 + Math.random() * 900000000)}IN`;
    const finalUserId = dto.userId || dto.customer?.userId || (dto.customer?.email ? String(dto.customer.email).toLowerCase().trim() : undefined);

    const orderData = {
      orderNumber,
      userId: finalUserId,
      customer: {
        ...dto.customer,
        userId: finalUserId,
      },
      items: dto.items,
      subtotal: dto.subtotal,
      discount: dto.discount,
      couponCode: dto.couponCode,
      shippingFee: dto.shippingFee,
      total: dto.total,
      paymentMethod: dto.paymentMethod || 'razorpay',
      paymentStatus: (dto.paymentMethod === 'razorpay' || !dto.paymentMethod) ? 'PAID' : 'PENDING',
      orderStatus: 'CONFIRMED',
      razorpayOrderId: (dto as any).razorpayOrderId,
      razorpayPaymentId: (dto as any).razorpayPaymentId,
      awbNumber,
      carrier: 'Blue Dart Luxury Priority Express',
      freeGifts: dto.freeGifts || [],
    };

    let savedId = id;
    try {
      const createdOrder = await this.orderModel.create(orderData);
      savedId = createdOrder._id.toString();
      this.logger.log(`Order successfully stored in MongoDB Atlas: ${orderNumber} (ID: ${savedId})`);
    } catch (err: any) {
      this.logger.warn(`MongoDB order storage error: ${err.message}`);
    }

    const orderRecord: OrderRecord = {
      id: savedId,
      orderNumber,
      customer: orderData.customer,
      items: orderData.items,
      subtotal: orderData.subtotal,
      discount: orderData.discount,
      couponCode: orderData.couponCode,
      shippingFee: orderData.shippingFee,
      total: orderData.total,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentStatus as any,
      orderStatus: 'CONFIRMED',
      awbNumber,
      carrier: orderData.carrier,
      createdAt: new Date().toISOString(),
      freeGifts: orderData.freeGifts,
    };

    this.ordersStore.set(savedId, orderRecord);
    this.ordersStore.set(orderNumber, orderRecord);

    return orderRecord;
  }

  async findOne(idOrNumber: string): Promise<OrderRecord> {
    try {
      const isObjectId = idOrNumber.match(/^[0-9a-fA-F]{24}$/);
      const query: any = { $or: [{ orderNumber: idOrNumber }] };
      if (isObjectId) query.$or.push({ _id: idOrNumber });

      const dbOrder = await this.orderModel.findOne(query).lean();
      if (dbOrder) {
        return {
          ...(dbOrder as any),
          id: (dbOrder as any)._id?.toString() || idOrNumber,
        };
      }
    } catch (e) {}

    const localOrder = this.ordersStore.get(idOrNumber);
    if (!localOrder) {
      throw new NotFoundException(`Order not found: ${idOrNumber}`);
    }
    return localOrder;
  }

  async findAll(): Promise<any[]> {
    try {
      const list = await this.orderModel.find().sort({ createdAt: -1 }).lean();
      if (list && list.length > 0) {
        return list.map((ord: any) => ({
          ...ord,
          id: ord._id?.toString() || ord.orderNumber,
        }));
      }
    } catch (e) {}
    return Array.from(this.ordersStore.values());
  }

  async findByUser(userIdOrEmail: string): Promise<any[]> {
    try {
      const normalized = userIdOrEmail.toLowerCase().trim();
      const isObjectId = userIdOrEmail.match(/^[0-9a-fA-F]{24}$/);

      const conditions: any[] = [
        { 'customer.email': normalized },
        { userId: userIdOrEmail },
        { 'customer.userId': userIdOrEmail },
      ];
      if (isObjectId) {
        conditions.push({ userId: isObjectId });
      }

      const list = await this.orderModel
        .find({ $or: conditions })
        .sort({ createdAt: -1 })
        .lean();

      if (list && list.length > 0) {
        return list.map((ord: any) => ({
          ...ord,
          id: ord._id?.toString() || ord.orderNumber,
        }));
      }
    } catch (e: any) {
      this.logger.warn(`Error querying user orders from MongoDB: ${e.message}`);
    }

    const normalized = userIdOrEmail.toLowerCase().trim();
    return Array.from(this.ordersStore.values())
      .filter(
        (ord) =>
          ord.customer?.email?.toLowerCase() === normalized ||
          ord.customer?.userId === userIdOrEmail,
      )
      .reverse();
  }

  async updateStatus(idOrNumber: string, status: string): Promise<any> {
    const isObjectId = idOrNumber.match(/^[0-9a-fA-F]{24}$/);
    const query: any = { $or: [{ orderNumber: idOrNumber }] };
    if (isObjectId) query.$or.push({ _id: idOrNumber });

    const updated = await this.orderModel.findOneAndUpdate(query, { orderStatus: status }, { new: true });
    this.logger.log(`Order status updated in MongoDB Atlas: ${idOrNumber} -> ${status}`);
    return updated;
  }
}
