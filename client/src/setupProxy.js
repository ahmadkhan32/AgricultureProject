const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Get backend URL from environment or default to localhost:5000
  const backendUrl = process.env.REACT_APP_API_URL 
    ? process.env.REACT_APP_API_URL.replace('/api', '')
    : 'http://localhost:5000';

  // Only proxy API requests, not static assets (images, favicon, etc.)
  // Use pathFilter to ensure only /api requests are proxied
  app.use(
    createProxyMiddleware({
      target: backendUrl,
      changeOrigin: true,
      secure: false,
      logLevel: 'silent', // Suppress proxy errors in console
      pathFilter: (pathname, req) => {
        // Only proxy requests that start with /api
        return pathname.startsWith('/api');
      },
      onError: (err, req, res) => {
        // Silently handle errors - don't log proxy errors
        // The frontend will handle API errors appropriately
        // Only log in development for debugging
        if (process.env.NODE_ENV === 'development' && req.url && req.url.startsWith('/api')) {
          // Suppress the error - backend might not be running
          // This is normal in development when backend is not started
        }
      },
      onProxyReq: (proxyReq, req, res) => {
        // Set proper headers
        proxyReq.setHeader('X-Forwarded-For', req.ip || req.connection.remoteAddress);
      }
    })
  );
};

