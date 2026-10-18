import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import path from 'path';
import crypto from 'crypto';
import cloudinary from '../config/cloudinary.js';

let storage;

// If Cloudinary credentials are provided, use Cloudinary storage
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'movies-blog',
      allowed_formats: ['jpeg', 'jpg', 'png', 'gif', 'webp', 'svg'],
      public_id: (req, file) => {
        const cleanName = path.parse(file.originalname).name.replace(/[^a-zA-Z0-9]/g, '-');
        return `${Date.now()}-${cleanName}`;
      },
    },
  });
} else {
  // Fallback to local disk storage if Cloudinary keys are not set yet
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(path.resolve(), 'uploads'));
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
      const ext = path.extname(file.originalname);
      cb(null, `${uniqueSuffix}${ext}`);
    },
  });
}

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp, svg) are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit
  },
});

export default upload;
