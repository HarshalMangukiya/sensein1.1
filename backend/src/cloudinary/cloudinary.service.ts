import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dqddawu42',
      api_key: process.env.CLOUDINARY_API_KEY || '588757514664146',
      api_secret: process.env.CLOUDINARY_API_SECRET || 'zGJ3E4-oukgesomhK-Aoa55Gp6E',
      secure: true,
    });
    this.logger.log(`Cloudinary configured for cloud: ${process.env.CLOUDINARY_CLOUD_NAME || 'dqddawu42'}`);
  }

  /**
   * Upload an image to Cloudinary (supports base64 data URI, remote URL, or file path)
   */
  async uploadImage(
    fileOrUrl: string,
    folder: string = 'sensein/general',
    tags: string[] = ['sensein']
  ): Promise<{ url: string; publicId: string; format: string }> {
    try {
      const result: UploadApiResponse = await cloudinary.uploader.upload(fileOrUrl, {
        folder,
        tags,
        transformation: [
          { quality: 'auto:best', fetch_format: 'auto' },
        ],
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
      };
    } catch (error) {
      this.logger.error(`Cloudinary upload failed: ${error.message || error}`);
      throw error;
    }
  }

  /**
   * Upload product image into sensein/products folder
   */
  async uploadProductImage(fileOrUrl: string, productSlug?: string) {
    return this.uploadImage(fileOrUrl, 'sensein/products', ['sensein', 'product', productSlug || 'item']);
  }

  /**
   * Upload user avatar into sensein/users folder
   */
  async uploadUserAvatar(fileOrUrl: string, userId?: string) {
    return this.uploadImage(fileOrUrl, 'sensein/users', ['sensein', 'user', userId || 'patron']);
  }
}
