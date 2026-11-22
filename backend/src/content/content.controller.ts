import {
  Controller,
  Get,
  Put,
  Patch,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { UpdateBannerDto, UpdateShowcaseDto, UpdateBeforeAfterDto, UpdateAnnouncementDto } from './content.dto';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('Content & Banners')
@Controller(['content', 'api/content'])
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  // --- HERO BANNER ---
  @Get(['banner', 'hero-banner'])
  @ApiOperation({ summary: 'Get active storefront hero banner configuration' })
  @ApiResponse({ status: 200, description: 'Active hero banner configuration returned' })
  async getHeroBanner() {
    return this.contentService.getHeroBanner();
  }

  @Put(['banner', 'hero-banner'])
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update storefront hero banner (Admin Authorized)' })
  @ApiResponse({ status: 200, description: 'Hero banner updated in MongoDB Atlas' })
  async updateHeroBanner(@Body() dto: UpdateBannerDto) {
    return this.contentService.updateHeroBanner(dto);
  }

  @Patch(['banner', 'hero-banner'])
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Patch storefront hero banner (Admin Authorized)' })
  async patchHeroBanner(@Body() dto: UpdateBannerDto) {
    return this.contentService.updateHeroBanner(dto);
  }

  // --- 3D PRODUCT SHOWCASE CAROUSEL ---
  @Get(['showcase', 'deck', 'real-results'])
  @ApiOperation({ summary: 'Get active 3D product showcase carousel configuration' })
  @ApiResponse({ status: 200, description: 'Showcase card deck returned' })
  async getShowcase() {
    return this.contentService.getShowcase();
  }

  @Put(['showcase', 'deck', 'real-results'])
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update 3D product showcase deck (Admin Authorized)' })
  @ApiResponse({ status: 200, description: 'Showcase deck updated in MongoDB Atlas' })
  async updateShowcase(@Body() dto: UpdateShowcaseDto) {
    return this.contentService.updateShowcase(dto);
  }

  @Patch(['showcase', 'deck', 'real-results'])
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Patch 3D product showcase deck (Admin Authorized)' })
  async patchShowcase(@Body() dto: UpdateShowcaseDto) {
    return this.contentService.updateShowcase(dto);
  }

  // --- BEFORE & AFTER TRANSFORMATIONS ---
  @Get(['before-after', 'transformations'])
  @ApiOperation({ summary: 'Get active storefront Before & After comparisons configuration' })
  @ApiResponse({ status: 200, description: 'Before & After comparison cards returned' })
  async getBeforeAfter() {
    return this.contentService.getBeforeAfter();
  }

  @Put(['before-after', 'transformations'])
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update Before & After comparisons (Admin Authorized)' })
  @ApiResponse({ status: 200, description: 'Before & After section updated in MongoDB Atlas' })
  async updateBeforeAfter(@Body() dto: UpdateBeforeAfterDto) {
    return this.contentService.updateBeforeAfter(dto);
  }

  @Patch(['before-after', 'transformations'])
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Patch Before & After comparisons (Admin Authorized)' })
  async patchBeforeAfter(@Body() dto: UpdateBeforeAfterDto) {
    return this.contentService.updateBeforeAfter(dto);
  }

  // --- ANNOUNCEMENT BAR TICKER ---
  @Get(['announcements', 'ticker', 'announcement-bar'])
  @ApiOperation({ summary: 'Get active storefront announcement ticker bar configuration' })
  @ApiResponse({ status: 200, description: 'Announcement bar config and ticker messages returned' })
  async getAnnouncements() {
    return this.contentService.getAnnouncements();
  }

  @Put(['announcements', 'ticker', 'announcement-bar'])
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update storefront announcement ticker bar (Admin Authorized)' })
  @ApiResponse({ status: 200, description: 'Announcement bar updated in MongoDB Atlas' })
  async updateAnnouncements(@Body() dto: UpdateAnnouncementDto) {
    return this.contentService.updateAnnouncements(dto);
  }

  @Patch(['announcements', 'ticker', 'announcement-bar'])
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Patch storefront announcement ticker bar (Admin Authorized)' })
  async patchAnnouncements(@Body() dto: UpdateAnnouncementDto) {
    return this.contentService.updateAnnouncements(dto);
  }
}
