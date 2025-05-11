import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../services/supabase/supabase';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Chip,
  CircularProgress,
  SelectChangeEvent,
  Snackbar,
  Alert
} from '@mui/material';
import {
  AutoAwesome as AutomationIcon,
  CheckCircleOutline as SuccessIcon,
  ErrorOutline as ErrorIcon,
  HourglassEmpty as PendingIcon
} from '@mui/icons-material';

import { ResearchDocument, AutomationStatus } from '../../types/research';
import automationService from '../../services/research/automationService';

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
}

interface Practice {
  id: string;
  name: string;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
}

interface AutomationButtonProps {
  document: ResearchDocument;
  onAutomationStart: (updatedDocument: ResearchDocument) => void;
  onAutomationComplete: (updatedDocument: ResearchDocument) => void;
  userId: string;
}

const AutomationButton: React.FC<AutomationButtonProps> = ({
  document,
  onAutomationStart,
  onAutomationComplete,
  userId
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<string>('');
  const [selectedPracticeId, setSelectedPracticeId] = useState<string>('');
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [practices, setPractices] = useState<Practice[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const statusPollingRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch contacts, practices, and workflows when dialog opens
  useEffect(() => {
    if (openDialog) {
      fetchData();
    }
  }, [openDialog]);

  // Set up polling for automation status updates
  useEffect(() => {
    // Start polling if the document is in progress
    if (document?.id && document.automation_status === AutomationStatus.IN_PROGRESS) {
      // Poll every 5 seconds
      statusPollingRef.current = setInterval(async () => {
        try {
          const statusResult = await automationService.getAutomationStatus(document.id!);
          if (statusResult.error) throw statusResult.error;
          
          // If the status has changed from IN_PROGRESS to something else
          if (statusResult.data?.status !== AutomationStatus.IN_PROGRESS) {
            // Fetch the updated document
            const docResult = await supabase
              .from('research_documents')
              .select('*')
              .eq('id', document.id)
              .single();
            
            if (docResult.error) throw docResult.error;
            
            // Call the onAutomationComplete callback with the updated document
            onAutomationComplete(docResult.data as ResearchDocument);
            
            // Show a notification
            if (statusResult.data?.status === AutomationStatus.COMPLETED) {
              setSnackbarMessage('Automation workflow completed successfully');
              setSnackbarSeverity('success');
            } else if (statusResult.data?.status === AutomationStatus.ERROR) {
              setSnackbarMessage('Automation workflow failed');
              setSnackbarSeverity('error');
            }
            setSnackbarOpen(true);
            
            // Clear the polling interval
            if (statusPollingRef.current) {
              clearInterval(statusPollingRef.current);
              statusPollingRef.current = null;
            }
          }
        } catch (error) {
          console.error('Error polling automation status:', error);
        }
      }, 5000);
      
      // Clean up the interval when the component unmounts or the document changes
      return () => {
        if (statusPollingRef.current) {
          clearInterval(statusPollingRef.current);
          statusPollingRef.current = null;
        }
      };
    }
  }, [document?.id, document?.automation_status, onAutomationComplete]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch contacts from Supabase
      const { data: contactsData, error: contactsError } = await supabase
        .from('contacts')
        .select('id, first_name, last_name')
        .order('last_name');
      
      if (contactsError) throw contactsError;
      setContacts(contactsData || []);
      
      // Fetch practices from Supabase
      const { data: practicesData, error: practicesError } = await supabase
        .from('practices')
        .select('id, name')
        .order('name');
      
      if (practicesError) throw practicesError;
      setPractices(practicesData || []);
      
      // Fetch workflows from the automation service
      const workflowsResult = await automationService.getAutomationWorkflows();
      if (workflowsResult.error) throw workflowsResult.error;
      setWorkflows(workflowsResult.data || []);
      
      // Pre-select contact and practice if they're already set in the document
      if (document.contact_id) {
        setSelectedContactId(document.contact_id);
      }
      
      if (document.practice_id) {
        setSelectedPracticeId(document.practice_id);
      }
      
      if (document.automation_workflow_id) {
        setSelectedWorkflowId(document.automation_workflow_id);
      }
    } catch (error) {
      console.error('Error fetching data for automation:', error);
      setError(error as Error);
      setSnackbarMessage('Error loading automation data');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    // Reset selections
    if (!document.contact_id) setSelectedContactId('');
    if (!document.practice_id) setSelectedPracticeId('');
    if (!document.automation_workflow_id) setSelectedWorkflowId('');
  };

  const handleContactChange = (event: SelectChangeEvent<string>) => {
    setSelectedContactId(event.target.value);
  };

  const handlePracticeChange = (event: SelectChangeEvent<string>) => {
    setSelectedPracticeId(event.target.value);
  };

  const handleWorkflowChange = (event: SelectChangeEvent<string>) => {
    setSelectedWorkflowId(event.target.value);
  };

  const handleStartAutomation = async () => {
    if (!document.id || !selectedWorkflowId) return;
    
    setIsLoading(true);
    try {
      const result = await automationService.startAutomationWorkflow(
        document.id,
        selectedContactId || undefined,
        selectedPracticeId || undefined,
        selectedWorkflowId
      );
      
      if (result.error) throw result.error;
      if (!result.data) throw new Error('Failed to start automation workflow');
      
      // Call the onAutomationStart callback with the updated document
      onAutomationStart(result.data);
      
      // Show success message
      setSnackbarMessage('Automation workflow started successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      // Close the dialog
      handleCloseDialog();
      
      // Note: In a production environment, workflow completion would be handled by a webhook
      // or by polling the backend for status updates
    } catch (error) {
      console.error('Error starting automation:', error);
      setError(error as Error);
      setSnackbarMessage('Error starting automation workflow');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAutomation = async () => {
    if (!document.id) return;
    
    setIsLoading(true);
    try {
      const result = await automationService.cancelAutomationWorkflow(document.id);
      
      if (result.error) throw result.error;
      if (!result.data) throw new Error('Failed to cancel automation workflow');
      
      // Call the onAutomationComplete callback with the updated document
      onAutomationComplete(result.data);
      
      // Show success message
      setSnackbarMessage('Automation workflow cancelled');
      setSnackbarSeverity('info');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error cancelling automation:', error);
      setError(error as Error);
      setSnackbarMessage('Error cancelling automation workflow');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Helper function to get the appropriate icon component for the automation status
  const getAutomationStatusIcon = (status?: AutomationStatus) => {
    switch (status) {
      case AutomationStatus.COMPLETED:
        return <SuccessIcon />;
      case AutomationStatus.ERROR:
        return <ErrorIcon />;
      case AutomationStatus.IN_PROGRESS:
        return <PendingIcon />;
      default:
        return undefined;
    }
  };

  // Helper function to get the appropriate color for the automation status
  const getAutomationStatusColor = (status?: AutomationStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (status) {
      case AutomationStatus.COMPLETED:
        return 'success';
      case AutomationStatus.ERROR:
        return 'error';
      case AutomationStatus.IN_PROGRESS:
        return 'primary';
      default:
        return 'default';
    }
  };

  // Helper function to format the automation status for display
  const formatAutomationStatus = (status?: AutomationStatus): string => {
    switch (status) {
      case AutomationStatus.COMPLETED:
        return 'Completed';
      case AutomationStatus.ERROR:
        return 'Error';
      case AutomationStatus.IN_PROGRESS:
        return 'In Progress';
      case AutomationStatus.NOT_STARTED:
        return 'Not Started';
      default:
        return 'Unknown';
    }
  };

  return (
    <>
      {/* Automation Button */}
      <Button
        variant="contained"
        color="secondary"
        startIcon={<AutomationIcon />}
        onClick={handleOpenDialog}
        disabled={isLoading || !document.id || document.automation_status === AutomationStatus.IN_PROGRESS}
        sx={{ ml: 1 }}
      >
        {document.automation_status === AutomationStatus.IN_PROGRESS ? 'Automating...' : 'Automate'}
      </Button>
      
      {/* Automation Status Display */}
      {document.automation_status && (
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle2" sx={{ mr: 1 }}>
            Automation Status:
          </Typography>
          <Chip
            label={formatAutomationStatus(document.automation_status)}
            color={getAutomationStatusColor(document.automation_status)}
            size="small"
            icon={getAutomationStatusIcon(document.automation_status)}
          />
          
          {document.automation_status === AutomationStatus.IN_PROGRESS && (
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={handleCancelAutomation}
              sx={{ ml: 1 }}
            >
              Cancel
            </Button>
          )}
        </Box>
      )}
      
      {/* Automation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Start Automation Workflow</DialogTitle>
        <DialogContent>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
                <InputLabel id="contact-select-label">Related Contact</InputLabel>
                <Select
                  labelId="contact-select-label"
                  value={selectedContactId}
                  onChange={handleContactChange}
                  label="Related Contact"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {contacts.map(contact => (
                    <MenuItem key={contact.id} value={contact.id}>
                      {contact.first_name} {contact.last_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="practice-select-label">Related Practice</InputLabel>
                <Select
                  labelId="practice-select-label"
                  value={selectedPracticeId}
                  onChange={handlePracticeChange}
                  label="Related Practice"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {practices.map(practice => (
                    <MenuItem key={practice.id} value={practice.id}>
                      {practice.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth required>
                <InputLabel id="workflow-select-label">Workflow</InputLabel>
                <Select
                  labelId="workflow-select-label"
                  value={selectedWorkflowId}
                  onChange={handleWorkflowChange}
                  label="Workflow"
                  required
                >
                  <MenuItem value="">
                    <em>Select a workflow</em>
                  </MenuItem>
                  {workflows.map(workflow => (
                    <MenuItem key={workflow.id} value={workflow.id}>
                      {workflow.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {selectedWorkflowId && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Workflow Description:</Typography>
                  <Typography variant="body2">
                    {workflows.find(w => w.id === selectedWorkflowId)?.description}
                  </Typography>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleStartAutomation}
            disabled={!selectedWorkflowId || isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Start Workflow'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AutomationButton;
