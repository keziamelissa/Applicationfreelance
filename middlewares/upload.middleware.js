import multer from 'multer';
import path from 'path';
import fs from 'fs';

const deliveriesDir = path.resolve('uploads', 'deliveries');

// Ensure directory exists
fs.mkdirSync(deliveriesDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, deliveriesDir);
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const safeOriginal = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${timestamp}-${safeOriginal}`);
  }
});

export const uploadDeliveries = multer({ storage });
