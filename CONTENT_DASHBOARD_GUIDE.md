# Content Dashboard - Generate, Save & Display Guide

## 🎯 Overview
This guide shows you how to generate content using AI, save it to the database, and display it on the Services page.

## 🚀 Step-by-Step Process

### 1. Access the Content Dashboard
- Navigate to: http://localhost:3000/content-dashboard
- The page is now running in your browser

### 2. Generate Content

#### A. Select Content Type
- Click on "Services" tab (default) to generate service content
- Click on "Producteurs" tab to generate producer content

#### B. Enter Your Prompt
In the text area, describe what you want to create, for example:
```
Create a service for agricultural training on organic farming techniques for local farmers in Comoros
```

#### C. Upload Image (Optional)
- You can either:
  - Type an image filename or URL in the text field
  - OR click "Upload" button to select an image file

#### D. Generate Content
- Click the "Générer le Contenu" (Generate Content) button
- Wait for AI to generate the content (may take a few seconds)

### 3. Review Generated Content
- The preview will show:
  - **Title**: The service/producer title
  - **Description**: Detailed description
  - **Category**: Content category
  - **Location**: Location information (for producers)

### 4. Save Content
- Click the "Sauvegarder" (Save) button
- Content will be saved to:
  - **Primary**: Supabase database (cloud storage)
  - **Fallback**: Local storage (if database unavailable)
- You'll see a success message: "Contenu sauvegardé avec succès!"

### 5. View Saved Content

#### Option 1: In Content Dashboard
- Your saved content appears in the right panel "Contenu Sauvegardé"
- Shows a list of all saved services/producers
- You can preview or delete from here

#### Option 2: On Services Page
- Navigate to: http://localhost:3000/services
- Your generated content appears alongside the static services
- Click "Read More" to see full details

## 🔄 Complete Workflow

```
1. Content Dashboard → Generate Content
2. Review Generated Content
3. Save Content → Database/Local Storage
4. Services Page → Display Saved Content
5. Click "Read More" → See Full Details
```

## 📝 Example Prompts

### For Services:
```
- "Create a service for agricultural consulting and technical support"
- "Generate a service for livestock vaccination programs"
- "Make a service for sustainable fishing practices training"
```

### For Producers:
```
- "Create a producer profile for an organic vanilla farmer in Grande Comore"
- "Generate a producer profile for a poultry farmer in Anjouan"
- "Make a producer profile for a fisheries operation in Moheli"
```

## 💡 Features

### AI Generation
- ✓ Automatic content generation based on prompts
- ✓ Smart categorization
- ✓ Image suggestion
- ✓ Rich content structure

### Storage
- ✓ Database storage (Supabase)
- ✓ Image upload to bucket
- ✓ Local storage fallback
- ✓ Real-time updates

### Display
- ✓ Automatic loading on Services page
- ✓ Search and filter support
- ✓ Read more modal
- ✓ Responsive design

## 🛠️ Technical Details

### Save Process
1. **Database Save** (Primary):
   - Content saved to Supabase `services` or `producers` table
   - Images uploaded to `agricul-images` bucket
   - Returns database record with ID

2. **Local Storage** (Fallback):
   - Saves to browser localStorage
   - Used if database unavailable
   - Marked with `isLocal: true` flag

### Display Process
1. Services page loads all content using `getAllServices()`
2. Merges database records + local storage records
3. Displays in grid layout with search/filter
4. Modal shows full details when "Read More" clicked

## 🎨 Content Structure

### Service Object:
```javascript
{
  id: "uuid or timestamp",
  title: "Service Title",
  description: "Detailed description",
  category: "service category",
  image: "image URL or path",
  content: "Full content text",
  tags: ["tag1", "tag2"],
  status: "published",
  created_at: "timestamp"
}
```

### Producer Object:
```javascript
{
  id: "uuid or timestamp",
  name: "Producer Name",
  business_name: "Business Name",
  business_type: "agriculture/livestock/fisheries/mixed",
  description: "Description",
  region: "Comoros region",
  products: ["product1", "product2"],
  image: "image URL or path",
  status: "approved",
  created_at: "timestamp"
}
```

## 🐛 Troubleshooting

### Content Not Appearing on Services Page
1. Refresh the Services page
2. Check browser console for errors
3. Verify content was saved successfully
4. Check if database connection is active

### Save Failed
1. Try again with shorter content
2. Check internet connection
3. Verify Supabase credentials
4. System will auto-fallback to local storage

### Image Not Uploading
1. Check file size (should be < 10MB)
2. Verify file format (jpg, png, etc.)
3. Check bucket permissions in Supabase
4. Fallback: use image URL instead of file upload

## ✨ Best Practices

1. **Clear Prompts**: Write specific, detailed prompts for better results
2. **Image Selection**: Choose relevant images for better appearance
3. **Review Before Save**: Always check generated content before saving
4. **Regular Backups**: Content is automatically saved to database
5. **Testing**: Test with simple content first before complex entries

---

**Enjoy creating content with AI! 🚀**
