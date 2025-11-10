# UCAEP Backend Server

Node.js + Express + MySQL + Sequelize backend for UCAEP website.

## Quick Start

### Windows (Using Batch File)
1. Double-click `start-backend.bat`
2. Make sure XAMPP MySQL is running
3. Server will start on `http://localhost:5000`

### Manual Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   copy src\env.example .env
   # Edit .env with your MySQL credentials
   ```

3. **Start server:**
   ```bash
   npm run dev    # Development mode
   npm start      # Production mode
   ```

## Database Setup

1. Start XAMPP MySQL
2. Open phpMyAdmin (`http://localhost/phpmyadmin`)
3. Create database: `ucaep_db`
4. Import `../database/mysql-schema.sql`

See `SETUP_GUIDE.md` for detailed instructions.

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── db.js              # MySQL connection
│   ├── models/                # Sequelize models
│   │   ├── User.js
│   │   ├── Producer.js
│   │   ├── News.js
│   │   ├── Project.js
│   │   ├── Partnership.js
│   │   ├── Resource.js
│   │   ├── Message.js
│   │   └── index.js          # Model associations
│   ├── controllers/          # Business logic
│   ├── routes/               # API routes
│   ├── middleware/           # Auth & error handling
│   ├── utils/                # Utilities
│   ├── app.js                # Express app
│   └── server.js             # Entry point
├── package.json
├── .env                      # Environment variables
└── SETUP_GUIDE.md           # Detailed setup guide
```

## API Endpoints

Base URL: `http://localhost:5000/api`

### Authentication
- `POST /auth/register` - Register user
- `POST /auth/login` - Login
- `GET /auth/me` - Get current user

### CRUD Operations
All endpoints support full CRUD operations:
- `GET /{resource}` - List all
- `GET /{resource}/:id` - Get single
- `POST /{resource}` - Create
- `PUT /{resource}/:id` - Update
- `DELETE /{resource}/:id` - Delete

### Resources
- `/producers` - Producer profiles
- `/news` - News articles
- `/projects` - Projects
- `/partnerships` - Partnerships
- `/resources` - Documents/Resources
- `/contact` - Contact messages

## Default Admin

- Email: `admin@ucaep.com`
- Password: `admin123`

**⚠️ Change this immediately in production!**

## Troubleshooting

- **Database connection error**: Check XAMPP MySQL is running and `.env` has correct credentials
- **Port in use**: Change `PORT` in `.env`
- **Module not found**: Run `npm install` again

For more details, see `SETUP_GUIDE.md`.

