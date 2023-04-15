import multer, { Options } from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinaryPackage from 'cloudinary';
import env from '../utils/enValidator';

interface CloudinaryStorageOptions {
  cloudinary: typeof cloudinaryPackage;
  params: {
    folder: string;
    allowedFormats: string[];
  };
}

const cloudinary = cloudinaryPackage.v2;

// configure cloudinary
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_SECRET_KEY,
});
// create storage engine with options

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'Ecommerce-api',
    allowedFormats: ['jpg', 'png', 'jpeg'],
  } as CloudinaryStorageOptions['params'],
});

const upload = multer({
  storage,
});

export default upload;
