import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import routes from './routes/index.js';
import { errorMiddleware } from './middleware/error.js';
import { globalRateLimit } from './middleware/global-rate-limit.js';
import logger from './utils/logger.js';
import { BodyLimit } from './constants/common.js';
import { runMigrations } from './db/migrate.js';
import { UPLOADS_DIR } from './utils/uploads.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.set('trust proxy', true);

process.on('uncaughtException', (error) => {
	logger.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
	logger.error('Unhandled rejection at:', promise, 'reason:', reason);
});

process.on('SIGINT', async () => {
	logger.info('Interrupted');
	process.exit(0);
});

process.on('SIGTERM', async () => {
	logger.info('SIGTERM signal received');
	await new Promise((resolve) => setTimeout(resolve, 3000));
	logger.info('Exiting');
	process.exit(0);
});

app.use(helmet({
	crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors({
	origin: process.env.CORS_ORIGIN,
	credentials: true,
}));
app.use(morgan('combined'));
app.use(globalRateLimit);
app.use(express.json({
	limit: BodyLimit,
}));
app.use(express.urlencoded({
	extended: true,
	limit: BodyLimit,
}));

app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/', routes());

app.use(errorMiddleware);

app.use((req, res) => {
	res.status(404).json({ error: 'Route not found' });
});

const port = process.env.PORT || 3001;

async function start() {
	if (!process.env.JWT_SECRET) {
		logger.error('JWT_SECRET is required in apps/api/.env');
		process.exit(1);
	}

	try {
		await runMigrations();
		logger.info('Database migrations OK');
	} catch (err) {
		logger.error('Database migration failed — check MYSQL_* env vars:', err.message);
		process.exit(1);
	}

	app.listen(port, () => {
		logger.info(`API Server running on http://localhost:${port}`);
		logger.info(`Uploads: ${UPLOADS_DIR}`);
	});
}

start();

export default app;
