# Complete Admin Dashboard File Structure

## 📁 Backend Files for Admin Dashboard

### Controllers
```
server/src/controllers/
├── dashboardController.js      # Dashboard statistics and analytics
├── authController.js          # Admin authentication
├── userController.js          # User management (CRUD)
├── producerController.js      # Producer management
├── newsController.js          # News management
├── resourceController.js      # Resource management
├── projectController.js       # Project management
├── partnershipController.js   # Partnership management
└── messageController.js      # Message management
```

### Routes
```
server/src/routes/
├── dashboardRoutes.js        # /api/dashboard/*
├── adminRoutes.js            # /api/admin/*
├── userRoutes.js             # /api/admin/users/*
├── producerRoutes.js         # /api/admin/producers/*
├── newsRoutes.js             # /api/admin/news/*
├── resourceRoutes.js         # /api/admin/resources/*
├── projectRoutes.js          # /api/admin/projects/*
├── partnershipRoutes.js      # /api/admin/partnerships/*
└── messageRoutes.js          # /api/admin/messages/*
```

---

## 📁 Frontend Files for Admin Dashboard

### Admin Pages
```
client/src/pages/Admin/
├── AdminDashboard.js          # Main dashboard with stats
├── AdminUsers.js              # User management page
├── AdminProducers.js           # Producer management page
├── AdminNews.js                # News management page
├── AdminResources.js           # Resource management page
├── AdminProjects.js            # Project management page
├── AdminPartnerships.js        # Partnership management page
└── AdminMessages.js           # Message management page
```

### Admin Components
```
client/src/components/Admin/
├── DashboardOverview.js        # Dashboard stats cards
├── UserManagement.js          # User CRUD component
├── ProducerManagement.js      # Producer CRUD component
├── NewsManagement.js          # News CRUD component
├── ResourceManagement.js      # Resource CRUD component
├── ProjectManagement.js       # Project CRUD component
├── PartnershipManagement.js   # Partnership CRUD component
├── MessageManagement.js       # Message list and reply
├── StatsCard.js               # Reusable stat card
├── DataTable.js               # Reusable data table
├── Modal.js                   # Reusable modal
└── FormModal.js               # Reusable form modal
```

### Admin Services
```
client/src/services/
├── dashboardService.js        # Dashboard API calls
├── adminService.js            # Admin API calls
├── userService.js             # User API calls
├── producerService.js         # Producer API calls
├── newsService.js             # News API calls
├── resourceService.js         # Resource API calls
├── projectService.js          # Project API calls
├── partnershipService.js      # Partnership API calls
└── messageService.js          # Message API calls
```

### Admin Layout
```
client/src/components/Admin/
├── AdminLayout.js             # Main admin layout wrapper
├── AdminSidebar.js            # Sidebar navigation
├── AdminHeader.js             # Header with user info
└── AdminBreadcrumb.js        # Breadcrumb navigation
```

---

## 🔧 Implementation Details

### Dashboard Statistics API Endpoints

```javascript
// GET /api/dashboard/stats
// Returns: { users, producers, news, resources, projects, messages }

// GET /api/dashboard/recent-activity
// Returns: { recentProducers, recentNews, recentMessages }

// GET /api/dashboard/charts-data
// Returns: { chartData for various analytics }
```

### Admin Routes Pattern

```javascript
// All admin routes require authentication + admin role
router.get('/dashboard/stats', authenticateToken, requireAdmin, dashboardController.getStats);
router.get('/users', authenticateToken, requireAdmin, userController.getAll);
router.post('/users', authenticateToken, requireAdmin, userController.create);
router.put('/users/:id', authenticateToken, requireAdmin, userController.update);
router.delete('/users/:id', authenticateToken, requireAdmin, userController.delete);
```

### Frontend Admin Route Structure

```javascript
// client/src/App.js
<Route path="/admin" element={<AdminLayout />}>
  <Route index element={<AdminDashboard />} />
  <Route path="users" element={<AdminUsers />} />
  <Route path="producers" element={<AdminProducers />} />
  <Route path="news" element={<AdminNews />} />
  <Route path="resources" element={<AdminResources />} />
  <Route path="projects" element={<AdminProjects />} />
  <Route path="partnerships" element={<AdminPartnerships />} />
  <Route path="messages" element={<AdminMessages />} />
</Route>
```

---

## 📊 Dashboard Features

### Statistics Cards
- Total Users
- Total Producers (Approved/Pending)
- Published News
- Total Resources
- Active Projects
- Unread Messages

### Charts & Analytics
- User growth over time
- Producer distribution by type
- News views statistics
- Resource download trends
- Project status distribution

### Recent Activity
- Recently added producers
- Recently published news
- Recent messages
- Recent resource uploads

### Quick Actions
- Create new producer
- Publish news
- Upload resource
- Reply to message

---

## 🎯 Complete File List

### Backend (15 files)
1. `server/src/controllers/dashboardController.js`
2. `server/src/controllers/userController.js`
3. `server/src/controllers/producerController.js`
4. `server/src/controllers/newsController.js`
5. `server/src/controllers/resourceController.js`
6. `server/src/controllers/projectController.js`
7. `server/src/controllers/partnershipController.js`
8. `server/src/controllers/messageController.js`
9. `server/src/routes/dashboardRoutes.js`
10. `server/src/routes/adminRoutes.js`
11. `server/src/routes/userRoutes.js`
12. `server/src/routes/producerRoutes.js`
13. `server/src/routes/newsRoutes.js`
14. `server/src/routes/resourceRoutes.js`
15. `server/src/routes/projectRoutes.js`

### Frontend (25+ files)
1. `client/src/pages/Admin/AdminDashboard.js`
2. `client/src/pages/Admin/AdminUsers.js`
3. `client/src/pages/Admin/AdminProducers.js`
4. `client/src/pages/Admin/AdminNews.js`
5. `client/src/pages/Admin/AdminResources.js`
6. `client/src/pages/Admin/AdminProjects.js`
7. `client/src/pages/Admin/AdminPartnerships.js`
8. `client/src/pages/Admin/AdminMessages.js`
9. `client/src/components/Admin/DashboardOverview.js`
10. `client/src/components/Admin/AdminLayout.js`
11. `client/src/components/Admin/AdminSidebar.js`
12. `client/src/components/Admin/AdminHeader.js`
13. `client/src/components/Admin/UserManagement.js`
14. `client/src/components/Admin/ProducerManagement.js`
15. `client/src/components/Admin/NewsManagement.js`
16. `client/src/components/Admin/ResourceManagement.js`
17. `client/src/components/Admin/ProjectManagement.js`
18. `client/src/components/Admin/PartnershipManagement.js`
19. `client/src/components/Admin/MessageManagement.js`
20. `client/src/components/Admin/StatsCard.js`
21. `client/src/components/Admin/DataTable.js`
22. `client/src/components/Admin/Modal.js`
23. `client/src/services/dashboardService.js`
24. `client/src/services/adminService.js`
25. `client/src/services/userService.js`
... (and more service files)

---

**Total: ~40+ files for complete admin dashboard functionality**

