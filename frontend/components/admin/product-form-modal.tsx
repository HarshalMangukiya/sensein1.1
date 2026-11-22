'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  UploadCloud,
  Image as ImageIcon,
  Plus,
  Trash2,
  Check,
  ChevronRight,
  Layers,
  Sparkles,
  HelpCircle,
  FileText,
  Info,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Eye,
  Sliders,
  DollarSign,
  Tag,
  ShieldCheck,
  Award,
  Gift,
  Package,
  Boxes,
} from 'lucide-react';
import { uploadProductImageToCloudinary, createProductApi, updateProductApi } from '@/lib/api';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (product: any) => void;
  initialProduct?: any | null;
  initialType?: 'single' | 'combo';
}

type TabKey = 'general' | 'images' | 'routine' | 'details' | 'ingredients' | 'faqs';

const DEFAULT_SHAMPOO_TEMPLATE = {
  productType: 'single',
  name: 'Argan + Keratin Smoothing Shampoo',
  slug: 'argan-keratin-smoothing-shampoo',
  category: 'Shampoo',
  curatedCollection: 'Bestsellers',
  price: 1975,
  mrp: 2499,
  stock: 50,
  netVolume: '1 L (33.81 fl. oz.)',
  inStock: true,
  subtitle: 'Frizz control, hydration and shine, enhanced smoothness, restore and strengthening',
  description:
    'A luxurious salon-grade smoothing shampoo formulated with pure Moroccan Argan Oil and Hydrolyzed Keratin. Gently clarifies the hair and scalp of impurities while infusing intensive nourishment, restoring cellular elasticity, and sealing the cuticle for supreme softness and enduring mirror-shine.',
  overview: 'Ultra-concentrated botanical formulation engineered for cellular reconstruction and frizz elimination.',
  badges: ['Professional Formulation', 'Salon Grade', 'Frizz Control', 'Cruelty Free'],
  images: [
    'https://res.cloudinary.com/dqddawu42/image/upload/v1792492874/sensein/products/media_1792492512087.jpg',
    'https://res.cloudinary.com/dqddawu42/image/upload/v1792492874/sensein/products/media_1792492512127.jpg',
    'https://res.cloudinary.com/dqddawu42/image/upload/v1792492874/sensein/products/media_1792492512160.jpg',
    'https://res.cloudinary.com/dqddawu42/image/upload/v1792492874/sensein/products/media_1792492512811.jpg',
  ],
  howToUse: [
    { step: 1, title: 'Wet Thoroughly', instruction: 'Wet your hair thoroughly with clean water.' },
    {
      step: 2,
      title: 'Apply Shampoo',
      instruction: 'Apply a sufficient amount of SENSEIN Professional Argan + Keratin Smoothing Shampoo according to your hair length.',
    },
    { step: 3, title: 'Gently Massage', instruction: 'Gently massage your hair and scalp for 2–3 minutes to activate micro-circulation.' },
    { step: 4, title: 'Rinse Clean', instruction: 'Rinse thoroughly with clean water until completely clarified.' },
    {
      step: 5,
      title: 'Follow with Mask',
      instruction: 'For best results, follow with SENSEIN Professional Argan + Keratin Smoothing Mask, as recommended on packaging.',
    },
  ],
  usageAdvice: 'Massage into wet scalp for 2 to 3 minutes to activate micro-circulation before rinsing. Follow with SENSEIN Smoothing Mask for optimum results.',
  productDetails: {
    brand: 'SENSEIN',
    range: 'SENSEIN Professional',
    productName: 'Argan + Keratin Smoothing Shampoo',
    productType: 'Shampoo',
    netQuantity: '1 L (33.81 fl. oz.) when packed',
    hairConcern: 'Frizz control, dryness, dullness, hair damage repair',
    scalpSuitability: 'All scalp types including sensitive and chemically smoothed hair',
    keyIngredients: 'Argan Oil, Hydrolyzed Keratin, D-Panthenol and Jojoba Seed Oil',
    keyFeatures: 'Frizz control, hydration and shine, enhanced smoothness, restore and strengthening (as stated on the label)',
    countryOfOrigin: 'PRC, as stated on the packaging',
    importedAndMarketedBy: 'Olive Enterprise, Mota Varachha, Surat, Gujarat, India',
    manufacturedBy: 'Guangzhou Forte Cosmetics Company Limited, Guangzhou, China.',
  },
  benefits: [
    'Helps clean hair and remove buildup without stripping essential moisture',
    'Enriched with Argan Oil and Hydrolyzed Keratin to smooth and soften hair',
    'Provides frizz control, hydration, and radiant mirror-like shine',
    'Helps restore and strengthen dry, brittle, or chemically treated strands',
    'Gentle daily luxury formulation suitable for prolonged salon-treated hair',
  ],
  ingredients: {
    keyActives: [
      { name: 'Argan Oil', role: 'Intense moisture, antioxidant protection, and radiant shine' },
      { name: 'Hydrolyzed Keratin', role: 'Restores structural integrity and seals the hair cuticle' },
      { name: 'D-Panthenol (Pro-Vitamin B5)', role: 'Long-lasting hydration and soothing scalp relief' },
      { name: 'Jojoba Seed Oil', role: 'Lipid balance, elasticity enhancement, and strand softness' },
    ],
    fullList:
      'Aqua, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Cocamide MEA, Argania Spinosa Kernel (Argan) Oil, Hydrolyzed Keratin, Panthenol (D-Panthenol), Simmondsia Chinensis (Jojoba) Seed Oil, Dimethiconol, TEA-Dodecylbenzenesulfonate, Glycol Distearate, Fragrance (Parfum), Guar Hydroxypropyltrimonium Chloride, Citric Acid, Disodium EDTA, Sodium Chloride, Methylchloroisothiazolinone, Methylisothiazolinone.',
  },
  faqs: [
    {
      question: 'Is this shampoo safe for keratin-treated or chemically smoothed hair?',
      answer:
        'Yes. Our salon-grade formula is specifically enriched with bio-active Hydrolyzed Keratin to fortify and prolong keratin treatments, rebonding, and color treatments.',
    },
    {
      question: 'How frequently should I use this shampoo?',
      answer:
        'It is gentle enough for daily or frequent use. For optimal results, we suggest washing 2 to 3 times per week followed by our Argan + Keratin Mask.',
    },
    {
      question: 'What hair types is this smoothing formulation best suited for?',
      answer:
        'It is engineered for all hair textures, especially frizzy, dry, unmanageable, wavy, curly, or color-treated hair seeking maximum silkiness.',
    },
  ],
  additionalInfo: {
    shelfLife: '36 Months from Manufacturing Date',
    storage: 'Store in a cool, dry place away from direct sunlight and excessive heat.',
    hairType: 'Suitable for all hair textures; ideal for frizzy, dry, or chemically treated hair.',
    caution: 'For external use only. Avoid contact with eyes. If contact occurs, rinse immediately with plenty of clean water.',
  },
};

const DEFAULT_WAX_TEMPLATE = {
  productType: 'single',
  name: 'Hair Wax',
  slug: 'hair-wax',
  category: 'Hair Styling Wax',
  curatedCollection: 'Bestsellers',
  price: 249,
  mrp: 249,
  stock: 120,
  netVolume: '100g',
  inStock: true,
  subtitle: 'Non sticky formula, Shape, style, and shine with lasting hold!',
  description:
    'A premium salon-grade styling wax crafted to shape, style, and define your look with radiant shine and lasting hold. Featuring an ultra-clean, non-sticky formula that allows effortless control and restyling throughout the day for short, medium, and long hair.',
  overview: 'Shape, style, and shine with lasting hold!',
  badges: ['Non-Sticky Formula', 'Salon Grade', 'Clean Restyle', 'Medium-High Hold'],
  images: [
    'https://res.cloudinary.com/dqddawu42/image/upload/v1792479863/sensein/products/sensein-hair-wax-1.jpg',
    'https://res.cloudinary.com/dqddawu42/image/upload/v1792479865/sensein/products/sensein-hair-wax-2.jpg',
  ],
  howToUse: [
    { step: 1, title: 'Take Scoop of Wax', instruction: 'Take an appropriate amount of SENSEIN Hair Wax according to your hair length.' },
    { step: 2, title: 'Warm & Spread', instruction: 'Rub the wax between your hands to warm and spread it evenly.' },
    { step: 3, title: 'Apply to Hair', instruction: 'Apply evenly to your hair, including the areas you want to style.' },
    { step: 4, title: 'Shape & Style', instruction: 'Shape your hair into your desired look and adjust as needed.' },
  ],
  usageAdvice: 'Warm thoroughly between fingertips for seamless spreadability. Suitable for daily restyling without washing out between touch-ups.',
  productDetails: {
    brand: 'SENSEIN',
    range: 'SENSEIN Professional',
    productName: 'Hair Wax',
    productType: 'Hair Styling Wax',
    netQuantity: '100g',
    holdStrength: 'Medium to High Flexible Hold',
    finish: 'Natural High Definition with Semi-Matte Shine',
    restyleability: 'Dynamic Restyleable Memory Polymer',
    suitableHairLength: 'Short, medium and long hair',
    keyFeatures: 'Non-sticky formula, Shape, style, and shine with lasting hold!',
    countryOfOrigin: 'India',
    importer: 'Olive Enterprise, Surat, Gujarat',
  },
  benefits: [
    'Non-sticky clean formulation that leaves zero greasy residue or heavy flakes',
    'Allows dynamic restyling throughout the day without washing out',
    'Provides flexible medium-to-strong hold with natural hair movement',
    'Adds refined luster and healthy moisture to all hair types',
  ],
  ingredients: {
    keyActives: [
      { name: 'Microcrystalline Cera', role: 'Provides flexible structure, memory hold, and moldability' },
      { name: 'Candelilla Wax', role: 'Natural botanical wax conferring moisture barrier and soft sheen' },
      { name: 'Vitamin E (Tocopherol)', role: 'Antioxidant protection against environmental aggressors' },
    ],
    fullList:
      'Aqua, Cera Microcristallina, Euphorbia Cerifera (Candelilla) Wax, Ceteareth-20, Glyceryl Stearate, PEG-100 Stearate, Glycerin, Propylene Glycol, Tocopheryl Acetate, Fragrance (Parfum), Phenoxyethanol, Ethylhexylglycerin.',
  },
  faqs: [
    {
      question: 'Will this wax leave a sticky residue or wash out easily?',
      answer: 'Our formulation is strictly non-sticky. It washes out cleanly with warm water and your everyday shampoo.',
    },
    {
      question: 'Can I restyle my hair later in the day?',
      answer: 'Yes! The flexible memory polymers allow you to adjust and re-shape your hairstyle throughout the day without re-applying.',
    },
  ],
  additionalInfo: {
    shelfLife: '24 Months from Manufacturing Date',
    storage: 'Keep lid tightly closed. Store at room temperature away from heat sources.',
    hairType: 'Suitable for all hair types and lengths.',
    caution: 'Avoid contact with eyes. Keep out of reach of children.',
  },
};

