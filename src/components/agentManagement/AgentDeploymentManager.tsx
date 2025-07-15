import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  Chip,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CloudUpload as DeployIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { Agent, Client, agentApiService } from '../../services/agentbackend/agentApiService';

interface AgentDeploymentManagerProps {
  open: boolean;
  onClose: () => void;
  agent: Agent | null;
  clients: Client[];
  onDeploymentSuccess: () => void;
}

interface DeploymentConfig {
  customName?: string;
  environment: 'production' | 'staging' | 'development';
  autoStart: boolean;
  maxTokens: number;
  temperature: number;
  systemPrompt?: string;
  customEndpoint?: string;
  rateLimiting: boolean;
  rateLimit: number;
  monitoring: boolean;
  logging: boolean;
  backup: boolean;
}

const defaultConfig: DeploymentConfig = {
  environment: 'production',
  autoStart: true,
  maxTokens: 2048,
  temperature: 0.7,
  rateLimiting: true,
  rateLimit: 100,
  monitoring: true,
  logging: true,
  backup: true,
};

export const AgentDeploymentManager: React.FC<AgentDeploymentManagerProps> = ({
  open,
  onClose,
  agent,
  clients,
  onDeploymentSuccess,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [deploymentConfig, setDeploymentConfig] = useState<DeploymentConfig>(defaultConfig);
  const [deploying, setDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  
  const steps = [
    'Select Client',
    'Configure Deployment',
    'Review & Deploy',
    'Deployment Status'
  ];

  useEffect(() => {
    if (!open) {
      // Reset state when dialog closes
      setActiveStep(0);
      setSelectedClient('');
      setDeploymentConfig(defaultConfig);
      setDeploying(false);
      setDeploymentStatus('idle');
      setError(null);
    }
  }, [open]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleDeploy = async () => {
    if (!agent || !selectedClient) return;

    setDeploying(true);
    setDeploymentStatus('deploying');
    setError(null);

    try {
      // Simulate deployment process with progress
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const deployment = await agentApiService.deployAgent(
        agent.id,
        selectedClient,
        deploymentConfig
      );
      
      setDeploymentStatus('success');
      setTimeout(() => {
        onDeploymentSuccess();
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Deployment failed');
      setDeploymentStatus('error');
    } finally {
      setDeploying(false);
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select Deployment Target
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Choose the client where you want to deploy {agent?.name}
            </Typography>
            
            <FormControl fullWidth>
              <InputLabel>Client</InputLabel>
              <Select
                value={selectedClient}
                label="Client"
                onChange={(e) => setSelectedClient(e.target.value)}
              >
                {clients.map(client => (
                  <MenuItem key={client.id} value={client.id}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span>{client.name}</span>
                      <Chip 
                        label={`${client.activeDeployments} active`} 
                        size="small" 
                        color={client.activeDeployments > 0 ? 'primary' : 'default'}
                      />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedClient && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Selected client: {clients.find(c => c.id === selectedClient)?.name}
              </Alert>
            )}
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Deployment Configuration
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Configure the deployment settings for optimal performance
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Custom Name (Optional)"
                  value={deploymentConfig.customName || ''}
                  onChange={(e) => setDeploymentConfig({
                    ...deploymentConfig,
                    customName: e.target.value
                  })}
                  placeholder={agent?.name}
                  sx={{ mb: 2 }}
                />

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Environment</InputLabel>
                  <Select
                    value={deploymentConfig.environment}
                    label="Environment"
                    onChange={(e) => setDeploymentConfig({
                      ...deploymentConfig,
                      environment: e.target.value as any
                    })}
                  >
                    <MenuItem value="development">Development</MenuItem>
                    <MenuItem value="staging">Staging</MenuItem>
                    <MenuItem value="production">Production</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Max Tokens"
                  type="number"
                  value={deploymentConfig.maxTokens}
                  onChange={(e) => setDeploymentConfig({
                    ...deploymentConfig,
                    maxTokens: parseInt(e.target.value)
                  })}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Temperature"
                  type="number"
                  inputProps={{ min: 0, max: 1, step: 0.1 }}
                  value={deploymentConfig.temperature}
                  onChange={(e) => setDeploymentConfig({
                    ...deploymentConfig,
                    temperature: parseFloat(e.target.value)
                  })}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={deploymentConfig.autoStart}
                        onChange={(e) => setDeploymentConfig({
                          ...deploymentConfig,
                          autoStart: e.target.checked
                        })}
                      />
                    }
                    label="Auto Start"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={deploymentConfig.rateLimiting}
                        onChange={(e) => setDeploymentConfig({
                          ...deploymentConfig,
                          rateLimiting: e.target.checked
                        })}
                      />
                    }
                    label="Rate Limiting"
                  />
                </Box>

                {deploymentConfig.rateLimiting && (
                  <TextField
                    fullWidth
                    label="Rate Limit (requests/minute)"
                    type="number"
                    value={deploymentConfig.rateLimit}
                    onChange={(e) => setDeploymentConfig({
                      ...deploymentConfig,
                      rateLimit: parseInt(e.target.value)
                    })}
                    sx={{ mb: 2 }}
                  />
                )}

                <Box sx={{ mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={deploymentConfig.monitoring}
                        onChange={(e) => setDeploymentConfig({
                          ...deploymentConfig,
                          monitoring: e.target.checked
                        })}
                      />
                    }
                    label="Monitoring"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={deploymentConfig.logging}
                        onChange={(e) => setDeploymentConfig({
                          ...deploymentConfig,
                          logging: e.target.checked
                        })}
                      />
                    }
                    label="Logging"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={deploymentConfig.backup}
                        onChange={(e) => setDeploymentConfig({
                          ...deploymentConfig,
                          backup: e.target.checked
                        })}
                      />
                    }
                    label="Automatic Backup"
                  />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">Advanced Settings</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TextField
                      fullWidth
                      label="System Prompt (Optional)"
                      multiline
                      rows={4}
                      value={deploymentConfig.systemPrompt || ''}
                      onChange={(e) => setDeploymentConfig({
                        ...deploymentConfig,
                        systemPrompt: e.target.value
                      })}
                      placeholder="Custom system prompt for this deployment..."
                      sx={{ mb: 2 }}
                    />

                    <TextField
                      fullWidth
                      label="Custom Endpoint (Optional)"
                      value={deploymentConfig.customEndpoint || ''}
                      onChange={(e) => setDeploymentConfig({
                        ...deploymentConfig,
                        customEndpoint: e.target.value
                      })}
                      placeholder="https://custom-endpoint.com/api"
                    />
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Deployment
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Review your deployment configuration before proceeding
            </Typography>

            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>Agent Details</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Typography><strong>Name:</strong> {agent?.name}</Typography>
                  <Chip label={agent?.category} size="small" />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {agent?.description}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>Target Client</Typography>
                <Typography>
                  {clients.find(c => c.id === selectedClient)?.name}
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>Configuration</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2">Environment: <strong>{deploymentConfig.environment}</strong></Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">Max Tokens: <strong>{deploymentConfig.maxTokens}</strong></Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">Temperature: <strong>{deploymentConfig.temperature}</strong></Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">Auto Start: <strong>{deploymentConfig.autoStart ? 'Yes' : 'No'}</strong></Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Deployment Status
            </Typography>
            
            {deploymentStatus === 'deploying' && (
              <Box>
                <LinearProgress sx={{ mb: 2 }} />
                <Typography>Deploying agent to {clients.find(c => c.id === selectedClient)?.name}...</Typography>
              </Box>
            )}

            {deploymentStatus === 'success' && (
              <Alert severity="success" icon={<CheckIcon />}>
                <Typography variant="h6">Deployment Successful!</Typography>
                <Typography>
                  {agent?.name} has been successfully deployed to {clients.find(c => c.id === selectedClient)?.name}
                </Typography>
              </Alert>
            )}

            {deploymentStatus === 'error' && (
              <Alert severity="error" icon={<ErrorIcon />}>
                <Typography variant="h6">Deployment Failed</Typography>
                <Typography>{error}</Typography>
              </Alert>
            )}
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 0:
        return selectedClient !== '';
      case 1:
        return true; // Configuration is optional
      case 2:
        return true; // Review step
      case 3:
        return deploymentStatus === 'success';
      default:
        return false;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown={deploying}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <DeployIcon />
          Deploy Agent: {agent?.name}
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                {getStepContent(index)}
                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    onClick={index === steps.length - 2 ? handleDeploy : handleNext}
                    disabled={!isStepValid(index) || deploying}
                    sx={{ mr: 1 }}
                  >
                    {index === steps.length - 2 ? 'Deploy' : 'Next'}
                  </Button>
                  {index > 0 && (
                    <Button onClick={handleBack} disabled={deploying}>
                      Back
                    </Button>
                  )}
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={deploying}>
          {deploymentStatus === 'success' ? 'Close' : 'Cancel'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};