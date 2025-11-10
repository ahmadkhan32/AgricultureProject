# Complete Backend to Frontend Data Implementation Guide

## 🎯 Overview

This guide explains how to implement data flow from **Node.js + Express.js + MySQL** backend to **React** frontend for all pages, including admin dashboard functionality.

## 📋 Prerequisites

- Node.js installed
- MySQL database running
- phpMyAdmin access
- React frontend setup
- Understanding of REST APIs and React Hooks

---

## 🗄️ STEP 1: Database Setup (MySQL/phpMyAdmin)

### Prompt for Creating Database Tables

**Use this prompt in phpMyAdmin or MySQL CLI:**

```sql
-- Create Database
CREATE DATABASE IF NOT EXISTS ucaeep_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ucaeep_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role ENUM('admin', 'producer', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Producers Table
CREATE TABLE IF NOT EXISTS producers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(200),
    business_name VARCHAR(200) NOT NULL,
    business_type ENUM('agriculture', 'livestock', 'fisheries', 'mixed') NOT NULL,
    description TEXT,
    location VARCHAR(200) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    region VARCHAR(100) NOT NULL,
    products JSON,
    certifications JSON,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    website VARCHAR(500),
    social_media JSON,
    images JSON,
    image VARCHAR(500),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved',
    is_ai_generated BOOLEAN DEFAULT FALSE,
    created_by VARCHAR(100) DEFAULT 'system',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_region (region),
    INDEX idx_business_type (business_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- News Table
CREATE TABLE IF NOT EXISTS news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT,
    summary TEXT,
    author VARCHAR(200),
    category VARCHAR(100),
    image_url VARCHAR(500),
    published_at TIMESTAMP NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    views INT DEFAULT 0,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_published_at (published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Resources Table
CREATE TABLE IF NOT EXISTS resources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INT,
    category ENUM('document', 'form', 'report', 'law', 'statistics', 'guide') NOT NULL,
    tags JSON,
    download_count INT DEFAULT 0,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_category (category),
    INDEX idx_download_count (download_count)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status ENUM('planning', 'active', 'completed', 'cancelled') DEFAULT 'planning',
    budget DECIMAL(15, 2),
    location VARCHAR(200),
    image_url VARCHAR(500),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Partnerships Table
CREATE TABLE IF NOT EXISTS partnerships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(300) NOT NULL,
    description TEXT,
    partner_type ENUM('government', 'ngo', 'international', 'private') NOT NULL,
    website VARCHAR(500),
    contact_email VARCHAR(255),
    logo_url VARCHAR(500),
    status ENUM('active', 'inactive', 'pending') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_partner_type (partner_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Messages/Contact Table
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(300),
    message TEXT NOT NULL,
    status ENUM('unread', 'read', 'replied', 'archived') DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Admin Dashboard Statistics View (Virtual - calculated on the fly)
-- This doesn't need a table, but here's the query structure:
/*
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM producers WHERE status='approved') as total_producers,
    (SELECT COUNT(*) FROM news WHERE status='published') as total_news,
    (SELECT COUNT(*) FROM resources) as total_resources,
    (SELECT COUNT(*) FROM projects WHERE status='active') as active_projects,
    (SELECT COUNT(*) FROM messages WHERE status='unread') as unread_messages;
*/
```

---

## 🏗️ STEP 2: Backend File Structure

### Complete Backend Structure

