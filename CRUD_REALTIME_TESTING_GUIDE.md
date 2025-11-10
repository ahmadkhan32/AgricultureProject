# Complete CRUD System with Real-time Updates - Testing Guide

## 📋 Overview

This guide explains how to test the complete CRUD system with real-time Socket.io updates for Resources.

## 🏗️ Project Structure

### Backend Structure
```
server/
├── src/
│   ├── server.js              ✅ Socket.io server setup
│   ├── app.js                  ✅ Express app
│   ├── utils/
│   │   └── socketEmitter.js    ✅ Socket.io event emitter
│   ├── controllers/
│   │   └── resourceController.js ✅ CRUD + Socket.io events
│   ├── routes/
│   │   └── resourceRoutes.js   ✅ API routes
│   └── models/
│       └── Resource.js        ✅ Sequelize model
```

### Frontend Structure
```
client/
├── src/
│   ├── pages/
│   │   └── Resources.js       ✅ Full CRUD UI + Socket.io
│   └── services/
│       ├── resourceService.js  ✅ API client
│       └── socketService.js    ✅ Socket.io client
```

## 🔧 Setup Instructions

### 1. Install Dependencies

**Backend** (already installed):
```bash
cd server
npm install socket.io
```

**Frontend** (already installed):
```bash
cd client
npm install socket.io-client react-query
```

### 2. Environment Variables

**Backend** (`server/.env`):
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_database
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

**Frontend** (`client/.env`):
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 3. Start the Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

You should see:
```
🚀 UCAEP Server running on port 5000
🔌 Socket.io: Enabled for real-time updates
✅ Socket.io Event Emitter initialized
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

## 🧪 Testing Steps

### Test 1: Verify Socket.io Connection

1. Open the browser console (F12)
2. Navigate to `/resources` page
3. Look for console logs:
   ```
   ✅ Socket.io connected: [socket-id]
   📦 Client [socket-id] joined resources room
   ```

### Test 2: Create Resource (Real-time Test)

**Method 1: Via Frontend (Admin User)**
1. Login as admin user
2. Go to `/resources` page
3. Click "Ajouter une Ressource" button
4. Fill in the form:
   - Title: "Test Resource"
   - Description: "This is a test resource"
   - File URL: "https://example.com/test.pdf"
   - File Type: "PDF"
   - Category: "document"
5. Click "Créer"
6. ✅ **Expected**: Resource appears immediately in the list (no refresh needed)

**Method 2: Via Backend API (Postman/curl)**
```bash
# Create resource via API
curl -X POST http://localhost:5000/api/resources \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "title": "Test Resource from API",
    "description": "Created via API",
    "fileUrl": "https://example.com/test.pdf",
    "fileType": "PDF",
    "category": "document",
    "tags": ["test", "api"]
  }'
```

**Expected Result:**
- ✅ Resource created in database
- ✅ Socket.io event `resource:created` emitted
- ✅ Frontend automatically updates (no refresh)
- ✅ Console shows: `Real-time: Resource created`

### Test 3: Update Resource (Real-time Test)

**Via Frontend:**
1. Click "Edit" icon on any resource
2. Modify the title
3. Click "Mettre à jour"
4. ✅ **Expected**: Resource updates immediately in the list

**Via API:**
```bash
curl -X PUT http://localhost:5000/api/resources/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "title": "Updated Title",
    "description": "Updated description",
    "fileUrl": "https://example.com/updated.pdf",
    "fileType": "PDF",
    "category": "document"
  }'
```

**Expected Result:**
- ✅ Resource updated in database
- ✅ Socket.io event `resource:updated` emitted
- ✅ Frontend automatically refreshes

### Test 4: Delete Resource (Real-time Test)

**Via Frontend:**
1. Click "Delete" icon on any resource
2. Confirm deletion
3. ✅ **Expected**: Resource disappears immediately

**Via API:**
```bash
curl -X DELETE http://localhost:5000/api/resources/1 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Expected Result:**
- ✅ Resource deleted from database
- ✅ Socket.io event `resource:deleted` emitted
- ✅ Frontend automatically removes the resource

### Test 5: Multiple Browser Windows (Real-time Sync)

1. Open **Browser Window 1**: Navigate to `/resources`
2. Open **Browser Window 2**: Navigate to `/resources` (same or different user)
3. In Window 1, create/edit/delete a resource
4. ✅ **Expected**: Window 2 automatically updates without refresh

### Test 6: Filter and Search

