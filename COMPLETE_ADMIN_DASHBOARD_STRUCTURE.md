# 📁 Complete Admin Dashboard File Structure

## 🎯 **Overview**

Complete file structure for Admin Dashboard with Frontend and Backend implementation.

---

## 📂 **Backend Structure**

```
server/
├── src/
│   ├── app.js                           # Main Express app (mounts routes)
│   │
│   ├── config/
│   │   └── db.js                        # Database connection (Sequelize)
│   │
│   ├── models/                          # Sequelize Models (Database Tables)
│   │   ├── index.js                     # Models initialization
│   │   ├── User.js                      # Users table
│   │   ├── News.js                      # News table
│   │   ├── Producer.js                  # Producers table
│   │   ├── Service.js                   # Services table
│   │   ├── Resource.js                  # Resources table
│   │   ├── Event.js                     # Events table
│   │   ├── Partnership.js               # Partnerships table
│   │   ├── Message.js                   # Messages table
│   │   └── Project.js                   # Projects table
│   │
│   ├── controllers/                     # Business Logic (CRUD Operations)
│   │   ├── authController.js           # Authentication (register, login)
│   │   ├── newsController.js            # News CRUD
│   │   ├── producerController.js       # Producer CRUD
│   │   ├── serviceController.js         # Service CRUD
│   │   ├── resourceController.js       # Resource CRUD
│   │   ├── eventController.js          # Event CRUD
│   │   ├── partnershipController.js    # Partnership CRUD
│   │   ├── contactController.js         # Contact/Messages CRUD
│   │   └── projectController.js        # Project CRUD
│   │
│   ├── routes/                          # API Routes (Endpoints)
│   │   ├── authRoutes.js                # /api/auth/*
│   │   ├── newsRoutes.js                # /api/news/*
│   │   ├── producerRoutes.js            # /api/producers/*
│   │   ├── serviceRoutes.js              # /api/services/*
│   │   ├── resourceRoutes.js             # /api/resources/*
│   │   ├── eventRoutes.js               # /api/events/*
│   │   ├── partnershipRoutes.js          # /api/partnerships/*
│   │   ├── contactRoutes.js              # /api/contact/*
│   │   ├── projectRoutes.js              # /api/projects/*
│   │   └── uploadRoutes.js              # /api/upload/*
│   │
│   ├── middleware/                      # Middleware Functions
│   │   ├── authMiddleware.js            # JWT authentication
│   │   ├── errorHandler.js              # Error handling
│   │   ├── upload.js                    # File upload (multer)
│   │   └── asyncHandler.js               # Async error wrapper
│   │
│   ├── utils/                           # Utility Functions
│   │   ├── emailService.js              # Email sending
│   │   ├── socketEmitter.js             # Socket.io emitter
│   │   └── eventProducer.js             # Event producer
│   │
│   ├── socket/                          # Socket.io
│   │   └── socketHandler.js             # Socket.io handlers
│   │
│   └── server.js                        # Server startup
│
├── uploads/                             # Uploaded Files
│   ├── images/                          # Uploaded images
│   ├── documents/                       # Uploaded documents
│   └── thumbnails/                      # Generated thumbnails
│
├── .env                                 # Environment variables
├── package.json                         # Dependencies
└── test-db-connection.js                # Database connection test
```

---

## 📂 **Frontend Structure**

