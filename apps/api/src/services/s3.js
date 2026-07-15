import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

let client;

export function isS3Enabled() {
  return Boolean(
    process.env.S3_BUCKET
    && process.env.AWS_ACCESS_KEY_ID
    && process.env.AWS_SECRET_ACCESS_KEY,
  );
}

function getClient() {
  if (!isS3Enabled()) {
    throw new Error('S3 is not configured (set S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)');
  }
  if (!client) {
    client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }
  return client;
}

export function s3Bucket() {
  return process.env.S3_BUCKET;
}

/** Public CDN / bucket URL prefix (no trailing slash), e.g. CloudFront */
export function s3PublicBaseUrl() {
  const base = (process.env.S3_PUBLIC_BASE_URL || '').replace(/\/$/, '');
  return base || null;
}

/**
 * Upload a buffer to S3.
 * @returns {Promise<string>} object key stored in the DB
 */
export async function putObject({ key, buffer, contentType }) {
  await getClient().send(new PutObjectCommand({
    Bucket: s3Bucket(),
    Key: key,
    Body: buffer,
    ContentType: contentType || 'application/octet-stream',
  }));
  return key;
}

export async function deleteObject(key) {
  if (!key || !isS3Enabled()) return;
  await getClient().send(new DeleteObjectCommand({
    Bucket: s3Bucket(),
    Key: key,
  }));
}

/** Signed GET URL for private objects (default 1 hour) */
export async function getSignedGetUrl(key, expiresInSeconds = 3600) {
  const command = new GetObjectCommand({
    Bucket: s3Bucket(),
    Key: key,
  });
  return getSignedUrl(getClient(), command, { expiresIn: expiresInSeconds });
}

/**
 * Best URL for browsers:
 * - S3_PUBLIC_BASE_URL + key if set (CloudFront / public bucket)
 * - otherwise a time-limited signed URL
 */
export async function resolveObjectUrl(key) {
  if (!key) return null;
  if (key.startsWith('http://') || key.startsWith('https://')) return key;
  const publicBase = s3PublicBaseUrl();
  if (publicBase) return `${publicBase}/${key.replace(/^\//, '')}`;
  return getSignedGetUrl(key);
}
