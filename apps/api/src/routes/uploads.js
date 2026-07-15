import { createReadStream, existsSync } from 'node:fs';
import { join } from 'node:path';
import { Router } from 'express';
import { UPLOADS_DIR } from '../utils/uploads.js';
import { isS3Enabled, resolveObjectUrl, s3PublicBaseUrl } from '../services/s3.js';

/**
 * Serves /uploads/* — local files, or 302 redirect to S3/CloudFront/signed URL.
 * Mounted at both /uploads and /hcgi/api/uploads.
 */
export default function uploadsRouter() {
  const router = Router();

  router.get('/*splat', async (req, res, next) => {
    try {
      const raw = Array.isArray(req.params.splat)
        ? req.params.splat.join('/')
        : String(req.params.splat || '');
      const key = decodeURIComponent(raw).replace(/^\/+/, '');
      if (!key || key.includes('..')) {
        return res.status(400).json({ error: 'Invalid path' });
      }

      if (isS3Enabled()) {
        // Prefer CDN absolute URLs when configured — redirect there
        const publicBase = s3PublicBaseUrl();
        if (publicBase) {
          return res.redirect(302, `${publicBase}/${key}`);
        }
        const signed = await resolveObjectUrl(key);
        return res.redirect(302, signed);
      }

      // Local disk: try key as-is, then basename without media/ prefix
      const candidates = [
        join(UPLOADS_DIR, key),
        join(UPLOADS_DIR, key.replace(/^media\//, '')),
      ];
      const localPath = candidates.find((p) => existsSync(p));
      if (!localPath) {
        return res.status(404).json({ error: 'File not found' });
      }
      return createReadStream(localPath).pipe(res);
    } catch (err) {
      return next(err);
    }
  });

  return router;
}
