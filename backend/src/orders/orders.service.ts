import { Injectable, NotFoundException, Logger, OnModuleInit, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './order.schema';
import { CreateOrderDto } from './orders.dto';
import { ShippingService } from '../shipping/shipping.service';

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
  awbNumber?: string;
  carrier?: string;
  trackingUrl?: string;
  shipment?: any;
  createdAt: string;
  freeGifts: string[];
}

@Injectable()
export class OrdersService implements OnModuleInit {
  private readonly logger = new Logger(OrdersService.name);
  private ordersStore = new Map<string, OrderRecord>();

  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    private readonly shippingService: ShippingService,
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
            orderStatus: 'CONFIRMED',
            carrier: 'Delhivery Express Priority',
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
            carrier: 'Delhivery Express Priority',
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
    const finalUserId = dto.userId || dto.customer?.userId || (dto.customer?.email ? String(dto.customer.email).toLowerCase().trim() : undefined);

    const orderData: any = {
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
      paymentStatus: (dto.paymentMethod || '').toLowerCase() === 'cod' ? 'PENDING' : ((dto.paymentMethod === 'razorpay' || !dto.paymentMethod) ? 'PAID' : 'PENDING'),
      orderStatus: 'CONFIRMED',
      razorpayOrderId: (dto as any).razorpayOrderId,
      razorpayPaymentId: (dto as any).razorpayPaymentId,
      carrier: 'Delhivery Express Priority',
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

    // Automatically attempt live Delhivery shipment manifest if order is paid or COD
    const isCod = (orderData.paymentMethod || '').toLowerCase() === 'cod';
    const shouldShip = orderData.paymentStatus === 'PAID' || isCod;

    if (shouldShip) {
      try {
        const shipRes = await this.shippingService.createShipment({
          orderNumber,
          customerName: orderData.customer?.name || 'Patron',
          address: orderData.customer?.address || '',
          pincode: orderData.customer?.pincode || '',
          city: orderData.customer?.city || '',
          state: orderData.customer?.state || '',
          phone: orderData.customer?.phone || '',
          totalAmount: orderData.total,
          items: orderData.items,
          paymentMode: isCod ? 'COD' : 'Prepaid',
          codAmount: isCod ? orderData.total : 0,
        });

        if (shipRes?.success && shipRes?.waybill) {
          orderData.awbNumber = shipRes.waybill;
          orderData.trackingUrl = shipRes.trackingUrl;
          orderData.orderStatus = 'SHIPPED';

          // Persist generated AWB into MongoDB Atlas
          try {
            await this.orderModel.findByIdAndUpdate(savedId, {
              awbNumber: shipRes.waybill,
              trackingUrl: shipRes.trackingUrl,
              orderStatus: 'SHIPPED',
            });
            this.logger.log(`Live Delhivery AWB ${shipRes.waybill} saved to MongoDB order ${orderNumber}`);
          } catch (dbErr: any) {
            this.logger.warn(`Failed to update MongoDB with AWB for order ${orderNumber}: ${dbErr.message}`);
          }
        }
      } catch (shipErr: any) {
        this.logger.warn(`Delhivery automatic shipment dispatch deferred for ${orderNumber}: ${shipErr.message}`);
      }
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
      orderStatus: orderData.orderStatus || 'CONFIRMED',
      awbNumber: orderData.awbNumber,
      carrier: orderData.carrier,
      trackingUrl: orderData.trackingUrl,
      createdAt: new Date().toISOString(),
      freeGifts: orderData.freeGifts,
    };

    this.ordersStore.set(savedId, orderRecord);
    this.ordersStore.set(orderNumber, orderRecord);

    return orderRecord;
  }

