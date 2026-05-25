import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Import routes
import dogClassesRouter from './routes/dogClasses.js';
import classesRouter from './routes/classes.js';
import signupsRouter from './routes/signups.js';
import signinRouter from './routes/signin.js';
import memberDogsRouter from './routes/memberDogs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || process.env.SERVER_PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || (process.env.NODE_ENV === 'production' ? process.env.RAILWAY_PUBLIC_DOMAIN && `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : 'http://localhost:5173'),
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Serve static frontend files in production
const clientPath = path.join(__dirname, '../dist');

// Startup diagnostics
const distExists = fs.existsSync(clientPath);
const indexExists = fs.existsSync(path.join(clientPath, 'index.html'));
console.log(`[STARTUP] __dirname: ${__dirname}`);
console.log(`[STARTUP] clientPath: ${clientPath}`);
console.log(`[STARTUP] dist/ exists: ${distExists}`);
console.log(`[STARTUP] dist/index.html exists: ${indexExists}`);
if (distExists) {
  console.log(`[STARTUP] dist/ contents: ${fs.readdirSync(clientPath).join(', ')}`);
}

app.use(express.static(clientPath));

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// SPA fallback - serve index.html for non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

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
