// Research module types for RepSpheres CRM
import { BaseModel } from './models';
import { AIGeneratedAsset } from './ai';

// Research Project Status
export enum ResearchProjectStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
  ON_HOLD = 'on_hold'
}

// Research Document Type
export enum ResearchDocumentType {
  MARKET_ANALYSIS = 'market_analysis',
  COMPETITOR_PROFILE = 'competitor_profile',
  PRACTICE_PROFILE = 'practice_profile',
  TREND_ANALYSIS = 'trend_analysis',
  TECHNOLOGY_ASSESSMENT = 'technology_assessment',
  LITERATURE_REVIEW = 'literature_review',
  SURVEY_RESULTS = 'survey_results',
  INTERVIEW_NOTES = 'interview_notes',
  OTHER = 'other'
}

// Research Task Status
export enum ResearchTaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  BLOCKED = 'blocked'
}

// Research Project
export interface ResearchProject extends BaseModel {
  title: string;
  description?: string;
  status: ResearchProjectStatus;
  created_by: string;
  assigned_to?: string[];
  start_date?: string;
  end_date?: string;
  tags?: string[];
  related_practices?: string[];
  related_contacts?: string[];
  priority?: number;
  progress?: number;
}

// Automation Status
export enum AutomationStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ERROR = 'error'
}

// Research Document
export interface ResearchDocument extends BaseModel {
  project_id?: string;
  title: string;
  content: string;
  document_type: ResearchDocumentType;
  created_by: string;
  is_ai_generated: boolean;
  ai_prompt_id?: string;
  version: number;
  parent_document_id?: string;
  tags?: string[];
  related_practices?: string[];
  related_contacts?: string[];
  // Automation fields
  contact_id?: string;
  practice_id?: string;
  automation_workflow_id?: string;
  automation_status?: AutomationStatus;
  automation_started_at?: string;
  automation_completed_at?: string;
}

// Research Task
export interface ResearchTask extends BaseModel {
  project_id: string;
  title: string;
  description?: string;
  status: ResearchTaskStatus;
  assigned_to?: string;
  due_date?: string;
  completed_at?: string;
  priority?: number;
}

// Research Prompt (specialized AI prompts for research)
export interface ResearchPrompt extends BaseModel {
  prompt_name: string;
  prompt_content: string;
  description?: string;
  category: string;
  model_used: string;
  parameter_defaults?: {
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
    [key: string]: any;
  };
  created_by: string;
  usage_count: number;
  effectiveness_score?: number;
  tags?: string[];
}

// Research Note
export interface ResearchNote extends BaseModel {
  project_id?: string;
  content: string;
  created_by: string;
  tags?: string[];
  related_practices?: string[];
  related_contacts?: string[];
}

// Research Data Query
export interface ResearchDataQuery extends BaseModel {
  name: string;
  description?: string;
  query_type: string;
  query_parameters: any;
  created_by: string;
  is_public: boolean;
}

// Research Canvas State
export interface ResearchCanvasState {
  activeProject?: ResearchProject;
  activeDocument?: ResearchDocument;
  activeTasks?: ResearchTask[];
  activeNotes?: ResearchNote[];
  activeDataQuery?: ResearchDataQuery;
  activePrompt?: ResearchPrompt;
  generatedContent?: AIGeneratedAsset;
  isLoading: boolean;
  error?: Error | null;
}
