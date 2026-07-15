import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import multer from 'multer';
import { createId } from './ids.js';
import { isS3Enabled, putObject, s3PublicBaseUrl } from '../services/s3.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const UPLOADS_DIR = join(__dirname, '../../uploads');

mkdirSync(UPLOADS_DIR, { recursive: true });

/** Always buffer in memory so the same path works for local disk and S3 */
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
});

function buildObjectKey(originalName) {
  const safeExt = extname(originalName || '').slice(0, 20);
  return `media/${createId(20)}${safeExt}`;
}

/**
 * Persist multer memory files to S3 (if configured) or local disk.
 * Sets `file.filename` to the storage key used in DB fields.
 */
export async function persistMulterFiles(files) {
  if (!files?.length) return;

  for (const file of files) {
    const key = buildObjectKey(file.originalname);
    if (isS3Enabled()) {
      await putObject({
        key,
        buffer: file.buffer,
        contentType: file.mimetype,
      });
    } else {
      // Local key keeps the same media/ prefix for consistency
      const localName = key.replace(/^media\//, '');
      writeFileSync(join(UPLOADS_DIR, localName), file.buffer);
      file.filename = localName;
      continue;
    }
    file.filename = key;
  }
}

/**
 * Public URL path or absolute URL for a stored filename/key.
 * With S3 + S3_PUBLIC_BASE_URL → CDN/object URL.
 * With S3 (private) → `/uploads/<key>` (API redirects to a signed URL).
 * Local → `/uploads/<filename>`.
 */
export function filePublicUrl(filename) {
  if (!filename) return null;
  if (filename.startsWith('http://') || filename.startsWith('https://') || filename.startsWith('/')) {
    return filename;
  }

  const publicBase = s3PublicBaseUrl();
  if (isS3Enabled() && publicBase) {
    return `${publicBase}/${filename.replace(/^\//, '')}`;
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