const DEFAULT_MASK_TEMPLATE = {
  productType: 'single',
  name: 'Argan + Keratin Smoothing Hair Mask',
  slug: 'argan-keratin-smoothing-hair-mask',
  category: 'Hair Mask',
  curatedCollection: 'Bestsellers',
  price: 1275,
  mrp: 1275,
  stock: 65,
  netVolume: '500 g (16.91 fl. oz.)',
  inStock: true,
  subtitle: 'Deep hydration, detangling and shine enhancement',
  description:
    'A deeply restorative salon-grade hair mask formulated with pure Moroccan Argan Oil, Hydrolyzed Keratin, Hydrolyzed Wheat Protein, and Arginine. Delivers deep hydration, detangling, and radiant shine enhancement while reducing frizz and conditioning hair for a softer, smoother feel.',
  overview: 'Deep hydration, detangling and shine enhancement (as stated on the packaging).',
  badges: ['Official SENSEIN®', 'Deep Hydration', '500g Salon Pack', 'Cruelty Free'],
  images: [
    'https://res.cloudinary.com/dqddawu42/image/upload/v1792509767/sensein/products/bqvimbfiit9d5pwk7qwn.jpg',
    'https://res.cloudinary.com/dqddawu42/image/upload/v1792509769/sensein/products/lb9lgreexbsulxi3n1fa.jpg',
  ],
  howToUse: [
    {
      step: 1,
      title: 'Wash & Prepare',
      instruction: 'After washing your hair, take an adequate amount of SENSEIN Professional Argan + Keratin Smoothing Hair Mask.',
    },
    {
      step: 2,
      title: 'Apply Evenly',
      instruction: 'Apply evenly to wet hair and scalp, following the product label instructions.',
    },
    {
      step: 3,
      title: 'Massage & Leave On',
      instruction: 'Gently massage and leave on for 5–10 minutes.',
    },
    {
      step: 4,
      title: 'Rinse Thoroughly',
      instruction: 'Rinse thoroughly with clean water.',
    },
    {
      step: 5,
      title: 'Recommended Frequency',
      instruction: 'The packaging recommends using the product 2–3 times a week.',
    },
  ],
  usageAdvice: 'Leave on for 5 to 10 minutes before rinsing with cool water to seal the hair cuticle. Use 2 to 3 times weekly in place of conditioner.',
  productDetails: {
    brand: 'SENSEIN',
    range: 'SENSEIN Professional',
    productName: 'Argan + Keratin Smoothing Hair Mask',
    productType: 'Hair Mask',
    netQuantity: '500 g (16.91 fl. oz.) when packed',
    treatmentTime: '5–10 Minutes Intensive Restorative Masque',
    targetHairCondition: 'Damaged, chemically treated, frizzy, or bleached strands',
    keyIngredients: 'Argan Oil, Hydrolyzed Keratin, Hydrolyzed Wheat Protein and Arginine',
    keyFeatures: 'Deep hydration, detangling and shine enhancement (as stated on the packaging)',
    countryOfOrigin: 'PRC, as stated on the packaging',
    importedAndMarketedBy: 'Olive Enterprise, Mota Varachha, Surat, Gujarat, India',
    manufacturedBy: 'Guangzhou Forte Cosmetics Company Limited, Guangzhou, China.',
  },
  benefits: [
    'Helps condition hair for a softer, smoother feel.',
    'Helps improve detangling and manageability.',
    'Helps enhance the appearance of hair shine.',
    'Designed to help reduce the appearance of frizz.',
    'Contains Argan Oil and Hydrolyzed Keratin.',
  ],
  ingredients: {
    keyActives: [
      { name: 'Argan Oil', role: 'Nourishes and conditions hair' },
      { name: 'Hydrolyzed Keratin', role: 'Helps strengthen and smooth hair' },
      { name: 'Hydrolyzed Wheat Protein', role: 'Helps improve hair texture and smoothness' },
      { name: 'Arginine', role: 'Helps support hair conditioning' },
      { name: 'D-Panthenol', role: 'Helps moisturize and strengthen hair' },
    ],
    fullList:
      'Water, Cetearyl Alcohol, Glycerin, Steartrimonium Chloride, Hydroxyethyl Cellulose, Dimethicone, Amodimethicone, Fragrance, DMDM Hydantoin, Citric Acid, Hydrolyzed Wheat Protein, Hydrolyzed Keratin, Argan Oil, D-Panthenol, Arginine, Kazon and CI 16185.',
  },
  faqs: [
    {
      question: 'What is SENSEIN Argan + Keratin Smoothing Hair Mask?',
      answer: 'It is a conditioning hair mask designed to help improve smoothness, detangling and shine.',
    },
    {
      question: 'How long should I leave the mask on?',
      answer: 'The supplied label recommends leaving it on for 5–10 minutes before rinsing.',
    },
    {
      question: 'How often should I use it?',
      answer: 'The packaging recommends 2–3 times a week.',
    },
  ],
  additionalInfo: {
    shelfLife: '36 Months from Manufacturing Date',
    storage: 'Store in a cool, dry place away from direct sunlight and close the container tightly after use.',
    hairType: 'Suitable for all hair textures; especially frizzy, dry, unmanageable, or chemically treated hair.',
    caution: 'For external use only. Avoid contact with eyes. In case of contact, rinse thoroughly with clean water.',
  },
};

const DEFAULT_OIL_TEMPLATE = {
  productType: 'single',
  name: 'Argan Oil for Hair & Body',
  slug: 'argan-oil-for-hair-body',
  category: 'Hair & Body Oil',
  curatedCollection: 'Bestsellers',
  price: 2400,
  mrp: 2400,
  stock: 80,
  netVolume: '100 ml (3.38 fl. oz.)',
  inStock: true,
  subtitle: 'Multi-purpose cosmetic oil infused with Argan, Jojoba & Macadamia Oils for radiant hair shine and soft, moisturized skin.',
  description:
    'SENSEIN Professional Argan Oil for Hair & Body is a multi-purpose cosmetic oil formulated to add lustrous shine, smooth frizz and flyaways, and leave hair feeling softer and more manageable. On the body, it delivers a deeply moisturizing, non-greasy feel to replenish clean skin.',
  overview: 'Multi-purpose cosmetic oil formulated to add shine to hair and moisturize skin.',
  badges: ['Official SENSEIN®', 'Hair & Body Elixir', '100ml Pack', 'Multi-Purpose Oil'],
  images: [
    'https://res.cloudinary.com/dqddawu42/image/upload/v1792511270/sensein/products/sensein-argan-oil-hero.jpg',
    'https://res.cloudinary.com/dqddawu42/image/upload/v1792511272/sensein/products/sensein-argan-oil-pour.jpg',
  ],
  howToUse: [
    {
      step: 1,
      title: 'Hair Care — Palm Dispense',
      instruction: 'Take a few drops of SENSEIN Argan Oil into your palms.',
    },
    {
      step: 2,
      title: 'Hair Care — Rub & Distribute',
      instruction: 'Rub your palms together and distribute the oil through your hair, focusing on lengths and ends.',
    },
    {
      step: 3,
      title: 'Hair Care — Smooth & Defrizz',
      instruction: 'Use a small amount to help smooth frizz, tame flyaways, and add luxurious mirror-like shine.',
    },
    {
      step: 4,
      title: 'Body Care — Apply to Clean Skin',
      instruction: 'Apply a small amount to clean skin and gently massage until spread evenly.',
    },
  ],
  usageAdvice: 'Start with 2-3 drops warmed in palms. Apply through towel-dried or dry hair ends, or gently massage onto pulse points and dry skin areas.',
  productDetails: {
    brand: 'SENSEIN',
    range: 'SENSEIN Professional',
    productName: 'Argan Oil for Hair & Body',
    productType: 'Multi-purpose cosmetic oil',
    netQuantity: '100 ml (3.38 fl. oz.) when packed',
    absorptionRate: 'Fast-absorbing dry botanical elixir',
    keyOils: 'Argan Oil, Jojoba Oil and Macadamia Oil',
    countryOfOrigin: 'PRC, as stated on the packaging',
    importedAndMarketedBy: 'Olive Enterprise, Surat, Gujarat, India',
    manufacturedBy: 'Guangzhou Forte Cosmetics Company Limited, Guangzhou, China.',
  },
  benefits: [
    'Helps add shine to the appearance of hair.',
    'Helps smooth the look of frizz and flyaways.',
    'Helps leave hair feeling softer and more manageable.',
    'Provides a moisturizing feel when applied to skin.',
    'Contains Argan Oil, Jojoba Oil and Macadamia Oil.',
  ],
  ingredients: {
    keyActives: [
      { name: 'Argan Oil', role: 'Helps add softness and shine. Rich in essential fatty acids and vitamin E.' },
      { name: 'Jojoba Oil', role: 'Helps condition hair. Biomimetic botanical lipid that locks in moisture.' },
      { name: 'Macadamia Oil', role: 'Nourishes and conditions. Replenishes dry hair and skin with essential lipids.' },
    ],
    fullList:
      'Dimethicone, Cyclopentasiloxane, Diphenyl Amodimethicone, Isopropyl Myristate, Macadamia Oil, Argan Oil, Benzophenone-3, Jojoba Oil and Fragrance.',
  },
  faqs: [
    {
      question: 'What is SENSEIN Argan Oil used for?',
      answer: 'The product is marketed for hair and body care and is designed to help add shine and softness to hair and moisturize skin.',
    },
    {
      question: 'How do I use it on my hair?',
      answer: 'Start with a few drops, spread between your palms and apply sparingly through the hair, focusing on the lengths and ends.',
    },
  ],
  additionalInfo: {
    shelfLife: '36 Months from Manufacturing Date',
    storage: 'Store in a cool, dry place away from direct sunlight.',
    caution: 'Use sparingly at first. Avoid contact with eyes and do not apply to irritated or damaged skin.',
  },
};

