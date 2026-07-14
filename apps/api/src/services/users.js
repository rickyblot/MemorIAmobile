import bcrypt from 'bcryptjs';
import { query } from '../db/pool.js';
import { createId } from '../utils/ids.js';
import { publicUser } from '../utils/jwt.js';

export async function findUserByEmail(email) {
  const rows = await query('SELECT * FROM users WHERE email = :email LIMIT 1', { email: email.toLowerCase() });
  return rows[0] || null;
}

export async function findUserById(id) {
  const rows = await query('SELECT * FROM users WHERE id = :id LIMIT 1', { id });
  return rows[0] || null;
}

export async function findUserByOAuth(provider, providerUserId) {
  const rows = await query(
    `SELECT u.* FROM users u
     INNER JOIN oauth_accounts o ON o.user_id = u.id
     WHERE o.provider = :provider AND o.provider_user_id = :providerUserId
     LIMIT 1`,
    { provider, providerUserId },
  );
  return rows[0] || null;
}

export async function createUser({ email, password, name }) {
  const id = createId();
  const password_hash = password ? await bcrypt.hash(password, 10) : null;
  await query(
    `INSERT INTO users (id, email, password_hash, name, email_verified)
     VALUES (:id, :email, :password_hash, :name, 0)`,
    {
      id,
      email: email.toLowerCase(),
      password_hash,
      name: name || '',
    },
  );
  return findUserById(id);
}

export async function updateUser(id, fields) {
  const sets = [];
  const params = { id };

  if (fields.name !== undefined) {
    sets.push('name = :name');
    params.name = fields.name;
  }
  if (fields.avatar_path !== undefined) {
    sets.push('avatar_path = :avatar_path');
    params.avatar_path = fields.avatar_path;
  }
  if (fields.theme !== undefined) {
    sets.push('theme = :theme');
    params.theme = fields.theme;
  }
  if (fields.password) {
    sets.push('password_hash = :password_hash');
    params.password_hash = await bcrypt.hash(fields.password, 10);
  }
  if (fields.email_verified !== undefined) {
    sets.push('email_verified = :email_verified');
    params.email_verified = fields.email_verified ? 1 : 0;
  }
  if (fields.google_id !== undefined) {
    sets.push('google_id = :google_id');
    params.google_id = fields.google_id;
  }
  if (fields.apple_id !== undefined) {
    sets.push('apple_id = :apple_id');
    params.apple_id = fields.apple_id;
  }

  if (!sets.length) return findUserById(id);

  await query(`UPDATE users SET ${sets.join(', ')} WHERE id = :id`, params);
  return findUserById(id);
}

export async function verifyPassword(user, password) {
  if (!user?.password_hash) return false;
  return bcrypt.compare(password, user.password_hash);
}

export async function linkOAuthAccount(userId, provider, providerUserId) {
  const existing = await query(
    `SELECT id FROM oauth_accounts WHERE provider = :provider AND provider_user_id = :providerUserId LIMIT 1`,
    { provider, providerUserId },
  );
  if (existing[0]) return;

  await query(
    `INSERT INTO oauth_accounts (id, user_id, provider, provider_user_id)
     VALUES (:id, :userId, :provider, :providerUserId)`,
    { id: createId(), userId, provider, providerUserId },
  );

  if (provider === 'google') {
    await updateUser(userId, { google_id: providerUserId, email_verified: true });
  }
  if (provider === 'apple') {
    await updateUser(userId, { apple_id: providerUserId, email_verified: true });
  }
}

export async function upsertOAuthUser({ provider, providerUserId, email, name }) {
  let user = await findUserByOAuth(provider, providerUserId);

  if (!user && email) {
    user = await findUserByEmail(email);
    if (user) {
      await linkOAuthAccount(user.id, provider, providerUserId);
      user = await findUserById(user.id);
    }
  }

  if (!user) {
    user = await createUser({
      email: email || `${provider}_${providerUserId}@oauth.local`,
      password: null,
      name: name || '',
    });
    await linkOAuthAccount(user.id, provider, providerUserId);
    user = await findUserById(user.id);
  }

  return user;
}

export { publicUser };
