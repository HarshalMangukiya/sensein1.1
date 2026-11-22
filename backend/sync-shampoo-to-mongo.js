const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('./node_modules/mongoose');

const shampooProduct = {
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
    'https://res.cloudinary.com/dqddawu42/image/upload/v1792492630/sensein/products/sensein-shampoo-1.jpg',
    'https://res.cloudinary.com/dqddawu42/image/upload/v1792492630/sensein/products/sensein-shampoo-5.jpg',
    'https://res.cloudinary.com/dqddawu42/image/upload/v1792492630/sensein/products/sensein-shampoo-4.jpg',
    'https://res.cloudinary.com/dqddawu42/image/upload/v1792492629/sensein/products/sensein-shampoo-2.jpg',
    'https://res.cloudinary.com/dqddawu42/image/upload/v1792492630/sensein/products/sensein-shampoo-3.jpg'
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
      { name: 'Argan Oil', role: 'Deep nourishment and radiant shine' },
      { name: 'Hydrolyzed Keratin', role: 'Restores strength and repairs cuticle' },
      { name: 'D-Panthenol', role: 'Pro-Vitamin B5 for lasting moisture retention' },
      { name: 'Simmondsia Chinensis (Jojoba) Seed Oil', role: 'Scalp balance and smoothness' },
      { name: 'Glycerin', role: 'Locks in essential moisture' },
      { name: 'Dimethicone', role: 'Effortless detangling and frizz control' }
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
};

async function sync() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://senseinindia2024_db_user:6xskchSdqf2vZ0zx@sensein.2f5dure.mongodb.net/sensein?retryWrites=true&w=majority';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB Atlas');

  await mongoose.connection.db.collection('products').updateOne(
    { slug: shampooProduct.slug },
    { $set: shampooProduct },
    { upsert: true }
  );
  console.log('Successfully upserted Argan + Keratin Smoothing Shampoo into MongoDB Atlas!');

  const all = await mongoose.connection.db.collection('products').find().toArray();
  console.log('Current Atlas products:', all.map(p => ({ slug: p.slug, price: p.price, name: p.name })));

  await mongoose.disconnect();
}

sync().catch(console.error);
