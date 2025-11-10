const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
const imagesDir = path.join(uploadsDir, 'images');
const documentsDir = path.join(uploadsDir, 'documents');

[uploadsDir, imagesDir, documentsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage for images
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagesDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `${uniqueSuffix}-${name}${ext}`);
  }
});

// Storage for documents
const documentStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, documentsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `${uniqueSuffix}-${name}${ext}`);
  }
});

// File filter for images
const imageFileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Only ${allowedExtensions.join(', ')} are allowed.`), false);
  }
};

// File filter for documents/resources
const documentFileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.csv', '.zip', '.rar'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Only ${allowedExtensions.join(', ')} are allowed.`), false);
  }
};

// Configure multer for images
const upload = multer({
  storage: imageStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max file size
  }
});

// Configure multer for documents/resources
const uploadDocument = multer({
  storage: documentStorage,
  fileFilter: documentFileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max file size for documents
  }
});

// Check if file already exists
const checkFileExists = (filename) => {
  const imagePath = path.join(imagesDir, filename);
  const documentPath = path.join(documentsDir, filename);
  return fs.existsSync(imagePath) || fs.existsSync(documentPath);
};

module.exports = {
  upload,
  uploadDocument,
  checkFileExists,
  imagesDir,
  documentsDir
};

