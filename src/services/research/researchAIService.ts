import { openRouterService } from '../ai/openRouterService';
import researchService from './researchService';
import { 
  ResearchPrompt, 
  ResearchDocument, 
  ResearchDocumentType,
  ResearchProject
} from '../../types/research';
import { AIGeneratedAsset, AIResponse } from '../../types/ai';

// Extract variables from research data
const extractResearchVariables = (
  project?: ResearchProject,
  relatedDocuments?: ResearchDocument[]
): Record<string, string> => {
  const variables: Record<string, string> = {};
  
  if (project) {
    variables.project_title = project.title;
    variables.project_description = project.description || '';
    
    if (project.tags && project.tags.length > 0) {
      variables.project_tags = project.tags.join(', ');
    }
  }
  
  if (relatedDocuments && relatedDocuments.length > 0) {
    // Extract key information from related documents
    const documentSummaries = relatedDocuments.map(doc => 
      `${doc.title} (${doc.document_type}): ${doc.content.substring(0, 100)}...`
    ).join('\n\n');
    
    variables.related_documents = documentSummaries;
    
    // Extract specific document types if available
    const marketAnalysis = relatedDocuments.find(doc => doc.document_type === ResearchDocumentType.MARKET_ANALYSIS);
    if (marketAnalysis) {
      variables.market_analysis = marketAnalysis.content;
    }
    
    const competitorProfile = relatedDocuments.find(doc => doc.document_type === ResearchDocumentType.COMPETITOR_PROFILE);
    if (competitorProfile) {
      variables.competitor_profile = competitorProfile.content;
    }
  }
  
  return variables;
};

// Generate research content using AI
const generateResearchContent = async (
  promptId: string,
  variables: Record<string, string>,
  modelOverride: string | null = null,
  params: {
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
  } = {}
): Promise<{
  content: string | null;
  asset: AIGeneratedAsset | null;
  error: Error | null;
}> => {
  try {
    // Execute the prompt using OpenRouter service
    const result = await openRouterService.executePrompt(
      promptId,
      variables,
      modelOverride,
      params
    );
    
    if (result.error) throw result.error;
    
    if (!result.asset) {
      throw new Error('No content was generated');
    }
    
    return {
      content: result.asset.content,
      asset: result.asset,
      error: null
    };
  } catch (error) {
    console.error('Error generating research content:', error);
    return {
      content: null,
      asset: null,
      error: error as Error
    };
  }
};

// Save generated content as a research document
const saveGeneratedContentAsDocument = async (
  content: string,
  title: string,
  documentType: ResearchDocumentType,
  projectId: string | undefined,
  userId: string,
  promptId: string,
  tags: string[] = []
): Promise<{
  document: ResearchDocument | null;
  error: Error | null;
}> => {
  try {
    const newDocument: Omit<ResearchDocument, 'id' | 'created_at' | 'updated_at'> = {
      project_id: projectId,
      title,
      content,
      document_type: documentType,
      created_by: userId,
      is_ai_generated: true,
      ai_prompt_id: promptId,
      version: 1,
      tags
    };
    
    const result = await researchService.createResearchDocument(newDocument);
    
    if (result.error) throw result.error;
    
    return {
      document: result.data,
      error: null
    };
  } catch (error) {
    console.error('Error saving generated content as document:', error);
    return {
      document: null,
      error: error as Error
    };
  }
};

// Generate a research document using a research prompt
const generateResearchDocument = async (
  promptId: string,
  title: string,
  documentType: ResearchDocumentType,
  projectId: string | undefined,
  userId: string,
  variables: Record<string, string>,
  modelOverride: string | null = null,
  params: {
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
  } = {},
  tags: string[] = []
): Promise<{
  document: ResearchDocument | null;
  content: string | null;
  error: Error | null;
}> => {
  try {
    // Generate content
    const { content, error } = await generateResearchContent(
      promptId,
      variables,
      modelOverride,
      params
    );
    
    if (error) throw error;
    if (!content) throw new Error('No content was generated');
    
    // Save as document
    const result = await saveGeneratedContentAsDocument(
      content,
      title,
      documentType,
      projectId,
      userId,
      promptId,
      tags
    );
    
    if (result.error) throw result.error;
    
    return {
      document: result.document,
      content,
      error: null
    };
  } catch (error) {
    console.error('Error generating research document:', error);
    return {
      document: null,
      content: null,
      error: error as Error
    };
  }
};

// Generate a market analysis document
const generateMarketAnalysis = async (
  projectId: string | undefined,
  userId: string,
  marketName: string,
  industry: string,
  additionalContext: string = '',
  modelOverride: string | null = null
): Promise<{
  document: ResearchDocument | null;
  content: string | null;
  error: Error | null;
}> => {
  // Mock prompt ID - in a real implementation, this would be a specific prompt for market analysis
  const promptId = '4'; // Using the competitor analysis prompt as a placeholder
  
  const variables: Record<string, string> = {
    practice_name: marketName,
    competitor_name: industry,
    additional_context: additionalContext
  };
  
  return generateResearchDocument(
    promptId,
    `Market Analysis: ${marketName}`,
    ResearchDocumentType.MARKET_ANALYSIS,
    projectId,
    userId,
    variables,
    modelOverride,
    {
      temperature: 0.5,
      max_tokens: 2000
    },
    ['market_analysis', industry.toLowerCase()]
  );
};

