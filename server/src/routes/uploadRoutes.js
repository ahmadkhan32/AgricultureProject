const express = require('express');
const router = express.Router();
const { upload, uploadDocument } = require('../middleware/upload');
const path = require('path');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// Upload single image (for producer images, etc.)
router.post('/image', authenticateToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Generate full URL to access the file
    const baseUrl = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    const relativePath = `/uploads/images/${req.file.filename}`;
    const fullUrl = `${baseUrl}${relativePath}`;
    
    res.json({
      message: 'Image uploaded successfully',
      url: fullUrl,
      relativeUrl: relativePath, // Also return relative for flexibility
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// Upload multiple images
router.post('/images', authenticateToken, upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const baseUrl = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    const uploadedFiles = req.files.map(file => ({
      url: `${baseUrl}/uploads/images/${file.filename}`,
      relativeUrl: `/uploads/images/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    }));
    
    res.json({
      message: `${uploadedFiles.length} image(s) uploaded successfully`,
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// General file upload endpoint (for resources/documents)
// Use query parameter or body type to determine upload type
router.post('/', authenticateToken, (req, res, next) => {
  // Get type from query parameter (preferred) or body
  const uploadType = req.query.type || req.body.type || 'file';
  
  // Use document upload for resources, image upload for others
  const uploadMiddleware = uploadType === 'resources' ? uploadDocument.single('file') : upload.single('file');
  
  uploadMiddleware(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ message: 'Upload failed', error: err.message });
    }
    
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Determine the directory based on upload type
      const subDir = uploadType === 'resources' ? 'documents' : 'images';
      const baseUrl = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
      const relativePath = `/uploads/${subDir}/${req.file.filename}`;
      const fullUrl = `${baseUrl}${relativePath}`;
      
      console.log(`✅ File uploaded: ${req.file.originalname} -> ${fullUrl}`);
      
      res.json({
        message: 'File uploaded successfully',
        url: fullUrl,
        relativeUrl: relativePath,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        type: uploadType
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: 'Upload failed', error: error.message });
    }
  });
});

module.exports = router;

