import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Alert,
  LinearProgress,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  PlayArrow as DeployIcon,
  Stop as StopIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { agentApiService, Agent, AgentDeployment, Client, AgentStats } from '../../services/agentbackend/agentApiService';
import { AgentAuthGuard } from '../../components/agentManagement/AgentAuthGuard';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`agent-tabpanel-${index}`}
      aria-labelledby={`agent-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const AgentCommandCenter: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [deployments, setDeployments] = useState<AgentDeployment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState<AgentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialogs
  const [deployDialogOpen, setDeployDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [agentConfig, setAgentConfig] = useState<Record<string, any>>({});

  const categories = ['all', 'healthcare', 'sales', 'aesthetic', 'dental', 'coaching'];
  const statuses = ['all', 'active', 'inactive', 'maintenance'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (agentApiService.isAuthenticated()) {
        // Try to load real data from API
        const [agentsData, deploymentsData, clientsData, statsData] = await Promise.all([
          agentApiService.getAllAgents(),
          agentApiService.getAllDeployments(),
          agentApiService.getAllClients(),
          agentApiService.getAgentStats(),
        ]);
        
        setAgents(agentsData);
        setDeployments(deploymentsData);
        setClients(clientsData);
        setStats(statsData);
      } else {
        // Use mock data for development
        setAgents(agentApiService.getMockAgents());
        setDeployments(agentApiService.getMockDeployments());
        setClients(agentApiService.getMockClients());
        setStats(agentApiService.getMockStats());
      }
    } catch (err) {
      console.warn('API not available, using mock data:', err);
      // Fallback to mock data
      setAgents(agentApiService.getMockAgents());
      setDeployments(agentApiService.getMockDeployments());
      setClients(agentApiService.getMockClients());
      setStats(agentApiService.getMockStats());
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const filteredAgents = agents.filter(agent => {
    const matchesCategory = categoryFilter === 'all' || agent.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const handleDeployAgent = async () => {
    if (!selectedAgent || !selectedClient) return;
    
    try {
      await agentApiService.deployAgent(selectedAgent.id, selectedClient);
      setDeployDialogOpen(false);
      setSelectedAgent(null);
      setSelectedClient('');
      loadData(); // Refresh data
    } catch (err) {
      setError('Failed to deploy agent');
    }
  };

  const handleConfigureAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setAgentConfig(agent.configuration);
    setConfigDialogOpen(true);
  };

  const handleSaveConfiguration = async () => {
    if (!selectedAgent) return;
    
    try {
      await agentApiService.updateAgentConfiguration(selectedAgent.id, agentConfig);
      setConfigDialogOpen(false);
      setSelectedAgent(null);
      setAgentConfig({});
      loadData(); // Refresh data
    } catch (err) {
      setError('Failed to update agent configuration');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'maintenance': return 'warning';
      case 'deployed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      case 'stopped': return 'default';
      default: return 'default';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'healthcare': return '#2196F3';
      case 'sales': return '#4CAF50';
      case 'aesthetic': return '#E91E63';
      case 'dental': return '#FF9800';
      case 'coaching': return '#9C27B0';
      default: return '#757575';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
          Loading Agent Command Center...
        </Typography>
      </Container>
    );
  }

  return (
    <AgentAuthGuard>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          <DashboardIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          Agent Command Center
        </Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={loadData}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stats Overview */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary">Total Agents</Typography>
                <Typography variant="h3">{stats.totalAgents}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="secondary">Active Deployments</Typography>
                <Typography variant="h3">{stats.activeDeployments}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="success.main">Total Deployments</Typography>
                <Typography variant="h3">{stats.totalDeployments}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="warning.main">Categories</Typography>
                <Typography variant="h3">{Object.keys(stats.agentsByCategory).length}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange} aria-label="agent management tabs">
          <Tab
            label={
              <Badge badgeContent={agents.length} color="primary">
                Agents
              </Badge>
            }
          />
          <Tab
            label={
              <Badge badgeContent={deployments.length} color="secondary">
                Deployments
              </Badge>
            }
          />
          <Tab
            label={
              <Badge badgeContent={clients.length} color="success">
                Clients
              </Badge>
            }
          />
          <Tab label="Analytics" />
        </Tabs>
      </Box>

      {/* Agents Tab */}
      <TabPanel value={currentTab} index={0}>
        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            label="Search Agents"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 200 }}
          />
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              label="Category"
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(category => (
                <MenuItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statuses.map(status => (
                <MenuItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Agents Grid */}
        <Grid container spacing={3}>
          {filteredAgents.map((agent) => (
            <Grid item xs={12} sm={6} md={4} key={agent.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="div" noWrap>
                      {agent.name}
                    </Typography>
                    <Chip
                      label={agent.status}
                      color={getStatusColor(agent.status) as any}
                      size="small"
                    />
                  </Box>
                  
                  <Chip
                    label={agent.category}
                    size="small"
                    sx={{
                      backgroundColor: getCategoryColor(agent.category),
                      color: 'white',
                      mb: 2,
                    }}
                  />
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {agent.description}
                  </Typography>
                  
                  <Typography variant="caption" color="text.secondary">
                    Updated: {new Date(agent.updatedAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
                
                <CardActions>
                  <Tooltip title="Deploy Agent">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedAgent(agent);
                        setDeployDialogOpen(true);
                      }}
                    >
                      <DeployIcon />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Configure Agent">
                    <IconButton
                      size="small"
                      onClick={() => handleConfigureAgent(agent)}
                    >
                      <SettingsIcon />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="View Details">
                    <IconButton size="small">
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Deployments Tab */}
      <TabPanel value={currentTab} index={1}>
        <Grid container spacing={3}>
          {deployments.map((deployment) => (
            <Grid item xs={12} sm={6} md={4} key={deployment.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="div">
                      {agents.find(a => a.id === deployment.agentId)?.name || 'Unknown Agent'}
                    </Typography>
                    <Chip
                      label={deployment.status}
                      color={getStatusColor(deployment.status) as any}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Client: {deployment.clientName}
                  </Typography>
                  
                  <Typography variant="caption" color="text.secondary">
                    Deployed: {new Date(deployment.deployedAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
                
                <CardActions>
                  <Button size="small" color="error" startIcon={<StopIcon />}>
                    Stop
                  </Button>
                  <Button size="small" startIcon={<SettingsIcon />}>
                    Configure
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Clients Tab */}
      <TabPanel value={currentTab} index={2}>
        <Grid container spacing={3}>
          {clients.map((client) => (
            <Grid item xs={12} sm={6} md={4} key={client.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                    {client.name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Type: {client.type}
                  </Typography>
                  
                  <Typography variant="body2" color="primary">
                    Active Deployments: {client.activeDeployments}
                  </Typography>
                </CardContent>
                
                <CardActions>
                  <Button size="small" startIcon={<ViewIcon />}>
                    View Deployments
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Analytics Tab */}
      <TabPanel value={currentTab} index={3}>
        {stats && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>Agents by Category</Typography>
                  {Object.entries(stats.agentsByCategory).map(([category, count]) => (
                    <Box key={category} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>{category}</Typography>
                      <Typography fontWeight="bold">{count}</Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>Deployments by Client</Typography>
                  {Object.entries(stats.deploymentsByClient).map(([client, count]) => (
                    <Box key={client} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>{client}</Typography>
                      <Typography fontWeight="bold">{count}</Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </TabPanel>

      {/* Deploy Agent Dialog */}
      <Dialog open={deployDialogOpen} onClose={() => setDeployDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Deploy Agent</DialogTitle>
        <DialogContent>
          {selectedAgent && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">{selectedAgent.name}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {selectedAgent.description}
              </Typography>
              
              <FormControl fullWidth>
                <InputLabel>Select Client</InputLabel>
                <Select
                  value={selectedClient}
                  label="Select Client"
                  onChange={(e) => setSelectedClient(e.target.value)}
                >
                  {clients.map(client => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.name} ({client.type})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeployDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeployAgent} variant="contained" disabled={!selectedClient}>
            Deploy
          </Button>
        </DialogActions>
      </Dialog>

      {/* Configuration Dialog */}
      <Dialog open={configDialogOpen} onClose={() => setConfigDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Configure Agent</DialogTitle>
        <DialogContent>
          {selectedAgent && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>{selectedAgent.name}</Typography>
              
              <TextField
                fullWidth
                multiline
                rows={10}
                label="Configuration (JSON)"
                value={JSON.stringify(agentConfig, null, 2)}
                onChange={(e) => {
                  try {
                    setAgentConfig(JSON.parse(e.target.value));
                  } catch (err) {
                    // Handle invalid JSON gracefully
                  }
                }}
                sx={{ fontFamily: 'monospace' }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveConfiguration} variant="contained">
            Save Configuration
          </Button>
        </DialogActions>
      </Dialog>
      </Container>
    </AgentAuthGuard>
  );
};