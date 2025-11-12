const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Get backend URL from environment or default to localhost:5001
  const backendUrl = process.env.REACT_APP_API_URL 
    ? process.env.REACT_APP_API_URL.replace('/api', '')
    : 'http://localhost:5001';

  // Only proxy API requests, not static assets (images, favicon, etc.)
  app.use(
    '/api',
    createProxyMiddleware({
      target: backendUrl,
      changeOrigin: true,
      secure: false,
      logLevel: process.env.NODE_ENV === 'development' ? 'warn' : 'error',
      onError: (err, req, res) => {
        // Only log errors for API requests
        if (req.url && req.url.startsWith('/api')) {
          console.error('Proxy error for API request:', req.url, err.message);
        }
      },
      onProxyReq: (proxyReq, req, res) => {
        // Set proper headers
        proxyReq.setHeader('X-Forwarded-For', req.ip || req.connection.remoteAddress);
      }
    })
  );
};

