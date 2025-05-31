import { supabase } from '../supabase/supabase';

export interface SocialMediaPost {
  id: string;
  platform: 'instagram' | 'tiktok' | 'google_reviews' | 'yelp';
  author: string;
  content: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  location: {
    city: string;
    state: string;
    coordinates?: { lat: number; lng: number };
  };
  hashtags: string[];
  createdAt: string;
  procedureType?: 'dental_implants' | 'cosmetic_dentistry' | 'aesthetic_treatments' | 'botox' | 'fillers';
}

export interface LocalBusinessData {
  id: string;
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  category: 'dental_practice' | 'medical_spa' | 'plastic_surgery' | 'dermatology';
  priceLevel?: number;
  photos: string[];
  recentReviews: Array<{
    rating: number;
    text: string;
    author: string;
    date: string;
  }>;
  coordinates: { lat: number; lng: number };
}

export interface MarketTrend {
  procedure: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  changePercentage: number;
  timeframe: string;
  region: string;
  keyFactors: string[];
}

export interface RegionalInsight {
  region: string;
  marketSentiment: 'positive' | 'neutral' | 'negative';
  topTrends: MarketTrend[];
  competitorActivity: LocalBusinessData[];
  socialInfluencers: Array<{
    username: string;
    platform: string;
    followers: number;
    engagement: number;
    recentPosts: SocialMediaPost[];
  }>;
  demographics: {
    ageGroups: Record<string, number>;
    incomeLevel: 'high' | 'medium' | 'low';
    education: Record<string, number>;
  };
}

class RegionalAnalyticsService {
  private googlePlacesApiKey: string;
  private yelpApiKey: string;
  
  constructor() {
    this.googlePlacesApiKey = process.env.REACT_APP_GOOGLE_PLACES_API_KEY || '';
    this.yelpApiKey = process.env.REACT_APP_YELP_API_KEY || '';
  }

  // Get comprehensive regional analytics for a specific area
  async getRegionalAnalytics(
    city: string, 
    state: string, 
    radius: number = 25
  ): Promise<RegionalInsight> {
    try {
      const [
        competitorData,
        socialTrends,
        marketTrends,
        demographics
      ] = await Promise.all([
        this.getLocalCompetitors(city, state, radius),
        this.getSocialMediaTrends(city, state),
        this.getMarketTrends(city, state),
        this.getDemographicData(city, state)
      ]);

      const insight: RegionalInsight = {
        region: `${city}, ${state}`,
        marketSentiment: this.calculateMarketSentiment(socialTrends, competitorData),
        topTrends: marketTrends,
        competitorActivity: competitorData,
        socialInfluencers: await this.getLocalInfluencers(city, state),
        demographics
      };

      // Store insights in database
      await this.storeRegionalInsight(insight);

      return insight;
    } catch (error) {
      console.error('Error fetching regional analytics:', error);
      throw error;
    }
  }

  // Get local dental practices and medical spas using Google Places API
  async getLocalCompetitors(
    city: string, 
    state: string, 
    radius: number
  ): Promise<LocalBusinessData[]> {
    const searchQueries = [
      'dental implants',
      'cosmetic dentistry',
      'medical spa',
      'dermatology clinic',
      'plastic surgery',
      'aesthetic clinic'
    ];

    const competitors: LocalBusinessData[] = [];

    for (const query of searchQueries) {
      try {
        // In a real implementation, you would call the Google Places API
        // For now, we'll simulate with realistic data
        const mockCompetitors = this.generateMockCompetitorData(city, state, query);
        competitors.push(...mockCompetitors);
      } catch (error) {
        console.error(`Error fetching competitors for ${query}:`, error);
      }
    }

    return competitors.slice(0, 20); // Return top 20 competitors
  }

  // Simulate social media trends analysis
  async getSocialMediaTrends(city: string, state: string): Promise<SocialMediaPost[]> {
    // In production, this would integrate with actual APIs
    return this.generateMockSocialMediaData(city, state);
  }

  // Get market trends for dental and aesthetic procedures
  async getMarketTrends(city: string, state: string): Promise<MarketTrend[]> {
    const trends: MarketTrend[] = [
      {
        procedure: 'Dental Implants',
        trend: 'increasing',
        changePercentage: 15.3,
        timeframe: 'last 6 months',
        region: `${city}, ${state}`,
        keyFactors: ['Aging population', 'Insurance coverage expansion', 'Social media awareness']
      },
      {
        procedure: 'Botox Treatments',
        trend: 'increasing',
        changePercentage: 22.1,
        timeframe: 'last 3 months',
        region: `${city}, ${state}`,
        keyFactors: ['TikTok influence', 'Preventative treatments trend', 'Male market growth']
      },
      {
        procedure: 'Teeth Whitening',
        trend: 'stable',
        changePercentage: 3.2,
        timeframe: 'last year',
        region: `${city}, ${state}`,
        keyFactors: ['At-home options', 'Professional treatments', 'Wedding season']
      },
      {
        procedure: 'Dermal Fillers',
        trend: 'increasing',
        changePercentage: 18.7,
        timeframe: 'last 4 months',
        region: `${city}, ${state}`,
        keyFactors: ['Natural look trend', 'Celebrity influence', 'Younger demographics']
      }
    ];

    return trends;
  }

  // Get demographic data for the region
  async getDemographicData(city: string, state: string) {
    // In production, integrate with Census API or demographic services
    return {
      ageGroups: {
        '18-24': 12.5,
        '25-34': 18.2,
        '35-44': 22.1,
        '45-54': 20.3,
        '55-64': 15.8,
        '65+': 11.1
      },
      incomeLevel: 'high' as const,
      education: {
        'High School': 25.3,
        'Some College': 28.7,
        'Bachelor\'s': 32.1,
        'Graduate': 13.9
      }
    };
  }

