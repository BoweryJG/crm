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
    
    // Here you would trigger the actual automation workflow
    // This could be a call to an external service, a webhook, etc.
    // For now, we'll just simulate the workflow with a console log
    console.log(`Started automation workflow ${workflowId} for document ${documentId}`);
    
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
    
    // Here you would cancel the actual automation workflow if possible
    console.log(`Cancelled automation workflow for document ${documentId}`);
    
    return { data, error: null };
  } catch (error) {
    console.error(`Error cancelling automation workflow for document ${documentId}:`, error);
    return { data: null, error: error as Error };
  }
};

// Get all available automation workflows
const getAutomationWorkflows = async (): Promise<{ data: { id: string; name: string; description: string }[] | null; error: Error | null }> => {
  try {
    // In a real implementation, this would fetch from a workflows table
    // For now, we'll return some mock data
    const mockWorkflows = [
      { 
        id: '1', 
        name: 'Contact Follow-up', 
        description: 'Send research document to contact and schedule follow-up' 
      },
      { 
        id: '2', 
        name: 'Practice Analysis', 
        description: 'Add research to practice profile and create action items' 
      },
      { 
        id: '3', 
        name: 'Market Intelligence', 
        description: 'Extract insights and update market intelligence database' 
      }
    ];
    
    return { data: mockWorkflows, error: null };
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
