const fs = require('fs');
const path = require('path');
const map = require('./cloudinary-images-map.json');

const replacements = [
  // Products
  { from: '/images/products/cream-1.png', to: map.products['cream-1.png'] },
  { from: '/images/products/elixir-1.png', to: map.products['elixir-1.png'] },
  { from: '/images/products/facewash-1.png', to: map.products['facewash-1.png'] },
  { from: '/images/products/mask-1.png', to: map.products['mask-1.png'] },
  { from: '/images/products/mask-2.png', to: map.products['mask-2.png'] },
  { from: '/images/products/perfume-1.png', to: map.products['perfume-1.png'] },
  { from: '/images/products/serum-1.png', to: map.products['serum-1.png'] },
  { from: '/images/products/serum-2.png', to: map.products['serum-2.png'] },
  { from: '/images/products/shampoo-1.png', to: map.products['shampoo-1.png'] },
  { from: '/images/products/shampoo-2.png', to: map.products['shampoo-2.png'] },
  { from: '/images/products/wax-1.png', to: map.products['wax-1.png'] },
  { from: '/images/products/mask-texture.png', to: map.products['mask-1.png'] },
  { from: '/images/products/mask-lifestyle.png', to: map.products['mask-2.png'] },
  { from: '/images/products/shampoo-texture.png', to: map.products['shampoo-1.png'] },
  { from: '/images/products/serum-texture.png', to: map.products['serum-1.png'] },
  { from: '/images/products/elixir-dropper.png', to: map.products['elixir-1.png'] },
  { from: '/images/products/cream-swatch.png', to: map.products['cream-1.png'] },
  { from: '/images/products/pomade-texture.png', to: map.products['wax-1.png'] },
  { from: '/images/products/perfume-cap.png', to: map.products['perfume-1.png'] },

  // Carousel
  { from: '/images/carousel/card-mask.jpg', to: map.carousel['card-mask.jpg'] },
  { from: '/images/carousel/card-powder.jpg', to: map.carousel['card-powder.jpg'] },
  { from: '/images/carousel/card-serum.jpg', to: map.carousel['card-serum.jpg'] },
  { from: '/images/carousel/card-shampoo.jpg', to: map.carousel['card-shampoo.jpg'] },
  { from: '/images/carousel/card-wax.jpg', to: map.carousel['card-wax.jpg'] },

  // Hero
  { from: '/images/hero/editorial-hero.jpg', to: map.hero['editorial-hero.jpg'] },
  { from: '/images/hero/model-center.jpg', to: map.hero['model-center.jpg'] },
  { from: '/images/hero/model-spray.jpg', to: map.hero['model-spray.jpg'] },
  { from: '/images/hero/model-walk-left.jpg', to: map.hero['model-walk-left.jpg'] },
  { from: '/images/hero/sensein-perfume-bottle.jpg', to: map.hero['sensein-perfume-bottle.jpg'] },

  // Transformations
  { from: '/images/transformations/curls-after.jpg', to: map.transformations['curls-after.jpg'] },
  { from: '/images/transformations/curls-before.jpg', to: map.transformations['curls-before.jpg'] },
  { from: '/images/transformations/frizz-after.jpg', to: map.transformations['frizz-after.jpg'] },
  { from: '/images/transformations/frizz-before.jpg', to: map.transformations['frizz-before.jpg'] },
  { from: '/images/transformations/men-after.jpg', to: map.transformations['men-after.jpg'] },
  { from: '/images/transformations/men-before.jpg', to: map.transformations['men-before.jpg'] },
];

const targetFiles = [
  'd:/project-1/frontend/lib/products-data.ts',
  'd:/project-1/frontend/store/cart-store.ts',
  'd:/project-1/frontend/components/product-card.tsx',
  'd:/project-1/frontend/components/fly-to-cart.tsx',
  'd:/project-1/frontend/components/cart-drawer.tsx',
  'd:/project-1/frontend/components/admin/admin-dashboard.tsx',
  'd:/project-1/frontend/app/product/[id]/page.tsx',
  'd:/project-1/frontend/app/page.tsx',
  'd:/project-1/frontend/app/checkout/page.tsx',
  'd:/project-1/frontend/components/real-results-carousel.tsx',
  'd:/project-1/frontend/components/before-after-section.tsx',
  'd:/project-1/backend/src/products/products.service.ts'
];

for (const f of targetFiles) {
  if (!fs.existsSync(f)) {
    console.warn('File does not exist:', f);
    continue;
  }
  let content = fs.readFileSync(f, 'utf8');
  let changed = false;
  for (const rep of replacements) {
    if (content.includes(rep.from)) {
      content = content.split(rep.from).join(rep.to);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(f, content, 'utf8');
    console.log('Updated file with Cloudinary URLs:', f);
  } else {
    console.log('No local image paths found in:', f);
  }
}
console.log('Finished updating all files with Cloudinary URLs.');
