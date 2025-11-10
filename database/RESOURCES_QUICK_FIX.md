# Quick Fix for Resources Table Status Column Error

## Problem
You're seeing this error: "Resources table is missing the status column. Please run the database migration script."

## Solution

### Option 1: Quick Fix (Recommended)
Just add the missing status column:

1. Open **phpMyAdmin**
2. Select your database (`ucaep_db`)
3. Go to **SQL** tab
4. Copy and paste this:

```sql
USE ucaep_db;

ALTER TABLE `resources` 
ADD COLUMN IF NOT EXISTS `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active' AFTER `category`;

UPDATE `resources` SET `status` = 'active' WHERE `status` IS NULL OR `status` = '';
```

5. Click **Go**
6. Restart your backend server

### Option 2: Complete Setup (Recommended for first-time setup)
Run the complete setup script that creates the table, adds all columns, and inserts sample data:

1. Open **phpMyAdmin**
2. Select your database (`ucaep_db`)
3. Go to **SQL** tab
4. Open and copy the entire contents of: `database/COMPLETE_RESOURCES_TABLE_SETUP.sql`
5. Paste and click **Go**
6. Restart your backend server

## Verify It Works

After running the SQL:
1. Check the table structure: `DESCRIBE resources;`
2. Check sample data: `SELECT * FROM resources LIMIT 5;`
3. Refresh your frontend (Resources.js page)
4. You should see 8 sample resources displayed

## Sample Data Included

The script includes these sample resources:
- Agricultural Production Report 2024 (Reports)
- Farm Management Guidelines (Guidelines)
- Producer Registration Form (Forms)
- UCAEP Annual Report 2023 (Documents)
- Livestock Health Manual (Guidelines)
- Agricultural Loan Application (Forms)
- Market Analysis Report Q1 2024 (Reports)
- Organic Farming Standards (Guidelines)

All resources will show in the frontend Resources.js page once the database is fixed.

