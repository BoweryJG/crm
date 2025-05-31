-- Create regional_insights table for storing market analytics data
CREATE TABLE IF NOT EXISTS regional_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  region VARCHAR(255) NOT NULL,
  market_sentiment VARCHAR(50) CHECK (market_sentiment IN ('positive', 'neutral', 'negative')),
  trends JSONB,
  competitor_count INTEGER DEFAULT 0,
  influencer_count INTEGER DEFAULT 0,
  demographics JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_regional_insights_region ON regional_insights(region);
CREATE INDEX IF NOT EXISTS idx_regional_insights_updated ON regional_insights(last_updated);

-- Create competitor_data table for storing local business information
CREATE TABLE IF NOT EXISTS competitor_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id VARCHAR(255), -- Google Places ID, Yelp ID, etc.
  name VARCHAR(255) NOT NULL,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(20),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  category VARCHAR(100) CHECK (category IN ('dental_practice', 'medical_spa', 'plastic_surgery', 'dermatology')),
  rating DECIMAL(3, 2),
  review_count INTEGER DEFAULT 0,
  price_level INTEGER CHECK (price_level BETWEEN 1 AND 4),
  photos JSONB,
  recent_reviews JSONB,
  data_source VARCHAR(50), -- 'google_places', 'yelp', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for competitor data
CREATE INDEX IF NOT EXISTS idx_competitor_data_location ON competitor_data(city, state);
CREATE INDEX IF NOT EXISTS idx_competitor_data_category ON competitor_data(category);
CREATE INDEX IF NOT EXISTS idx_competitor_data_rating ON competitor_data(rating);
CREATE INDEX IF NOT EXISTS idx_competitor_data_external ON competitor_data(external_id);

-- Create social_media_posts table for tracking relevant posts
CREATE TABLE IF NOT EXISTS social_media_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id VARCHAR(255), -- Platform-specific post ID
  platform VARCHAR(50) CHECK (platform IN ('instagram', 'tiktok', 'google_reviews', 'yelp', 'facebook', 'twitter')),
  author VARCHAR(255),
  content TEXT,
  hashtags JSONB,
  engagement JSONB, -- likes, comments, shares
  location JSONB, -- city, state, coordinates
  procedure_type VARCHAR(100),
  sentiment VARCHAR(20) CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  posted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for social media posts
CREATE INDEX IF NOT EXISTS idx_social_media_posts_platform ON social_media_posts(platform);
CREATE INDEX IF NOT EXISTS idx_social_media_posts_procedure ON social_media_posts(procedure_type);
CREATE INDEX IF NOT EXISTS idx_social_media_posts_location ON social_media_posts USING GIN(location);
CREATE INDEX IF NOT EXISTS idx_social_media_posts_posted ON social_media_posts(posted_at);

