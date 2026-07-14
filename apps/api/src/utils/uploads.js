import { mkdirSync } from 'node:fs';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import multer from 'multer';
import { createId } from './ids.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const UPLOADS_DIR = join(__dirname, '../../uploads');

mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const safeExt = extname(file.originalname || '').slice(0, 20);
    cb(null, `${createId(20)}${safeExt}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
});

/** Public URL path for a stored filename */
export function filePublicUrl(filename) {
  if (!filename) return null;
  if (filename.startsWith('http://') || filename.startsWith('https://') || filename.startsWith('/')) {
    return filename;
  }
  return `/uploads/${filename}`;
}

export function absoluteUploadUrl(req, filename) {
  const path = filePublicUrl(filename);
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const base = process.env.API_PUBLIC_URL || `${req.protocol}://${req.get('host')}`;
  return `${base.replace(/\/$/, '')}${path}`;
}
