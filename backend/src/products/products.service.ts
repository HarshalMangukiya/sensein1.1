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
    keyActives: string[];
    fullList: string;
  };
  overview: string;
  howToUse: Array<{
    step: number;
    title: string;
    instruction: string;
  }>;
  reviews: Array<{
    id: string;
    author: string;
    rating: number;
    title: string;
    content: string;
    date: string;
    verifiedBuyer: boolean;
  }>;
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
      this.logger.log(`MongoDB Atlas product catalog synchronized (${count} total products).`);
    } catch (err: any) {
      this.logger.warn(`MongoDB product sync skipped: ${err.message}`);
    }
  }

  private products: ProductItem[] = [
    {
      id: 'sensein-mask-01',
      name: 'Keratin Bond Intense Restorative Hair Mask',
      slug: 'keratin-bond-intense-restorative-hair-mask',
      subtitle: 'Molecular Peptide & French Plum Deep Infusion',
      description: 'An ultra-luxurious, salon-grade hair reconstructor enriched with Bio-Active French Plum Oil and hydrolyzed micro-keratin. Penetrates the hair cortex to restore disulfide bonds broken by thermal styling, color treatments, and environmental stress.',
      category: 'Mask',
      curatedCollection: 'Bestsellers',
      price: 1299,
      mrp: 1999,
      discountPercentage: 35,
      netVolume: '250ml',
      variants: [
        { size: '250ml', price: 1299, mrp: 1999, inStock: true },
        { size: '500ml Salon Size', price: 2299, mrp: 3499, inStock: true }
      ],
      rating: 4.9,
      reviewCount: 142,
      images: [
        'https://res.cloudinary.com/dqddawu42/image/upload/v1789820271/sensein/products/mask-1.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1789820322/sensein/products/mask-2.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1789820271/sensein/products/mask-1.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1789820322/sensein/products/mask-2.jpg'
      ],
      badges: ['-35% OFF', 'BESTSELLER'],
      inStock: true,
      ingredients: {
        keyActives: [
          'Prunus Domestica (French Plum) Seed Oil',
          'Hydrolyzed Micro-Keratin Peptides',
          'Argania Spinosa Cold-Pressed Kernel Extract',
          'Niacinamide & Panthenol Provitamin B5'
        ],
        fullList: 'Aqua (Deionized Water), Cetearyl Alcohol, Behentrimonium Methosulfate, Prunus Domestica Seed Oil, Hydrolyzed Keratin, Argania Spinosa Kernel Oil, Butyrospermum Parkii (Shea) Butter, Niacinamide, Panthenol, Hydroxyethylcellulose, Phenoxyethanol, Ethylhexylglycerin, Tocopheryl Acetate, Parfum (Botanical Essence).'
      },
      overview: 'Clinically proven to reduce fiber breakage by 87% within 3 applications. Imparts a mirror-like glass hair shine without weighing down fine to medium textures.',
      howToUse: [
        { step: 1, title: 'Cleanse & Towel Dry', instruction: 'Gently wash with SENSEIN Clarifying Shampoo. Press out excess moisture with a microfiber towel.' },
        { step: 2, title: 'Section & Infuse', instruction: 'Warm a walnut-sized dollop between palms. Comb thoroughly through mid-lengths to ends, avoiding the root zone.' },
        { step: 3, title: 'Steam & Seal', instruction: 'Allow the bioactive peptides to absorb for 7–10 minutes under a warm towel. Rinse thoroughly with cool water to seal cuticles.' }
      ],
      reviews: [
        { id: 'rev-1', author: 'Dr. Ananya Roy', rating: 5, title: 'Absolute salon quality at home', content: 'Transformed my severely bleached balayage hair after just two uses. The plum botanical scent is hypnotic and lasts two whole days.', date: '3 days ago', verifiedBuyer: true },
        { id: 'rev-2', author: 'Meera Kapoor', rating: 5, title: 'Weightless silky finish', content: 'Unlike standard drug-store masks, this does not leave any greasy residue. My blowout looks like I just stepped out of a Paris salon.', date: '1 week ago', verifiedBuyer: true },
        { id: 'rev-3', author: 'Rohan Singhania', rating: 5, title: 'Worth every rupee', content: 'Ordered for my salon clients; they loved it so much that they bought bottles on the spot. Truly elite packaging.', date: '2 weeks ago', verifiedBuyer: true }
      ]
    },
    {
      id: 'sensein-shampoo-02',
      name: 'Black Caviar & Stem-Cell Cellular Cleansing Shampoo',
      slug: 'black-caviar-cellular-cleansing-shampoo',
      subtitle: 'Sulfate-Free Biomimetic Scalp & Strand Elixir',
      description: 'A sulfate-free, rich lathering cleanse powered by French caviar extracts, marine collagen, and apple fruit stem cells. Clarifies impurities while maintaining optimum scalp lipid balance.',
      category: 'Shampoo',
      curatedCollection: 'Bestsellers',
      price: 1149,
      mrp: 1699,
      discountPercentage: 32,
      netVolume: '250ml',
      variants: [
        { size: '250ml', price: 1149, mrp: 1699, inStock: true },
        { size: '500ml Family Size', price: 1999, mrp: 2899, inStock: true }
      ],
      rating: 4.8,
      reviewCount: 98,
      images: [
        'https://res.cloudinary.com/dqddawu42/image/upload/v1789820329/sensein/products/shampoo-1.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1789820331/sensein/products/shampoo-2.jpg'
      ],
      badges: ['-32% OFF', 'BESTSELLER'],
      inStock: true,
      ingredients: {
        keyActives: [
          'Caviar Extract (Bio-marine Lipids)',
          'Malus Domestica Fruit Cell Culture',
          'Sulfate-Free Coconut Glucoside Complex',
          'Rosemary Leaf Essential Oil'
        ],
        fullList: 'Aqua, Sodium Cocoyl Isethionate, Cocamidopropyl Hydroxysultaine, Caviar Extract, Malus Domestica Fruit Cell Culture, Rosmarinus Officinalis Leaf Oil, Glycerin, Guar Hydroxypropyltrimonium Chloride, Citric Acid, Benzyl Alcohol, Parfum.'
      },
      overview: 'Gentle micellar technology lifts away micro-pollutants and sebum without stripping color or keratin treatments.',
      howToUse: [
        { step: 1, title: 'Wet Thoroughly', instruction: 'Soak hair with lukewarm water for 60 seconds to open cuticle pores.' },
        { step: 2, title: 'Lather at Roots', instruction: 'Emulsify 1-2 pumps in palms and massage vigorously into scalp with fingertips.' },
        { step: 3, title: 'Rinse Clean', instruction: 'Let the rich foam cascade through ends, then rinse cleanly.' }
      ],
      reviews: [
        { id: 'rev-4', author: 'Pooja V.', rating: 5, title: 'Scalp feels so purified!', content: 'No more itchiness or buildup. The foam feels rich and creamy despite being 100% sulfate-free.', date: '4 days ago', verifiedBuyer: true }
      ]
    },
    {
      id: 'sensein-serum-03',
      name: 'Bio-Active French Plum Illuminating Hair Serum',
      slug: 'bio-active-french-plum-illuminating-hair-serum',
      subtitle: 'Liquid Silk Thermal Defense & Anti-Frizz Elixir',
      description: 'A non-greasy, glass-sheen botanical serum engineered to tame flyaways, banish humidity-induced frizz, and shield hair from thermal tools up to 230°C / 450°F.',
      category: 'Serum',
      curatedCollection: 'Salon Exclusive',
      price: 1499,
      mrp: 2199,
      discountPercentage: 31,
      netVolume: '100ml',
      variants: [
        { size: '100ml Glass Dropper', price: 1499, mrp: 2199, inStock: true },
        { size: '50ml Travel Flacon', price: 899, mrp: 1299, inStock: true }
      ],
      rating: 4.9,
      reviewCount: 176,
      images: [
        'https://res.cloudinary.com/dqddawu42/image/upload/v1789820326/sensein/products/serum-1.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1789820327/sensein/products/serum-2.jpg'
      ],
      badges: ['-31% OFF', 'SALON CHOICE'],
      inStock: true,
      ingredients: {
        keyActives: [
          'Cold-Pressed Ente Plum Oil',
          'Cyclomethicone & Dimethiconol Matrix',
          'Camellia Japonica Tsubaki Oil',
          'Natural Vitamin E (Tocopherol)'
        ],
        fullList: 'Cyclopentasiloxane, Dimethiconol, Prunus Domestica Seed Oil, Camellia Japonica Seed Oil, Isododecane, Tocopheryl Acetate, Fragrance (Signature Plum & White Amber).'
      },
      overview: 'Delivers 72-hour humidity resistance and instantaneous prismatic reflection with 0% heavy residue.',
      howToUse: [
        { step: 1, title: 'Dispense Drop', instruction: 'Place 2-3 drops into palm of hand.' },
        { step: 2, title: 'Warm Oil', instruction: 'Rub palms together to activate botanical molecules.' },
        { step: 3, title: 'Glide over Ends', instruction: 'Smooth evenly over damp or dry mid-lengths and split ends.' }
      ],
      reviews: [
        { id: 'rev-5', author: 'Sanya Malhotra', rating: 5, title: 'Holy grail hair oil', content: 'Hands down better than Olaplex or Moroccanoil. Smells heavenly and gives an unreal mirror gloss.', date: '5 days ago', verifiedBuyer: true }
      ]
    },
    {
      id: 'sensein-elixir-04',
      name: 'Peptide Root Density & Scalp Awakening Elixir',
      slug: 'peptide-root-density-scalp-awakening-elixir',
      subtitle: 'Redensyl + Procapil Follicular Stimulating Concentrate',
      description: 'An advanced clinical scalp serum featuring 5% Redensyl, Procapil, and Copper Peptides. Stimulates dormant follicles, reduces shedding, and encourages fuller, denser hair regrowth.',
      category: 'Elixir',
      curatedCollection: 'Clean Formulation',
      price: 1799,
      mrp: 2499,
      discountPercentage: 28,
      netVolume: '60ml',
      variants: [
        { size: '60ml Pipette Flacon', price: 1799, mrp: 2499, inStock: true }
      ],
      rating: 4.8,
      reviewCount: 64,
      images: [
        'https://res.cloudinary.com/dqddawu42/image/upload/v1789820309/sensein/products/elixir-1.jpg',
        'https://res.cloudinary.com/dqddawu42/image/upload/v1789820309/sensein/products/elixir-1.jpg'
      ],
      badges: ['-28% OFF', 'CLINICAL LAB'],
      inStock: true,
      ingredients: {
        keyActives: [
          '5% Redensyl & Anagain Complex',
          'Copper Tripeptide-1',
          'Procapil Biotinyl-GHK',
          'Caffeine & Rosemary Hydrosol'
        ],
        fullList: 'Aqua, Rosmarinus Officinalis Hydrosol, Larix Europaea Wood Extract, Glycine, Zinc Chloride, Camellia Sinensis Leaf Extract, Biotinoyl Tripeptide-1, Copper Tripeptide-1, Caffeine, Phenoxyethanol, Ethylhexylglycerin.'
      },
      overview: 'Water-light scalp tonic that absorbs immediately without making hair greasy or sticky. Visible density improvements observed in 60 days.',
      howToUse: [
        { step: 1, title: 'Part Hair', instruction: 'Part hair into sections exposing the scalp.' },
        { step: 2, title: 'Apply Drops', instruction: 'Deposit 1 full pipette directly across thinning areas.' },
        { step: 3, title: 'Massage In', instruction: 'Use fingertips in circular motions for 2 minutes. Do not rinse out.' }
      ],
      reviews: [
        { id: 'rev-6', author: 'Karan D.', rating: 5, title: 'Noticeable reduction in hair fall', content: 'Been using daily for 4 weeks. My comb has almost zero hairs caught in it now. Phenomenal formula.', date: '2 weeks ago', verifiedBuyer: true }
      ]
    },
    {
      id: 'sensein-cream-05',
      name: 'Cashmere Velvet Thermal Blowout Styling Cream',
      slug: 'cashmere-velvet-thermal-blowout-styling-cream',
      subtitle: 'Weightless Humidity Shield & Style Memory',
      description: 'Silky smoothing lotion that cuts blowout time in half, locks in sculpted bounce, and seals out moisture and static for 48 hours.',
      category: 'Cream',
      curatedCollection: 'Salon Exclusive',
      price: 999,
      mrp: 1499,
      discountPercentage: 33,
      netVolume: '200ml',
      variants: [
        { size: '200ml Pump', price: 999, mrp: 1499, inStock: true }
      ],
      rating: 4.7,
      reviewCount: 52,
      images: [
        'https://res.cloudinary.com/dqddawu42/image/upload/v1789820303/sensein/products/cream-1.jpg'
      ],
      badges: ['-33% OFF'],
      inStock: true,
      ingredients: {
        keyActives: ['Hydrolyzed Silk Protein', 'Murumuru Butter', 'Keratin Amino Acids'],
        fullList: 'Aqua, Cetyl Alcohol, Hydrolyzed Silk, Astrocaryum Murumuru Seed Butter, Keratin Amino Acids, Behentrimonium Chloride, Dimethicone, Fragrance, Phenoxyethanol.'
      },
      overview: 'Provides flexible touchable hold with high-gloss luster and thermal protection up to 430°F.',
      howToUse: [
        { step: 1, title: 'Pump & Distribute', instruction: 'Dispense 1-2 pumps onto damp lengths before blow-drying.' },
        { step: 2, title: 'Blow-Dry with Round Brush', instruction: 'Tension hair using a ceramic barrel brush for maximum volume.' }
      ],
      reviews: []
    },
    {
      id: 'sensein-wax-06',
      name: 'Obsidian Matte Flexible Texturizing Pomade',
      slug: 'obsidian-matte-flexible-texturizing-pomade',
      subtitle: 'Volcanic Ash & Carnauba High-Definition Hold',
      description: 'A modern matte finish sculpting wax with zero shine and pliable all-day reworkability. Infused with volcanic ash and French beeswax.',
      category: 'Wax',
      curatedCollection: 'Salon Exclusive',
      price: 899,
      mrp: 1299,
      discountPercentage: 30,
      netVolume: '100g',
      variants: [
        { size: '100g Jar', price: 899, mrp: 1299, inStock: true }
      ],
      rating: 4.6,
      reviewCount: 41,
      images: [
        'https://res.cloudinary.com/dqddawu42/image/upload/v1789820332/sensein/products/wax-1.jpg'
      ],
      badges: ['-30% OFF'],
      inStock: true,
      ingredients: {
        keyActives: ['Volcanic Ash Extract', 'Organic Carnauba Wax', 'Kaolin Clay'],
        fullList: 'Aqua, Cera Alba (Beeswax), Kaolin, Copernicia Cerifera Cera, Volcanic Ash, Cetearyl Alcohol, Fragrance, Phenoxyethanol.'
      },
      overview: 'Zero crust, zero flaking. Natural matte texture with medium-high pliable grip.',
      howToUse: [
        { step: 1, title: 'Warm in Palms', instruction: 'Rub a small coin size between dry palms until invisible.' },
        { step: 2, title: 'Sculpt & Style', instruction: 'Work vigorously from back to front through dry hair to sculpt desired shape.' }
      ],
      reviews: []
    },
    {
      id: 'sensein-perfume-07',
      name: 'Nuit De Prune Hair & Body Fine Fragrance Mist',
      slug: 'nuit-de-prune-hair-body-fine-fragrance-mist',
      subtitle: 'Dark Plum, Tonka Bean & Velvet Amber Extract',
      description: 'An alcohol-free, moisture-locking hair mist infused with UV shields and the signature SENSEIN fragrance: Parisian plum nectar, midnight iris, Madagascar vanilla, and golden amber.',
      category: 'Perfume',
      curatedCollection: 'Bestsellers',
      price: 1599,
      mrp: 2299,
      discountPercentage: 30,
      netVolume: '100ml',
      variants: [
        { size: '100ml Flacon', price: 1599, mrp: 2299, inStock: true }
      ],
      rating: 4.9,
      reviewCount: 110,
      images: [
        'https://res.cloudinary.com/dqddawu42/image/upload/v1789820324/sensein/products/perfume-1.jpg'
      ],
      badges: ['-30% OFF', 'LIMITED EDITION'],
      inStock: true,
      ingredients: {
        keyActives: ['Alcohol-Free Botanical Base', 'UV-Filter Complex', 'Organic Plum Distillate'],
        fullList: 'Aqua, PPG-26-Buteth-26, PEG-40 Hydrogenated Castor Oil, Parfum (Fine Fragrance), Ethylhexyl Methoxycinnamate, Prunus Domestica Distillate, Tocopherol.'
      },
      overview: 'Non-drying formulation that neutralizes environmental odors and imparts intoxicating all-day sillage.',
      howToUse: [
        { step: 1, title: 'Mist Generously', instruction: 'Hold 8 inches away and mist lightly over dry styled hair and pulse points.' }
      ],
      reviews: []
    },
    {
      id: 'sensein-facewash-08',
      name: 'Botanical Amino Gentle Resurfacing Cleanser',
      slug: 'botanical-amino-gentle-resurfacing-cleanser',
      subtitle: 'Japanese Apple Amino & Salicylic Micro-Pearls',
      description: 'A pH 5.5 cushiony foaming cleanser for face and neck that dissolves makeup, micro-dust, and sunscreen without compromising the skin barrier.',
      category: 'Facewash',
      curatedCollection: 'Clean Formulation',
      price: 799,
      mrp: 1199,
      discountPercentage: 33,
      netVolume: '150ml',
      variants: [
        { size: '150ml Tube', price: 799, mrp: 1199, inStock: true }
      ],
      rating: 4.7,
      reviewCount: 38,
      images: [
        'https://res.cloudinary.com/dqddawu42/image/upload/v1789820315/sensein/products/facewash-1.jpg'
      ],
      badges: ['-33% OFF'],
      inStock: true,
      ingredients: {
        keyActives: ['Apple Amino Acid Complex', '0.5% Encapsulated BHA', 'Gotu Kola (Centella Asiatica)'],
        fullList: 'Aqua, Sodium Cocoyl Apple Amino Acids, Glycerin, Centella Asiatica Extract, Salicylic Acid, Allantoin, Xanthan Gum, Phenoxyethanol.'
      },
      overview: 'Dermatologist tested on sensitive Indian skin types. Zero tightening sensation.',
      howToUse: [
        { step: 1, title: 'Massage on Damp Skin', instruction: 'Lather between wet palms and massage gently in circles for 60 seconds.' },
        { step: 2, title: 'Rinse with Cool Water', instruction: 'Splash clean and pat dry with a soft face towel.' }
      ],
      reviews: []
    },
    {
      id: 'sensein-test-pay-01',
      name: 'SENSEIN Live Payment Verification Sample • ₹1 Test Item',
      slug: 'sensein-payment-verification-test',
      subtitle: 'Live Razorpay Gateway Connectivity Test • Instant ₹1 Verification Token',
      description: 'Special ₹1 verification formulation token designed for testing live Razorpay prepaid payment integration, instant Blue Dart priority tracking assignment, and live automated email receipts.',
      category: 'Testing & Samples',
      curatedCollection: 'Bestsellers',
      price: 1,
      mrp: 99,
      discountPercentage: 99,
      netVolume: '1 Unit Test Sample',
      variants: [
        { size: '1 Unit Live Test Token', price: 1, mrp: 99, inStock: true }
      ],
      rating: 5.0,
      reviewCount: 142,
      images: [
        'https://res.cloudinary.com/dqddawu42/image/upload/v1789818163/sensein/products/bxsjmi3kfmsq7jigqkfv.png'
      ],
      badges: ['₹1 TEST ITEM', 'LIVE GATEWAY TEST'],
      inStock: true,
      ingredients: {
        keyActives: ['Live Payment Verification', 'Razorpay Gateway Testing', 'Instant Delivery Protocol'],
        fullList: 'Aqua, Bio-Active Botanical Extract, Tocopherol, SENSEIN Quality Verification Assurance.'
      },
      overview: 'Designed exclusively for testing real checkout, live payment capture via UPI / Cards / NetBanking, and MongoDB order creation.',
      howToUse: [
        { step: 1, title: 'Add to Bag', instruction: 'Click Add to Bag to place the ₹1 test item into your luxury cart.' },
        { step: 2, title: 'Complete Checkout', instruction: 'Proceed to checkout and complete the ₹1 live payment via UPI, Card, or NetBanking.' }
      ],
      reviews: [
        {
          id: 'rev-test-1',
          author: 'SENSEIN Quality Lab',
          rating: 5,
          title: 'Payment gateway verification successful',
          content: 'Razorpay prepaid live transactions and MongoDB order syncing tested seamlessly.',
          date: 'Today',
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
      query.category = new RegExp(`^${filters.category}$`, 'i');
    }
    if (filters?.collection && filters.collection.toLowerCase() !== 'all') {
      query.curatedCollection = new RegExp(`^${filters.collection}$`, 'i');
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

    let sortOption: any = { createdAt: -1 };
    if (filters?.sort === 'price-low') sortOption = { price: 1 };
    else if (filters?.sort === 'price-high') sortOption = { price: -1 };
    else if (filters?.sort === 'rating') sortOption = { rating: -1 };
    else if (filters?.sort === 'discount') sortOption = { discountPercentage: -1 };

    const dbProducts = await this.productModel.find(query).sort(sortOption).lean();
    const mapped = (dbProducts || []).map((p: any) => ({
      ...p,
      id: p._id?.toString() || p.id,
    }));
    return { products: mapped, total: mapped.length };
  }

  async findOne(idOrSlug: string): Promise<any> {
    const isObjectId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);
    const condition: any = { $or: [{ slug: idOrSlug }] };
    if (isObjectId) condition.$or.push({ _id: idOrSlug });
    else condition.$or.push({ id: idOrSlug });

    const found = await this.productModel.findOne(condition).lean();
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

  async create(dto: any) {
    return this.productModel.create(dto);
  }

  async update(id: string, dto: any) {
    const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
    const query: any = { $or: [{ id }] };
    if (isObjectId) query.$or.push({ _id: id });
    return this.productModel.findOneAndUpdate(query, dto, { new: true });
  }

  async updateStock(id: string, delta: number) {
    const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
    const query: any = { $or: [{ id }] };
    if (isObjectId) query.$or.push({ _id: id });
    return this.productModel.findOneAndUpdate(
      query,
      { $inc: { stock: delta } },
      { new: true }
    );
  }

  async delete(id: string) {
    const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
    const query: any = { $or: [{ id }] };
    if (isObjectId) query.$or.push({ _id: id });
    return this.productModel.findOneAndDelete(query);
  }
}
