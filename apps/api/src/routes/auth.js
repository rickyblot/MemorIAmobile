import express from 'express';
import { createHash, randomBytes } from 'node:crypto';
import { createId } from '../utils/ids.js';
import { query } from '../db/pool.js';
import { signToken, publicUser, getJwtSecret } from '../utils/jwt.js';
import authMiddleware from '../middleware/auth.js';
import {
  createUser,
  findUserByEmail,
  findUserById,
  upsertOAuthUser,
  updateUser,
  verifyPassword,
} from '../services/users.js';
import logger from '../utils/logger.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

function authResponse(user) {
  const token = signToken(user);
  return { token, user: publicUser(user) };
}

function frontendRedirect(token, error) {
  const base = (process.env.WEB_APP_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');
  if (error) {
    return `${base}/login?oauth_error=${encodeURIComponent(error)}`;
  }
  // Land on login so AuthProvider can store the token, then it navigates to dashboard.
  return `${base}/login?token=${encodeURIComponent(token)}`;
}

function isGoogleConfigured() {
  const id = (process.env.GOOGLE_CLIENT_ID || '').trim();
  const secret = (process.env.GOOGLE_CLIENT_SECRET || '').trim();
  const redirect = (process.env.GOOGLE_REDIRECT_URI || '').trim();
  return Boolean(id && secret && redirect);
}

function isAppleConfigured() {
  return Boolean(
    (process.env.APPLE_CLIENT_ID || '').trim() &&
      (process.env.APPLE_TEAM_ID || '').trim() &&
      (process.env.APPLE_KEY_ID || '').trim() &&
      (process.env.APPLE_PRIVATE_KEY || '').trim() &&
      (process.env.APPLE_REDIRECT_URI || '').trim(),
  );
}

function createOAuthState(provider) {
  return jwt.sign(
    { provider, nonce: randomBytes(8).toString('hex') },
    getJwtSecret(),
    { expiresIn: '10m' },
  );
}

function verifyOAuthState(state, provider) {
  if (!state) return false;
  try {
    const payload = jwt.verify(String(state), getJwtSecret());
    return payload?.provider === provider;
  } catch {
    return false;
  }
}

router.get('/providers', (_req, res) => {
  const providers = [];
  if (isGoogleConfigured()) providers.push('google');
  if (isAppleConfigured()) providers.push('apple');
  res.json({ providers });
});

router.post('/signup', async (req, res) => {
  const { email, password, name } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  if (String(password).length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long' });
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  const user = await createUser({ email, password, name });
  res.status(201).json(authResponse(user));
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = await findUserByEmail(email);
  if (!user || !(await verifyPassword(user, password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json(authResponse(user));
});

router.get('/me', authMiddleware, async (req, res) => {
  const user = await findUserById(req.user.id);
  res.json({ user: publicUser(user) });
});

router.patch('/me', authMiddleware, async (req, res) => {
  const { name, theme, avatar } = req.body || {};
  const user = await updateUser(req.user.id, {
    name,
    theme,
    avatar_path: avatar,
  });
  res.json({ user: publicUser(user) });
});

router.post('/change-password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword, newPasswordConfirm } = req.body || {};
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new password are required' });
  }
  if (String(newPassword).length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters' });
  }
  if (newPasswordConfirm !== undefined && newPassword !== newPasswordConfirm) {
    return res.status(400).json({ error: 'Password confirmation does not match' });
  }

  const user = await findUserById(req.user.id);
  if (!user?.password_hash) {
    return res.status(400).json({
      error: 'This account uses social login only. Set a password via password reset if available.',
    });
  }
  if (!(await verifyPassword(user, currentPassword))) {
    return res.status(401).json({ error: 'Current password is incorrect' });
  }

  await updateUser(user.id, { password: newPassword });
  res.json({ success: true });
});

router.post('/logout', (_req, res) => {
  res.json({ success: true });
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const user = await findUserByEmail(email);
  if (user) {
    const raw = randomBytes(32).toString('hex');
    const token_hash = createHash('sha256').update(raw).digest('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    await query(
      `INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at)
       VALUES (:id, :userId, :token_hash, :expires)`,
      { id: createId(), userId: user.id, token_hash, expires: expires.toISOString().slice(0, 19).replace('T', ' ') },
    );
    logger.info(`[dev] Password reset token for ${email}: ${raw}`);
    if (process.env.NODE_ENV !== 'production') {
      return res.json({ success: true, message: 'If the email exists, a reset link was sent.', token: raw });
    }
  }
  res.json({ success: true, message: 'If the email exists, a reset link was sent.' });
});

router.post('/send-reset-email', async (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Email is required' });
  const user = await findUserByEmail(email);
  if (user) {
    const raw = randomBytes(32).toString('hex');
    const token_hash = createHash('sha256').update(raw).digest('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    await query(
      `INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at)
       VALUES (:id, :userId, :token_hash, :expires)`,
      { id: createId(), userId: user.id, token_hash, expires: expires.toISOString().slice(0, 19).replace('T', ' ') },
    );
    logger.info(`[dev] Password reset token for ${email}: ${raw}`);
    if (process.env.NODE_ENV !== 'production') {
      return res.json({ success: true, message: 'Password reset email sent. Please check your inbox.', token: raw });
    }
  }
  res.json({ success: true, message: 'Password reset email sent. Please check your inbox.' });
});

router.post('/validate-reset-token', async (req, res) => {
  const { token } = req.body || {};
  if (!token) return res.status(400).json({ error: 'Token is required' });
  const token_hash = createHash('sha256').update(token.trim()).digest('hex');
  const rows = await query(
    `SELECT * FROM password_reset_tokens
     WHERE token_hash = :token_hash AND used_at IS NULL AND expires_at > NOW()
     LIMIT 1`,
    { token_hash },
  );
  if (!rows[0]) return res.status(400).json({ error: 'Invalid or expired reset token' });
  res.json({ success: true, message: 'Token is valid' });
});

router.post('/reset-password', async (req, res) => {
  const { token, password, passwordConfirm } = req.body || {};
  if (!token) return res.status(400).json({ error: 'Token is required' });
  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long' });
  }
  if (password !== passwordConfirm) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  const token_hash = createHash('sha256').update(token.trim()).digest('hex');
  const rows = await query(
    `SELECT * FROM password_reset_tokens
     WHERE token_hash = :token_hash AND used_at IS NULL AND expires_at > NOW()
     LIMIT 1`,
    { token_hash },
  );
  if (!rows[0]) return res.status(400).json({ error: 'Invalid or expired reset token' });

  await updateUser(rows[0].user_id, { password });
  await query(`UPDATE password_reset_tokens SET used_at = NOW() WHERE id = :id`, { id: rows[0].id });
  res.json({ success: true, message: 'Password reset successfully' });
});

router.get('/oauth/:provider', (req, res) => {
  const { provider } = req.params;
  const state = createOAuthState(provider);

  if (provider === 'google') {
    if (!isGoogleConfigured()) {
      return res.status(503).json({ error: 'Google OAuth is not configured' });
    }
    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    url.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID);
    url.searchParams.set('redirect_uri', process.env.GOOGLE_REDIRECT_URI);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', 'openid email profile');
    url.searchParams.set('access_type', 'online');
    url.searchParams.set('prompt', 'select_account');
    url.searchParams.set('state', state);
    return res.redirect(url.toString());
  }

  if (provider === 'apple') {
    if (!isAppleConfigured()) {
      return res.status(503).json({ error: 'Apple Sign In is not configured' });
    }
    const url = new URL('https://appleid.apple.com/auth/authorize');
    url.searchParams.set('client_id', process.env.APPLE_CLIENT_ID);
    url.searchParams.set('redirect_uri', process.env.APPLE_REDIRECT_URI);
    url.searchParams.set('response_type', 'code id_token');
    url.searchParams.set('response_mode', 'form_post');
    url.searchParams.set('scope', 'name email');
    url.searchParams.set('state', state);
    return res.redirect(url.toString());
  }

  return res.status(400).json({ error: 'Unsupported provider' });
});

async function handleGoogleCallback(code) {
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code: String(code),
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  });
  const tokenData = await tokenRes.json();
  if (!tokenRes.ok || !tokenData.access_token) {
    logger.error('Google token error', tokenData);
    const err = new Error('google_token_failed');
    err.code = 'google_token_failed';
    throw err;
  }

  const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const profile = await profileRes.json();
  if (!profile?.id) {
    const err = new Error('google_profile_failed');
    err.code = 'google_profile_failed';
    throw err;
  }

  return upsertOAuthUser({
    provider: 'google',
    providerUserId: String(profile.id),
    email: profile.email,
    name: profile.name || '',
  });
}

