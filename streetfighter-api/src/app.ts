import express from 'express';
import cors from 'cors';
import characterRoutes from './api/v1/routes/characterRoutes';
import statsRoutes from './api/v1/routes/statsRoutes';
import { requestLogger } from './api/v1/middleware/logger';
import setupSwagger from './config/swagger';

const app = express();

// Pretty-print JSON in non-production environments for easier debugging
if (process.env.NODE_ENV !== 'production') {
	app.set('json spaces', 2);
}

app.use(cors());
app.use(express.json());
app.use(requestLogger);
setupSwagger(app);

app.use('/api/v1/characters', characterRoutes);
app.use('/api/v1/stats', statsRoutes);

export default app;