  /**
   * Get complete real-time shipment information for an order
   */
  async getShipment(idOrNumber: string): Promise<any> {
    const isObjectId = idOrNumber && idOrNumber.match(/^[0-9a-fA-F]{24}$/);
    const query: any = { $or: [{ orderNumber: idOrNumber }, { id: idOrNumber }] };
    if (isObjectId) query.$or.push({ _id: idOrNumber });

    const order = await this.orderModel.findOne(query).lean();
    if (!order) {
      throw new NotFoundException(`Order ${idOrNumber} not found.`);
    }

    if (order.awbNumber) {
      const tracking = await this.shippingService.trackShipment(order.awbNumber);
      return {
        orderId: order.orderNumber,
        awb: order.awbNumber,
        courier: tracking.courier || order.carrier || 'Delhivery Express Priority',
        status: tracking.status || order.orderStatus || 'In Transit',
        trackingUrl: tracking.trackingUrl || `https://www.delhivery.com/track/package/${order.awbNumber}`,
        currentLocation: tracking.currentLocation || null,
        estimatedDelivery: tracking.estimatedDelivery || null,
        origin: tracking.origin || null,
        destination: tracking.destination || null,
        message: tracking.message || (tracking.events?.length ? 'In Transit' : 'Shipment created. Tracking updates will appear after the first scan.'),
        events: tracking.events || [],
        lastSyncedAt: new Date(),
      };
    }

    return {
      orderId: order.orderNumber,
      awb: null,
      courier: order.carrier || 'Delhivery Express Priority',
      status: order.orderStatus || 'Order Confirmed',
      trackingUrl: null,
      currentLocation: null,
      estimatedDelivery: null,
      message: 'Shipment tracking is not available yet.',
      events: [],
    };
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

  async findAll(filter?: { search?: string; status?: string }): Promise<any[]> {
    try {
      const query: any = {};

      if (filter?.status && filter.status.toUpperCase() !== 'ALL') {
        const s = filter.status.trim().toUpperCase();
        if (s === 'SHIPPED') {
          query.orderStatus = { $in: ['SHIPPED', 'DISPATCHED', 'shipped', 'dispatched'] };
        } else {
          query.orderStatus = { $regex: new RegExp(`^${s}$`, 'i') };
        }
      }

      if (filter?.search && filter.search.trim() !== '') {
        const term = filter.search.trim();
        const regex = { $regex: term, $options: 'i' };
        const searchConditions: any[] = [
          { orderNumber: regex },
          { awbNumber: regex },
          { 'customer.name': regex },
          { 'customer.phone': regex },
          { 'customer.city': regex },
          { 'customer.email': regex },
        ];
        if (term.match(/^[0-9a-fA-F]{24}$/)) {
          searchConditions.push({ _id: term });
        }
        query.$or = searchConditions;
      }

      const list = await this.orderModel.find(query).sort({ createdAt: -1 }).lean();
      if (list && list.length > 0) {
        return list.map((ord: any) => ({
          ...ord,
          id: ord._id?.toString() || ord.orderNumber,
        }));
      } else if (Object.keys(query).length > 0) {
        return [];
      }
    } catch (e: any) {
      this.logger.warn(`Error querying orders from MongoDB Atlas: ${e.message}`);
    }

    // Fallback to in-memory store if DB is unreachable
    let result = Array.from(this.ordersStore.values());
    if (filter?.status && filter.status.toUpperCase() !== 'ALL') {
      const s = filter.status.trim().toUpperCase();
      result = result.filter((o) => {
        const ordStatus = (o.orderStatus || '').toUpperCase();
        return s === 'SHIPPED'
          ? ordStatus === 'SHIPPED' || ordStatus === 'DISPATCHED'
          : ordStatus === s;
      });
    }
    if (filter?.search && filter.search.trim() !== '') {
      const term = filter.search.trim().toLowerCase();
      result = result.filter(
        (o) =>
          (o.orderNumber || '').toLowerCase().includes(term) ||
          (o.awbNumber || '').toLowerCase().includes(term) ||
          (o.customer?.name || '').toLowerCase().includes(term) ||
          (o.customer?.phone || '').toLowerCase().includes(term) ||
          (o.customer?.city || '').toLowerCase().includes(term),
      );
    }
    return result;
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

    const normalizedStatus = status.trim().toUpperCase();
    const updated = await this.orderModel.findOneAndUpdate(
      query,
      { orderStatus: normalizedStatus },
      { new: true },
    ).lean();

    if (updated) {
      this.logger.log(`Order status updated in MongoDB Atlas: ${idOrNumber} -> ${normalizedStatus}`);
      return {
        ...updated,
        id: (updated as any)._id?.toString() || (updated as any).orderNumber,
      };
    }

    // Check memory store
    const local = this.ordersStore.get(idOrNumber);
    if (local) {
      local.orderStatus = normalizedStatus as any;
      this.ordersStore.set(idOrNumber, local);
      return local;
    }

    throw new NotFoundException(`Order not found: ${idOrNumber}`);
  }
}
