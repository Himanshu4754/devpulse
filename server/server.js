import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import comparisonRoutes from './src/routes/comparisonRoutes.js';
import repositoryRoutes from './src/routes/repositoryRoutes.js';
import metricsRoutes from './src/routes/metricsRoutes.js';
import insightRoutes from './src/routes/insightRoutes.js';
import webhookRoutes from './src/routes/webhookRoutes.js';
import { errorHandler } from './src/middleware/errorHandler.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf; // keep raw bytes alongside the parsed req.body
    }
  })
);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'DevPulse API running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/repositories', comparisonRoutes);
app.use('/api/repositories', repositoryRoutes);
app.use('/api/repositories', metricsRoutes);
app.use('/api/repositories', insightRoutes);
app.use('/api/webhooks', webhookRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});