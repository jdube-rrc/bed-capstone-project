import express from 'express';
import { getHelmetConfig } from './config/helmetConfig';
import cors from 'cors';
import getCorsOptions from './config/corsConfig';
import dotenv from 'dotenv';

dotenv.config();


import characterRoutes from './api/v1/routes/characterRoutes';
import statsRoutes from './api/v1/routes/statsRoutes';
import adminRoutes from './api/v1/routes/adminRoutes';
import steamRoutes from './api/v1/routes/steamRoutes';
import metaRoutes from './api/v1/routes/metaRoutes';
import authenticate from './api/v1/middleware/authenticate';
import isAuthorized from './api/v1/middleware/authorize';
import { requestLogger } from './api/v1/middleware/logger';
import setupSwagger from './config/swagger';

const app = express();

app.use(getHelmetConfig());
app.use(cors(getCorsOptions()));

// Pretty-print JSON in non-production environments for easier debugging
if (process.env.NODE_ENV !== 'production') {
	app.set('json spaces', 2);
}

app.use(express.json());
app.use(requestLogger);
setupSwagger(app);

app.use('/api/v1/characters', characterRoutes);
app.use('/api/v1/stats', statsRoutes);
app.use('/api/v1/steam', steamRoutes);
app.use('/api/v1/meta', metaRoutes);
// Admin endpoints (protected)
app.use('/api/v1/admin', authenticate, isAuthorized({ hasRole: ['admin'], allowSameUser: false }), adminRoutes);

export default app;
