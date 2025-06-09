import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
  Tabs,
  Tab,
  useTheme
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import { ResearchProject, ResearchDocument, ResearchDocumentType } from '../../types/research';
import { supabase } from '../../services/supabase/supabase';
import { DentalProceduresService, getDentalImplantInnovations } from '../../services/knowledgeBase/dentalProcedures';
import { AestheticProceduresService, getAestheticTrends } from '../../services/knowledgeBase/aestheticProcedures';
import { CompaniesService } from '../../services/knowledgeBase/companiesService';

interface MarketDataExplorerProps {
  project?: ResearchProject;
  document?: ResearchDocument;
  userId: string;
  onDocumentCreate?: (document: Omit<ResearchDocument, 'id' | 'created_at' | 'updated_at'>) => void;
}

interface MarketData {
  id: string;
  name: string;
  description: string;
  data_type: string;
  data: any;
  created_at: string;
  updated_at: string;
}

interface MarketDataset {
  id: string;
  name: string;
  description: string;
  category: string;
  region: string;
  year: number;
  data_source: string;
  created_at: string;
  updated_at: string;
}

const MarketDataExplorer: React.FC<MarketDataExplorerProps> = ({
  project,
  document,
  userId,
  onDocumentCreate
}) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [datasets, setDatasets] = useState<MarketDataset[]>([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('');
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  
  // Colors for charts
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    '#8884d8',
    '#82ca9d',
    '#ffc658'
  ];

  // Fetch available datasets
  useEffect(() => {
    fetchDatasets();
  }, []);

  // Fetch market data when dataset is selected
  useEffect(() => {
    if (selectedDatasetId) {
      fetchMarketData(selectedDatasetId);
    }
  }, [selectedDatasetId]);

  const fetchDatasets = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create synthetic datasets from knowledge base services
      const datasets: MarketDataset[] = [
        {
          id: 'dental-procedures',
          name: 'Dental Procedures',
          description: 'Comprehensive data on dental procedures, including costs, equipment, and insurance coverage',
          category: 'dental',
          region: 'Global',
          year: 2025,
          data_source: 'RepSpheres Knowledge Base',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'aesthetic-procedures',
          name: 'Aesthetic Procedures',
          description: 'Data on aesthetic procedures, including popularity, costs, and certification requirements',
          category: 'aesthetic',
          region: 'Global',
          year: 2025,
          data_source: 'RepSpheres Knowledge Base',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'companies',
          name: 'Dental & Aesthetic Companies',
          description: 'Information about companies in the dental and aesthetic industries',
          category: 'companies',
          region: 'Global',
          year: 2025,
          data_source: 'RepSpheres Knowledge Base',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'dental-innovations',
          name: 'Dental Implant Innovations',
          description: 'Latest innovations in dental implant technology',
          category: 'dental',
          region: 'Global',
          year: 2025,
          data_source: 'RepSpheres Knowledge Base',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'aesthetic-trends',
          name: 'Aesthetic Treatment Trends',
          description: 'Current trends in aesthetic treatments and procedures',
          category: 'aesthetic',
          region: 'Global',
          year: 2025,
          data_source: 'RepSpheres Knowledge Base',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'company-trends',
          name: 'Industry Trends',
          description: 'Market trends affecting dental and aesthetic companies',
          category: 'companies',
          region: 'Global',
          year: 2025,
          data_source: 'RepSpheres Knowledge Base',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      setDatasets(datasets);
      
      // Auto-select the first dataset if available
      if (datasets.length > 0 && !selectedDatasetId) {
        setSelectedDatasetId(datasets[0].id);
      }
    } catch (err) {
      console.error('Error fetching market datasets:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMarketData = async (datasetId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let data: MarketData[] = [];
      
      switch (datasetId) {
        case 'dental-procedures':
          const dentalProcedures = await DentalProceduresService.getAllProcedures();
          
          // Transform procedures into chart-friendly data
          const dentalProceduresByCategory = dentalProcedures.reduce((acc, proc) => {
            // Enrich and standardize category names based on dental specialty classifications
            let category = proc.category || 'general';
            
            // Standardize category names to match comprehensive dental classifications
            if (typeof category === 'string') {
              const normalizedCategory = category.toLowerCase().trim();
              
              // Map variations to standard categories
              if (normalizedCategory.includes('prevent') || normalizedCategory.includes('clean') || normalizedCategory.includes('hygiene')) {
                category = 'Preventive';
              } else if (normalizedCategory.includes('restor') || normalizedCategory.includes('fill') || normalizedCategory.includes('crown')) {
                category = 'Restorative';
              } else if (normalizedCategory.includes('diagnos') || normalizedCategory.includes('exam') || normalizedCategory.includes('x-ray')) {
                category = 'Diagnostic';
              } else if (normalizedCategory.includes('endodont') || normalizedCategory.includes('root canal')) {
                category = 'Endodontics';
              } else if (normalizedCategory.includes('periodont') || normalizedCategory.includes('gum') || normalizedCategory.includes('scaling')) {
                category = 'Periodontics';
              } else if (normalizedCategory.includes('prosthodont') || normalizedCategory.includes('denture') || normalizedCategory.includes('bridge')) {
                category = 'Prosthodontics';
              } else if (normalizedCategory.includes('implant')) {
                category = 'Implantology';
              } else if (normalizedCategory.includes('oral surgery') || normalizedCategory.includes('extract') || normalizedCategory.includes('surgery')) {
                category = 'Oral Surgery';
              } else if (normalizedCategory.includes('orthodont') || normalizedCategory.includes('braces') || normalizedCategory.includes('align')) {
                category = 'Orthodontics';
              } else if (normalizedCategory.includes('cosmetic') || normalizedCategory.includes('aesthetic') || normalizedCategory.includes('veneer') || normalizedCategory.includes('whitening')) {
                category = 'Cosmetic Dentistry';
              } else if (normalizedCategory.includes('pediatric') || normalizedCategory.includes('child')) {
                category = 'Pediatric Dentistry';
              } else if (normalizedCategory.includes('digital') || normalizedCategory.includes('cad') || normalizedCategory.includes('scan')) {
                category = 'Digital Dentistry';
              } else {
                // Capitalize first letter for unknown categories
                category = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
              }
            } else {
              category = 'General';
            }
            
            if (!acc[category]) {
              acc[category] = 0;
            }
            acc[category]++;
            return acc;
          }, {} as Record<string, number>);
          
          const dentalProceduresByCost = dentalProcedures
            .filter(proc => (proc.name || proc.procedure_name) && proc.averageCost?.average)
            .map(proc => ({
              name: proc.name || proc.procedure_name!,
              cost: proc.averageCost!.average
            }));
          
          data = [
            {
              id: 'dental-procedures-by-category',
              name: 'Dental Procedures by Category',
              description: 'Distribution of dental procedures across categories',
              data_type: 'pie_chart',
              data: Object.entries(dentalProceduresByCategory).map(([name, value]) => ({ name, value })),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: 'dental-procedures-by-cost',
              name: 'Dental Procedures by Cost',
              description: 'Average cost of dental procedures',
              data_type: 'bar_chart',
              data: dentalProceduresByCost.sort((a, b) => b.cost - a.cost).slice(0, 10),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ];
          break;
          
        case 'aesthetic-procedures':
          const aestheticProcedures = await AestheticProceduresService.getAllProcedures();
          
          // Transform procedures into chart-friendly data
          const aestheticProceduresByCategory = aestheticProcedures.reduce((acc, proc) => {
            // Enrich and standardize category names based on aesthetic procedure classifications
            let category = proc.category || 'general';
            
            // Standardize category names to match comprehensive aesthetic classifications
            if (typeof category === 'string') {
              const normalizedCategory = category.toLowerCase().trim();
              
              // Map variations to standard categories based on search results
              if (normalizedCategory.includes('inject') || normalizedCategory.includes('botox') || normalizedCategory.includes('filler') || normalizedCategory.includes('neurotoxin')) {
                category = 'Injectables';
              } else if (normalizedCategory.includes('facial') || normalizedCategory.includes('hydrafacial') || normalizedCategory.includes('chemical peel') || normalizedCategory.includes('microneedling')) {
                category = 'Facial Treatments';
              } else if (normalizedCategory.includes('laser') || normalizedCategory.includes('ipl') || normalizedCategory.includes('photofacial') || normalizedCategory.includes('resurfacing')) {
                category = 'Laser Procedures';
              } else if (normalizedCategory.includes('body') || normalizedCategory.includes('contour') || normalizedCategory.includes('sculpt') || normalizedCategory.includes('liposuction') || normalizedCategory.includes('coolsculpting')) {
                category = 'Body Contouring';
              } else if (normalizedCategory.includes('skin') || normalizedCategory.includes('rejuvenat') || normalizedCategory.includes('tighten') || normalizedCategory.includes('lifting')) {
                category = 'Skin Rejuvenation';
              } else if (normalizedCategory.includes('hair') || normalizedCategory.includes('removal') || normalizedCategory.includes('restoration') || normalizedCategory.includes('transplant')) {
                category = 'Hair Treatments';
              } else if (normalizedCategory.includes('tattoo') || normalizedCategory.includes('removal')) {
                category = 'Tattoo Removal';
              } else if (normalizedCategory.includes('vein') || normalizedCategory.includes('sclerotherapy') || normalizedCategory.includes('spider') || normalizedCategory.includes('varicose')) {
                category = 'Vein Treatments';
              } else if (normalizedCategory.includes('skincare') || normalizedCategory.includes('product') || normalizedCategory.includes('serum') || normalizedCategory.includes('cream')) {
                category = 'Skincare';
              } else {
                // Capitalize first letter for unknown categories
                category = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
              }
            } else {
              category = 'General';
            }
            
            if (!acc[category]) {
              acc[category] = 0;
            }
            acc[category]++;
            return acc;
          }, {} as Record<string, number>);
          
          const aestheticProceduresByPopularity = aestheticProcedures
            .filter(proc => (proc.name || proc.procedure_name) && proc.popularity != null)
            .map(proc => ({
              name: proc.name || proc.procedure_name!,
              popularity: proc.popularity!
            }));
          
          data = [
            {
              id: 'aesthetic-procedures-by-category',
              name: 'Aesthetic Procedures by Category',
              description: 'Distribution of aesthetic procedures across categories',
              data_type: 'pie_chart',
              data: Object.entries(aestheticProceduresByCategory).map(([name, value]) => ({ name, value })),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: 'aesthetic-procedures-by-popularity',
              name: 'Aesthetic Procedures by Popularity',
              description: 'Popularity ratings of aesthetic procedures',
              data_type: 'bar_chart',
              data: aestheticProceduresByPopularity.sort((a, b) => (b.popularity || 0) - (a.popularity || 0)).slice(0, 10),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ];
          break;
          
        case 'companies':
          const companies = await CompaniesService.getAllCompanies();
          
          // Transform companies into chart-friendly data
          const companiesByIndustry = companies.reduce((acc, company) => {
            const industry = company.industry || 'Other';
            if (!acc[industry]) {
              acc[industry] = 0;
            }
            acc[industry]++;
            return acc;
          }, {} as Record<string, number>);
          
          const companiesByRevenue = companies
            .filter(company => company.name && company.annual_revenue != null)
            .map(company => ({
              name: company.name!,
              revenue: company.annual_revenue!
            }));
          
          data = [
            {
              id: 'companies-by-industry',
              name: 'Companies by Industry',
              description: 'Distribution of companies across industries',
              data_type: 'pie_chart',
              data: Object.entries(companiesByIndustry).map(([name, value]) => ({ name, value })),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: 'companies-by-revenue',
              name: 'Companies by Annual Revenue',
              description: 'Annual revenue of top companies',
              data_type: 'bar_chart',
              data: companiesByRevenue
                .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
                .slice(0, 10),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ];
          break;
          
        case 'dental-innovations':
          const dentalInnovations = await getDentalImplantInnovations();
          
          data = [
            {
              id: 'dental-innovations-list',
              name: 'Dental Implant Innovations',
              description: dentalInnovations.description,
              data_type: 'table',
              data: dentalInnovations.innovations.map(innovation => ({
                name: innovation.name,
                description: innovation.description,
                year: innovation.yearIntroduced,
                manufacturer: innovation.manufacturer || 'N/A'
              })),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ];
          break;
          
        case 'aesthetic-trends':
          const aestheticTrends = await getAestheticTrends();
          
          data = [
            {
              id: 'aesthetic-trends-list',
              name: 'Aesthetic Treatment Trends',
              description: aestheticTrends.description,
              data_type: 'table',
              data: aestheticTrends.trends.map(trend => ({
                name: trend.name,
                description: trend.description,
                popularity: trend.popularity,
                year: trend.yearIntroduced,
                category: trend.category
              })),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ];
          break;
          
        case 'company-trends':
          const companyTrends = await CompaniesService.getCompanyTrends();
          
          data = [
            {
              id: 'company-trends-list',
              name: 'Industry Trends',
              description: 'Market trends affecting dental and aesthetic companies',
              data_type: 'table',
              data: companyTrends.map((trend: any) => ({
                name: trend.name || 'Unknown',
                description: trend.description || 'No description available',
                companies: trend.companies ? trend.companies.join(', ') : 'N/A',
                impact: trend.impact || 'Unknown',
                year: trend.year || 'N/A'
              })),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ];
          break;
          
        default:
          // Fallback to Supabase for other datasets
          const { data: supabaseData, error } = await supabase
            .from('market_data')
            .select('*')
            .eq('dataset_id', datasetId)
            .order('name');
          
          if (error) throw error;
          
          data = supabaseData as MarketData[];
      }
      
      setMarketData(data);
    } catch (err) {
      console.error('Error fetching market data:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDatasetChange = (event: SelectChangeEvent<string>) => {
    setSelectedDatasetId(event.target.value);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Helper function to render the appropriate chart based on data type
  const renderChart = (data: any, dataType: string) => {
    if (!data || !Array.isArray(data)) {
      return (
        <Typography color="text.secondary">
          No chart data available or invalid format
        </Typography>
      );
    }
    
    switch (dataType) {
      case 'bar_chart':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(data[0])
                .filter(key => key !== 'name')
                .map((key, index) => (
                  <Bar 
                    key={key} 
                    dataKey={key} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'line_chart':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(data[0])
                .filter(key => key !== 'name')
                .map((key, index) => (
                  <Line 
                    key={key} 
                    type="monotone" 
                    dataKey={key} 
                    stroke={COLORS[index % COLORS.length]} 
                    activeDot={{ r: 8 }} 
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'pie_chart':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
        
      case 'table':
      default:
        return (
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {Object.keys(data[0]).map(key => (
                    <th key={key} style={{ 
                      padding: '8px', 
                      textAlign: 'left', 
                      borderBottom: `1px solid ${theme.palette.divider}` 
                    }}>
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row: any, rowIndex: number) => (
                  <tr key={rowIndex}>
                    {Object.keys(row).map(key => (
                      <td key={`${rowIndex}-${key}`} style={{ 
                        padding: '8px', 
                        textAlign: 'left', 
                        borderBottom: `1px solid ${theme.palette.divider}` 
                      }}>
                        {row[key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        Market Data Explorer
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1">
            Select Market Dataset
          </Typography>
          {project && selectedDatasetId && onDocumentCreate && (
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => {
                if (!project || !selectedDatasetId) return;
                
                const dataset = datasets.find(d => d.id === selectedDatasetId);
                if (!dataset) return;
                
                // Create a document from the current dataset
                const newDocument = {
                  title: `Market Data: ${dataset.name}`,
                  content: JSON.stringify({
                    dataset: dataset,
                    data: marketData,
                    exported_at: new Date().toISOString()
                  }, null, 2),
                  document_type: ResearchDocumentType.MARKET_ANALYSIS,
                  created_by: userId,
                  is_ai_generated: false,
                  version: 1,
                  project_id: project.id,
                  tags: ['market-data', dataset.category, dataset.region]
                };
                
                onDocumentCreate(newDocument);
              }}
            >
              Save as Document
            </Button>
          )}
        </Box>
        <FormControl fullWidth>
          <InputLabel id="dataset-select-label">Select Dataset</InputLabel>
          <Select
            labelId="dataset-select-label"
            value={selectedDatasetId}
            onChange={handleDatasetChange}
            label="Select Dataset"
          >
            {datasets.map(dataset => (
              <MenuItem key={dataset.id} value={dataset.id}>
                {dataset.name} ({dataset.region}, {dataset.year})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        {selectedDatasetId && datasets.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">
              Dataset Description:
            </Typography>
            <Typography variant="body2">
              {datasets.find(d => d.id === selectedDatasetId)?.description}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Source: {datasets.find(d => d.id === selectedDatasetId)?.data_source}
            </Typography>
          </Box>
        )}
      </Paper>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ my: 2 }}>
          Error: {error.message}
        </Typography>
      ) : marketData.length > 0 ? (
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 2 }}
          >
            <Tab label="Overview" />
            {marketData.map((data, index) => (
              <Tab key={data.id} label={data.name} />
            ))}
          </Tabs>
          
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            {activeTab === 0 ? (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                {marketData.map((data, index) => (
                  <Box key={data.id}>
                    <Card>
                      <CardHeader 
                        title={data.name} 
                        subheader={data.description}
                        titleTypographyProps={{ variant: 'subtitle1' }}
                        subheaderTypographyProps={{ variant: 'caption' }}
                      />
                      <Divider />
                      <CardContent>
                        {renderChart(data.data, data.data_type)}
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            ) : (
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {marketData[activeTab - 1]?.name}
                </Typography>
                <Typography variant="body2" paragraph>
                  {marketData[activeTab - 1]?.description}
                </Typography>
                <Box sx={{ height: 400 }}>
                  {renderChart(
                    marketData[activeTab - 1]?.data,
                    marketData[activeTab - 1]?.data_type
                  )}
                </Box>
              </Paper>
            )}
          </Box>
        </Box>
      ) : (
        <Typography color="text.secondary" sx={{ my: 2 }}>
          No market data available for the selected dataset. Please select a different dataset or try again later.
        </Typography>
      )}
    </Box>
  );
};

export default MarketDataExplorer;
