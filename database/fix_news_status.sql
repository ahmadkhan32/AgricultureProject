-- Quick fix script to add status column to news table
-- Run this in your Supabase SQL Editor or PostgreSQL client

-- Step 1: Add the status column if it doesn't exist
ALTER TABLE news 
ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft';

-- Step 2: Update any existing news records to have a default status
UPDATE news 
SET status = COALESCE(status, 'published') 
WHERE status IS NULL OR status = '';

-- Step 3: Make sure the column is NOT NULL (optional, but recommended)
ALTER TABLE news 
ALTER COLUMN status SET DEFAULT 'draft';

-- Step 4: Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_news_status_published ON news(status, published_at);

-- Step 5: Verify the column was added
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'news' 
AND column_name = 'status';

