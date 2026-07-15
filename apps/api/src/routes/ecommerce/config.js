import { Router } from 'express';

const router = Router();

/**
 * Public ecommerce config for the SPA.
 * Lets production use Hostinger runtime ECOMMERCE_STORE_ID even when
 * VITE_ECOMMERCE_STORE_ID was not present at Vite build time.
 */
router.get('/config', (_req, res) => {
  const storeId = (process.env.ECOMMERCE_STORE_ID || '').trim();
  const apiUrl = (process.env.ECOMMERCE_API_URL || 'https://api-ecommerce.hostinger.com')
    .trim()
    .replace(/\/$/, '');

  if (!storeId) {
    return res.status(503).json({
      error: 'ECOMMERCE_STORE_ID is not set on the server',
    });
  }

  res.json({
    storeId,
    apiUrl,
  });
});

export default router;
