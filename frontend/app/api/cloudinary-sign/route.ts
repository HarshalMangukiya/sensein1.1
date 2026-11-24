import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'dqddawu42';
    const apiKey = process.env.CLOUDINARY_API_KEY || '588757514664146';
    const apiSecret = process.env.CLOUDINARY_API_SECRET || 'zGJ3E4-oukgesomhK-Aoa55Gp6E';
    const folder = 'sensein/showcase';
    const timestamp = Math.floor(Date.now() / 1000);

    const body = await req.json().catch(() => ({}));
    const paramsToSign: Record<string, any> = {
      folder,
      timestamp,
      ...(body.params || {}),
    };

    // Sort parameters alphabetically as required by Cloudinary
    const sortedKeys = Object.keys(paramsToSign).sort();
    const stringToSign = sortedKeys.map((k) => `${k}=${paramsToSign[k]}`).join('&') + apiSecret;
    const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

    return NextResponse.json(
      {
        success: true,
        cloudName,
        apiKey,
        timestamp,
        folder,
        signature,
        params: paramsToSign,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (err: any) {
    console.error('Error generating Cloudinary signature (POST):', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'dqddawu42';
    const apiKey = process.env.CLOUDINARY_API_KEY || '588757514664146';
    const apiSecret = process.env.CLOUDINARY_API_SECRET || 'zGJ3E4-oukgesomhK-Aoa55Gp6E';
    const folder = 'sensein/showcase';
    const timestamp = Math.floor(Date.now() / 1000);

    // Build signature string (sorted alphabetically)
    const stringToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

    return NextResponse.json(
      {
        success: true,
        cloudName,
        apiKey,
        timestamp,
        folder,
        signature,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (err: any) {
    console.error('Error generating Cloudinary signature (GET):', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
