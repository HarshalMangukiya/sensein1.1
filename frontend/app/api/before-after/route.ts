import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

let cachedBeforeAfter: any = null;

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(`${API_BASE_URL}/content/before-after`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      cachedBeforeAfter = data;
      return NextResponse.json(data);
    }
  } catch (e) {
    // Backend offline fallback
  }

  if (cachedBeforeAfter) {
    return NextResponse.json(cachedBeforeAfter);
  }

  return NextResponse.json({
    title: "DIGITS DON'T LIE",
    stat1Value: '98%',
    stat1Label: 'Frizz Control Index',
    stat2Value: '+140%',
    stat2Label: 'Mirror Gloss Radiance',
    stat3Value: '24h',
    stat3Label: 'Humidity Shield Hold',
    disclaimer: '*based on Independent Clinical Studies, 2026',
    items: [
      {
        id: 'frizz-defense',
        beforeImage:
          'https://res.cloudinary.com/dqddawu42/image/upload/v1789820363/sensein/transformations/frizz-before.jpg',
        afterImage:
          'https://res.cloudinary.com/dqddawu42/image/upload/v1789820361/sensein/transformations/frizz-after.jpg',
        initialPos: 50,
      },
      {
        id: 'curl-moisture',
        beforeImage:
          'https://res.cloudinary.com/dqddawu42/image/upload/v1789820359/sensein/transformations/curls-before.jpg',
        afterImage:
          'https://res.cloudinary.com/dqddawu42/image/upload/v1789820358/sensein/transformations/curls-after.jpg',
        initialPos: 45,
      },
      {
        id: 'bond-repair',
        beforeImage:
          'https://res.cloudinary.com/dqddawu42/image/upload/v1789820366/sensein/transformations/men-before.jpg',
        afterImage:
          'https://res.cloudinary.com/dqddawu42/image/upload/v1789820364/sensein/transformations/men-after.jpg',
        initialPos: 50,
      },
    ],
    isActive: true,
  });
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    cachedBeforeAfter = body;

    const authHeader = req.headers.get('authorization') || '';
    try {
      const res = await fetch(`${API_BASE_URL}/content/before-after`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const data = await res.json();
        cachedBeforeAfter = data;
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
