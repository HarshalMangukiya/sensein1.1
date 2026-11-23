import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BannerSlideDto {
  @ApiPropertyOptional({ example: 'slide-1' })
  id?: string;

  @ApiPropertyOptional({ example: 'OFFICIAL SENSEIN® PARIS' })
  badge?: string;

  @ApiProperty({ example: 'SALON LUXURY RE-ENGINEERED' })
  title: string;

  @ApiProperty({
    example:
      'High-performance botanical formulas crafted with clean ingredients for Indian hair textures.',
  })
  subtitle: string;

  @ApiPropertyOptional({ example: 'EXPLORE COLLECTION' })
  ctaText?: string;

  @ApiPropertyOptional({ example: '/shop' })
  ctaLink?: string;

  @ApiProperty({
    example:
      'https://res.cloudinary.com/dqddawu42/image/upload/v1789820352/sensein/hero/sensein-perfume-bottle.jpg',
  })
  imageUrl: string;

  @ApiPropertyOptional({ example: 40 })
  overlayDarkness?: number;

  @ApiPropertyOptional({ example: 'center' })
  textAlign?: string;

  @ApiPropertyOptional({ example: true })
  isActive?: boolean;
}

export class UpdateBannerDto {
  @ApiPropertyOptional({ example: 'OFFICIAL SENSEIN® PARIS' })
  badge?: string;

  @ApiProperty({ example: 'SALON LUXURY RE-ENGINEERED' })
  title: string;

  @ApiProperty({
    example:
      'High-performance botanical formulas crafted with clean ingredients for Indian hair textures.',
  })
  subtitle: string;

  @ApiPropertyOptional({ example: 'EXPLORE COLLECTION' })
  ctaText?: string;

  @ApiPropertyOptional({ example: '/shop' })
  ctaLink?: string;

  @ApiProperty({
    example:
      'https://res.cloudinary.com/dqddawu42/image/upload/v1789820352/sensein/hero/sensein-perfume-bottle.jpg',
  })
  imageUrl: string;

  @ApiPropertyOptional({ example: 40 })
  overlayDarkness?: number;

  @ApiPropertyOptional({ example: 'center' })
  textAlign?: string;

  @ApiPropertyOptional({ example: true })
  showArc?: boolean;

  @ApiPropertyOptional({ example: true })
  isActive?: boolean;

  @ApiPropertyOptional({ type: [BannerSlideDto] })
  slides?: BannerSlideDto[];

  @ApiPropertyOptional({ example: true })
  autoplay?: boolean;

  @ApiPropertyOptional({ example: 5 })
  autoplayIntervalSeconds?: number;
}

export class UpdatePrivilegeBannerDto {
  @ApiPropertyOptional({ example: 'Privilege Unlocks' })
  badge?: string;

  @ApiProperty({ example: 'Luxury Tier Gifts with Every Order' })
  title: string;

  @ApiProperty({
    example:
      'Unlock complimentary deluxe samples at ₹999, our Rosewood & Velvet Travel Pouch at ₹1,999, and a Full-Size French Plum Elixir (₹1,499 value) at ₹2,999.',
  })
  subtitle: string;

  @ApiPropertyOptional({ example: 'Start Curating Your Bag' })
  ctaText?: string;

  @ApiPropertyOptional({ example: '/shop' })
  ctaLink?: string;

  @ApiPropertyOptional({ example: '#5A3859' })
  backgroundColor?: string;

  @ApiPropertyOptional({ example: '#FFFFFF' })
  textColor?: string;

  @ApiPropertyOptional({ example: true })
  isActive?: boolean;
}

export class ShowcaseCardDto {
  @ApiProperty({ example: 'card-1' })
  id: string;

  @ApiPropertyOptional({ example: 'image', enum: ['image', 'video'] })
  mediaType?: string;

  @ApiPropertyOptional({ example: 'https://res.cloudinary.com/.../video.mp4' })
  videoUrl?: string;

  @ApiPropertyOptional({ example: 'https://res.cloudinary.com/...' })
  mediaUrl?: string;

