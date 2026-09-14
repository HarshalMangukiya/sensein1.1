import { Injectable, BadRequestException, Logger } from '@nestjs/common';

export interface PincodeServiceabilityResult {
  pincode: string;
  city: string;
  state: string;
  isServiceable: boolean;
  courierPartner: string;
  estimatedDays: number;
  estimatedDeliveryDate: string;
  codAvailable: boolean;
  prepaidAvailable: boolean;
  expressDeliveryAvailable: boolean;
  shippingCharge: number;
  freeShippingThreshold: number;
}

@Injectable()
export class ShippingService {
  private readonly logger = new Logger(ShippingService.name);

  // High fidelity directory of Indian postal codes and metropolitan logistics hubs
  private pincodeDirectory: Record<string, { city: string; state: string; metro: boolean }> = {
    // Delhi NCR
    '110001': { city: 'New Delhi (Connaught Place)', state: 'Delhi', metro: true },
    '110016': { city: 'South Delhi (Hauz Khas)', state: 'Delhi', metro: true },
    '110020': { city: 'New Delhi (Okhla)', state: 'Delhi', metro: true },
    '122001': { city: 'Gurugram', state: 'Haryana', metro: true },
    '201301': { city: 'Noida', state: 'Uttar Pradesh', metro: true },
    // Maharashtra
    '400001': { city: 'Mumbai (Fort / Colaba)', state: 'Maharashtra', metro: true },
    '400050': { city: 'Mumbai (Bandra West)', state: 'Maharashtra', metro: true },
    '400076': { city: 'Mumbai (Powai)', state: 'Maharashtra', metro: true },
    '411001': { city: 'Pune (Camp)', state: 'Maharashtra', metro: true },
    // Karnataka
    '560001': { city: 'Bengaluru (MG Road)', state: 'Karnataka', metro: true },
    '560034': { city: 'Bengaluru (Koramangala)', state: 'Karnataka', metro: true },
    '560038': { city: 'Bengaluru (Indiranagar)', state: 'Karnataka', metro: true },
    '560066': { city: 'Bengaluru (Whitefield)', state: 'Karnataka', metro: true },
    // Telangana
    '500001': { city: 'Hyderabad (Abids)', state: 'Telangana', metro: true },
    '500034': { city: 'Hyderabad (Banjara Hills)', state: 'Telangana', metro: true },
    '500081': { city: 'Hyderabad (Hitec City)', state: 'Telangana', metro: true },
    // Tamil Nadu
    '600001': { city: 'Chennai (George Town)', state: 'Tamil Nadu', metro: true },
    '600028': { city: 'Chennai (R.A. Puram)', state: 'Tamil Nadu', metro: true },
    // West Bengal
    '700001': { city: 'Kolkata (BBD Bagh)', state: 'West Bengal', metro: true },
    '700019': { city: 'Kolkata (Ballygunge)', state: 'West Bengal', metro: true },
    // Gujarat
    '380001': { city: 'Ahmedabad', state: 'Gujarat', metro: true },
    // Rajasthan
    '302001': { city: 'Jaipur', state: 'Rajasthan', metro: false },
    // Kerala
    '682001': { city: 'Kochi', state: 'Kerala', metro: false },
    // Punjab & Chandigarh
    '160017': { city: 'Chandigarh', state: 'Punjab & Haryana', metro: false },
  };

  async checkServiceability(pincode: string): Promise<PincodeServiceabilityResult> {
    const cleanPin = pincode.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      throw new BadRequestException('Please provide a valid 6-digit Indian PIN code');
    }

    const info = this.pincodeDirectory[cleanPin];
    const isMetro = info ? info.metro : ['11', '12', '40', '56', '50', '60', '70'].includes(cleanPin.substring(0, 2));
    const city = info ? info.city : `District Zone (${cleanPin.substring(0, 3)})`;
    const state = info ? info.state : this.inferState(cleanPin);

    const estimatedDays = isMetro ? 2 : 4;
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + estimatedDays);

    return {
      pincode: cleanPin,
      city,
      state,
      isServiceable: true,
      courierPartner: isMetro ? 'Blue Dart Apex Priority Air' : 'Delhivery Surface Express',
      estimatedDays,
      estimatedDeliveryDate: deliveryDate.toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
      codAvailable: true,
      prepaidAvailable: true,
      expressDeliveryAvailable: isMetro,
      shippingCharge: 0, // Free Pan-India promotion
      freeShippingThreshold: 499,
    };
  }

  async trackShipment(awbOrOrderId: string) {
    const awb = awbOrOrderId.trim();
    return {
      success: true,
      awbNumber: awb.startsWith('AWB') ? awb : `AWB_${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      carrier: 'Blue Dart Luxury Express',
      status: 'In Transit',
      currentLocation: 'New Delhi Central Sorting Hub',
      expectedDelivery: 'In 2 Business Days',
      events: [
        { status: 'Order Dispatched from SENSEIN Lab', time: 'Today, 09:30 AM', location: 'Gurugram Warehouse' },
        { status: 'Arrived at Central Hub', time: 'Today, 02:15 PM', location: 'New Delhi Air Cargo Gateway' },
        { status: 'Manifest Generated & Scanned', time: 'Today, 04:00 PM', location: 'Delhi Express Hub' },
      ],
    };
  }

  private inferState(pin: string): string {
    const prefix = pin.substring(0, 2);
    const map: Record<string, string> = {
      '11': 'Delhi',
      '12': 'Haryana',
      '13': 'Haryana',
      '14': 'Punjab',
      '15': 'Punjab',
      '16': 'Chandigarh',
      '17': 'Himachal Pradesh',
      '18': 'Jammu & Kashmir',
      '20': 'Uttar Pradesh',
      '30': 'Rajasthan',
      '38': 'Gujarat',
      '40': 'Maharashtra',
      '41': 'Maharashtra',
      '50': 'Telangana',
      '56': 'Karnataka',
      '60': 'Tamil Nadu',
      '68': 'Kerala',
      '70': 'West Bengal',
    };
    return map[prefix] || 'India';
  }
}
