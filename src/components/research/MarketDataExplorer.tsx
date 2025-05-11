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
      // Fetch datasets from Supabase
      const { data, error } = await supabase
        .from('market_datasets')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      setDatasets(data || []);
      
      // Auto-select the first dataset if available
      if (data && data.length > 0 && !selectedDatasetId) {
        setSelectedDatasetId(data[0].id);
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
      // Fetch market data from Supabase
      const { data, error } = await supabase
        .from('market_data')
        .select('*')
        .eq('dataset_id', datasetId)
        .order('name');
      
      if (error) throw error;
      
      setMarketData(data || []);
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
