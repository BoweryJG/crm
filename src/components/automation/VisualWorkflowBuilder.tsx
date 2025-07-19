// Visual Workflow Builder - Drag & Drop Email Automation Designer
// Award-winning interface for creating sophisticated email automation workflows

import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Tooltip,
  Card,
  CardContent,
  Grid,
  Switch,
  FormControlLabel,
  Slider,
  Alert,
  Fab
} from '@mui/material';
import {
  Add as AddIcon,
  Email as EmailIcon,
  Schedule as DelayIcon,
  AccountTree as ConditionIcon,
  PlayArrow as TriggerIcon,
  Settings as ActionIcon,
  Save as SaveIcon,
  PlayCircle as PlayIcon,
  Pause as PauseIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ContentCopy as CopyIcon,
  Visibility as PreviewIcon,
  Timeline as AnalyticsIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { WorkflowStep, EmailAutomation, AutomationTrigger } from '../../services/email/EmailAutomationEngine';
import { automationEmailBridge } from '../../services/email/AutomationEmailBridge';

// Styled Components
const WorkflowCanvas = styled(Box)(({ theme }) => ({
  height: '600px',
  background: `linear-gradient(135deg, 
    ${theme.palette.background.default} 0%, 
    ${theme.palette.background.paper} 100%)`,
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.spacing(2),
  position: 'relative',
  overflow: 'auto',
  padding: theme.spacing(2),
  '&.drag-over': {
    borderColor: theme.palette.primary.main,
    borderStyle: 'solid',
    backgroundColor: theme.palette.action.hover
  }
}));

const WorkflowStep = styled(Paper)<{ stepType: string; selected: boolean }>(({ theme, stepType, selected }) => {
  const getStepColor = (type: string) => {
    switch (type) {
      case 'trigger': return theme.palette.success.main;
      case 'email': return theme.palette.primary.main;
      case 'delay': return theme.palette.warning.main;
      case 'condition': return theme.palette.info.main;
      case 'action': return theme.palette.secondary.main;
      default: return theme.palette.grey[500];
    }
  };

  const stepColor = getStepColor(stepType);

  return {
    padding: theme.spacing(2),
    margin: theme.spacing(1),
    minWidth: 180,
    minHeight: 100,
    border: `2px solid ${selected ? stepColor : 'transparent'}`,
    borderRadius: theme.spacing(1.5),
    cursor: 'pointer',
    position: 'absolute',
    background: `linear-gradient(135deg, 
      ${theme.palette.background.paper} 0%, 
      ${theme.palette.action.hover} 100%)`,
    boxShadow: selected 
      ? `0 8px 32px ${stepColor}40` 
      : theme.shadows[3],
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      boxShadow: `0 12px 40px ${stepColor}30`,
      transform: 'translateY(-2px)',
      borderColor: stepColor
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 4,
      background: stepColor,
      borderRadius: `${theme.spacing(1.5)} ${theme.spacing(1.5)} 0 0`
    }
  };
});

const StepToolbar = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: -40,
  right: 0,
  display: 'flex',
  gap: theme.spacing(0.5),
  opacity: 0,
  transition: 'opacity 0.2s ease',
  '.workflow-step:hover &': {
    opacity: 1
  }
}));

const ConnectionLine = styled('svg')(({ theme }) => ({
  position: 'absolute',
  pointerEvents: 'none',
  zIndex: 1,
  '& path': {
    stroke: theme.palette.primary.main,
    strokeWidth: 2,
    fill: 'none',
    strokeDasharray: '5,5',
    animation: 'dash 20s linear infinite'
  },
  '@keyframes dash': {
    to: {
      strokeDashoffset: '-1000'
    }
  }
}));

const ToolboxDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 280,
    background: `linear-gradient(180deg, 
      ${theme.palette.background.paper} 0%, 
      ${theme.palette.background.default} 100%)`,
    borderRight: `1px solid ${theme.palette.divider}`,
    paddingTop: theme.spacing(2)
  }
}));

// Workflow Step Types
interface WorkflowStepNode extends WorkflowStep {
  x: number;
  y: number;
  selected?: boolean;
}

interface StepTemplate {
  type: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  category: 'trigger' | 'action' | 'logic' | 'communication';
  defaultConfig: any;
}

// Component Props
interface VisualWorkflowBuilderProps {
  automation?: EmailAutomation;
  onSave: (automation: EmailAutomation) => void;
  onPreview: (automation: EmailAutomation) => void;
  onClose: () => void;
}

