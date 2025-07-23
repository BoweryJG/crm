import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Card,
  CardContent,
  Divider,
  Chip,
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  useTheme,
  alpha,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Add as AddIcon,
  PlayArrow as PlayIcon,
  Schedule as ScheduleIcon,
  Email as EmailIcon,
  FilterBranches as ConditionIcon,
  Pause as DelayIcon,
  Psychology as SocraticIcon,
  TrendingUp as ChallengerIcon,
  School as TeachingIcon,
  Assessment as AnalyticsIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  DragIndicator as DragIcon,
  ArrowDownward as ArrowDownIcon,
  Settings as SettingsIcon,
  Timeline as WorkflowIcon,
} from '@mui/icons-material';
import { useThemeContext } from '../../themes/ThemeContext';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'email' | 'condition' | 'delay' | 'action';
  title: string;
  description: string;
  config: Record<string, any>;
  position: { x: number; y: number };
  connections: string[];
}

interface WorkflowBuilderProps {
  onClose?: () => void;
  onSave?: (workflow: any) => void;
  mode?: 'modal' | 'embedded';
  initialWorkflow?: any;
}

const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({
  onClose,
  onSave,
  mode = 'modal',
  initialWorkflow
}) => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    {
      id: 'trigger-1',
      type: 'trigger',
      title: 'New Contact Added',
      description: 'Triggers when a new contact is added to CRM',
      config: { source: 'crm_contact_add' },
      position: { x: 0, y: 0 },
      connections: [],
    },
  ]);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [showNodeDialog, setShowNodeDialog] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [workflowName, setWorkflowName] = useState('New Email Workflow');

  const themeColor = theme.palette.primary.main;

  const nodeTypes = [
    {
      type: 'email',
      title: 'Send Email',
      description: 'Send an automated email',
      icon: <EmailIcon />,
      color: theme.palette.primary.main,
      templates: [
        { id: 'socratic', name: 'Socratic Discovery', icon: <SocraticIcon /> },
        { id: 'challenger', name: 'Challenger Insight', icon: <ChallengerIcon /> },
        { id: 'teaching', name: 'Teaching Sequence', icon: <TeachingIcon /> },
      ],
    },
    {
      type: 'delay',
      title: 'Add Delay',
      description: 'Wait before next action',
      icon: <DelayIcon />,
      color: theme.palette.warning.main,
    },
    {
      type: 'condition',
      title: 'Add Condition',
      description: 'Branch based on conditions',
      icon: <ConditionIcon />,
      color: theme.palette.info.main,
    },
    {
      type: 'action',
      title: 'Custom Action',
      description: 'Perform custom action',
      icon: <AnalyticsIcon />,
      color: theme.palette.success.main,
    },
  ];

  const addNode = useCallback((type: string, template?: any) => {
    const newNode: WorkflowNode = {
      id: `${type}-${Date.now()}`,
      type: type as any,
      title: getNodeTitle(type, template),
      description: getNodeDescription(type, template),
      config: template ? { template: template.id } : {},
      position: { x: 0, y: (nodes.length) * 120 },
      connections: [],
    };

    setNodes(prev => [...prev, newNode]);
    setShowNodeDialog(false);
    setShowTemplateSelector(false);
  }, [nodes.length]);

  const getNodeTitle = (type: string, template?: any): string => {
    if (type === 'email' && template) {
      return `Send ${template.name}`;
    }
    const titles: Record<string, string> = {
      email: 'Send Email',
      delay: 'Wait',
      condition: 'If/Then',
      action: 'Custom Action',
      trigger: 'Trigger',
    };
    return titles[type] || type;
  };

  const getNodeDescription = (type: string, template?: any): string => {
    if (type === 'email' && template) {
      return `Sends a ${template.name.toLowerCase()} email to the contact`;
    }
    const descriptions: Record<string, string> = {
      email: 'Send an automated email',
      delay: 'Wait for specified time',
      condition: 'Branch workflow based on conditions',
      action: 'Perform custom action',
      trigger: 'Workflow trigger event',
    };
    return descriptions[type] || type;
  };

  const getNodeIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      trigger: <PlayIcon />,
      email: <EmailIcon />,
      delay: <DelayIcon />,
      condition: <ConditionIcon />,
      action: <AnalyticsIcon />,
    };
    return icons[type] || <SettingsIcon />;
  };

  const getNodeColor = (type: string) => {
    const colors: Record<string, string> = {
      trigger: theme.palette.success.main,
      email: theme.palette.primary.main,
      delay: theme.palette.warning.main,
      condition: theme.palette.info.main,
      action: theme.palette.secondary.main,
    };
    return colors[type] || theme.palette.text.secondary;
  };

  const deleteNode = (nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  };

  const updateNode = (nodeId: string, updates: Partial<WorkflowNode>) => {
    setNodes(prev =>
      prev.map(node =>
        node.id === nodeId ? { ...node, ...updates } : node
      )
    );
  };

  const saveWorkflow = () => {
    const workflow = {
      name: workflowName,
      nodes,
      created_at: new Date().toISOString(),
      status: 'draft',
    };
    
    console.log('Saving workflow:', workflow);
    if (onSave) {
      onSave(workflow);
    }
  };

  const NodeDialog = () => (
    <Dialog open={showNodeDialog} onClose={() => setShowNodeDialog(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Add Workflow Step</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {nodeTypes.map((nodeType) => (
            <Grid item xs={12} sm={6} key={nodeType.type}>
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: `1px solid ${alpha(nodeType.color, 0.2)}`,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    borderColor: alpha(nodeType.color, 0.4),
                    boxShadow: `0 4px 20px ${alpha(nodeType.color, 0.2)}`,
                  },
                }}
                onClick={() => {
                  if (nodeType.type === 'email') {
                    setShowTemplateSelector(true);
                  } else {
                    addNode(nodeType.type);
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(nodeType.color, 0.1),
                      color: nodeType.color,
                      mb: 1,
                      mx: 'auto',
                    }}
                  >
                    {nodeType.icon}
                  </Avatar>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {nodeType.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                    {nodeType.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowNodeDialog(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );

  const TemplateSelector = () => (
    <Dialog open={showTemplateSelector} onClose={() => setShowTemplateSelector(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Choose Email Template</DialogTitle>
      <DialogContent>
        <List sx={{ pt: 1 }}>
          {nodeTypes[0].templates?.map((template) => (
            <ListItem
              key={template.id}
              button
              onClick={() => addNode('email', template)}
              sx={{
                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                borderRadius: 2,
                mb: 1,
                '&:hover': {
                  borderColor: alpha(themeColor, 0.3),
                },
              }}
            >
              <ListItemIcon>
                <Avatar sx={{ bgcolor: alpha(themeColor, 0.1) }}>
                  {template.icon}
                </Avatar>
              </ListItemIcon>
              <ListItemText
                primary={template.name}
                secondary="Click to add this email type to workflow"
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowTemplateSelector(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ height: mode === 'modal' ? '80vh' : 'auto', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper
        sx={{
          p: 2,
          mb: 2,
          background: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: alpha(themeColor, 0.1) }}>
              <WorkflowIcon sx={{ color: themeColor }} />
            </Avatar>
            <Box>
              <TextField
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                variant="standard"
                sx={{
                  '& .MuiInput-input': {
                    fontSize: '1.25rem',
                    fontWeight: 600,
                  },
                }}
              />
              <Typography variant="body2" color="text.secondary">
                Visual workflow builder for email automation
              </Typography>
            </Box>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setShowNodeDialog(true)}
            >
              Add Step
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={saveWorkflow}
              sx={{
                background: `linear-gradient(135deg, ${themeColor}, ${alpha(themeColor, 0.8)})`,
              }}
            >
              Save Workflow
            </Button>
            {mode === 'modal' && onClose && (
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            )}
          </Stack>
        </Box>
      </Paper>

      {/* Workflow Canvas */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Paper
          sx={{
            p: 3,
            minHeight: 400,
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.5)}, ${alpha(theme.palette.background.paper, 0.8)})`,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            position: 'relative',
          }}
        >
          {nodes.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No workflow steps added yet
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowNodeDialog(true)}
                sx={{ mt: 2 }}
              >
                Add First Step
              </Button>
            </Box>
          ) : (
            <Stack spacing={2} sx={{ maxWidth: 600, mx: 'auto' }}>
              {nodes.map((node, index) => (
                <Box key={node.id}>
                  <Card
                    sx={{
                      border: `2px solid ${alpha(getNodeColor(node.type), 0.3)}`,
                      transition: 'all 0.2s',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: alpha(getNodeColor(node.type), 0.5),
                        transform: 'translateY(-2px)',
                        boxShadow: `0 4px 20px ${alpha(getNodeColor(node.type), 0.2)}`,
                      },
                    }}
                    onClick={() => setSelectedNode(node)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: alpha(getNodeColor(node.type), 0.1),
                            color: getNodeColor(node.type),
                          }}
                        >
                          {getNodeIcon(node.type)}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {node.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {node.description}
                          </Typography>
                          {node.config.template && (
                            <Chip
                              label={`Template: ${node.config.template}`}
                              size="small"
                              sx={{ mt: 1, textTransform: 'capitalize' }}
                            />
                          )}
                        </Box>
                        <Stack direction="row" spacing={1}>
                          <IconButton size="small">
                            <DragIcon />
                          </IconButton>
                          <IconButton size="small">
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNode(node.id);
                            }}
                            sx={{ color: theme.palette.error.main }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </Box>
                    </CardContent>
                  </Card>
                  
                  {/* Connection Arrow */}
                  {index < nodes.length - 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
                      <ArrowDownIcon color="action" />
                    </Box>
                  )}
                </Box>
              ))}
              
              {/* Add Step Button */}
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setShowNodeDialog(true)}
                  sx={{
                    borderRadius: '50px',
                    borderColor: alpha(themeColor, 0.3),
                    '&:hover': {
                      borderColor: alpha(themeColor, 0.5),
                      backgroundColor: alpha(themeColor, 0.05),
                    },
                  }}
                >
                  Add Next Step
                </Button>
              </Box>
            </Stack>
          )}
        </Paper>
      </Box>

      {/* Node Configuration Panel */}
      {selectedNode && (
        <Paper
          sx={{
            position: 'absolute',
            right: 16,
            top: 100,
            width: 300,
            p: 2,
            background: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Configure Step
            </Typography>
            <IconButton size="small" onClick={() => setSelectedNode(null)}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Stack spacing={2}>
            <TextField
              label="Title"
              value={selectedNode.title}
              onChange={(e) => updateNode(selectedNode.id, { title: e.target.value })}
              fullWidth
              size="small"
            />
            <TextField
              label="Description"
              value={selectedNode.description}
              onChange={(e) => updateNode(selectedNode.id, { description: e.target.value })}
              fullWidth
              multiline
              rows={2}
              size="small"
            />
            
            {selectedNode.type === 'delay' && (
              <FormControl fullWidth size="small">
                <InputLabel>Delay Duration</InputLabel>
                <Select
                  value={selectedNode.config.delay || '1h'}
                  onChange={(e) => updateNode(selectedNode.id, { config: { ...selectedNode.config, delay: e.target.value } })}
                  label="Delay Duration"
                >
                  <MenuItem value="5m">5 minutes</MenuItem>
                  <MenuItem value="1h">1 hour</MenuItem>
                  <MenuItem value="1d">1 day</MenuItem>
                  <MenuItem value="1w">1 week</MenuItem>
                </Select>
              </FormControl>
            )}
            
            {selectedNode.type === 'email' && (
              <FormControl fullWidth size="small">
                <InputLabel>Email Template</InputLabel>
                <Select
                  value={selectedNode.config.template || ''}
                  onChange={(e) => updateNode(selectedNode.id, { config: { ...selectedNode.config, template: e.target.value } })}
                  label="Email Template"
                >
                  <MenuItem value="socratic">Socratic Discovery</MenuItem>
                  <MenuItem value="challenger">Challenger Insight</MenuItem>
                  <MenuItem value="teaching">Teaching Sequence</MenuItem>
                </Select>
              </FormControl>
            )}
          </Stack>
        </Paper>
      )}

      <NodeDialog />
      <TemplateSelector />
    </Box>
  );
};

export default WorkflowBuilder;