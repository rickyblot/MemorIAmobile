import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import routes from './routes/index.js';
import { errorMiddleware } from './middleware/error.js';
import { globalRateLimit } from './middleware/global-rate-limit.js';
import logger from './utils/logger.js';
import { BodyLimit } from './constants/common.js';
import { runMigrations } from './db/migrate.js';
import { UPLOADS_DIR } from './utils/uploads.js';
import uploadsRouter from './routes/uploads.js';
import { isS3Enabled, s3Bucket } from './services/s3.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB_DIST = join(__dirname, '../../../dist/apps/web');
const serveSpa = existsSync(join(WEB_DIST, 'index.html'));

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
	contentSecurityPolicy: false,
}));
app.use(cors({
	origin: process.env.CORS_ORIGIN === '*' || !process.env.CORS_ORIGIN
		? true
		: process.env.CORS_ORIGIN,
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

app.use('/uploads', uploadsRouter());
app.use('/hcgi/api/uploads', uploadsRouter());
// Production / Hostinger: browser calls /hcgi/api/* (no Vite proxy)
app.use('/hcgi/api', routes());
// Local Vite proxy rewrites /hcgi/api → / on this server
app.use('/', routes());

app.use(errorMiddleware);

if (serveSpa) {
	app.use(express.static(WEB_DIST, { index: false }));
	app.use((req, res, next) => {
		if (req.method !== 'GET' && req.method !== 'HEAD') return next();
		if (req.path.startsWith('/hcgi/api') || req.path.startsWith('/uploads')) {
			return next();
		}
		res.sendFile(join(WEB_DIST, 'index.html'), (err) => {
			if (err) next(err);
		});
	});
	logger.info(`Serving web app from ${WEB_DIST}`);
} else {
	logger.warn(`Web build not found at ${WEB_DIST} — run npm run build (API-only mode)`);
}

app.use((req, res) => {
	res.status(404).json({ error: 'Route not found' });
});

const port = Number(process.env.PORT) || 3001;

async function start() {
	if (!process.env.JWT_SECRET) {
		logger.error('JWT_SECRET is required (set in Hostinger env vars or apps/api/.env)');
		process.exit(1);
	}

	try {
		await runMigrations();
		logger.info('Database migrations OK');
	} catch (err) {
		logger.error('Database migration failed — check MYSQL_* env vars:', err.message);
		process.exit(1);
	}

	app.listen(port, '0.0.0.0', () => {
		logger.info(`Server listening on 0.0.0.0:${port}`);
		if (isS3Enabled()) {
			logger.info(`Uploads: Amazon S3 bucket ${s3Bucket()}`);
		} else {
			logger.info(`Uploads: local disk ${UPLOADS_DIR} (set S3_* to use Amazon S3)`);
		}
		logger.info(`SPA: ${serveSpa ? 'yes' : 'no'}`);
	});
}

start();

export default app;
