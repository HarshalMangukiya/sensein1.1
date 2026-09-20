const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: 'dqddawu42',
  api_key: '588757514664146',
  api_secret: 'zGJ3E4-oukgesomhK-Aoa55Gp6E',
  secure: true,
});

async function uploadLogos() {
  const imagesDir = path.resolve(__dirname, '../frontend/public/images');
  const files = fs.readdirSync(imagesDir).filter(f => !fs.statSync(path.join(imagesDir, f)).isDirectory());
  
  console.log('Found logo files to upload:', files);
  const uploaded = {};

  for (const file of files) {
    const fullPath = path.join(imagesDir, file);
    try {
      const res = await cloudinary.uploader.upload(fullPath, {
        folder: 'sensein/brand',
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      });
      console.log(`Uploaded ${file} -> ${res.secure_url}`);
      uploaded[file] = res.secure_url;
    } catch (err) {
      console.error(`Failed ${file}:`, err.message);
    }
  }

  fs.writeFileSync(
    path.resolve(__dirname, 'cloudinary-brand-map.json'),
    JSON.stringify(uploaded, null, 2)
  );
  console.log('Brand images uploaded and saved to cloudinary-brand-map.json');
}

uploadLogos();
