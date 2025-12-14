import multer from 'multer';
import path from 'path';
import fs from 'fs';

const deliveriesDir = path.resolve('uploads', 'deliveries');
const cvsDir = path.resolve('uploads', 'cvs');

// Ensure directory exists
fs.mkdirSync(deliveriesDir, { recursive: true });
fs.mkdirSync(cvsDir, { recursive: true });

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

// CV storage
const cvStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, cvsDir);
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const safeOriginal = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${timestamp}-${safeOriginal}`);
  }
});

export const uploadCV = multer({ storage: cvStorage });
