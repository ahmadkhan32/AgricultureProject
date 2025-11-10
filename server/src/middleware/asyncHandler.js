// Async error wrapper - catches errors from async route handlers
// Usage: wrap async route handlers with this middleware
// Example: router.get('/route', asyncHandler(async (req, res) => { ... }))

const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;

