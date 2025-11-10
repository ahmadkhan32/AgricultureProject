# 📊 Complete Data Flow: Backend to Frontend

## 🗂️ File Structure

### **Backend Structure**
```
server/
├── src/
│   ├── app.js                    # Main Express app, routes setup
│   ├── index.js                  # Server entry point
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── models/
│   │   └── News.js               # Sequelize model (database schema)
│   ├── controllers/
│   │   └── newsController.js     # Business logic & API responses
│   ├── routes/
│   │   └── newsRoutes.js         # API endpoint definitions
│   ├── middleware/
│   │   ├── authMiddleware.js     # Authentication
│   │   └── upload.js             # File upload handling
│   └── uploads/
│       └── images/               # Uploaded image files
└── package.json
```

### **Frontend Structure**
```
client/
├── src/
│   ├── App.js                    # Main app, routing
│   ├── pages/
│   │   ├── News.js               # News listing page (PROBLEM HERE!)
│   │   └── NewsDetail.js         # Single news article page
│   ├── services/
│   │   ├── api.js                # Axios HTTP client
│   │   └── crudService.js        # CRUD operations wrapper
│   ├── components/
│   │   └── Admin/
│   │       └── NewsManagement.js # Admin news management
│   └── contexts/
│       └── AuthContext.js         # Authentication context
└── package.json
```

---

## 🔄 Complete Data Flow (Step-by-Step)

### **Step 1: Database (MySQL)**
```
Database: ucaep_db
Table: news
Columns:
  - id (INT)
  - title (VARCHAR)
  - content (TEXT)
  - image_url (VARCHAR) ← snake_case in DB
  - category (ENUM)
  - status (ENUM)
  - published_at (TIMESTAMP)
  - created_at (TIMESTAMP)
  - updated_at (TIMESTAMP)
```

### **Step 2: Sequelize Model** (`server/src/models/News.js`)
```javascript
// Maps database snake_case to JavaScript camelCase
const News = sequelize.define('News', {
  imageUrl: {
    type: DataTypes.STRING(500),
    field: 'image_url'  // Maps to DB column
  },
  publishedAt: {
    type: DataTypes.DATE,
    field: 'published_at'
  },
  // ...
});
```

**What happens:**
- Database stores: `image_url` (snake_case)
- Sequelize converts to: `imageUrl` (camelCase) when reading
- Sequelize converts back to: `image_url` when writing

### **Step 3: Controller** (`server/src/controllers/newsController.js`)
```javascript
exports.getAll = async (req, res) => {
  // 1. Fetch from database using Sequelize
  const { count, rows } = await News.findAndCountAll({...});
  
  // 2. Convert to JSON (camelCase)
  const newsData = newsItem.toJSON();
  // Result: { id, title, imageUrl, publishedAt, ... }
  
  // 3. Convert relative URLs to absolute
  if (newsData.imageUrl && newsData.imageUrl.startsWith('/uploads/')) {
    newsData.imageUrl = `${baseUrl}${newsData.imageUrl}`;
  }
  
  // 4. Send response
  res.json({
    news: newsWithAbsoluteUrls,  // ← Array of news items
    pagination: {...}
  });
};
```

**Response Format:**
```json
{
  "news": [
    {
      "id": 1,
      "title": "News Title",
      "content": "News content...",
      "imageUrl": "http://localhost:5000/uploads/images/file.jpg",
      "publishedAt": "2025-01-15T10:30:00.000Z",
      "category": "news",
      "status": "published"
    }
  ],
  "pagination": {...}
}
```

### **Step 4: API Routes** (`server/src/routes/newsRoutes.js`)
```javascript
router.get('/', newsController.getAll);
// Endpoint: GET /api/news
```

### **Step 5: Frontend API Service** (`client/src/services/api.js`)
```javascript
export const fetchNews = async (params = {}) => {
  const response = await api.get('/news', { params });
  // api.get() → http://localhost:5000/api/news
  return response.data;  // Returns: { news: [...], pagination: {...} }
};
```

