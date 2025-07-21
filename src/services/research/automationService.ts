import { supabase } from '../supabase/supabase';
import { ResearchDocument, AutomationStatus } from '../../types/research';

// Start an automation workflow for a research document
const startAutomationWorkflow = async (
  documentId: string,
  contactId?: string,
  practiceId?: string,
  workflowId?: string
): Promise<{ data: ResearchDocument | null; error: Error | null }> => {
  try {
    // First, update the document with automation info
    const { data, error } = await supabase
      .from('research_documents')
      .update({
        contact_id: contactId || null,
        practice_id: practiceId || null,
        automation_workflow_id: workflowId || null,
        automation_status: AutomationStatus.IN_PROGRESS,
        automation_started_at: new Date().toISOString()
      })
      .eq('id', documentId)
      .select()
      .single();
    
    if (error) throw error;
    
    // Trigger the actual automation workflow through the backend API
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://osbackend-zl1h.onrender.com';
      const response = await fetch(`${backendUrl}/api/crm/automation/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId,
          workflowId,
          contactId,
          practiceId
        })
      });
      
      if (!response.ok) {
        console.warn(`Backend automation trigger returned status ${response.status}`);
      } else {
        console.log(`Successfully triggered automation workflow ${workflowId} for document ${documentId}`);
      }
    } catch (triggerError) {
      console.warn('Error triggering backend automation:', triggerError);
      // We don't throw here because we've already updated the document status
      // The automation status can be checked later
    }
    
    return { data, error: null };
  } catch (error) {
    console.error(`Error starting automation workflow for document ${documentId}:`, error);
    return { data: null, error: error as Error };
  }
};

// Get the status of an automation workflow
const getAutomationStatus = async (documentId: string): Promise<{ data: { status: AutomationStatus; startedAt?: string; completedAt?: string } | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('research_documents')
      .select('automation_status, automation_started_at, automation_completed_at')
      .eq('id', documentId)
      .single();
    
    if (error) throw error;
    
    return { 
      data: {
        status: data.automation_status as AutomationStatus,
        startedAt: data.automation_started_at,
        completedAt: data.automation_completed_at
      }, 
      error: null 
    };
  } catch (error) {
    console.error(`Error getting automation status for document ${documentId}:`, error);
    return { data: null, error: error as Error };
  }
};

// Complete an automation workflow
const completeAutomationWorkflow = async (
  documentId: string,
  success: boolean = true
): Promise<{ data: ResearchDocument | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('research_documents')
      .update({
        automation_status: success ? AutomationStatus.COMPLETED : AutomationStatus.ERROR,
        automation_completed_at: new Date().toISOString()
      })
      .eq('id', documentId)
      .select()
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error(`Error completing automation workflow for document ${documentId}:`, error);
    return { data: null, error: error as Error };
  }
};

// Cancel an automation workflow
const cancelAutomationWorkflow = async (documentId: string): Promise<{ data: ResearchDocument | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('research_documents')
      .update({
        automation_status: AutomationStatus.NOT_STARTED,
        automation_completed_at: new Date().toISOString()
      })
      .eq('id', documentId)
      .select()
      .single();
    
    if (error) throw error;
    
    // Call the backend API to cancel the workflow
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://osbackend-zl1h.onrender.com';
      const response = await fetch(`${backendUrl}/api/crm/automation/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId
        })
      });
      
      if (!response.ok) {
        console.warn(`Backend automation cancel returned status ${response.status}`);
      } else {
        console.log(`Successfully cancelled automation workflow for document ${documentId}`);
      }
    } catch (cancelError) {
      console.warn('Error cancelling backend automation:', cancelError);
      // We don't throw here because we've already updated the document status
    }
    
    return { data, error: null };
  } catch (error) {
    console.error(`Error cancelling automation workflow for document ${documentId}:`, error);
    return { data: null, error: error as Error };
  }
};

// Get all available automation workflows
const getAutomationWorkflows = async (): Promise<{ data: { id: string; name: string; description: string }[] | null; error: Error | null }> => {
  try {
    // Fetch workflows from the database
    const { data, error } = await supabase
      .from('research_automation_workflows')
      .select('id, name, description')
      .order('name');
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching automation workflows:', error);
    return { data: null, error: error as Error };
  }
};

// Export all functions
const automationService = {
  startAutomationWorkflow,
  getAutomationStatus,
  completeAutomationWorkflow,
  cancelAutomationWorkflow,
  getAutomationWorkflows
};

export default automationService;
