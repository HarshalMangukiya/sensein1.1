import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/+$/, '');

const DEFAULT_ANNOUNCEMENT_DATA = {
  key: 'announcement-bar',
  isActive: true,
  speedSeconds: 30,
  separator: '✦',
  backgroundColor: '#432542',
  textColor: '#FFFFFF',
  items: [
    { id: 'ticker-1', text: 'FIRST ORDER', isTag: true, link: '' },
    { id: 'ticker-2', text: 'COMPLIMENTARY LUXURY TRAVEL SERUM ON ORDERS ABOVE ₹1,999', isTag: false, link: '' },
    { id: 'ticker-3', text: '🌿 100% CLEAN FORMULATION DERMATOLOGICALLY TESTED FREE PAN-INDIA SHIPPING', isTag: false, link: '' },
    { id: 'ticker-4', text: '⚡ USE CODE: LUXE10 FOR EXTRA PRIVILEGE DISCOUNT', isTag: false, link: '' },
    { id: 'ticker-5', text: '🧪 LIVE PAYMENT VERIFICATION: ₹1 TEST ITEM AVAILABLE IN CATALOG', isTag: false, link: '' },
    { id: 'ticker-6', text: 'PARISIAN BOTANICAL CELLULAR HAIR ARCHITECTURE', isTag: false, link: '' },
    { id: 'ticker-7', text: '✨ PAN-INDIA EXPRESS DISPATCH ON ORDERS ABOVE ₹499', isTag: false, link: '' },
  ],
};

let cachedAnnouncement: any = null;

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(`${API_BASE_URL}/content/announcements`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      cachedAnnouncement = data;
      return NextResponse.json(data);
    }
  } catch (e) {
    // Backend offline fallback
  }

  if (cachedAnnouncement) {
    return NextResponse.json(cachedAnnouncement);
  }

  return NextResponse.json(DEFAULT_ANNOUNCEMENT_DATA);
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    cachedAnnouncement = body;

    const authHeader = req.headers.get('authorization') || '';
    try {
      const res = await fetch(`${API_BASE_URL}/content/announcements`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const data = await res.json();
        cachedAnnouncement = data;
        return NextResponse.json(data);
      }
    } catch (e) {
      // Backend offline fallback
    }

    return NextResponse.json(body);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