```
server/
├── src/
│   ├── config/
│   │   └── db.js                    # MySQL connection with Sequelize
│   │
│   ├── models/
│   │   ├── index.js                 # Model associations
│   │   ├── User.js                  # User model
│   │   ├── Producer.js              # Producer model
│   │   ├── News.js                  # News model
│   │   ├── Resource.js              # Resource model
│   │   ├── Project.js                # Project model
│   │   ├── Partnership.js           # Partnership model
│   │   └── Message.js               # Message model
│   │
│   ├── controllers/
│   │   ├── authController.js        # Authentication (login, register)
│   │   ├── producerController.js    # Producer CRUD
│   │   ├── newsController.js        # News CRUD
│   │   ├── resourceController.js    # Resource CRUD
│   │   ├── projectController.js     # Project CRUD
│   │   ├── partnershipController.js # Partnership CRUD
│   │   ├── messageController.js     # Message CRUD
│   │   └── dashboardController.js   # Dashboard statistics
│   │
│   ├── routes/
│   │   ├── authRoutes.js            # /api/auth
│   │   ├── producerRoutes.js         # /api/producers
│   │   ├── newsRoutes.js            # /api/news
│   │   ├── resourceRoutes.js        # /api/resources
│   │   ├── projectRoutes.js         # /api/projects
│   │   ├── partnershipRoutes.js     # /api/partnerships
│   │   ├── messageRoutes.js         # /api/messages
│   │   └── dashboardRoutes.js       # /api/dashboard
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT authentication
│   │   └── errorHandler.js          # Error handling
│   │
│   ├── utils/
│   │   ├── socketEmitter.js         # Socket.io events
│   │   └── validators.js            # Data validation
│   │
│   ├── app.js                        # Express app setup
│   └── server.js                    # Server entry point with Socket.io
│
├── uploads/
│   └── images/                      # Uploaded files
│
├── .env                             # Environment variables
├── package.json
└── README.md
```

---

## 🎨 STEP 3: Frontend File Structure

### Complete Frontend Structure

```
client/
├── src/
│   ├── components/
│   │   ├── Admin/
│   │   │   ├── DashboardOverview.js      # Main dashboard stats
│   │   │   ├── UserManagement.js        # User CRUD
│   │   │   ├── ProducerManagement.js    # Producer CRUD
│   │   │   ├── NewsManagement.js        # News CRUD
│   │   │   ├── ResourceManagement.js     # Resource CRUD
│   │   │   ├── ProjectManagement.js     # Project CRUD
│   │   │   ├── PartnershipManagement.js # Partnership CRUD
│   │   │   └── MessageManagement.js     # Message management
│   │   │
│   │   ├── Common/
│   │   │   ├── Header.js
│   │   │   ├── Footer.js
│   │   │   ├── Navbar.js
│   │   │   ├── Sidebar.js
│   │   │   └── LoadingSpinner.js
│   │   │
│   │   └── Forms/
│   │       ├── ProducerForm.js
│   │       ├── NewsForm.js
│   │       └── ResourceForm.js
│   │
│   ├── pages/
│   │   ├── Home.js                   # Home page
│   │   ├── About.js                  # About page
│   │   ├── Producers.js              # Producers listing
│   │   ├── News.js                   # News listing
│   │   ├── NewsDetail.js            # Single news article
│   │   ├── Resources.js              # Resources listing
│   │   ├── Services.js               # Services page
│   │   ├── Projects.js               # Projects listing
│   │   ├── Partnerships.js           # Partnerships listing
│   │   ├── Contact.js                # Contact page
│   │   │
│   │   ├── Auth/
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   │
│   │   └── Admin/
│   │       ├── AdminDashboard.js     # Admin dashboard
│   │       ├── AdminUsers.js         # User management
│   │       ├── AdminProducers.js     # Producer management
│   │       ├── AdminNews.js          # News management
│   │       ├── AdminResources.js     # Resource management
│   │       ├── AdminProjects.js      # Project management
│   │       ├── AdminPartnerships.js  # Partnership management
│   │       └── AdminMessages.js      # Message management
│   │
│   ├── services/
│   │   ├── api.js                    # Base API configuration
│   │   ├── authService.js            # Authentication API
│   │   ├── producerService.js        # Producer API
│   │   ├── newsService.js            # News API
│   │   ├── resourceService.js        # Resource API
│   │   ├── projectService.js         # Project API
│   │   ├── partnershipService.js     # Partnership API
│   │   ├── messageService.js         # Message API
│   │   ├── dashboardService.js       # Dashboard API
│   │   └── socketService.js          # Socket.io client
│   │
│   ├── context/
│   │   ├── AuthContext.js            # Authentication context
│   │   └── SocketContext.js          # Socket.io context
│   │
│   ├── hooks/
│   │   ├── useAuth.js                # Authentication hook
│   │   ├── useSocket.js              # Socket.io hook
│   │   └── useApi.js                 # API call hook
│   │
│   ├── utils/
│   │   ├── constants.js              # Constants
│   │   ├── helpers.js                 # Helper functions
│   │   └── validators.js              # Form validators
│   │
│   ├── styles/
│   │   └── globals.css               # Global styles
│   │
│   ├── App.js                        # Main app component
│   └── index.js                      # Entry point
│
├── public/
├── .env                              # Environment variables
├── package.json
└── README.md
```

