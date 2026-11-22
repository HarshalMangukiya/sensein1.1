import { Injectable, NotFoundException, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  category: string;
  curatedCollection: string;
  price: number;
  mrp: number;
  discountPercentage: number;
  netVolume: string;
  variants: Array<{
    size: string;
    price: number;
    mrp: number;
    inStock: boolean;
  }>;
  rating: number;
  reviewCount: number;
  images: string[];
  badges: string[];
  inStock: boolean;
  ingredients: {
    keyActives: any[];
    fullList: string;
  };
  overview?: string;
  howToUse: Array<{
    step: number;
    title: string;
    instruction: string;
  }>;
  usageAdvice?: string;
  productDetails?: Record<string, any>;
  benefits?: string[];
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  additionalInfo?: Record<string, any>;
  reviews: Array<{
    id: string;
    author: string;
    rating: number;
    title: string;
    content: string;
    date: string;
    verifiedBuyer: boolean;
  }>;
  [key: string]: any;
}


@Injectable()
export class ProductsService implements OnModuleInit {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
  ) {}

  async onModuleInit() {
    try {
      for (const prod of this.products) {
        await this.productModel.updateOne(
          { $or: [{ id: prod.id }, { slug: prod.slug }] },
          { $set: prod },
          { upsert: true }
        );
      }
      const count = await this.productModel.countDocuments();
      this.logger.log(`MongoDB Atlas product catalog synchronized (${count} active product).`);
    } catch (err: any) {
      this.logger.warn(`MongoDB product sync notice: ${err.message}`);
    }
  }

  private products: ProductItem[] = [
    {
      id: 'sensein-hair-wax',
      name: 'Hair Wax',
      slug: 'hair-wax',
      subtitle: 'Non sticky formula, Shape, style, and shine with lasting hold!',
      description: 'A premium salon-grade styling wax crafted to shape, style, and define your look with radiant shine and lasting hold. Featuring an ultra-clean, non-sticky formula that allows effortless control and restyling throughout the day for short, medium, and long hair.',
      category: 'Hair Styling Wax',
      curatedCollection: 'Bestsellers',
      price: 249,
      mrp: 249,
      discountPercentage: 0,
      netVolume: '100g',
      variants: [
        { size: '100g', price: 249, mrp: 249, inStock: true }
      ],
      rating: 4.9,
      reviewCount: 48,
      images: [
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792479863/sensein/products/sensein-hair-wax-1.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792479865/sensein/products/sensein-hair-wax-2.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792479866/sensein/products/sensein-hair-wax-3.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792479867/sensein/products/sensein-hair-wax-4.jpg'
      ],
      badges: ['OFFICIAL SENSEIN®', 'SHINE FINISH', '100G'],
      inStock: true,
      howToUse: [
        {
          step: 1,
          title: 'Take Scoop of Wax',
          instruction: 'Take an appropriate amount of SENSEIN Hair Wax according to your hair length.'
        },
        {
          step: 2,
          title: 'Warm & Rub in Hands',
          instruction: 'Rub the wax between your hands to warm and spread it evenly.'
        },
        {
          step: 3,
          title: 'Apply Evenly on Hair',
          instruction: 'Apply evenly to your hair, including the areas you want to style.'
        },
        {
          step: 4,
          title: 'Shape & Adjust',
          instruction: 'Shape your hair into your desired look and adjust as needed.'
        }
      ],
      productDetails: {
        brand: 'SENSEIN',
        productName: 'Hair Wax',
        productType: 'Hair Styling Wax',
        netQuantity: '100 g',
        finish: 'Shine',
        stylingBenefits: 'Texture, shine, control and hold',
        suitableHairLength: 'Short, medium and long',
        fragrance: 'Perfumed formula',
        countryOfOrigin: 'PRC (as stated on the packaging)',
        importedAndMarketedBy: 'Olym Enterprises, Surat, Gujarat, India',
        manufacturedBy: 'Guangzhou Forte Cosmetics Company Limited, Guangzhou, China.'
      },
      benefits: [
        'Adds texture to help define your hairstyle.',
        'Provides shine for a polished-looking finish.',
        'Helps control and hold your desired style.',
        'Allows you to shape and restyle your look as needed.',
        'Suitable for short, medium and long hair.',
        'Convenient for everyday grooming and styling.'
      ],
      ingredients: {
        keyActives: [
          'Water (Base for smooth application)',
          'Propylene Glycol (Helps retain moisture)',
          'Crodatos N10N (Helps in even spreadability and styling control)',
          'Volpo N5 (Provides natural hold and structure)',
          'Volpo N3 (Supports smooth, stronger-looking hair)',
          'Light Liquid Paraffin (Gives smoothness and shine)',
          'PVP K90 (Gives firm hold and texture)',
          'Kathon (Helps maintain product freshness)',
          'Perfume (Adds a pleasant fresh scent)'
        ],
        fullList: 'Water, Propylene Glycol, Crodatos N10N, Volpo N5, Volpo N3, Light Liquid Paraffin, PVP K90, Kathon and Perfume.'
      },
      faqs: [
        {
          question: 'What is SENSEIN Hair Wax used for?',
          answer: 'It is used to add texture, shine, control and hold while styling hair.'
        },
        {
          question: 'How do I apply SENSEIN Hair Wax?',
          answer: 'Warm a suitable amount between your hands, apply evenly and style as desired.'
        },
        {
          question: 'Which hair lengths is it suitable for?',
          answer: 'The product packaging lists short, medium and long hair.'
        },
        {
          question: 'What is the net quantity?',
          answer: 'The jar contains 100 g of hair wax.'
        },
        {
          question: 'How should I store the product?',
          answer: 'Store in a cool, dry place away from direct sunlight and high temperatures, as instructed on the packaging.'
        },
        {
          question: 'What is the product\'s shelf life?',
          answer: 'The packaging states 36 months from the date of manufacture. Check the manufacturing and expiry dates on your individual pack.'
        }
      ],
      additionalInfo: {
        netQuantity: '100gm / 3.38 Fl.oz',
        immovability: '★★★★☆',
        lusterShine: '★★★★☆',
        hairLength: 'Short / Medium / Long',
        shelfLife: '36 Months from Date of Manufacture',
        storage: 'Store in a cool, dry place away from direct sunlight and high temperatures, as instructed on the packaging.',
        advice: 'For external use only. If irritation occurs rinse thoroughly with water. Do not store in high temperatures.',
        countryOfOrigin: 'PRC (as stated on the packaging)',
        importedAndMarketedBy: 'Olym Enterprises, Surat, Gujarat, India',
        manufacturedBy: 'Guangzhou Forte Cosmetics Company Limited, Guangzhou, China.'
      },
      overview: 'Non sticky formula, Shape, style, and shine with lasting hold! Engineered for short, medium, and long hair with clean washability and radiant shine.',
      reviews: [
        {
          id: 'rev-01',
          author: 'Rohit Sharma',
          rating: 5,
          title: 'Amazing hold and non-sticky shine!',
          content: 'Hands down the best hair wax I have used. Gives great shine without making my hair feel greasy or stiff. Lasts throughout the entire day.',
          date: '2026-03-14',
          verifiedBuyer: true
        },
        {
          id: 'rev-02',
          author: 'Aakash Verma',
          rating: 5,
          title: 'Super easy to restyle and wash out',
          content: 'Washes out cleanly with regular water. The fragrance is very pleasant and luxury. Gives a solid 4/5 hold that allows easy restyling.',
          date: '2026-03-28',
          verifiedBuyer: true
        },
        {
          id: 'rev-03',
          author: 'Vikram Mehta',
          rating: 5,
          title: 'Worth every rupee!',
          content: '100g jar at ₹249 is unbelievable value for this level of quality. The texture and spreadability is top notch.',
          date: '2026-04-05',
          verifiedBuyer: true
        }
      ]
    },
    {
      id: 'sensein-argan-keratin-shampoo',
      name: 'Argan + Keratin Smoothing Shampoo',
      slug: 'argan-keratin-smoothing-shampoo',
      subtitle: 'Frizz control, hydration & shine, enhanced smoothness, restore & strengthening',
      description: 'A professional salon-grade shampoo designed to thoroughly cleanse hair and scalp while helping improve its smoothness, shine, and manageability. Enriched with pure Argan Oil, Hydrolyzed Keratin, D-Panthenol, and Jojoba Seed Oil.',
      category: 'Shampoo',
      curatedCollection: 'Bestsellers',
      price: 1975,
      mrp: 1975,
      discountPercentage: 0,
      netVolume: '1 L (33.81 fl. oz.)',
      variants: [
        { size: '1 L (33.81 fl. oz.)', price: 1975, mrp: 1975, inStock: true }
      ],
      rating: 4.9,
      reviewCount: 38,
      images: [
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792509773/sensein/products/xeyipu7o4qrxz9fqf5oj.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792509776/sensein/products/yvfq9zqlqalb3jkynqp2.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792509771/sensein/products/jsn7u4cbcw6ihahh12rb.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792492630/sensein/products/sensein-shampoo-1.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792492630/sensein/products/sensein-shampoo-5.jpg'
      ],
      badges: ['OFFICIAL SENSEIN®', 'ARGAN + KERATIN', '1 LITRE SALON PACK'],
      inStock: true,
      howToUse: [
        {
          step: 1,
          title: 'Wet Hair Thoroughly',
          instruction: 'Wet your hair thoroughly with water.'
        },
        {
          step: 2,
          title: 'Apply Sufficient Shampoo',
          instruction: 'Apply a sufficient amount of SENSEIN Professional Argan + Keratin Smoothing Shampoo according to your hair length.'
        },
        {
          step: 3,
          title: 'Massage Hair & Scalp',
          instruction: 'Gently massage your hair and scalp for 2–3 minutes.'
        },
        {
          step: 4,
          title: 'Rinse Thoroughly',
          instruction: 'Rinse thoroughly with clean water.'
        },
        {
          step: 5,
          title: 'Follow with Hair Mask',
          instruction: 'For best results, follow with SENSEIN Professional Argan + Keratin Smoothing Mask, as recommended on the product packaging.'
        }
      ],
      productDetails: {
        brand: 'SENSEIN',
        range: 'SENSEIN Professional',
        productName: 'Argan + Keratin Smoothing Shampoo',
        productType: 'Shampoo',
        netQuantity: '1 L (33.81 fl. oz.) when packed',
        keyIngredients: 'Argan Oil, Hydrolyzed Keratin, D-Panthenol and Jojoba Seed Oil',
        keyFeatures: 'Frizz control, hydration and shine, enhanced smoothness, restore and strengthening (as stated on the label)',
        countryOfOrigin: 'PRC, as stated on the packaging',
        importedAndMarketedBy: 'Olive Enterprise, Mota Varachha, Surat, Gujarat, India',
        manufacturedBy: 'Guangzhou Forte Cosmetics Company Limited, Guangzhou, China.'
      },
      benefits: [
        'Helps cleanse the hair and scalp.',
        'Helps improve the appearance of smoothness and shine.',
        'Designed to help control the appearance of frizz.',
        'Contains conditioning ingredients to support hair manageability.',
        'Formulated with Argan Oil and Hydrolyzed Keratin.',
        'Suitable for a regular hair care routine, following the label instructions.'
      ],
      ingredients: {
        keyActives: [
          'Argan Oil (Deep nourishment and radiant shine)',
          'Hydrolyzed Keratin (Restores strength and repairs cuticle)',
          'D-Panthenol (Pro-Vitamin B5 for lasting moisture retention)',
          'Simmondsia Chinensis (Jojoba) Seed Oil (Scalp balance and smoothness)',
          'Glycerin (Locks in essential moisture)',
          'Dimethicone (Effortless detangling and frizz control)'
        ],
        fullList: 'Aqua, Cocamidopropyl Betaine, Cocamide DEA, Glycerin, Dimethicone, Sodium Chloride, Fragrance, DMDM Hydantoin, Carbomer, Guar Hydroxypropyltrimonium Chloride, Hydrolyzed Keratin, Polyquaternium-7, Argan Oil, D-Panthenol, Simmondsia Chinensis (Jojoba) Seed Oil, Kazon and CI 16140.'
      },
      faqs: [
        {
          question: 'What is SENSEIN Argan + Keratin Smoothing Shampoo?',
          answer: 'It is a professional shampoo designed to cleanse hair and help improve its smoothness, shine and manageability.'
        },
        {
          question: 'What are its key ingredients?',
          answer: 'The label highlights Argan Oil and Hydrolyzed Keratin, along with conditioning ingredients such as Glycerin, Dimethicone, D-Panthenol and Jojoba Seed Oil.'
        },
        {
          question: 'How should I use this shampoo?',
          answer: 'Apply to wet hair, gently massage for 2–3 minutes and rinse thoroughly.'
        },
        {
          question: 'What is the pack size?',
          answer: 'The bottle contains 1 litre (33.81 fl. oz.) when packed.'
        },
        {
          question: 'Can I use a hair mask after shampooing?',
          answer: 'The product label recommends following with SENSEIN Professional Argan + Keratin Smoothing Mask for best results.'
        },
        {
          question: 'Is this shampoo SLS and paraben free?',
          answer: 'The supplied packaging carries an "SLS / SLES / Paraben Free" claim. Confirm the approved product declaration before publishing this claim.'
        }
      ],
      additionalInfo: {
        netQuantity: '1 L (33.81 fl. oz.)',
        frizzControl: '★★★★★',
        hydrationShine: '★★★★★',
        hairType: 'Frizz-prone, Dry, Dull or Treated Hair',
        shelfLife: '36 Months from Date of Manufacture',
        storage: 'Store in a cool, dry place away from direct sunlight and high temperatures, as instructed on the packaging.',
        advice: 'For external use only. If irritation occurs rinse thoroughly with water. Do not store in high temperatures.',
        countryOfOrigin: 'PRC, as stated on the packaging',
        importedAndMarketedBy: 'Olive Enterprise, Mota Varachha, Surat, Gujarat, India',
        manufacturedBy: 'Guangzhou Forte Cosmetics Company Limited, Guangzhou, China.'
      },
      overview: 'Helps cleanse the hair and scalp while improving smoothness, shine, and manageability. Formulated with Argan Oil, Hydrolyzed Keratin, D-Panthenol, and Jojoba Seed Oil.',
      reviews: [
        {
          id: 'rev-sh-01',
          author: 'Priya Patel',
          rating: 5,
          title: 'Salon quality shampoo at home!',
          content: 'The 1 litre bottle is huge and lasts forever. Leaves my hair super smooth, shiny, and frizz-free even in humid weather.',
          date: '2026-04-10',
          verifiedBuyer: true
        },
        {
          id: 'rev-sh-02',
          author: 'Kavita Nair',
          rating: 5,
          title: 'Incredible lather and delicious fragrance',
          content: 'Only a pump or two is needed for long hair. The Argan and Keratin combination has noticeably reduced breakage.',
          date: '2026-04-12',
          verifiedBuyer: true
        }
      ]
    },
    {
      id: 'sensein-argan-keratin-hair-mask',
      name: 'Argan + Keratin Smoothing Hair Mask',
      slug: 'argan-keratin-smoothing-hair-mask',
      subtitle: 'Deep hydration, detangling and shine enhancement',
      description: 'A deeply restorative salon-grade hair mask formulated with pure Moroccan Argan Oil, Hydrolyzed Keratin, Hydrolyzed Wheat Protein, and Arginine. Delivers deep hydration, detangling, and radiant shine enhancement while reducing frizz and conditioning hair for a softer, smoother feel.',
      category: 'Hair Mask',
      curatedCollection: 'Bestsellers',
      price: 1275,
      mrp: 1275,
      discountPercentage: 0,
      netVolume: '500 g (16.91 fl. oz.)',
      variants: [
        { size: '500 g (16.91 fl. oz.)', price: 1275, mrp: 1275, inStock: true }
      ],
      rating: 4.9,
      reviewCount: 32,
      images: [
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792509767/sensein/products/bqvimbfiit9d5pwk7qwn.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792509769/sensein/products/lb9lgreexbsulxi3n1fa.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792509771/sensein/products/jsn7u4cbcw6ihahh12rb.jpg'
      ],
      badges: ['OFFICIAL SENSEIN®', 'DEEP HYDRATION', '500G SALON PACK'],
      inStock: true,
      howToUse: [
        {
          step: 1,
          title: 'Wash & Prepare',
          instruction: 'After washing your hair, take an adequate amount of SENSEIN Professional Argan + Keratin Smoothing Hair Mask.'
        },
        {
          step: 2,
          title: 'Apply Evenly',
          instruction: 'Apply evenly to wet hair and scalp, following the product label instructions.'
        },
        {
          step: 3,
          title: 'Massage & Leave On',
          instruction: 'Gently massage and leave on for 5–10 minutes.'
        },
        {
          step: 4,
          title: 'Rinse Thoroughly',
          instruction: 'Rinse thoroughly with clean water.'
        },
        {
          step: 5,
          title: 'Recommended Frequency',
          instruction: 'The packaging recommends using the product 2–3 times a week.'
        }
      ],
      productDetails: {
        brand: 'SENSEIN',
        range: 'SENSEIN Professional',
        productName: 'Argan + Keratin Smoothing Hair Mask',
        productType: 'Hair Mask',
        netQuantity: '500 g (16.91 fl. oz.) when packed',
        keyIngredients: 'Argan Oil, Hydrolyzed Keratin, Hydrolyzed Wheat Protein and Arginine',
        keyFeatures: 'Deep hydration, detangling and shine enhancement (as stated on the packaging)',
        countryOfOrigin: 'PRC, as stated on the packaging',
        importedAndMarketedBy: 'Olive Enterprise, Mota Varachha, Surat, Gujarat, India',
        manufacturedBy: 'Guangzhou Forte Cosmetics Company Limited, Guangzhou, China.'
      },
      benefits: [
        'Helps condition hair for a softer, smoother feel.',
        'Helps improve detangling and manageability.',
        'Helps enhance the appearance of hair shine.',
        'Designed to help reduce the appearance of frizz.',
        'Contains Argan Oil and Hydrolyzed Keratin.',
        'Includes conditioning ingredients to support your hair care routine.'
      ],
      ingredients: {
        keyActives: [
          { name: 'Argan Oil', role: 'Nourishes and conditions hair' },
          { name: 'Hydrolyzed Keratin', role: 'Helps strengthen and smooth hair' },
          { name: 'Hydrolyzed Wheat Protein', role: 'Helps improve hair texture and smoothness' },
          { name: 'Arginine', role: 'Helps support hair conditioning' },
          { name: 'D-Panthenol', role: 'Helps moisturize and strengthen hair' },
          { name: 'Cetearyl Alcohol', role: 'Helps soften hair and improve manageability' },
          { name: 'Steartrimonium Chloride', role: 'Conditions hair and reduces static and frizz' },
          { name: 'Dimethicone & Amodimethicone', role: 'Adds smoothness, shine, and improves hair manageability' },
          { name: 'Glycerin', role: 'Helps retain moisture in hair' }
        ],
        fullList: 'Water, Cetearyl Alcohol, Glycerin, Steartrimonium Chloride, Hydroxyethyl Cellulose, Dimethicone, Amodimethicone, Fragrance, DMDM Hydantoin, Citric Acid, Hydrolyzed Wheat Protein, Hydrolyzed Keratin, Argan Oil, D-Panthenol, Arginine, Kazon and CI 16185.'
      },
      faqs: [
        {
          question: 'What is SENSEIN Argan + Keratin Smoothing Hair Mask?',
          answer: 'It is a conditioning hair mask designed to help improve smoothness, detangling and shine.'
        },
        {
          question: 'What are its key ingredients?',
          answer: 'The label lists Argan Oil, Hydrolyzed Keratin, Hydrolyzed Wheat Protein and Arginine, among other ingredients.'
        },
        {
          question: 'How long should I leave the mask on?',
          answer: 'The supplied label recommends leaving it on for 5–10 minutes before rinsing.'
        },
        {
          question: 'How often should I use it?',
          answer: 'The packaging recommends 2–3 times a week.'
        },
        {
          question: 'What is the pack size?',
          answer: 'The net quantity is 500 g (16.91 fl. oz.) when packed.'
        },
        {
          question: 'How should I store the product?',
          answer: 'Store in a cool, dry place away from direct sunlight and close the container tightly after use.'
        }
      ],
      additionalInfo: {
        shelfLife: '36 Months from Manufacturing Date',
        storage: 'Store in a cool, dry place away from direct sunlight and close the container tightly after use.',
        hairType: 'Suitable for all hair textures; especially frizzy, dry, unmanageable, or chemically treated hair.',
        caution: 'For external use only. Avoid contact with eyes. In case of contact, rinse thoroughly with clean water.'
      },
      overview: 'Deep hydration, detangling and shine enhancement. Formulated with Argan Oil, Hydrolyzed Keratin, Hydrolyzed Wheat Protein, and Arginine.',
      reviews: [
        {
          id: 'rev-m01',
          author: 'Priya Patel',
          rating: 5,
          title: 'Salon quality hair mask at home!',
          content: 'My hair was extremely dry from frequent coloring. After leaving this mask on for 10 minutes, my hair felt like silk! The detangling effect is instant.',
          date: '2026-04-10',
          verifiedBuyer: true
        },
        {
          id: 'rev-m02',
          author: 'Sneha Shah',
          rating: 5,
          title: 'Huge 500g tub — great value and results',
          content: 'At ₹1,275 for a 500g pack, this lasts months. Smells incredible and leaves my curls soft and manageable without feeling heavy.',
          date: '2026-04-15',
          verifiedBuyer: true
        }
      ]
    },
    {
      id: 'sensein-argan-oil-for-hair-body',
      name: 'Argan Oil for Hair & Body',
      slug: 'argan-oil-for-hair-body',
      subtitle: 'Multi-purpose cosmetic oil infused with Argan, Jojoba & Macadamia Oils for radiant hair shine and soft, moisturized skin.',
      description: 'SENSEIN Professional Argan Oil for Hair & Body is a multi-purpose cosmetic oil formulated to add lustrous shine, smooth frizz and flyaways, and leave hair feeling softer and more manageable. On the body, it delivers a deeply moisturizing, non-greasy feel to replenish clean skin.',
      category: 'Hair & Body Oil',
      curatedCollection: 'Bestsellers',
      price: 2400,
      mrp: 2400,
      discountPercentage: 0,
      netVolume: '100 ml (3.38 fl. oz.)',
      variants: [
        { size: '100 ml (3.38 fl. oz.)', price: 2400, mrp: 2400, inStock: true }
      ],
      rating: 4.9,
      reviewCount: 38,
      images: [
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792511270/sensein/products/sensein-argan-oil-hero.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792511272/sensein/products/sensein-argan-oil-pour.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792511274/sensein/products/sensein-argan-oil-ingredients.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792511275/sensein/products/sensein-argan-oil-handheld.jpg'
      ],
      badges: ['OFFICIAL SENSEIN®', 'HAIR & BODY ELIXIR', '100ML'],
      inStock: true,
      overview: 'SENSEIN Professional Argan Oil for Hair & Body is a multi-purpose cosmetic oil formulated to add lustrous shine, smooth frizz, and leave hair softer while deeply moisturizing clean skin.',
      howToUse: [
        {
          step: 1,
          title: 'Hair Care — Palm Dispense',
          instruction: 'Take a few drops of SENSEIN Argan Oil into your palms.'
        },
        {
          step: 2,
          title: 'Hair Care — Rub & Distribute',
          instruction: 'Rub your palms together and distribute the oil through your hair, focusing on lengths and ends.'
        },
        {
          step: 3,
          title: 'Hair Care — Smooth & Defrizz',
          instruction: 'Use a small amount to help smooth frizz, tame flyaways, and add luxurious mirror-like shine.'
        },
        {
          step: 4,
          title: 'Body Care — Apply to Clean Skin',
          instruction: 'Apply a small amount to clean skin and gently massage until spread evenly.'
        },
        {
          step: 5,
          title: 'Body Care — Massage & Hydrate',
          instruction: 'Adjust the amount according to your needs and the product label instructions for soft, nourished skin.'
        }
      ],
      usageAdvice: 'Use sparingly at first. Avoid contact with eyes and do not apply to irritated or damaged skin. Discontinue use if irritation occurs. Results may vary depending on hair type, skin type and how the product is used.',
      productDetails: {
        brand: 'SENSEIN',
        range: 'SENSEIN Professional',
        productName: 'Argan Oil for Hair & Body',
        productType: 'Multi-purpose cosmetic oil',
        netQuantity: '100 ml (3.38 fl. oz.) when packed',
        keyOils: 'Argan Oil and Jojoba Oil',
        otherListedIngredients: 'Dimethicone, Cyclopentasiloxane, Diphenyl Amodimethicone, Isopropyl Myristate, Macadamia Oil, Benzophenone-3 and Fragrance',
        countryOfOrigin: 'PRC, as stated on the packaging',
        importedAndMarketedBy: 'Olive Enterprise, Surat, Gujarat, India',
        manufacturedBy: 'Guangzhou Forte Cosmetics Company Limited, Guangzhou, China.'
      },
      benefits: [
        'Helps add shine to the appearance of hair.',
        'Helps smooth the look of frizz and flyaways.',
        'Helps leave hair feeling softer and more manageable.',
        'Provides a moisturizing feel when applied to skin.',
        'Contains Argan Oil, Jojoba Oil and Macadamia Oil.',
        'Offers a convenient oil format for hair and body care.',
        'Results may vary depending on hair type, skin type and how the product is used.'
      ],
      ingredients: {
        keyActives: [
          { name: 'Argan Oil', role: 'Helps add softness and shine. Rich in essential fatty acids and vitamin E to nourish strands and enhance elasticity.' },
          { name: 'Jojoba Oil', role: 'Helps condition hair. Biomimetic botanical lipid that locks in moisture without heavy residue.' },
          { name: 'Macadamia Oil', role: 'Nourishes and conditions. Replenishes dry hair and dry skin with deep essential lipid support.' },
          { name: 'Dimethicone', role: 'Helps smooth hair and add shine. Forms a breathable shield against humidity and environmental aggressors.' },
          { name: 'Cyclopentasiloxane', role: 'Helps hair feel silky. Featherlight silicone imparting glide and weightless luxury finish.' },
          { name: 'Diphenyl Amodimethicone', role: 'Helps condition and reduce frizz. Selectively binds to porous, damaged hair cuticles to tame static.' },
          { name: 'Isopropyl Myristate', role: 'Helps soften hair and skin. Enhances fast cosmetic absorption for a velvety touch.' },
          { name: 'Benzophenone-3', role: 'UV-filter ingredient. Defends cosmetic lipids and hair integrity from photo-degradation.' },
          { name: 'Fragrance', role: 'Adds scent. Elegant salon-grade olfactory signature.' }
        ],
        fullList: 'Dimethicone, Cyclopentasiloxane, Diphenyl Amodimethicone, Isopropyl Myristate, Macadamia Oil, Argan Oil, Benzophenone-3, Jojoba Oil and Fragrance.'
      },
      faqs: [
        {
          question: 'What is SENSEIN Argan Oil used for?',
          answer: 'The product is marketed for hair and body care and is designed to help add shine and softness to hair and moisturize skin.'
        },
        {
          question: 'How do I use it on my hair?',
          answer: 'Start with a few drops, spread between your palms and apply sparingly through the hair, focusing on the lengths and ends.'
        },
        {
          question: 'Can it be used on the body?',
          answer: 'The packaging identifies it for hair and body use. Follow the label instructions and discontinue use if irritation occurs.'
        },
        {
          question: 'What is the pack size?',
          answer: 'The net quantity is 100 ml (3.38 fl. oz.) when packed.'
        },
        {
          question: 'How should I store it?',
          answer: 'Store in a cool, dry place away from direct sunlight.'
        },
        {
          question: 'Is it suitable for every skin type?',
          answer: 'Suitability can vary. Check the ingredient list and test a small area first if you have sensitive skin.'
        }
      ],
      additionalInfo: {
        brand: 'SENSEIN Professional',
        caution: 'Use sparingly at first. Avoid contact with eyes and do not apply to irritated or damaged skin.',
        storageInstructions: 'Store in a cool, dry place away from direct sunlight.',
        packagingNetQuantity: '100 ml (3.38 fl. oz.) when packed',
        countryOfOrigin: 'PRC, as stated on the packaging',
        importedAndMarketedBy: 'Olive Enterprise, Surat, Gujarat, India',
        manufacturedBy: 'Guangzhou Forte Cosmetics Company Limited, Guangzhou, China.'
      },
      reviews: [
        {
          id: 'rev-o01',
          author: 'Pooja Mehta',
          rating: 5,
          title: 'Transformed my dry ends & non-greasy on skin!',
          content: 'Only 3 drops are needed for mid-length hair. It completely eliminated my frizz without making my hair look oily. I also use a drop on my collarbone and elbows — smells divine!',
          date: '2026-04-18',
          verifiedBuyer: true
        },
        {
          id: 'rev-o02',
          author: 'Aakash Verma',
          rating: 5,
          title: 'True luxury multi-purpose oil',
          content: 'The packaging and gold cap feel super premium. The argan and macadamia combination leaves hair shiny and silky immediately. Worth every rupee.',
          date: '2026-04-19',
          verifiedBuyer: true
        }
      ]
    },
    {
      id: 'sensein-charcoal-clay-facewash',
      name: 'Charcoal + Clay Facewash for Men',
      slug: 'charcoal-clay-facewash',
      subtitle: 'Deep Cleansing. Fresh-Looking Skin. Oil Balancing & Unclogging Pores.',
      description: 'Keep your skincare routine simple with SENSEIN Charcoal + Clay Facewash for Men. Featuring activated carbon and kaolin clay, this cleansing formula is designed to help remove excess oil and everyday impurities while leaving your skin feeling clean and refreshed. Its oil-balancing and cleansing properties make it suitable for a daily grooming routine. Whether you\'re starting your day or washing away the day\'s buildup, SENSEIN Charcoal + Clay Facewash helps you maintain a fresh, clean-looking appearance.',
      category: 'Facewash',
      curatedCollection: 'Bestsellers',
      price: 249,
      mrp: 249,
      discountPercentage: 0,
      netVolume: '100 ml',
      variants: [
        { size: '100 ml', price: 249, mrp: 249, inStock: true }
      ],
      rating: 4.9,
      reviewCount: 42,
      images: [
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792514002/sensein/products/sensein-charcoal-clay-facewash-packshot.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792514005/sensein/products/sensein-charcoal-clay-facewash-texture.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792514007/sensein/products/sensein-charcoal-clay-facewash-ingredients.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792514010/sensein/products/sensein-charcoal-clay-facewash-application.jpg'
      ],
      badges: ['OFFICIAL SENSEIN®', 'DEEP CLEANSING', 'OIL BALANCING', '100ML'],
      inStock: true,
      overview: 'Deep cleansing facial cleanser formulated with activated carbon and kaolin clay to remove impurities and balance surface oils.',
      howToUse: [
        {
          step: 1,
          title: 'Wet Face',
          instruction: 'Wet your face with clean water.'
        },
        {
          step: 2,
          title: 'Take Cleanser',
          instruction: 'Take an appropriate amount of SENSEIN Charcoal + Clay Facewash.'
        },
        {
          step: 3,
          title: 'Gently Massage',
          instruction: 'Gently massage over your face in circular motions, avoiding the eye area.'
        },
        {
          step: 4,
          title: 'Rinse Thoroughly',
          instruction: 'Rinse thoroughly with clean water.'
        },
        {
          step: 5,
          title: 'Pat Dry',
          instruction: 'Pat your face dry with a clean towel. Follow the directions printed on the product packaging.'
        }
      ],
      usageAdvice: 'Follow the usage instructions on the actual product label. If irritation occurs, discontinue use. Avoid the eye area.',
      productDetails: {
        brand: 'SENSEIN',
        range: 'Men\'s Skincare',
        productName: 'Charcoal + Clay Facewash',
        productType: 'Facewash',
        netQuantity: '100 ml',
        keyIngredients: 'Activated Carbon, Kaolin',
        keyFeatures: 'Deep Cleansing, Oil Balancing, Unclogging Pores',
        suitableFor: 'Men\'s daily skincare routine',
        countryOfOrigin: 'PRC, as stated on the packaging',
        importedAndMarketedBy: 'Olive Enterprise, Mota Varachha, Surat, Gujarat, India',
        manufacturedBy: 'Guangzhou Forte Cosmetics Company Limited, Guangzhou, China.'
      },
      benefits: [
        'Deep Cleansing: Helps remove dirt and everyday impurities from the skin.',
        'Oil Balancing: Helps cleanse away excess surface oil.',
        'Charcoal Cleansing: Contains activated carbon as a cleansing ingredient.',
        'Clay-Based Care: Contains kaolin clay to support the cleansing routine.',
        'Fresh-Looking Skin: Leaves skin feeling clean after washing.',
        'Daily Grooming: A convenient addition to a men\'s skincare routine.'
      ],
      ingredients: {
        keyActives: [
          { name: 'Activated Carbon', role: 'Draws out dirt and impurities' },
          { name: 'Kaolin', role: 'Absorbs excess oil' },
          { name: 'Glycerin', role: 'Keeps skin hydrated' },
          { name: 'Propanediol', role: 'Helps retain moisture and improves skin feel' },
          { name: 'Hydrolyzed Silk', role: 'Conditions and smoothens skin' },
          { name: 'Palmitic Acid', role: 'Cleans and conditions skin' },
          { name: 'Stearic Acid', role: 'Supports a rich and creamy texture for effective cleansing' },
          { name: 'Myristic Acid', role: 'Helps remove excess oil and impurities' },
          { name: 'Oleic Acid', role: 'Moisturizes and softens skin' },
          { name: 'Potassium Hydroxide', role: 'Helps balance the formula and cleanse effectively' },
          { name: 'Sodium Methyl Cocoyl Taurate', role: 'Provides gentle cleansing' },
          { name: 'PEG-150', role: 'Enhances cleansing and provides a smooth texture' },
          { name: 'Disodium EDTA', role: 'Maintains product stability' },
          { name: 'Sodium Stearate', role: 'Supports cleansing action' },
          { name: 'Fragrance', role: 'Adds a fresh scent' },
          { name: 'BHT', role: 'Maintains formula stability' },
          { name: 'Phenoxyethanol', role: 'Preserves freshness' }
        ],
        fullList: 'Aqua, Palmitic Acid, Stearic Acid, Myristic Acid, Oleic Acid, Potassium Hydroxide, Glycerin, PEG-150, Sodium Methyl Cocoyl Taurate, Disodium EDTA, Fragrance, BHT, Kaolin, Activated Carbon, Hydrolyzed Silk, Phenoxyethanol and other listed ingredients.'
      },
      faqs: [
        {
          question: 'What is SENSEIN Charcoal + Clay Facewash?',
          answer: 'It is a facial cleanser formulated with activated carbon and kaolin clay for a cleansing-focused skincare routine.'
        },
        {
          question: 'What are its key ingredients?',
          answer: 'The supplied packaging highlights activated carbon and kaolin clay.'
        },
        {
          question: 'What does this facewash help with?',
          answer: 'It is designed for deep cleansing, oil balancing and helping remove everyday impurities.'
        },
        {
          question: 'How do I use this facewash?',
          answer: 'Apply an appropriate amount to wet skin, gently massage and rinse thoroughly, avoiding the eye area.'
        },
        {
          question: 'What is the pack size?',
          answer: 'The supplied packaging indicates a net quantity of 100 ml.'
        },
        {
          question: 'Can I use it daily?',
          answer: 'Follow the usage instructions on the actual product label. If irritation occurs, discontinue use.'
        }
      ],
      additionalInfo: {
        brand: 'SENSEIN Men\'s Skincare',
        caution: 'Follow the usage instructions on the actual product label. If irritation occurs, discontinue use. Avoid contact with eyes.',
        storageInstructions: 'Store in a cool, dry place away from direct sunlight.',
        packagingNetQuantity: '100 ml',
        countryOfOrigin: 'PRC, as stated on the packaging',
        importedAndMarketedBy: 'Olive Enterprise, Mota Varachha, Surat, Gujarat, India',
        manufacturedBy: 'Guangzhou Forte Cosmetics Company Limited, Guangzhou, China.'
      },
      reviews: [
        {
          id: 'rev-fw01',
          author: 'Rahul Patel',
          rating: 5,
          title: 'Instant refreshed feeling without drying my skin',
          content: 'Takes away all oiliness after coming home from work. The charcoal beads lather nicely and leave a completely clean, matte face.',
          date: '2026-04-20',
          verifiedBuyer: true
        },
        {
          id: 'rev-fw02',
          author: 'Vikas Sharma',
          rating: 5,
          title: 'Best facewash for daily grooming',
          content: 'Great texture, subtle pleasant scent, and keeps oil in check throughout the day. Very affordable for ₹249.',
          date: '2026-04-20',
          verifiedBuyer: true
        }
      ]
    },
    {
      id: 'sensein-color-pro-shampoo',
      name: 'Color Pro Shampoo',
      slug: 'color-pro-shampoo',
      subtitle: 'Gentle Cleansing. Colour Care. Lasting Vibrancy.',
      description: 'Keep your coloured hair looking fresh with SENSEIN Professional Color Pro Shampoo. Specially designed for colour-care routines, this shampoo gently cleanses the hair while helping maintain colour vibrancy and improve the appearance of smoothness and shine. Its conditioning formula helps support hydration and manageability while caring for hair exposed to colouring and heat styling. Make it part of your regular hair-care routine for clean, soft and vibrant-looking coloured hair. For best results, follow with SENSEIN Professional Color Pro Mask, as recommended on the product packaging.',
      category: 'Shampoo',
      curatedCollection: 'Bestsellers',
      price: 599,
      mrp: 599,
      discountPercentage: 0,
      netVolume: '300 ml',
      variants: [
        { size: '300 ml', price: 599, mrp: 599, inStock: true }
      ],
      rating: 4.9,
      reviewCount: 36,
      images: [
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792514548/sensein/products/sensein-color-pro-shampoo-hero.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792514550/sensein/products/sensein-color-pro-shampoo-pair.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792514551/sensein/products/sensein-color-pro-shampoo-ingredients.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792514552/sensein/products/sensein-color-pro-shampoo-texture.jpg'
      ],
      badges: ['OFFICIAL SENSEIN®', 'COLOUR CARE', 'UV & HEAT PROTECTION', '300ML'],
      inStock: true,
      overview: 'Gentle cleansing colour-care shampoo formulated with Hydrolyzed Keratin, Argan Oil, and Jojoba Seed Oil to protect vibrant colour and nourish treated strands.',
      howToUse: [
        {
          step: 1,
          title: 'Wet Hair',
          instruction: 'Wet your hair thoroughly with clean water.'
        },
        {
          step: 2,
          title: 'Apply Shampoo',
          instruction: 'Take a sufficient amount of shampoo according to your hair length.'
        },
        {
          step: 3,
          title: 'Gently Massage',
          instruction: 'Gently massage into your hair and scalp for 2–3 minutes.'
        },
        {
          step: 4,
          title: 'Rinse Thoroughly',
          instruction: 'Rinse thoroughly with clean water.'
        },
        {
          step: 5,
          title: 'Follow with Mask',
          instruction: 'For best results, follow with SENSEIN Professional Color Pro Mask, as recommended on the packaging.'
        }
      ],
      usageAdvice: 'Avoid contact with eyes. In case of contact, rinse thoroughly with clean water. For best results, follow with SENSEIN Professional Color Pro Mask.',
      productDetails: {
        brand: 'SENSEIN',
        range: 'SENSEIN Professional',
        productName: 'Color Pro Shampoo',
        productType: 'Shampoo',
        netQuantity: '300 ml',
        keyFeatures: 'Gentle Cleansing, Colour Preservation, Hydration & Nourishment, Reduced Fading of Vibrancy',
        suitableFor: 'Colour-treated hair-care routines',
        countryOfOrigin: 'PRC, as stated on the packaging',
        importedAndMarketedBy: 'Olive Enterprise, Mota Varachha, Surat, Gujarat, India',
        manufacturedBy: 'Guangzhou Forte Cosmetics Company Limited, Guangzhou, China.'
      },
      benefits: [
        'Gentle Cleansing: Helps cleanse hair and remove everyday buildup.',
        'Colour Care: Designed to help maintain the appearance of coloured hair.',
        'Hydration & Nourishment: Helps hair feel softer and more manageable.',
        'Smoothness & Shine: Supports a smooth, vibrant-looking finish.',
        'Heat-Styling Care: Designed for hair-care routines involving coloured hair and heat styling.',
        'Colour Vibrancy: Helps reduce the appearance of fading, as stated on the packaging.'
      ],
      ingredients: {
        keyActives: [
          { name: 'Hydrolyzed Keratin', role: 'Supports smoother, stronger-looking hair' },
          { name: 'Argan Oil', role: 'Nourishes and conditions hair' },
          { name: 'Simmondsia Chinensis (Jojoba Seed Oil)', role: 'Adds softness to hair' },
          { name: 'D-Panthenol', role: 'Helps condition and strengthen hair' },
          { name: 'Glycerin', role: 'Helps retain moisture' },
          { name: 'Cocamidopropyl Betaine', role: 'Provides gentle cleansing' },
          { name: 'Aqua (Water)', role: 'Helps cleanse and refresh hair' },
          { name: 'Sodium Chloride', role: 'Helps maintain texture and stability' },
          { name: 'Cocamide DEA', role: 'Enhances rich foam and cleanses effectively' },
          { name: 'Dimethicone', role: 'Smooths hair cuticles and boosts shine' },
          { name: 'Polyquaternium-28', role: 'Conditioning polymer that protects against heat and color fading' }
        ],
        fullList: 'Aqua, Cocamidopropyl Betaine, Cocamide DEA, Glycerin, Sodium Chloride, Fragrance, DMDM Hydantoin, Carbomer, Guar Hydroxypropyltrimonium Chloride, Hydrolyzed Keratin, Argan Oil, D-Panthenol, Simmondsia Chinensis (Jojoba) Seed Oil, Kazon, CI 16140, Dimethicone and Polyquaternium-28.'
      },
      faqs: [
        {
          question: 'What is SENSEIN Professional Color Pro Shampoo?',
          answer: 'It is a shampoo designed for cleansing and caring for colour-treated hair.'
        },
        {
          question: 'What are the main benefits?',
          answer: 'The packaging highlights gentle cleansing, colour preservation, hydration and nourishment, and reduced fading of vibrancy.'
        },
        {
          question: 'How do I use this shampoo?',
          answer: 'Wet your hair, apply an appropriate amount, gently massage for 2–3 minutes and rinse thoroughly.'
        },
        {
          question: 'Which product can I use after shampooing?',
          answer: 'The packaging recommends following with SENSEIN Professional Color Pro Mask.'
        },
        {
          question: 'What is the pack size?',
          answer: 'The bottle contains 300 ml.'
        },
        {
          question: 'How should I store it?',
          answer: 'Store in a cool, dry place away from direct sunlight and close the container tightly after use.'
        }
      ],
      additionalInfo: {
        brand: 'SENSEIN Professional',
        packagingNetQuantity: '300 ml',
        storageInstructions: 'Store in a cool, dry place away from direct sunlight and close the container tightly after use.',
        recommendedRoutine: 'For best results, follow with SENSEIN Professional Color Pro Mask.',
        countryOfOrigin: 'PRC, as stated on the packaging',
        importedAndMarketedBy: 'Olive Enterprise, Mota Varachha, Surat, Gujarat, India',
        manufacturedBy: 'Guangzhou Forte Cosmetics Company Limited, Guangzhou, China.'
      },
      reviews: [
        {
          id: 'rev-cp01',
          author: 'Ananya Sharma',
          rating: 5,
          title: 'Preserved my Burgundy tone perfectly!',
          content: 'I got global burgundy hair color 2 months ago and this shampoo kept it shiny without washing out the pigments. Also leaves my strands super soft.',
          date: '2026-04-20',
          verifiedBuyer: true
        },
        {
          id: 'rev-cp02',
          author: 'Kavita Joshi',
          rating: 5,
          title: 'Smells luxurious and zero fading',
          content: 'Great lather with very small amount. Hair feels clean and healthy even with frequent blow drying.',
          date: '2026-04-20',
          verifiedBuyer: true
        }
      ]
    },
    {
      id: 'sensein-color-pro-hair-mask',
      name: 'Color Pro Hair Mask',
      slug: 'color-pro-hair-mask',
      subtitle: 'Colour Care. Hydration. Smoothness.',
      description: 'Give your colour-treated hair extra care with SENSEIN Professional Color Pro Hair Mask. Its conditioning formula contains Jojoba Seed Oil, Arginine, Hydrolyzed Wheat Protein and Argan Oil to help maintain soft, manageable and vibrant-looking hair. Designed for hair-care routines involving coloured hair and heat styling, this hair mask helps improve the appearance of dryness, supports smoothness and provides conditioning care. For best results, use after washing your hair and follow the directions printed on the product packaging.',
      category: 'Hair Mask',
      curatedCollection: 'Bestsellers',
      price: 648,
      mrp: 648,
      discountPercentage: 0,
      netVolume: '250 ml (8.45 fl. oz.)',
      variants: [
        { size: '250 ml (8.45 fl. oz.)', price: 648, mrp: 648, inStock: true }
      ],
      rating: 4.9,
      reviewCount: 34,
      images: [
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792515703/sensein/products/sensein-color-pro-hair-mask-tub.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792514552/sensein/products/sensein-color-pro-shampoo-texture.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792515705/sensein/products/sensein-color-pro-hair-mask-ingredients.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792514550/sensein/products/sensein-color-pro-shampoo-pair.jpg'
      ],
      badges: ['OFFICIAL SENSEIN®', 'COLOUR RETENTION', 'UV & HEAT PROTECTION', '250ML'],
      inStock: true,
      overview: 'Rich conditioning colour-care hair mask formulated with Jojoba Seed Oil, Arginine, Hydrolyzed Wheat Protein, and Argan Oil for intense hydration and vibrant color retention.',
      howToUse: [
        {
          step: 1,
          title: 'Wash & Prepare',
          instruction: 'After washing your hair, take an adequate amount of SENSEIN Professional Color Pro Hair Mask.'
        },
        {
          step: 2,
          title: 'Apply Evenly',
          instruction: 'Apply an appropriate amount evenly to wet hair and scalp, following the product label instructions.'
        },
        {
          step: 3,
          title: 'Massage & Leave On',
          instruction: 'Gently massage and leave on the hair for 5–10 minutes.'
        },
        {
          step: 4,
          title: 'Rinse Thoroughly',
          instruction: 'Rinse thoroughly with clean water.'
        },
        {
          step: 5,
          title: 'Recommended Frequency',
          instruction: 'For best results, use 2–3 times a week, as stated on the packaging.'
        }
      ],
      usageAdvice: 'For best results, use 2–3 times a week after washing your hair. Avoid contact with eyes. In case of contact, rinse thoroughly with clean water.',
      productDetails: {
        brand: 'SENSEIN',
        range: 'SENSEIN Professional',
        productName: 'Color Pro Hair Mask',
        productType: 'Hair Mask',
        netQuantity: '250 ml (8.45 fl. oz.), as printed on the packaging',
        keyIngredients: 'Jojoba Seed Oil, Arginine, Hydrolyzed Wheat Protein and Argan Oil',
        keyFeatures: 'Colour Care, Conditioning, Hydration and Smoothness',
        suitableFor: 'Colour-treated hair-care routines',
        countryOfOrigin: 'PRC, as stated on the packaging',
        importedAndMarketedBy: 'Olive Enterprise, Mota Varachha, Surat, Gujarat, India',
        manufacturedBy: 'Guangzhou Forte Cosmetics Company Limited, Guangzhou, China.'
      },
      benefits: [
        'Colour Care: Designed to support the appearance of coloured hair.',
        'Hydration: Helps hair feel softer and more conditioned.',
        'Smoothness: Supports a smoother-looking hair finish.',
        'Manageability: Helps make hair easier to manage.',
        'Conditioning Care: Contains oils and conditioning ingredients for hair-care routines.',
        'Heat-Styling Care: Designed for hair exposed to heat styling and colouring.'
      ],
      ingredients: {
        keyActives: [
          { name: 'Simmondsia Chinensis (Jojoba) Seed Oil', role: 'Nourishes and conditions hair' },
          { name: 'Arginine', role: 'Helps support hair health' },
          { name: 'Hydrolyzed Wheat Protein', role: 'Helps improve hair strength' },
          { name: 'Argan Oil', role: 'Nourishes and conditions hair' },
          { name: 'Hydrolyzed Keratin', role: 'Supports smoother, stronger-looking hair' },
          { name: 'D-Panthenol', role: 'Helps condition and strengthen hair' },
          { name: 'Glycerin', role: 'Helps retain moisture' },
          { name: 'Cetearyl Alcohol', role: 'Emollient and thickening agent' },
          { name: 'Steartrimonium Chloride', role: 'Conditioning agent for smooth hair' },
          { name: 'Dimethicone & Amodimethicone', role: 'Provides smoothness and shine' },
          { name: 'Water', role: 'Base ingredient' },
          { name: 'Hydroxyethyl Cellulose', role: 'Helps improve texture and stability' },
          { name: 'Citric Acid', role: 'Helps maintain pH balance' },
          { name: 'Amino-modified fragrance', role: 'Adds pleasant fragrance' },
          { name: 'DMDM Hydantoin', role: 'Helps maintain product freshness' },
          { name: 'Kazon', role: 'Preservative' },
          { name: 'CI 16185', role: 'Colorant' }
        ],
        fullList: 'Simmondsia Chinensis (Jojoba) Seed Oil, Arginine, Hydrolyzed Wheat Protein, Argan Oil, Hydrolyzed Keratin, Hydrolyzed Wheat Protein, D-Panthenol, Cetearyl Alcohol, Glycerin, Steartrimonium Chloride, Dimethicone, Amodimethicone, Fragrance, DMDM Hydantoin, Carbomer, Guar Hydroxypropyltrimonium Chloride and CI 16185.'
      },
      faqs: [
        {
          question: 'What is SENSEIN Professional Color Pro Hair Mask?',
          answer: 'It is a conditioning hair mask designed for colour-treated hair-care routines.'
        },
        {
          question: 'What are its key ingredients?',
          answer: 'The packaging highlights Jojoba Seed Oil, Arginine, Hydrolyzed Wheat Protein and Argan Oil, among other ingredients.'
        },
        {
          question: 'How long should I leave the hair mask on?',
          answer: 'The packaging recommends leaving it on for 5–10 minutes before rinsing.'
        },
        {
          question: 'How often should I use it?',
          answer: 'The packaging recommends using it 2–3 times a week.'
        },
        {
          question: 'What is the pack size?',
          answer: 'The net quantity is 250 ml (8.45 fl. oz.), as printed on the packaging.'
        },
        {
          question: 'How should I store the product?',
          answer: 'Store in a cool, dry place away from direct sunlight and close the container tightly after use.'
        }
      ],
      additionalInfo: {
        brand: 'SENSEIN Professional',
        packagingNetQuantity: '250 ml (8.45 fl. oz.)',
        storageInstructions: 'Store in a cool, dry place away from direct sunlight and close the container tightly after use.',
        countryOfOrigin: 'PRC, as stated on the packaging',
        importedAndMarketedBy: 'Olive Enterprise, Mota Varachha, Surat, Gujarat, India',
        manufacturedBy: 'Guangzhou Forte Cosmetics Company Limited, Guangzhou, China.'
      },
      reviews: [
        {
          id: 'rev-cpm01',
          author: 'Meera Trivedi',
          rating: 5,
          title: 'Deeply restores bleached and colored hair',
          content: 'I leave this mask on for 10 minutes twice a week. My highlights look salon-fresh and there is no dryness or frizz. Absolute must-have with the Color Pro Shampoo.',
          date: '2026-04-20',
          verifiedBuyer: true
        },
        {
          id: 'rev-cpm02',
          author: 'Rhea Sen',
          rating: 5,
          title: 'Silky softness without weighing down',
          content: 'Subtle pleasant fragrance, thick luxurious cream texture, and instantly detangles. Very cost-effective at ₹648.',
          date: '2026-04-20',
          verifiedBuyer: true
        }
      ]
    },
    {
      id: 'sensein-damage-hair-repair-shampoo',
      name: 'Damage Hair Repair Shampoo',
      slug: 'damage-hair-repair-shampoo',
      subtitle: 'Gentle Cleansing. Nourishment. Moisture Restoration.',
      description: 'Give your hair professional care with SENSEIN Professional Damage Hair Repair Shampoo. Designed for hair that needs extra care, this shampoo gently cleanses the hair and scalp while helping maintain moisture and improve the appearance of dry, damaged hair. Formulated with Argan Oil, Hydrolyzed Keratin, Jojoba Seed Oil, Ginseng Extract and Ginger Extract, it supports a nourishing hair-care routine and helps leave hair feeling clean, soft and manageable. Its formula is designed to support hair strength and resilience while helping improve the appearance of dryness and breakage. For best results, follow with SENSEIN Professional Damage Hair Repair Mask.',
      category: 'Shampoo',
      curatedCollection: 'Bestsellers',
      price: 1975,
      mrp: 1975,
      discountPercentage: 0,
      netVolume: '1 L (33.81 fl. oz.)',
      variants: [
        { size: '1 L (33.81 fl. oz.)', price: 1975, mrp: 1975, inStock: true }
      ],
      rating: 4.9,
      reviewCount: 39,
      images: [
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792516518/sensein/products/sensein-damage-repair-shampoo-hero.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792516520/sensein/products/sensein-damage-repair-shampoo-texture.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792516521/sensein/products/sensein-damage-repair-shampoo-pair.jpg'
      ],
      badges: ['OFFICIAL SENSEIN®', 'DAMAGE REPAIR', 'SPLIT END CARE', '1 LITRE'],
      inStock: true,
      overview: 'Professional damage repair shampoo enriched with Argan Oil, Hydrolyzed Keratin, Jojoba Seed Oil, Ginseng Extract, and Ginger Extract to restore moisture, support hair strength, and prevent split ends.',
      howToUse: [
        {
          step: 1,
          title: 'Wet Hair',
          instruction: 'Wet your hair thoroughly with clean water.'
        },
        {
          step: 2,
          title: 'Apply Shampoo',
          instruction: 'Take a sufficient amount of SENSEIN Professional Damage Hair Repair Shampoo according to your hair length.'
        },
        {
          step: 3,
          title: 'Gently Massage',
          instruction: 'Gently massage into your hair and scalp for 2–3 minutes.'
        },
        {
          step: 4,
          title: 'Rinse Thoroughly',
          instruction: 'Rinse thoroughly with clean water.'
        },
        {
          step: 5,
          title: 'Follow with Mask',
          instruction: 'For best results, follow with SENSEIN Professional Damage Hair Repair Mask.'
        }
      ],
      usageAdvice: 'Avoid contact with eyes. In case of contact, rinse thoroughly with clean water. For best results, follow with SENSEIN Professional Damage Hair Repair Mask.',
      productDetails: {
        brand: 'SENSEIN',
        range: 'SENSEIN Professional',
        productName: 'Damage Hair Repair Shampoo',
        productType: 'Shampoo',
        netQuantity: '1 L (33.81 fl. oz.), when packed',
        keyIngredients: 'Argan Oil, Hydrolyzed Keratin, Jojoba Seed Oil, Ginseng Extract and Ginger Extract',
        keyFeatures: 'Gentle Cleansing, Scalp Nourishment, Split-End Care and Moisture Restoration',
        countryOfOrigin: 'PRC, as stated on the packaging',
        importedAndMarketedBy: 'Olive Enterprise, Mota Varachha, Surat, Gujarat, India',
        manufacturedBy: 'Guangzhou Forte Cosmetics Company Limited, Guangzhou, China.'
      },
      benefits: [
        'Gentle Cleansing: Helps cleanse hair and scalp.',
        'Scalp Nourishment: Designed to support a nourishing hair-care routine.',
        'Moisture Restoration: Helps address the appearance and feel of dryness.',
        'Hair Strength Support: Contains Hydrolyzed Keratin and conditioning ingredients.',
        'Split-End Care: Designed for hair-care routines focused on the appearance of split ends.',
        'Improved Manageability: Helps leave hair feeling smoother and easier to manage.'
      ],
      ingredients: {
        keyActives: [
          { name: 'Hydrolyzed Keratin', role: 'Supports stronger and smoother hair' },
          { name: 'Argan Oil', role: 'Nourishes and conditions hair' },
          { name: 'Ginseng Extract', role: 'Energizes hair follicles and supports scalp vitality' },
          { name: 'Ginger Extract', role: 'Stimulates scalp micro-circulation and revitalizes roots' },
          { name: 'Simmondsia Chinensis (Jojoba) Seed Oil', role: 'Restores softness and lipid barrier' },
          { name: 'D-Panthenol', role: 'Deeply hydrates and reinforces strand elasticity' },
          { name: 'Aqua (Water)', role: 'Helps cleanse and refresh hair' },
          { name: 'Cocamidopropyl Betaine', role: 'Provides gentle cleansing' },
          { name: 'Glycerin', role: 'Helps retain moisture' },
          { name: 'Sodium Chloride', role: 'Helps maintain texture and stability' },
          { name: 'Polyquaternium-10', role: 'Anti-static conditioning agent that helps prevent split ends' },
          { name: 'Dimethicone', role: 'Seals cuticles against environmental humidity and heat' }
        ],
        fullList: 'Aqua, Cocamidopropyl Betaine, Cocamide DEA, Glycerin, Dimethicone, Sodium Chloride, Fragrance, DMDM Hydantoin, Carbomer, Guar Hydroxypropyltrimonium Chloride, Hydrolyzed Keratin, Polyquaternium-10, Argan Oil, D-Panthenol, Simmondsia Chinensis (Jojoba) Seed Oil, Ginseng Extract, Ginger Extract, Kazon and CI 16140.'
      },
      faqs: [
        {
          question: 'What is SENSEIN Professional Damage Hair Repair Shampoo?',
          answer: 'It is a professional hair-care shampoo designed to cleanse hair and scalp while supporting moisture and manageability.'
        },
        {
          question: 'Which key ingredients does it contain?',
          answer: 'The label lists Argan Oil, Hydrolyzed Keratin, Jojoba Seed Oil, Ginseng Extract and Ginger Extract, among other ingredients.'
        },
        {
          question: 'How long should I massage the shampoo?',
          answer: 'The packaging recommends gently massaging for 2–3 minutes before rinsing.'
        },
        {
          question: 'Which product can I use after shampooing?',
          answer: 'The packaging recommends following with SENSEIN Professional Damage Hair Repair Mask.'
        },
        {
          question: 'What is the pack size?',
          answer: 'The net quantity is 1 L (33.81 fl. oz.), when packed.'
        },
        {
          question: 'How should I store the shampoo?',
          answer: 'Store in a cool, dry place away from direct sunlight and close the container tightly after use.'
        }
      ],
      additionalInfo: {
        brand: 'SENSEIN Professional',
        packagingNetQuantity: '1 L (33.81 fl. oz.), when packed',
        storageInstructions: 'Store in a cool, dry place away from direct sunlight and close the container tightly after use.',
        recommendedRoutine: 'For best results, follow with SENSEIN Professional Damage Hair Repair Mask.',
        countryOfOrigin: 'PRC, as stated on the packaging',
        importedAndMarketedBy: 'Olive Enterprise, Mota Varachha, Surat, Gujarat, India',
        manufacturedBy: 'Guangzhou Forte Cosmetics Company Limited, Guangzhou, China.'
      },
      reviews: [
        {
          id: 'rev-dr01',
          author: 'Priya Nambiar',
          rating: 5,
          title: 'Completely revived my heat-damaged ends',
          content: 'After years of straighteners, my hair was breaking constantly. This 1L shampoo together with the Ginseng & Ginger extracts restored strength within 2 weeks. Massive 1L bottle!',
          date: '2026-04-20',
          verifiedBuyer: true
        },
        {
          id: 'rev-dr02',
          author: 'Arjun Singhania',
          rating: 5,
          title: 'Salon grade results at home',
          content: 'Rich creamy foam, smells amazing, leaves scalp completely clarified without stripping moisture. Highly recommended.',
          date: '2026-04-20',
          verifiedBuyer: true
        }
      ]
    },
    {
      id: 'sensein-damage-hair-repair-mask',
      name: 'Damage Hair Repair Mask',
      slug: 'damage-hair-repair-mask',
      subtitle: 'Deep Conditioning. Frizz Control. Enhanced Elasticity.',
      description: 'Give your hair extra care with SENSEIN Professional Damage Hair Repair Mask. Specially designed for hair that needs conditioning and moisture support, this hair mask helps make hair feel softer, silkier and shinier. Its formula contains Argan Oil, Arginine and Hydrolyzed Keratin, which help improve the appearance and feel of dry, frizzy and damaged hair. It is also designed to support moisture restoration and improve hair manageability, including for coloured hair. Make it a part of your regular hair-care routine for smoother-looking, softer-feeling hair.',
      category: 'Hair Mask',
      curatedCollection: 'Bestsellers',
      price: 1275,
      mrp: 1275,
      discountPercentage: 0,
      netVolume: '500 g (16.91 fl. oz.)',
      variants: [
        { size: '500 g (16.91 fl. oz.)', price: 1275, mrp: 1275, inStock: true }
      ],
      rating: 4.9,
      reviewCount: 44,
      images: [
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792517175/sensein/products/sensein-damage-repair-mask-tub.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792516520/sensein/products/sensein-damage-repair-shampoo-texture.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792517176/sensein/products/sensein-damage-repair-mask-ingredients.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792516521/sensein/products/sensein-damage-repair-shampoo-pair.jpg'
      ],
      badges: ['OFFICIAL SENSEIN®', 'DEEP CONDITIONING', 'FRIZZ CONTROL', '500G'],
      inStock: true,
      overview: 'Intensive damage repair hair mask with Argan Oil, Arginine, Hydrolyzed Keratin, and D-Panthenol engineered for deep conditioning, frizz control, enhanced elasticity, and split-end care.',
      howToUse: [
        {
          step: 1,
          title: 'Wash & Prepare',
          instruction: 'After washing your hair, take an adequate amount of SENSEIN Professional Damage Hair Repair Mask.'
        },
        {
          step: 2,
          title: 'Apply Evenly',
          instruction: 'Apply evenly to wet hair and scalp, following the product label instructions.'
        },
        {
          step: 3,
          title: 'Massage & Leave On',
          instruction: 'Gently massage and leave on the hair for 5–10 minutes.'
        },
        {
          step: 4,
          title: 'Rinse Thoroughly',
          instruction: 'Rinse thoroughly with clean water.'
        },
        {
          step: 5,
          title: 'Recommended Frequency',
          instruction: 'For best results, use 2–3 times a week, as recommended on the packaging.'
        }
      ],
      usageAdvice: 'For best results, use 2–3 times a week after washing with Damage Hair Repair Shampoo. Avoid contact with eyes. In case of contact, rinse thoroughly with clean water.',
      productDetails: {
        brand: 'SENSEIN',
        range: 'SENSEIN Professional',
        productName: 'Damage Hair Repair Mask',
        productType: 'Hair Mask',
        netQuantity: '500 g (16.91 fl. oz.), when packed',
        keyIngredients: 'Argan Oil, Arginine, Hydrolyzed Keratin and D-Panthenol',
        keyFeatures: 'Deep Conditioning, Frizz Control and Enhanced Elasticity',
        countryOfOrigin: 'PRC, as stated on the packaging',
        importedAndMarketedBy: 'Olive Enterprise, Mota Varachha, Surat, Gujarat, India',
        manufacturedBy: 'Guangzhou Forte Cosmetics Company Limited, Guangzhou, China.'
      },
      benefits: [
        'Deep Conditioning: Helps condition hair for a softer feel.',
        'Frizz Control: Helps reduce the appearance of frizzy hair.',
        'Enhanced Elasticity: Supports a hair-care routine focused on hair flexibility and manageability.',
        'Smoothness and Shine: Helps hair look smoother and shinier.',
        'Moisture Care: Helps address the feel and appearance of dryness.',
        'Split-End Care: Designed to improve the appearance of hair affected by split ends.',
        'Colour-Treated Hair Care: Suitable for hair-care routines involving coloured hair.'
      ],
      ingredients: {
        keyActives: [
          { name: 'Argan Oil', role: 'Nourishes and repairs damage, improving hair softness' },
          { name: 'Hydrolyzed Keratin', role: 'Repairs and strengthens hair structure' },
          { name: 'Arginine', role: 'Supports hair strength and growth' },
          { name: 'D-Panthenol', role: 'Moisturizes and improves hair health' },
          { name: 'Cetearyl Alcohol', role: 'Softens and smoothens hair' },
          { name: 'Glycerin', role: 'Locks in moisture' },
          { name: 'Steartrimonium Chloride', role: 'Conditions and reduces frizz' },
          { name: 'Dimethicone', role: 'Adds smoothness and shine' },
          { name: 'Amodimethicone', role: 'Strengthens and protects hair' },
          { name: 'Water', role: 'Base for deep hydration' },
          { name: 'Hydroxyethyl Cellulose', role: 'Improves texture and thickness' },
          { name: 'Fragrance', role: 'Leaves a pleasant scent' },
          { name: 'Citric Acid', role: 'Balances pH and adds shine' },
          { name: 'DMDM Hydantoin', role: 'Preserves formula freshness' },
          { name: 'Kazon & CI 16185', role: 'Colorant and preservation for vibrant appearance' }
        ],
        fullList: 'Water, Cetearyl Alcohol, Glycerin, Steartrimonium Chloride, Hydroxyethyl Cellulose, Dimethicone, Amodimethicone, Fragrance, DMDM Hydantoin, Citric Acid, Hydrolyzed Keratin, Argan Oil, D-Panthenol, Arginine, Kazon and CI 16185.'
      },
      faqs: [
        {
          question: 'What is SENSEIN Professional Damage Hair Repair Mask?',
          answer: 'It is a conditioning hair mask designed to help improve hair softness, smoothness and manageability.'
        },
        {
          question: 'What are its key ingredients?',
          answer: 'The label highlights Argan Oil, Arginine and Hydrolyzed Keratin. D-Panthenol is also listed in the ingredients.'
        },
        {
          question: 'How long should I leave the mask on?',
          answer: 'Leave it on for 5–10 minutes before rinsing thoroughly.'
        },
        {
          question: 'How often should I use it?',
          answer: 'The packaging recommends using it 2–3 times a week.'
        },
        {
          question: 'What is the pack size?',
          answer: 'The net quantity is 500 g (16.91 fl. oz.), when packed.'
        },
        {
          question: 'How should I store the product?',
          answer: 'Store in a cool, dry place away from direct sunlight and close the container tightly after use.'
        }
      ],
      additionalInfo: {
        brand: 'SENSEIN Professional',
        packagingNetQuantity: '500 g (16.91 fl. oz.), when packed',
        storageInstructions: 'Store in a cool, dry place away from direct sunlight and close the container tightly after use.',
        recommendedRoutine: 'For best results, use 2–3 times a week after washing with Damage Hair Repair Shampoo.',
        countryOfOrigin: 'PRC, as stated on the packaging',
        importedAndMarketedBy: 'Olive Enterprise, Mota Varachha, Surat, Gujarat, India',
        manufacturedBy: 'Guangzhou Forte Cosmetics Company Limited, Guangzhou, China.'
      },
      reviews: [
        {
          id: 'rev-drm01',
          author: 'Siddharth Nair',
          rating: 5,
          title: 'Huge 500g tub — deeply repairs damaged hair',
          content: 'This mask is so thick and nourishing! After letting it sit for 8 minutes, my damaged, brittle hair became completely smooth and frizz-free. Amazing value at ₹1,275.',
          date: '2026-04-20',
          verifiedBuyer: true
        },
        {
          id: 'rev-drm02',
          author: 'Pooja Agarwal',
          rating: 5,
          title: 'Instant detangling & elasticity restoration',
          content: 'Best hair mask in India right now. Rich salon texture, makes combing through wet hair effortless with no breakage.',
          date: '2026-04-20',
          verifiedBuyer: true
        }
      ]
    },
    {
      id: 'sensein-5-in-1-total-face-cleanup-facewash',
      name: '5 IN 1 Total Face Cleanup Facewash',
      slug: '5-in-1-total-face-cleanup-facewash',
      subtitle: 'Cleansing. Exfoliation. Hydration. Brighter Looking Skin. Oil Control.',
      description: 'Refresh your daily skincare routine with SENSEIN 5 IN 1 Total Face Cleanup Facewash. This multi-benefit facial cleanser combines cleansing and exfoliation with hydration-focused ingredients to help leave your skin feeling clean, smooth and refreshed. Its formula contains Hyaluronic Acid, which helps attract and retain moisture, and Walnut Powder, which helps exfoliate dead skin cells. Regular use as directed can help improve the appearance of skin texture and leave the complexion looking brighter and more radiant. Suitable for both men and women, it is a convenient addition to your everyday skincare routine.',
      category: 'Facewash',
      curatedCollection: 'Bestsellers',
      price: 249,
      mrp: 249,
      discountPercentage: 0,
      netVolume: '100 ml (3.38 fl. oz.)',
      variants: [
        { size: '100 ml (3.38 fl. oz.)', price: 249, mrp: 249, inStock: true }
      ],
      rating: 4.9,
      reviewCount: 47,
      images: [
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792517601/sensein/products/sensein-5in1-facewash-hero.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792517627/sensein/products/sensein-5in1-facewash-texture.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792517653/sensein/products/sensein-5in1-facewash-ingredients.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792517691/sensein/products/sensein-5in1-facewash-application.jpg'
      ],
      badges: ['OFFICIAL SENSEIN®', '5 IN 1 TOTAL', 'HYALURONIC & WALNUT', 'MEN & WOMEN'],
      inStock: true,
      overview: 'Multi-benefit 5-in-1 facial cleanup cleanser formulated with Hyaluronic Acid, Walnut Powder, Glycerin, and Trehalose for gentle cleansing, micro-exfoliation, and continuous hydration.',
      howToUse: [
        {
          step: 1,
          title: 'Dispense Cleanser',
          instruction: 'Take a sufficient amount of SENSEIN 5 IN 1 Total Face Cleanup Facewash.'
        },
        {
          step: 2,
          title: 'Lather with Water',
          instruction: 'Apply to the face and lather gently with clean water.'
        },
        {
          step: 3,
          title: 'Gentle Massage',
          instruction: 'Massage gently without scrubbing aggressively, especially around sensitive areas.'
        },
        {
          step: 4,
          title: 'Rinse Thoroughly',
          instruction: 'Rinse thoroughly with clean water.'
        },
        {
          step: 5,
          title: 'Avoid Eye Area',
          instruction: 'Avoid contact with the eyes. If contact occurs, rinse thoroughly with water.'
        }
      ],
      usageAdvice: 'Avoid contact with the eyes. Massage gently without scrubbing aggressively, especially around sensitive areas. Discontinue use if irritation occurs.',
      productDetails: {
        brand: 'SENSEIN',
        range: '5 IN 1 Total',
        productName: '5 IN 1 Total Face Cleanup Facewash',
        productType: 'Facewash / Facial Cleanser',
        variant: 'Total Face Cleanup',
        netQuantity: '100 ml (3.38 fl. oz.), when packed',
        keyIngredients: 'Hyaluronic Acid, Walnut Powder, Glycerin and Trehalose',
        keyFeatures: 'Cleansing, Exfoliation, Hydration, Brighter Looking Skin, Oil Control',
        suitableFor: 'Men & Women (All Skin Types)',
        countryOfOrigin: 'PRC, as printed on the packaging',
        importedAndMarketedBy: 'Olive Enterprise, Mota Varachha, Surat, Gujarat, India – 394101',
        manufacturedBy: 'Guangzhou Forte Cosmetics Company Limited, Guangzhou, China.',
        shelfLife: '36 months from manufacturing date',
        customerCareEmail: 'info@sensein.in'
      },
      benefits: [
        'Cleansing: Helps remove everyday dirt and impurities.',
        'Exfoliation: Walnut Powder helps exfoliate dead skin cells.',
        'Hydration: Hyaluronic Acid helps maintain skin moisture.',
        'Smoother-Looking Skin: Helps improve the feel and appearance of skin texture.',
        'Radiant Appearance: Helps skin look fresh and brighter.',
        'Oil Control: Helps balance oil and reduces excess shine.',
        'For Men & Women: Suitable for all skin types.'
      ],
      ingredients: {
        keyActives: [
          { name: 'Hyaluronic Acid', role: 'Attracts and retains moisture for plump, hydrated skin' },
          { name: 'Walnut Powder', role: 'Natural gentle micro-exfoliant that clears away dead skin cells' },
          { name: 'Glycerin', role: 'Keeps skin fresh, moisturized, and barrier-protected' },
          { name: 'Trehalose', role: 'Cellular moisture retention that prevents post-wash dehydration' },
          { name: 'Aqua (Water)', role: 'Base for the formula' },
          { name: 'Cocamidopropyl Betaine', role: 'Mild cleansing agent providing rich gentle lather' },
          { name: 'Decyl Glucoside', role: 'Gentle plant-derived surfactant suitable for sensitive skin' },
          { name: 'Polyquaternium-10', role: 'Leaves a smooth, conditioned skin texture' },
          { name: 'Cellulose', role: 'Provides natural texture and gentle exfoliating support' },
          { name: 'Fragrance', role: 'Adds a fresh revitalizing scent' },
          { name: 'Phenoxyethanol', role: 'Preserves formula freshness' },
          { name: 'EDTA', role: 'Maintains product clarity and stability' },
          { name: 'CI 19140', role: 'Cosmetic colorant' }
        ],
        fullList: 'Aqua, Cocamidopropyl Betaine, Decyl Glucoside, Glycerin, Acrylates/C10-30 Alkyl Acrylate Crosspolymer, Sodium Hydroxide, Sodium Chloride, PEG-40 Hydrogenated Castor Oil, Sodium Styrene/Acrylates Copolymer, Cellulose, Polyquaternium-10, Phenoxyethanol, Fragrance, Walnut Powder, Hyaluronic Acid, EDTA, Trehalose, CI 19140.'
      },
      faqs: [
        {
          question: 'Who can use SENSEIN 5 IN 1 Facewash?',
          answer: 'The product is labelled for both men and women and is suitable for all skin types.'
        },
        {
          question: 'What are its main ingredients?',
          answer: 'The packaging lists Hyaluronic Acid, Walnut Powder, Glycerin and Trehalose, among other ingredients.'
        },
        {
          question: 'Does it help exfoliate the skin?',
          answer: 'Yes. Walnut Powder is included for physical exfoliation, helping remove dead skin cells from the skin\'s surface.'
        },
        {
          question: 'Does it help with hydration?',
          answer: 'Hyaluronic Acid, Glycerin and Trehalose are used to support skin hydration.'
        },
        {
          question: 'What is the pack size?',
          answer: 'The net quantity is 100 ml (3.38 fl. oz.).'
        },
        {
          question: 'How should I use it?',
          answer: 'Take a sufficient amount, lather with water, massage gently without aggressive scrubbing, and rinse thoroughly. Avoid the eye area.'
        }
      ],
      additionalInfo: {
        brand: 'SENSEIN 5 IN 1 Total',
        packagingNetQuantity: '100 ml (3.38 fl. oz.), when packed',
        storageInstructions: 'Store in a cool, dry place away from direct sunlight.',
        caution: 'Avoid contact with the eyes. Do not scrub aggressively on sensitive skin. Discontinue use if irritation occurs.',
        shelfLife: '36 months from manufacturing date',
        countryOfOrigin: 'PRC, as printed on the packaging',
        importedAndMarketedBy: 'Olive Enterprise, Mota Varachha, Surat, Gujarat, India – 394101',
        manufacturedBy: 'Guangzhou Forte Cosmetics Company Limited, Guangzhou, China.',
        customerCareEmail: 'info@sensein.in'
      },
      reviews: [
        {
          id: 'rev-5in1-01',
          author: 'Nisha Singhal',
          rating: 5,
          title: 'Gentle walnut scrub with instant glow!',
          content: 'The walnut micro-granules are very gentle, not harsh like older scrubs. Leaves face soft, clean and glowing without any tightness thanks to the hyaluronic acid. Great for both me and my brother!',
          date: '2026-04-20',
          verifiedBuyer: true
        },
        {
          id: 'rev-5in1-02',
          author: 'Kunal Deshmukh',
          rating: 5,
          title: 'Best daily face cleanup',
          content: 'Removes all dead skin and pollution oil easily. Fresh scent and smooth skin feeling all day long. Unbeatable price at ₹249.',
          date: '2026-04-20',
          verifiedBuyer: true
        }
      ]
    },
    {
      id: 'sensein-volumizing-hair-style-powder',
      slug: 'volumizing-hair-style-powder',
      name: 'Volumizing Hair Style Powder',
      subtitle: 'Instant Volume • Matte Finish • Styling Hold',
      brand: 'SENSEIN Professional',
      category: 'Hair Styling',
      curatedCollection: 'Best Sellers',
      price: 699,
      mrp: 899,
      originalPrice: 899,
      discountPercentage: 22,
      netVolume: '10 g (0.35 fl. oz.)',
      variants: [
        { size: '10 g (0.35 fl. oz.)', price: 699, mrp: 899, inStock: true }
      ],
      rating: 4.9,
      reviewCount: 38,
      stock: 150,
      badge: 'Professional Styling',
      badges: ['Professional Styling', 'Matte Finish'],
      inStock: true,
      isFeatured: true,
      isNewArrival: true,
      shortDescription: 'SENSEIN Professional Volumizing Hair Style Powder (10 g) adds instant root lift, texture, and a natural matte finish without weighing hair down.',
      description: 'Style your hair with SENSEIN Professional Volumizing Hair Style Powder. Designed for lightweight styling, this powder helps add lift at the roots and creates a fuller, more textured appearance without the heavy feel of traditional styling products.\n\nIts fine-textured formula is designed to help give hair a matte finish and support a variety of hairstyles, from casual, tousled looks to more structured styles.\n\nWhether you want extra root volume or a textured everyday hairstyle, SENSEIN Professional Volumizing Hair Style Powder offers a convenient way to refresh your styling routine.',
      images: [
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792518805/sensein/products/sensein-volumizing-hair-powder-hero.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792518807/sensein/products/sensein-volumizing-hair-powder-ingredients.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792518808/sensein/products/sensein-volumizing-hair-powder-before-after.jpg'
      ],
      size: '10 g (0.35 fl. oz.)',
      tags: [
        'hair powder',
        'volumizing powder',
        'hair styling',
        'matte finish',
        'root lift',
        'textured hair',
        'hold ability',
        'professional'
      ],
      howToUse: [
        {
          step: 1,
          title: 'Ensure Dry Hair',
          instruction: 'Ensure your hair is completely dry before application.'
        },
        {
          step: 2,
          title: 'Apply Powder',
          instruction: 'Apply a small amount of powder directly to the hair from approximately 10 cm away, as directed on the packaging.'
        },
        {
          step: 3,
          title: 'Distribute with Fingers',
          instruction: 'Spread the powder through your hair using your fingers.'
        },
        {
          step: 4,
          title: 'Lift Roots and Shape',
          instruction: 'Lift the roots and shape your hair to achieve your desired style.'
        },
        {
          step: 5,
          title: 'Build Gradually',
          instruction: 'Add a small amount more if needed. Start with a small quantity and build gradually to avoid excessive powder buildup.'
        }
      ],
      usageAdvice: 'Ensure hair is dry before application. Start with a small quantity from ~10 cm away and build gradually to avoid excessive powder buildup.',
      productDetails: {
        brand: 'SENSEIN',
        range: 'Professional',
        productName: 'Volumizing Hair Style Powder',
        productCategory: 'Hair Styling',
        productType: 'Hair Styling Powder',
        netQuantity: '10 g (0.35 fl. oz.)',
        finish: 'Matte',
        mainBenefits: 'Volume, texture and styling hold',
        holdAbility: 'Medium Flexible Hold (++)',
        matteFinish: 'Natural Matte (++)',
        hairVolume: 'Maximum Volume (+++)',
        keyIngredients: 'Fumed Silica, Silica and Polyvinyl Pyrrolidone',
        suitableFor: 'Men & Women (All Hair Types)',
        countryOfOrigin: 'PRC, as printed on the packaging',
        importedAndMarketedBy: 'Olive Enterprise, Mota Varachha, Surat, Gujarat, India – 394101',
        manufacturedBy: 'Guangzhou Forte Cosmetics Company Limited, Guangzhou, China.',
        shelfLife: '36 months from manufacturing date',
        customerCareEmail: 'info@sensein.in'
      },
      benefits: [
        'Hair Volume: Helps create a fuller-looking hairstyle.',
        'Texture Enhancement: Adds definition and texture for styling.',
        'Matte Finish: Helps achieve a natural-looking, low-shine finish.',
        'Styling Hold: Helps keep hair in place.',
        'Lightweight Feel: Designed to add lift without weighing hair down.',
        'Versatile Styling: Suitable for creating casual and structured hairstyles.',
        'Oil Absorption: Fumed Silica helps absorb excess oil at roots for a fresh look.'
      ],
      ingredients: {
        keyActives: [
          { name: 'Fumed Silica', role: 'Helps absorb oil and create a fuller look' },
          { name: 'Silica', role: 'Adds texture and supports root volume' },
          { name: 'Polyvinyl Pyrrolidone (PVP)', role: 'Helps hold hair in place with lightweight control' }
        ],
        fullList: 'Fumed Silica, Silica, Polyvinyl Pyrrolidone (PVP).'
      },
      faqs: [
        {
          question: 'What is SENSEIN Volumizing Hair Style Powder?',
          answer: 'It is a hair styling powder designed to add volume, texture and a matte finish.'
        },
        {
          question: 'Does it help create fuller-looking hair?',
          answer: 'Yes, it is designed to provide lift and texture for a fuller-looking appearance.'
        },
        {
          question: 'What finish does it provide?',
          answer: 'The product is intended to provide a matte finish without any greasy residue.'
        },
        {
          question: 'How much product is included?',
          answer: 'The pack contains 10 g (0.35 fl. oz.).'
        },
        {
          question: 'What are its main ingredients?',
          answer: 'The visible label lists Fumed Silica, Silica and Polyvinyl Pyrrolidone.'
        },
        {
          question: 'How should it be applied?',
          answer: 'Apply directly onto dry hair from approximately 10 cm away, then use your fingertips to massage into the roots and style as desired.'
        }
      ],
      additionalInfo: {
        brand: 'SENSEIN Professional',
        packagingNetQuantity: '10 g (0.35 fl. oz.)',
        storageInstructions: 'Store in a cool, dry place. Keep container closed tightly.',
        caution: 'For external use only. Avoid contact with eyes and avoid inhaling powder. Keep out of reach of children.',
        shelfLife: '36 months from manufacturing date',
        countryOfOrigin: 'PRC, as printed on the packaging',
        importedAndMarketedBy: 'Olive Enterprise, Mota Varachha, Surat, Gujarat, India – 394101',
        manufacturedBy: 'Guangzhou Forte Cosmetics Company Limited, Guangzhou, China.',
        customerCareEmail: 'info@sensein.in'
      },
      reviews: [
        {
          id: 'rev-powder-01',
          author: 'Aman Patel',
          rating: 5,
          title: 'Insane root volume in seconds',
          content: 'Just a small sprinkle at the roots and instant matte volume! Completely invisible and lasts all day without feeling sticky.',
          date: '2026-04-20',
          verifiedBuyer: true
        },
        {
          id: 'rev-powder-02',
          author: 'Rohit Sharma',
          rating: 5,
          title: 'Perfect matte texture',
          content: 'Gives that effortless textured messy quiff with zero shine. Best styling powder for daily use.',
          date: '2026-04-20',
          verifiedBuyer: true
        }
      ]
    },
    {
      id: 'sensein-hair-smoothing-perfume-spray',
      slug: 'hair-smoothing-perfume-spray',
      name: 'Hair Smoothing + Perfume Spray',
      subtitle: 'Smooth Hair • Shine More • Smell Amazing',
      brand: 'SENSEIN Professional',
      category: 'Hair Care',
      curatedCollection: 'Best Sellers',
      price: 975,
      mrp: 1299,
      originalPrice: 1299,
      discountPercentage: 25,
      netVolume: '100 ml (3.38 fl. oz.)',
      variants: [
        { size: '100 ml (3.38 fl. oz.)', price: 975, mrp: 1299, inStock: true }
      ],
      rating: 4.9,
      reviewCount: 42,
      stock: 120,
      badge: 'Signature Scent',
      badges: ['Signature Scent', 'Salon Shine'],
      inStock: true,
      isFeatured: true,
      isNewArrival: true,
      shortDescription: 'SENSEIN Professional Hair Smoothing + Perfume Spray (100 ml) offers instant smoothness, luminous shine, frizz control, and a captivating luxury fragrance.',
      description: 'Smooth Hair. Shine More. Smell Amazing.\n\nExperience smoother-looking, shinier and beautifully fragranced hair with SENSEIN Professional Hair Smoothing + Perfume Spray.\n\nDesigned for both men and women, this hair care spray helps improve the appearance of hair by supporting softness, shine and manageability. Its conditioning formula helps hair retain moisture and provides a pleasant fragrance for a refreshed hair-care experience.\n\nWhether you\'re getting ready for work, a special occasion or your everyday routine, SENSEIN Professional Hair Smoothing + Perfume Spray is a convenient addition to your hair-care essentials.',
      images: [
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792519318/sensein/products/sensein-hair-smoothing-perfume-spray-hero.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792519319/sensein/products/sensein-hair-smoothing-perfume-spray-handheld.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792519320/sensein/products/sensein-hair-smoothing-perfume-spray-ingredients.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792519321/sensein/products/sensein-hair-smoothing-perfume-spray-application.jpg'
      ],
      size: '100 ml (3.38 fl. oz.)',
      tags: [
        'hair spray',
        'perfume spray',
        'hair smoothing',
        'hair fragrance',
        'shine spray',
        'frizz control',
        'hydrolyzed silk',
        'd-panthenol',
        'professional'
      ],
      howToUse: [
        {
          step: 1,
          title: 'Towel Dry Hair',
          instruction: 'After shampooing, gently dry your hair until it is no longer dripping wet.'
        },
        {
          step: 2,
          title: 'Apply Evenly',
          instruction: 'Hold the spray nozzle a few inches away and apply the Hair Smoothing + Perfume Spray evenly through your hair.'
        },
        {
          step: 3,
          title: 'Distribute & Massage',
          instruction: 'Massage gently for a few minutes to help distribute the product evenly along the hair lengths and ends.'
        },
        {
          step: 4,
          title: 'Allow Absorption',
          instruction: 'Allow the nourishing formula to be absorbed into the hair cuticle.'
        },
        {
          step: 5,
          title: 'Style as Desired',
          instruction: 'Style your hair as desired for a smooth, glossy, and beautifully fragranced finish.'
        }
      ],
      usageAdvice: 'Use on damp hair after washing or on dry hair anytime to tame flyaways, boost shine, and refresh your hair scent throughout the day.',
      productDetails: {
        brand: 'SENSEIN Professional',
        productName: 'Hair Smoothing + Perfume Spray',
        productCategory: 'Hair Care & Styling',
        productType: 'Hair Smoothing & Fragrance Spray',
        netQuantity: '100 ml (3.38 fl. oz.)',
        targetAudience: 'Women & Men',
        mainBenefits: 'Hydration, smoothness, shine and fragrance',
        keyIngredients: 'Hydrolyzed Silk, D-Panthenol, Propanediol, Amodimethicone',
        suitableFor: 'All Hair Types (Coloured & Chemically Treated Hair included)',
        countryOfOrigin: 'PRC, as printed on the packaging',
        importedAndMarketedBy: 'Olive Enterprise, Mota Varachha, Surat, Gujarat – 394101',
        manufacturedBy: 'Guangzhou Forte Cosmetics Company Limited, Guangzhou, China.',
        shelfLife: '36 months from manufacturing date',
        customerCareEmail: 'info@sensein.in',
        customerCareNumber: '18008910710'
      },
      benefits: [
        'Hair Hydration: Helps maintain hair moisture.',
        'Smooth-Looking Hair: Helps improve hair softness and manageability.',
        'Enhanced Shine: Supports a shinier, glossier hair appearance.',
        'Long-Lasting Fragrance: Leaves hair smelling wonderfully fresh and luxurious all day.',
        'Frizz Control: Helps tame unruly flyaways and protects against humidity.',
        'Everyday Hair Care: Suitable for daily use on both damp and dry hair.'
      ],
      ingredients: {
        keyActives: [
          { name: 'Hydrolyzed Silk', role: 'Strengthens hair strands, adds brilliant shine, and leaves hair silky-soft' },
          { name: 'D-Panthenol (Pro-Vitamin B5)', role: 'Deeply moisturizes hair, improves softness, and helps repair split ends' },
          { name: 'Propanediol', role: 'Natural humectant that retains moisture and keeps hair touchably soft' },
          { name: 'Amodimethicone', role: 'Targeted conditioning silicone that smooths damaged cuticles with long-lasting protection' },
          { name: 'Dimethicone', role: 'Coats hair to give instant smoothness, shine, and lightweight frizz resistance' },
          { name: 'Steartrimonium Chloride', role: 'Anti-static conditioning agent that detangles and eases styling' },
          { name: 'Polyquaternium-10', role: 'Provides flexible film-forming hold, smoothness, and anti-frizz control' },
          { name: 'Cetearyl Alcohol', role: 'Fatty alcohol that conditions and softens hair shafts' },
          { name: 'Fragrance', role: 'Captivating signature scent for a refreshed salon experience' },
          { name: 'Aqua', role: 'Purified water solvent base' }
        ],
        fullList: 'Aqua, Cetearyl Alcohol, Stearamtrimonium Chloride, Propanediol, Polyquaternium-10, Dimethicone, Isopropyl Palmitate, Amodimethicone, Hydrolyzed Silk, Phenoxyethanol, Fragrance, D-panthenol, PEG-400, Glyceryl Stearate.'
      },
      faqs: [
        {
          question: 'What is SENSEIN Hair Smoothing + Perfume Spray?',
          answer: 'It is a dual-benefit leave-in hair spray designed to support smoothness, shine, moisture retention, and an all-day luxury fragrance.'
        },
        {
          question: 'Is it suitable for both men and women?',
          answer: 'Yes, the packaging and formula are specially formulated for both women and men.'
        },
        {
          question: 'What is the pack size?',
          answer: 'The bottle contains 100 ml (3.38 fl. oz.).'
        },
        {
          question: 'Can I use it on dry hair?',
          answer: 'Yes! While ideal on towel-dried hair after washing, you can also mist lightly over dry styled hair to eliminate frizz, add instant shine, and refresh its fragrance.'
        },
        {
          question: 'What are its main benefits?',
          answer: 'Deep hydration, smooth-looking hair, enhanced shine, exquisite fragrance, and effortless manageability.'
        },
        {
          question: 'How long is the product shelf life?',
          answer: 'The packaging states 36 months from the date of manufacturing.'
        }
      ],
      additionalInfo: {
        brand: 'SENSEIN Professional',
        packagingNetQuantity: '100 ml (3.38 fl. oz.)',
        storageInstructions: 'Store in a cool, dry place away from heat and direct sunlight.',
        caution: 'For external use only. Avoid spraying directly into eyes. In case of eye contact, rinse immediately with clean water.',
        shelfLife: '36 months from manufacturing date',
        countryOfOrigin: 'PRC, as printed on the packaging',
        importedAndMarketedBy: 'Olive Enterprise, Mota Varachha, Surat, Gujarat – 394101',
        manufacturedBy: 'Guangzhou Forte Cosmetics Company Limited, Guangzhou, China.',
        customerCareEmail: 'info@sensein.in',
        customerCareNumber: '18008910710'
      },
      reviews: [
        {
          id: 'rev-spray-01',
          author: 'Ananya Roy',
          rating: 5,
          title: 'Smells heavenly and instant salon gloss!',
          content: 'The fragrance is so luxurious, lasts all day long! Plus it took away all my morning frizz in just three sprays. Hair feels like silk.',
          date: '2026-04-20',
          verifiedBuyer: true
        },
        {
          id: 'rev-spray-02',
          author: 'Vikram Mehta',
          rating: 5,
          title: 'Lightweight smoothing without greasiness',
          content: 'Doesn\'t weigh down hair at all. Gives nice natural shine and keeps hair soft and fresh-smelling all day. Worth every rupee.',
          date: '2026-04-20',
          verifiedBuyer: true
        }
      ]
    },
    {
      id: 'sensein-leave-in-cream-hair-moisturiser',
      slug: 'leave-in-cream-hair-moisturiser',
      name: 'Leave-In Cream with Hair Moisturiser',
      subtitle: 'Hydration • Enhanced Shine • Improved Elasticity • Frizz Control',
      brand: 'SENSEIN Professional',
      category: 'Hair Care',
      curatedCollection: 'Best Sellers',
      price: 575,
      mrp: 799,
      originalPrice: 799,
      discountPercentage: 28,
      netVolume: '100 ml (3.38 fl. oz.)',
      variants: [
        { size: '100 ml (3.38 fl. oz.)', price: 575, mrp: 799, inStock: true }
      ],
      rating: 4.8,
      reviewCount: 36,
      stock: 140,
      badge: 'Moisture Lock',
      badges: ['Moisture Lock', 'Daily Defense'],
      inStock: true,
      isFeatured: true,
      isNewArrival: true,
      shortDescription: 'SENSEIN Professional Leave-In Cream with Hair Moisturiser (100 ml) replenishes dry hair, controls frizz, and provides lasting softness and shine without weighing hair down.',
      description: 'SENSEIN Professional Leave-In Cream with Hair Moisturiser is formulated with plant-derived ingredients and moisturising agents to help improve the feel and appearance of hair.\n\nDesigned for everyday hair-care routines, this leave-in cream helps address dryness and frizz while supporting softness, shine and manageability. It is suitable for both men and women.\n\nGuarding against environmental stressors and the harmful effects of styling practices, this lightweight formula locks in essential hydration for long-term hair health.',
      images: [
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792519683/sensein/products/sensein-leave-in-cream-hero.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792519685/sensein/products/sensein-leave-in-cream-texture.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792519686/sensein/products/sensein-leave-in-cream-handheld.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792519687/sensein/products/sensein-leave-in-cream-ingredients.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792519688/sensein/products/sensein-leave-in-cream-lifestyle.jpg'
      ],
      size: '100 ml (3.38 fl. oz.)',
      tags: [
        'leave in cream',
        'hair moisturiser',
        'frizz control',
        'niacinamide',
        'panthenol',
        'nymphaea odorata',
        'hair hydration',
        'professional'
      ],
      howToUse: [
        {
          step: 1,
          title: 'Dispense Adequate Amount',
          instruction: 'Take a sufficient amount of SENSEIN Professional Leave-In Cream with Hair Moisturiser into your palms.'
        },
        {
          step: 2,
          title: 'Apply Evenly',
          instruction: 'Apply the cream evenly to damp or dry hair, focusing on mid-lengths and ends.'
        },
        {
          step: 3,
          title: 'Gently Massage',
          instruction: 'Gently massage and comb through with fingers to distribute the product evenly.'
        },
        {
          step: 4,
          title: 'Allow Absorption',
          instruction: 'Allow the cream to be absorbed into the hair shaft.'
        },
        {
          step: 5,
          title: 'Leave In & Style',
          instruction: 'This is a leave-in formula. Do not rinse out. Style your hair as desired.'
        }
      ],
      usageAdvice: 'Apply on towel-dried or dry hair before styling. Do not rinse out. Safe for daily use on colour-treated and natural hair.',
      productDetails: {
        brand: 'SENSEIN Professional',
        productName: 'Leave-In Cream with Hair Moisturiser',
        productCategory: 'Hair Care & Styling',
        productType: 'Leave-In Hair Cream',
        netQuantity: '100 ml (3.38 fl. oz.)',
        suitableFor: 'Women & Men (All Hair Types)',
        mainBenefits: 'Hydration, Enhanced Shine, Improved Elasticity, Long-Term Hair Health',
        keyIngredients: 'Niacinamide, Panthenol, Nymphaea Odorata Root Extract, Mentha Arvensis Leaf Oil',
        countryOfOrigin: 'PRC, as printed on the packaging',
        importedAndMarketedBy: 'Olive Enterprise, Mota Varachha, Surat, Gujarat – 394101',
        manufacturedBy: 'Guangzhou Forte Cosmetics Company Limited, Guangzhou, China.',
        shelfLife: '36 months from manufacturing date',
        customerCareEmail: 'info@sensein.in',
        customerCareNumber: '18008910710'
      },
      benefits: [
        'Hair Hydration: Helps replenish moisture in dry and parched hair.',
        'Enhanced Shine: Helps hair look smoother, sleeker and shinier.',
        'Improved Elasticity: Supports softer, more manageable hair with natural bounce.',
        'Frizz Management: Controls flyaways and shields hair against humidity.',
        'Hair Conditioning: Softens hair fibers for effortless detangling and combability.',
        'Leave-In Convenience: Continuous all-day protection without any need to rinse.'
      ],
      ingredients: {
        keyActives: [
          { name: 'Panthenol (Pro-Vitamin B5)', role: 'Helps hydrate, repair, and dramatically improve hair softness' },
          { name: 'Niacinamide', role: 'Strengthens hair resilience and improves hair texture' },
          { name: 'Nymphaea Odorata Root Extract', role: 'Soothes and nourishes scalp and hair for healthier vitality' },
          { name: 'Cetyl & Stearyl Alcohol', role: 'Gentle fatty alcohols that soften hair and improve smoothness' },
          { name: 'Behentrimonium Methosulfate', role: 'Plant-derived detangling conditioner that eliminates static' },
          { name: 'Citric Acid', role: 'Maintains optimal pH balance to seal and protect hair cuticles' },
          { name: 'Mentha Arvensis Leaf Oil', role: 'Adds a revitalizing botanical freshness' },
          { name: 'Aqua', role: 'Base ingredient that provides immediate hydration' }
        ],
        fullList: 'Aqua, Cetyl Alcohol, Disodium EDTA, Stearyl Alcohol, Behentrimonium Methosulfate, Citric Acid, Benzyl Alcohol, Panthenyl Ethyl Ether, Parfum, Niacinamide, Sodium Benzoate, Nymphaea Odorata Root Extract, Mentha Arvensis Leaf Oil, Fragrance.'
      },
      faqs: [
        {
          question: 'What is SENSEIN Leave-In Cream with Hair Moisturiser?',
          answer: 'It is a leave-in hair-conditioning cream designed to help moisturise hair and improve softness, shine and manageability.'
        },
        {
          question: 'Is it suitable for men and women?',
          answer: 'Yes, the packaging specifies that it is suitable for both women and men.'
        },
        {
          question: 'Do I need to rinse the cream out?',
          answer: 'No, it is a leave-in product designed to stay in your hair throughout the day for continuous hydration and frizz control.'
        },
        {
          question: 'What is the net quantity?',
          answer: 'The pack contains 100 ml (3.38 fl. oz.).'
        },
        {
          question: 'What are its main benefits?',
          answer: 'Moisture support, enhanced shine, improved elasticity, frizz control, and better hair manageability.'
        },
        {
          question: 'How should the product be stored?',
          answer: 'Store it in a cool, dry place away from direct sunlight.'
        }
      ],
      additionalInfo: {
        brand: 'SENSEIN Professional',
        packagingNetQuantity: '100 ml (3.38 fl. oz.)',
        storageInstructions: 'Store in a cool, dry place away from direct sunlight.',
        caution: 'For external use only. Avoid contact with eyes. If contact occurs, rinse thoroughly with water.',
        shelfLife: '36 months from manufacturing date',
        countryOfOrigin: 'PRC, as printed on the packaging',
        importedAndMarketedBy: 'Olive Enterprise, Mota Varachha, Surat, Gujarat – 394101',
        manufacturedBy: 'Guangzhou Forte Cosmetics Company Limited, Guangzhou, China.',
        customerCareEmail: 'info@sensein.in',
        customerCareNumber: '18008910710'
      },
      reviews: [
        {
          id: 'rev-lic-01',
          author: 'Priya Verma',
          rating: 5,
          title: 'Tamed my dry frizz completely!',
          content: 'I apply a coin-sized amount after showering and my hair stays manageable, super soft and frizz-free all day. No oily feel at all!',
          date: '2026-04-20',
          verifiedBuyer: true
        },
        {
          id: 'rev-lic-02',
          author: 'Rajiv Nambiar',
          rating: 5,
          title: 'Great everyday hair cream',
          content: 'Much better than sticky oils or gels. Keeps hair moisturized with natural shine and nice subtle fragrance.',
          date: '2026-04-20',
          verifiedBuyer: true
        }
      ]
    },
    {
      id: 'sensein-hair-face-care-combo-pack',
      slug: 'hair-face-care-combo-pack',
      name: 'Hair & Face Care Combo Pack – 3 × 50 ml',
      subtitle: 'Complete Grooming Routine • Shampoo + Leave-In Cream + Facewash',
      brand: 'SENSEIN Professional',
      category: 'Combos',
      curatedCollection: 'Best Sellers',
      price: 549,
      mrp: 849,
      originalPrice: 849,
      discountPercentage: 35,
      netVolume: '150 ml (3 × 50 ml)',
      variants: [
        { size: '3 × 50 ml (150 ml)', price: 549, mrp: 849, inStock: true }
      ],
      rating: 4.9,
      reviewCount: 52,
      stock: 200,
      badge: 'Value Combo',
      badges: ['Value Combo', 'Travel Friendly', '3-in-1 Kit'],
      inStock: true,
      isFeatured: true,
      isNewArrival: true,
      shortDescription: 'SENSEIN Professional Hair & Face Care Combo Pack (3 × 50 ml) brings complete daily grooming together: Argan + Keratin Shampoo, Leave-In Moisture Cream, and 5 IN 1 Cleanup Facewash.',
      description: 'Complete Your Hair & Skin Care Routine with One Combo\n\nDiscover everyday grooming essentials with the SENSEIN Professional Hair & Face Care Combo Pack. This convenient set combines two hair-care products and one facewash to support a simple, practical personal care routine.\n\nWhether you are refreshing at home, hitting the gym, or travelling, this 3-piece kit delivers comprehensive hair smoothing, leave-in moisture conditioning, and deep facial cleanup in compact, travel-friendly bottles.',
      images: [
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792520126/sensein/products/sensein-combo-pack-packshot.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792520128/sensein/products/sensein-combo-pack-travel-kit.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792520130/sensein/products/sensein-combo-pack-textures.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792520151/sensein/products/sensein-combo-pack-creative.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1792520159/sensein/products/sensein-combo-pack-swatches.jpg'
      ],
      size: '150 ml (3 × 50 ml)',
      tags: [
        'combo pack',
        'hair and face care',
        'travel kit',
        'shampoo',
        'leave in cream',
        'facewash',
        'argan keratin',
        '5 in 1 facewash',
        'grooming kit'
      ],
      howToUse: [
        {
          step: 1,
          title: 'Cleanse Your Hair',
          instruction: 'Wet your hair thoroughly, apply the Argan + Keratin Smoothing Shampoo, gently massage hair and scalp for 2 minutes, and rinse thoroughly with clean water.'
        },
        {
          step: 2,
          title: 'Moisturise & Condition',
          instruction: 'Apply a suitable amount of Leave-In Cream evenly through towel-dried hair. Do not rinse out; style as desired.'
        },
        {
          step: 3,
          title: 'Cleanse Your Face',
          instruction: 'Wet your face with clean water, gently massage a small amount of 5 IN 1 Total Face Cleanup Facewash in circular motions, and rinse thoroughly.'
        },
        {
          step: 4,
          title: 'Daily Care Routine',
          instruction: 'Use each product according to individual needs for smooth, manageable hair and fresh, radiant skin every day.'
        }
      ],
      usageAdvice: 'Use Shampoo and Facewash during shower; apply Leave-In Cream on towel-dried hair before styling. Suitable for daily use.',
      productDetails: {
        brand: 'SENSEIN',
        range: 'SENSEIN Professional',
        productName: 'Hair & Face Care Combo Pack',
        comboType: 'Hair Care + Facial Care',
        numberOfProducts: '3 Products (Shampoo 50 ml + Leave-In Cream 50 ml + Facewash 50 ml)',
        totalNetQuantity: '150 ml (3 × 50 ml / 3 × 1.69 fl. oz.)',
        suitableFor: 'Men and Women (All Hair & Skin Types)',
        countryOfOrigin: 'PRC, as indicated on the supplied packaging',
        importedAndMarketedBy: 'Olive Enterprise, Surat, Gujarat, India – 394101',
        manufacturedBy: 'Guangzhou Forte Cosmetics Company Limited, Guangzhou, China.',
        shelfLife: '36 months from manufacturing date',
        customerCareEmail: 'info@sensein.in',
        customerCareNumber: '18008910710'
      },
      benefits: [
        'Complete Grooming Combo: Combines two hair-care products and one facewash for head-to-toe freshness.',
        'Hair Moisture Care: The leave-in cream supports deep conditioning, softness and moisture retention.',
        'Smoother-Feeling Hair: The shampoo and leave-in cream work synergistically for frizz-free smoothness.',
        'Everyday Hair Cleansing: Gently clears away sebum, sweat and pollution from scalp and lengths.',
        'Facial Cleansing & Exfoliation: Facewash removes impurities and dead skin cells with walnut powder.',
        'Multi-Benefit Skincare: Delivers 5 benefits in one: cleansing, exfoliation, hydration, brightness and oil control.',
        'Convenient Travel Pack: Three leak-proof 50 ml bottles in a compact kit, easy to carry anywhere.',
        'For Men and Women: Dermatologically aligned and suitable for everyone.'
      ],
      ingredients: {
        keyActives: [
          { name: 'Argan Oil & Hydrolyzed Keratin', role: 'In Shampoo: Restores hair softness, repairs split ends, and controls frizz' },
          { name: 'Niacinamide & Panthenol', role: 'In Leave-In Cream: Deep cellular moisture, improves hair elasticity and luster' },
          { name: 'Hyaluronic Acid & Walnut Powder', role: 'In 5 IN 1 Facewash: Exfoliates dead cells while retaining skin hydration' },
          { name: 'Nymphaea Odorata Root Extract', role: 'Soothes hair cuticles and prevents environmental dehydration' }
        ],
        fullList: 'Pack combines 3 complete formulations: (1) Leave-In Cream 50ml: Aqua, Cetyl Alcohol, Disodium EDTA, Stearyl Alcohol, Behentrimonium Methosulfate, Citric Acid, Benzyl Alcohol, Panthenyl Ethyl Ether, Parfum, Niacinamide, Sodium Benzoate, Nymphaea Odorata Root Extract, Mentha Arvensis Leaf Oil. (2) Argan + Keratin Shampoo 50ml: Aqua, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Argania Spinosa Kernel Oil, Hydrolyzed Keratin, D-Panthenol, Jojoba Seed Oil, Fragrance. (3) 5 IN 1 Cleanup Facewash 50ml: Aqua, Cocamidopropyl Betaine, Decyl Glucoside, Glycerin, Walnut Powder, Hyaluronic Acid, Trehalose, Cellulose, Fragrance.'
      },
      faqs: [
        {
          question: 'What is included in the SENSEIN Professional Hair & Face Care Combo Pack?',
          answer: 'It includes Leave-In Cream with Hair Moisturiser (50 ml), Argan + Keratin Smoothing Shampoo (50 ml), and 5 IN 1 Total Face Cleanup Facewash (50 ml).'
        },
        {
          question: 'What is the total quantity of the combo?',
          answer: 'The pack contains three products of 50 ml each, giving a total net quantity of 150 ml (3 × 1.69 fl. oz.).'
        },
        {
          question: 'Can men and women use this combo?',
          answer: 'Yes! All three products are designed for both men and women across all skin and hair types.'
        },
        {
          question: 'What is the purpose of the leave-in cream?',
          answer: 'It is designed to support hair moisture care, conditioning, shine and manageability without needing to rinse.'
        },
        {
          question: 'What are the highlighted ingredients in the shampoo?',
          answer: 'Argan Oil and Hydrolyzed Keratin are highlighted to provide nourishment, frizz control, and smooth shine.'
        },
        {
          question: 'What does the facewash offer?',
          answer: 'The 5 IN 1 Total Face Cleanup Facewash is positioned as a multi-benefit cleanser providing cleansing, exfoliation, hydration, brightness, and oil control.'
        },
        {
          question: 'Is this combo convenient for travel?',
          answer: 'Yes, the three compact 50 ml bottles are ideal for travel, gym sessions, and daily carry.'
        }
      ],
      additionalInfo: {
        brand: 'SENSEIN Professional',
        packagingNetQuantity: '150 ml (3 × 50 ml)',
        storageInstructions: 'Store in a cool, dry place away from direct sunlight.',
        caution: 'For external use only. Avoid contact with eyes. Discontinue use if irritation occurs.',
        shelfLife: '36 months from manufacturing date',
        countryOfOrigin: 'PRC, as indicated on the supplied packaging',
        importedAndMarketedBy: 'Olive Enterprise, Surat, Gujarat, India – 394101',
        manufacturedBy: 'Guangzhou Forte Cosmetics Company Limited, Guangzhou, China.',
        customerCareEmail: 'info@sensein.in',
        customerCareNumber: '18008910710'
      },
      reviews: [
        {
          id: 'rev-combo-01',
          author: 'Rohit Bansal',
          rating: 5,
          title: 'Ultimate travel grooming kit',
          content: 'Took this on my week-long business trip. The 50ml sizes passed security easily, the shampoo leaves hair smooth, and the facewash is super refreshing. Best ₹549 spent!',
          date: '2026-04-20',
          verifiedBuyer: true
        },
        {
          id: 'rev-combo-02',
          author: 'Meera Chawla',
          rating: 5,
          title: 'Complete routine in one pack',
          content: 'Great value combo. All 3 bottles are high quality salon formulas. The leave-in cream and shampoo work wonders for my hair!',
          date: '2026-04-20',
          verifiedBuyer: true
        }
      ]
    }
  ];

  async findAll(filters?: {
    category?: string;
    collection?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    search?: string;
    sort?: string;
  }): Promise<{ products: any[]; total: number }> {
    const query: any = {};
    if (filters?.category && filters.category.toLowerCase() !== 'all') {
      const cat = filters.category.trim();
      if (/^combos?$/i.test(cat) || /travelling/i.test(cat) || /kit/i.test(cat)) {
        query.$or = [{ category: /combo/i }, { category: /kit/i }, { productType: 'combo' }];
      } else if (/mask/i.test(cat)) {
        query.category = /mask/i;
      } else if (/wax/i.test(cat)) {
        query.category = /wax/i;
      } else if (/oil/i.test(cat)) {
        query.category = /oil/i;
      } else if (/shampoo/i.test(cat)) {
        query.category = /shampoo/i;
      } else if (/facewash/i.test(cat) || /face/i.test(cat)) {
        query.category = /facewash|face/i;
      } else if (/serum/i.test(cat)) {
        query.category = /serum/i;
      } else {
        query.category = new RegExp(cat, 'i');
      }
    }
    if (filters?.collection && filters.collection.toLowerCase() !== 'all') {
      const col = filters.collection.trim();
      if (/bestseller/i.test(col)) {
        query.curatedCollection = /best\s*sellers?/i;
      } else {
        query.curatedCollection = new RegExp(col, 'i');
      }
    }
    if (filters?.minPrice !== undefined && !isNaN(filters.minPrice)) {
      query.price = { ...(query.price || {}), $gte: filters.minPrice };
    }
    if (filters?.maxPrice !== undefined && !isNaN(filters.maxPrice)) {
      query.price = { ...(query.price || {}), $lte: filters.maxPrice };
    }
    if (filters?.minRating !== undefined && !isNaN(filters.minRating)) {
      query.rating = { $gte: filters.minRating };
    }
    if (filters?.search && filters.search.trim()) {
      const regex = new RegExp(filters.search.trim(), 'i');
      query.$or = [{ name: regex }, { description: regex }, { category: regex }];
    }

    let sortOption: any = { createdAt: -1, _id: -1 };
    if (filters?.sort === 'price-low') sortOption = { price: 1 };
    else if (filters?.sort === 'price-high') sortOption = { price: -1 };
    else if (filters?.sort === 'rating') sortOption = { rating: -1 };
    else if (filters?.sort === 'discount') sortOption = { discountPercentage: -1 };

    let mapped: any[] = [];
    try {
      const dbProducts = await this.productModel.find(query).sort(sortOption).lean();
      mapped = (dbProducts || []).map((p: any) => ({
        ...p,
        id: p._id?.toString() || p.id,
      }));
    } catch (err: any) {
      this.logger.warn(`MongoDB product fetch notice: ${err.message}`);
    }

    // Collect all existing slugs and IDs from database products to prevent memory duplication
    const mappedSlugs = new Set<string>();
    const mappedIds = new Set<string>();

    for (const p of mapped) {
      if (p.slug) mappedSlugs.add(String(p.slug).toLowerCase().trim());
      if (p.id) mappedIds.add(String(p.id).toLowerCase().trim());
      if (p._id) mappedIds.add(String(p._id).toLowerCase().trim());
    }

    let memoryExtra = this.products.filter((p) => {
      const s = (p.slug || '').toLowerCase().trim();
      const id = String(p.id || '').toLowerCase().trim();
      const mongoId = (p as any)._id ? String((p as any)._id).toLowerCase().trim() : '';

      if (s && mappedSlugs.has(s)) return false;
      if (id && mappedIds.has(id)) return false;
      if (mongoId && mappedIds.has(mongoId)) return false;
      return true;
    });

    if (filters?.category && filters.category.toLowerCase() !== 'all') {
      const cat = filters.category.toLowerCase().trim();
      memoryExtra = memoryExtra.filter((p) => {
        const c = (p.category || '').toLowerCase();
        const pt = (p.productType || '').toLowerCase();
        if (cat.includes('combo') || cat.includes('kit')) {
          return pt === 'combo' || c.includes('combo') || c.includes('kit');
        }
        if (cat.includes('mask')) return c.includes('mask');
        if (cat.includes('wax')) return c.includes('wax');
        if (cat.includes('oil')) return c.includes('oil');
        if (cat.includes('shampoo')) return c.includes('shampoo');
        if (cat.includes('facewash') || cat.includes('face')) return c.includes('face') || c.includes('clean');
        return c.includes(cat);
      });
    }

    if (filters?.collection && filters.collection.toLowerCase() !== 'all') {
      const col = filters.collection.toLowerCase().trim();
      memoryExtra = memoryExtra.filter((p) => {
        const c = (p.curatedCollection || '').toLowerCase();
        if (col.includes('bestseller')) return c.includes('best') || c.includes('seller');
        return c.includes(col);
      });
    }

    if (filters?.minPrice !== undefined && !isNaN(filters.minPrice)) {
      memoryExtra = memoryExtra.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters?.maxPrice !== undefined && !isNaN(filters.maxPrice)) {
      memoryExtra = memoryExtra.filter((p) => p.price <= filters.maxPrice!);
    }
    if (filters?.minRating !== undefined && !isNaN(filters.minRating)) {
      memoryExtra = memoryExtra.filter((p) => (p.rating || 0) >= filters.minRating!);
    }
    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      memoryExtra = memoryExtra.filter(
        (p) =>
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q))
      );
    }

    // Merge memoryExtra (newest) and mapped, enforcing absolute uniqueness by slug and ID
    const seenSlugs = new Set<string>();
    const seenIds = new Set<string>();
    const combined: any[] = [];

    const addProductUnique = (item: any) => {
      if (!item) return;
      const s = (item.slug || '').toLowerCase().trim();
      const id = String(item.id || item._id || '').toLowerCase().trim();
      const mongoId = item._id ? String(item._id).toLowerCase().trim() : '';

      if (s && seenSlugs.has(s)) return;
      if (id && seenIds.has(id)) return;
      if (mongoId && seenIds.has(mongoId)) return;

      if (s) seenSlugs.add(s);
      if (id) seenIds.add(id);
      if (mongoId) seenIds.add(mongoId);

      combined.push({
        ...item,
        id: item.id || item._id?.toString() || s,
      });
    };

    memoryExtra.forEach(addProductUnique);
    mapped.forEach(addProductUnique);

    if (filters?.sort === 'price-low') combined.sort((a, b) => a.price - b.price);
    else if (filters?.sort === 'price-high') combined.sort((a, b) => b.price - a.price);
    else if (filters?.sort === 'rating') combined.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (filters?.sort === 'discount') combined.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));

    return { products: combined, total: combined.length };
  }

  async findOne(idOrSlug: string): Promise<any> {
    const isObjectId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);
    const condition: any = { $or: [{ slug: idOrSlug }, { id: idOrSlug }] };
    if (isObjectId) {
      condition.$or.push({ _id: idOrSlug });
    }
    // Also support finding the primary product if slug is 'hair-wax' or 'sensein-hair-wax'
    if (idOrSlug === 'sensein-hair-wax' || idOrSlug === 'hair-wax') {
      condition.$or.push({ slug: 'hair-wax' }, { id: 'sensein-hair-wax' });
    }
    if (
      idOrSlug === 'shampoo' ||
      idOrSlug === 'argan-keratin-shampoo' ||
      idOrSlug === 'argan-keratin-smoothing-shampoo' ||
      idOrSlug === 'sensein-argan-keratin-shampoo'
    ) {
      condition.$or.push(
        { slug: 'argan-keratin-smoothing-shampoo' },
        { id: 'sensein-argan-keratin-shampoo' }
      );
    }
    if (
      idOrSlug === 'mask' ||
      idOrSlug === 'hair-mask' ||
      idOrSlug === 'argan-keratin-hair-mask' ||
      idOrSlug === 'argan-keratin-smoothing-hair-mask' ||
      idOrSlug === 'sensein-argan-keratin-hair-mask'
    ) {
      condition.$or.push(
        { slug: 'argan-keratin-smoothing-hair-mask' },
        { id: 'sensein-argan-keratin-hair-mask' }
      );
    }
    if (
      idOrSlug === 'oil' ||
      idOrSlug === 'argan-oil' ||
      idOrSlug === 'argan-oil-for-hair-body' ||
      idOrSlug === 'sensein-argan-oil' ||
      idOrSlug === 'sensein-argan-oil-for-hair-body'
    ) {
      condition.$or.push(
        { slug: 'argan-oil-for-hair-body' },
        { id: 'sensein-argan-oil-for-hair-body' }
      );
    }
    if (
      idOrSlug === 'facewash' ||
      idOrSlug === 'charcoal-clay-facewash' ||
      idOrSlug === 'charcoal-clay-facewash-for-men' ||
      idOrSlug === 'sensein-charcoal-clay-facewash'
    ) {
      condition.$or.push(
        { slug: 'charcoal-clay-facewash' },
        { id: 'sensein-charcoal-clay-facewash' }
      );
    }
    if (
      idOrSlug === 'color-pro-shampoo' ||
      idOrSlug === 'color-pro' ||
      idOrSlug === 'sensein-color-pro-shampoo'
    ) {
      condition.$or.push(
        { slug: 'color-pro-shampoo' },
        { id: 'sensein-color-pro-shampoo' }
      );
    }
    if (
      idOrSlug === 'color-pro-hair-mask' ||
      idOrSlug === 'color-pro-mask' ||
      idOrSlug === 'sensein-color-pro-hair-mask'
    ) {
      condition.$or.push(
        { slug: 'color-pro-hair-mask' },
        { id: 'sensein-color-pro-hair-mask' }
      );
    }
    if (
      idOrSlug === 'damage-hair-repair-shampoo' ||
      idOrSlug === 'damage-repair-shampoo' ||
      idOrSlug === 'sensein-damage-hair-repair-shampoo'
    ) {
      condition.$or.push(
        { slug: 'damage-hair-repair-shampoo' },
        { id: 'sensein-damage-hair-repair-shampoo' }
      );
    }
    if (
      idOrSlug === 'damage-hair-repair-mask' ||
      idOrSlug === 'damage-repair-mask' ||
      idOrSlug === 'sensein-damage-hair-repair-mask'
    ) {
      condition.$or.push(
        { slug: 'damage-hair-repair-mask' },
        { id: 'sensein-damage-hair-repair-mask' }
      );
    }
    if (
      idOrSlug === '5-in-1-total-face-cleanup-facewash' ||
      idOrSlug === '5-in-1-facewash' ||
      idOrSlug === 'total-face-cleanup-facewash' ||
      idOrSlug === 'sensein-5-in-1-total-face-cleanup-facewash'
    ) {
      condition.$or.push(
        { slug: '5-in-1-total-face-cleanup-facewash' },
        { id: 'sensein-5-in-1-total-face-cleanup-facewash' }
      );
    }
    if (
      idOrSlug === 'volumizing-hair-style-powder' ||
      idOrSlug === 'hair-powder' ||
      idOrSlug === 'volumizing-hair-powder' ||
      idOrSlug === 'hair-styling-powder' ||
      idOrSlug === 'sensein-volumizing-hair-style-powder'
    ) {
      condition.$or.push(
        { slug: 'volumizing-hair-style-powder' },
        { id: 'sensein-volumizing-hair-style-powder' }
      );
    }
    if (
      idOrSlug === 'hair-smoothing-perfume-spray' ||
      idOrSlug === 'hair-perfume-spray' ||
      idOrSlug === 'hair-smoothing-spray' ||
      idOrSlug === 'perfume-spray' ||
      idOrSlug === 'sensein-hair-smoothing-perfume-spray'
    ) {
      condition.$or.push(
        { slug: 'hair-smoothing-perfume-spray' },
        { id: 'sensein-hair-smoothing-perfume-spray' }
      );
    }
    if (
      idOrSlug === 'leave-in-cream-hair-moisturiser' ||
      idOrSlug === 'leave-in-cream' ||
      idOrSlug === 'hair-moisturiser' ||
      idOrSlug === 'sensein-leave-in-cream-hair-moisturiser'
    ) {
      condition.$or.push(
        { slug: 'leave-in-cream-hair-moisturiser' },
        { id: 'sensein-leave-in-cream-hair-moisturiser' }
      );
    }
    if (
      idOrSlug === 'hair-face-care-combo-pack' ||
      idOrSlug === 'combo-pack' ||
      idOrSlug === 'hair-face-care-combo' ||
      idOrSlug === 'sensein-hair-face-care-combo-pack'
    ) {
      condition.$or.push(
        { slug: 'hair-face-care-combo-pack' },
        { id: 'sensein-hair-face-care-combo-pack' }
      );
    }





    let found = await this.productModel.findOne(condition).lean();
    if (!found) {
      found = await this.productModel.findOne({ slug: new RegExp(idOrSlug, 'i') }).lean();
    }
    if (!found) {
      found = await this.productModel.findOne({ name: new RegExp(idOrSlug, 'i') }).lean();
    }

    if (found) {
      return { ...(found as any), id: (found as any)._id?.toString() || (found as any).id };
    }
    throw new NotFoundException(`Product not found with identifier: ${idOrSlug}`);
  }

  async getCategories(): Promise<Array<{ name: string; count: number; slug: string }>> {
    const dbProducts = await this.productModel.find().lean();
    const categoriesMap = new Map<string, number>();
    (dbProducts || []).forEach((p: any) => {
      if (p.category) {
        categoriesMap.set(p.category, (categoriesMap.get(p.category) || 0) + 1);
      }
    });

    return [
      { name: 'All Products', count: (dbProducts || []).length, slug: 'all' },
      ...Array.from(categoriesMap.entries()).map(([name, count]) => ({
        name,
        count,
        slug: name.toLowerCase(),
      })),
    ];
  }

  async create(dto: any): Promise<any> {
    const baseSlug = (dto.slug || dto.name || 'product')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    let slug = baseSlug;

    // Check if slug already exists to prevent duplicate key error
    try {
      const existing = await this.productModel.findOne({ slug });
      if (existing) {
        slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
      }
    } catch (e) {
      // Continue
    }

    const id = dto.id || slug || `sensein-${Date.now()}`;
    const payload = {
      curatedCollection: 'Bestsellers',
      productType: dto.productType || (dto.category === 'Combos' ? 'combo' : 'single'),
      stock: dto.stock !== undefined ? Number(dto.stock) : 50,
      inStock: dto.inStock !== false,
      rating: dto.rating !== undefined ? Number(dto.rating) : 5.0,
      reviewCount: dto.reviewCount !== undefined ? Number(dto.reviewCount) : 1,
      badges: dto.badges && dto.badges.length > 0 ? dto.badges : ['Official SENSEIN®', 'Salon Exclusive'],
      ...dto,
      slug,
      id,
    };

    let savedObj: any = payload;
    try {
      const created = await this.productModel.create(payload);
      const obj = created.toObject ? created.toObject() : created;
      savedObj = {
        ...obj,
        id: obj._id?.toString() || obj.id || id,
      };
    } catch (err: any) {
      this.logger.warn(`MongoDB product create fallback to in-memory: ${err.message}`);
    }

    // Always unshift to top of in-memory catalog
    this.products = [savedObj, ...this.products.filter((p) => p.id !== id && p.slug !== slug)];

    return savedObj;
  }

  async update(id: string, dto: any): Promise<any> {
    const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
    const query: any = { $or: [{ id }, { slug: id }] };
    if (isObjectId) query.$or.push({ _id: id });
    let updated: any = null;
    try {
      updated = await this.productModel.findOneAndUpdate(query, dto, { new: true });
    } catch (err: any) {
      this.logger.warn(`MongoDB product update fallback: ${err.message}`);
    }

    const idx = this.products.findIndex((p) => p.id === id || p.slug === id);
    if (idx !== -1) {
      this.products[idx] = { ...this.products[idx], ...dto };
      return this.products[idx];
    }

    return updated || { id, ...dto };
  }

  async updateStock(id: string, delta: number): Promise<any> {
    const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
    const query: any = { $or: [{ id }, { slug: id }] };
    if (isObjectId) query.$or.push({ _id: id });
    let updated: any = null;
    try {
      updated = await this.productModel.findOneAndUpdate(
        query,
        { $inc: { stock: delta } },
        { new: true }
      );
    } catch (err: any) {
      this.logger.warn(`MongoDB product stock update fallback: ${err.message}`);
    }

    const idx = this.products.findIndex((p) => p.id === id || p.slug === id);
    if (idx !== -1) {
      this.products[idx] = {
        ...this.products[idx],
        stock: Math.max(0, (this.products[idx].stock || 0) + delta),
      };
      return this.products[idx];
    }

    return updated;
  }

  async delete(id: string): Promise<any> {
    const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
    const query: any = { $or: [{ id }, { slug: id }] };
    if (isObjectId) query.$or.push({ _id: id });
    let deleted = false;
    try {
      const res = await this.productModel.findOneAndDelete(query);
      deleted = !!res;
    } catch (err: any) {
      this.logger.warn(`MongoDB product delete fallback: ${err.message}`);
    }
    this.products = this.products.filter((p) => p.id !== id && p.slug !== id);
    return { success: true, deleted: true };
  }
}
