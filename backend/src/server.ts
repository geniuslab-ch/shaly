// Charger les variables d'environnement EN PREMIER
import dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import authRoutes from './routes/auth.routes';
import postsRoutes from './routes/posts.routes';
import setupRoutes from './routes/setup.routes';
import organizationsRoutes from './routes/organizations.routes';
import blogRoutes from './routes/blog.routes';
import userRoutes from './routes/user.routes';
import stripeRoutes from './routes/stripe.routes';
import linkedAccountsRoutes from './routes/linkedAccounts.routes';
import mediaRoutes from './routes/media.routes';
import sitemapRoutes from './routes/sitemap.routes';
import { errorHandler } from './middleware/errorHandler';
import { startWorker } from './jobs/publishPost.worker';

// Créer l'app Express
const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware de sécurité
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Stripe webhook (MUST be before express.json middleware)
app.use('/api/stripe', stripeRoutes);

// Sitemap (public, no auth required)
app.use('/', sitemapRoutes);

// Routes
app.use('/auth', authRoutes);
app.use('/api', postsRoutes);
app.use('/api/organizations', organizationsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/linked-accounts', linkedAccountsRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/blog', blogRoutes);
app.use('/setup', setupRoutes); // TEMPORARY - for database initialization

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    environment: process.env.NODE_ENV
  });
});

// Route 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

// Démarrer le serveur
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 LinkedIn OAuth: ${process.env.LINKEDIN_REDIRECT_URI}`);

  // Démarrer le worker BullMQ
  startWorker();
  console.log('✅ BullMQ Worker started');
});

// Gestion propre de l'arrêt
process.on('SIGTERM', () => {
  console.log('⏹️ SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('⏹️ SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default app;
