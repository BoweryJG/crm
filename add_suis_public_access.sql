-- Add public/demo access to SUIS tables
-- This allows SUIS to work without authentication for demo purposes

-- Create policies that allow public read access to certain SUIS tables
DO $$
DECLARE
    public_read_tables TEXT[] := ARRAY[
        'suis_market_intelligence',
        'suis_market_trends',
        'suis_knowledge_base'
    ];
    tbl TEXT;
BEGIN
    FOREACH tbl IN ARRAY public_read_tables LOOP
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = tbl) THEN
            -- Create a policy for public read access
            EXECUTE format('
                CREATE POLICY IF NOT EXISTS "Allow public read access" ON %I
                    FOR SELECT
                    USING (true)
            ', tbl);
            
            RAISE NOTICE 'Added public read access to table: %', tbl;
        END IF;
    END LOOP;
END $$;

-- For suis_intelligence_profiles, create a demo profile policy
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'suis_intelligence_profiles') THEN
        -- Allow reading a demo profile when not authenticated
        CREATE POLICY IF NOT EXISTS "Allow reading demo profile" ON suis_intelligence_profiles
            FOR SELECT
            USING (
                auth.uid() IS NULL AND profile_type = 'demo'
                OR auth.uid() = user_id
            );
            
        -- Insert a demo profile if it doesn't exist
        INSERT INTO suis_intelligence_profiles (
            user_id,
            profile_type,
            specializations,
            territory_ids,
            goals,
            preferences,
            created_at,
            updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000'::uuid, -- Demo user ID
            'demo',
            ARRAY['General Demo'],
            ARRAY[]::uuid[],
            jsonb_build_object(
                'salesTargets', jsonb_build_object('monthly', 0, 'quarterly', 0, 'annual', 0),
                'procedureFocus', ARRAY[]::text[],
                'territoryExpansion', false,
                'skillDevelopment', ARRAY[]::text[],
                'clientRetention', 0
            ),
            jsonb_build_object(
                'notificationFrequency', 'real_time',
                'insightDepth', 'detailed',
                'automationLevel', 'assisted',
                'communicationStyle', 'formal',
                'dashboardLayout', jsonb_build_object(
                    'layout', 'grid',
                    'widgets', ARRAY[]::jsonb[],
                    'customizations', jsonb_build_object(
                        'autoArrange', true,
                        'compactMode', false,
                        'gridSize', 12,
                        'padding', 16,
                        'allowOverlap', false
                    ),
                    'responsiveBreakpoints', jsonb_build_object(
                        'xs', 480,
                        'sm', 768,
                        'md', 1024,
                        'lg', 1280,
                        'xl', 1920
                    )
                )
            ),
            NOW(),
            NOW()
        )
        ON CONFLICT (user_id) DO NOTHING;
        
        RAISE NOTICE 'Demo profile policy created';
    END IF;
END $$;

-- Add some demo market intelligence data
INSERT INTO suis_market_intelligence (
    intelligence_type,
    data,
    tags,
    confidence_score,
    source,
    is_active,
    created_at
) VALUES 
(
    'market_trend',
    jsonb_build_object(
        'trend', 'Increasing demand for AI-powered CRM solutions',
        'impact', 'high',
        'action', 'Position SUIS as the leading intelligent CRM platform'
    ),
    ARRAY['AI', 'CRM', 'Technology'],
    0.85,
    'Demo Data',
    true,
    NOW()
),
(
    'competitor_insight',
    jsonb_build_object(
        'trend', 'Traditional CRMs lacking real-time intelligence features',
        'impact', 'medium',
        'action', 'Highlight SUIS real-time capabilities in demos'
    ),
    ARRAY['Competition', 'Features'],
    0.75,
    'Demo Data',
    true,
    NOW()
)
ON CONFLICT DO NOTHING;

RAISE NOTICE 'SUIS public access policies added successfully';