-- Create market_trends table for tracking procedure trends
CREATE TABLE IF NOT EXISTS market_trends (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  procedure VARCHAR(255) NOT NULL,
  region VARCHAR(255) NOT NULL,
  trend VARCHAR(20) CHECK (trend IN ('increasing', 'decreasing', 'stable')),
  change_percentage DECIMAL(5, 2),
  timeframe VARCHAR(100),
  key_factors JSONB,
  data_points JSONB, -- Historical data points
  confidence_score DECIMAL(3, 2) CHECK (confidence_score BETWEEN 0 AND 1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for market trends
CREATE INDEX IF NOT EXISTS idx_market_trends_procedure ON market_trends(procedure);
CREATE INDEX IF NOT EXISTS idx_market_trends_region ON market_trends(region);
CREATE INDEX IF NOT EXISTS idx_market_trends_trend ON market_trends(trend);

-- Create local_influencers table for tracking social media influencers
CREATE TABLE IF NOT EXISTS local_influencers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  platform VARCHAR(50) CHECK (platform IN ('instagram', 'tiktok', 'youtube', 'facebook', 'twitter')),
  followers INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5, 2),
  location JSONB, -- city, state, region
  categories JSONB, -- dental, aesthetic, beauty, health, etc.
  bio TEXT,
  profile_url VARCHAR(500),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for local influencers
CREATE INDEX IF NOT EXISTS idx_local_influencers_platform ON local_influencers(platform);
CREATE INDEX IF NOT EXISTS idx_local_influencers_followers ON local_influencers(followers);
CREATE INDEX IF NOT EXISTS idx_local_influencers_location ON local_influencers USING GIN(location);

-- Insert sample regional insights data
INSERT INTO regional_insights (region, market_sentiment, trends, competitor_count, influencer_count, demographics) VALUES
('New York, NY', 'positive', 
 '[
   {
     "procedure": "Dental Implants",
     "trend": "increasing",
     "changePercentage": 15.3,
     "timeframe": "last 6 months",
     "keyFactors": ["Aging population", "Insurance coverage expansion", "Social media awareness"]
   },
   {
     "procedure": "Botox Treatments",
     "trend": "increasing", 
     "changePercentage": 22.1,
     "timeframe": "last 3 months",
     "keyFactors": ["TikTok influence", "Preventative treatments trend", "Male market growth"]
   }
 ]'::jsonb,
 47, 8,
 '{
   "ageGroups": {"18-24": 12.5, "25-34": 18.2, "35-44": 22.1, "45-54": 20.3, "55-64": 15.8, "65+": 11.1},
   "incomeLevel": "high",
   "education": {"High School": 25.3, "Some College": 28.7, "Bachelor''s": 32.1, "Graduate": 13.9}
 }'::jsonb),

('Los Angeles, CA', 'positive',
 '[
   {
     "procedure": "Aesthetic Treatments",
     "trend": "increasing",
     "changePercentage": 28.7,
     "timeframe": "last 4 months", 
     "keyFactors": ["Celebrity influence", "Social media trends", "Year-round events"]
   },
   {
     "procedure": "Cosmetic Dentistry",
     "trend": "increasing",
     "changePercentage": 19.4,
     "timeframe": "last 6 months",
     "keyFactors": ["Hollywood influence", "Zoom meetings", "Professional headshots"]
   }
 ]'::jsonb,
 52, 15,
 '{
   "ageGroups": {"18-24": 15.1, "25-34": 22.8, "35-44": 21.3, "45-54": 18.7, "55-64": 13.9, "65+": 8.2},
   "incomeLevel": "high",
   "education": {"High School": 22.1, "Some College": 31.4, "Bachelor''s": 28.9, "Graduate": 17.6}
 }'::jsonb),

('Miami, FL', 'positive',
 '[
   {
     "procedure": "Brazilian Butt Lift",
     "trend": "increasing",
     "changePercentage": 35.2,
     "timeframe": "last 3 months",
     "keyFactors": ["Medical tourism", "International clientele", "Social media influence"]
   },
   {
     "procedure": "Dental Veneers", 
     "trend": "increasing",
     "changePercentage": 24.6,
     "timeframe": "last 4 months",
     "keyFactors": ["Instagram influence", "Beach lifestyle", "Tourism industry"]
   }
 ]'::jsonb,
 38, 12,
 '{
   "ageGroups": {"18-24": 16.3, "25-34": 24.7, "35-44": 19.8, "45-54": 17.2, "55-64": 14.1, "65+": 7.9},
   "incomeLevel": "medium",
   "education": {"High School": 28.6, "Some College": 29.3, "Bachelor''s": 26.7, "Graduate": 15.4}
 }'::jsonb);

-- Insert sample competitor data
INSERT INTO competitor_data (external_id, name, address, city, state, category, rating, review_count, price_level) VALUES
('gp_ny_001', 'Manhattan Dental Implant Center', '123 Park Ave, New York, NY 10017', 'New York', 'NY', 'dental_practice', 4.8, 342, 4),
('gp_ny_002', 'Fifth Avenue Medical Spa', '456 5th Ave, New York, NY 10018', 'New York', 'NY', 'medical_spa', 4.6, 278, 4),
('gp_la_001', 'Beverly Hills Cosmetic Surgery', '789 Rodeo Dr, Beverly Hills, CA 90210', 'Beverly Hills', 'CA', 'plastic_surgery', 4.9, 156, 4),
('gp_la_002', 'West Hollywood Dermatology', '321 Sunset Blvd, West Hollywood, CA 90069', 'West Hollywood', 'CA', 'dermatology', 4.7, 203, 3);