1. Use the search box to filter resources
2. Use category filter dropdown
3. ✅ **Expected**: Resources filter correctly
4. Pagination should work correctly

## 🔍 Verification Checklist

### Backend Verification

- [ ] Server starts without errors
- [ ] Socket.io connection logs appear
- [ ] API endpoints respond correctly:
  - [ ] `GET /api/resources` - Returns all resources
  - [ ] `GET /api/resources/:id` - Returns single resource
  - [ ] `POST /api/resources` - Creates resource + emits event
  - [ ] `PUT /api/resources/:id` - Updates resource + emits event
  - [ ] `DELETE /api/resources/:id` - Deletes resource + emits event
- [ ] Console shows Socket.io events being emitted:
  ```
  📢 Socket.io: Emitted resource:created event [id]
  📢 Socket.io: Emitted resource:updated event [id]
  📢 Socket.io: Emitted resource:deleted event [id]
  ```

### Frontend Verification

- [ ] Socket.io connects on page load
- [ ] Resources display correctly
- [ ] Create form works (admin only)
- [ ] Edit form works (admin only)
- [ ] Delete works (admin only)
- [ ] Real-time updates work:
  - [ ] Create in one window → appears in all windows
  - [ ] Update in one window → updates in all windows
  - [ ] Delete in one window → disappears in all windows
- [ ] Search and filter work
- [ ] Pagination works

## 🐛 Troubleshooting

### Issue: Socket.io not connecting

**Check:**
1. Backend server is running on port 5000
2. Frontend `.env` has correct `REACT_APP_SOCKET_URL`
3. CORS is configured correctly in `server.js`
4. Browser console for connection errors

**Solution:**
```javascript
// Check socket connection status
console.log(socketService.getConnectionStatus());
```

### Issue: Events not being received

**Check:**
1. Socket.io is connected (check console logs)
2. Client joined the resources room
3. Backend is emitting events (check server logs)
4. Event names match: `resource:created`, `resource:updated`, `resource:deleted`

### Issue: CRUD operations fail

**Check:**
1. User is logged in and has admin role
2. Token is valid and included in requests
3. API endpoint is correct
4. Database connection is working

**Debug:**
```javascript
// Check authentication
console.log(localStorage.getItem('token'));
console.log(JSON.parse(localStorage.getItem('user')));
```

### Issue: Real-time updates not working

**Check:**
1. Socket.io is connected
2. React Query cache is being invalidated
3. Event listeners are set up correctly
4. Query refetch is enabled

**Solution:**
```javascript
// Manually invalidate query
queryClient.invalidateQueries('resources');
```

## 📊 Expected Console Output

### Backend Console:
```
🚀 UCAEP Server running on port 5000
🔌 Socket.io: Enabled for real-time updates
✅ Socket.io Event Emitter initialized
✅ Client connected: abc123
📦 Client abc123 joined resources room
📢 Socket.io: Emitted resource:created event 1
📢 Socket.io: Emitted resource:updated event 1
📢 Socket.io: Emitted resource:deleted event 1
```

### Frontend Console:
```
✅ Socket.io connected: xyz789
Real-time: Resource created {resource: {...}}
Real-time: Resource updated {resource: {...}}
Real-time: Resource deleted {resourceId: 1}
```

## 🎯 Success Criteria

✅ **All tests pass when:**
1. Resources can be created via frontend
2. Resources can be created via API
3. Resources update in real-time across all browser windows
4. Resources can be edited via frontend
5. Resources can be edited via API
6. Resources update in real-time after edit
7. Resources can be deleted via frontend
8. Resources can be deleted via API
9. Resources disappear in real-time after delete
10. Socket.io connection is stable
11. No errors in console
12. Database operations are correct

## 📝 API Endpoints Reference

```
GET    /api/resources              - Get all resources (public)
GET    /api/resources/:id          - Get single resource (public)
POST   /api/resources              - Create resource (admin)
PUT    /api/resources/:id          - Update resource (admin)
DELETE /api/resources/:id          - Delete resource (admin)
```

## 🔐 Authentication

All CRUD operations (POST, PUT, DELETE) require:
- Valid JWT token in `Authorization: Bearer [token]` header
- User role must be `admin`

## 📚 Additional Resources

- Socket.io Documentation: https://socket.io/docs/
- React Query Documentation: https://react-query.tanstack.com/
- Sequelize Documentation: https://sequelize.org/

---

## ✅ Testing Complete!

If all tests pass, your CRUD system with real-time updates is working correctly! 🎉

