import { ProductItem } from './api';

export const SEED_PRODUCTS: ProductItem[] = [
  {
    id: 'sensein-hair-face-care-combo-pack',
    slug: 'hair-face-care-combo-pack',
    name: 'Hair & Face Care Combo Pack – 3 × 50 ml',
    subtitle: 'Complete Grooming Routine • Shampoo + Leave-In Cream + Facewash',
    category: 'Combos',
    productType: 'combo',
    curatedCollection: 'Bestsellers',
    price: 549,
    mrp: 849,
    discountPercentage: 35,
    netVolume: '150 ml (3 × 50 ml)',
    variants: [
      { size: '3 × 50 ml (150 ml)', price: 549, mrp: 849, inStock: true }
    ],
    rating: 4.9,
    reviewCount: 52,
    stock: 200,
    badges: ['Value Combo', 'Travel Friendly', '3-in-1 Kit'],
    inStock: true,
    comboItems: [
      {
        name: 'Argan + Keratin Smoothing Shampoo',
        quantity: '50 ml (1.69 fl. oz.)',
        description: 'Enriched with pure Argan Oil and Hydrolyzed Keratin to cleanse without stripping, hydrate, and restore strength to hair fibers.'
      },
      {
        name: 'Leave-In Cream with Hair Moisturiser',
        quantity: '50 ml (1.69 fl. oz.)',
        description: 'Contains Panthenol and Niacinamide. Delivers lightweight all-day hydration, shields against humidity, and enhances silky shine without greasy residue.'
      },
      {
        name: '5 IN 1 Total Face Cleanup Facewash',
        quantity: '50 ml (1.69 fl. oz.)',
        description: 'Deep cleansing multi-action formula that clears impurities, unclogs pores, balances surface oils, and revives dull tired skin.'
      }
    ],
    overview: 'Complete Your Daily Grooming Ritual in One Travel-Friendly Value Pack. Engineered with salon-grade botanicals for comprehensive hair cleansing, leave-in hydration, and purifying skin renewal.',
    description: 'Complete Your Hair & Skin Care Routine with One Combo\n\nDiscover everyday grooming essentials with the SENSEIN Professional Hair & Face Care Combo Pack. This convenient set combines two hair-care products and one facewash to support a simple, practical personal care routine.\n\nWhether you are refreshing at home, hitting the gym, or travelling, this 3-piece kit delivers comprehensive hair smoothing, leave-in moisture conditioning, and deep facial cleanup in compact, travel-friendly bottles.',
    images: [
      'https://res.cloudinary.com/dqddawu42/image/upload/v1792520126/sensein/products/sensein-combo-pack-packshot.jpg',
      'https://res.cloudinary.com/dqddawu42/image/upload/v1792520128/sensein/products/sensein-combo-pack-travel-kit.jpg',
      'https://res.cloudinary.com/dqddawu42/image/upload/v1792520130/sensein/products/sensein-combo-pack-textures.jpg',
      'https://res.cloudinary.com/dqddawu42/image/upload/v1792520132/sensein/products/sensein-combo-pack-lifestyle.jpg'
    ],
    howToUse: [
      {
        step: 1,
        title: 'Cleanse Hair with Shampoo',
        instruction: 'Apply Argan + Keratin Smoothing Shampoo onto wet hair. Gently massage the scalp to work into a rich lather. Rinse thoroughly with water.'
      },
      {
        step: 2,
        title: 'Moisturise with Leave-In Cream',
        instruction: 'Dispense a coin-sized amount of Leave-In Cream into palms. Apply evenly through towel-dried or dry hair, focusing on lengths and ends. Do not rinse; style as desired.'
      },
      {
        step: 3,
        title: 'Clarify with 5-in-1 Facewash',
        instruction: 'Wet face with lukewarm water. Squeeze a coin-sized amount of facewash onto hands, massage gently over face and neck for 60 seconds, and rinse clean.'
      }
    ],
    usageAdvice: 'Use the 5-in-1 Facewash twice daily. Shampoo hair 2-3 times per week, following with Leave-In Cream on damp or dry hair for lasting softness and frizz control.',
    productDetails: {
      brand: 'SENSEIN Professional',
      productName: 'Hair & Face Care Combo Pack',
      productType: 'Travel Care Combo Pack (2 Hair Products + 1 Face Product)',
      netQuantity: '150 ml (3 × 50 ml bottles)',
      kitContents: '1 × 50 ml Shampoo + 1 × 50 ml Leave-In Cream + 1 × 50 ml Facewash',
      skinAndHairSuitability: 'Suitable for all hair and skin types (Men & Women)',
      countryOfOrigin: 'PRC, as printed on the packaging',
      importedAndMarketedBy: 'Olive Enterprise, Mota Varachha, Surat, Gujarat – 394101',
      manufacturedBy: 'Guangzhou Forte Cosmetics Company Limited, Guangzhou, China.',
      shelfLife: '36 months from manufacturing date'
    },
    benefits: [
      'Comprehensive 3-in-1 Daily Grooming Routine in one cohesive collection.',
      'Saves over 35% compared to purchasing individual full-sized formulations.',
      'Travel-Friendly compact 50 ml sizes compliant with airport cabin baggage limits.',
      'Salon-Grade Botanical Formulations with Keratin, Argan, and Niacinamide.',
      'Deep facial purification combined with continuous all-day hair hydration.'
    ],
    ingredients: {
      keyActives: [
        { name: 'Argan Oil', role: 'Replenishes moisture and imparts polished salon luster' },
        { name: 'Hydrolyzed Keratin', role: 'Restores tensile strength and repairs micro-fissures in cuticles' },
        { name: 'Panthenol (Pro-Vitamin B5)', role: 'Deep penetrating hydrator for soft, elastic hair strands' },
        { name: 'Niacinamide', role: 'Fortifies follicle resilience and supports scalp health' },
        { name: 'Nymphaea Odorata Root Extract', role: 'Botanical water lily extract that conditions and soothes' },
        { name: 'Glycerin', role: 'Humectant that retains skin and hair hydration throughout the day' }
      ],
      fullList: 'Aqua, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Argania Spinosa Kernel Oil, Hydrolyzed Keratin, Panthenol, Niacinamide, Cetyl Alcohol, Stearyl Alcohol, Behentrimonium Methosulfate, Nymphaea Odorata Root Extract, Mentha Arvensis Leaf Oil, Glycerin, Disodium EDTA, Citric Acid, Parfum.'
    },
    faqs: [
      {
        question: 'What is included in this Combo Pack?',
        answer: 'The combo pack includes 3 travel-friendly 50 ml bottles: (1) Argan + Keratin Smoothing Shampoo, (2) Leave-In Cream with Hair Moisturiser, and (3) 5-in-1 Total Face Cleanup Facewash.'
      },
      {
        question: 'Are the bottles flight and travel friendly?',
        answer: 'Yes! At 50 ml each, they comfortably comply with airline carry-on regulations and fit neatly into gym or travel dopp kits.'
      },
      {
        question: 'Is this kit suitable for both men and women?',
        answer: 'Yes, all 3 formulations feature clean, gender-neutral botanical formulas suited for all skin and hair types.'
      }
    ],
    additionalInfo: {
      netQuantity: '150 ml (3 × 50 ml)',
      shelfLife: '36 Months from Manufacturing Date',
      storage: 'Store in a cool, dry place away from direct sunlight.',
      caution: 'For external use only. Avoid contact with eyes.'
    },
    reviews: [
      {
        id: 'rev-combo-01',
        author: 'Kunal Singhania',
        rating: 5,
        title: 'Ultimate travel grooming kit',
        content: 'Took this on my week-long business trip. The 50ml sizes passed security easily, the shampoo leaves hair smooth, and the facewash is super refreshing. Best ₹549 spent!',
        date: '2026-04-20',
        verifiedBuyer: true
      }
    ]
  },
  {
    id: 'sensein-hair-wax',
    name: 'Hair Wax',
    slug: 'hair-wax',
    subtitle: 'Non sticky formula, Shape, style, and shine with lasting hold!',
    description: 'A premium salon-grade styling wax crafted to shape, style, and define your look with radiant shine and lasting hold. Featuring an ultra-clean, non-sticky formula that allows effortless control and restyling throughout the day for short, medium, and long hair.',
    category: 'Hair Styling Wax',
    productType: 'single',
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
    stock: 120,
    overview: 'Non sticky formula, Shape, style, and shine with lasting hold! Engineered for short, medium, and long hair with clean washability and radiant shine.',
    howToUse: [
      { step: 1, title: 'Take Scoop of Wax', instruction: 'Take an appropriate amount of SENSEIN Hair Wax according to your hair length.' },
      { step: 2, title: 'Warm & Rub in Hands', instruction: 'Rub the wax between your hands to warm and spread it evenly.' },
      { step: 3, title: 'Apply Evenly on Hair', instruction: 'Apply evenly to your hair, including the areas you want to style.' },
      { step: 4, title: 'Shape & Adjust', instruction: 'Shape your hair into your desired look and adjust as needed.' }
    ],
    productDetails: {
      brand: 'SENSEIN',
      productName: 'Hair Wax',
      productType: 'Hair Styling Wax',
      netQuantity: '100 g',
      finish: 'Shine',
      stylingBenefits: 'Texture, shine, control and hold',
      suitableHairLength: 'Short, medium and long',
      countryOfOrigin: 'PRC (as stated on the packaging)'
    },
    benefits: [
      'Adds texture to help define your hairstyle.',
      'Provides shine for a polished-looking finish.',
      'Helps control and hold your desired style.',
      'Allows you to shape and restyle your look as needed.',
      'Suitable for short, medium and long hair.'
    ],
    ingredients: {
      keyActives: [
        { name: 'Propylene Glycol', role: 'Helps retain moisture and prevents hair stiffness' },
        { name: 'Volpo N5 & N3', role: 'Provides flexible natural hold and structural definition' },
        { name: 'PVP K90', role: 'Gives all-day enduring hold and texture without flaking' }
      ],
      fullList: 'Water, Propylene Glycol, Crodatos N10N, Volpo N5, Volpo N3, Light Liquid Paraffin, PVP K90, Kathon and Perfume.'
    },
    faqs: [
      { question: 'What is SENSEIN Hair Wax used for?', answer: 'It is used to add texture, shine, control and hold while styling hair.' },
      { question: 'How do I apply SENSEIN Hair Wax?', answer: 'Warm a suitable amount between your hands, apply evenly and style as desired.' }
    ],
    additionalInfo: {
      shelfLife: '36 Months from Manufacturing Date',
      storage: 'Store in a cool, dry place away from direct sunlight.'
    },
    reviews: [
      {
        id: 'rev-01',
        author: 'Rohit Sharma',
        rating: 5,
        title: 'Amazing hold and non-sticky shine!',
        content: 'Hands down the best hair wax I have used. Gives great shine without making my hair feel greasy or stiff. Lasts throughout the entire day.',
        date: '2026-03-14',
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
    productType: 'single',
    curatedCollection: 'Bestsellers',
    price: 1975,
    mrp: 1975,
    discountPercentage: 0,
    netVolume: '1 L (33.81 fl. oz.)',
    variants: [
      { size: '1 L (33.81 fl. oz.)', price: 1975, mrp: 1975, inStock: true }
    ],
    rating: 4.8,
    reviewCount: 36,
    stock: 90,
    images: [
      'https://res.cloudinary.com/dqddawu42/image/upload/v1792492874/sensein/products/media_1792492512087.jpg',
      'https://res.cloudinary.com/dqddawu42/image/upload/v1792492876/sensein/products/media_1792492519139.jpg'
    ],
    badges: ['OFFICIAL SENSEIN®', 'SALON PROFESSIONAL', '1000 ML'],
    inStock: true,
    overview: 'Thoroughly cleanses hair and scalp while delivering smoothing conditioning, frizz control, and essential hydration.',
    howToUse: [
      { step: 1, title: 'Wet Hair Thoroughly', instruction: 'Wet your hair thoroughly with clean water.' },
      { step: 2, title: 'Apply & Lather', instruction: 'Take an appropriate amount of shampoo and apply evenly from roots to ends.' },
      { step: 3, title: 'Massage Scalp', instruction: 'Gently massage your scalp and hair with fingertips for 2–3 minutes.' },
      { step: 4, title: 'Rinse Clean', instruction: 'Rinse thoroughly with lukewarm water until completely clarified.' }
    ],
    productDetails: {
      brand: 'SENSEIN',
      productName: 'Argan + Keratin Smoothing Shampoo',
      productType: 'Cleansing & Smoothing Shampoo',
      netQuantity: '1 L (33.81 fl. oz.)',
      suitableFor: 'Normal to dry, frizzy, or chemically treated hair'
    },
    benefits: [
      'Gently and thoroughly cleanses hair and scalp.',
      'Helps smooth hair surface and manage frizz.',
      'Restores moisture and soft feel to dry strands.',
      'Enriched with botanical oils and keratin protein.'
    ],
    ingredients: {
      keyActives: [
        { name: 'Argania Spinosa Kernel Oil', role: 'Conditions and smooths hair shaft' },
        { name: 'Hydrolyzed Keratin', role: 'Helps strengthen and restore hair fiber' },
        { name: 'Panthenol', role: 'Binds moisture and enhances hair elasticity' }
      ],
      fullList: 'Aqua, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Argania Spinosa Kernel Oil, Hydrolyzed Keratin, Panthenol, Dimethicone, Citric Acid, Parfum.'
    },
    faqs: [
      { question: 'Is this shampoo safe for color-treated hair?', answer: 'Yes, the formula is gentle and suitable for treated or dry hair.' }
    ],
    additionalInfo: {
      shelfLife: '36 Months from Manufacturing Date',
      storage: 'Store in a cool, dry place away from direct sunlight.'
    },
    reviews: []
  },
  {
    id: 'sensein-argan-keratin-hair-mask',
    name: 'Argan + Keratin Smoothing Hair Mask',
    slug: 'argan-keratin-smoothing-hair-mask',
    subtitle: 'Deep conditioning salon mask for damaged, frizzy and chemically treated hair',
    description: 'An intensive restorative hair mask infused with concentrated Argan Oil and Hydrolyzed Keratin to replenish deep moisture, seal split ends, and restore salon-level silkiness.',
    category: 'Hair Mask',
    productType: 'single',
    curatedCollection: 'Bestsellers',
    price: 1850,
    mrp: 2200,
    discountPercentage: 16,
    netVolume: '500 ml (16.9 fl. oz.)',
    variants: [
      { size: '500 ml', price: 1850, mrp: 2200, inStock: true }
    ],
    rating: 4.9,
    reviewCount: 42,
    stock: 65,
    images: [
      'https://res.cloudinary.com/dqddawu42/image/upload/v1792497801/sensein/products/sensein-argan-keratin-hair-mask-packshot.jpg',
      'https://res.cloudinary.com/dqddawu42/image/upload/v1792497804/sensein/products/sensein-argan-keratin-hair-mask-texture.jpg'
    ],
    badges: ['OFFICIAL SENSEIN®', 'DEEP RESTORATIVE', '500 ML'],
    inStock: true,
    overview: 'Intensive weekly ritual to resurrect damaged hair cuticle integrity and impart velvet smoothness.',
    howToUse: [
      { step: 1, title: 'Cleanse & Towel Dry', instruction: 'After shampooing, gently squeeze out excess water with a towel.' },
      { step: 2, title: 'Generous Coat', instruction: 'Apply a generous palm-sized amount of mask from mid-lengths to ends.' },
      { step: 3, title: 'Leave for 5–10 Mins', instruction: 'Leave on for 5 to 10 minutes to allow heat-activated penetration.' },
      { step: 4, title: 'Rinse Thoroughly', instruction: 'Rinse thoroughly with cool water to seal the hair cuticle.' }
    ],
    productDetails: {
      brand: 'SENSEIN',
      productName: 'Argan + Keratin Smoothing Hair Mask',
      productType: 'Intensive Restorative Mask',
      netQuantity: '500 ml'
    },
    benefits: [
      'Penetrates cortex to rebuild damaged protein bonds.',
      'Eliminates unmanageable flyaways and high-humidity frizz.',
      'Seals cuticle surface for intense mirror-like shine.'
    ],
    ingredients: {
      keyActives: [
        { name: 'Argan Oil', role: 'Restores essential fatty acids to lipid layer' },
        { name: 'Hydrolyzed Keratin', role: 'Fills structural micro-voids in damaged cortex' }
      ],
      fullList: 'Aqua, Cetearyl Alcohol, Argania Spinosa Kernel Oil, Hydrolyzed Keratin, Behentrimonium Chloride, Dimethicone, Cetrimonium Chloride, Fragrance.'
    },
    faqs: [
      { question: 'How often should I use this mask?', answer: 'We recommend using once to twice a week in place of conditioner for best restorative results.' }
    ],
    additionalInfo: {
      shelfLife: '36 Months from Manufacturing Date',
      storage: 'Store in a cool dry place.'
    },
    reviews: []
  },
  {
    id: 'sensein-argan-oil-for-hair-body',
    name: 'Argan Oil For Hair & Body',
    slug: 'argan-oil-for-hair-body',
    subtitle: 'Nourishing botanical elixir with Argan, Jojoba & Macadamia oils',
    description: 'A multi-purpose dry oil elixir engineered for both hair and body. Infused with pure Moroccan Argan, Biomimetic Jojoba, and Macadamia oils to impart satin radiance without greasiness.',
    category: 'Hair & Body Oil',
    productType: 'single',
    curatedCollection: 'Bestsellers',
    price: 499,
    mrp: 599,
    discountPercentage: 17,
    netVolume: '50 ml (1.69 fl. oz.)',
    variants: [
      { size: '50 ml', price: 499, mrp: 599, inStock: true }
    ],
    rating: 4.9,
    reviewCount: 31,
    stock: 80,
    images: [
      'https://res.cloudinary.com/dqddawu42/image/upload/v1792506200/sensein/products/sensein-argan-oil-for-hair-body-packshot.jpg'
    ],
    badges: ['OFFICIAL SENSEIN®', 'DUAL-USE ELIXIR', 'COLD-PRESSED'],
    inStock: true,
    overview: 'Multi-purpose dry oil elixir engineered for both hair and body with instant satin glow.',
    howToUse: [
      { step: 1, title: 'Hair Application', instruction: 'Warm 2–3 drops between palms and sweep over damp or dry ends to tame frizz.' },
      { step: 2, title: 'Body Application', instruction: 'Massage over collarbones, arms, and dry areas immediately after showering.' }
    ],
    productDetails: {
      brand: 'SENSEIN',
      productName: 'Argan Oil For Hair & Body',
      productType: 'Multi-Purpose Dry Oil',
      netQuantity: '50 ml'
    },
    benefits: [
      'Instant radiant glow on skin and hair without oily residue.',
      'Rich in antioxidant Vitamin E and essential fatty acids.',
      'Soothes cuticle dryness and enhances color vibrancy.'
    ],
    ingredients: {
      keyActives: [
        { name: 'Pure Argan Oil', role: 'Deep antioxidant barrier defense and shine' },
        { name: 'Jojoba Oil', role: 'Biomimetic botanical lipid that locks in moisture' },
        { name: 'Macadamia Oil', role: 'Replenishes dry hair and skin with essential lipids' }
      ],
      fullList: 'Dimethicone, Cyclopentasiloxane, Diphenyl Amodimethicone, Isopropyl Myristate, Macadamia Oil, Argan Oil, Benzophenone-3, Jojoba Oil and Fragrance.'
    },
    faqs: [
      { question: 'Will this make my hair greasy?', answer: 'No, this lightweight dry oil absorbs quickly into the hair shaft without greasy buildup.' }
    ],
    additionalInfo: {
      shelfLife: '36 Months from Manufacturing Date',
      storage: 'Store away from direct sunlight.'
    },
    reviews: []
  },
  {
    id: 'sensein-5-in-1-total-face-cleanup-facewash',
    name: '5 in 1 Total Face Cleanup Facewash',
    slug: '5-in-1-total-face-cleanup-facewash',
    subtitle: 'Deep cleansing facial cleanser with activated charcoal and mineral kaolin',
    description: 'A high-performance facial cleanser formulated with Activated Carbon and Kaolin Clay to draw out deep-seated impurities, balance surface oils, and thoroughly cleanse pores without overdrying the skin.',
    category: 'Facewash',
    productType: 'single',
    curatedCollection: 'Bestsellers',
    price: 249,
    mrp: 249,
    discountPercentage: 0,
    netVolume: '100 ml (3.38 fl. oz.)',
    variants: [
      { size: '100 ml', price: 249, mrp: 249, inStock: true }
    ],
    rating: 4.8,
    reviewCount: 39,
    stock: 140,
    images: [
      'https://res.cloudinary.com/dqddawu42/image/upload/v1792514002/sensein/products/sensein-charcoal-clay-facewash-packshot.jpg',
      'https://res.cloudinary.com/dqddawu42/image/upload/v1792514005/sensein/products/sensein-charcoal-clay-facewash-texture.jpg'
    ],
    badges: ['OFFICIAL SENSEIN®', 'DEEP CLEANSING', 'OIL BALANCING'],
    inStock: true,
    overview: 'Deep cleansing facial cleanser formulated with activated carbon and kaolin clay to remove impurities and balance surface oils.',
    howToUse: [
      { step: 1, title: 'Splash Water', instruction: 'Splash face thoroughly with clean lukewarm water.' },
      { step: 2, title: 'Dispense Cleanser', instruction: 'Squeeze a coin-sized amount onto wet palms.' },
      { step: 3, title: 'Circular Massage', instruction: 'Massage over face and neck in circular motions for 60 seconds.' },
      { step: 4, title: 'Rinse Clean', instruction: 'Rinse thoroughly with clean water and pat dry with a soft towel.' }
    ],
    productDetails: {
      brand: 'SENSEIN',
      productName: '5 in 1 Total Face Cleanup Facewash',
      productType: 'Purifying Charcoal Cleanser',
      netQuantity: '100 ml'
    },
    benefits: [
      'Draws out urban pollutants, dust, and deep pore sebum.',
      'Maintains natural skin moisture barrier without tautness.',
      'Clarifies complexion for an energized, clean look.'
    ],
    ingredients: {
      keyActives: [
        { name: 'Activated Carbon', role: 'Pore adsorption magnet for micro-pollutants' },
        { name: 'Kaolin Clay', role: 'Mineral-rich sebum regulator and skin refiner' },
        { name: 'Hydrolyzed Silk', role: 'Conditions skin leaving a velvety touch' }
      ],
      fullList: 'Aqua, Palmitic Acid, Stearic Acid, Myristic Acid, Oleic Acid, Potassium Hydroxide, Glycerin, Kaolin, Activated Carbon, Hydrolyzed Silk, Phenoxyethanol.'
    },
    faqs: [
      { question: 'Is this facewash suitable for oily skin?', answer: 'Yes, it is specially formulated to clarify excess sebum and cleanse pores while preserving skin balance.' }
    ],
    additionalInfo: {
      shelfLife: '36 Months from Manufacturing Date',
      storage: 'Store in a cool dry place.'
    },
    reviews: []
  },
  {
    id: 'sensein-volumizing-hair-style-powder',
    name: 'Volumizing Hair Style Powder',
    slug: 'volumizing-hair-style-powder',
    subtitle: 'Instant matte root lift, high volume texture & invisible non-greasy hold',
    description: 'An ultra-fine styling powder engineered to deliver instant gravity-defying root volume, textured matte grip, and effortless separation with a clean residue-free finish.',
    category: 'Hair Styling Wax',
    productType: 'single',
    curatedCollection: 'Bestsellers',
    price: 349,
    mrp: 399,
    discountPercentage: 13,
    netVolume: '20g',
    variants: [
      { size: '20g', price: 349, mrp: 399, inStock: true }
    ],
    rating: 4.9,
    reviewCount: 28,
    stock: 95,
    images: [
      'https://res.cloudinary.com/dqddawu42/image/upload/v1792518001/sensein/products/sensein-volumizing-powder-packshot.jpg'
    ],
    badges: ['OFFICIAL SENSEIN®', 'MATTE ROOT LIFT', '20G'],
    inStock: true,
    overview: 'Ultra-fine styling powder delivering instant root volume, matte finish, and invisible grip.',
    howToUse: [
      { step: 1, title: 'Dust at Roots', instruction: 'Sprinkle directly onto dry hair roots where volume is desired.' },
      { step: 2, title: 'Ruffle & Style', instruction: 'Use fingertips to ruffle hair and sculpt into high-volume shape.' }
    ],
    productDetails: {
      brand: 'SENSEIN',
      productName: 'Volumizing Hair Style Powder',
      productType: 'Root Lift Powder',
      netQuantity: '20 g'
    },
    benefits: [
      'Instant volume and fullness without hair weighing down.',
      'Absorbs surface oil for an effortless matte look.',
      'Easy to rework throughout the day.'
    ],
    ingredients: {
      keyActives: [
        { name: 'Silica Silylate', role: 'Provides micro-friction texture and extreme weightless root lift' }
      ],
      fullList: 'Aqua, Silica Silylate, Sodium Benzoate, Citric Acid.'
    },
    faqs: [
      { question: 'Will this leave white residue in dark hair?', answer: 'No, the ultra-fine micro silica disperses transparently upon contact with hair.' }
    ],
    additionalInfo: {
      shelfLife: '36 Months from Manufacturing Date',
      storage: 'Keep container dry and tightly sealed.'
    },
    reviews: []
  }
];
