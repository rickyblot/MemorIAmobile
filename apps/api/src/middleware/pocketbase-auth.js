import authMiddleware from './auth.js';

/**
 * JWT auth for integrated AI routes.
 * Sets req.pocketbaseUserId for backward-compatible handler code.
 */
export function pocketbaseAuth(req, res, next) {
  return authMiddleware(req, res, () => {
    if (req.user?.id) {
      req.pocketbaseUserId = req.user.id;
    }
    return next();
  });
}
