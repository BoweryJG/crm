import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Chip, 
  Divider, 
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme
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
  Cell
} from 'recharts';
import { NYCDentalImplantMarketService, NYCDentalImplantProvider, ImplantSystemManufacturer, CBCTManufacturer } from '../../services/marketResearch/nycDentalImplantMarket';

const DentalImplantMarketDashboard: React.FC = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState<boolean>(true);
  const [providers, setProviders] = useState<NYCDentalImplantProvider[]>([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState<ImplantSystemManufacturer>(ImplantSystemManufacturer.STRAUMANN);
  
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
        // For demonstration purposes, use the sample data
        const data = NYCDentalImplantMarketService.getNYCDentalImplantProvidersSample();
        setProviders(data);
      } catch (error) {
        console.error('Error fetching dental implant providers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getTechnologyDistribution = () => {
    const techCount = {
      cbct: providers.filter(p => p.hasCBCT).length,
      intraoral: providers.filter(p => p.hasIntraoralScanner).length,
      surgical: providers.filter(p => p.hasSurgicalGuides).length,
      milling: providers.filter(p => p.hasInHouseMilling).length
    };

    return [
      { name: 'CBCT Scanner', value: techCount.cbct },
      { name: 'Intraoral Scanner', value: techCount.intraoral },
      { name: 'Surgical Guides', value: techCount.surgical },
      { name: 'In-House Milling', value: techCount.milling }
    ];
  };

  const getImplantSystemDistribution = () => {
    const counts = {};
    
    providers.forEach(provider => {
      provider.implantSystems.forEach(system => {
        counts[system] = (counts[system] || 0) + 1;
      });
    });
    
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const getCBCTManufacturerDistribution = () => {
    const counts = {};
    
    providers
      .filter(p => p.hasCBCT && p.cbctManufacturer)
      .forEach(provider => {
        counts[provider.cbctManufacturer] = (counts[provider.cbctManufacturer] || 0) + 1;
      });
    
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const getFullArchProviders = () => {
    return [
      { name: 'All-on-4', value: providers.filter(p => p.offersAllOn4).length },
      { name: 'All-on-6', value: providers.filter(p => p.offersAllOn6).length },
      { name: 'Zygomatic', value: providers.filter(p => p.offersZygomaticImplants).length },
      { name: 'Same-Day', value: providers.filter(p => p.offersSameDayImplants).length }
    ];
  };

  const getProvidersUsingSelectedImplant = () => {
    return providers.filter(p => 
      p.implantSystems.includes(selectedManufacturer)
    );
  };

  const getSpecialtyDistribution = () => {
    return [
      { name: 'Periodontist', value: providers.filter(p => p.isPeriodontist).length },
      { name: 'Prosthodontist', value: providers.filter(p => p.isProsthodontist).length },
      { name: 'Oral Surgeon', value: providers.filter(p => p.isOralSurgeon).length },
      { name: 'General Dentist', value: providers.filter(p => p.isGeneralDentist).length }
    ];
  };

  const getSocialMediaMetrics = () => {
    const data = providers
      .filter(p => p.instagramFollowers || p.facebookFollowers || p.youtubeSubscribers)
      .map(p => ({
        name: p.name.substring(0, 15) + (p.name.length > 15 ? '...' : ''),
        instagram: p.instagramFollowers || 0,
        facebook: p.facebookFollowers || 0,
        youtube: p.youtubeSubscribers || 0
      }));
    
    // Sort by total followers
    return data.sort((a, b) => 
      (b.instagram + b.facebook + b.youtube) - (a.instagram + a.facebook + a.youtube)
    ).slice(0, 5); // Top 5
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
        NYC Dental Implant Market Research Dashboard
      </Typography>

      <Grid container spacing={4}>
        {/* Technology Distribution */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', boxShadow: theme.shadows[3] }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Technology Adoption
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getTechnologyDistribution()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill={theme.palette.primary.main}
                    dataKey="value"
                  >
                    {getTechnologyDistribution().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Implant System Distribution */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', boxShadow: theme.shadows[3] }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Implant System Usage
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={getImplantSystemDistribution()}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill={theme.palette.secondary.main} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* CBCT Manufacturer Distribution */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', boxShadow: theme.shadows[3] }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                CBCT Scanner Manufacturers
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getCBCTManufacturerDistribution()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill={theme.palette.primary.main}
                    dataKey="value"
                  >
                    {getCBCTManufacturerDistribution().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Full Arch Solutions */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', boxShadow: theme.shadows[3] }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Full Arch Solutions Offered
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={getFullArchProviders()}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill={theme.palette.success.main} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Social Media Presence */}
        <Grid item xs={12}>
          <Card sx={{ boxShadow: theme.shadows[3] }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Practices by Social Media Presence
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={getSocialMediaMetrics()}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="instagram" stackId="a" fill="#E1306C" name="Instagram" />
                  <Bar dataKey="facebook" stackId="a" fill="#4267B2" name="Facebook" />
                  <Bar dataKey="youtube" stackId="a" fill="#FF0000" name="YouTube" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Specific Implant System Usage */}
        <Grid item xs={12}>
          <Card sx={{ boxShadow: theme.shadows[3] }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Practices Using Selected Implant System
                </Typography>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel id="implant-manufacturer-label">Implant Manufacturer</InputLabel>
                  <Select
                    labelId="implant-manufacturer-label"
                    value={selectedManufacturer}
                    label="Implant Manufacturer"
                    onChange={(e) => setSelectedManufacturer(e.target.value as ImplantSystemManufacturer)}
                  >
                    {Object.values(ImplantSystemManufacturer).map((manufacturer) => (
                      <MenuItem key={manufacturer} value={manufacturer}>
                        {manufacturer}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              {getProvidersUsingSelectedImplant().length === 0 ? (
                <Typography variant="body1" sx={{ textAlign: 'center', p: 3 }}>
                  No practices found using this implant system.
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {getProvidersUsingSelectedImplant().map((provider) => (
                    <Grid item xs={12} md={6} lg={4} key={provider.id}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="h6" noWrap gutterBottom>
                            {provider.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {provider.address}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1, mb: 1 }}>
                            {provider.isPeriodontist && <Chip label="Periodontist" size="small" color="primary" />}
                            {provider.isProsthodontist && <Chip label="Prosthodontist" size="small" color="secondary" />}
                            {provider.isOralSurgeon && <Chip label="Oral Surgeon" size="small" color="success" />}
                            {provider.isGeneralDentist && <Chip label="General Dentist" size="small" color="info" />}
                          </Box>
                          
                          {provider.googleRating && (
                            <Typography variant="body2">
                              Google Rating: {provider.googleRating}/5 ({provider.googleReviewCount} reviews)
                            </Typography>
                          )}
                          
                          {provider.hasCBCT && (
                            <Typography variant="body2">
                              CBCT: {provider.cbctManufacturer} {provider.cbctModel || ''}
                            </Typography>
                          )}
                          
                          {provider.hasIntraoralScanner && (
                            <Typography variant="body2">
                              Scanner: {provider.intraoralScannerManufacturer} {provider.intraoralScannerModel || ''}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DentalImplantMarketDashboard;
