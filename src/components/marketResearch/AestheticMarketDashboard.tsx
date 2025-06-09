import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Chip, 
  Divider, 
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  Grid,
  Button,
  IconButton,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import {
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  YouTube as YouTubeIcon,
  Twitter as TwitterIcon,
  TrendingUp as TrendingUpIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Star as StarIcon,
  Phone as PhoneIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';

interface NYCAestheticProvider {
  id: string;
  name: string;
  address: string;
  borough: 'Manhattan' | 'Brooklyn' | 'Queens' | 'Bronx' | 'Staten Island';
  zipCode: string;
  phone?: string;
  website?: string;
  googleRating?: number;
  googleReviewCount?: number;
  
  // Specialties
  offersInjectables: boolean;
  offersBotox: boolean;
  offersDermalFillers: boolean;
  offersLaserTreatments: boolean;
  offersCoolSculpting: boolean;
  offersPlasticSurgery: boolean;
  offersSkinRejuvenation: boolean;
  offersBBL: boolean;
  offersThreadLifts: boolean;
  offersHydraFacial: boolean;
  
  // Social Media Presence
  instagramFollowers?: number;
  instagramEngagementRate?: number;
  facebookFollowers?: number;
  youtubeSubscribers?: number;
  tiktokFollowers?: number;
  
  // Technology & Equipment
  hasLaserEquipment: boolean;
  laserManufacturer?: string;
  laserModel?: string;
  hasCoolSculptingMachine: boolean;
  hasUltherapy: boolean;
  hasThermage: boolean;
  hasIPL: boolean;
  hasMicroneedling: boolean;
  
  // Business Intelligence
  estimatedMonthlyRevenue?: number;
  averageTreatmentPrice?: number;
  primaryDemographic: 'Young Professional' | 'Middle-Aged' | 'Luxury' | 'General' | 'Celebrity';
  marketingStrategy: 'Social Media Heavy' | 'Traditional' | 'Referral Based' | 'Mixed';
  competitiveAdvantage?: string;
  
  // Staff & Credentials
  boardCertifiedDermatologist: boolean;
  boardCertifiedPlasticSurgeon: boolean;
  numProviders: number;
  numNurseInjectors: number;
  
  // Recent Activity & Opportunities
  recentExpansion?: boolean;
  lookingForNewEquipment?: boolean;
  recentlyHired?: boolean;
  socialMediaGrowthTrend: 'Growing' | 'Stable' | 'Declining';
  businessOpportunities?: string[];
}

enum AestheticTreatmentCategory {
  INJECTABLES = 'Injectables',
  LASER_TREATMENTS = 'Laser Treatments',
  BODY_CONTOURING = 'Body Contouring',
  SKIN_REJUVENATION = 'Skin Rejuvenation',
  PLASTIC_SURGERY = 'Plastic Surgery'
}

const AestheticMarketDashboard: React.FC = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState<boolean>(true);
  const [providers, setProviders] = useState<NYCAestheticProvider[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<AestheticTreatmentCategory>(AestheticTreatmentCategory.INJECTABLES);
  const [selectedBorough, setSelectedBorough] = useState<string>('All');
  
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    '#8884d8',
    '#82ca9d',
    '#ffc658',
    '#8dd1e1'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // For demonstration, using sample NYC aesthetic market data
        const sampleData = generateSampleAestheticProviders();
        setProviders(sampleData);
      } catch (error) {
        console.error('Error fetching aesthetic market data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const generateSampleAestheticProviders = (): NYCAestheticProvider[] => {
    return [
      {
        id: '1',
        name: 'Manhattan Aesthetic Institute',
        address: '123 Park Avenue, New York, NY 10016',
        borough: 'Manhattan',
        zipCode: '10016',
        phone: '(212) 555-0123',
        website: 'manhattanaesthetic.com',
        googleRating: 4.8,
        googleReviewCount: 342,
        offersInjectables: true,
        offersBotox: true,
        offersDermalFillers: true,
        offersLaserTreatments: true,
        offersCoolSculpting: true,
        offersPlasticSurgery: false,
        offersSkinRejuvenation: true,
        offersBBL: false,
        offersThreadLifts: true,
        offersHydraFacial: true,
        instagramFollowers: 15000,
        instagramEngagementRate: 3.2,
        facebookFollowers: 8000,
        youtubeSubscribers: 2500,
        tiktokFollowers: 12000,
        hasLaserEquipment: true,
        laserManufacturer: 'Cynosure',
        laserModel: 'PicoSure',
        hasCoolSculptingMachine: true,
        hasUltherapy: true,
        hasThermage: false,
        hasIPL: true,
        hasMicroneedling: true,
        estimatedMonthlyRevenue: 850000,
        averageTreatmentPrice: 650,
        primaryDemographic: 'Young Professional',
        marketingStrategy: 'Social Media Heavy',
        competitiveAdvantage: 'Latest technology and celebrity clientele',
        boardCertifiedDermatologist: true,
        boardCertifiedPlasticSurgeon: false,
        numProviders: 3,
        numNurseInjectors: 5,
        recentExpansion: true,
        lookingForNewEquipment: false,
        recentlyHired: true,
        socialMediaGrowthTrend: 'Growing',
        businessOpportunities: ['New laser equipment', 'Staff training programs', 'Social media content tools']
      },
      {
        id: '2', 
        name: 'Brooklyn Beauty Bar',
        address: '456 Court Street, Brooklyn, NY 11231',
        borough: 'Brooklyn',
        zipCode: '11231',
        phone: '(718) 555-0456',
        googleRating: 4.6,
        googleReviewCount: 198,
        offersInjectables: true,
        offersBotox: true,
        offersDermalFillers: true,
        offersLaserTreatments: false,
        offersCoolSculpting: false,
        offersPlasticSurgery: false,
        offersSkinRejuvenation: true,
        offersBBL: false,
        offersThreadLifts: false,
        offersHydraFacial: true,
        instagramFollowers: 8500,
        instagramEngagementRate: 4.1,
        facebookFollowers: 3200,
        tiktokFollowers: 6800,
        hasLaserEquipment: false,
        hasCoolSculptingMachine: false,
        hasUltherapy: false,
        hasThermage: false,
        hasIPL: false,
        hasMicroneedling: true,
        estimatedMonthlyRevenue: 180000,
        averageTreatmentPrice: 320,
        primaryDemographic: 'General',
        marketingStrategy: 'Social Media Heavy',
        boardCertifiedDermatologist: false,
        boardCertifiedPlasticSurgeon: false,
        numProviders: 1,
        numNurseInjectors: 2,
        recentExpansion: false,
        lookingForNewEquipment: true,
        recentlyHired: false,
        socialMediaGrowthTrend: 'Growing',
        businessOpportunities: ['Laser equipment purchase', 'Staff expansion', 'Advanced training certifications']
      },
      {
        id: '3',
        name: 'Upper East Side Dermatology',
        address: '789 Madison Avenue, New York, NY 10065',
        borough: 'Manhattan',
        zipCode: '10065',
        phone: '(212) 555-0789',
        website: 'uesdermatology.com',
        googleRating: 4.9,
        googleReviewCount: 567,
        offersInjectables: true,
        offersBotox: true,
        offersDermalFillers: true,
        offersLaserTreatments: true,
        offersCoolSculpting: true,
        offersPlasticSurgery: true,
        offersSkinRejuvenation: true,
        offersBBL: true,
        offersThreadLifts: true,
        offersHydraFacial: true,
        instagramFollowers: 25000,
        instagramEngagementRate: 2.8,
        facebookFollowers: 12000,
        youtubeSubscribers: 8500,
        tiktokFollowers: 18000,
        hasLaserEquipment: true,
        laserManufacturer: 'Candela',
        laserModel: 'GentleMax Pro',
        hasCoolSculptingMachine: true,
        hasUltherapy: true,
        hasThermage: true,
        hasIPL: true,
        hasMicroneedling: true,
        estimatedMonthlyRevenue: 1200000,
        averageTreatmentPrice: 850,
        primaryDemographic: 'Luxury',
        marketingStrategy: 'Referral Based',
        competitiveAdvantage: 'Board-certified specialists and luxury experience',
        boardCertifiedDermatologist: true,
        boardCertifiedPlasticSurgeon: true,
        numProviders: 5,
        numNurseInjectors: 8,
        recentExpansion: false,
        lookingForNewEquipment: false,
        recentlyHired: false,
        socialMediaGrowthTrend: 'Stable',
        businessOpportunities: ['VIP patient programs', 'Technology upgrades', 'Expansion opportunities']
      }
    ];
  };

  const getTreatmentDistribution = () => {
    const treatments = [
      { name: 'Injectables', value: providers.filter(p => p.offersInjectables).length },
      { name: 'Laser Treatments', value: providers.filter(p => p.offersLaserTreatments).length },
      { name: 'CoolSculpting', value: providers.filter(p => p.offersCoolSculpting).length },
      { name: 'Plastic Surgery', value: providers.filter(p => p.offersPlasticSurgery).length },
      { name: 'Thread Lifts', value: providers.filter(p => p.offersThreadLifts).length }
    ];
    return treatments;
  };

  const getBoroughDistribution = () => {
    const boroughs = ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'];
    return boroughs.map(borough => ({
      name: borough,
      value: providers.filter(p => p.borough === borough).length,
      avgRevenue: providers
        .filter(p => p.borough === borough && p.estimatedMonthlyRevenue)
        .reduce((sum, p) => sum + (p.estimatedMonthlyRevenue || 0), 0) / 
        Math.max(1, providers.filter(p => p.borough === borough && p.estimatedMonthlyRevenue).length)
    }));
  };

  const getSocialMediaLeaders = () => {
    return providers
      .filter(p => p.instagramFollowers || p.facebookFollowers || p.tiktokFollowers)
      .map(p => ({
        name: p.name.substring(0, 20) + (p.name.length > 20 ? '...' : ''),
        fullName: p.name,
        instagram: p.instagramFollowers || 0,
        facebook: p.facebookFollowers || 0,
        tiktok: p.tiktokFollowers || 0,
        engagement: p.instagramEngagementRate || 0,
        totalFollowers: (p.instagramFollowers || 0) + (p.facebookFollowers || 0) + (p.tiktokFollowers || 0),
        revenue: p.estimatedMonthlyRevenue,
        opportunities: p.businessOpportunities
      }))
      .sort((a, b) => b.totalFollowers - a.totalFollowers)
      .slice(0, 5);
  };

  const getRevenueAnalysis = () => {
    return providers
      .filter(p => p.estimatedMonthlyRevenue)
      .map(p => ({
        name: p.name.substring(0, 15) + '...',
        revenue: p.estimatedMonthlyRevenue,
        avgPrice: p.averageTreatmentPrice,
        demographic: p.primaryDemographic,
        growth: p.socialMediaGrowthTrend
      }))
      .sort((a, b) => (b.revenue || 0) - (a.revenue || 0));
  };

  const getBusinessOpportunities = () => {
    const opportunities = providers.flatMap(p => p.businessOpportunities || []);
    const counts: Record<string, number> = {};
    opportunities.forEach(opp => {
      counts[opp] = (counts[opp] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([opportunity, count]) => ({ opportunity, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, backgroundColor: theme.palette.background.default }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, color: theme.palette.primary.main }}>
        NYC Aesthetic Market Intelligence Dashboard
      </Typography>

      {/* Market Overview Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', boxShadow: theme.shadows[3] }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <BusinessIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="h4" color="primary">
                  {providers.length}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total Aesthetic Practices
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', boxShadow: theme.shadows[3] }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <MoneyIcon sx={{ mr: 1, color: theme.palette.success.main }} />
                <Typography variant="h4" color="success.main">
                  ${Math.round(providers.reduce((sum, p) => sum + (p.estimatedMonthlyRevenue || 0), 0) / 1000000)}M
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total Monthly Market Revenue
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', boxShadow: theme.shadows[3] }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <InstagramIcon sx={{ mr: 1, color: '#E1306C' }} />
                <Typography variant="h4" style={{ color: '#E1306C' }}>
                  {Math.round(providers.reduce((sum, p) => sum + (p.instagramFollowers || 0), 0) / 1000)}K
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total Instagram Followers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', boxShadow: theme.shadows[3] }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUpIcon sx={{ mr: 1, color: theme.palette.warning.main }} />
                <Typography variant="h4" color="warning.main">
                  {providers.filter(p => p.socialMediaGrowthTrend === 'Growing').length}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Growing Practices
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
        {/* Treatment Distribution */}
        <Box>
          <Card sx={{ height: '100%', boxShadow: theme.shadows[3] }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Popular Treatments in NYC
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getTreatmentDistribution()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill={theme.palette.primary.main} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>

        {/* Borough Distribution */}
        <Box>
          <Card sx={{ height: '100%', boxShadow: theme.shadows[3] }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Market Distribution by Borough
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getBoroughDistribution()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill={theme.palette.secondary.main}
                    dataKey="value"
                  >
                    {getBoroughDistribution().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>

        {/* Social Media Leaders */}
        <Box sx={{ gridColumn: '1 / -1' }}>
          <Card sx={{ boxShadow: theme.shadows[3] }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Social Media Influence & Market Leaders
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={getSocialMediaLeaders()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'instagram' ? `${value} followers` : 
                      name === 'facebook' ? `${value} followers` :
                      name === 'tiktok' ? `${value} followers` : value,
                      name === 'instagram' ? 'Instagram' : 
                      name === 'facebook' ? 'Facebook' :
                      name === 'tiktok' ? 'TikTok' : name
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="instagram" stackId="a" fill="#E1306C" name="Instagram" />
                  <Bar dataKey="facebook" stackId="a" fill="#4267B2" name="Facebook" />
                  <Bar dataKey="tiktok" stackId="a" fill="#000000" name="TikTok" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>

        {/* Revenue Analysis */}
        <Box>
          <Card sx={{ height: '100%', boxShadow: theme.shadows[3] }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Revenue Leaders & Market Position
              </Typography>
              {getRevenueAnalysis().map((practice, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {practice.name}
                    </Typography>
                    <Chip 
                      label={practice.demographic} 
                      size="small" 
                      color={practice.demographic === 'Luxury' ? 'primary' : 'default'} 
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Monthly Revenue: ${(practice.revenue || 0).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Treatment: ${practice.avgPrice}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(practice.revenue || 0) / 12000} 
                    sx={{ mt: 1 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Box>

        {/* Business Opportunities */}
        <Box>
          <Card sx={{ height: '100%', boxShadow: theme.shadows[3] }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sales Opportunities by Category
              </Typography>
              {getBusinessOpportunities().map((opp, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {opp.opportunity}
                    </Typography>
                    <Chip 
                      label={`${opp.count} practices`} 
                      size="small" 
                      color={opp.count > 1 ? 'success' : 'default'} 
                    />
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(opp.count / providers.length) * 100} 
                    color={opp.count > 1 ? 'success' : 'primary'}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Box>

        {/* Detailed Practice Intelligence */}
        <Box sx={{ gridColumn: '1 / -1' }}>
          <Card sx={{ boxShadow: theme.shadows[3] }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Street-Level Practice Intelligence
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
                {providers.map((provider) => (
                  <Box key={provider.id}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" noWrap gutterBottom>
                          {provider.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          📍 {provider.address}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1, mb: 2 }}>
                          <Chip label={provider.borough} size="small" color="primary" />
                          <Chip label={provider.primaryDemographic} size="small" color="secondary" />
                          {provider.boardCertifiedDermatologist && (
                            <Chip label="Board Cert. Derm" size="small" color="success" />
                          )}
                        </Box>
                        
                        {/* Social Media Stats */}
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="caption" color="text.secondary">Social Media Reach:</Typography>
                          <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                            {provider.instagramFollowers && (
                              <Chip 
                                icon={<InstagramIcon />} 
                                label={`${(provider.instagramFollowers / 1000).toFixed(1)}K`} 
                                size="small" 
                                variant="outlined"
                              />
                            )}
                            {provider.tiktokFollowers && (
                              <Chip 
                                label={`TT: ${(provider.tiktokFollowers / 1000).toFixed(1)}K`} 
                                size="small" 
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </Box>

                        {/* Technology Stack */}
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="caption" color="text.secondary">Technology:</Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                            {provider.hasLaserEquipment && (
                              <Chip label={`Laser: ${provider.laserManufacturer}`} size="small" />
                            )}
                            {provider.hasCoolSculptingMachine && (
                              <Chip label="CoolSculpting" size="small" color="info" />
                            )}
                            {provider.hasUltherapy && (
                              <Chip label="Ultherapy" size="small" color="warning" />
                            )}
                          </Box>
                        </Box>

                        {/* Business Opportunities */}
                        {provider.businessOpportunities && provider.businessOpportunities.length > 0 && (
                          <Box>
                            <Typography variant="caption" color="text.secondary">Sales Opportunities:</Typography>
                            <Box sx={{ mt: 0.5 }}>
                              {provider.businessOpportunities.slice(0, 2).map((opp, i) => (
                                <Chip 
                                  key={i} 
                                  label={opp} 
                                  size="small" 
                                  color="success" 
                                  variant="outlined"
                                  sx={{ mr: 0.5, mb: 0.5 }}
                                />
                              ))}
                            </Box>
                          </Box>
                        )}

                        {/* Revenue Indicator */}
                        {provider.estimatedMonthlyRevenue && (
                          <Box sx={{ mt: 2, pt: 1, borderTop: 1, borderColor: 'divider' }}>
                            <Typography variant="caption" color="text.secondary">
                              Est. Monthly Revenue: ${(provider.estimatedMonthlyRevenue / 1000).toFixed(0)}K
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <TrendingUpIcon 
                                sx={{ 
                                  fontSize: 16, 
                                  mr: 0.5,
                                  color: provider.socialMediaGrowthTrend === 'Growing' ? 'success.main' : 'grey.500'
                                }} 
                              />
                              <Typography variant="caption">
                                {provider.socialMediaGrowthTrend} Trend
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default AestheticMarketDashboard;