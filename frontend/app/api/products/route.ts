import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const BACKEND_URL = (
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:4000'
).replace(/\/+$/, '');

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

function forwardAuthHeaders(req: NextRequest): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const auth = req.headers.get('authorization');
  const secret = req.headers.get('x-auth-secret');
  const email = req.headers.get('x-admin-email');
  if (auth) headers['Authorization'] = auth;
  if (secret) headers['x-auth-secret'] = secret;
  if (email) headers['x-admin-email'] = email;
  return headers;
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = new URLSearchParams(req.nextUrl.searchParams);
    searchParams.delete('_t');
    const qs = searchParams.toString();
    const targetUrl = `${BACKEND_URL}/products${qs ? `?${qs}` : ''}`;

    const res = await fetch(targetUrl, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });

    const text = await res.text();
    let data: any;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text };
    }

    return NextResponse.json(data, {
      status: res.status,
      headers: NO_STORE_HEADERS,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to connect to inventory backend' },
      { status: 503, headers: NO_STORE_HEADERS },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${BACKEND_URL}/products`, {
      method: 'POST',
      cache: 'no-store',
      headers: forwardAuthHeaders(req),
      body: JSON.stringify(body),
    });

    const text = await res.text();
    let data: any;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text };
    }

    if (res.ok) {
      try {
        revalidatePath('/');
        revalidatePath('/shop');
        revalidatePath('/admin');
      } catch {
        // Ignore revalidate errors in non-ISR contexts
      }
    }

    return NextResponse.json(data, {
      status: res.status,
      headers: NO_STORE_HEADERS,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to create product in inventory backend' },
      { status: 503, headers: NO_STORE_HEADERS },
    );
  }
}
