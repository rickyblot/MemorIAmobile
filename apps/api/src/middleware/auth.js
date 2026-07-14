import { verifyToken } from '../utils/jwt.js';
import { findUserById } from '../services/users.js';

export default async function authMiddleware(req, res, next) {
  const reject = () => res.status(401).json({ error: 'Unauthorized' });
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return reject();

  const token = header.slice('Bearer '.length).trim();
  try {
    const payload = verifyToken(token);
    if (!payload?.sub) return reject();
    const user = await findUserById(payload.sub);
    if (!user) return reject();
    req.user = { id: user.id, email: user.email, name: user.name };
    req.userRow = user;
  } catch {
    return reject();
  }
  return next();
}

/** Optional auth — attaches user if token present, otherwise continues */
export async function optionalAuth(req, _res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next();
  try {
    const payload = verifyToken(header.slice(7).trim());
    if (payload?.sub) {
      const user = await findUserById(payload.sub);
      if (user) {
        req.user = { id: user.id, email: user.email, name: user.name };
        req.userRow = user;
      }
    }
  } catch {
    // ignore
  }
  return next();
}
