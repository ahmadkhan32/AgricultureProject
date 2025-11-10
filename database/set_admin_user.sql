-- Quick SQL to set your user as admin
-- Run this in phpMyAdmin SQL tab

USE ucaep_db;

-- Option 1: Update existing user to admin
-- Replace 'your-email@example.com' with your actual email
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';

-- Verify the update
SELECT id, email, first_name, last_name, role 
FROM users 
WHERE email = 'your-email@example.com';

-- Option 2: Make ALL users admin (FOR TESTING ONLY!)
-- Uncomment below line if you want all users to be admin
-- UPDATE users SET role = 'admin';

