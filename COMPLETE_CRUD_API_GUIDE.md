# 🎯 Complete CRUD API Guide - UCAEP Backend

## ✅ All CRUD Operations Implemented

### 📊 **AUTHENTICATION** (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |
| PUT | `/api/auth/profile` | Update profile | ✅ |

---

### 👥 **PRODUCERS** (`/api/producers`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|--------------|------|
| GET | `/api/producers` | Get all approved producers | ❌ | - |
| GET | `/api/producers/:id` | Get single producer | ❌ | - |
| POST | `/api/producers` | **CREATE** new producer | ✅ | Producer/Admin |
| PUT | `/api/producers/:id` | **UPDATE** producer | ✅ | Owner/Admin |
| DELETE | `/api/producers/:id` | **DELETE** producer | ✅ | Owner/Admin |
| GET | `/api/producers/profile/me` | Get my producer profile | ✅ | Producer |
| GET | `/api/producers/admin/all` | Get all producers (admin) | ✅ | Admin |
| PATCH | `/api/producers/:id/status` | Update producer status | ✅ | Admin |

**Example CREATE:**
```json
POST /api/producers
{
  "businessName": "Green Farms",
  "businessType": "agriculture",
  "location": "Casablanca",
  "region": "Casablanca-Settat",
  "description": "Organic farm"
}
```

---

### 📰 **NEWS** (`/api/news`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|--------------|------|
| GET | `/api/news` | Get all published news | ❌ | - |
| GET | `/api/news/:id` | Get single news article | ❌ | - |
| POST | `/api/news` | **CREATE** news article | ✅ | Admin |
| PUT | `/api/news/:id` | **UPDATE** news article | ✅ | Admin |
| DELETE | `/api/news/:id` | **DELETE** news article | ✅ | Admin |
| GET | `/api/news/admin/all` | Get all news (admin) | ✅ | Admin |

**Example CREATE:**
```json
POST /api/news
{
  "title": "New Agricultural Program",
  "content": "Full article content here...",
  "category": "news",
  "status": "published"
}
```

---

### 🚀 **PROJECTS** (`/api/projects`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|--------------|------|
| GET | `/api/projects` | Get all projects | ❌ | - |
| GET | `/api/projects/:id` | Get single project | ❌ | - |
| POST | `/api/projects` | **CREATE** project | ✅ | Admin |
| PUT | `/api/projects/:id` | **UPDATE** project | ✅ | Admin |
| DELETE | `/api/projects/:id` | **DELETE** project | ✅ | Admin |
| GET | `/api/projects/admin/all` | Get all projects (admin) | ✅ | Admin |

**Example CREATE:**
```json
POST /api/projects
{
  "title": "Sustainable Farming Initiative",
  "description": "Project description...",
  "status": "active"
}
```

---

### 🤝 **PARTNERSHIPS** (`/api/partnerships`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|--------------|------|
| GET | `/api/partnerships` | Get all active partnerships | ❌ | - |
| GET | `/api/partnerships/:id` | Get single partnership | ❌ | - |
| POST | `/api/partnerships` | **CREATE** partnership | ✅ | Admin |
| PUT | `/api/partnerships/:id` | **UPDATE** partnership | ✅ | Admin |
| DELETE | `/api/partnerships/:id` | **DELETE** partnership | ✅ | Admin |
| GET | `/api/partnerships/admin/all` | Get all partnerships (admin) | ✅ | Admin |

---

### 📚 **RESOURCES** (`/api/resources`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|--------------|------|
| GET | `/api/resources` | Get all resources | ❌ | - |
| GET | `/api/resources/:id` | Get single resource | ❌ | - |
| POST | `/api/resources` | **CREATE** resource | ✅ | Admin |
| PUT | `/api/resources/:id` | **UPDATE** resource | ✅ | Admin |
| DELETE | `/api/resources/:id` | **DELETE** resource | ✅ | Admin |
| GET | `/api/resources/admin/all` | Get all resources (admin) | ✅ | Admin |
| GET | `/api/resources/admin/stats` | Get resource statistics | ✅ | Admin |

---

### 📧 **CONTACT MESSAGES** (`/api/contact`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|--------------|------|
| POST | `/api/contact` | **CREATE** contact message | ❌ | - |
| GET | `/api/contact` | Get all messages | ✅ | Admin |
| GET | `/api/contact/:id` | Get single message | ✅ | Admin |
| PATCH | `/api/contact/:id/status` | Update message status | ✅ | Admin |
| DELETE | `/api/contact/:id` | **DELETE** message | ✅ | Admin |
| GET | `/api/contact/stats` | Get message statistics | ✅ | Admin |

---

## 🔐 Authentication Header

For protected routes, include JWT token:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

**How to get token:**
```json
POST /api/auth/login
{
  "email": "admin@ucaep.com",
  "password": "admin123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

---

## 📝 Complete CRUD Examples

### CREATE (Insert)
```javascript
// Example: Create News
fetch('http://localhost:5000/api/news', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({
    title: 'New Article',
    content: 'Article content...',
    category: 'news',
    status: 'published'
  })
})
```

### READ (Get All)
```javascript
// Example: Get All Producers
fetch('http://localhost:5000/api/producers')
  .then(res => res.json())
  .then(data => console.log(data))
```

### READ (Get Single)
```javascript
// Example: Get Single News
fetch('http://localhost:5000/api/news/1')
  .then(res => res.json())
  .then(data => console.log(data))
```

### UPDATE (Edit)
```javascript
// Example: Update Producer
fetch('http://localhost:5000/api/producers/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({
    businessName: 'Updated Farm Name',
    location: 'New Location'
  })
})
```

### DELETE
```javascript
// Example: Delete News
fetch('http://localhost:5000/api/news/1', {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
})
```

---

## 🎯 Dashboard Admin Routes

All admin routes return full data with pagination:

- `GET /api/producers/admin/all` - All producers (pending, approved, rejected)
- `GET /api/news/admin/all` - All news (draft, published, archived)
- `GET /api/projects/admin/all` - All projects
- `GET /api/partnerships/admin/all` - All partnerships
- `GET /api/resources/admin/all` - All resources
- `GET /api/contact` - All contact messages
- `GET /api/contact/stats` - Message statistics
- `GET /api/resources/admin/stats` - Resource statistics

**Pagination Parameters:**
```
?page=1&limit=20&status=published&category=news
```

---

## ✅ All CRUD Operations Confirmed

- ✅ **CREATE** (POST) - All resources
- ✅ **READ** (GET) - All resources (single & list)
- ✅ **UPDATE** (PUT) - All resources
- ✅ **DELETE** (DELETE) - All resources
- ✅ **Pagination** - All list endpoints
- ✅ **Search/Filter** - Most endpoints
- ✅ **Authentication** - JWT-based
- ✅ **Authorization** - Role-based (Admin/Producer)

---

## 🌐 Base URL

- **Development:** `http://localhost:5000/api`
- **Health Check:** `http://localhost:5000/api/health`

---

**All CRUD operations are fully functional and ready for dashboard integration!** ✅

