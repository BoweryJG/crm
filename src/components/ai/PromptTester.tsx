import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  SelectChangeEvent
} from '@mui/material';
import { 
  Send as SendIcon,
  ContentCopy as ContentCopyIcon,
  Check as CheckIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { openRouterService, extractVariables } from '../../services/ai/openRouterService';
import { AIPrompt } from '../../types/ai';

interface PromptTesterProps {
  prompt: AIPrompt;
  onClose?: () => void;
}

const PromptTester: React.FC<PromptTesterProps> = ({ prompt, onClose }) => {
  const theme = useTheme();
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [promptVariables, setPromptVariables] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>(prompt.model_used);
  const [temperature, setTemperature] = useState<number>(prompt.parameter_defaults?.temperature || 0.7);
  const [maxTokens, setMaxTokens] = useState<number>(prompt.parameter_defaults?.max_tokens || 1000);
  const [copied, setCopied] = useState(false);

  // Extract variables from the prompt content
  useEffect(() => {
    if (prompt) {
      const extractedVars = extractVariables(prompt.prompt_content);
      setPromptVariables(extractedVars);
      
      // Initialize variables state with empty strings
      const initialVars: Record<string, string> = {};
      extractedVars.forEach(variable => {
        initialVars[variable] = '';
      });
      setVariables(initialVars);
    }
  }, [prompt]);

  const handleVariableChange = (variable: string, value: string) => {
    setVariables(prev => ({
      ...prev,
      [variable]: value
    }));
  };

  const handleModelChange = (event: SelectChangeEvent<string>) => {
    setSelectedModel(event.target.value);
  };

  const handleTemperatureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value) && value >= 0 && value <= 1) {
      setTemperature(value);
    }
  };

  const handleMaxTokensChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value > 0) {
      setMaxTokens(value);
    }
  };

  const handleGenerateContent = async () => {
    setIsLoading(true);
    setGeneratedContent(null);
    
    try {
      const result = await openRouterService.executePrompt(
        prompt.id,
        variables,
        selectedModel !== prompt.model_used ? selectedModel : null,
        {
          temperature,
          max_tokens: maxTokens
        }
      );
      
      if (result.error) {
        throw result.error;
      }
      
      if (result.asset) {
        setGeneratedContent(result.asset.content);
      }
    } catch (error) {
      console.error('Error generating content:', error);
      setGeneratedContent('Error generating content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyContent = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    // Reset variables to empty strings
    const resetVars: Record<string, string> = {};
    promptVariables.forEach(variable => {
      resetVars[variable] = '';
    });
    setVariables(resetVars);
    setGeneratedContent(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Test Prompt: {prompt.prompt_name}
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {prompt.prompt_content}
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="h6" gutterBottom>
        Variables
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        {promptVariables.length > 0 ? (
          promptVariables.map(variable => (
            <TextField
              key={variable}
              label={variable}
              value={variables[variable] || ''}
              onChange={(e) => handleVariableChange(variable, e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
            />
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No variables found in this prompt.
          </Typography>
        )}
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="h6" gutterBottom>
        Model Settings
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel id="model-select-label">Model</InputLabel>
          <Select
            labelId="model-select-label"
            value={selectedModel}
            label="Model"
            onChange={handleModelChange}
          >
            <MenuItem value="openai/gpt-4-turbo">GPT-4 Turbo</MenuItem>
            <MenuItem value="openai/gpt-3.5-turbo">GPT-3.5 Turbo</MenuItem>
            <MenuItem value="anthropic/claude-3-opus">Claude 3 Opus</MenuItem>
            <MenuItem value="anthropic/claude-3-sonnet">Claude 3 Sonnet</MenuItem>
            <MenuItem value="anthropic/claude-3-haiku">Claude 3 Haiku</MenuItem>
            <MenuItem value="google/gemini-pro">Gemini Pro</MenuItem>
          </Select>
        </FormControl>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Temperature"
            type="number"
            value={temperature}
            onChange={handleTemperatureChange}
            inputProps={{ min: 0, max: 1, step: 0.1 }}
            fullWidth
          />
          
          <TextField
            label="Max Tokens"
            type="number"
            value={maxTokens}
            onChange={handleMaxTokensChange}
            inputProps={{ min: 100, step: 100 }}
            fullWidth
          />
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SendIcon />}
          onClick={handleGenerateContent}
          disabled={isLoading}
        >
          Generate
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleReset}
          disabled={isLoading}
        >
          Reset
        </Button>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="h6" gutterBottom>
        Generated Content
      </Typography>
      
      <Paper 
        variant="outlined" 
        sx={{ 
          p: 2, 
          minHeight: 300, 
          maxHeight: 500, 
          overflow: 'auto',
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
          position: 'relative'
        }}
      >
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : generatedContent ? (
          <>
            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
              <Button
                size="small"
                startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
                onClick={handleCopyContent}
                color={copied ? 'success' : 'primary'}
              >
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </Box>
            <Box sx={{ mt: 4, px: 1 }}>
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                {generatedContent}
              </pre>
            </Box>
          </>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography variant="body2" color="text.secondary">
              Fill in the variables and click Generate to see the result.
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default PromptTester;