const DEFAULT_FACEWASH_TEMPLATE = {
  productType: 'single',
  name: 'Charcoal + Clay Facewash',
  slug: 'charcoal-clay-facewash',
  category: 'Facewash',
  curatedCollection: 'Bestsellers',
  price: 249,
  mrp: 249,
  stock: 150,
  netVolume: '100 ml (3.38 fl. oz.)',
  inStock: true,
  subtitle: 'Deep cleansing facial cleanser with activated carbon and kaolin clay',
  description:
    'A high-performance facial cleanser formulated with Activated Carbon and Kaolin Clay to draw out deep-seated impurities, balance surface oils, and thoroughly cleanse pores without overdrying the skin.',
  overview: 'Deep cleansing facial cleanser formulated with activated carbon and kaolin clay to remove impurities and balance surface oils.',
  badges: ['Official SENSEIN®', 'Deep Cleansing', 'Oil Balancing', 'Activated Charcoal'],
  images: [
    'https://res.cloudinary.com/dqddawu42/image/upload/v1792514002/sensein/products/sensein-charcoal-clay-facewash-packshot.jpg',
    'https://res.cloudinary.com/dqddawu42/image/upload/v1792514005/sensein/products/sensein-charcoal-clay-facewash-texture.jpg',
  ],
  howToUse: [
    { step: 1, title: 'Wet Face', instruction: 'Splash face thoroughly with clean lukewarm water.' },
    { step: 2, title: 'Dispense Cleanser', instruction: 'Squeeze an appropriate coin-sized amount of Charcoal + Clay Facewash onto palms.' },
    { step: 3, title: 'Circular Massage', instruction: 'Gently massage over face and neck in circular motions for 60 seconds, avoiding direct eye contact.' },
    { step: 4, title: 'Rinse Clean', instruction: 'Rinse thoroughly with clean water until completely clarified.' },
    { step: 5, title: 'Pat Dry', instruction: 'Pat dry with a soft clean towel and follow with moisturizer or SPF.' },
  ],
  usageAdvice: 'Use morning and evening as the first step of your grooming routine. Follow with hydration.',
  productDetails: {
    brand: 'SENSEIN',
    range: "SENSEIN Men's & Unisex Skincare",
    productName: 'Charcoal + Clay Facewash',
    productType: 'Facewash',
    netQuantity: '100 ml (3.38 fl. oz.) when packed',
    skinSuitability: 'All skin types; especially oily, combination and acne-prone skin',
    exfoliationMechanism: 'Activated carbon micro-adsorption and gentle kaolin smoothing',
    keyIngredients: 'Activated Carbon, Kaolin Clay, Glycerin and Hydrolyzed Silk',
    keyFeatures: 'Deep Cleansing, Oil Balancing, Unclogging Pores',
    countryOfOrigin: 'PRC, as stated on the packaging',
    importedAndMarketedBy: 'Olive Enterprise, Surat, Gujarat, India',
    manufacturedBy: 'Guangzhou Forte Cosmetics Company Limited, Guangzhou, China.',
  },
  benefits: [
    'Deep Cleansing: Draws out pollution, dead cells, and embedded impurities.',
    'Oil Balancing: Clarifies excess surface sebum while preserving natural moisture.',
    'Activated Carbon: Natural adsorption agent for visibly detoxified skin.',
    'Kaolin Clay Care: Refines pore texture and imparts a clean matte look.',
    'Invigorating Freshness: Leaves skin feeling refreshed, smooth, and energized.',
  ],
  ingredients: {
    keyActives: [
      { name: 'Activated Carbon', role: 'Draws out dirt, oil, and micro-pollutants from deep within pores' },
      { name: 'Kaolin Clay', role: 'Mineral-rich clay that absorbs excess sebum and refines skin texture' },
      { name: 'Glycerin', role: 'Humectant that binds moisture to the epidermis preventing tightness' },
      { name: 'Hydrolyzed Silk', role: 'Conditions skin leaving a velvety smooth protective touch' },
    ],
    fullList:
      'Aqua, Palmitic Acid, Stearic Acid, Myristic Acid, Oleic Acid, Potassium Hydroxide, Glycerin, PEG-150, Sodium Methyl Cocoyl Taurate, Disodium EDTA, Fragrance, BHT, Kaolin, Activated Carbon, Hydrolyzed Silk, Phenoxyethanol.',
  },
  faqs: [
    {
      question: 'What skin types is this facewash suitable for?',
      answer: 'It is engineered for all skin types, especially oily, combination, or pollution-exposed skin seeking deep purification.',
    },
    {
      question: 'Will this facewash leave the skin feeling dry or tight?',
      answer: 'No. The formulation pairs deep-cleansing charcoal and kaolin with hydrating glycerin and hydrolyzed silk to maintain moisture balance.',
    },
    {
      question: 'How frequently should I use it?',
      answer: 'We recommend using it twice daily: once in the morning and once before bed.',
    },
  ],
  additionalInfo: {
    shelfLife: '36 Months from Manufacturing Date',
    storage: 'Store in a cool, dry place away from direct sunlight.',
    caution: 'For external use only. Avoid contact with eyes. In case of eye contact, rinse immediately with clean water.',
  },
};

const DEFAULT_COMBO_TEMPLATE = {
  productType: 'combo',
  name: 'Hair & Face Care Combo Pack – 3 × 50 ml',
  slug: 'hair-face-care-combo-pack',
  category: 'Combos',
  curatedCollection: 'Bestsellers',
  price: 549,
  mrp: 849,
  stock: 200,
  netVolume: '150 ml (3 × 50 ml)',
  inStock: true,
  subtitle: 'Complete Grooming Routine • Shampoo + Leave-In Cream + Facewash',
  description:
    'Complete Your Hair & Skin Care Routine with One Combo. Discover everyday grooming essentials with the SENSEIN Professional Hair & Face Care Combo Pack. This convenient set combines two hair-care products and one facewash to support a simple, practical personal care routine at home or on travel.',
  overview: 'Complete 3-in-1 luxury travel grooming kit: clarifying hair cleanse, leave-in moisture defense, and deep facial cleanup.',
  badges: ['Value Combo', 'Travel Friendly', '3-in-1 Kit', 'Save 35%'],
  images: [
    'https://res.cloudinary.com/dqddawu42/image/upload/v1792520126/sensein/products/sensein-combo-pack-packshot.jpg',
    'https://res.cloudinary.com/dqddawu42/image/upload/v1792520128/sensein/products/sensein-combo-pack-travel-kit.jpg',
    'https://res.cloudinary.com/dqddawu42/image/upload/v1792520130/sensein/products/sensein-combo-pack-textures.jpg',
  ],
  comboItems: [
    { name: 'Argan + Keratin Smoothing Shampoo', quantity: '50 ml', description: 'Gently clarifies impurities while infusing intensive nourishment and frizz control.' },
    { name: 'Leave-In Moisture Conditioning Cream', quantity: '50 ml', description: 'Deep cellular moisture, improves hair elasticity, soft touch, and heat defense.' },
    { name: '5 IN 1 Total Face Cleanup Facewash', quantity: '50 ml', description: 'Multi-benefit face cleanser with walnut micro-beads for deep exfoliation and glow.' },
  ],
  howToUse: [
    { step: 1, title: 'Cleanse Your Hair', instruction: 'Wet hair thoroughly, massage Argan + Keratin Shampoo for 2 minutes to clear scalp sebum, and rinse thoroughly.' },
    { step: 2, title: 'Moisturise & Condition', instruction: 'Apply a coin-sized amount of Leave-In Cream through towel-dried hair. Do not rinse out; style as desired.' },
    { step: 3, title: 'Cleanse Your Face', instruction: 'Wet face with clean water, gently massage 5 IN 1 Facewash in circular motions for 60 seconds, and rinse completely.' },
    { step: 4, title: 'Daily Care Ritual', instruction: 'Repeat routine as desired for smooth, manageable hair and fresh, radiant skin every single day.' },
  ],
  usageAdvice: 'Use Shampoo and Facewash during shower; apply Leave-In Cream on towel-dried hair before styling. Suitable for daily use by men and women.',
  productDetails: {
    brand: 'SENSEIN',
    range: 'SENSEIN Professional',
    productName: 'Hair & Face Care Combo Pack',
    comboType: 'Hair Care + Facial Care Complete Grooming Kit',
    numberOfProducts: '3 Products (Shampoo 50 ml + Leave-In Cream 50 ml + Facewash 50 ml)',
    totalNetQuantity: '150 ml (3 × 50 ml / 3 × 1.69 fl. oz.)',
    suitableFor: 'Men and Women (All Hair & Skin Types)',
    countryOfOrigin: 'PRC, as indicated on the supplied packaging',
    importedAndMarketedBy: 'Olive Enterprise, Surat, Gujarat, India – 394101',
    manufacturedBy: 'Guangzhou Forte Cosmetics Company Limited, Guangzhou, China.',
    shelfLife: '36 months from manufacturing date',
    customerCareEmail: 'info@sensein.in',
    customerCareNumber: '18008910710',
  },
  benefits: [
    'Complete Grooming Combo: Combines two salon-grade hair-care products and one multi-action facewash.',
    'Hair Moisture Care: Leave-in cream delivers deep cellular hydration, strand softness, and shine.',
    'Smoother-Feeling Hair: Shampoo and leave-in cream work synergistically for long-lasting frizz control.',
    'Everyday Hair Cleansing: Gently clears away sebum, sweat, and environmental pollution.',
    'Facial Cleansing & Exfoliation: Facewash purifies pores and dead skin cells with walnut powder.',
    'Multi-Benefit Skincare: Delivers 5 benefits in one: cleansing, exfoliation, hydration, brightness, and oil control.',
    'Convenient Travel Pack: Three leak-proof 50 ml bottles in a compact set, easy to carry anywhere.',
  ],
  ingredients: {
    keyActives: [
      { name: 'Argan Oil & Hydrolyzed Keratin', role: 'In Shampoo: Restores softness, seals cuticles, and controls frizz' },
      { name: 'Niacinamide & Panthenol', role: 'In Leave-In Cream: Deep cellular moisture, improves elasticity and luster' },
      { name: 'Hyaluronic Acid & Walnut Powder', role: 'In Facewash: Gently exfoliates dead cells while retaining hydration' },
      { name: 'Nymphaea Odorata Root Extract', role: 'Soothes hair cuticles and prevents environmental dehydration' },
    ],
    fullList:
      'Pack combines 3 complete formulations: (1) Leave-In Cream 50ml: Aqua, Cetyl Alcohol, Disodium EDTA, Stearyl Alcohol, Behentrimonium Methosulfate, Citric Acid, Benzyl Alcohol, Panthenyl Ethyl Ether, Parfum, Niacinamide, Sodium Benzoate, Nymphaea Odorata Root Extract, Mentha Arvensis Leaf Oil. (2) Argan + Keratin Shampoo 50ml: Aqua, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Argania Spinosa Kernel Oil, Hydrolyzed Keratin, D-Panthenol, Jojoba Seed Oil, Fragrance. (3) 5 IN 1 Cleanup Facewash 50ml: Aqua, Cocamidopropyl Betaine, Decyl Glucoside, Glycerin, Walnut Powder, Hyaluronic Acid, Trehalose, Cellulose, Fragrance.',
  },
  faqs: [
    {
      question: 'What is included in the SENSEIN Professional Hair & Face Care Combo Pack?',
      answer: 'It includes Leave-In Cream with Hair Moisturiser (50 ml), Argan + Keratin Smoothing Shampoo (50 ml), and 5 IN 1 Total Face Cleanup Facewash (50 ml).',
    },
    {
      question: 'What is the total quantity of the combo?',
      answer: 'The pack contains three products of 50 ml each, giving a total net quantity of 150 ml (3 × 1.69 fl. oz.).',
    },
    {
      question: 'Can men and women use this combo?',
      answer: 'Yes! All three products are formulated for both men and women across all skin and hair types.',
    },
    {
      question: 'Is this combo convenient for travel?',
      answer: 'Yes, the three compact 50 ml bottles are TSA flight-friendly, leak-proof, and ideal for gym sessions and travel.',
    },
  ],
  additionalInfo: {
    brand: 'SENSEIN Professional',
    packagingNetQuantity: '150 ml (3 × 50 ml)',
    storageInstructions: 'Store in a cool, dry place away from direct sunlight.',
    caution: 'For external use only. Avoid direct contact with eyes. Discontinue use if irritation occurs.',
    shelfLife: '36 months from manufacturing date',
    customerCareEmail: 'info@sensein.in',
    customerCareNumber: '18008910710',
  },
};