```
client/
├── src/
│   ├── App.js                           # Main router (routes setup)
│   │
│   ├── pages/                           # Page Components
│   │   ├── Home.js                      # Home page
│   │   ├── News.js                      # News listing (public)
│   │   ├── NewsDetail.js                # News detail page
│   │   ├── Producers.js                 # Producers listing (public)
│   │   ├── ProducerDetail.js           # Producer detail page
│   │   ├── Services.js                  # Services listing (public)
│   │   ├── Resources.js                 # Resources listing (public)
│   │   ├── Events.js                    # Events listing (public)
│   │   ├── Contact.js                   # Contact page
│   │   │
│   │   ├── Auth/                        # Authentication Pages
│   │   │   ├── Login.js                 # Login page
│   │   │   ├── Register.js              # Register page
│   │   │   └── ProducerRegistration.js  # Producer registration
│   │   │
│   │   └── Admin/                       # Admin Pages
│   │       └── AdminDashboard.js        # Admin dashboard (routes)
│   │
│   ├── components/                      # Reusable Components
│   │   ├── Layout/                      # Layout Components
│   │   │   ├── Header.js                # Site header
│   │   │   ├── Footer.js                # Site footer
│   │   │   └── Navbar.js                # Navigation bar
│   │   │
│   │   └── Admin/                       # Admin Components
│   │       ├── AdminSidebar.js          # Admin sidebar navigation
│   │       ├── AdminHeader.js           # Admin header
│   │       ├── DashboardOverview.js     # Dashboard overview
│   │       │
│   │       ├── NewsManagement.js        # News CRUD management
│   │       ├── NewsForm.js              # News create/edit form
│   │       │
│   │       ├── ProducersManagement.js   # Producers CRUD management
│   │       ├── ProducerForm.js          # Producer create/edit form
│   │       │
│   │       ├── ServicesManagement.js   # Services CRUD management
│   │       ├── ServiceForm.js           # Service create/edit form
│   │       │
│   │       ├── ResourcesManagement.js  # Resources CRUD management
│   │       ├── ResourceForm.js         # Resource create/edit form
│   │       │
│   │       ├── EventsManagement.js      # Events CRUD management
│   │       ├── EventForm.js             # Event create/edit form
│   │       │
│   │       ├── PartnershipsManagement.js # Partnerships CRUD
│   │       ├── PartnershipForm.js       # Partnership create/edit form
│   │       │
│   │       ├── UsersManagement.js       # Users CRUD management
│   │       ├── MessagesManagement.js    # Messages management
│   │       │
│   │       └── DataPopulator.js         # Data population tool
│   │
│   ├── services/                        # API Services
│   │   ├── api.js                       # Axios HTTP client
│   │   ├── crudService.js               # CRUD wrapper service
│   │   ├── resourceService.js           # Resource-specific service
│   │   ├── socketService.js             # Socket.io service
│   │   └── enhancedCrudService.js       # Enhanced CRUD service
│   │
│   ├── contexts/                        # React Contexts
│   │   ├── AuthContext.js               # Authentication context
│   │   └── ThemeContext.js              # Theme context (if needed)
│   │
│   ├── utils/                           # Utility Functions
│   │   ├── constants.js                 # Constants
│   │   ├── helpers.js                   # Helper functions
│   │   └── formatters.js                # Data formatters
│   │
│   └── styles/                          # Styles
│       └── globals.css                   # Global styles
│
├── public/                              # Static Files
│   ├── Images/                          # Static images
│   └── index.html                       # HTML template
│
├── .env                                 # Environment variables
└── package.json                         # Dependencies
```

---

## 🔗 **Route Mapping**

### **Backend Routes (API Endpoints)**

```
/api/auth/
  ├── POST /register         → authController.register
  ├── POST /login            → authController.login
  └── GET /me                → authController.getMe

/api/news/
  ├── GET /                  → newsController.getAll
  ├── GET /:id               → newsController.getById
  ├── POST /                 → newsController.create (Admin)
  ├── PUT /:id               → newsController.update (Admin)
  └── DELETE /:id            → newsController.delete (Admin)

/api/producers/
  ├── GET /                  → producerController.getAll
  ├── GET /:id               → producerController.getById
  ├── POST /                 → producerController.create (Auth)
  ├── PUT /:id               → producerController.update (Auth)
  └── DELETE /:id            → producerController.delete (Auth)

/api/services/
  ├── GET /                  → serviceController.getAll
  ├── GET /:id               → serviceController.getById
  ├── POST /                 → serviceController.create (Admin)
  ├── PUT /:id               → serviceController.update (Admin)
  └── DELETE /:id            → serviceController.delete (Admin)

/api/resources/
  ├── GET /                  → resourceController.getAll
  ├── GET /:id               → resourceController.getById
  ├── POST /                 → resourceController.create (Auth)
  ├── PUT /:id               → resourceController.update (Auth)
  └── DELETE /:id            → resourceController.delete (Auth)

/api/events/
  ├── GET /                  → eventController.getAll
  ├── GET /:id               → eventController.getById
  ├── POST /                 → eventController.create (Admin)
  ├── PUT /:id               → eventController.update (Admin)
  └── DELETE /:id            → eventController.delete (Admin)

/api/upload/
  ├── POST /image            → Upload single image
  └── POST /images           → Upload multiple images
```

