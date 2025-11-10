const errorHandler = (err, req, res, next) => {
  // Log full error details in development
  if (process.env.NODE_ENV === 'development') {
    console.error('═══════════════════════════════════════');
    console.error('❌ ERROR DETAILS:');
    console.error('═══════════════════════════════════════');
    console.error('Error Name:', err.name);
    console.error('Error Message:', err.message);
    console.error('Error Stack:', err.stack);
    console.error('Request URL:', req.method, req.originalUrl);
    console.error('Request Body:', req.body);
    console.error('═══════════════════════════════════════');
  } else {
    console.error('Error:', err.message || err);
  }

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
    return res.status(400).json({
      message: 'Validation error',
      errors
    });
  }

  // Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    // Extract which field caused the duplicate error
    let field = 'record';
    
    // Try to get field from error errors array
    if (err.errors && err.errors.length > 0) {
      const errorItem = err.errors[0];
      // Check different possible properties
      field = errorItem.path || errorItem.column || errorItem.field || 'record';
      
      // If still PRIMARY, try to infer from error message or request
      if (field === 'PRIMARY' || field === 'id') {
        // Check if error message mentions email
        if (err.message && err.message.toLowerCase().includes('email')) {
          field = 'email';
        }
        // Check if this is a registration/login endpoint with email in body
        else if (req.body && req.body.email && 
                 (req.originalUrl.includes('/register') || req.originalUrl.includes('/login'))) {
          field = 'email';
        }
      }
    }
    
    // If still not found, check request body for email
    if ((field === 'PRIMARY' || field === 'id' || field === 'record') && req.body && req.body.email) {
      field = 'email';
    }
    
    // Generate user-friendly message
    let message = 'This record already exists.';
    
    if (field === 'email') {
      message = 'An account with this email already exists. Please use a different email or try logging in.';
    } else if (field && field !== 'PRIMARY' && field !== 'id' && field !== 'record') {
      message = `A record with this ${field} already exists. Please use a different ${field}.`;
    } else {
      // Default message for PRIMARY key or unknown fields
      if (req.body && req.body.email) {
        message = 'An account with this email already exists. Please use a different email or try logging in.';
        field = 'email';
      } else {
        message = 'This record already exists in the database.';
      }
    }
    
    console.error(`❌ Duplicate entry error`);
    console.error(`   Field detected: ${field}`);
    console.error(`   Error details:`, err.errors);
    if (req.body && req.body.email) {
      console.error(`   Attempted email: ${req.body.email}`);
    }
    
    return res.status(400).json({
      message: message,
      field: field,
      error: 'DUPLICATE_ENTRY'
    });
  }

  // Sequelize foreign key errors
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      message: 'Invalid reference. Related record does not exist.'
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token expired'
    });
  }

  // Database connection errors
  if (err.name === 'SequelizeConnectionError' || err.name === 'SequelizeConnectionRefusedError') {
    return res.status(503).json({
      message: 'Database connection failed. Please check your database configuration.',
      error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
  }

  // Database table/column errors
  if (err.name === 'SequelizeDatabaseError') {
    if (err.message && err.message.includes("doesn't exist")) {
      // Determine which table based on the error message or request URL
      let tableName = 'table';
      let hint = 'Please run the database migration script.';
      
      if (err.message.includes('services') || req.originalUrl.includes('/services')) {
        tableName = 'services';
        hint = 'Check database/services-table-xampp.sql or database/COMPLETE_SERVICES_TABLE_SETUP.sql';
      } else if (err.message.includes('resources') || req.originalUrl.includes('/resources')) {
        tableName = 'resources';
        hint = 'Check database/resources-table-setup.sql or database/COMPLETE_RESOURCES_TABLE_SETUP.sql';
      }
      
      return res.status(503).json({
        message: `${tableName.charAt(0).toUpperCase() + tableName.slice(1)} table does not exist. Please run the database migration script.`,
        error: process.env.NODE_ENV === 'development' ? err.message : {},
        hint: hint
      });
    } else if (err.message && err.message.includes("Unknown column")) {
      // Determine which table and column based on the error message or request URL
      let tableName = 'table';
      let hint = 'Please update the table structure.';
      
      if (err.message.includes('status') && (err.message.includes('resources') || req.originalUrl.includes('/resources'))) {
        hint = 'Check database/resources-table-setup.sql to add the status column';
      } else if (err.message.includes('image_url') && (err.message.includes('services') || req.originalUrl.includes('/services'))) {
        hint = 'Check database/ADD_IMAGE_URL_COLUMN.sql or database/COMPLETE_SERVICES_TABLE_SETUP.sql';
      } else if (req.originalUrl.includes('/resources')) {
        hint = 'Check database/COMPLETE_RESOURCES_TABLE_SETUP.sql';
      } else if (req.originalUrl.includes('/services')) {
        hint = 'Check database/COMPLETE_SERVICES_TABLE_SETUP.sql';
      }
      
      return res.status(500).json({
        message: 'Database schema mismatch. Please update the table structure.',
        error: process.env.NODE_ENV === 'development' ? err.message : {},
        hint: hint
      });
    }
  }

  // Missing environment variable errors
  if (err.message && err.message.includes('JWT_SECRET')) {
    return res.status(500).json({
      message: 'Server configuration error: JWT_SECRET is not set',
      error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
  }

  // Default error
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? {
      name: err.name,
      message: err.message,
      stack: err.stack
    } : {}
  });
};

module.exports = errorHandler;

