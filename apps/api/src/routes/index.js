import { Router } from 'express';
import healthCheck from './health-check.js';
import integratedAiRouter from './integrated-ai.js';
import subscriptionsRouter from './ecommerce/subscriptions.js';
import storiesRouter from './stories.js';
import authRouter from './auth.js';
import exportRouter from './export.js';
import deviceRouter from './device.js';
import analysisRouter from './analysis.js';
import dataRouter from './data.js';
import authMiddleware from '../middleware/auth.js';
import ecommerceConfigRouter from './ecommerce/config.js';

export default () => {
    const router = Router();

    router.get('/health', healthCheck);
    router.use('/auth', authRouter);
    router.use('/data', dataRouter);
    router.use('/integrated-ai', integratedAiRouter);
    router.use('/ecommerce', ecommerceConfigRouter);
    router.use('/ecommerce/subscriptions', authMiddleware, subscriptionsRouter);
    router.use('/stories', authMiddleware, storiesRouter);
    router.use('/export', authMiddleware, exportRouter);
    router.use('/device', authMiddleware, deviceRouter);
    router.use('/analysis', authMiddleware, analysisRouter);

    return router;
};
