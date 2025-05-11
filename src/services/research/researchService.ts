import { supabase } from '../supabase/supabase';
import {
  ResearchProject,
  ResearchDocument,
  ResearchTask,
  ResearchPrompt,
  ResearchNote,
  ResearchDataQuery,
  ResearchProjectStatus,
  ResearchDocumentType,
  ResearchTaskStatus
} from '../../types/research';

// Research Projects
const getResearchProjects = async (): Promise<{ data: ResearchProject[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('research_projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching research projects:', error);
    return { data: null, error: error as Error };
  }
};

const getResearchProjectById = async (id: string): Promise<{ data: ResearchProject | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('research_projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error(`Error fetching research project with ID ${id}:`, error);
    return { data: null, error: error as Error };
  }
};

const createResearchProject = async (project: Omit<ResearchProject, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: ResearchProject | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('research_projects')
      .insert(project)
      .select()
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error creating research project:', error);
    return { data: null, error: error as Error };
  }
};

const updateResearchProject = async (id: string, updates: Partial<ResearchProject>): Promise<{ data: ResearchProject | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('research_projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error(`Error updating research project with ID ${id}:`, error);
    return { data: null, error: error as Error };
  }
};

const deleteResearchProject = async (id: string): Promise<{ success: boolean; error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('research_projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error(`Error deleting research project with ID ${id}:`, error);
    return { success: false, error: error as Error };
  }
};

// Research Documents
const getResearchDocuments = async (projectId?: string): Promise<{ data: ResearchDocument[] | null; error: Error | null }> => {
  try {
    let query = supabase
      .from('research_documents')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (projectId) {
      query = query.eq('project_id', projectId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching research documents:', error);
    return { data: null, error: error as Error };
  }
};

const getResearchDocumentById = async (id: string): Promise<{ data: ResearchDocument | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('research_documents')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error(`Error fetching research document with ID ${id}:`, error);
    return { data: null, error: error as Error };
  }
};

const createResearchDocument = async (document: Omit<ResearchDocument, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: ResearchDocument | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('research_documents')
      .insert(document)
      .select()
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error creating research document:', error);
    return { data: null, error: error as Error };
  }
};

const updateResearchDocument = async (id: string, updates: Partial<ResearchDocument>): Promise<{ data: ResearchDocument | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('research_documents')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error(`Error updating research document with ID ${id}:`, error);
    return { data: null, error: error as Error };
  }
};

const deleteResearchDocument = async (id: string): Promise<{ success: boolean; error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('research_documents')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error(`Error deleting research document with ID ${id}:`, error);
    return { success: false, error: error as Error };
  }
};

// Research Tasks
const getResearchTasks = async (projectId?: string): Promise<{ data: ResearchTask[] | null; error: Error | null }> => {
  try {
    let query = supabase
      .from('research_tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (projectId) {
      query = query.eq('project_id', projectId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching research tasks:', error);
    return { data: null, error: error as Error };
  }
};

const getResearchTaskById = async (id: string): Promise<{ data: ResearchTask | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('research_tasks')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error(`Error fetching research task with ID ${id}:`, error);
    return { data: null, error: error as Error };
  }
};

const createResearchTask = async (task: Omit<ResearchTask, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: ResearchTask | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('research_tasks')
      .insert(task)
      .select()
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error creating research task:', error);
    return { data: null, error: error as Error };
  }
};

const updateResearchTask = async (id: string, updates: Partial<ResearchTask>): Promise<{ data: ResearchTask | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('research_tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error(`Error updating research task with ID ${id}:`, error);
    return { data: null, error: error as Error };
  }
};

const deleteResearchTask = async (id: string): Promise<{ success: boolean; error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('research_tasks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error(`Error deleting research task with ID ${id}:`, error);
    return { success: false, error: error as Error };
  }
};

// Research Prompts
const getResearchPrompts = async (): Promise<{ data: ResearchPrompt[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('research_prompts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching research prompts:', error);
    return { data: null, error: error as Error };
  }
};

const getResearchPromptById = async (id: string): Promise<{ data: ResearchPrompt | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('research_prompts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error(`Error fetching research prompt with ID ${id}:`, error);
    return { data: null, error: error as Error };
  }
};

