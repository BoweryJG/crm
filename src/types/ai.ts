// AI-related types for RepSpheres CRM

// Base model for all AI-related entities
import { BaseModel } from './models';

// AI Prompt Execution Parameters
export interface AIPromptExecutionParams {
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  [key: string]: any;
}

// AI Response Types
export interface AIResponse extends BaseModel {
  prompt_id: string;
  model_used: string;
  completion_tokens: number;
  prompt_tokens: number;
  total_tokens: number;
  parameters: {
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
    [key: string]: any;
  };
}

// AI Prompt Types
export interface AIPrompt extends BaseModel {
  prompt_name: string;
  prompt_content: string;
  input_type: string;
  model_used: string;
  industry: string;
  target_audience: string;
  tags: {
    [key: string]: any;
  };
  effectiveness_score: number;
  usage_count: number;
  active: boolean;
  related_campaign?: string;
  report_type?: string;
  openrouter_models?: string[]; // Compatible models
  parameter_defaults?: {
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
    [key: string]: any;
  };
  version?: string; // For tracking prompt versions
}

// AI Generated Asset Types
export interface AIGeneratedAsset extends BaseModel {
  queue_id?: string;
  response_id?: string;
  content: string;
  format?: string;
  asset_type?: string;
  generated_by?: string;
  model_parameters?: {
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
    [key: string]: any;
  };
  execution_time?: number; // Time taken to generate in ms
  token_count?: number; // Number of tokens used
  cost?: number; // Estimated cost of generation
}

// Content Generation Queue Types
export interface ContentGenerationQueue extends BaseModel {
  user_id: string;
  platform: string;
  trigger_ids: string[]; // Array of prompt IDs
  content_types: string[]; // Array of content types
  status: 'pending' | 'processing' | 'completed' | 'failed';
  scheduled_for: string; // Date
  variables?: {
    [key: string]: any;
  };
}

// Open Router Request Types
export interface OpenRouterRequest {
  prompt: string;
  model: string;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string[];
  [key: string]: any;
}

// Open Router Response Types
export interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
    index: number;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Automation Log Types
export interface AutomationLog extends BaseModel {
  executed_at: string;
  source_table: string;
  action: string;
  system: string;
  status: string;
  log: string;
  record_id: string;
}