---

## 🔄 STEP 4: Backend Implementation Pattern

### Example: Resource Controller Pattern

```javascript
// server/src/controllers/resourceController.js
const Resource = require('../models/Resource');
const socketEmitter = require('../utils/socketEmitter');

// GET ALL - Fetch all resources
exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, search } = req.query;
    
    const where = {};
    if (category) where.category = category;
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Resource.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      resources: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ONE - Fetch single resource
exports.getById = async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE - Create new resource
exports.create = async (req, res) => {
  try {
    const resource = await Resource.create(req.body);
    
    // Emit Socket.io event for real-time update
    socketEmitter.emitResourceCreated(resource);
    
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE - Update resource
exports.update = async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    await resource.update(req.body);
    
    // Emit Socket.io event
    socketEmitter.emitResourceUpdated(resource);
    
    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE - Delete resource
exports.delete = async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    const resourceId = resource.id;
    await resource.destroy();
    
    // Emit Socket.io event
    socketEmitter.emitResourceDeleted(resourceId);
    
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### Routes Pattern

```javascript
// server/src/routes/resourceRoutes.js
const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', resourceController.getAll);
router.get('/:id', resourceController.getById);

// Protected routes (Admin only)
router.post('/', authenticateToken, requireAdmin, resourceController.create);
router.put('/:id', authenticateToken, requireAdmin, resourceController.update);
router.delete('/:id', authenticateToken, requireAdmin, resourceController.delete);

module.exports = router;
```

---

## 🎨 STEP 5: Frontend Implementation Pattern

### Example: Resource Service Pattern

```javascript
// client/src/services/resourceService.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const url = `${API_BASE_URL}/resources${endpoint}`;

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const resourceService = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.category) queryParams.append('category', params.category);
    if (params.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    return apiRequest(queryString ? `?${queryString}` : '');
  },

  getById: async (id) => {
    return apiRequest(`/${id}`);
  },

  create: async (data) => {
    return apiRequest('', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id, data) => {
    return apiRequest(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return apiRequest(`/${id}`, {
      method: 'DELETE',
    });
  },
};

export default resourceService;
```

### Frontend Component Pattern

```javascript
// client/src/pages/Resources.js
import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import resourceService from '../services/resourceService';
import socketService from '../services/socketService';

const Resources = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Connect Socket.io and listen for real-time updates
  useEffect(() => {
    socketService.connect();
    
    const unsubscribeCreated = socketService.on('resource:created', () => {
      queryClient.invalidateQueries('resources');
    });
    
    const unsubscribeUpdated = socketService.on('resource:updated', () => {
      queryClient.invalidateQueries('resources');
    });
    
    const unsubscribeDeleted = socketService.on('resource:deleted', () => {
      queryClient.invalidateQueries('resources');
    });

    return () => {
      unsubscribeCreated();
      unsubscribeUpdated();
      unsubscribeDeleted();
    };
  }, [queryClient]);

  // Fetch resources
  const { data, isLoading, error } = useQuery(
    ['resources', { search: searchTerm, page: currentPage }],
    () => resourceService.getAll({ search: searchTerm, page: currentPage }),
    { keepPreviousData: true }
  );

  // Create mutation
  const createMutation = useMutation(
    (data) => resourceService.create(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('resources');
        alert('Resource created successfully!');
      },
    }
  );

  // Similar patterns for update and delete...

  return (
    <div>
      {/* Your UI here */}
    </div>
  );
};

