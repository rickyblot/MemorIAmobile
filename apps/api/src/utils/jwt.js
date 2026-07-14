import jwt from 'jsonwebtoken';

const DEFAULT_EXPIRES = '7d';

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is required');
  }
  return secret;
}

export function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, name: user.name },
    getJwtSecret(),
    { expiresIn: process.env.JWT_EXPIRES_IN || DEFAULT_EXPIRES },
  );
}

export function verifyToken(token) {
  return jwt.verify(token, getJwtSecret());
}

export function publicUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    name: row.name || '',
    avatar: row.avatar_path || null,
    theme: row.theme || 'light',
    emailVerified: Boolean(row.email_verified),
    created: row.created_at,
    updated: row.updated_at,
  };
}
