import { randomBytes } from 'node:crypto';

/** PocketBase-style 15-char alphanumeric id */
export function createId(length = 15) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = randomBytes(length);
  let out = '';
  for (let i = 0; i < length; i++) {
    out += alphabet[bytes[i] % alphabet.length];
  }
  return out;
}
