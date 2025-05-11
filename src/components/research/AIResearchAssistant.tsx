import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Divider,
  useTheme
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

import { ResearchProject, ResearchDocument, ResearchDocumentType } from '../../types/research';
import researchAIService from '../../services/research/researchAIService';
import researchService from '../../services/research/researchService';

interface AIResearchAssistantProps {
  project?: ResearchProject;
  document?: ResearchDocument;
  onDocumentCreate: (document: Omit<ResearchDocument, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  userId: string;
}

const AIResearchAssistant: React.FC<AIResearchAssistantProps> = ({
  project,
  document,
  onDocumentCreate,
  userId
}) => {
  const theme = useTheme();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleGenerateContent = async () => {
    if (!prompt || !project) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      // Get research prompts from the service
      const { data: prompts, error: promptsError } = await researchService.getResearchPrompts();
      if (promptsError) throw promptsError;
      
      // Find a suitable prompt or use the first one
      const researchPrompt = prompts && prompts.length > 0 ? prompts[0] : null;
      if (!researchPrompt) throw new Error('No research prompts available');
      
      // Prepare variables for the prompt
      const variables: Record<string, string> = {
        prompt: prompt,
        project_title: project.title,
        project_description: project.description || '',
        project_tags: project.tags?.join(', ') || ''
      };
      
      // Call the AI service to generate content
      const result = await researchAIService.generateResearchContent(
        researchPrompt.id,
        variables
      );
      
      if (result.error) throw result.error;
      
      setGeneratedContent(result.content || null);
    } catch (err) {
      console.error('Error generating content:', err);
      setError(err as Error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAsDocument = async () => {
    if (!generatedContent || !project) return;
    
    try {
      // Create a new document with the generated content
      await onDocumentCreate({
        title: prompt.length > 50 ? prompt.substring(0, 47) + '...' : prompt,
        content: generatedContent,
        document_type: ResearchDocumentType.OTHER,
        created_by: userId,
        is_ai_generated: true,
        version: 1,
        project_id: project.id,
        tags: ['ai-generated']
      });
      
      // Reset the form
      setPrompt('');
      setGeneratedContent(null);
    } catch (err) {
      console.error('Error saving document:', err);
      setError(err as Error);
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        AI Research Assistant
      </Typography>
      
      {!project ? (
        <Typography color="text.secondary">
          Please select a project to use the AI Research Assistant.
        </Typography>
      ) : (
        <>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Ask the AI to generate research content
            </Typography>
            <TextField
              label="Enter your research prompt"
              fullWidth
              multiline
              rows={3}
              value={prompt}
              onChange={handlePromptChange}
              disabled={isGenerating}
              placeholder="E.g., 'Analyze the current trends in dental implant technology' or 'Compare the top 5 competitors in the NYC aesthetic market'"
            />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SendIcon />}
                onClick={handleGenerateContent}
                disabled={isGenerating || !prompt}
              >
                {isGenerating ? 'Generating...' : 'Generate Content'}
              </Button>
            </Box>
          </Paper>
          
          {isGenerating && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          )}
          
          {error && (
            <Typography color="error" sx={{ my: 2 }}>
              Error: {error.message}
            </Typography>
          )}
          
          {generatedContent && (
            <Paper sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
              <Typography variant="subtitle1" gutterBottom>
                Generated Content
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ flexGrow: 1, overflow: 'auto', whiteSpace: 'pre-wrap' }}>
                <Typography variant="body1">
                  {generatedContent}
                </Typography>
              </Box>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleSaveAsDocument}
                >
                  Save as Document
                </Button>
              </Box>
            </Paper>
          )}
        </>
      )}
    </Box>
  );
};

export default AIResearchAssistant;
