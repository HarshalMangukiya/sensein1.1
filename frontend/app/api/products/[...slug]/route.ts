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

function buildTargetUrl(slugSegments: string[], req: NextRequest): string {
  const path = slugSegments.map((s) => encodeURIComponent(s)).join('/');
  const searchParams = new URLSearchParams(req.nextUrl.searchParams);
  searchParams.delete('_t');
  const qs = searchParams.toString();
  return `${BACKEND_URL}/products/${path}${qs ? `?${qs}` : ''}`;
}

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

function purgeCatalogCache() {
  try {
    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath('/admin');
    revalidatePath('/product/[id]', 'page');
  } catch {
    // Ignore revalidate errors
  }
}

async function parseJsonSafe(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { message: text };
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string[] } },
) {
  try {
    const targetUrl = buildTargetUrl(params.slug || [], req);
    const res = await fetch(targetUrl, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
    const data = await parseJsonSafe(res);
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string[] } },
) {
  try {
    const targetUrl = buildTargetUrl(params.slug || [], req);
    const body = await req.json();
    const res = await fetch(targetUrl, {
      method: 'PATCH',
      cache: 'no-store',
      headers: forwardAuthHeaders(req),
      body: JSON.stringify(body),
    });
    const data = await parseJsonSafe(res);
    if (res.ok) purgeCatalogCache();

    return NextResponse.json(data, {
      status: res.status,
      headers: NO_STORE_HEADERS,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to update product in inventory backend' },
      { status: 503, headers: NO_STORE_HEADERS },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string[] } },
) {
  try {
    const targetUrl = buildTargetUrl(params.slug || [], req);
    const res = await fetch(targetUrl, {
      method: 'DELETE',
      cache: 'no-store',
      headers: forwardAuthHeaders(req),
    });
    const data = await parseJsonSafe(res);
    if (res.ok) purgeCatalogCache();

    return NextResponse.json(data, {
      status: res.status,
      headers: NO_STORE_HEADERS,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to delete product from inventory backend' },
      { status: 503, headers: NO_STORE_HEADERS },
    );
  }
}
