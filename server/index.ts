import express from 'express';
import cors from 'cors';
import session from 'express-session';
import expressMySqlSession from 'express-mysql-session';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Import routes
import dogClassesRouter from './routes/dogClasses.js';
import classesRouter from './routes/classes.js';
import signupsRouter from './routes/signups.js';
import signinRouter from './routes/signin.js';
import memberDogsRouter from './routes/memberDogs.js';
import pool from './config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || process.env.SERVER_PORT || 3001;

// Trust proxy (required for secure cookies behind Railway's proxy)
app.set('trust proxy', 1);

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || (process.env.NODE_ENV === 'production' ? process.env.RAILWAY_PUBLIC_DOMAIN && `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : 'http://localhost:5173'),
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session store setup (MySQL-backed)
const MySQLStore = expressMySqlSession(session as any);
const sessionStore = new MySQLStore({
  clearExpired: true,
  checkExpirationInterval: 900000, // 15 minutes
  expiration: 86400000, // 24 hours
}, pool as any);

app.use(session({
  store: sessionStore,
  secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true, // Prevents JavaScript access (XSS protection)
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/dog-classes', dogClassesRouter);
app.use('/api/classes', classesRouter);
app.use('/api/signups', signupsRouter);
app.use('/api/signin', signinRouter);
app.use('/api/member-dogs', memberDogsRouter);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Serve static frontend files in production
if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(__dirname, '../dist');
  app.use(express.static(clientPath));

  // SPA fallback - serve index.html for non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
} else {
  // 404 handler for development
  app.use((req, res) => {
    res.status(404).json({
      error: 'Endpoint not found',
      path: req.path
    });
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║     🐕 Keystone Canine Training Club API Server  ║
║     Running on http://localhost:${PORT}            ║
║     Environment: ${process.env.NODE_ENV || 'development'}             ║
╚═══════════════════════════════════════════════════╝
  `);
});

export default app;