async function handleAppleCallback(code, idToken, userJson) {
  const clientSecret = await buildAppleClientSecret();
  const tokenRes = await fetch('https://appleid.apple.com/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code: String(code),
      client_id: process.env.APPLE_CLIENT_ID,
      client_secret: clientSecret,
      redirect_uri: process.env.APPLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  });
  const tokenData = await tokenRes.json();
  const jwtToken = tokenData.id_token || idToken;
  if (!tokenRes.ok || !jwtToken) {
    logger.error('Apple token error', tokenData);
    const err = new Error('apple_token_failed');
    err.code = 'apple_token_failed';
    throw err;
  }

  const payload = JSON.parse(
    Buffer.from(String(jwtToken).split('.')[1], 'base64url').toString('utf8'),
  );

  let name = '';
  if (userJson) {
    try {
      const parsed = typeof userJson === 'string' ? JSON.parse(userJson) : userJson;
      const parts = [parsed?.name?.firstName, parsed?.name?.lastName].filter(Boolean);
      name = parts.join(' ');
    } catch {
      // ignore
    }
  }

  return upsertOAuthUser({
    provider: 'apple',
    providerUserId: String(payload.sub),
    email: payload.email,
    name,
  });
}

async function finishOAuthCallback(req, res, provider) {
  const code = req.body?.code || req.query?.code;
  const error = req.body?.error || req.query?.error;
  const state = req.body?.state || req.query?.state;
  const idToken = req.body?.id_token || req.query?.id_token;
  const userJson = req.body?.user;

  if (error || !code) {
    return res.redirect(frontendRedirect(null, String(error || 'oauth_failed')));
  }
  if (!verifyOAuthState(state, provider)) {
    return res.redirect(frontendRedirect(null, 'invalid_oauth_state'));
  }

  try {
    let user;
    if (provider === 'google') {
      user = await handleGoogleCallback(code);
    } else if (provider === 'apple') {
      user = await handleAppleCallback(code, idToken, userJson);
    } else {
      return res.redirect(frontendRedirect(null, 'unsupported_provider'));
    }
    const { token } = authResponse(user);
    return res.redirect(frontendRedirect(token));
  } catch (err) {
    logger.error('OAuth callback error', err);
    return res.redirect(frontendRedirect(null, err.code || 'oauth_failed'));
  }
}

router.get('/oauth/:provider/callback', (req, res) => finishOAuthCallback(req, res, req.params.provider));
router.post('/oauth/:provider/callback', (req, res) => finishOAuthCallback(req, res, req.params.provider));

async function buildAppleClientSecret() {
  const privateKey = (process.env.APPLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  const now = Math.floor(Date.now() / 1000);
  return jwt.sign(
    {
      iss: process.env.APPLE_TEAM_ID,
      iat: now,
      exp: now + 60 * 60 * 24 * 180,
      aud: 'https://appleid.apple.com',
      sub: process.env.APPLE_CLIENT_ID,
    },
    privateKey,
    {
      algorithm: 'ES256',
      keyid: process.env.APPLE_KEY_ID,
    },
  );
}

export default router;
