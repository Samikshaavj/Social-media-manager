const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/error');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const oauthRoutes = require('./routes/oauthRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const helmet = require('helmet');
const path = require('path');

const app = express();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.use('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Social-Vibe API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/oauth', oauthRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/analytics', analyticsRoutes);

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 404 Handler for API routes
app.use('/api/debug/uploads', (req, res) => {
  try {
    const fs = require('fs');
    const files = fs.readdirSync(path.join(__dirname, '../uploads'));
    res.json({ __dirname, files });
  } catch(e) {
    res.json({ error: e.message, __dirname });
  }
});

app.use('/api', (req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));

  // Use regex for catch-all to avoid Express 5 path-to-regexp '*' error
  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../client/dist', 'index.html'));
  });
} else {
  // 404 Handler for everything else in development
  app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
  });
}

// Global Error Handler
app.use(errorHandler);

module.exports = app;
