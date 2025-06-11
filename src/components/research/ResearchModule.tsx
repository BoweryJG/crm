// Enhanced Research Module - Raw AI Access with OpenRouter Integration
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Paper,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Slider,
  Badge,
  Tooltip,
  CircularProgress,
  Alert,
  useTheme
} from '@mui/material';
import {
  Psychology as AIIcon,
  Send as SendIcon,
  Compare as CompareIcon,
  Save as SaveIcon,
  Share as ShareIcon,
  Settings as SettingsIcon,
  ExpandMore as ExpandIcon,
  Speed as SpeedIcon,
  Analytics as AnalyticsIcon,
  Star as StarIcon,
  Timer as TimerIcon,
  Memory as TokenIcon,
  AttachMoney as CostIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  CheckCircle as CheckIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon
} from '@mui/icons-material';
import { openRouterService, OpenRouterModel, WorkspaceSession } from '../../services/openRouterService';

interface ResearchModuleProps {
  userId?: string;
}

const ResearchModule: React.FC<ResearchModuleProps> = ({ userId = 'demo-user' }) => {
  const theme = useTheme();
  
  // State management
  const [availableModels, setAvailableModels] = useState<OpenRouterModel[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [responses, setResponses] = useState<{ [model: string]: any }>({});
  const [loading, setLoading] = useState<{ [model: string]: boolean }>({});
  const [currentTab, setCurrentTab] = useState(0);
  const [sessions, setSessions] = useState<WorkspaceSession[]>([]);
  const [modelsLoading, setModelsLoading] = useState(true);
  
  // Settings state
  const [settings, setSettings] = useState({
    max_tokens: 1000,
    temperature: 0.7,
    top_p: 1.0,
    auto_compare: true,
    save_sessions: true
  });

  // Dialog state
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [saveSessionOpen, setSaveSessionOpen] = useState(false);
  const [sessionName, setSessionName] = useState('');

  // Categories and filtering
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');

  // Load models and sessions on mount
  useEffect(() => {
    loadModels();
    loadSessions();
  }, []);

  const loadModels = async () => {
    try {
      setModelsLoading(true);
      const models = await openRouterService.getAvailableModels();
      setAvailableModels(models);
      
      // Auto-select some popular models
      const popularModels = [
        'openai/gpt-4o',
        'anthropic/claude-3.5-sonnet',
        'google/gemini-pro-1.5'
      ].filter(id => models.some(m => m.id === id));
      
      setSelectedModels(popularModels);
    } catch (error) {
      console.error('Error loading models:', error);
    } finally {
      setModelsLoading(false);
    }
  };

  const loadSessions = async () => {
    try {
      const sessionData = await openRouterService.getWorkspaceSessions(userId);
      setSessions(sessionData);
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const runPrompt = async () => {
    if (!currentPrompt.trim() || selectedModels.length === 0) return;

    const newLoading: { [model: string]: boolean } = {};
    selectedModels.forEach(model => {
      newLoading[model] = true;
    });
    setLoading(newLoading);

    const newResponses: { [model: string]: any } = {};

    try {
      // Run models in parallel
      const promises = selectedModels.map(async (model) => {
        try {
          const result = await openRouterService.generateResponse(
            model,
            currentPrompt,
            {
              max_tokens: settings.max_tokens,
              temperature: settings.temperature,
              top_p: settings.top_p
            }
          );

          newResponses[model] = {
            ...result,
            timestamp: new Date().toISOString(),
            quality_score: Math.floor(Math.random() * 30) + 70 // Demo scoring
          };

          setResponses(prev => ({ ...prev, [model]: newResponses[model] }));
          setLoading(prev => ({ ...prev, [model]: false }));
        } catch (error) {
          console.error(`Error with model ${model}:`, error);
          newResponses[model] = {
            response: `Error: Failed to get response from ${model}`,
            usage: { total_tokens: 0 },
            response_time: 0,
            error: true
          };
          setResponses(prev => ({ ...prev, [model]: newResponses[model] }));
          setLoading(prev => ({ ...prev, [model]: false }));
        }
      });

      await Promise.all(promises);

      // Auto-save session if enabled
      if (settings.save_sessions) {
        await autoSaveSession();
      }
    } catch (error) {
      console.error('Error running prompt:', error);
      setLoading({});
    }
  };

  const autoSaveSession = async () => {
    try {
      const sessionName = `Session ${new Date().toLocaleString()}`;
      await openRouterService.createWorkspaceSession(
        userId,
        sessionName,
        currentPrompt,
        selectedModels
      );
      loadSessions();
    } catch (error) {
      console.error('Error auto-saving session:', error);
    }
  };

  const saveSession = async () => {
    if (!sessionName.trim()) return;

    try {
      await openRouterService.createWorkspaceSession(
        userId,
        sessionName,
        currentPrompt,
        selectedModels
      );
      setSaveSessionOpen(false);
      setSessionName('');
      loadSessions();
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  const modelCategories = openRouterService.getModelCategories();
  const filteredModels = availableModels.filter(model => {
    const matchesCategory = selectedCategory === 'all' || 
      Object.entries(modelCategories).some(([category, models]) => 
        category.toLowerCase().includes(selectedCategory) && models.includes(model.id)
      );
    
    const matchesSearch = !searchFilter || 
      model.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      model.id.toLowerCase().includes(searchFilter.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const formatCost = (cost: string): string => {
    const numCost = parseFloat(cost);
    if (numCost < 0.001) return '<$0.001';
    return `$${numCost}`;
  };

  const formatResponseTime = (time: number): string => {
    if (time < 1000) return `${time}ms`;
    return `${(time / 1000).toFixed(1)}s`;
  };

  const getModelIcon = (modelId: string): string => {
    if (modelId.includes('openai')) return '🤖';
    if (modelId.includes('anthropic')) return '🧠';
    if (modelId.includes('google')) return '🔍';
    if (modelId.includes('meta')) return '🦙';
    if (modelId.includes('mistral')) return '🌊';
    return '⚡';
  };

  const getQualityColor = (score: number) => {
    if (score >= 90) return theme.palette.success.main;
    if (score >= 75) return theme.palette.warning.main;
    return theme.palette.info.main;
  };

  const tabs = [
    'Workspace',
    'Model Browser',
    'Sessions',
    'Analytics'
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            AI Research Module
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Raw access to 400+ AI models for research and comparison
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Badge badgeContent={selectedModels.length} color="primary">
            <Button
              variant="outlined"
              startIcon={<AIIcon />}
              onClick={() => setModelSelectorOpen(true)}
            >
              Select Models
            </Button>
          </Badge>
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            onClick={() => setSettingsOpen(true)}
          >
            Settings
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => setSaveSessionOpen(true)}
            disabled={!currentPrompt || selectedModels.length === 0}
          >
            Save Session
          </Button>
        </Box>
      </Box>

      {/* Main Tabs */}
      <Card elevation={0} sx={{ borderRadius: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab} />
            ))}
          </Tabs>
        </Box>

        {/* Workspace Tab */}
        {currentTab === 0 && (
          <Box sx={{ p: 3 }}>
            {/* Prompt Input */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Research Prompt
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Enter your research question or prompt here..."
                value={currentPrompt}
                onChange={(e) => setCurrentPrompt(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {selectedModels.map(model => (
                    <Chip
                      key={model}
                      label={`${getModelIcon(model)} ${model.split('/')[1]}`}
                      onDelete={() => setSelectedModels(prev => prev.filter(m => m !== model))}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
                <Button
                  variant="contained"
                  startIcon={<SendIcon />}
                  onClick={runPrompt}
                  disabled={!currentPrompt.trim() || selectedModels.length === 0}
                  size="large"
                >
                  Run Analysis
                </Button>
              </Box>
            </Paper>

            {/* Model Responses */}
            <Grid container spacing={3}>
              {selectedModels.map(model => (
                <Grid item xs={12} md={6} lg={4} key={model}>
                  <Card elevation={2} sx={{ borderRadius: 2, height: '100%' }}>
                    <CardHeader
                      title={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h6" fontWeight="bold">
                            {getModelIcon(model)} {model.split('/')[1]}
                          </Typography>
                          {responses[model] && !responses[model].error && (
                            <Chip 
                              label={`${responses[model].quality_score}%`}
                              size="small"
                              sx={{ 
                                backgroundColor: getQualityColor(responses[model].quality_score),
                                color: 'white'
                              }}
                            />
                          )}
                        </Box>
                      }
                      subheader={model.split('/')[0]}
                      action={
                        loading[model] ? (
                          <CircularProgress size={20} />
                        ) : responses[model] ? (
                          <IconButton>
                            <CheckIcon color="success" />
                          </IconButton>
                        ) : null
                      }
                    />
                    <CardContent>
                      {loading[model] ? (
                        <Box>
                          <LinearProgress sx={{ mb: 2 }} />
                          <Typography variant="body2" color="text.secondary" textAlign="center">
                            Generating response...
                          </Typography>
                        </Box>
                      ) : responses[model] ? (
                        <Box>
                          <Paper 
                            sx={{ 
                              p: 2, 
                              mb: 2, 
                              maxHeight: 300, 
                              overflow: 'auto',
                              bgcolor: responses[model].error ? 'error.light' : 'background.default'
                            }}
                          >
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                              {responses[model].response}
                            </Typography>
                          </Paper>
                          
                          {!responses[model].error && (
                            <Grid container spacing={1} sx={{ mb: 2 }}>
                              <Grid item xs={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <TimerIcon fontSize="small" color="info" />
                                  <Typography variant="caption">
                                    {formatResponseTime(responses[model].response_time)}
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <TokenIcon fontSize="small" color="secondary" />
                                  <Typography variant="caption">
                                    {responses[model].usage.total_tokens} tokens
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          )}

                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button size="small" variant="outlined" startIcon={<CompareIcon />}>
                              Compare
                            </Button>
                            <Button size="small" variant="outlined" startIcon={<ShareIcon />}>
                              Share
                            </Button>
                          </Box>
                        </Box>
                      ) : (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            Ready to generate response
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {selectedModels.length === 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Select AI models to start your research. Click "Select Models" to browse 400+ available models.
              </Alert>
            )}
          </Box>
        )}

        {/* Model Browser Tab */}
        {currentTab === 1 && (
          <Box sx={{ p: 3 }}>
            {/* Model Filters */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <MenuItem value="all">All Models</MenuItem>
                  {Object.keys(modelCategories).map(category => (
                    <MenuItem key={category} value={category.toLowerCase()}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField
                placeholder="Search models..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                sx={{ minWidth: 250 }}
              />

              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => loadModels()}
                disabled={modelsLoading}
              >
                Refresh
              </Button>
            </Box>

            {/* Model Grid */}
            {modelsLoading ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress size={60} />
                <Typography sx={{ mt: 2 }}>Loading available models...</Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {filteredModels.map(model => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={model.id}>
                    <Card 
                      variant="outlined"
                      sx={{ 
                        borderRadius: 2,
                        cursor: 'pointer',
                        border: selectedModels.includes(model.id) ? `2px solid ${theme.palette.primary.main}` : undefined,
                        transition: 'all 0.2s',
                        '&:hover': {
                          elevation: 4,
                          transform: 'translateY(-2px)'
                        }
                      }}
                      onClick={() => {
                        if (selectedModels.includes(model.id)) {
                          setSelectedModels(prev => prev.filter(m => m !== model.id));
                        } else {
                          setSelectedModels(prev => [...prev, model.id]);
                        }
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="h6" fontWeight="bold">
                            {getModelIcon(model.id)}
                          </Typography>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {model.name}
                          </Typography>
                          <IconButton size="small">
                            {selectedModels.includes(model.id) ? 
                              <FavoriteIcon color="primary" /> : 
                              <FavoriteBorderIcon />
                            }
                          </IconButton>
                        </Box>

                        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                          {model.description || 'Advanced AI model'}
                        </Typography>

                        <Grid container spacing={1} sx={{ mb: 2 }}>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">Context</Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {(model.context_length / 1000).toFixed(0)}K
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">Input Cost</Typography>
                            <Typography variant="body2" fontWeight="bold" color="primary">
                              {formatCost(model.pricing.prompt)}
                            </Typography>
                          </Grid>
                        </Grid>

                        <Chip 
                          label={model.id.split('/')[0]}
                          size="small"
                          color="secondary"
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}

        {/* Sessions Tab */}
        {currentTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Research Sessions
              </Typography>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={loadSessions}
              >
                Refresh
              </Button>
            </Box>

            {sessions.length === 0 ? (
              <Alert severity="info">
                No research sessions yet. Start a research session to save your work.
              </Alert>
            ) : (
              <Grid container spacing={2}>
                {sessions.map(session => (
                  <Grid item xs={12} md={6} key={session.id}>
                    <Card elevation={1} sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {session.session_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {session.prompt_text.substring(0, 100)}...
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                          {session.models_used.map(model => (
                            <Chip 
                              key={model}
                              label={model.split('/')[1]}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(session.created_at).toLocaleDateString()}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button size="small" variant="outlined">
                              Load
                            </Button>
                            <IconButton size="small">
                              <DownloadIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}

        {/* Analytics Tab */}
        {currentTab === 3 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Model Performance Analytics
            </Typography>
            <Alert severity="info">
              Analytics feature coming soon. Track model performance, cost efficiency, and response quality.
            </Alert>
          </Box>
        )}
      </Card>

      {/* Model Selector Dialog */}
      <Dialog open={modelSelectorOpen} onClose={() => setModelSelectorOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Select AI Models ({selectedModels.length} selected)</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Choose multiple models to compare responses and find the best AI for your research needs.
          </Typography>
          
          {/* Quick selections */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Quick Selections:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {Object.entries(modelCategories).map(([category, models]) => (
                <Button
                  key={category}
                  size="small"
                  variant="outlined"
                  onClick={() => setSelectedModels(models.slice(0, 3))}
                >
                  {category}
                </Button>
              ))}
            </Box>
          </Box>

          <Grid container spacing={2}>
            {availableModels.slice(0, 20).map(model => (
              <Grid item xs={12} sm={6} md={4} key={model.id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedModels.includes(model.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedModels(prev => [...prev, model.id]);
                        } else {
                          setSelectedModels(prev => prev.filter(m => m !== model.id));
                        }
                      }}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {getModelIcon(model.id)} {model.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {model.id.split('/')[0]} • {formatCost(model.pricing.prompt)}/1K tokens
                      </Typography>
                    </Box>
                  }
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModelSelectorOpen(false)}>Done</Button>
        </DialogActions>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Model Settings</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography gutterBottom>Max Tokens: {settings.max_tokens}</Typography>
              <Slider
                value={settings.max_tokens}
                onChange={(_, value) => setSettings(prev => ({ ...prev, max_tokens: value as number }))}
                min={100}
                max={4000}
                step={100}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>Temperature: {settings.temperature}</Typography>
              <Slider
                value={settings.temperature}
                onChange={(_, value) => setSettings(prev => ({ ...prev, temperature: value as number }))}
                min={0}
                max={2}
                step={0.1}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={settings.auto_compare}
                    onChange={(e) => setSettings(prev => ({ ...prev, auto_compare: e.target.checked }))}
                  />
                }
                label="Auto-compare responses"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={settings.save_sessions}
                    onChange={(e) => setSettings(prev => ({ ...prev, save_sessions: e.target.checked }))}
                  />
                }
                label="Auto-save sessions"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Save Session Dialog */}
      <Dialog open={saveSessionOpen} onClose={() => setSaveSessionOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Save Research Session</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Session Name"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            sx={{ mt: 2 }}
            placeholder="e.g., Medical Device Market Research"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveSessionOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={saveSession} disabled={!sessionName.trim()}>
            Save Session
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResearchModule;