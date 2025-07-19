-- Email Intelligence and Cultural Advisor Tables
-- Run this SQL in your Supabase SQL Editor

-- Cultural email templates table
CREATE TABLE IF NOT EXISTS cultural_email_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    region VARCHAR(100) NOT NULL,
    language VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('introduction', 'follow-up', 'proposal', 'thank-you', 'scheduling')),
    formality_level VARCHAR(20) NOT NULL CHECK (formality_level IN ('very-formal', 'formal', 'moderate', 'casual')),
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    cultural_notes JSONB DEFAULT '[]'::jsonb,
    when_to_use TEXT,
    adaptations JSONB DEFAULT '{}'::jsonb,
    featured BOOLEAN DEFAULT false,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Saved email templates (user favorites)
CREATE TABLE IF NOT EXISTS saved_email_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    template_id UUID REFERENCES cultural_email_templates(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    region VARCHAR(100),
    language VARCHAR(50),
    custom_adaptations JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, template_id)
);

-- Contact intelligence data
CREATE TABLE IF NOT EXISTS contact_intelligence (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    contact_id UUID NOT NULL, -- References contacts table
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    overall_score INTEGER DEFAULT 0 CHECK (overall_score >= 0 AND overall_score <= 100),
    
    -- Engagement insights
    engagement_score INTEGER DEFAULT 0 CHECK (engagement_score >= 0 AND engagement_score <= 100),
    last_engagement_date TIMESTAMPTZ,
    engagement_frequency INTEGER DEFAULT 0,
    
    -- Deal stage information
    deal_stage VARCHAR(50) DEFAULT 'awareness',
    deal_probability INTEGER DEFAULT 0 CHECK (deal_probability >= 0 AND deal_probability <= 100),
    next_step TEXT,
    timeline_estimate VARCHAR(100),
    
    -- Communication preferences
    preferred_language VARCHAR(50) DEFAULT 'English',
    formality_preference VARCHAR(20) DEFAULT 'moderate',
    communication_style VARCHAR(20) DEFAULT 'direct',
    
    -- Timing preferences
    optimal_contact_time TIME,
    preferred_timezone VARCHAR(50),
    preferred_days JSONB DEFAULT '[]'::jsonb,
    
    -- Relationship status
    relationship_level VARCHAR(20) DEFAULT 'cold' CHECK (relationship_level IN ('cold', 'warm', 'hot', 'champion')),
    sentiment VARCHAR(20) DEFAULT 'neutral' CHECK (sentiment IN ('positive', 'neutral', 'negative')),
    
    -- Cultural context
    cultural_region VARCHAR(100),
    cultural_notes JSONB DEFAULT '[]'::jsonb,
    business_etiquette_preferences JSONB DEFAULT '{}'::jsonb,
    
    -- AI insights
    insights JSONB DEFAULT '[]'::jsonb,
    personalization_tips JSONB DEFAULT '[]'::jsonb,
    
    -- Metadata
    last_analyzed_at TIMESTAMPTZ DEFAULT now(),
    analysis_confidence INTEGER DEFAULT 0 CHECK (analysis_confidence >= 0 AND analysis_confidence <= 100),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    UNIQUE(contact_id, user_id)
);

-- Email intelligence insights tracking
CREATE TABLE IF NOT EXISTS email_insights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    contact_id UUID NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    insight_type VARCHAR(50) NOT NULL CHECK (insight_type IN ('engagement', 'timing', 'preference', 'deal_stage', 'language', 'relationship', 'cultural')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    confidence_score INTEGER DEFAULT 0 CHECK (confidence_score >= 0 AND confidence_score <= 100),
    action_recommendation TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ
);

