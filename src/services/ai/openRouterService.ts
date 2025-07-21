import { AIPrompt, AIResponse, AIGeneratedAsset, AIPromptExecutionParams } from '../../types/ai';
import axios from 'axios';
import { logger } from '../../utils/logger';

// Get the backend URL from environment variables
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://osbackend-zl1h.onrender.com';

// Extract variables from prompt content (format: {{variable_name}})
export const extractVariables = (promptContent: string): string[] => {
  const regex = /\{\{([^}]+)\}\}/g;
  const variables: string[] = [];
  let match;
  
  while ((match = regex.exec(promptContent)) !== null) {
    variables.push(match[1].trim());
  }
  
  // Return unique variables
  return Array.from(new Set(variables));
};

// Replace variables in prompt content
const replaceVariables = (promptContent: string, variables: Record<string, string>): string => {
  let result = promptContent;
  
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(regex, value);
  });
  
  return result;
};

// OpenRouter service
const openRouterService = {
  // Get all prompts
  getPrompts: async (): Promise<{ data: AIPrompt[] | null; error: Error | null }> => {
    try {
      // Fetch prompts from the backend API
      const response = await axios.get(`${BACKEND_URL}/api/crm/prompts`);
      
      if (response.data && Array.isArray(response.data)) {
        return { data: response.data, error: null };
      } else {
        throw new Error('Invalid response format from backend');
      }
    } catch (error) {
      logger.error('Error fetching prompts:', error);
      return { data: null, error: error as Error };
    }
  },
  
  // Execute a prompt
  executePrompt: async (
    promptId: string,
    variables: Record<string, string>,
    modelOverride: string | null = null,
    params: AIPromptExecutionParams = {}
  ): Promise<{
    prompt: AIPrompt | null;
    response: AIResponse | null;
    asset: AIGeneratedAsset | null;
    error: Error | null;
  }> => {
    try {
      // Get the prompt
      const { data: prompts, error: promptError } = await openRouterService.getPrompts();
      
      if (promptError) throw promptError;
      if (!prompts) throw new Error('No prompts found');
      
      const prompt = prompts.find(p => p.id === promptId);
      if (!prompt) throw new Error(`Prompt with ID ${promptId} not found`);
      
      // Replace variables in the prompt content
      const processedContent = replaceVariables(prompt.prompt_content, variables);
      
      logger.debug('Sending request to backend:', `${BACKEND_URL}/webhook`);
      
      // Make a request to the backend's webhook endpoint
      const response = await axios.post(`${BACKEND_URL}/webhook`, {
        prompt: processedContent,
        model: modelOverride || prompt.model_used,
        parameters: {
          temperature: params.temperature || prompt.parameter_defaults?.temperature || 0.7,
          max_tokens: params.max_tokens || prompt.parameter_defaults?.max_tokens || 1000
        }
      });
      
      logger.debug('Backend response:', response.data);
      
      // Create a response object from the backend response
      const aiResponse: AIResponse = {
        id: `response-${Date.now()}`,
        prompt_id: promptId,
        model_used: modelOverride || prompt.model_used,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        completion_tokens: response.data.result?.usage?.completion_tokens || 0,
        prompt_tokens: response.data.result?.usage?.prompt_tokens || 0,
        total_tokens: response.data.result?.usage?.total_tokens || 0,
        parameters: {
          temperature: params.temperature || prompt.parameter_defaults?.temperature || 0.7,
          max_tokens: params.max_tokens || prompt.parameter_defaults?.max_tokens || 1000
        }
      };
      
      // Extract content from the response
      let content = '';
      if (response.data.result?.choices && response.data.result.choices.length > 0) {
        content = response.data.result.choices[0].message.content;
      } else {
        content = 'No content was generated from the API.';
      }
      
      // Create an asset object
      const asset: AIGeneratedAsset = {
        id: `asset-${Date.now()}`,
        response_id: aiResponse.id,
        content: content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        format: 'text',
        asset_type: 'content',
        generated_by: modelOverride || prompt.model_used
      };
      
      // Update usage count by calling the backend API
      try {
        await axios.post(`${BACKEND_URL}/api/crm/prompts/${promptId}/increment-usage`);
      } catch (error) {
        logger.warn('Failed to increment prompt usage count:', error);
      }
      
      return {
        prompt,
        response: aiResponse,
        asset: asset,
        error: null
      };
    } catch (error) {
      logger.error('Error executing prompt:', error);
      return {
        prompt: null,
        response: null,
        asset: null,
        error: error as Error
      };
    }
  }
};


export { openRouterService };
