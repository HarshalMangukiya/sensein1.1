import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Banner, BannerDocument } from './banner.schema';
import { Showcase, ShowcaseDocument } from './showcase.schema';
import { BeforeAfter, BeforeAfterDocument } from './before-after.schema';
import { UpdateBannerDto, UpdateShowcaseDto, UpdateBeforeAfterDto } from './content.dto';

export const DEFAULT_HERO_BANNER = {
  key: 'hero-banner',
  badge: '',
  title: 'SALON LUXURY RE-ENGINEERED',
  subtitle:
    'High-performance botanical formulas crafted with clean ingredients for Indian hair textures.',
  ctaText: 'EXPLORE COLLECTION',
  ctaLink: '/shop',
  imageUrl:
    'https://res.cloudinary.com/dqddawu42/image/upload/v1789820352/sensein/hero/sensein-perfume-bottle.jpg',
  overlayDarkness: 40,
  textAlign: 'center',
  showArc: true,
  isActive: true,
};

export const DEFAULT_SHOWCASE_CONFIG = {
  key: 'real-results-showcase',
  badge: 'REAL PEOPLE REAL RESULTS',
  title: 'REAL PEOPLE. REAL RESULTS.',
  subtitle: 'Experience salon-grade transformations verified by clinical hair specialists.',
  mode: 'custom',
  autoRotate: true,
  rotationIntervalMs: 2500,
  cards: [
    {
      id: 'media-card-1',
      mediaType: 'image',
      image:
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792479863/sensein/products/sensein-hair-wax-1.jpg',
      mediaUrl:
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792479863/sensein/products/sensein-hair-wax-1.jpg',
    },
    {
      id: 'media-card-2',
      mediaType: 'image',
      image:
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792479865/sensein/products/sensein-hair-wax-2.jpg',
      mediaUrl:
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792479865/sensein/products/sensein-hair-wax-2.jpg',
    },
    {
      id: 'media-card-3',
      mediaType: 'image',
      image:
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792479866/sensein/products/sensein-hair-wax-3.jpg',
      mediaUrl:
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792479866/sensein/products/sensein-hair-wax-3.jpg',
    },
    {
      id: 'media-card-4',
      mediaType: 'image',
      image:
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792479867/sensein/products/sensein-hair-wax-4.jpg',
      mediaUrl:
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792479867/sensein/products/sensein-hair-wax-4.jpg',
    },
    {
      id: 'media-card-5',
      mediaType: 'image',
      image:
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792479863/sensein/products/sensein-hair-wax-1.jpg',
      mediaUrl:
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792479863/sensein/products/sensein-hair-wax-1.jpg',
    },
  ],
};

export const DEFAULT_BEFORE_AFTER_CONFIG = {
  key: 'before-after-section',
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
};

@Injectable()
export class ContentService implements OnModuleInit {
  private readonly logger = new Logger(ContentService.name);
  private cachedHeroBanner: any = { ...DEFAULT_HERO_BANNER };
  private cachedShowcase: any = { ...DEFAULT_SHOWCASE_CONFIG };
  private cachedBeforeAfter: any = { ...DEFAULT_BEFORE_AFTER_CONFIG };

  constructor(
    @InjectModel(Banner.name)
    private readonly bannerModel: Model<BannerDocument>,
    @InjectModel(Showcase.name)
    private readonly showcaseModel: Model<ShowcaseDocument>,
    @InjectModel(BeforeAfter.name)
    private readonly beforeAfterModel: Model<BeforeAfterDocument>,
  ) {}

  async onModuleInit() {
    // 1. Seed or sanitize hero banner
    try {
      const existingBanner = await this.bannerModel.findOne({ key: 'hero-banner' });
      if (!existingBanner) {
        this.logger.log('Seeding initial SENSEIN luxury hero banner in MongoDB...');
        await this.bannerModel.create(DEFAULT_HERO_BANNER);
      } else {
        if (
          (existingBanner.imageUrl && existingBanner.imageUrl.includes('sensein-hair-wax-1.jpg')) ||
          (existingBanner.title && existingBanner.title.includes('HAUTE SALON')) ||
          (existingBanner.ctaText && existingBanner.ctaText.includes('STYLING WAX'))
        ) {
          Object.assign(existingBanner, DEFAULT_HERO_BANNER);
          await existingBanner.save();
        }
        this.cachedHeroBanner = existingBanner.toObject ? existingBanner.toObject() : existingBanner;
      }
    } catch (err: any) {
      this.logger.warn(`Hero banner initialization notice: ${err.message}`);
    }

    // 2. Seed showcase deck
    try {
      const existingShowcase = await this.showcaseModel.findOne({ key: 'real-results-showcase' });
      if (!existingShowcase) {
        this.logger.log('Seeding initial 3D Real Results Showcase deck in MongoDB...');
        await this.showcaseModel.create(DEFAULT_SHOWCASE_CONFIG);
      } else {
        this.cachedShowcase = existingShowcase.toObject ? existingShowcase.toObject() : existingShowcase;
      }
    } catch (err: any) {
      this.logger.warn(`Showcase deck initialization notice: ${err.message}`);
    }

    // 3. Seed Before & After transformations section
    try {
      const existingBeforeAfter = await this.beforeAfterModel.findOne({ key: 'before-after-section' });
      if (!existingBeforeAfter) {
        this.logger.log('Seeding initial Before & After Transformations in MongoDB...');
        await this.beforeAfterModel.create(DEFAULT_BEFORE_AFTER_CONFIG);
      } else {
        this.cachedBeforeAfter = existingBeforeAfter.toObject ? existingBeforeAfter.toObject() : existingBeforeAfter;
      }
    } catch (err: any) {
      this.logger.warn(`Before & After section initialization notice: ${err.message}`);
    }
  }

