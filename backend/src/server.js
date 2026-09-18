import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import tellGalRoutes from './routes/tellGalRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables reliably from backend/.env or root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

// Connect to MongoDB Database
connectDB();

const app = express();

// Middleware: Enable CORS for all Vercel domains, localhost, and custom origins
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
  })
);

// Explicit preflight and header injection to ensure no CORS blocking across cloud hosts
app.use((req, res, next) => {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);
app.use('/', authRoutes);
app.use('/api/tell-gal', tellGalRoutes);

// Root status endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'GAL Backend API is running successfully',
    database: 'Connected to MongoDB Atlas',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      tellGal: '/api/tell-gal',
    },
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Auth API server is running smoothly' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`📁 Database mapped to: GAL > ${process.env.COLLECTION_NAME || 'GALL'}`);
});

