import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'dqddawu42';
    const apiKey = process.env.CLOUDINARY_API_KEY || '588757514664146';
    const apiSecret = process.env.CLOUDINARY_API_SECRET || 'zGJ3E4-oukgesomhK-Aoa55Gp6E';
    const folder = 'sensein/showcase';
    const timestamp = Math.floor(Date.now() / 1000);

    const stringToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

    const contentType = req.headers.get('content-type') || '';
    let fileToUpload: any = null;
    let isVideoHint = false;

    if (contentType.includes('multipart/form-data')) {
      const incomingFormData = await req.formData();
      fileToUpload = incomingFormData.get('file');
      if (fileToUpload instanceof File) {
        isVideoHint =
          fileToUpload.type.startsWith('video/') ||
          /\.(mp4|webm|mov|m4v|ogv)$/i.test(fileToUpload.name);
      }
    } else {
      const body = await req.json();
      fileToUpload = body.media;
      isVideoHint =
        typeof fileToUpload === 'string' &&
        (fileToUpload.startsWith('data:video') || /\.(mp4|webm|mov|m4v|ogv)/i.test(fileToUpload));
    }

    if (!fileToUpload) {
      return NextResponse.json(
        { success: false, error: 'Media file or data is required' },
        { status: 400 }
      );
    }

    // Use FormData for all Cloudinary uploads
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', fileToUpload);
    cloudinaryFormData.append('api_key', apiKey);
    cloudinaryFormData.append('timestamp', timestamp.toString());
    cloudinaryFormData.append('folder', folder);
    cloudinaryFormData.append('signature', signature);

    const endpoint = isVideoHint ? 'video' : 'auto';
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${endpoint}/upload`, {
      method: 'POST',
      body: cloudinaryFormData,
    });

    const data = await res.json();

    if (res.ok && data.secure_url) {
      return NextResponse.json({
        success: true,
        url: data.secure_url,
        publicId: data.public_id,
        format: data.format,
        resourceType: data.resource_type || (isVideoHint ? 'video' : 'image'),
      });
    }

    return NextResponse.json(
      { success: false, error: data?.error?.message || 'Failed to upload to Cloudinary' },
      { status: res.status || 500 }
    );
  } catch (err: any) {
    console.error('Next.js Cloudinary media upload error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error during upload' },
      { status: 500 }
    );
  }
}
