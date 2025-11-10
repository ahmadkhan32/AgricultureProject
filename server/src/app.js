const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        process.env.FRONTEND_URL || 'https://agricul-website.vercel.app',
        'https://agricul-website.vercel.app',
        'https://ucaeep-website.vercel.app',
        /\.vercel\.app$/,
        /\.railway\.app$/
      ] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images and documents)
const path = require('path');
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath, {
  setHeaders: (res, filePath, stat) => {
    // Allow CORS for all files
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    // Set proper content type based on file extension
    const ext = path.extname(filePath).toLowerCase();
    const contentTypes = {
      // Images
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.webp': 'image/webp',
      // Documents
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.ppt': 'application/vnd.ms-powerpoint',
      '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      '.txt': 'text/plain',
      '.csv': 'text/csv',
      '.zip': 'application/zip',
      '.rar': 'application/x-rar-compressed'
    };
    
    if (contentTypes[ext]) {
      res.setHeader('Content-Type', contentTypes[ext]);
    }
  }
}));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/producers', require('./routes/producerRoutes'));
app.use('/api/news', require('./routes/newsRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/partnerships', require('./routes/partnershipRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'UCAEP Server is running',
    database: 'MySQL',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware (must be last)
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;

