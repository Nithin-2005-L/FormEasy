// Load environment variables before importing any modules that read them
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import formRoutes from './routes/formRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler } from './middleware/authMiddleware.js';

// Debug: Check environment variables
console.log('Environment check:');
console.log('- PORT:', process.env.PORT || 8080);
console.log('- MongoDB URI configured:', !!process.env.MONGODB_URI);
console.log('- Gemini API Key configured:', !!process.env.GEMINI_API_KEY);
console.log('- JWT Secret configured:', !!process.env.JWT_SECRET);

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/form-easy-app';


// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

app.use(cors());
app.use(express.json());

// Use auth routes
app.use('/api/auth', authRoutes);

// Use form routes
app.use('/api', formRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});