const CATEGORY_TEMPLATES: Record<string, any> = {
  'Shampoo': DEFAULT_SHAMPOO_TEMPLATE,
  'Hair Styling Wax': DEFAULT_WAX_TEMPLATE,
  'Wax': DEFAULT_WAX_TEMPLATE,
  'Hair Mask': DEFAULT_MASK_TEMPLATE,
  'Hair & Body Oil': DEFAULT_OIL_TEMPLATE,
  'Facewash': DEFAULT_FACEWASH_TEMPLATE,
  'Combos': DEFAULT_COMBO_TEMPLATE,
};

export function ProductFormModal({
  isOpen,
  onClose,
  onSaved,
  initialProduct,
  initialType = 'single',
}: ProductFormModalProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('general');
  const [productType, setProductType] = useState<'single' | 'combo'>(initialType);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [badgeInput, setBadgeInput] = useState('');
  const [newDetailKey, setNewDetailKey] = useState('');
  const [newDetailVal, setNewDetailVal] = useState('');
  const [newBenefitInput, setNewBenefitInput] = useState('');

  // New combo item input state
  const [newComboItemName, setNewComboItemName] = useState('');
  const [newComboItemQty, setNewComboItemQty] = useState('');
  const [newComboItemDesc, setNewComboItemDesc] = useState('');

  // Form State
  const [formData, setFormData] = useState<any>({
    productType: 'single',
    name: '',
    slug: '',
    category: 'Shampoo',
    curatedCollection: 'Bestsellers',
    price: 1975,
    mrp: 2499,
    stock: 50,
    netVolume: '1 L (33.81 fl. oz.)',
    inStock: true,
    subtitle: '',
    description: '',
    overview: '',
    badges: ['Professional Formulation', 'Salon Grade'],
    images: [] as string[],
    comboItems: [] as Array<{ name: string; quantity: string; description: string }>,
    howToUse: [] as Array<{ step: number; title: string; instruction: string }>,
    usageAdvice: '',
    productDetails: {} as Record<string, string>,
    benefits: [] as string[],
    ingredients: {
      keyActives: [] as Array<{ name: string; role: string }>,
      fullList: '',
    },
    faqs: [] as Array<{ question: string; answer: string }>,
    additionalInfo: {} as Record<string, string>,
  });

  // Sync initial product if provided
  useEffect(() => {
    if (initialProduct) {
      const isCombo =
        initialProduct.productType === 'combo' ||
        initialProduct.category === 'Combos' ||
        (Array.isArray(initialProduct.comboItems) && initialProduct.comboItems.length > 0) ||
        (initialProduct.name || '').toLowerCase().includes('combo');

      setProductType(isCombo ? 'combo' : 'single');
      setFormData({
        ...initialProduct,
        productType: isCombo ? 'combo' : 'single',
        images: initialProduct.images || [],
        comboItems: initialProduct.comboItems || (isCombo ? DEFAULT_COMBO_TEMPLATE.comboItems : []),
        howToUse: initialProduct.howToUse || [],
        usageAdvice: initialProduct.usageAdvice || '',
        productDetails: initialProduct.productDetails || {},
        benefits: initialProduct.benefits || [],
        ingredients: {
          keyActives: Array.isArray(initialProduct.ingredients?.keyActives)
            ? initialProduct.ingredients.keyActives.map((k: any) =>
                typeof k === 'string'
                  ? { name: k.split('(')[0].trim(), role: k.includes('(') ? k.split('(')[1].replace(')', '') : '' }
                  : k
              )
            : [],
          fullList: initialProduct.ingredients?.fullList || '',
        },
        faqs: initialProduct.faqs || [],
        additionalInfo: initialProduct.additionalInfo || {},
      });
    } else {
      if (initialType === 'combo') {
        setProductType('combo');
        setFormData(DEFAULT_COMBO_TEMPLATE);
      } else {
        setProductType('single');
        setFormData(DEFAULT_SHAMPOO_TEMPLATE);
      }
    }
  }, [initialProduct, initialType, isOpen]);

  if (!isOpen) return null;

  // Handle format switch (Single vs Combo)
  const handleFormatSwitch = (type: 'single' | 'combo') => {
    setProductType(type);
    if (!initialProduct) {
      if (type === 'combo') {
        setFormData({
          ...DEFAULT_COMBO_TEMPLATE,
          images: formData.images.length > 0 ? formData.images : DEFAULT_COMBO_TEMPLATE.images,
        });
      } else {
        setFormData({
          ...DEFAULT_SHAMPOO_TEMPLATE,
          images: formData.images.length > 0 ? formData.images : DEFAULT_SHAMPOO_TEMPLATE.images,
        });
      }
    } else {
      setFormData((prev: any) => ({
        ...prev,
        productType: type,
        category: type === 'combo' ? 'Combos' : (prev.category === 'Combos' ? 'Shampoo' : prev.category),
      }));
    }
  };

  // Load category rituals and specifications template
  const loadCategoryTemplate = (categoryName: string) => {
    const template = CATEGORY_TEMPLATES[categoryName] || DEFAULT_SHAMPOO_TEMPLATE;
    const currentImages = formData.images && formData.images.length > 0 ? formData.images : template.images;
    setFormData({
      ...template,
      images: currentImages,
      productType: categoryName === 'Combos' ? 'combo' : 'single',
    });
    setProductType(categoryName === 'Combos' ? 'combo' : 'single');
  };

  // Auto-generate slug when name changes if not explicitly custom
  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setFormData((prev: any) => ({
      ...prev,
      name,
      slug: prev.slug === '' || !initialProduct ? slug : prev.slug,
    }));
  };

  // Image Upload Handler (Cloudinary)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    const fileArray = Array.from(files);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      setUploadProgressText(`Uploading ${i + 1} of ${fileArray.length}: ${file.name} to Cloudinary...`);

      try {
        const base64 = await readFileAsBase64(file);
        const res = await uploadProductImageToCloudinary(base64, formData.slug || 'product');
        if (res.success && res.url) {
          uploadedUrls.push(res.url);
        } else {
          alert(`Cloudinary notice for ${file.name}: ${res.error || 'Upload error'}`);
        }
      } catch (err: any) {
        console.error('File read error:', err);
      }
    }

    if (uploadedUrls.length > 0) {
      setFormData((prev: any) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
    }

    setUploadingImage(false);
    setUploadProgressText('');
    e.target.value = '';
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Add Direct Image URL to Cloudinary
  const handleAddImageUrl = async () => {
    if (!imageUrlInput.trim()) return;
    setUploadingImage(true);
    setUploadProgressText('Uploading remote URL to Cloudinary CDN...');
    try {
      const res = await uploadProductImageToCloudinary(imageUrlInput.trim(), formData.slug || 'product');
      if (res.success && res.url) {
        setFormData((prev: any) => ({
          ...prev,
          images: [...prev.images, res.url],
        }));
        setImageUrlInput('');
      } else {
        alert(`Failed to store image in Cloudinary: ${res.error}`);
      }
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    } finally {
      setUploadingImage(false);
      setUploadProgressText('');
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      images: prev.images.filter((_: any, i: number) => i !== index),
    }));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    setFormData((prev: any) => {
      const newImages = [...prev.images];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newImages.length) return prev;
      const temp = newImages[index];
      newImages[index] = newImages[targetIndex];
      newImages[targetIndex] = temp;
      return { ...prev, images: newImages };
    });
  };

  const setAsCoverImage = (index: number) => {
    setFormData((prev: any) => {
      const newImages = [...prev.images];
      const [item] = newImages.splice(index, 1);
      newImages.unshift(item);
      return { ...prev, images: newImages };
    });
  };

  // Badges Management
  const addBadge = () => {
    if (!badgeInput.trim()) return;
    if (!formData.badges?.includes(badgeInput.trim())) {
      setFormData((prev: any) => ({
        ...prev,
        badges: [...(prev.badges || []), badgeInput.trim()],
      }));
    }
    setBadgeInput('');
  };

  const removeBadge = (badge: string) => {
    setFormData((prev: any) => ({
      ...prev,
      badges: (prev.badges || []).filter((b: string) => b !== badge),
    }));
  };

  // Combo Items Management
  const addComboItem = () => {
    if (!newComboItemName.trim()) return;
    setFormData((prev: any) => ({
      ...prev,
      comboItems: [
        ...(prev.comboItems || []),
        {
          name: newComboItemName.trim(),
          quantity: newComboItemQty.trim() || '50 ml',
          description: newComboItemDesc.trim(),
        },
      ],
    }));
    setNewComboItemName('');
    setNewComboItemQty('');
    setNewComboItemDesc('');
  };

  const removeComboItem = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      comboItems: (prev.comboItems || []).filter((_: any, i: number) => i !== index),
    }));
  };

  // How To Use Steps
  const addStep = () => {
    const nextStepNum = (formData.howToUse?.length || 0) + 1;
    setFormData((prev: any) => ({
      ...prev,
      howToUse: [
        ...(prev.howToUse || []),
        { step: nextStepNum, title: `Step ${nextStepNum}`, instruction: '' },
      ],
    }));
  };

  const updateStep = (index: number, field: 'title' | 'instruction', value: string) => {
    setFormData((prev: any) => {
      const steps = [...(prev.howToUse || [])];
      steps[index] = { ...steps[index], [field]: value };
      return { ...prev, howToUse: steps };
    });
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    setFormData((prev: any) => {
      const steps = [...(prev.howToUse || [])];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= steps.length) return prev;
      const temp = steps[index];
      steps[index] = steps[targetIndex];
      steps[targetIndex] = temp;
      const reindexed = steps.map((s: any, idx: number) => ({ ...s, step: idx + 1 }));
      return { ...prev, howToUse: reindexed };
    });
  };

  const removeStep = (index: number) => {
    setFormData((prev: any) => {
      const steps = (prev.howToUse || []).filter((_: any, i: number) => i !== index);
      const reindexed = steps.map((s: any, idx: number) => ({ ...s, step: idx + 1 }));
      return { ...prev, howToUse: reindexed };
    });
  };

  // Product Details Key-Value
  const updateDetailValue = (key: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      productDetails: { ...prev.productDetails, [key]: value },
    }));
  };

  const removeDetail = (key: string) => {
    setFormData((prev: any) => {
      const details = { ...prev.productDetails };
      delete details[key];
      return { ...prev, productDetails: details };
    });
  };

  const addCustomDetail = () => {
    if (!newDetailKey.trim()) return;
    setFormData((prev: any) => ({
      ...prev,
      productDetails: {
        ...prev.productDetails,
        [newDetailKey.trim()]: newDetailVal.trim(),
      },
    }));
    setNewDetailKey('');
    setNewDetailVal('');
  };

  // Benefits
  const addBenefit = () => {
    if (!newBenefitInput.trim()) return;
    setFormData((prev: any) => ({
      ...prev,
      benefits: [...(prev.benefits || []), newBenefitInput.trim()],
    }));
    setNewBenefitInput('');
  };

  const removeBenefit = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      benefits: (prev.benefits || []).filter((_: any, i: number) => i !== index),
    }));
  };

  // Ingredients Actives
  const addKeyActive = () => {
    setFormData((prev: any) => ({
      ...prev,
      ingredients: {
        ...prev.ingredients,
        keyActives: [
          ...(prev.ingredients?.keyActives || []),
          { name: 'Active Botanical Extract', role: 'Nutrient infusion and barrier enhancement' },
        ],
      },
    }));
  };

  const updateKeyActive = (index: number, field: 'name' | 'role', val: string) => {
    setFormData((prev: any) => {
      const actives = [...(prev.ingredients?.keyActives || [])];
      actives[index] = { ...actives[index], [field]: val };
      return {
        ...prev,
        ingredients: { ...prev.ingredients, keyActives: actives },
      };
    });
  };

  const removeKeyActive = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      ingredients: {
        ...prev.ingredients,
        keyActives: (prev.ingredients?.keyActives || []).filter((_: any, i: number) => i !== index),
      },
    }));
  };

  // FAQs
  const addFaq = () => {
    setFormData((prev: any) => ({
      ...prev,
      faqs: [
        ...(prev.faqs || []),
        { question: 'What are the primary benefits?', answer: 'Delivers salon-grade restorative smoothness and shine.' },
      ],
    }));
  };

  const updateFaq = (index: number, field: 'question' | 'answer', val: string) => {
    setFormData((prev: any) => {
      const faqs = [...(prev.faqs || [])];
      faqs[index] = { ...faqs[index], [field]: val };
      return { ...prev, faqs };
    });
  };

  const removeFaq = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      faqs: (prev.faqs || []).filter((_: any, i: number) => i !== index),
    }));
  };

  // Numeric Input Handlers (Strips leading zeros and clears on focus)
  const handleNumericChange = (field: 'price' | 'mrp' | 'stock', raw: string) => {
    if (raw === '') {
      setFormData((prev: any) => ({ ...prev, [field]: '' }));
      return;
    }
    const clean = raw.replace(/^0+(?=\d)/, '');
    const num = Number(clean);
    setFormData((prev: any) => ({
      ...prev,
      [field]: isNaN(num) ? '' : (clean === '' ? '' : num),
    }));
  };

  const handleNumericFocus = (field: 'price' | 'mrp' | 'stock', e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === '0' || formData[field] === 0 || formData[field] === '0') {
      setFormData((prev: any) => ({ ...prev, [field]: '' }));
    } else {
      e.target.select();
    }
  };

  // Submit Handler: Saves to MongoDB Atlas
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a formulation name');
      return;
    }
    const numericPrice = Number(formData.price) || 0;
    if (numericPrice <= 0) {
      alert('Please enter a valid selling price');
      return;
    }

    setSubmitting(true);
    try {
      const price = numericPrice;
      const mrp = Number(formData.mrp) > 0 ? Number(formData.mrp) : price;
      const discountPercentage = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

      const payload = {
        ...formData,
        productType,
        category: productType === 'combo' ? (formData.category || 'Combos') : formData.category,
        curatedCollection: formData.curatedCollection || 'Bestsellers',
        price,
        mrp,
        discountPercentage,
        stock: Number(formData.stock) || 0,
        inStock: formData.inStock !== false,
        comboItems: productType === 'combo' ? (formData.comboItems || []) : [],
        usageAdvice: formData.usageAdvice || '',
        variants: [
          {
            size: formData.netVolume || 'Standard Size',
            price,
            mrp,
            inStock: formData.inStock !== false,
          },
        ],
        images:
          formData.images && formData.images.length > 0
            ? formData.images
            : ['https://res.cloudinary.com/dqddawu42/image/upload/v1792492874/sensein/products/media_1792492512087.jpg'],
      };

      let saved;
      const targetId = initialProduct?.id || initialProduct?._id;
      if (targetId) {
        saved = await updateProductApi(targetId, payload);
      } else {
        saved = await createProductApi(payload);
      }

      onSaved(saved || payload);
      onClose();
    } catch (err: any) {
      console.error('Error saving formulation:', err);
      alert(`Could not save to MongoDB Atlas: ${err.message || 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const priceNum = Number(formData.price) || 0;
  const mrpNum = Number(formData.mrp) || 0;
  const calculatedDiscount =
    mrpNum > priceNum && priceNum > 0
      ? Math.round(((mrpNum - priceNum) / mrpNum) * 100)
      : 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-border rounded-2xl max-w-5xl sm:max-w-6xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-border bg-[#FCFBF9] flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-plum animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-plum">
                SENSEIN Master Formulation Studio
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">
              {initialProduct ? 'Edit Formulation Specification' : 'Add New Luxury Formulation'}
            </h3>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => loadCategoryTemplate('Shampoo')}
              className="px-2.5 py-1 text-[11px] font-semibold bg-white hover:bg-plum/5 text-plum border border-plum/30 rounded shadow-2xs transition-all flex items-center gap-1"
              title="Pre-fill with full Argan + Keratin Shampoo formulation structure"
            >
              <Sparkles className="w-3 h-3 text-gold" />
              <span>Shampoo</span>
            </button>
            <button
              type="button"
              onClick={() => loadCategoryTemplate('Hair Styling Wax')}
              className="px-2.5 py-1 text-[11px] font-semibold bg-white hover:bg-charcoal/5 text-charcoal border border-border rounded shadow-2xs transition-all flex items-center gap-1"
              title="Pre-fill with Hair Wax styling structure"
            >
              <Award className="w-3 h-3 text-plum" />
              <span>Hair Wax</span>
            </button>
            <button
              type="button"
              onClick={() => loadCategoryTemplate('Hair Mask')}
              className="px-2.5 py-1 text-[11px] font-semibold bg-white hover:bg-plum/5 text-plum border border-plum/30 rounded shadow-2xs transition-all flex items-center gap-1"
              title="Pre-fill with full Argan + Keratin Smoothing Hair Mask structure"
            >
              <Sparkles className="w-3 h-3 text-gold" />
              <span>Hair Mask</span>
            </button>
            <button
              type="button"
              onClick={() => loadCategoryTemplate('Hair & Body Oil')}
              className="px-2.5 py-1 text-[11px] font-semibold bg-white hover:bg-plum/5 text-plum border border-plum/30 rounded shadow-2xs transition-all flex items-center gap-1"
              title="Pre-fill with full Argan Oil for Hair & Body structure"
            >
              <Sparkles className="w-3 h-3 text-gold" />
              <span>Hair & Body Oil</span>
            </button>
            <button
              type="button"
              onClick={() => loadCategoryTemplate('Facewash')}
              className="px-2.5 py-1 text-[11px] font-semibold bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded shadow-2xs transition-all flex items-center gap-1"
              title="Pre-fill with Charcoal + Clay Facewash structure"
            >
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Facewash</span>
            </button>
            <button
              type="button"
              onClick={() => loadCategoryTemplate('Combos')}
              className="px-2.5 py-1 text-[11px] font-semibold bg-plum hover:bg-plum-hover text-white rounded shadow-2xs transition-all flex items-center gap-1"
              title="Pre-fill with 3-in-1 Grooming Combo Pack structure"
            >
              <Gift className="w-3 h-3 text-gold" />
              <span>3-in-1 Combo Pack</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-charcoal-muted hover:text-charcoal hover:bg-neutral-100 rounded-lg transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TOP LEVEL PRODUCT ARCHITECTURE SWITCHER (SINGLE vs COMBO) */}
        <div className="bg-[#FAF7F5] border-b border-border px-6 py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 flex-shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-plum block">
              1. Product Architecture Mode
            </span>
            <p className="text-xs text-charcoal font-medium">
              Choose whether this listing is an <strong>Individual Formulation</strong> or a{' '}
              <strong>Bundled Combo Pack</strong>:
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleFormatSwitch('single')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                productType === 'single'
                  ? 'bg-plum text-white shadow-sm ring-2 ring-plum/20'
                  : 'bg-white text-charcoal border border-border hover:bg-neutral-50'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Single Product</span>
            </button>
            <button
              type="button"
              onClick={() => handleFormatSwitch('combo')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                productType === 'combo'
                  ? 'bg-plum text-white shadow-sm ring-2 ring-plum/20'
                  : 'bg-white text-charcoal border border-border hover:bg-neutral-50'
              }`}
            >
              <Gift className="w-3.5 h-3.5 text-gold" />
              <span>Combo / Value Pack</span>
            </button>
          </div>
        </div>

        {/* TABS NAVIGATION (Matching the 6 Information & Rituals Sections) */}
        <div className="border-b border-border bg-[#FBF9F6] px-3 sm:px-6 py-2 flex-shrink-0">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-2 w-full">
            {[
              { id: 'general', label: '1. Format & Pricing', icon: DollarSign },
              { id: 'images', label: `2. Media (${formData.images?.length || 0})`, icon: ImageIcon },
              { id: 'routine', label: `3. How To Use (${formData.howToUse?.length || 0})`, icon: Layers },
              { id: 'details', label: '4. Details & Benefits', icon: FileText },
              { id: 'ingredients', label: '5. Ingredients', icon: Sparkles },
              { id: 'faqs', label: `6. FAQs & Safety (${formData.faqs?.length || 0})`, icon: HelpCircle },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as TabKey)}
                  className={`py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg border text-[11px] sm:text-xs font-semibold uppercase tracking-tight flex items-center justify-center gap-1.5 transition-all text-center ${
                    isActive
                      ? 'border-plum/40 bg-white text-plum font-bold shadow-xs ring-1 ring-plum/20'
                      : 'border-transparent text-charcoal-muted hover:text-charcoal hover:bg-white/80'
                  }`}
                  title={tab.label}
                >
                  <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-plum' : 'text-charcoal-muted'}`} />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SCROLLABLE FORM BODY */}
        <form id="luxury-product-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* TAB 1: GENERAL & PRICING */}
          {activeTab === 'general' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Product Architecture Context Banner */}
              <div
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                  productType === 'combo'
                    ? 'bg-purple-50/70 border-purple-200 text-purple-900'
                    : 'bg-blue-50/70 border-blue-200 text-blue-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {productType === 'combo' ? (
                    <Gift className="w-5 h-5 text-plum flex-shrink-0" />
                  ) : (
                    <Package className="w-5 h-5 text-blue-700 flex-shrink-0" />
                  )}
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider block">
                      Active Mode: {productType === 'combo' ? 'Combo / Value Pack Listing' : 'Single Product Formulation'}
                    </span>
                    <span className="text-[11px] opacity-80">
                      {productType === 'combo'
                        ? 'Configured for multi-product routines with bundled items, combined volume, and value badges.'
                        : 'Configured for single clinical product with tailored category specifications and rituals.'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleFormatSwitch(productType === 'combo' ? 'single' : 'combo')}
                  className="px-3 py-1 bg-white border border-current rounded text-[11px] font-bold uppercase tracking-wider hover:bg-neutral-50 transition"
                >
                  Switch to {productType === 'combo' ? 'Single' : 'Combo'}
                </button>
              </div>

              {/* Formulation Name & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                    {productType === 'combo' ? 'Combo Pack Name *' : 'Formulation Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder={
                      productType === 'combo'
                        ? 'e.g. Hair & Face Care Combo Pack – 3 × 50 ml'
                        : 'e.g. Argan + Keratin Smoothing Shampoo'
                    }
                    className="w-full px-3.5 py-2.5 bg-white border border-border focus:border-plum rounded-lg text-sm text-charcoal placeholder-charcoal-muted focus:outline-none focus:ring-1 focus:ring-plum font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                    URL Slug (Identifier)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. hair-face-care-combo-pack"
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-border focus:border-plum rounded-lg text-sm text-charcoal font-mono focus:outline-none focus:ring-1 focus:ring-plum"
                  />
                  <p className="text-[10px] text-charcoal-muted mt-1">Live URL: /product/{formData.slug || 'slug'}</p>
                </div>
              </div>

              {/* Category & Collection & Net Volume */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                    Product Category *
                  </label>
                  {productType === 'combo' ? (
                    <input
                      type="text"
                      value={formData.category || 'Combos'}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-border focus:border-plum rounded-lg text-xs text-charcoal font-bold focus:outline-none"
                      placeholder="Combos, Grooming Kits, Routine Sets"
                    />
                  ) : (
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        const cat = e.target.value;
                        setFormData((prev: any) => ({ ...prev, category: cat }));
                      }}
                      className="w-full px-3.5 py-2.5 bg-white border border-border focus:border-plum rounded-lg text-xs text-charcoal font-bold focus:outline-none"
                    >
                      <option value="Shampoo">Shampoo (Cleanser)</option>
                      <option value="Hair Styling Wax">Hair Styling Wax</option>
                      <option value="Hair Mask">Hair Mask (Restorative)</option>
                      <option value="Hair & Body Oil">Hair & Body Oil</option>
                      <option value="Facewash">Facewash (Skincare)</option>
                      <option value="Hair Serum">Hair Serum / Treatment</option>
                      <option value="Conditioner">Conditioner</option>
                    </select>
                  )}
                  {/* Category Template Prompt */}
                  {CATEGORY_TEMPLATES[formData.category] && (
                    <button
                      type="button"
                      onClick={() => loadCategoryTemplate(formData.category)}
                      className="mt-1 text-[11px] text-plum hover:text-plum-hover font-semibold flex items-center gap-1 underline"
                    >
                      <Sparkles className="w-3 h-3 text-gold" />
                      Load recommended {formData.category} rituals template
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                    Curated Collection (Home Page)
                  </label>
                  <select
                    value={formData.curatedCollection}
                    onChange={(e) => setFormData({ ...formData, curatedCollection: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-border focus:border-plum rounded-lg text-xs text-charcoal font-medium focus:outline-none"
                  >
                    <option value="Bestsellers">Bestsellers (Featured on Home Page)</option>
                    <option value="Professional Salon Series">Professional Salon Series</option>
                    <option value="Restorative Care">Restorative Care</option>
                    <option value="Scalp Rituals">Scalp Rituals</option>
                    <option value="Daily Luxury">Daily Luxury</option>
                  </select>
                  <p className="text-[10px] text-charcoal-muted mt-1">
                    ✓ "Bestsellers" will automatically display on the Home Page carousel!
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                    {productType === 'combo' ? 'Total Combined Net Quantity' : 'Net Volume / Pack Size'}
                  </label>
                  <input
                    type="text"
                    value={formData.netVolume}
                    onChange={(e) => setFormData({ ...formData, netVolume: e.target.value })}
                    placeholder={productType === 'combo' ? 'e.g. 150 ml (3 × 50 ml)' : 'e.g. 1 L or 100g'}
                    className="w-full px-3.5 py-2.5 bg-white border border-border focus:border-plum rounded-lg text-xs text-charcoal font-medium focus:outline-none"
                  />
                </div>
              </div>

              {/* COMBO SPECIFIC BUILDER (If Combo Product) */}
              {productType === 'combo' && (
                <div className="p-4 sm:p-5 bg-purple-50/50 border border-purple-200/80 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-plum block flex items-center gap-1.5">
                        <Gift className="w-4 h-4 text-plum" />
                        Combo Pack Included Formulations Manager
                      </span>
                      <p className="text-[11px] text-charcoal-muted">
                        Add the individual products bundled inside this kit (displayed in the "What's Included" block).
                      </p>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-0.5 bg-plum text-white rounded-full">
                      {(formData.comboItems || []).length} Products in Pack
                    </span>
                  </div>

                  {/* Existing Bundled Items */}
                  <div className="space-y-2.5">
                    {(formData.comboItems || []).map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 bg-white border border-border rounded-lg flex items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5 flex-1">
                          <span className="w-6 h-6 rounded-full bg-plum/10 text-plum text-xs font-bold flex items-center justify-center flex-shrink-0">
                            {idx + 1}
                          </span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-charcoal">{item.name}</span>
                              {item.quantity && (
                                <span className="text-[10px] bg-[#FAF7F5] border border-border px-1.5 py-0.5 rounded text-charcoal-muted font-mono font-semibold">
                                  {item.quantity}
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-[11px] text-charcoal-muted mt-0.5 font-light">{item.description}</p>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeComboItem(idx)}
                          className="p-1 text-charcoal-muted hover:text-red-500 rounded transition"
                          title="Remove item from combo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add New Bundled Item Input Row */}
                  <div className="p-3 bg-white border border-dashed border-plum/40 rounded-lg space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal block">
                      + Add Bundled Formulation To Pack:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={newComboItemName}
                        onChange={(e) => setNewComboItemName(e.target.value)}
                        placeholder="Product Name (e.g. Smoothing Shampoo)"
                        className="px-3 py-1.5 bg-[#FAF7F5] border border-border rounded text-xs text-charcoal focus:outline-none focus:border-plum"
                      />
                      <input
                        type="text"
                        value={newComboItemQty}
                        onChange={(e) => setNewComboItemQty(e.target.value)}
                        placeholder="Volume / Size (e.g. 50 ml)"
                        className="px-3 py-1.5 bg-[#FAF7F5] border border-border rounded text-xs text-charcoal focus:outline-none focus:border-plum"
                      />
                      <input
                        type="text"
                        value={newComboItemDesc}
                        onChange={(e) => setNewComboItemDesc(e.target.value)}
                        placeholder="Action / Role (e.g. Cleanses & repairs)"
                        className="px-3 py-1.5 bg-[#FAF7F5] border border-border rounded text-xs text-charcoal focus:outline-none focus:border-plum"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addComboItem}
                      className="px-4 py-1.5 bg-plum hover:bg-plum-hover text-white text-xs font-bold uppercase tracking-wider rounded transition flex items-center gap-1.5 shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5 text-gold" />
                      <span>Add To Combo Pack</span>
                    </button>
                  </div>
                </div>
              )}

              {/* PRICING & STOCK */}
              <div className="p-4 bg-[#FAF7F5] border border-border rounded-xl space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-plum block">
                  Retail Pricing & Inventory Thresholds
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">
                      Selling Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      placeholder="0"
                      value={formData.price ?? ''}
                      onFocus={(e) => handleNumericFocus('price', e)}
                      onChange={(e) => handleNumericChange('price', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-border focus:border-plum rounded-lg text-sm font-bold text-charcoal focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">
                      Original MRP (₹)
                    </label>
                    <input
                      type="number"
                      min={0}
                      placeholder="0"
                      value={formData.mrp ?? ''}
                      onFocus={(e) => handleNumericFocus('mrp', e)}
                      onChange={(e) => handleNumericChange('mrp', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-border focus:border-plum rounded-lg text-sm font-bold text-charcoal-muted focus:outline-none"
                    />
                    {calculatedDiscount > 0 && (
                      <span className="text-[10px] text-emerald font-bold mt-0.5 block">
                        Save {calculatedDiscount}% OFF
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">
                      Stock Level (Units)
                    </label>
                    <input
                      type="number"
                      min={0}
                      placeholder="0"
                      value={formData.stock ?? ''}
                      onFocus={(e) => handleNumericFocus('stock', e)}
                      onChange={(e) => handleNumericChange('stock', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-border focus:border-plum rounded-lg text-sm font-bold text-charcoal focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col justify-end">
                    <label className="flex items-center gap-2 cursor-pointer p-2 bg-white border border-border rounded-lg">
                      <input
                        type="checkbox"
                        checked={formData.inStock}
                        onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                        className="w-4 h-4 text-plum rounded focus:ring-plum"
                      />
                      <span className="text-xs font-bold text-charcoal">Available In Stock</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* BADGES */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Trust Badges & Highlights
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={badgeInput}
                    onChange={(e) => setBadgeInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addBadge())}
                    placeholder="Type badge and press Enter (e.g. Value Combo, Salon Grade, Sulphate-Free)"
                    className="flex-1 px-3 py-2 bg-white border border-border focus:border-plum rounded-lg text-xs text-charcoal focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addBadge}
                    className="px-3.5 py-2 bg-plum hover:bg-plum-hover text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Add Badge
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(formData.badges || []).map((b: string) => (
                    <span
                      key={b}
                      className="px-2.5 py-1 bg-white border border-border rounded-full text-[11px] font-semibold text-charcoal flex items-center gap-1.5 shadow-2xs"
                    >
                      <Tag className="w-2.5 h-2.5 text-plum" />
                      <span>{b}</span>
                      <button
                        type="button"
                        onClick={() => removeBadge(b)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* SUBTITLE & DESCRIPTIONS */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Formulation Subtitle (Punchline)
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. Complete Grooming Routine • Shampoo + Leave-In Cream + Facewash"
                  className="w-full px-3.5 py-2.5 bg-white border border-border focus:border-plum rounded-lg text-xs text-charcoal font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Full Luxury Description
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comprehensive description of the biological action, ingredients, sensory profile, and benefits..."
                  className="w-full px-3.5 py-2.5 bg-white border border-border focus:border-plum rounded-lg text-xs text-charcoal leading-relaxed focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: CLOUDINARY MEDIA */}
          {activeTab === 'images' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* CLOUDINARY DIRECT UPLOADER */}
              <div className="p-6 border-2 border-dashed border-plum/30 hover:border-plum bg-[#FAF7F5] rounded-xl text-center space-y-3 transition-colors relative">
                <div className="w-12 h-12 rounded-full bg-plum/10 text-plum flex items-center justify-center mx-auto">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-charcoal">Upload Images to Cloudinary CDN</h4>
                  <p className="text-xs text-charcoal-muted mt-0.5">
                    Images are automatically optimized and securely hosted on Cloudinary in folder{' '}
                    <code className="text-plum font-mono">sensein/products</code>
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <label className="px-4 py-2 bg-plum hover:bg-plum-hover text-white text-xs font-bold uppercase tracking-wider rounded-lg cursor-pointer transition-all shadow-xs inline-flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-gold" />
                    <span>Choose Local Files</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>

                {uploadingImage && (
                  <div className="p-3 bg-white border border-border rounded-lg inline-flex items-center gap-2 shadow-sm animate-pulse">
                    <Loader2 className="w-4 h-4 text-plum animate-spin" />
                    <span className="text-xs font-semibold text-plum">{uploadProgressText}</span>
                  </div>
                )}
              </div>

              {/* REMOTE URL UPLOADER */}
              <div className="p-4 bg-white border border-border rounded-xl space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-charcoal block">
                  Or Upload From Remote Image URL
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="flex-1 px-3 py-2 bg-white border border-border focus:border-plum rounded-lg text-xs text-charcoal font-mono focus:outline-none"
                  />
                  <button
                    type="button"
                    disabled={uploadingImage || !imageUrlInput.trim()}
                    onClick={handleAddImageUrl}
                    className="px-4 py-2 bg-charcoal hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors disabled:opacity-50"
                  >
                    Upload URL
                  </button>
                </div>
              </div>

              {/* MEDIA GALLERY RE-ORDER & PREVIEW */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal">
                    Formulation Gallery ({formData.images?.length || 0} Assets)
                  </h4>
                  <p className="text-[11px] text-charcoal-muted">
                    First image is the <strong>Primary Product Cover</strong>. Drag or use arrows to re-order.
                  </p>
                </div>

                {formData.images?.length === 0 ? (
                  <div className="p-8 text-center bg-white border border-border rounded-xl text-charcoal-muted text-xs">
                    No images uploaded yet. Please upload at least 1 image to Cloudinary.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {formData.images.map((imgUrl: string, idx: number) => (
                      <div
                        key={idx}
                        className={`group relative bg-white border rounded-xl overflow-hidden shadow-2xs flex flex-col transition-all ${
                          idx === 0 ? 'border-plum ring-2 ring-plum/20' : 'border-border'
                        }`}
                      >
                        <div className="aspect-square w-full bg-[#FAF7F5] p-2 flex items-center justify-center relative">
                          <img
                            src={imgUrl}
                            alt={`Product image ${idx + 1}`}
                            className="w-full h-full object-contain"
                          />
                          {idx === 0 && (
                            <span className="absolute top-1 left-1 bg-plum text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wider">
                              Cover Image
                            </span>
                          )}
                        </div>

                        <div className="p-2 bg-white border-t border-border flex items-center justify-between gap-1 text-charcoal-muted">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => moveImage(idx, 'up')}
                              className="p-1 hover:text-plum disabled:opacity-30 rounded"
                              title="Move Left"
                            >
                              <ArrowUp className="w-3.5 h-3.5 rotate-[-90deg]" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === formData.images.length - 1}
                              onClick={() => moveImage(idx, 'down')}
                              className="p-1 hover:text-plum disabled:opacity-30 rounded"
                              title="Move Right"
                            >
                              <ArrowDown className="w-3.5 h-3.5 rotate-[-90deg]" />
                            </button>
                          </div>

                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => setAsCoverImage(idx)}
                              className="text-[10px] text-plum font-semibold hover:underline"
                            >
                              Make Cover
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="p-1 hover:text-red-500 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: 1. HOW TO USE (Product Information & Rituals Accordion 1) */}
          {activeTab === 'routine' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal">
                    1. How To Use — Step-by-Step Grooming Ritual
                  </h4>
                  <p className="text-xs text-charcoal-muted">
                    Rendered in the "How To Use" accordion section with step badges and instructions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addStep}
                  className="px-3 py-1.5 bg-plum hover:bg-plum-hover text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5 text-gold" />
                  <span>Add Routine Step</span>
                </button>
              </div>

              {/* Ritual Application Advice Callout Note */}
              <div className="p-4 bg-[#FAF7F5] border border-border rounded-xl space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal">
                  Application / Ritual Advice Note
                </label>
                <p className="text-[11px] text-charcoal-muted">
                  Displays in the highlighted information box directly beneath the routine steps.
                </p>
                <textarea
                  rows={2}
                  value={formData.usageAdvice || ''}
                  onChange={(e) => setFormData({ ...formData, usageAdvice: e.target.value })}
                  placeholder="e.g. Warm thoroughly between fingertips for seamless spreadability. Suitable for daily restyling without washing out between touch-ups."
                  className="w-full px-3 py-2 bg-white border border-border focus:border-plum rounded-lg text-xs text-charcoal leading-relaxed focus:outline-none"
                />
              </div>

              {/* Routine Step Cards */}
              <div className="space-y-3">
                {(formData.howToUse || []).map((stepItem: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 bg-white border border-border rounded-xl space-y-2.5 shadow-2xs relative"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="w-6 h-6 rounded-full bg-plum text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={stepItem.title}
                          onChange={(e) => updateStep(idx, 'title', e.target.value)}
                          placeholder="Step Title (e.g. Wet Thoroughly)"
                          className="font-bold text-xs text-charcoal border-b border-dashed border-border focus:border-plum px-1 py-0.5 focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveStep(idx, 'up')}
                          className="p-1 text-charcoal-muted hover:text-plum disabled:opacity-30 rounded"
                          title="Move Step Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === (formData.howToUse || []).length - 1}
                          onClick={() => moveStep(idx, 'down')}
                          className="p-1 text-charcoal-muted hover:text-plum disabled:opacity-30 rounded"
                          title="Move Step Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeStep(idx)}
                          className="p-1 text-charcoal-muted hover:text-red-500 rounded ml-1"
                          title="Delete Step"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <textarea
                      rows={2}
                      value={stepItem.instruction}
                      onChange={(e) => updateStep(idx, 'instruction', e.target.value)}
                      placeholder="Detailed instructions for this step..."
                      className="w-full px-3 py-2 bg-[#FAF7F5] border border-border focus:border-plum rounded-lg text-xs text-charcoal leading-relaxed focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: 2. PRODUCT DETAILS & 3. BENEFITS (Product Information & Rituals Accordions 2 & 3) */}
          {activeTab === 'details' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* PRODUCT DETAILS TABLE */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal">
                      2. Product Details — Packaging Specification Accordion
                    </h4>
                    <p className="text-xs text-charcoal-muted">
                      Official regulatory and manufacturing declaration fields displayed in the "Product Details" accordion.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white border border-border rounded-xl space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(formData.productDetails || {}).map(([key, val]: [string, any]) => (
                      <div key={key} className="p-3 bg-[#FAF7F5] border border-border rounded-lg space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase text-charcoal-muted tracking-wider">
                            {key.replace(/([A-Z])/g, ' $1')}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeDetail(key)}
                            className="text-charcoal-muted hover:text-red-500"
                            title="Remove field"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={val || ''}
                          onChange={(e) => updateDetailValue(key, e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-border focus:border-plum rounded text-xs text-charcoal font-medium focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Add Custom Detail Key */}
                  <div className="pt-3 border-t border-border flex items-center gap-2">
                    <input
                      type="text"
                      value={newDetailKey}
                      onChange={(e) => setNewDetailKey(e.target.value)}
                      placeholder="New Specification Key (e.g. Hold Level, Treatment Time)"
                      className="px-3 py-1.5 bg-white border border-border focus:border-plum rounded text-xs text-charcoal focus:outline-none w-1/3"
                    />
                    <input
                      type="text"
                      value={newDetailVal}
                      onChange={(e) => setNewDetailVal(e.target.value)}
                      placeholder="Specification Value"
                      className="px-3 py-1.5 bg-white border border-border focus:border-plum rounded text-xs text-charcoal focus:outline-none flex-1"
                    />
                    <button
                      type="button"
                      onClick={addCustomDetail}
                      className="px-3 py-1.5 bg-plum hover:bg-plum-hover text-white text-xs font-semibold rounded transition-colors"
                    >
                      Add Spec
                    </button>
                  </div>
                </div>
              </div>

              {/* BENEFITS LIST */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal">
                      3. Benefits — Efficacy & Results Accordion
                    </h4>
                    <p className="text-xs text-charcoal-muted">
                      High-impact bullet points rendered with check icons in the "Benefits" accordion.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newBenefitInput}
                    onChange={(e) => setNewBenefitInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                    placeholder="e.g. Enriched with Argan Oil and Hydrolyzed Keratin to smooth and soften hair"
                    className="flex-1 px-3 py-2 bg-white border border-border focus:border-plum rounded-lg text-xs text-charcoal focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addBenefit}
                    className="px-4 py-2 bg-plum hover:bg-plum-hover text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Add Benefit
                  </button>
                </div>

                <div className="space-y-2">
                  {(formData.benefits || []).map((ben: string, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 bg-white border border-border rounded-lg flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-plum stroke-[2.5] flex-shrink-0" />
                        <span className="text-xs text-charcoal font-medium">{ben}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeBenefit(idx)}
                        className="text-charcoal-muted hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: 4. INGREDIENTS (Product Information & Rituals Accordion 4) */}
          {activeTab === 'ingredients' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* KEY ACTIVES BREAKDOWN */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal">
                      4. Ingredients — Key Bio-Actives Highlights
                    </h4>
                    <p className="text-xs text-charcoal-muted">
                      Featured active botanical ingredients highlighted in individual cards in the "Ingredients" accordion.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addKeyActive}
                    className="px-3 py-1.5 bg-plum hover:bg-plum-hover text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-gold" />
                    <span>Add Key Active</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(formData.ingredients?.keyActives || []).map((active: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-white border border-border rounded-xl space-y-2 shadow-2xs relative"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 flex-1">
                          <Sparkles className="w-3.5 h-3.5 text-plum flex-shrink-0" />
                          <input
                            type="text"
                            value={active.name}
                            onChange={(e) => updateKeyActive(idx, 'name', e.target.value)}
                            placeholder="Ingredient Name (e.g. Argan Oil)"
                            className="font-bold text-xs text-charcoal border-b border-dashed border-border focus:border-plum px-1 py-0.5 focus:outline-none w-full"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeKeyActive(idx)}
                          className="p-1 text-charcoal-muted hover:text-red-500 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={active.role}
                        onChange={(e) => updateKeyActive(idx, 'role', e.target.value)}
                        placeholder="Biological Role / Benefit (e.g. Deep hydration and luminous shine)"
                        className="w-full px-2.5 py-1.5 bg-[#FAF7F5] border border-border focus:border-plum rounded text-[11px] text-charcoal-muted focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* FULL PACKAGING DECLARATION */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal">
                  Full Packaging INCI Ingredients Declaration
                </label>
                <p className="text-[11px] text-charcoal-muted">
                  The complete formulation list as stated on the legal packaging (Aqua, Keratin, Oils, etc.).
                </p>
                <textarea
                  rows={5}
                  value={formData.ingredients?.fullList || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ingredients: { ...formData.ingredients, fullList: e.target.value },
                    })
                  }
                  placeholder="Aqua, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Argania Spinosa Kernel Oil, Hydrolyzed Keratin..."
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-border focus:border-plum rounded-lg text-xs font-mono text-charcoal leading-relaxed focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 6: 5. FAQS & 6. ADDITIONAL INFORMATION (Product Information & Rituals Accordions 5 & 6) */}
          {activeTab === 'faqs' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* FAQS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal">
                      5. FAQs — Frequently Asked Questions Accordion
                    </h4>
                    <p className="text-xs text-charcoal-muted">
                      Answers to common patron questions regarding treatment safety, usage, and results.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addFaq}
                    className="px-3 py-1.5 bg-plum hover:bg-plum-hover text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-gold" />
                    <span>Add FAQ</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.faqs && formData.faqs.length > 0 ? (
                    formData.faqs.map((faq: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-5 bg-white border border-border rounded-xl space-y-3.5 shadow-xs"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 flex-1">
                            <span className="w-6 h-6 rounded-full bg-plum/10 text-plum text-xs font-bold flex items-center justify-center flex-shrink-0">
                              {idx + 1}
                            </span>
                            <div className="flex-1">
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-muted mb-1">
                                Question {idx + 1}
                              </label>
                              <input
                                type="text"
                                value={faq.question}
                                onChange={(e) => updateFaq(idx, 'question', e.target.value)}
                                placeholder="e.g. Is this formulation safe for colored or chemically treated hair?"
                                className="font-semibold text-xs sm:text-sm text-charcoal bg-[#FAF7F5] border border-border focus:border-plum px-3 py-2 rounded-lg focus:outline-none w-full"
                              />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFaq(idx)}
                            className="p-2 text-charcoal-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-4"
                            title="Delete FAQ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-muted mb-1">
                            Patron Answer
                          </label>
                          <textarea
                            rows={3}
                            value={faq.answer}
                            onChange={(e) => updateFaq(idx, 'answer', e.target.value)}
                            placeholder="Provide a clear, reassuring patron response explaining efficacy, usage, and safety..."
                            className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-border focus:border-plum rounded-lg text-xs sm:text-sm text-charcoal leading-relaxed focus:outline-none"
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center bg-[#FAF7F5] border border-dashed border-border rounded-xl space-y-3">
                      <HelpCircle className="w-8 h-8 text-plum/60 mx-auto" />
                      <p className="text-xs text-charcoal font-medium">
                        No FAQs added yet for this formulation.
                      </p>
                      <button
                        type="button"
                        onClick={addFaq}
                        className="px-4 py-2 bg-plum text-white text-xs font-bold rounded-lg hover:bg-plum-hover transition shadow-xs"
                      >
                        + Add First FAQ
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* ADDITIONAL INFO & CAUTION */}
              <div className="p-4 bg-white border border-border rounded-xl space-y-3">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal">
                    6. Additional Information — Storage, Safety & Suitability Accordion
                  </h4>
                  <p className="text-xs text-charcoal-muted">
                    Rendered in the final "Additional Information" accordion on the product page.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-charcoal-muted mb-1">
                      Shelf Life
                    </label>
                    <input
                      type="text"
                      value={formData.additionalInfo?.shelfLife || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          additionalInfo: { ...formData.additionalInfo, shelfLife: e.target.value },
                        })
                      }
                      placeholder="e.g. 36 Months from Manufacturing Date"
                      className="w-full px-3 py-2 bg-[#FAF7F5] border border-border focus:border-plum rounded text-xs text-charcoal focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-charcoal-muted mb-1">
                      Storage Instructions
                    </label>
                    <input
                      type="text"
                      value={formData.additionalInfo?.storage || formData.additionalInfo?.storageInstructions || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          additionalInfo: { ...formData.additionalInfo, storage: e.target.value },
                        })
                      }
                      placeholder="e.g. Store in a cool, dry place away from direct sunlight."
                      className="w-full px-3 py-2 bg-[#FAF7F5] border border-border focus:border-plum rounded text-xs text-charcoal focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-charcoal-muted mb-1">
                      Suitability (Hair & Skin Types)
                    </label>
                    <input
                      type="text"
                      value={formData.additionalInfo?.hairType || formData.additionalInfo?.suitableFor || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          additionalInfo: { ...formData.additionalInfo, hairType: e.target.value },
                        })
                      }
                      placeholder="e.g. Suitable for all hair textures; ideal for frizzy, dry hair."
                      className="w-full px-3 py-2 bg-[#FAF7F5] border border-border focus:border-plum rounded text-xs text-charcoal focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-charcoal-muted mb-1">
                      Safety Caution Note
                    </label>
                    <input
                      type="text"
                      value={formData.additionalInfo?.caution || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          additionalInfo: { ...formData.additionalInfo, caution: e.target.value },
                        })
                      }
                      placeholder="e.g. For external use only. Avoid contact with eyes."
                      className="w-full px-3 py-2 bg-[#FAF7F5] border border-border focus:border-plum rounded text-xs text-charcoal focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* FOOTER ACTIONS */}
        <div className="px-6 py-4 border-t border-border bg-[#FCFBF9] flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs text-charcoal font-semibold">
              {productType === 'combo' ? '🎁 Value Combo Pack' : '🧴 Single Formulation'}
            </span>
            <span className="text-xs text-charcoal-muted">•</span>
            <span className="text-xs font-bold text-plum">
              ₹{formData.price || 0}
            </span>
            {calculatedDiscount > 0 && (
              <span className="text-[11px] text-emerald font-bold">
                (-{calculatedDiscount}% OFF)
              </span>
            )}
            <span className="text-xs text-charcoal-muted">•</span>
            <span className="text-xs text-charcoal-muted">
              {formData.images?.length || 0} Images
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 border border-border text-charcoal text-xs font-semibold rounded-lg hover:bg-neutral-100 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="luxury-product-form"
              disabled={submitting}
              className="px-6 py-2.5 bg-plum hover:bg-plum-hover text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-md flex items-center gap-2 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 text-gold animate-spin" />
                  <span>Saving to MongoDB Atlas...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-gold" />
                  <span>
                    {initialProduct ? 'Update Formulation' : 'Publish & Save Formulation'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
