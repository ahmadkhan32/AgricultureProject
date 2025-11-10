const app = require('./app');
const { sequelize, testConnection } = require('./config/db');
const net = require('net');
// Import models to initialize associations
require('./models');

const PORT = process.env.PORT || 5000;

// Function to check if port is available
const isPortAvailable = (port) => {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(port, () => {
      server.once('close', () => resolve(true));
      server.close();
    });
    
    server.on('error', () => {
      resolve(false);
    });
  });
};

// Validate required environment variables
const validateEnv = () => {
  const required = ['JWT_SECRET', 'DB_NAME'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    console.error('Please check your .env file in the server directory.');
    process.exit(1);
  }
  
  // Warn if JWT_SECRET is default
  if (process.env.JWT_SECRET === 'your_super_secret_jwt_key_here_make_it_long_and_random_change_this_in_production') {
    console.warn('⚠️  WARNING: Using default JWT_SECRET. Change this in production!');
  }
};

// Initialize database connection and start server
const startServer = async () => {
  try {
    // Validate environment variables
    validateEnv();
    
    // Test database connection
    const connected = await testConnection();
    
    if (!connected) {
      console.error('❌ Database connection failed. Please check your MySQL configuration.');
      process.exit(1);
    }

    // Sync database (creates tables if they don't exist)
    // In production, use migrations instead
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Syncing database models...');
      await sequelize.sync({ alter: false });
      console.log('✅ Database models synced successfully.');
    }

    // Check if port is available
    const portAvailable = await isPortAvailable(PORT);
    
    if (!portAvailable) {
      console.error(`❌ Port ${PORT} is already in use!`);
      console.error(`Please either:`);
      console.error(`  1. Stop the process using port ${PORT}`);
      console.error(`  2. Change the PORT in your .env file`);
      console.error(`\nTo find and kill the process:`);
      console.error(`  Windows: netstat -ano | findstr :${PORT}`);
      console.error(`  Then: taskkill /PID <PID> /F`);
      process.exit(1);
    }

    // Start server
    const server = app.listen(PORT, () => {
      console.log(`🚀 UCAEP Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️  Database: MySQL`);
      console.log(`🌐 API URL: http://localhost:${PORT}/api`);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use!`);
        console.error(`Please stop the process using port ${PORT} or change the PORT in .env`);
        process.exit(1);
      } else {
        console.error('❌ Server error:', error);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await sequelize.close();
  process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  // Don't exit in development to allow debugging
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error('❌ Port is already in use!');
    console.error(`Port ${err.port || PORT} is occupied by another process.`);
    console.error('\nTo fix this, run:');
    console.error(`  node kill-port.js ${err.port || PORT}`);
    console.error('Or manually:');
    console.error(`  netstat -ano | findstr :${err.port || PORT}`);
    console.error(`  taskkill /PID <PID> /F`);
  } else {
    console.error('❌ Uncaught Exception:', err);
  }
  process.exit(1);
});

// Start the server
startServer();

