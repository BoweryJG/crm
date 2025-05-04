import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  useTheme,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as ContentCopyIcon,
  PlayArrow as PlayArrowIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { openRouterService } from '../../services/ai/openRouterService';
import { AIPrompt } from '../../types/ai';
import PromptTester from '../../components/ai/PromptTester';

// TabPanel component for tab content
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  const theme = useTheme();

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`prompt-tabpanel-${index}`}
      aria-labelledby={`prompt-tab-${index}`}
      {...other}
      style={{ height: '100%' }}
    >
      {value === index && (
        <Box sx={{ p: 3, height: '100%' }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const PromptManagement: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [prompts, setPrompts] = useState<AIPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrompt, setSelectedPrompt] = useState<AIPrompt | null>(null);
  const [testerOpen, setTesterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');

  // Fetch prompts on component mount
  useEffect(() => {
    const fetchPrompts = async () => {
      setLoading(true);
      try {
        const { data, error } = await openRouterService.getPrompts();
        if (error) throw error;
        if (data) {
          setPrompts(data);
        }
      } catch (error) {
        console.error('Error fetching prompts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenTester = (prompt: AIPrompt) => {
    setSelectedPrompt(prompt);
    setTesterOpen(true);
  };

  const handleCloseTester = () => {
    setTesterOpen(false);
  };

  const handleIndustryFilterChange = (event: SelectChangeEvent<string>) => {
    setIndustryFilter(event.target.value);
  };

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.prompt_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.prompt_content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesIndustry = industryFilter === 'all' || prompt.industry.toLowerCase() === industryFilter.toLowerCase();
    
    return matchesSearch && matchesIndustry;
  });

  // Get unique industries for filter
  const industries = ['all', ...Array.from(new Set(prompts.map(prompt => prompt.industry.toLowerCase())))];

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="prompt management tabs">
          <Tab label="Prompt Library" />
          <Tab label="Create New Prompt" />
          <Tab label="Analytics" />
        </Tabs>
      </Box>
      
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <TabPanel value={tabValue} index={0}>
          {selectedPrompt && testerOpen ? (
            <PromptTester prompt={selectedPrompt} onClose={handleCloseTester} />
          ) : (
            <Box>
              <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                <TextField
                  label="Search Prompts"
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  fullWidth
                />
                
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel id="industry-filter-label">Industry</InputLabel>
                  <Select
                    labelId="industry-filter-label"
                    value={industryFilter}
                    label="Industry"
                    onChange={handleIndustryFilterChange}
                  >
                    {industries.map((industry) => (
                      <MenuItem key={industry} value={industry}>
                        {industry === 'all' ? 'All Industries' : industry.charAt(0).toUpperCase() + industry.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => setTabValue(1)}
                >
                  New Prompt
                </Button>
              </Box>
              
              {loading ? (
                <Typography>Loading prompts...</Typography>
              ) : filteredPrompts.length === 0 ? (
                <Typography>No prompts found matching your criteria.</Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {filteredPrompts.map((prompt) => (
                    <Card key={prompt.id} variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="h6">{prompt.prompt_name}</Typography>
                          <Chip 
                            label={prompt.industry} 
                            size="small" 
                            color="primary" 
                            variant="outlined" 
                          />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {prompt.prompt_content.length > 200 
                            ? `${prompt.prompt_content.substring(0, 200)}...` 
                            : prompt.prompt_content}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          <Chip 
                            label={`Model: ${prompt.model_used.split('/')[1]}`} 
                            size="small" 
                            variant="outlined" 
                          />
                          <Chip 
                            label={`Used ${prompt.usage_count} times`} 
                            size="small" 
                            variant="outlined" 
                          />
                          <Chip 
                            label={`Temp: ${prompt.parameter_defaults?.temperature || 0.7}`} 
                            size="small" 
                            variant="outlined" 
                          />
                        </Box>
                      </CardContent>
                      <CardActions>
                        <Button 
                          size="small" 
                          startIcon={<PlayArrowIcon />}
                          onClick={() => handleOpenTester(prompt)}
                        >
                          Test
                        </Button>
                        <Button 
                          size="small" 
                          startIcon={<EditIcon />}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="small" 
                          startIcon={<ContentCopyIcon />}
                        >
                          Duplicate
                        </Button>
                        <Button 
                          size="small" 
                          startIcon={<DeleteIcon />}
                          color="error"
                        >
                          Delete
                        </Button>
                      </CardActions>
                    </Card>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h5" gutterBottom>Create New Prompt</Typography>
            
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Prompt Name"
                  variant="outlined"
                  fullWidth
                  required
                />
                
                <TextField
                  label="Prompt Content"
                  variant="outlined"
                  multiline
                  rows={6}
                  fullWidth
                  required
                  helperText="Use {{variable_name}} syntax for variables that will be filled in at runtime."
                />
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel id="industry-label">Industry</InputLabel>
                    <Select
                      labelId="industry-label"
                      label="Industry"
                      defaultValue="Healthcare"
                    >
                      <MenuItem value="Healthcare">Healthcare</MenuItem>
                      <MenuItem value="Dental">Dental</MenuItem>
                      <MenuItem value="Aesthetic">Aesthetic</MenuItem>
                      <MenuItem value="Marketing">Marketing</MenuItem>
                      <MenuItem value="Business">Business</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <FormControl fullWidth>
                    <InputLabel id="model-label">Default Model</InputLabel>
                    <Select
                      labelId="model-label"
                      label="Default Model"
                      defaultValue="openai/gpt-4-turbo"
                    >
                      <MenuItem value="openai/gpt-4-turbo">GPT-4 Turbo</MenuItem>
                      <MenuItem value="openai/gpt-3.5-turbo">GPT-3.5 Turbo</MenuItem>
                      <MenuItem value="anthropic/claude-3-opus">Claude 3 Opus</MenuItem>
                      <MenuItem value="anthropic/claude-3-sonnet">Claude 3 Sonnet</MenuItem>
                      <MenuItem value="anthropic/claude-3-haiku">Claude 3 Haiku</MenuItem>
                      <MenuItem value="google/gemini-pro">Gemini Pro</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                
                <Typography variant="h6" gutterBottom>Default Parameters</Typography>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="Temperature"
                    type="number"
                    defaultValue={0.7}
                    inputProps={{ min: 0, max: 1, step: 0.1 }}
                    fullWidth
                  />
                  
                  <TextField
                    label="Max Tokens"
                    type="number"
                    defaultValue={1500}
                    inputProps={{ min: 100, step: 100 }}
                    fullWidth
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                  <Button variant="outlined" onClick={() => setTabValue(0)}>
                    Cancel
                  </Button>
                  <Button variant="contained" color="primary">
                    Save Prompt
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
            <Typography variant="h5" gutterBottom>Prompt Analytics</Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Usage by Prompt</Typography>
                <Typography variant="body2" color="text.secondary">
                  Analytics dashboard will be implemented in a future update.
                </Typography>
              </Paper>
              
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Usage by Model</Typography>
                <Typography variant="body2" color="text.secondary">
                  Analytics dashboard will be implemented in a future update.
                </Typography>
              </Paper>
              
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Usage by Industry</Typography>
                <Typography variant="body2" color="text.secondary">
                  Analytics dashboard will be implemented in a future update.
                </Typography>
              </Paper>
            </Box>
          </Box>
        </TabPanel>
      </Box>
      
      {/* Prompt Tester Dialog */}
      <Dialog
        open={testerOpen}
        onClose={handleCloseTester}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Test Prompt</Typography>
            <IconButton edge="end" color="inherit" onClick={handleCloseTester} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedPrompt && <PromptTester prompt={selectedPrompt} onClose={handleCloseTester} />}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PromptManagement;
