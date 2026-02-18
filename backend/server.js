const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const dotenv     = require('dotenv');
const rateLimit  = require('express-rate-limit');

dotenv.config();

// Routes
const authRoutes      = require('./routes/authRoutes');
const jobRoutes       = require('./routes/jobRoutes');
const adminRoutes     = require('./routes/adminRoutes');
const postRoutes      = require('./routes/postRoutes');
const resumeRoutes    = require('./routes/resumeRoutes');
const atsRoutes       = require('./routes/atsRoutes');
const jobSearchRoutes = require('./routes/jobSearchRoutes'); // JSearch proxy

// Error middleware
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// ─── Body Parser ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ─── Rate Limiting ────────────────────────────────────────────────────────────
// FIX: Brute-force protection on auth endpoints
// Allows 20 attempts per 15 minutes per IP — prevents password spraying
const authLimiter = rateLimit({
  windowMs:         15 * 60 * 1000, // 15 minutes
  max:              20,              // limit each IP to 20 requests per window
  message:          { message: 'Too many requests from this IP, please try again after 15 minutes.' },
  standardHeaders:  true,
  legacyHeaders:    false,
});

// General API rate limit (more lenient)
const apiLimiter = rateLimit({
  windowMs:         15 * 60 * 1000,
  max:              200,
  standardHeaders:  true,
  legacyHeaders:    false,
});

// Apply auth limiter only to auth routes
app.use('/api/auth', authLimiter);
app.use('/api',      apiLimiter);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',    authRoutes);
app.use('/api/jobs',    jobRoutes);
app.use('/api/admin',   adminRoutes);
app.use('/api/posts',   postRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/ats',     atsRoutes);
app.use('/api/jsearch', jobSearchRoutes); // JSearch proxy

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Database + Server ────────────────────────────────────────────────────────
const PORT     = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('FATAL: MONGO_URI is not defined in .env');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

module.exports = app;