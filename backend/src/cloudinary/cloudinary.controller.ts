import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CloudinaryService } from './cloudinary.service';

@ApiTags('Cloudinary Media Storage')
@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload-product-image')
  @ApiOperation({ summary: 'Upload a product image to Cloudinary and return secure URL' })
  @ApiResponse({ status: 200, description: 'Product image uploaded to Cloudinary' })
  async uploadProductImage(@Body() body: { image: string; productSlug?: string }) {
    if (!body.image) {
      throw new BadRequestException('Image data or URL is required');
    }
    const uploaded = await this.cloudinaryService.uploadProductImage(body.image, body.productSlug);
    return {
      success: true,
      url: uploaded.url,
      publicId: uploaded.publicId,
    };
  }

  @Post('upload-user-avatar')
  @ApiOperation({ summary: 'Upload a user avatar to Cloudinary and return secure URL' })
  @ApiResponse({ status: 200, description: 'User avatar uploaded to Cloudinary' })
  async uploadUserAvatar(@Body() body: { image: string; userId?: string }) {
    if (!body.image) {
      throw new BadRequestException('Avatar image data or URL is required');
    }
    const uploaded = await this.cloudinaryService.uploadUserAvatar(body.image, body.userId);
    return {
      success: true,
      url: uploaded.url,
      publicId: uploaded.publicId,
    };
  }
}