export default Resources;
```

---

## 📊 STEP 6: Admin Dashboard Implementation

### Backend Dashboard Controller

```javascript
// server/src/controllers/dashboardController.js
const User = require('../models/User');
const Producer = require('../models/Producer');
const News = require('../models/News');
const Resource = require('../models/Resource');
const Project = require('../models/Project');
const Message = require('../models/Message');
const { Op } = require('sequelize');

exports.getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalProducers,
      approvedProducers,
      totalNews,
      publishedNews,
      totalResources,
      activeProjects,
      unreadMessages
    ] = await Promise.all([
      User.count(),
      Producer.count(),
      Producer.count({ where: { status: 'approved' } }),
      News.count(),
      News.count({ where: { status: 'published' } }),
      Resource.count(),
      Project.count({ where: { status: 'active' } }),
      Message.count({ where: { status: 'unread' } })
    ]);

    res.json({
      users: { total: totalUsers },
      producers: { total: totalProducers, approved: approvedProducers },
      news: { total: totalNews, published: publishedNews },
      resources: { total: totalResources },
      projects: { active: activeProjects },
      messages: { unread: unreadMessages }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRecentActivity = async (req, res) => {
  try {
    const recentProducers = await Producer.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']]
    });

    const recentNews = await News.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']]
    });

    const recentMessages = await Message.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      where: { status: 'unread' }
    });

    res.json({
      recentProducers,
      recentNews,
      recentMessages
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### Frontend Dashboard Component

```javascript
// client/src/pages/Admin/AdminDashboard.js
import React from 'react';
import { useQuery } from 'react-query';
import dashboardService from '../../services/dashboardService';
import { BarChart, Users, FileText, Briefcase, Mail } from 'lucide-react';

const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery(
    'dashboard-stats',
    () => dashboardService.getStats()
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="stats-grid">
        <StatCard
          icon={<Users />}
          title="Total Users"
          value={stats?.users?.total || 0}
        />
        <StatCard
          icon={<FileText />}
          title="Published News"
          value={stats?.news?.published || 0}
        />
        <StatCard
          icon={<Briefcase />}
          title="Active Projects"
          value={stats?.projects?.active || 0}
        />
        <StatCard
          icon={<Mail />}
          title="Unread Messages"
          value={stats?.messages?.unread || 0}
        />
      </div>
      
      {/* More dashboard components */}
    </div>
  );
};

export default AdminDashboard;
```

---

## 🔗 STEP 7: Complete Data Flow

```
┌─────────────────┐
│   Frontend      │
│   React App     │
└────────┬────────┘
         │
         │ HTTP Request
         │ (GET/POST/PUT/DELETE)
         ▼
┌─────────────────┐
│   Express.js    │
│   API Routes    │
└────────┬────────┘
         │
         │ Controller
         ▼
┌─────────────────┐
│   Sequelize     │
│   ORM           │
└────────┬────────┘
         │
         │ SQL Query
         ▼
┌─────────────────┐
│   MySQL         │
│   Database      │
└─────────────────┘
         │
         │ Response
         ▼
┌─────────────────┐
│   Socket.io     │
│   Real-time     │
└────────┬────────┘
         │
         │ Event
         ▼
┌─────────────────┐
│   Frontend      │
│   Auto-update   │
└─────────────────┘
```

---

## ✅ Checklist for Implementation

### Backend
- [ ] Database tables created in phpMyAdmin
- [ ] Sequelize models created
- [ ] Controllers implement CRUD
- [ ] Routes configured
- [ ] Authentication middleware added
- [ ] Socket.io events emitted
- [ ] Error handling implemented

### Frontend
- [ ] Service files created for API calls
- [ ] Components use React Query
- [ ] Socket.io client connected
- [ ] Real-time updates working
- [ ] Admin dashboard implemented
- [ ] Error handling added
- [ ] Loading states implemented

---

## 🚀 Quick Start Commands

```bash
# Backend
cd server
npm install
npm run dev

# Frontend
cd client
npm install
npm start

# Database
# Import SQL from phpMyAdmin or run MySQL commands
```

---

**This pattern can be applied to ALL pages (Producers, News, Resources, Projects, Partnerships, Messages, Dashboard)**