  // Get local influencers in dental/aesthetic space
  async getLocalInfluencers(city: string, state: string) {
    // Mock data - in production would use social media APIs
    return [
      {
        username: 'drsmilenyc',
        platform: 'instagram',
        followers: 45300,
        engagement: 3.8,
        recentPosts: []
      },
      {
        username: 'aestheticqueen_ny',
        platform: 'tiktok',
        followers: 127800,
        engagement: 7.2,
        recentPosts: []
      }
    ];
  }

  // Calculate overall market sentiment
  private calculateMarketSentiment(
    socialPosts: SocialMediaPost[], 
    competitors: LocalBusinessData[]
  ): 'positive' | 'neutral' | 'negative' {
    const avgRating = competitors.reduce((sum, comp) => sum + comp.rating, 0) / competitors.length;
    const avgEngagement = socialPosts.reduce((sum, post) => sum + post.engagement.likes, 0) / socialPosts.length;

    if (avgRating > 4.2 && avgEngagement > 100) return 'positive';
    if (avgRating < 3.5 || avgEngagement < 50) return 'negative';
    return 'neutral';
  }

  // Store regional insights in database
  private async storeRegionalInsight(insight: RegionalInsight) {
    try {
      const { data, error } = await supabase
        .from('regional_insights')
        .upsert({
          region: insight.region,
          market_sentiment: insight.marketSentiment,
          trends: insight.topTrends,
          competitor_count: insight.competitorActivity.length,
          influencer_count: insight.socialInfluencers.length,
          demographics: insight.demographics,
          last_updated: new Date().toISOString()
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error storing regional insight:', error);
    }
  }

  // Generate realistic mock data for competitors
  private generateMockCompetitorData(city: string, state: string, query: string): LocalBusinessData[] {
    const businessNames = {
      'dental implants': ['Advanced Implant Center', 'Premier Dental Implants', 'Smile Restoration'],
      'cosmetic dentistry': ['Aesthetic Dental Studio', 'Perfect Smile Center', 'Cosmetic Dental Arts'],
      'medical spa': ['Rejuvenation Med Spa', 'Luxe Aesthetics', 'Elite Medical Spa'],
      'dermatology clinic': ['Skin Health Center', 'Dermatology Associates', 'Clear Skin Clinic'],
      'plastic surgery': ['Plastic Surgery Institute', 'Aesthetic Surgery Center', 'Beauty & Body'],
      'aesthetic clinic': ['Aesthetic Medicine Center', 'Beauty Enhancement Clinic', 'Glow Aesthetics']
    };

    const names = businessNames[query as keyof typeof businessNames] || ['Medical Center'];
    
    return names.map((name, index) => ({
      id: `${query.replace(' ', '_')}_${index}`,
      name: `${city} ${name}`,
      address: `${Math.floor(Math.random() * 999) + 100} Main St, ${city}, ${state}`,
      rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
      reviewCount: Math.floor(Math.random() * 500) + 50,
      category: this.getCategoryFromQuery(query),
      priceLevel: Math.floor(Math.random() * 4) + 1,
      photos: [`photo_${index}_1.jpg`, `photo_${index}_2.jpg`],
      recentReviews: [
        {
          rating: 5,
          text: 'Excellent service and results!',
          author: 'Happy Patient',
          date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      ],
      coordinates: {
        lat: 40.7128 + (Math.random() - 0.5) * 0.2,
        lng: -74.0060 + (Math.random() - 0.5) * 0.2
      }
    }));
  }

  private getCategoryFromQuery(query: string): LocalBusinessData['category'] {
    if (query.includes('dental')) return 'dental_practice';
    if (query.includes('spa') || query.includes('aesthetic')) return 'medical_spa';
    if (query.includes('plastic')) return 'plastic_surgery';
    if (query.includes('dermatology')) return 'dermatology';
    return 'medical_spa';
  }

  // Generate mock social media data
  private generateMockSocialMediaData(city: string, state: string): SocialMediaPost[] {
    const procedures = ['dental_implants', 'cosmetic_dentistry', 'aesthetic_treatments', 'botox', 'fillers'] as const;
    const platforms = ['instagram', 'tiktok', 'google_reviews', 'yelp'] as const;
    
    return Array.from({ length: 15 }, (_, index) => ({
      id: `post_${index}`,
      platform: platforms[Math.floor(Math.random() * platforms.length)],
      author: `user_${index}`,
      content: `Amazing results at ${city} dental clinic! #dentist #smile`,
      engagement: {
        likes: Math.floor(Math.random() * 1000) + 50,
        comments: Math.floor(Math.random() * 100) + 5,
        shares: Math.floor(Math.random() * 50) + 2
      },
      location: { city, state },
      hashtags: ['#dental', '#smile', '#aesthetic', '#beauty'],
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      procedureType: procedures[Math.floor(Math.random() * procedures.length)]
    }));
  }

  // Get street-level insights for micro-targeting
  async getStreetLevelInsights(address: string): Promise<{
    competitorDensity: number;
    averageRating: number;
    recentActivity: SocialMediaPost[];
    demographicProfile: any;
  }> {
    // Simulate street-level analysis
    return {
      competitorDensity: Math.random() * 10,
      averageRating: 3.5 + Math.random() * 1.5,
      recentActivity: await this.getSocialMediaTrends('Manhattan', 'NY'),
      demographicProfile: {
        primaryAge: '35-44',
        incomeLevel: 'high',
        interests: ['health', 'beauty', 'wellness']
      }
    };
  }
}

export default new RegionalAnalyticsService();