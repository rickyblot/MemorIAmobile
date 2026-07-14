import { readdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { getPool } from './pool.js';
import logger from '../utils/logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function ensureMigrationsTable(connection) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id VARCHAR(255) PRIMARY KEY,
      applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export async function runMigrations() {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    await ensureMigrationsTable(connection);

    const dir = join(__dirname, 'migrations');
    const files = (await readdir(dir))
      .filter((f) => f.endsWith('.sql'))
      .sort();

    const [appliedRows] = await connection.query('SELECT id FROM schema_migrations');
    const applied = new Set(appliedRows.map((r) => r.id));

    for (const file of files) {
      if (applied.has(file)) continue;

      const sql = await readFile(join(dir, file), 'utf8');
      logger.info(`Applying migration ${file}...`);

      await connection.beginTransaction();
      try {
        const statements = sql
          .split(/;\s*(?:\r?\n|$)/)
          .map((s) => s.trim())
          .filter((s) => s.length > 0 && !/^--/.test(s));

        for (const statement of statements) {
          await connection.query(statement);
        }

        await connection.query('INSERT INTO schema_migrations (id) VALUES (?)', [file]);
        await connection.commit();
        logger.info(`Migration ${file} applied`);
      } catch (err) {
        await connection.rollback();
        throw err;
      }
    }
  } finally {
    connection.release();
  }
}

const isDirectRun =
  Boolean(process.argv[1]) &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  runMigrations()
    .then(() => {
      logger.info('Migrations complete');
      process.exit(0);
    })
    .catch((err) => {
      logger.error('Migration failed:', err);
      process.exit(1);
    });
}