  // --- HERO BANNER ---
  async getHeroBanner(): Promise<any> {
    try {
      const found = await this.bannerModel.findOne({ key: 'hero-banner' }).lean();
      if (found) {
        if (
          ((found as any).imageUrl && (found as any).imageUrl.includes('sensein-hair-wax-1.jpg')) ||
          ((found as any).title && (found as any).title.includes('HAUTE SALON')) ||
          ((found as any).ctaText && (found as any).ctaText.includes('STYLING WAX'))
        ) {
          await this.bannerModel.updateOne(
            { key: 'hero-banner' },
            { $set: DEFAULT_HERO_BANNER }
          );
          this.cachedHeroBanner = { ...DEFAULT_HERO_BANNER };
          return this.cachedHeroBanner;
        }
        this.cachedHeroBanner = found as any;
        return found;
      }
    } catch (err: any) {
      this.logger.warn(`Failed to fetch hero banner from MongoDB, returning fallback: ${err.message}`);
    }
    return this.cachedHeroBanner;
  }

  async updateHeroBanner(dto: UpdateBannerDto): Promise<any> {
    const payload = {
      ...dto,
      key: 'hero-banner',
    };

    try {
      const updated = await this.bannerModel
        .findOneAndUpdate(
          { key: 'hero-banner' },
          { $set: payload },
          { new: true, upsert: true }
        )
        .lean();

      if (updated) {
        this.cachedHeroBanner = updated as any;
        this.logger.log('Hero banner updated successfully in MongoDB Atlas');
        return updated;
      }
    } catch (err: any) {
      this.logger.warn(`Failed to update hero banner in MongoDB: ${err.message}`);
    }

    this.cachedHeroBanner = {
      ...this.cachedHeroBanner,
      ...payload,
    };
    return this.cachedHeroBanner;
  }

  // --- 3D PRODUCT SHOWCASE DECK ---
  async getShowcase(): Promise<any> {
    try {
      const found = await this.showcaseModel.findOne({ key: 'real-results-showcase' }).lean();
      if (found && Array.isArray((found as any).cards) && (found as any).cards.length > 0) {
        if ((found as any).cards.length === 4) {
          const fifthCard = {
            id: 'media-card-5',
            mediaType: 'image',
            image:
              'https://res.cloudinary.com/dqddawu42/image/upload/v1792479863/sensein/products/sensein-hair-wax-1.jpg',
            mediaUrl:
              'https://res.cloudinary.com/dqddawu42/image/upload/v1792479863/sensein/products/sensein-hair-wax-1.jpg',
          };
          const updatedCards = [...(found as any).cards, fifthCard];
          await this.showcaseModel.updateOne(
            { key: 'real-results-showcase' },
            { $set: { cards: updatedCards } }
          );
          (found as any).cards = updatedCards;
        }
        this.cachedShowcase = found as any;
        return found;
      }
    } catch (err: any) {
      this.logger.warn(`Failed to fetch 3D showcase from MongoDB, returning fallback: ${err.message}`);
    }
    return this.cachedShowcase;
  }

  async updateShowcase(dto: UpdateShowcaseDto): Promise<any> {
    const payload = {
      ...dto,
      key: 'real-results-showcase',
    };

    try {
      const updated = await this.showcaseModel
        .findOneAndUpdate(
          { key: 'real-results-showcase' },
          { $set: payload },
          { new: true, upsert: true }
        )
        .lean();

      if (updated) {
        this.cachedShowcase = updated as any;
        this.logger.log('3D Showcase deck updated successfully in MongoDB Atlas');
        return updated;
      }
    } catch (err: any) {
      this.logger.warn(`Failed to update 3D showcase in MongoDB: ${err.message}`);
    }

    this.cachedShowcase = {
      ...this.cachedShowcase,
      ...payload,
    };
    return this.cachedShowcase;
  }

  // --- BEFORE & AFTER TRANSFORMATIONS ---
  async getBeforeAfter(): Promise<any> {
    try {
      const found = await this.beforeAfterModel
        .findOne({ key: 'before-after-section' })
        .lean();
      if (found) {
        this.cachedBeforeAfter = found as any;
        return found;
      }
    } catch (err: any) {
      this.logger.warn(`Failed to fetch Before & After from MongoDB: ${err.message}`);
    }
    return this.cachedBeforeAfter;
  }

  async updateBeforeAfter(dto: UpdateBeforeAfterDto): Promise<any> {
    const payload = {
      ...dto,
      key: 'before-after-section',
    };

    try {
      const updated = await this.beforeAfterModel
        .findOneAndUpdate(
          { key: 'before-after-section' },
          { $set: payload },
          { new: true, upsert: true }
        )
        .lean();

      if (updated) {
        this.cachedBeforeAfter = updated as any;
        this.logger.log('Before & After section updated successfully in MongoDB Atlas');
        return updated;
      }
    } catch (err: any) {
      this.logger.warn(`Failed to update Before & After in MongoDB: ${err.message}`);
    }

    this.cachedBeforeAfter = {
      ...this.cachedBeforeAfter,
      ...payload,
    };
    return this.cachedBeforeAfter;
  }
}
