# 🚀 Quick Start - Run Your Project

## Option 1: Use the Batch Script (Easiest)

**Double-click one of these files:**
- `start-project.bat` - Full setup with checks
- `run-project.bat` - Quick start (if already set up)

## Option 2: Manual Start

### Prerequisites:
1. ✅ XAMPP MySQL is running
2. ✅ Database `ucaep_db` exists
3. ✅ `.env` file exists in `server/` folder

### Start Command:
```bash
npm run dev
```

This will start:
- **Server** on `http://localhost:5000`
- **Client** on `http://localhost:3000`

## Setup Checklist

Before running, make sure:

### 1. Environment File
- [ ] `server/.env` file exists
- [ ] Contains database credentials
- [ ] Contains JWT_SECRET

### 2. Database
- [ ] XAMPP MySQL is running
- [ ] Database `ucaep_db` exists
- [ ] Status column added to `news` table

**To add status column:**
```sql
USE ucaep_db;
ALTER TABLE news ADD COLUMN status ENUM('draft', 'published', 'archived') DEFAULT 'draft' NOT NULL;
```

### 3. Dependencies
- [ ] Root: `npm install`
- [ ] Server: `cd server && npm install`
- [ ] Client: `cd client && npm install`

Or run: `npm run install-all`

## Troubleshooting

### Server Won't Start
1. Check `.env` file exists in `server/` folder
2. Verify MySQL is running
3. Check port 5000 is not in use

### Client Won't Start
1. Check port 3000 is not in use
2. Verify client dependencies installed

### Database Connection Error
1. Start XAMPP MySQL
2. Verify database `ucaep_db` exists
3. Check credentials in `.env` file

## Access Points

Once running:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health

---

**The project should now be running!** 🎉

