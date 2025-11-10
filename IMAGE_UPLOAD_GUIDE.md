# 📸 Image Upload System - Complete Guide

## ✅ Features Implemented

### Backend
- ✅ File upload endpoint at `/api/upload/image`
- ✅ Support for multiple image formats: `.jpg`, `.jpeg`, `.png`, `.gif`, `.svg`, `.webp`
- ✅ Maximum file size: 10MB
- ✅ Automatic unique filename generation (timestamp + random + sanitized original name)
- ✅ Static file serving from `/uploads/images/` directory
- ✅ Image URLs automatically converted to full URLs when saved to database
- ✅ Duplicate file checking capability

### Frontend
- ✅ File upload UI in ProducerForm component
- ✅ Image preview before upload
- ✅ Drag and drop support (via file input)
- ✅ URL input fallback option
- ✅ Image validation (type and size)
- ✅ Display in Producers.js page with error fallback
- ✅ Works from ProducerManagement (Admin panel)

## 🚀 How to Use

### 1. Upload Image from Producer Management

1. Navigate to Admin → Producer Management
2. Click "Add New Producer" or edit an existing producer
3. Scroll to "Producer Image" section
4. **Option A: Upload File**
   - Click the upload area or drag & drop an image
   - Select image (JPEG, PNG, GIF, SVG, WebP - Max 10MB)
   - Image will be previewed automatically
   - Upload happens automatically when form is submitted

5. **Option B: Use URL**
   - Enter image URL in the URL input field
   - Image will be previewed automatically

### 2. Image Display

- Images uploaded via file upload are automatically displayed in:
  - Producer list page (`/producers`)
  - Producer detail modal
  - Producer profile page

- If image fails to load, falls back to default image based on business type

## 📁 File Structure

```
server/
  ├── src/
  │   ├── middleware/
  │   │   └── upload.js          # Multer configuration
  │   ├── routes/
  │   │   └── uploadRoutes.js   # Upload endpoints
  │   └── controllers/
  │       └── producerController.js  # Updated to handle image URLs
  └── uploads/
      └── images/                # Stored images (auto-created)

client/
  ├── src/
  │   ├── components/
  │   │   └── Admin/
  │   │       └── ProducerForm.js   # Image upload UI
  │   └── pages/
  │       └── Producers.js          # Image display
```

## 🔧 Technical Details

### Backend Upload Endpoint

**POST** `/api/upload/image`
- **Authentication**: Required (Bearer token)
- **Content-Type**: `multipart/form-data`
- **Body**: `image` (file)
- **Response**: 
  ```json
  {
    "message": "Image uploaded successfully",
    "url": "/uploads/images/1234567890-filename.jpg",
    "filename": "1234567890-filename.jpg",
    "originalName": "my-image.jpg",
    "size": 123456,
    "mimetype": "image/jpeg"
  }
  ```

### Image URL Format

- Relative URLs: `/uploads/images/filename.jpg`
- Automatically converted to full URLs when saved: `http://localhost:5000/uploads/images/filename.jpg`

### Supported Formats

- `.jpg` / `.jpeg` - JPEG images
- `.png` - PNG images  
- `.gif` - GIF images
- `.svg` - SVG vector images
- `.webp` - WebP images

### File Size Limit

- Maximum: 10MB per file
- Validation happens both client-side and server-side

## 🔒 Security Features

1. **File Type Validation**: Only allowed image types accepted
2. **File Size Limit**: Prevents server overload
3. **Authentication Required**: Only logged-in users can upload
4. **Unique Filenames**: Prevents filename conflicts
5. **Sanitized Filenames**: Removes special characters

## 🐛 Troubleshooting

### Images Not Displaying

1. **Check backend is running**: `http://localhost:5000/api/health`
2. **Check upload directory exists**: `server/uploads/images/`
3. **Check file permissions**: Ensure server can write to uploads directory
4. **Check CORS**: If accessing from different domain
5. **Check image URL format**: Should be full URL or relative to backend

### Upload Fails

1. **Check file size**: Must be < 10MB
2. **Check file type**: Only image formats allowed
3. **Check authentication**: Must be logged in
4. **Check network**: Backend must be accessible
5. **Check console**: Browser console shows detailed errors

### Images Not Saving to Database

1. **Check producer update**: Image URL should be in `image` field
2. **Check database field**: Ensure `image` column exists in `producers` table
3. **Check validation**: Joi schema allows `image` as optional URI

## 📝 Database Schema

Ensure your `producers` table has:
```sql
image VARCHAR(500) NULL  -- Stores image URL
```

## 🔄 Duplicate Prevention

The system generates unique filenames using:
- Timestamp: `Date.now()`
- Random number: `Math.round(Math.random() * 1E9)`
- Sanitized original name: Removed special characters

This ensures no duplicates even if same file is uploaded multiple times.

## 🌐 Production Deployment

### Environment Variables

Add to `server/.env`:
```
API_BASE_URL=https://your-backend-url.com
PORT=5000
```

### Static File Serving

In production, you may want to:
1. Use CDN for images (Cloudinary, AWS S3, etc.)
2. Use object storage instead of local filesystem
3. Configure reverse proxy (nginx) to serve static files

### Example Production Setup

```javascript
// Use environment variable for base URL
const baseUrl = process.env.API_BASE_URL || 'http://localhost:5000';
```

## ✅ Testing Checklist

- [ ] Upload JPEG image
- [ ] Upload PNG image  
- [ ] Upload SVG image
- [ ] Upload large image (>5MB)
- [ ] Try invalid file type (should reject)
- [ ] Try file > 10MB (should reject)
- [ ] Upload and verify display in Producers page
- [ ] Edit producer and change image
- [ ] Use URL instead of file upload
- [ ] Verify image persists after page refresh