-- Email template usage tracking
CREATE TABLE IF NOT EXISTS template_usage_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    template_id UUID REFERENCES cultural_email_templates(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    contact_id UUID,
    context VARCHAR(100),
    success_metrics JSONB DEFAULT '{}'::jsonb,
    feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
    cultural_effectiveness INTEGER CHECK (cultural_effectiveness >= 1 AND cultural_effectiveness <= 5),
    used_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cultural_templates_region_lang ON cultural_email_templates(region, language);
CREATE INDEX IF NOT EXISTS idx_cultural_templates_category ON cultural_email_templates(category);
CREATE INDEX IF NOT EXISTS idx_contact_intelligence_contact_id ON contact_intelligence(contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_intelligence_user_id ON contact_intelligence(user_id);
CREATE INDEX IF NOT EXISTS idx_contact_intelligence_deal_stage ON contact_intelligence(deal_stage);
CREATE INDEX IF NOT EXISTS idx_contact_intelligence_relationship_level ON contact_intelligence(relationship_level);
CREATE INDEX IF NOT EXISTS idx_email_insights_contact_id ON email_insights(contact_id);
CREATE INDEX IF NOT EXISTS idx_email_insights_type ON email_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_email_insights_active ON email_insights(is_active);
CREATE INDEX IF NOT EXISTS idx_template_usage_template_id ON template_usage_analytics(template_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_cultural_templates_updated_at 
    BEFORE UPDATE ON cultural_email_templates 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_intelligence_updated_at 
    BEFORE UPDATE ON contact_intelligence 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample cultural templates
INSERT INTO cultural_email_templates (name, region, language, category, formality_level, subject, content, cultural_notes, when_to_use, featured) VALUES 
(
    'Professional Introduction - North America',
    'North America',
    'English',
    'introduction',
    'moderate',
    'Introduction from [Your Company]',
    'Hello [Name],

I hope this email finds you well. My name is [Your Name] and I'm reaching out from [Your Company].

We specialize in [brief description] and have been helping practices like yours achieve [specific benefit].

I'd love to learn more about your current challenges and see if there's a way we can help. Would you be open to a brief 15-minute conversation?

Best regards,
[Your Name]',
    '["Direct and efficient approach", "Focuses on mutual benefit", "Respects time constraints"]',
    'First contact with North American prospects',
    true
),
(
    'Formal Introduction - Europe',
    'Europe',
    'English',
    'introduction',
    'formal',
    'Respectful Introduction - [Your Company]',
    'Dear Dr. [Last Name],

I trust this correspondence finds you in good health and high spirits.

Allow me to introduce myself - I am [Your Name], representing [Your Company], an organization with a distinguished reputation in [industry/field].

We have had the privilege of collaborating with esteemed practices throughout Europe, and I believe there may be opportunities for mutual benefit between our organizations.

I would be most grateful for the opportunity to discuss how we might serve your practice's distinguished needs.

With utmost respect,
[Your Name]',
    '["Highly formal language", "Emphasizes reputation and prestige", "Shows deep respect for hierarchy"]',
    'Initial contact with European medical professionals',
    true
),
(
    'Relationship-Focused Introduction - Asia Pacific',
    'Asia-Pacific',
    'English',
    'introduction',
    'very-formal',
    'Humble Introduction and Request for Guidance',
    'Most Respected Dr. [Full Name],

I hope this message finds you and your esteemed practice flourishing.

With deep respect, I humbly introduce myself as [Your Name] from [Your Company]. We have had the great honor of learning from and serving distinguished practitioners across the Asia-Pacific region.

Your reputation for excellence and innovation in [specialty] is well-known and deeply admired. I would be most grateful for the opportunity to learn from your expertise and explore how we might humbly contribute to your practice's continued success.

If you would graciously consider sharing some of your valuable time, I would be honored to discuss how we might serve your needs with the utmost dedication and respect.

With profound respect and gratitude,
[Your Name]',
    '["Emphasizes respect and humility", "Acknowledges their expertise first", "Focuses on learning from them", "Avoids direct sales approach"]',
    'First contact with senior practitioners in Asia-Pacific region',
    true
);

-- Enable Row Level Security (RLS)
ALTER TABLE cultural_email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_usage_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Cultural templates: readable by all authenticated users, writable by template creators
CREATE POLICY "Cultural templates are viewable by authenticated users" 
    ON cultural_email_templates FOR SELECT 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create cultural templates" 
    ON cultural_email_templates FOR INSERT 
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own cultural templates" 
    ON cultural_email_templates FOR UPDATE 
    USING (auth.uid() = created_by);

-- Saved templates: only accessible by the user who saved them
CREATE POLICY "Users can view their own saved templates" 
    ON saved_email_templates FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can save templates" 
    ON saved_email_templates FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their saved templates" 
    ON saved_email_templates FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their saved templates" 
    ON saved_email_templates FOR DELETE 
    USING (auth.uid() = user_id);

-- Contact intelligence: only accessible by the user who owns the data
CREATE POLICY "Users can view their contact intelligence" 
    ON contact_intelligence FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create contact intelligence" 
    ON contact_intelligence FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their contact intelligence" 
    ON contact_intelligence FOR UPDATE 
    USING (auth.uid() = user_id);

-- Email insights: only accessible by the user who owns the data
CREATE POLICY "Users can view their email insights" 
    ON email_insights FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create email insights" 
    ON email_insights FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their email insights" 
    ON email_insights FOR UPDATE 
    USING (auth.uid() = user_id);

-- Template usage analytics: only accessible by the user
CREATE POLICY "Users can view their template usage" 
    ON template_usage_analytics FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create template usage records" 
    ON template_usage_analytics FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON cultural_email_templates TO anon, authenticated;
GRANT ALL ON saved_email_templates TO authenticated;
GRANT ALL ON contact_intelligence TO authenticated;
GRANT ALL ON email_insights TO authenticated;
GRANT ALL ON template_usage_analytics TO authenticated;