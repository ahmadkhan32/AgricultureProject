-- Migration: Add status column to news table if it doesn't exist
-- This fixes the error: "Could not find the 'status' column of 'news' in the schema cache"

-- For PostgreSQL/Supabase
DO $$ 
BEGIN
    -- Check if the status column exists, if not, add it
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'news' 
        AND column_name = 'status'
    ) THEN
        ALTER TABLE news 
        ADD COLUMN status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft';
        
        -- Update existing rows to have a default status
        UPDATE news SET status = 'published' WHERE status IS NULL OR status = '';
        
        -- Create index for better performance
        CREATE INDEX IF NOT EXISTS idx_news_status_published ON news(status, published_at);
        
        RAISE NOTICE 'Status column added to news table';
    ELSE
        RAISE NOTICE 'Status column already exists in news table';
    END IF;
END $$;