// Generate a competitor profile document
const generateCompetitorProfile = async (
  projectId: string | undefined,
  userId: string,
  practiceName: string,
  competitorName: string,
  additionalContext: string = '',
  modelOverride: string | null = null
): Promise<{
  document: ResearchDocument | null;
  content: string | null;
  error: Error | null;
}> => {
  // Mock prompt ID - in a real implementation, this would be a specific prompt for competitor profiles
  const promptId = '4'; // Using the competitor analysis prompt
  
  const variables: Record<string, string> = {
    practice_name: practiceName,
    competitor_name: competitorName,
    additional_context: additionalContext
  };
  
  return generateResearchDocument(
    promptId,
    `Competitor Profile: ${competitorName}`,
    ResearchDocumentType.COMPETITOR_PROFILE,
    projectId,
    userId,
    variables,
    modelOverride,
    {
      temperature: 0.5,
      max_tokens: 2000
    },
    ['competitor_profile', 'analysis']
  );
};

// Generate a practice profile document
const generatePracticeProfile = async (
  projectId: string | undefined,
  userId: string,
  practiceName: string,
  practiceType: string,
  location: string,
  additionalContext: string = '',
  modelOverride: string | null = null
): Promise<{
  document: ResearchDocument | null;
  content: string | null;
  error: Error | null;
}> => {
  // Mock prompt ID - in a real implementation, this would be a specific prompt for practice profiles
  const promptId = '4'; // Using the competitor analysis prompt as a placeholder
  
  const variables: Record<string, string> = {
    practice_name: practiceName,
    competitor_name: practiceType,
    additional_context: `Location: ${location}. ${additionalContext}`
  };
  
  return generateResearchDocument(
    promptId,
    `Practice Profile: ${practiceName}`,
    ResearchDocumentType.PRACTICE_PROFILE,
    projectId,
    userId,
    variables,
    modelOverride,
    {
      temperature: 0.5,
      max_tokens: 2000
    },
    ['practice_profile', practiceType.toLowerCase()]
  );
};

// Generate a trend analysis document
const generateTrendAnalysis = async (
  projectId: string | undefined,
  userId: string,
  trendTopic: string,
  industry: string,
  timeframe: string,
  additionalContext: string = '',
  modelOverride: string | null = null
): Promise<{
  document: ResearchDocument | null;
  content: string | null;
  error: Error | null;
}> => {
  // Mock prompt ID - in a real implementation, this would be a specific prompt for trend analysis
  const promptId = '4'; // Using the competitor analysis prompt as a placeholder
  
  const variables: Record<string, string> = {
    practice_name: trendTopic,
    competitor_name: industry,
    additional_context: `Timeframe: ${timeframe}. ${additionalContext}`
  };
  
  return generateResearchDocument(
    promptId,
    `Trend Analysis: ${trendTopic} in ${industry}`,
    ResearchDocumentType.TREND_ANALYSIS,
    projectId,
    userId,
    variables,
    modelOverride,
    {
      temperature: 0.5,
      max_tokens: 2000
    },
    ['trend_analysis', industry.toLowerCase()]
  );
};

// Create a specialized research prompt
const createResearchPrompt = async (
  promptName: string,
  promptContent: string,
  category: string,
  description: string,
  modelUsed: string,
  userId: string,
  parameterDefaults: {
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
  } = {},
  tags: string[] = []
): Promise<{
  prompt: ResearchPrompt | null;
  error: Error | null;
}> => {
  try {
    const newPrompt: Omit<ResearchPrompt, 'id' | 'created_at' | 'updated_at'> = {
      prompt_name: promptName,
      prompt_content: promptContent,
      description,
      category,
      model_used: modelUsed,
      parameter_defaults: parameterDefaults,
      created_by: userId,
      usage_count: 0,
      tags
    };
    
    const result = await researchService.createResearchPrompt(newPrompt);
    
    if (result.error) throw result.error;
    
    return {
      prompt: result.data,
      error: null
    };
  } catch (error) {
    console.error('Error creating research prompt:', error);
    return {
      prompt: null,
      error: error as Error
    };
  }
};

// Export all functions
const researchAIService = {
  extractResearchVariables,
  generateResearchContent,
  saveGeneratedContentAsDocument,
  generateResearchDocument,
  generateMarketAnalysis,
  generateCompetitorProfile,
  generatePracticeProfile,
  generateTrendAnalysis,
  createResearchPrompt
};

export default researchAIService;
