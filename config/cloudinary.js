import cloud from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();
const cloudinary = cloud.v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export default cloudinary;
