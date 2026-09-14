import { Injectable, NotFoundException } from '@nestjs/common';

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
export class ProductsService {
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
        '/images/products/mask-1.png',
        '/images/products/mask-2.png',
        '/images/products/mask-texture.png',
        '/images/products/mask-lifestyle.png'
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
        '/images/products/shampoo-1.png',
        '/images/products/shampoo-2.png'
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
        '/images/products/serum-1.png',
        '/images/products/serum-2.png'
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
        '/images/products/elixir-1.png',
        '/images/products/elixir-2.png'
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
        '/images/products/cream-1.png'
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
        '/images/products/wax-1.png'
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
        '/images/products/perfume-1.png'
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
        '/images/products/facewash-1.png'
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
    }
  ];

  findAll(filters?: {
    category?: string;
    collection?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    search?: string;
    sort?: string;
  }): { products: ProductItem[]; total: number } {
    let result = [...this.products];

    if (filters?.category && filters.category.toLowerCase() !== 'all') {
      result = result.filter(p => p.category.toLowerCase() === filters.category.toLowerCase());
    }

    if (filters?.collection && filters.collection.toLowerCase() !== 'all') {
      result = result.filter(p => p.curatedCollection.toLowerCase() === filters.collection.toLowerCase());
    }

    if (filters?.minPrice !== undefined && !isNaN(filters.minPrice)) {
      result = result.filter(p => p.price >= filters.minPrice);
    }

    if (filters?.maxPrice !== undefined && !isNaN(filters.maxPrice)) {
      result = result.filter(p => p.price <= filters.maxPrice);
    }

    if (filters?.minRating !== undefined && !isNaN(filters.minRating)) {
      result = result.filter(p => p.rating >= filters.minRating);
    }

    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (filters?.sort) {
      switch (filters.sort) {
        case 'price-low':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'discount':
          result.sort((a, b) => b.discountPercentage - a.discountPercentage);
          break;
        default:
          // featured: bestsellers first
          result.sort((a, b) => (b.curatedCollection === 'Bestsellers' ? 1 : 0) - (a.curatedCollection === 'Bestsellers' ? 1 : 0));
          break;
      }
    }

    return { products: result, total: result.length };
  }

  findOne(idOrSlug: string): ProductItem {
    const product = this.products.find(p => p.id === idOrSlug || p.slug === idOrSlug);
    if (!product) {
      throw new NotFoundException(`Product not found with identifier: ${idOrSlug}`);
    }
    return product;
  }

  getCategories(): Array<{ name: string; count: number; slug: string }> {
    const categoriesMap = new Map<string, number>();
    this.products.forEach(p => {
      categoriesMap.set(p.category, (categoriesMap.get(p.category) || 0) + 1);
    });

    const list = [
      { name: 'All Products', count: this.products.length, slug: 'all' },
      ...Array.from(categoriesMap.entries()).map(([name, count]) => ({
        name,
        count,
        slug: name.toLowerCase(),
      })),
    ];
    return list;
  }
}