  @ApiPropertyOptional({ example: 'hair-wax' })
  productId?: string;

  @ApiPropertyOptional({ example: 'hair-wax' })
  productSlug?: string;

  @ApiPropertyOptional({ example: 'HAIR WAX • SHINE FINISH' })
  tag?: string;

  @ApiPropertyOptional({ example: 4.9 })
  rating?: number;

  @ApiPropertyOptional({ example: 'SENSEIN® Hair Wax (100g Jar)' })
  name?: string;

  @ApiPropertyOptional({ example: 0 })
  price?: number;

  @ApiPropertyOptional({ example: 0 })
  mrp?: number;

  @ApiPropertyOptional({ example: 'https://res.cloudinary.com/...' })
  image?: string;

  @ApiPropertyOptional({ example: '/shop' })
  href?: string;
}

export class UpdateShowcaseDto {
  @ApiPropertyOptional({ example: 'REAL PEOPLE REAL RESULTS' })
  badge?: string;

  @ApiPropertyOptional({ example: 'REAL PEOPLE. REAL RESULTS.' })
  title?: string;

  @ApiPropertyOptional({
    example: 'Experience salon-grade transformations verified by clinical hair specialists.',
  })
  subtitle?: string;

  @ApiPropertyOptional({ example: 'single-product' })
  mode?: string;

  @ApiPropertyOptional({ example: 'hair-wax' })
  selectedProductId?: string;

  @ApiProperty({ type: [ShowcaseCardDto] })
  cards: ShowcaseCardDto[];

  @ApiPropertyOptional({ example: true })
  autoRotate?: boolean;

  @ApiPropertyOptional({ example: 2000 })
  rotationIntervalMs?: number;
}

export class BeforeAfterItemDto {
  @ApiProperty({ example: 'frizz-defense' })
  id: string;

  @ApiProperty({ example: 'https://res.cloudinary.com/.../before.jpg' })
  beforeImage: string;

  @ApiProperty({ example: 'https://res.cloudinary.com/.../after.jpg' })
  afterImage: string;

  @ApiPropertyOptional({ example: 50 })
  initialPos?: number;
}

export class UpdateBeforeAfterDto {
  @ApiPropertyOptional({ example: "DIGITS DON'T LIE" })
  title?: string;

  @ApiPropertyOptional({ example: '98%' })
  stat1Value?: string;

  @ApiPropertyOptional({ example: 'Frizz Control Index' })
  stat1Label?: string;

  @ApiPropertyOptional({ example: '+140%' })
  stat2Value?: string;

  @ApiPropertyOptional({ example: 'Mirror Gloss Radiance' })
  stat2Label?: string;

  @ApiPropertyOptional({ example: '24h' })
  stat3Value?: string;

  @ApiPropertyOptional({ example: 'Humidity Shield Hold' })
  stat3Label?: string;

  @ApiPropertyOptional({ example: '*based on Independent Clinical Studies, 2026' })
  disclaimer?: string;

  @ApiProperty({ type: [BeforeAfterItemDto] })
  items: BeforeAfterItemDto[];

  @ApiPropertyOptional({ example: true })
  isActive?: boolean;
}

export class AnnouncementItemDto {
  @ApiProperty({ example: 'ticker-1' })
  id: string;

  @ApiProperty({ example: '⚡ USE CODE: LUXE10 FOR EXTRA PRIVILEGE DISCOUNT' })
  text: string;

  @ApiPropertyOptional({ example: false })
  isTag?: boolean;

  @ApiPropertyOptional({ example: '' })
  link?: string;
}

export class UpdateAnnouncementDto {
  @ApiPropertyOptional({ example: true })
  isActive?: boolean;

  @ApiPropertyOptional({ example: 30 })
  speedSeconds?: number;

  @ApiPropertyOptional({ example: '✦' })
  separator?: string;

  @ApiPropertyOptional({ example: '#432542' })
  backgroundColor?: string;

  @ApiPropertyOptional({ example: '#FFFFFF' })
  textColor?: string;

  @ApiProperty({ type: [AnnouncementItemDto] })
  items: AnnouncementItemDto[];
}