const createResearchPrompt = async (prompt: Omit<ResearchPrompt, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: ResearchPrompt | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('research_prompts')
      .insert(prompt)
      .select()
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error creating research prompt:', error);
    return { data: null, error: error as Error };
  }
};

const updateResearchPrompt = async (id: string, updates: Partial<ResearchPrompt>): Promise<{ data: ResearchPrompt | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('research_prompts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error(`Error updating research prompt with ID ${id}:`, error);
    return { data: null, error: error as Error };
  }
};

const deleteResearchPrompt = async (id: string): Promise<{ success: boolean; error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('research_prompts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error(`Error deleting research prompt with ID ${id}:`, error);
    return { success: false, error: error as Error };
  }
};

// Research Notes
const getResearchNotes = async (projectId?: string): Promise<{ data: ResearchNote[] | null; error: Error | null }> => {
  try {
    let query = supabase
      .from('research_notes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (projectId) {
      query = query.eq('project_id', projectId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching research notes:', error);
    return { data: null, error: error as Error };
  }
};

const getResearchNoteById = async (id: string): Promise<{ data: ResearchNote | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('research_notes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error(`Error fetching research note with ID ${id}:`, error);
    return { data: null, error: error as Error };
  }
};

const createResearchNote = async (note: Omit<ResearchNote, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: ResearchNote | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('research_notes')
      .insert(note)
      .select()
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error creating research note:', error);
    return { data: null, error: error as Error };
  }
};

const updateResearchNote = async (id: string, updates: Partial<ResearchNote>): Promise<{ data: ResearchNote | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('research_notes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error(`Error updating research note with ID ${id}:`, error);
    return { data: null, error: error as Error };
  }
};

const deleteResearchNote = async (id: string): Promise<{ success: boolean; error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('research_notes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error(`Error deleting research note with ID ${id}:`, error);
    return { success: false, error: error as Error };
  }
};

// Research Data Queries
const getResearchDataQueries = async (): Promise<{ data: ResearchDataQuery[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('research_data_queries')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching research data queries:', error);
    return { data: null, error: error as Error };
  }
};

const getResearchDataQueryById = async (id: string): Promise<{ data: ResearchDataQuery | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('research_data_queries')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error(`Error fetching research data query with ID ${id}:`, error);
    return { data: null, error: error as Error };
  }
};

const createResearchDataQuery = async (query: Omit<ResearchDataQuery, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: ResearchDataQuery | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('research_data_queries')
      .insert(query)
      .select()
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error creating research data query:', error);
    return { data: null, error: error as Error };
  }
};

const updateResearchDataQuery = async (id: string, updates: Partial<ResearchDataQuery>): Promise<{ data: ResearchDataQuery | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('research_data_queries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error(`Error updating research data query with ID ${id}:`, error);
    return { data: null, error: error as Error };
  }
};

const deleteResearchDataQuery = async (id: string): Promise<{ success: boolean; error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('research_data_queries')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error(`Error deleting research data query with ID ${id}:`, error);
    return { success: false, error: error as Error };
  }
};

// Export all functions
const researchService = {
  // Research Projects
  getResearchProjects,
  getResearchProjectById,
  createResearchProject,
  updateResearchProject,
  deleteResearchProject,
  
  // Research Documents
  getResearchDocuments,
  getResearchDocumentById,
  createResearchDocument,
  updateResearchDocument,
  deleteResearchDocument,
  
  // Research Tasks
  getResearchTasks,
  getResearchTaskById,
  createResearchTask,
  updateResearchTask,
  deleteResearchTask,
  
  // Research Prompts
  getResearchPrompts,
  getResearchPromptById,
  createResearchPrompt,
  updateResearchPrompt,
  deleteResearchPrompt,
  
  // Research Notes
  getResearchNotes,
  getResearchNoteById,
  createResearchNote,
  updateResearchNote,
  deleteResearchNote,
  
  // Research Data Queries
  getResearchDataQueries,
  getResearchDataQueryById,
  createResearchDataQuery,
  updateResearchDataQuery,
  deleteResearchDataQuery
};

export default researchService;
