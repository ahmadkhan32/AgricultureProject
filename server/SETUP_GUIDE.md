# UCAEP Backend Setup Guide

## Prerequisites

1. **Node.js** (v14 or higher)
2. **XAMPP** installed and running (for MySQL)
3. **phpMyAdmin** access

## Step 1: Database Setup

### 1.1 Start XAMPP
- Open XAMPP Control Panel
- Start **Apache** and **MySQL** services

### 1.2 Create Database
1. Open phpMyAdmin (usually at `http://localhost/phpmyadmin`)
2. Click on "New" to create a new database
3. Database name: `ucaep_db`
4. Collation: `utf8mb4_unicode_ci`
5. Click "Create"

### 1.3 Import Schema
1. In phpMyAdmin, select the `ucaep_db` database
2. Click on the "Import" tab
3. Click "Choose File" and select `database/mysql-schema.sql`
4. Click "Go" to import

**OR** you can manually run the SQL file:
1. Select `ucaep_db` database
2. Click on "SQL" tab
3. Copy and paste the contents of `database/mysql-schema.sql`
4. Click "Go"

### 1.4 Verify Tables
After import, you should see these tables:
- `users`
- `producers`
- `news`
- `projects`
- `partnerships`
- `resources`
- `messages`

## Step 2: Backend Setup

### 2.1 Install Dependencies
```bash
cd server
npm install
```

### 2.2 Configure Environment Variables
1. Copy `src/env.example` to `.env` in the server directory:
```bash
cp src/env.example .env
```

2. Edit `.env` file with your MySQL credentials:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=          # Your MySQL password (usually empty for XAMPP)
DB_NAME=ucaep_db

PORT=5000
NODE_ENV=development

JWT_SECRET=your_super_secret_jwt_key_change_this
```

### 2.3 Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## Step 3: Test the API

### 3.1 Health Check
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "status": "OK",
  "message": "UCAEP Server is running",
  "database": "MySQL",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 3.2 Register Admin User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ucaep.com",
    "password": "admin123",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin"
  }'
```

### 3.3 Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ucaep.com",
    "password": "admin123"
  }'
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)
- `PUT /api/auth/profile` - Update profile (requires auth)

### Producers
- `GET /api/producers` - Get all approved producers
- `GET /api/producers/:id` - Get single producer
- `POST /api/producers` - Create producer (requires auth)
- `PUT /api/producers/:id` - Update producer (requires auth)
- `DELETE /api/producers/:id` - Delete producer (requires auth)
- `GET /api/producers/profile/me` - Get my producer profile (requires auth)
- `GET /api/producers/admin/all` - Get all producers (admin only)

### News
- `GET /api/news` - Get all published news
- `GET /api/news/:id` - Get single news article
- `POST /api/news` - Create news (admin only)
- `PUT /api/news/:id` - Update news (admin only)
- `DELETE /api/news/:id` - Delete news (admin only)

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (admin only)
- `PUT /api/projects/:id` - Update project (admin only)
- `DELETE /api/projects/:id` - Delete project (admin only)

### Partnerships
- `GET /api/partnerships` - Get all active partnerships
- `GET /api/partnerships/:id` - Get single partnership
- `POST /api/partnerships` - Create partnership (admin only)
- `PUT /api/partnerships/:id` - Update partnership (admin only)
- `DELETE /api/partnerships/:id` - Delete partnership (admin only)

### Resources
- `GET /api/resources` - Get all resources
- `GET /api/resources/:id` - Get single resource
- `POST /api/resources` - Create resource (admin only)
- `PUT /api/resources/:id` - Update resource (admin only)
- `DELETE /api/resources/:id` - Delete resource (admin only)

### Contact
- `POST /api/contact` - Send contact message
- `GET /api/contact` - Get all messages (admin only)
- `GET /api/contact/:id` - Get single message (admin only)

## Default Admin Account

After running the SQL schema, a default admin account is created:
- **Email:** `admin@ucaep.com`
- **Password:** `admin123` (hash in database)
- **Note:** Change this password immediately after first login!

## Troubleshooting

### Database Connection Error
- Make sure XAMPP MySQL is running
- Check `.env` file has correct MySQL credentials
- Verify database `ucaep_db` exists in phpMyAdmin

### Port Already in Use
- Change `PORT` in `.env` file
- Or stop the process using port 5000

### Module Not Found
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then run `npm install`

## File Structure

```
server/
├── src/
│   ├── config/
│   │   └── db.js              # MySQL connection
│   ├── models/                # Sequelize models
│   ├── controllers/           # Business logic
│   ├── routes/                # API routes
│   ├── middleware/            # Auth & error handling
│   ├── utils/                 # Utilities
│   ├── app.js                 # Express app setup
│   └── server.js              # Server entry point
├── package.json
└── .env                       # Environment variables
```

## Next Steps

1. Connect your frontend to these API endpoints
2. Update CORS settings in `app.js` for production
3. Set up file upload functionality if needed
4. Configure email service in `utils/emailService.js`
5. Set up SSL/HTTPS for production

## Support

For issues or questions, check the code comments or review the Sequelize documentation.

