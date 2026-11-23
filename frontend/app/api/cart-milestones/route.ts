import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { DEFAULT_CART_MILESTONES } from '@/lib/api';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/+$/, '');

let cachedCartMilestones: any = null;

export async function GET(req: NextRequest) {
  if (cachedCartMilestones && Array.isArray(cachedCartMilestones.tiers) && cachedCartMilestones.tiers.length > 0) {
    return NextResponse.json(cachedCartMilestones, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${API_BASE_URL}/content/cart-milestones`, {
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.tiers) && data.tiers.length > 0) {
        cachedCartMilestones = data;
        return NextResponse.json(data, {
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
          },
        });
      }
    }
  } catch (e) {
    // Backend offline / timeout fallback
  }

  if (cachedCartMilestones) {
    return NextResponse.json(cachedCartMilestones);
  }

  return NextResponse.json(DEFAULT_CART_MILESTONES);
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    cachedCartMilestones = body;

    // Purge edge cache immediately
    try {
      revalidatePath('/');
      revalidatePath('/checkout');
      revalidateTag('cart-milestones');
    } catch (_) {}

    const authHeader = req.headers.get('authorization') || '';
    try {
      const res = await fetch(`${API_BASE_URL}/content/cart-milestones`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const data = await res.json();
        cachedCartMilestones = data;
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
