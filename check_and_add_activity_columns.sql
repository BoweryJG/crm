
-- Check and add columns to sales_activities if they don't exist

-- Check if user_id column exists, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'sales_activities' 
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE public.sales_activities
        ADD COLUMN user_id UUID;
        
        -- Add foreign key constraint only if column was just created
        IF NOT EXISTS (
            SELECT 1
            FROM information_schema.table_constraints
            WHERE constraint_name = 'fk_sales_activities_user'
            AND table_name = 'sales_activities'
        ) THEN
            ALTER TABLE public.sales_activities
            ADD CONSTRAINT fk_sales_activities_user
            FOREIGN KEY (user_id)
            REFERENCES auth.users(id)
            ON DELETE SET NULL;
        END IF;
        
        COMMENT ON COLUMN public.sales_activities.user_id IS 'Links the sales activity to a specific sales rep in auth.users.';
    END IF;
END $$;

-- Check if call_analysis_id column exists, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'sales_activities' 
        AND column_name = 'call_analysis_id'
    ) THEN
        ALTER TABLE public.sales_activities
        ADD COLUMN call_analysis_id UUID;
        
        -- Add foreign key constraint only if column was just created
        IF NOT EXISTS (
            SELECT 1
            FROM information_schema.table_constraints
            WHERE constraint_name = 'fk_sales_activities_call_analysis'
            AND table_name = 'sales_activities'
        ) THEN
            ALTER TABLE public.sales_activities
            ADD CONSTRAINT fk_sales_activities_call_analysis
            FOREIGN KEY (call_analysis_id)
            REFERENCES public.call_analysis(id)
            ON DELETE SET NULL;
        END IF;
        
        COMMENT ON COLUMN public.sales_activities.call_analysis_id IS 'Links a call activity directly to a record in call_analysis, if applicable.';
    END IF;
END $$;

-- Show current structure of sales_activities table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'sales_activities'
ORDER BY ordinal_position;