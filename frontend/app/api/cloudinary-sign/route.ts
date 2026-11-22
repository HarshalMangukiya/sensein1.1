import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

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

    return NextResponse.json({
      success: true,
      cloudName,
      apiKey,
      timestamp,
      folder,
      signature,
    });
  } catch (err: any) {
    console.error('Error generating Cloudinary signature:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
