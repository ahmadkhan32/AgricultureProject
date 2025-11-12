const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Get backend URL from environment or default to localhost:5000
  const backendUrl = process.env.REACT_APP_API_URL 
    ? process.env.REACT_APP_API_URL.replace('/api', '').replace(/\/$/, '')
    : 'http://localhost:5000';

  // Only proxy API requests, not static assets (images, favicon, etc.)
  // Use explicit path matching to ensure only /api requests are proxied
  app.use(
    '/api',
    createProxyMiddleware({
      target: backendUrl,
      changeOrigin: true,
      secure: false,
      logLevel: 'silent', // Suppress all proxy errors
      ws: false, // Disable websocket proxying
      onError: (err, req, res) => {
        // Completely suppress error logging
        // The frontend will handle API errors appropriately
        return;
      },
      onProxyReq: (proxyReq, req, res) => {
        // Set proper headers
        proxyReq.setHeader('X-Forwarded-For', req.ip || req.connection.remoteAddress);
      },
      // Ignore errors for non-critical requests
      ignorePath: false,
    })
  );
};

