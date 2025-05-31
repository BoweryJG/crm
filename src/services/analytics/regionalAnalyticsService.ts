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

  // Get local dental practices and medical spas from companies database
  async getLocalCompetitors(
    city: string, 
    state: string, 
    radius: number
  ): Promise<LocalBusinessData[]> {
    try {
      // Fetch companies from database
      const { data: companies, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching companies from database:', error);
        return this.generateFallbackCompetitors(city, state);
      }

      if (!companies || companies.length === 0) {
        console.log('No companies found in database, using fallback data');
        return this.generateFallbackCompetitors(city, state);
      }

      // Transform company data into LocalBusinessData format
      const competitors: LocalBusinessData[] = companies.map((company, index) => {
        const isDental = company.industry?.toLowerCase().includes('dental') || 
                        company.name?.toLowerCase().includes('dental') ||
                        company.description?.toLowerCase().includes('dental');
        
        const isMedSpa = company.industry?.toLowerCase().includes('aesthetic') ||
                        company.industry?.toLowerCase().includes('medical spa') ||
                        company.name?.toLowerCase().includes('spa') ||
                        company.name?.toLowerCase().includes('aesthetic');
        
        const isPlasticSurgery = company.industry?.toLowerCase().includes('plastic') ||
                               company.name?.toLowerCase().includes('plastic') ||
                               company.description?.toLowerCase().includes('surgery');
        
        const isDermatology = company.industry?.toLowerCase().includes('dermatology') ||
                             company.name?.toLowerCase().includes('dermatology') ||
                             company.name?.toLowerCase().includes('skin');

        // Determine category
        let category: LocalBusinessData['category'] = 'medical_spa';
        if (isDental) category = 'dental_practice';
        else if (isPlasticSurgery) category = 'plastic_surgery';
        else if (isDermatology) category = 'dermatology';

        // Generate realistic regional data based on the company
        const baseRating = 3.5 + Math.random() * 1.5;
        const reviewCount = Math.floor(Math.random() * 500) + 25;

        return {
          id: company.id,
          name: company.name,
          address: this.generateAddress(city, state),
          rating: Math.round(baseRating * 10) / 10,
          reviewCount,
          category,
          priceLevel: this.getPriceLevelFromCategory(category),
          photos: [`photo_${index}_1.jpg`, `photo_${index}_2.jpg`],
          recentReviews: [
            {
              rating: Math.ceil(baseRating),
              text: this.generateReviewText(category),
              author: `Patient ${index + 1}`,
              date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
            }
          ],
          coordinates: this.generateCoordinates(city)
        };
      });

      // Sort by rating and return top competitors
      return competitors
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 20);

    } catch (error) {
      console.error('Error processing companies data:', error);
      return this.generateFallbackCompetitors(city, state);
    }
  }

  // Generate realistic address for the city
  private generateAddress(city: string, state: string): string {
    const streetNumbers = [100, 250, 500, 750, 1000, 1250, 1500, 2000];
    const streetNames = ['Main St', 'Park Ave', 'Broadway', 'First St', 'Oak Dr', 'Maple Ave', 'Pine St', 'Center St'];
    
    const number = streetNumbers[Math.floor(Math.random() * streetNumbers.length)];
    const street = streetNames[Math.floor(Math.random() * streetNames.length)];
    
    return `${number} ${street}, ${city}, ${state}`;
  }

  // Get price level based on category
  private getPriceLevelFromCategory(category: LocalBusinessData['category']): number {
    switch (category) {
      case 'plastic_surgery': return 4; // Most expensive
      case 'dermatology': return 3;
      case 'medical_spa': return 3;
      case 'dental_practice': return 2;
      default: return 2;
    }
  }

  // Generate coordinates around the city center
  private generateCoordinates(city: string): { lat: number; lng: number } {
    // City center coordinates (approximate)
    const cityCoords = {
      'New York': { lat: 40.7128, lng: -74.0060 },
      'Los Angeles': { lat: 34.0522, lng: -118.2437 },
      'Chicago': { lat: 41.8781, lng: -87.6298 },
      'Houston': { lat: 29.7604, lng: -95.3698 },
      'Miami': { lat: 25.7617, lng: -80.1918 },
      'Boston': { lat: 42.3601, lng: -71.0589 },
      'Seattle': { lat: 47.6062, lng: -122.3321 },
      'San Francisco': { lat: 37.7749, lng: -122.4194 },
      'Atlanta': { lat: 33.7490, lng: -84.3880 },
      'Dallas': { lat: 32.7767, lng: -96.7970 }
    };

    const center = cityCoords[city as keyof typeof cityCoords] || cityCoords['New York'];
    
    return {
      lat: center.lat + (Math.random() - 0.5) * 0.2, // ±0.1 degree variation
      lng: center.lng + (Math.random() - 0.5) * 0.2
    };
  }

  // Generate review text based on category
  private generateReviewText(category: LocalBusinessData['category']): string {
    const reviews = {
      dental_practice: [
        'Excellent dental care and friendly staff!',
        'Great experience with my dental implants.',
        'Professional service and modern equipment.',
        'Highly recommend for cosmetic dentistry.'
      ],
      medical_spa: [
        'Amazing results from my aesthetic treatments!',
        'Relaxing atmosphere and skilled practitioners.',
        'Love the results from my facial treatments.',
        'Professional and welcoming environment.'
      ],
      plastic_surgery: [
        'Outstanding surgical results and care.',
        'Professional team and excellent outcomes.',
        'Highly skilled surgeon with great bedside manner.',
        'Exceeded my expectations in every way.'
      ],
      dermatology: [
        'Great dermatological care and treatment.',
        'Knowledgeable staff and effective treatments.',
        'Excellent skin care and professional service.',
        'Highly recommend for skin health needs.'
      ]
    };

    const categoryReviews = reviews[category] || reviews.medical_spa;
    return categoryReviews[Math.floor(Math.random() * categoryReviews.length)];
  }

  // Fallback competitors if database is unavailable
  private generateFallbackCompetitors(city: string, state: string): LocalBusinessData[] {
    const fallbackCompanies = [
      { name: `${city} Dental Excellence`, industry: 'Dental', description: 'Premium dental care' },
      { name: `${city} Aesthetic Center`, industry: 'Medical Spa', description: 'Advanced aesthetic treatments' },
      { name: `${city} Dermatology Associates`, industry: 'Dermatology', description: 'Complete skin care' }
    ];

    return fallbackCompanies.map((company, index) => ({
      id: `fallback_${index}`,
      name: company.name,
      address: this.generateAddress(city, state),
      rating: 3.5 + Math.random() * 1.5,
      reviewCount: Math.floor(Math.random() * 200) + 50,
      category: 'dental_practice' as LocalBusinessData['category'],
      priceLevel: 2,
      photos: [`photo_${index}_1.jpg`, `photo_${index}_2.jpg`],
      recentReviews: [
        {
          rating: 5,
          text: 'Excellent service and results!',
          author: 'Happy Patient',
          date: new Date().toISOString()
        }
      ],
      coordinates: this.generateCoordinates(city)
    }));
  }

  // Simulate social media trends analysis
  async getSocialMediaTrends(city: string, state: string): Promise<SocialMediaPost[]> {
    // In production, this would integrate with actual APIs
    return this.generateMockSocialMediaData(city, state);
  }

  // Get market trends for dental and aesthetic procedures from database
  async getMarketTrends(city: string, state: string): Promise<MarketTrend[]> {
    try {
      // Fetch top dental procedures by growth rate
      const { data: dentalProcedures, error: dentalError } = await supabase
        .from('dental_procedures')
        .select('procedure_name, yearly_growth_percentage, market_size_usd_millions, category')
        .not('yearly_growth_percentage', 'is', null)
        .order('yearly_growth_percentage', { ascending: false })
        .limit(5);

      if (dentalError) {
        console.error('Error fetching dental procedures:', dentalError);
      }

      // Fetch top aesthetic procedures by growth rate
      const { data: aestheticProcedures, error: aestheticError } = await supabase
        .from('aesthetic_procedures')
        .select('procedure_name, yearly_growth_percentage, market_size_usd_millions, category')
        .not('yearly_growth_percentage', 'is', null)
        .order('yearly_growth_percentage', { ascending: false })
        .limit(5);

      if (aestheticError) {
        console.error('Error fetching aesthetic procedures:', aestheticError);
      }

      const trends: MarketTrend[] = [];

      // Process dental procedures
      if (dentalProcedures) {
        dentalProcedures.forEach(procedure => {
          const growthRate = procedure.yearly_growth_percentage || 0;
          trends.push({
            procedure: procedure.procedure_name,
            trend: growthRate > 10 ? 'increasing' : growthRate > 0 ? 'stable' : 'decreasing',
            changePercentage: Number(growthRate.toFixed(1)),
            timeframe: 'annual growth rate',
            region: `${city}, ${state}`,
            keyFactors: this.getDentalTrendFactors(procedure.procedure_name, procedure.category)
          });
        });
      }

      // Process aesthetic procedures
      if (aestheticProcedures) {
        aestheticProcedures.forEach(procedure => {
          const growthRate = procedure.yearly_growth_percentage || 0;
          trends.push({
            procedure: procedure.procedure_name,
            trend: growthRate > 10 ? 'increasing' : growthRate > 0 ? 'stable' : 'decreasing',
            changePercentage: Number(growthRate.toFixed(1)),
            timeframe: 'annual growth rate',
            region: `${city}, ${state}`,
            keyFactors: this.getAestheticTrendFactors(procedure.procedure_name, procedure.category)
          });
        });
      }

      // Sort by growth rate and return top 8
      return trends
        .sort((a, b) => b.changePercentage - a.changePercentage)
        .slice(0, 8);

    } catch (error) {
      console.error('Error fetching market trends from database:', error);
      // Fallback to sample data if database fails
      return this.getFallbackTrends(city, state);
    }
  }

  // Get trend factors based on procedure type
  private getDentalTrendFactors(procedureName: string, category: string): string[] {
    const lowerName = procedureName.toLowerCase();
    const factors: string[] = [];

    if (lowerName.includes('implant')) {
      factors.push('Aging population', 'Insurance coverage expansion', 'Technology advances');
    } else if (lowerName.includes('whitening') || lowerName.includes('cosmetic')) {
      factors.push('Social media influence', 'Celebrity trends', 'Professional appearance');
    } else if (lowerName.includes('orthodontic') || lowerName.includes('braces')) {
      factors.push('Adult treatment growth', 'Clear aligner popularity', 'Remote monitoring');
    } else if (category?.toLowerCase().includes('digital')) {
      factors.push('Digital transformation', 'AI integration', 'Precision medicine');
    } else {
      factors.push('Healthcare awareness', 'Prevention focus', 'Insurance coverage');
    }

    return factors;
  }

  private getAestheticTrendFactors(procedureName: string, category: string): string[] {
    const lowerName = procedureName.toLowerCase();
    const factors: string[] = [];

    if (lowerName.includes('botox') || lowerName.includes('neurotoxin')) {
      factors.push('TikTok influence', 'Preventative treatments', 'Male market growth');
    } else if (lowerName.includes('filler') || lowerName.includes('hyaluronic')) {
      factors.push('Natural look trend', 'Celebrity influence', 'Younger demographics');
    } else if (lowerName.includes('laser') || lowerName.includes('light')) {
      factors.push('Technology advances', 'Minimal downtime', 'Precision treatment');
    } else if (lowerName.includes('facial') || lowerName.includes('skin')) {
      factors.push('Wellness trend', 'Self-care focus', 'Instagram influence');
    } else if (lowerName.includes('body') || lowerName.includes('sculpting')) {
      factors.push('Body positivity movement', 'Non-surgical options', 'Quick recovery');
    } else {
      factors.push('Beauty industry growth', 'Social media awareness', 'Technology innovation');
    }

    return factors;
  }

  // Fallback trends if database is unavailable
  private getFallbackTrends(city: string, state: string): MarketTrend[] {
    return [
      {
        procedure: 'Dental Implants',
        trend: 'increasing',
        changePercentage: 15.3,
        timeframe: 'annual growth rate',
        region: `${city}, ${state}`,
        keyFactors: ['Aging population', 'Insurance coverage expansion', 'Technology advances']
      },
      {
        procedure: 'Botox Treatments',
        trend: 'increasing',
        changePercentage: 22.1,
        timeframe: 'annual growth rate',
        region: `${city}, ${state}`,
        keyFactors: ['TikTok influence', 'Preventative treatments', 'Male market growth']
      }
    ];
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