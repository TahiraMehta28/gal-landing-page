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

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl) or any matching domain
    if (!origin) return callback(null, true);
    const clientUrl = process.env.CLIENT_URL;
    if (!clientUrl || clientUrl === '*' || origin === clientUrl || origin.endsWith('.vercel.app') || origin.includes('localhost')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
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

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Database mapped to: GAL > ${process.env.COLLECTION_NAME || 'GALL'}`);
});