-- Insert sample social media posts
INSERT INTO social_media_posts (external_id, platform, author, content, hashtags, engagement, location, procedure_type, sentiment, posted_at) VALUES
('ig_001', 'instagram', 'drsmilenyc', 'Amazing dental implant transformation! 🦷✨', '["dental", "implants", "transformation", "nyc"]'::jsonb, '{"likes": 1247, "comments": 89, "shares": 23}'::jsonb, '{"city": "New York", "state": "NY"}'::jsonb, 'dental_implants', 'positive', CURRENT_TIMESTAMP - INTERVAL '2 days'),
('tiktok_001', 'tiktok', 'botoxqueen_miami', 'Quick botox touch-up before the weekend! 💉', '["botox", "aesthetic", "miami", "skincare"]'::jsonb, '{"likes": 2341, "comments": 156, "shares": 78}'::jsonb, '{"city": "Miami", "state": "FL"}'::jsonb, 'botox', 'positive', CURRENT_TIMESTAMP - INTERVAL '1 day'),
('ig_002', 'instagram', 'la_aesthetics', 'Dermal filler results that look completely natural ✨', '["fillers", "natural", "la", "beauty"]'::jsonb, '{"likes": 892, "comments": 67, "shares": 34}'::jsonb, '{"city": "Los Angeles", "state": "CA"}'::jsonb, 'fillers', 'positive', CURRENT_TIMESTAMP - INTERVAL '3 hours');

-- Insert sample market trends
INSERT INTO market_trends (procedure, region, trend, change_percentage, timeframe, key_factors, confidence_score) VALUES
('Dental Implants', 'New York, NY', 'increasing', 15.30, 'last 6 months', '["Aging population", "Insurance coverage", "Technology advances"]'::jsonb, 0.87),
('Botox', 'Los Angeles, CA', 'increasing', 22.40, 'last 3 months', '["Celebrity influence", "Preventative trend", "Social media"]'::jsonb, 0.92),
('Teeth Whitening', 'Miami, FL', 'stable', 3.20, 'last year', '["Seasonal tourism", "At-home options", "Professional treatments"]'::jsonb, 0.76),
('Brazilian Butt Lift', 'Miami, FL', 'increasing', 35.20, 'last 3 months', '["Medical tourism", "Social media trends", "International clients"]'::jsonb, 0.84);

-- Insert sample local influencers
INSERT INTO local_influencers (username, platform, followers, engagement_rate, location, categories, verified) VALUES
('drsmilenyc', 'instagram', 45300, 3.8, '{"city": "New York", "state": "NY", "region": "Northeast"}'::jsonb, '["dental", "health", "smile"]'::jsonb, TRUE),
('aestheticqueen_ny', 'tiktok', 127800, 7.2, '{"city": "New York", "state": "NY", "region": "Northeast"}'::jsonb, '["aesthetic", "beauty", "skincare"]'::jsonb, FALSE),
('botox_beverlyhills', 'instagram', 89400, 4.1, '{"city": "Beverly Hills", "state": "CA", "region": "West Coast"}'::jsonb, '["botox", "aesthetic", "anti-aging"]'::jsonb, TRUE),
('miami_glow_goddess', 'tiktok', 156700, 8.5, '{"city": "Miami", "state": "FL", "region": "Southeast"}'::jsonb, '["aesthetic", "beauty", "miami", "glow"]'::jsonb, FALSE);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_regional_insights_updated_at 
    BEFORE UPDATE ON regional_insights 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_competitor_data_updated_at 
    BEFORE UPDATE ON competitor_data 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_media_posts_updated_at 
    BEFORE UPDATE ON social_media_posts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_market_trends_updated_at 
    BEFORE UPDATE ON market_trends 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_local_influencers_updated_at 
    BEFORE UPDATE ON local_influencers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();