### **Frontend Routes**

```
/                           → Home page
/news                       → News listing (public)
/news/:id                  → News detail
/producers                  → Producers listing (public)
/producers/:id              → Producer detail
/services                   → Services listing (public)
/resources                  → Resources listing (public)
/events                     → Events listing (public)
/contact                    → Contact page

/auth/login                → Login page
/auth/register             → Register page
/producer/register          → Producer registration

/admin                      → Admin dashboard (overview)
/admin/news                 → News management
/admin/producers            → Producers management
/admin/services             → Services management
/admin/resources            → Resources management
/admin/events               → Events management
/admin/partnerships         → Partnerships management
/admin/users                → Users management
/admin/messages             → Messages management
```

---

## 📋 **File Responsibilities**

### **Backend Files**

| File | Purpose |
|------|---------|
| `models/Model.js` | Database table structure (Sequelize) |
| `controllers/controller.js` | Business logic, CRUD operations |
| `routes/route.js` | API endpoints, route handlers |
| `middleware/authMiddleware.js` | JWT authentication |
| `middleware/upload.js` | File upload handling |
| `config/db.js` | Database connection |
| `app.js` | Express app setup, route mounting |

### **Frontend Files**

| File | Purpose |
|------|---------|
| `pages/Page.js` | Public page component |
| `components/Admin/Management.js` | Admin CRUD management component |
| `components/Admin/Form.js` | Create/edit form component |
| `services/api.js` | HTTP client (axios) |
| `services/crudService.js` | CRUD wrapper service |
| `contexts/AuthContext.js` | Authentication state management |
| `App.js` | Main router configuration |

---

## 🔄 **Data Flow Example**

### **Example: Creating News Article**

```
1. User fills form in NewsForm.js
   ↓
2. Form submits → NewsManagement.js
   ↓
3. Calls crudService.news.create(data)
   ↓
4. crudService calls api.js → createNews(data)
   ↓
5. API makes POST request → /api/news
   ↓
6. Backend route → newsRoutes.js
   ↓
7. Middleware → authenticateToken (checks JWT)
   ↓
8. Controller → newsController.create()
   ↓
9. Validates data → Joi schema
   ↓
10. Saves to database → News.create()
    ↓
11. Returns response → { news: {...} }
    ↓
12. Frontend receives response
    ↓
13. React Query updates cache
    ↓
14. UI updates automatically
```

---

## ✅ **Implementation Checklist**

### **For Each New Feature:**

**Backend:**
- [ ] Create database table in phpMyAdmin
- [ ] Create Sequelize model
- [ ] Create controller with CRUD methods
- [ ] Create routes
- [ ] Register routes in app.js
- [ ] Test API endpoints (Postman/curl)

**Frontend:**
- [ ] Add API functions in api.js
- [ ] Add CRUD service in crudService.js
- [ ] Create public page component (if needed)
- [ ] Create admin management component
- [ ] Create form component
- [ ] Add route to AdminDashboard.js
- [ ] Test all CRUD operations

---

## 🎯 **Quick Reference**

**To add a new feature (e.g., "Products"):**

1. **Database:** Create `products` table in phpMyAdmin
2. **Model:** `server/src/models/Product.js`
3. **Controller:** `server/src/controllers/productController.js`
4. **Routes:** `server/src/routes/productRoutes.js`
5. **Register:** Add to `server/src/app.js`
6. **API Service:** Add functions to `client/src/services/api.js`
7. **CRUD Service:** Add to `client/src/services/crudService.js`
8. **Admin Component:** `client/src/components/Admin/ProductsManagement.js`
9. **Form Component:** `client/src/components/Admin/ProductsForm.js`
10. **Route:** Add to `client/src/pages/Admin/AdminDashboard.js`

---

This is the complete structure! Use it as a reference for all admin dashboard features. 🚀