### **Step 6: Frontend Component** (`client/src/pages/News.js`)
```javascript
useEffect(() => {
  const loadNews = async () => {
    // 1. Call API service
    const response = await fetchNews({ status: 'published' });
    // Response: { news: [...], pagination: {...} }
    
    // 2. Transform data
    const transformedNews = response.news.map((article) => ({
      id: article.id,
      title: article.title,
      image: article.image_url || getDefaultImage(...),  // ❌ ERROR HERE!
      // Should be: article.imageUrl
    }));
    
    // 3. Set state
    setNewsData(transformedNews);
  };
  loadNews();
}, []);
```

---

## ❌ **THE PROBLEM**

### **Field Name Mismatch:**

**Backend returns (camelCase):**
```json
{
  "imageUrl": "http://localhost:5000/uploads/images/file.jpg",
  "publishedAt": "2025-01-15T10:30:00.000Z"
}
```

**Frontend expects (snake_case):**
```javascript
article.image_url   // ❌ undefined (doesn't exist)
article.published_at  // ❌ undefined (doesn't exist)
```

**Result:**
- Images don't display (undefined)
- Dates don't show (undefined)
- Data appears but fields are missing

---

## ✅ **THE FIX**

Change `client/src/pages/News.js` to use camelCase:

```javascript
// BEFORE (❌ Wrong):
image: article.image_url || getDefaultImage(...),
date: new Date(article.published_at || article.created_at)

// AFTER (✅ Correct):
image: article.imageUrl || getDefaultImage(...),
date: new Date(article.publishedAt || article.createdAt)
```

---

## 🔍 **Complete Field Mapping**

| Database Column | Sequelize Model | API Response | Frontend Should Use |
|----------------|-----------------|--------------|---------------------|
| `image_url` | `imageUrl` | `imageUrl` | `article.imageUrl` ✅ |
| `published_at` | `publishedAt` | `publishedAt` | `article.publishedAt` ✅ |
| `created_at` | `createdAt` | `createdAt` | `article.createdAt` ✅ |
| `updated_at` | `updatedAt` | `updatedAt` | `article.updatedAt` ✅ |
| `author_id` | `authorId` | `authorId` | `article.authorId` ✅ |
| `title` | `title` | `title` | `article.title` ✅ |
| `content` | `content` | `content` | `article.content` ✅ |
| `excerpt` | `excerpt` | `excerpt` | `article.excerpt` ✅ |
| `category` | `category` | `category` | `article.category` ✅ |
| `status` | `status` | `status` | `article.status` ✅ |

---

## 📝 **Complete Data Flow Diagram**

```
┌─────────────────┐
│   MySQL Database│
│   (snake_case)  │
│  image_url      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Sequelize Model │
│  (camelCase)    │
│  imageUrl       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Controller    │
│  Converts URLs  │
│  Returns JSON   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  API Route      │
│  /api/news      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Frontend API   │
│  fetchNews()    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  News.js Page   │
│  ❌ image_url   │ ← PROBLEM!
│  ✅ imageUrl    │ ← FIX!
└─────────────────┘
```

---

## 🛠️ **How to Fix**

1. **Fix field names in News.js**
2. **Check console for errors**
3. **Verify API response format**
4. **Test with published news**

---

## 🧪 **Testing Steps**

1. **Insert data via backend:**
   ```bash
   POST http://localhost:5000/api/news
   {
     "title": "Test News",
     "content": "Test content...",
     "status": "published",
     "imageUrl": "/uploads/images/test.jpg"
   }
   ```

2. **Check API response:**
   ```bash
   GET http://localhost:5000/api/news
   # Should return: { news: [{ imageUrl: "...", ... }] }
   ```

3. **Check frontend:**
   - Open browser console
   - Check Network tab
   - Verify response has `imageUrl` (not `image_url`)
   - Check if News.js uses correct field name

---

## 📋 **Checklist**

- [ ] Backend returns camelCase (`imageUrl`)
- [ ] Frontend uses camelCase (`article.imageUrl`)
- [ ] Database has data
- [ ] News status is "published"
- [ ] API endpoint is correct (`/api/news`)
- [ ] CORS is configured
- [ ] Backend server is running
- [ ] Frontend can connect to backend

