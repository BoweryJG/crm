-- Initial data for app_settings and user_subscriptions tables
-- This migration inserts default data for existing users

-- First, let's create a function to insert default app settings for users
CREATE OR REPLACE FUNCTION insert_default_app_settings()
RETURNS void AS $$
DECLARE
    user_record RECORD;
BEGIN
    -- Loop through all existing users
    FOR user_record IN SELECT id FROM auth.users
    LOOP
        -- Insert default app settings if they don't exist
        INSERT INTO app_settings (user_id, app_mode, feature_tier)
        VALUES (user_record.id, 'demo', 'basic')
        ON CONFLICT (user_id) DO NOTHING;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create a function to insert default subscription data
CREATE OR REPLACE FUNCTION insert_default_subscriptions()
RETURNS void AS $$
DECLARE
    user_record RECORD;
BEGIN
    -- Loop through all existing users
    FOR user_record IN SELECT id FROM auth.users
    LOOP
        -- Insert default subscription data if it doesn't exist
        INSERT INTO user_subscriptions (
            user_id, 
            subscription_tier, 
            is_active, 
            billing_cycle,
            current_period_start,
            current_period_end
        )
        VALUES (
            user_record.id, 
            'free', 
            TRUE, 
            NULL,
            NOW(),
            NOW() + INTERVAL '100 years'  -- Effectively never expires for free tier
        )
        ON CONFLICT (user_id) DO NOTHING;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Execute the functions to insert default data
SELECT insert_default_app_settings();
SELECT insert_default_subscriptions();

-- Create a trigger to automatically insert default settings for new users
CREATE OR REPLACE FUNCTION create_default_settings_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert default app settings
    INSERT INTO app_settings (user_id, app_mode, feature_tier)
    VALUES (NEW.id, 'demo', 'basic');
    
    -- Insert default subscription
    INSERT INTO user_subscriptions (
        user_id, 
        subscription_tier, 
        is_active, 
        billing_cycle,
        current_period_start,
        current_period_end
    )
    VALUES (
        NEW.id, 
        'free', 
        TRUE, 
        NULL,
        NOW(),
        NOW() + INTERVAL '100 years'
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger on the auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_default_settings_for_new_user();

-- Insert sample premium subscriptions for testing
-- Replace these UUIDs with actual user IDs if needed
INSERT INTO user_subscriptions (
    user_id,
    subscription_id,
    subscription_tier,
    is_active,
    billing_cycle,
    current_period_start,
    current_period_end,
    cancel_at_period_end
)
VALUES
    -- Professional tier, monthly billing
    ('00000000-0000-0000-0000-000000000001', 'sub_professional_monthly_1', 'professional', TRUE, 'monthly', NOW(), NOW() + INTERVAL '1 month', FALSE),
    
    -- Professional tier, annual billing
    ('00000000-0000-0000-0000-000000000002', 'sub_professional_annual_1', 'professional', TRUE, 'annual', NOW(), NOW() + INTERVAL '1 year', FALSE),
    
    -- Insights tier, monthly billing
    ('00000000-0000-0000-0000-000000000003', 'sub_insights_monthly_1', 'insights', TRUE, 'monthly', NOW(), NOW() + INTERVAL '1 month', FALSE),
    
    -- Insights tier, annual billing
    ('00000000-0000-0000-0000-000000000004', 'sub_insights_annual_1', 'insights', TRUE, 'annual', NOW(), NOW() + INTERVAL '1 year', FALSE),
    
    -- Cancelled subscription
    ('00000000-0000-0000-0000-000000000005', 'sub_cancelled_1', 'professional', TRUE, 'monthly', NOW() - INTERVAL '15 days', NOW() + INTERVAL '15 days', TRUE)
ON CONFLICT (user_id) DO UPDATE
SET
    subscription_id = EXCLUDED.subscription_id,
    subscription_tier = EXCLUDED.subscription_tier,
    is_active = EXCLUDED.is_active,
    billing_cycle = EXCLUDED.billing_cycle,
    current_period_start = EXCLUDED.current_period_start,
    current_period_end = EXCLUDED.current_period_end,
    cancel_at_period_end = EXCLUDED.cancel_at_period_end;

-- Update app settings for users with premium subscriptions
UPDATE app_settings
SET app_mode = 'live'
WHERE user_id IN (
    SELECT user_id FROM user_subscriptions 
    WHERE subscription_tier IN ('professional', 'insights') AND is_active = TRUE
);

UPDATE app_settings
SET feature_tier = 'premium'
WHERE user_id IN (
    SELECT user_id FROM user_subscriptions 
    WHERE subscription_tier = 'insights' AND is_active = TRUE
);
