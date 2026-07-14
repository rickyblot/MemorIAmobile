import { existsSync } from 'node:fs';
import mysql from 'mysql2/promise';
import logger from '../utils/logger.js';

let pool = null;

const COMMON_SOCKETS = [
  '/var/run/mysqld/mysqld.sock',
  '/tmp/mysql.sock',
  '/var/lib/mysql/mysql.sock',
  '/run/mysqld/mysqld.sock',
];

function trimEnv(value, fallback = '') {
  if (value === undefined || value === null) return fallback;
  return String(value).trim();
}

/**
 * Hostinger MySQL users are typically `user`@`localhost` (Unix socket).
 * Connecting over TCP to 127.0.0.1 authenticates as `user`@`127.0.0.1` and often fails.
 * Prefer a local socket when host is localhost / 127.0.0.1.
 */
function resolveConnectionTarget(host) {
  const socketFromEnv = trimEnv(process.env.MYSQL_SOCKET);
  if (socketFromEnv) {
    return { socketPath: socketFromEnv };
  }

  const normalized = (host || '127.0.0.1').toLowerCase();
  const localHosts = new Set(['localhost', '127.0.0.1', '::1']);
  if (localHosts.has(normalized)) {
    const found = COMMON_SOCKETS.find((p) => existsSync(p));
    if (found) {
      return { socketPath: found };
    }
  }

  return {
    host: normalized === 'localhost' || normalized === '::1' ? '127.0.0.1' : host,
    port: Number(trimEnv(process.env.MYSQL_PORT, '3306')),
    family: 4,
  };
}

export function getPool() {
  if (pool) return pool;

  const MYSQL_HOST = trimEnv(process.env.MYSQL_HOST, '127.0.0.1');
  const MYSQL_USER = trimEnv(process.env.MYSQL_USER, 'root');
  const MYSQL_PASSWORD = trimEnv(process.env.MYSQL_PASSWORD, '');
  const MYSQL_DATABASE = trimEnv(process.env.MYSQL_DATABASE, 'memoriamobile');

  const target = resolveConnectionTarget(MYSQL_HOST);

  pool = mysql.createPool({
    ...target,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    namedPlaceholders: true,
    dateStrings: true,
  });

  if (target.socketPath) {
    logger.info(`MySQL pool created via socket ${target.socketPath} / ${MYSQL_DATABASE}`);
  } else {
    logger.info(`MySQL pool created for ${target.host}:${target.port}/${MYSQL_DATABASE}`);
  }

  return pool;
}

export async function query(sql, params) {
  const [rows] = await getPool().execute(sql, params);
  return rows;
}

export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
