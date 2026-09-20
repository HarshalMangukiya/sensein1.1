const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');
const map = require('./cloudinary-images-map.json').products;

const updates = [
  { slug: 'keratin-bond-intense-restorative-hair-mask', images: [map['mask-1.png'], map['mask-2.png']] },
  { slug: 'black-caviar-cellular-cleansing-shampoo', images: [map['shampoo-1.png'], map['shampoo-2.png']] },
  { slug: 'bio-active-french-plum-illuminating-hair-serum', images: [map['serum-1.png'], map['serum-2.png']] },
  { slug: 'peptide-root-density-scalp-awakening-elixir', images: [map['elixir-1.png']] },
  { slug: 'cashmere-velvet-thermal-blowout-styling-cream', images: [map['cream-1.png']] },
  { slug: 'obsidian-matte-flexible-texturizing-pomade', images: [map['wax-1.png']] },
  { slug: 'nuit-de-prune-hair-body-fine-fragrance-mist', images: [map['perfume-1.png']] },
  { slug: 'botanical-amino-gentle-resurfacing-cleanser', images: [map['facewash-1.png']] },
  { slug: 'sensein-payment-verification-test', images: ['https://res.cloudinary.com/dqddawu42/image/upload/v1789818163/sensein/products/bxsjmi3kfmsq7jigqkfv.png'] }
];

async function updateDb() {
  await mongoose.connect('mongodb+srv://savaliyadwarkesh95_db_user:kUfCaHxvmJlsI57x@dwarkeshsem4.m40hhtg.mongodb.net/sensein?retryWrites=true&w=majority');
  console.log('Connected to MongoDB Atlas');

  for (const item of updates) {
    const res = await mongoose.connection.db.collection('products').updateOne(
      { slug: item.slug },
      { $set: { images: item.images } }
    );
    console.log('Updated product:', item.slug, 'Modified count:', res.modifiedCount);
  }

  const allProds = await mongoose.connection.db.collection('products').find().toArray();
  console.log('--- Verification of all products in MongoDB Atlas ---');
  allProds.forEach(p => {
    console.log(p.slug, '->', p.images[0]);
  });

  await mongoose.disconnect();
}

updateDb().catch(console.error);
