import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { DEFAULT_PRIVILEGE_BANNER } from '@/lib/api';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/+$/, '');

let cachedPrivilegeBanner: any = null;

export async function GET(req: NextRequest) {
  if (cachedPrivilegeBanner && cachedPrivilegeBanner.title) {
    return NextResponse.json(cachedPrivilegeBanner, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${API_BASE_URL}/content/privilege-banner`, {
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.title) {
        cachedPrivilegeBanner = data;
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

  if (cachedPrivilegeBanner) {
    return NextResponse.json(cachedPrivilegeBanner);
  }

  return NextResponse.json(DEFAULT_PRIVILEGE_BANNER);
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    cachedPrivilegeBanner = body;

    // Purge edge cache for root page immediately
    try {
      revalidatePath('/');
      revalidateTag('privilege-banner');
    } catch (_) {}

    const authHeader = req.headers.get('authorization') || '';
    try {
      const res = await fetch(`${API_BASE_URL}/content/privilege-banner`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const data = await res.json();
        cachedPrivilegeBanner = data;
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