const VisualWorkflowBuilder: React.FC<VisualWorkflowBuilderProps> = ({
  automation,
  onSave,
  onPreview,
  onClose
}) => {
  // State
  const [steps, setSteps] = useState<WorkflowStepNode[]>(
    automation?.workflow_steps.map((step, index) => ({
      ...step,
      x: 100 + (index * 220),
      y: 100,
      selected: false
    })) || []
  );
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [toolboxOpen, setToolboxOpen] = useState(true);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<WorkflowStepNode | null>(null);
  const [automationName, setAutomationName] = useState(automation?.name || '');
  const [automationDescription, setAutomationDescription] = useState(automation?.description || '');
  const [draggedStepType, setDraggedStepType] = useState<string | null>(null);

  // Step Templates
  const stepTemplates: StepTemplate[] = [
    {
      type: 'trigger',
      icon: <TriggerIcon />,
      title: 'Trigger',
      description: 'Start automation when conditions are met',
      category: 'trigger',
      defaultConfig: {
        trigger_type: 'contact_created',
        conditions: []
      }
    },
    {
      type: 'email',
      icon: <EmailIcon />,
      title: 'Send Email',
      description: 'Send personalized email to contact',
      category: 'communication',
      defaultConfig: {
        template_id: '',
        subject: '',
        body: '',
        send_optimization: true
      }
    },
    {
      type: 'delay',
      icon: <DelayIcon />,
      title: 'Wait',
      description: 'Add delay before next step',
      category: 'logic',
      defaultConfig: {
        delay_amount: 1,
        delay_unit: 'hours'
      }
    },
    {
      type: 'condition',
      icon: <ConditionIcon />,
      title: 'Condition',
      description: 'Branch workflow based on conditions',
      category: 'logic',
      defaultConfig: {
        condition_type: 'contact_property',
        condition_rules: []
      }
    },
    {
      type: 'action',
      icon: <ActionIcon />,
      title: 'Action',
      description: 'Perform action on contact or system',
      category: 'action',
      defaultConfig: {
        action_type: 'add_tag',
        action_data: {}
      }
    }
  ];

  // Step Icon Mapping
  const getStepIcon = (stepType: string) => {
    const template = stepTemplates.find(t => t.type === stepType);
    return template?.icon || <ActionIcon />;
  };

  // Step Color Mapping
  const getStepColor = (stepType: string) => {
    switch (stepType) {
      case 'trigger': return '#34C759';
      case 'email': return '#007AFF';
      case 'delay': return '#FF9500';
      case 'condition': return '#5856D6';
      case 'action': return '#AF52DE';
      default: return '#8E8E93';
    }
  };

  // Drag & Drop Handlers
  const handleDragStart = useCallback((stepType: string) => {
    setDraggedStepType(stepType);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.currentTarget.classList.remove('drag-over');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    if (!draggedStepType) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const template = stepTemplates.find(t => t.type === draggedStepType);
    if (!template) return;

    const newStep: WorkflowStepNode = {
      id: `step_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: draggedStepType as any,
      order: steps.length,
      config: template.defaultConfig,
      x: x - 90, // Center the step
      y: y - 50,
      selected: false
    };

    setSteps(prev => [...prev, newStep]);
    setDraggedStepType(null);
  }, [draggedStepType, steps.length]);

  // Step Selection
  const handleStepClick = useCallback((stepId: string) => {
    setSteps(prev => prev.map(step => ({
      ...step,
      selected: step.id === stepId
    })));
    setSelectedStep(stepId);
  }, []);

  // Step Configuration
  const handleConfigureStep = useCallback((step: WorkflowStepNode) => {
    setEditingStep(step);
    setConfigDialogOpen(true);
  }, []);

  const handleSaveStepConfig = useCallback(() => {
    if (!editingStep) return;

    setSteps(prev => prev.map(step => 
      step.id === editingStep.id ? editingStep : step
    ));
    setConfigDialogOpen(false);
    setEditingStep(null);
  }, [editingStep]);

  // Step Actions
  const handleDeleteStep = useCallback((stepId: string) => {
    setSteps(prev => prev.filter(step => step.id !== stepId));
    if (selectedStep === stepId) {
      setSelectedStep(null);
    }
  }, [selectedStep]);

  const handleCopyStep = useCallback((step: WorkflowStepNode) => {
    const newStep: WorkflowStepNode = {
      ...step,
      id: `step_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      x: step.x + 20,
      y: step.y + 20,
      selected: false
    };
    setSteps(prev => [...prev, newStep]);
  }, []);

  // Connection Drawing
  const drawConnections = useMemo(() => {
    return steps.map((step, index) => {
      if (index === steps.length - 1) return null;
      
      const nextStep = steps[index + 1];
      const startX = step.x + 180;
      const startY = step.y + 50;
      const endX = nextStep.x;
      const endY = nextStep.y + 50;
      
      const midX = (startX + endX) / 2;
      
      return (
        <ConnectionLine key={`connection-${step.id}`} width="100%" height="100%">
          <path d={`M ${startX} ${startY} Q ${midX} ${startY} ${midX} ${(startY + endY) / 2} Q ${midX} ${endY} ${endX} ${endY}`} />
        </ConnectionLine>
      );
    });
  }, [steps]);

  // Save Workflow
  const handleSaveWorkflow = useCallback(() => {
    const workflowAutomation: EmailAutomation = {
      id: automation?.id || `auto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: automationName,
      description: automationDescription,
      trigger_id: 'default_trigger', // Would be set based on trigger step
      workflow_steps: steps.map((step, index) => ({
        id: step.id,
        type: step.type,
        order: index,
        config: step.config,
        next_step_id: index < steps.length - 1 ? steps[index + 1].id : undefined
      })),
      active: automation?.active || false,
      performance_metrics: automation?.performance_metrics || {
        total_triggered: 0,
        emails_sent: 0,
        emails_opened: 0,
        emails_clicked: 0,
        conversions: 0,
        open_rate: 0,
        click_rate: 0,
        conversion_rate: 0
      },
      created_at: automation?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    onSave(workflowAutomation);
  }, [automation, automationName, automationDescription, steps, onSave]);

  // Preview Workflow
  const handlePreviewWorkflow = useCallback(() => {
    const workflowAutomation: EmailAutomation = {
      id: automation?.id || 'preview',
      name: automationName,
      description: automationDescription,
      trigger_id: 'default_trigger',
      workflow_steps: steps.map((step, index) => ({
        id: step.id,
        type: step.type,
        order: index,
        config: step.config,
        next_step_id: index < steps.length - 1 ? steps[index + 1].id : undefined
      })),
      active: false,
      performance_metrics: {
        total_triggered: 0,
        emails_sent: 0,
        emails_opened: 0,
        emails_clicked: 0,
        conversions: 0,
        open_rate: 0,
        click_rate: 0,
        conversion_rate: 0
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    onPreview(workflowAutomation);
  }, [automationName, automationDescription, steps, onPreview]);

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Toolbox Drawer */}
      <ToolboxDrawer
        variant="persistent"
        anchor="left"
        open={toolboxOpen}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Workflow Builder
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Drag components to canvas to build your automation
          </Typography>

          {/* Workflow Info */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <TextField
                fullWidth
                label="Automation Name"
                value={automationName}
                onChange={(e) => setAutomationName(e.target.value)}
                size="small"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Description"
                value={automationDescription}
                onChange={(e) => setAutomationDescription(e.target.value)}
                multiline
                rows={2}
                size="small"
              />
            </CardContent>
          </Card>

          {/* Step Templates */}
          <Typography variant="subtitle2" gutterBottom>
            Components
          </Typography>
          <List dense>
            {stepTemplates.map((template) => (
              <ListItem
                key={template.type}
                draggable
                onDragStart={() => handleDragStart(template.type)}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                  cursor: 'grab',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-1px)',
                    boxShadow: 2
                  },
                  '&:active': {
                    cursor: 'grabbing'
                  }
                }}
              >
                <ListItemIcon sx={{ color: getStepColor(template.type) }}>
                  {template.icon}
                </ListItemIcon>
                <ListItemText
                  primary={template.title}
                  secondary={template.description}
                  primaryTypographyProps={{ fontSize: '0.875rem' }}
                  secondaryTypographyProps={{ fontSize: '0.75rem' }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </ToolboxDrawer>

      {/* Main Canvas */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Toolbar */}
        <Box sx={{ 
          p: 2, 
          borderBottom: 1, 
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <IconButton onClick={() => setToolboxOpen(!toolboxOpen)}>
              <AddIcon />
            </IconButton>
            <Typography variant="h6">
              {automationName || 'Untitled Automation'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              startIcon={<PreviewIcon />}
              onClick={handlePreviewWorkflow}
              disabled={steps.length === 0}
            >
              Preview
            </Button>
            <Button
              startIcon={<SaveIcon />}
              variant="contained"
              onClick={handleSaveWorkflow}
              disabled={!automationName || steps.length === 0}
            >
              Save
            </Button>
            <Button onClick={onClose}>
              Close
            </Button>
          </Box>
        </Box>

        {/* Canvas */}
        <WorkflowCanvas
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Connection Lines */}
          {drawConnections}

          {/* Workflow Steps */}
          {steps.map((step) => (
            <WorkflowStep
              key={step.id}
              stepType={step.type}
              selected={step.selected || false}
              className="workflow-step"
              sx={{
                left: step.x,
                top: step.y
              }}
              onClick={() => handleStepClick(step.id)}
            >
              <StepToolbar>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConfigureStep(step);
                  }}
                  sx={{ bgcolor: 'background.paper' }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyStep(step);
                  }}
                  sx={{ bgcolor: 'background.paper' }}
                >
                  <CopyIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteStep(step.id);
                  }}
                  sx={{ bgcolor: 'background.paper' }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </StepToolbar>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ color: getStepColor(step.type), mr: 1 }}>
                  {getStepIcon(step.type)}
                </Box>
                <Typography variant="subtitle2">
                  {stepTemplates.find(t => t.type === step.type)?.title || step.type}
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary">
                {step.config.subject || step.config.action_type || 
                 `${step.config.delay_amount || 1} ${step.config.delay_unit || 'hours'}` ||
                 'Configure step'}
              </Typography>
              
              <Chip
                label={`Order: ${step.order + 1}`}
                size="small"
                sx={{ mt: 1 }}
              />
            </WorkflowStep>
          ))}

          {/* Empty State */}
          {steps.length === 0 && (
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: 'text.secondary'
            }}>
              <Typography variant="h6" gutterBottom>
                Start Building Your Automation
              </Typography>
              <Typography variant="body2">
                Drag components from the toolbox to create your workflow
              </Typography>
            </Box>
          )}
        </WorkflowCanvas>
      </Box>

      {/* Step Configuration Dialog */}
      <Dialog
        open={configDialogOpen}
        onClose={() => setConfigDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Configure {editingStep && stepTemplates.find(t => t.type === editingStep.type)?.title}
        </DialogTitle>
        <DialogContent>
          {editingStep && (
            <Box sx={{ pt: 1 }}>
              {editingStep.type === 'email' && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email Subject"
                      value={editingStep.config.subject || ''}
                      onChange={(e) => setEditingStep({
                        ...editingStep,
                        config: { ...editingStep.config, subject: e.target.value }
                      })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email Body"
                      multiline
                      rows={6}
                      value={editingStep.config.body || ''}
                      onChange={(e) => setEditingStep({
                        ...editingStep,
                        config: { ...editingStep.config, body: e.target.value }
                      })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={editingStep.config.send_optimization || false}
                          onChange={(e) => setEditingStep({
                            ...editingStep,
                            config: { ...editingStep.config, send_optimization: e.target.checked }
                          })}
                        />
                      }
                      label="Enable Send Time Optimization"
                    />
                  </Grid>
                </Grid>
              )}

              {editingStep.type === 'delay' && (
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Delay Amount"
                      type="number"
                      value={editingStep.config.delay_amount || 1}
                      onChange={(e) => setEditingStep({
                        ...editingStep,
                        config: { ...editingStep.config, delay_amount: parseInt(e.target.value) }
                      })}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Time Unit</InputLabel>
                      <Select
                        value={editingStep.config.delay_unit || 'hours'}
                        onChange={(e) => setEditingStep({
                          ...editingStep,
                          config: { ...editingStep.config, delay_unit: e.target.value as 'minutes' | 'hours' | 'days' }
                        })}
                      >
                        <MenuItem value="minutes">Minutes</MenuItem>
                        <MenuItem value="hours">Hours</MenuItem>
                        <MenuItem value="days">Days</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              )}

              {editingStep.type === 'action' && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Action Type</InputLabel>
                      <Select
                        value={editingStep.config.action_type || 'add_tag'}
                        onChange={(e) => setEditingStep({
                          ...editingStep,
                          config: { ...editingStep.config, action_type: e.target.value as 'add_tag' | 'update_property' | 'create_task' }
                        })}
                      >
                        <MenuItem value="add_tag">Add Tag</MenuItem>
                        <MenuItem value="update_property">Update Property</MenuItem>
                        <MenuItem value="create_task">Create Task</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveStepConfig} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Buttons */}
      <Box sx={{ position: 'fixed', bottom: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Fab
          color="primary"
          onClick={handlePreviewWorkflow}
          disabled={steps.length === 0}
          size="small"
        >
          <PlayIcon />
        </Fab>
        <Fab
          color="secondary"
          onClick={() => setToolboxOpen(!toolboxOpen)}
          size="small"
        >
          <AddIcon />
        </Fab>
      </Box>
    </Box>
  );
};

export default VisualWorkflowBuilder;