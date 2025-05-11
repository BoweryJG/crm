import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  Save as SaveIcon,
  Delete as DeleteIcon,
  FileCopy as FileCopyIcon
} from '@mui/icons-material';

import { ResearchProject, ResearchDocument, ResearchDocumentType } from '../../types/research';
import researchService from '../../services/research/researchService';
import AutomationButton from './AutomationButton';

interface ResearchDocumentEditorProps {
  document?: ResearchDocument;
  project?: ResearchProject;
  onSave: (document: ResearchDocument) => void;
  userId: string;
}

const ResearchDocumentEditor: React.FC<ResearchDocumentEditorProps> = ({
  document,
  project,
  onSave,
  userId
}) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [editedDocument, setEditedDocument] = useState<Partial<ResearchDocument>>({
    title: '',
    content: '',
    document_type: ResearchDocumentType.MARKET_ANALYSIS,
    created_by: userId,
    is_ai_generated: false,
    version: 1,
    tags: []
  });
  const [newTag, setNewTag] = useState('');

  // Initialize form with document data when it changes
  useEffect(() => {
    if (document) {
      setEditedDocument({
        ...document
      });
    } else if (project) {
      // Create a new document for the current project
      setEditedDocument({
        title: '',
        content: '',
        document_type: ResearchDocumentType.MARKET_ANALYSIS,
        created_by: userId,
        is_ai_generated: false,
        version: 1,
        project_id: project.id,
        tags: []
      });
    } else {
      // Reset form
      setEditedDocument({
        title: '',
        content: '',
        document_type: ResearchDocumentType.MARKET_ANALYSIS,
        created_by: userId,
        is_ai_generated: false,
        version: 1,
        tags: []
      });
    }
  }, [document, project, userId]);

  const handleSave = async () => {
    if (!editedDocument.title || !editedDocument.content) {
      setError(new Error('Title and content are required'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let result;

      if (document?.id) {
        // Update existing document
        result = await researchService.updateResearchDocument(
          document.id,
          {
            title: editedDocument.title,
            content: editedDocument.content,
            document_type: editedDocument.document_type,
            tags: editedDocument.tags,
            version: (document.version || 0) + 1
          }
        );
      } else {
        // Create new document
        result = await researchService.createResearchDocument({
          title: editedDocument.title || '',
          content: editedDocument.content || '',
          document_type: editedDocument.document_type || ResearchDocumentType.MARKET_ANALYSIS,
          created_by: userId,
          is_ai_generated: false,
          version: 1,
          project_id: project?.id,
          tags: editedDocument.tags
        });
      }

      if (result.error) throw result.error;
      if (!result.data) throw new Error('Failed to save document');

      onSave(result.data);
    } catch (err) {
      console.error('Error saving document:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = () => {
    if (newTag && editedDocument.tags) {
      setEditedDocument({
        ...editedDocument,
        tags: [...editedDocument.tags, newTag]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (editedDocument.tags) {
      setEditedDocument({
        ...editedDocument,
        tags: editedDocument.tags.filter(tag => tag !== tagToRemove)
      });
    }
  };

  const handleCreateNewVersion = () => {
    if (document) {
      setEditedDocument({
        ...document,
        id: undefined,
        version: (document.version || 0) + 1,
        parent_document_id: document.id
      });
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2">
          {document?.id ? 'Edit Document' : 'New Document'}
        </Typography>
        <Box>
          {document?.id && (
            <>
              <Button
                variant="outlined"
                startIcon={<FileCopyIcon />}
                onClick={handleCreateNewVersion}
                sx={{ mr: 1 }}
              >
                New Version
              </Button>
              <AutomationButton
                document={document}
                onAutomationStart={(updatedDoc) => {
                  setEditedDocument(updatedDoc);
                  onSave(updatedDoc);
                }}
                onAutomationComplete={(updatedDoc) => {
                  setEditedDocument(updatedDoc);
                  onSave(updatedDoc);
                }}
                userId={userId}
              />
            </>
          )}
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={isLoading || !editedDocument.title || !editedDocument.content}
            sx={{ ml: 1 }}
          >
            Save
          </Button>
        </Box>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          Error: {error.message}
        </Typography>
      )}

      <Paper sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 2 }}>
          <Box>
            <TextField
              label="Document Title"
              fullWidth
              required
              value={editedDocument.title || ''}
              onChange={(e) => setEditedDocument({ ...editedDocument, title: e.target.value })}
              disabled={isLoading}
            />
          </Box>
          <Box>
            <FormControl fullWidth>
              <InputLabel>Document Type</InputLabel>
              <Select
                value={editedDocument.document_type}
                label="Document Type"
                onChange={(e) => setEditedDocument({ ...editedDocument, document_type: e.target.value as ResearchDocumentType })}
                disabled={isLoading}
              >
                <MenuItem value={ResearchDocumentType.MARKET_ANALYSIS}>Market Analysis</MenuItem>
                <MenuItem value={ResearchDocumentType.COMPETITOR_PROFILE}>Competitor Profile</MenuItem>
                <MenuItem value={ResearchDocumentType.PRACTICE_PROFILE}>Practice Profile</MenuItem>
                <MenuItem value={ResearchDocumentType.TREND_ANALYSIS}>Trend Analysis</MenuItem>
                <MenuItem value={ResearchDocumentType.TECHNOLOGY_ASSESSMENT}>Technology Assessment</MenuItem>
                <MenuItem value={ResearchDocumentType.LITERATURE_REVIEW}>Literature Review</MenuItem>
                <MenuItem value={ResearchDocumentType.SURVEY_RESULTS}>Survey Results</MenuItem>
                <MenuItem value={ResearchDocumentType.INTERVIEW_NOTES}>Interview Notes</MenuItem>
                <MenuItem value={ResearchDocumentType.OTHER}>Other</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ gridColumn: '1 / -1' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TextField
                label="Add Tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                disabled={isLoading}
                sx={{ flexGrow: 1 }}
              />
              <Button
                variant="contained"
                onClick={handleAddTag}
                disabled={isLoading || !newTag}
                sx={{ ml: 1, height: 56 }}
              >
                Add
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 2 }}>
              {editedDocument.tags?.map(tag => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  sx={{ mr: 0.5, mb: 0.5 }}
                  disabled={isLoading}
                />
              ))}
            </Box>
          </Box>
          <Box sx={{ gridColumn: '1 / -1', flexGrow: 1 }}>
            <TextField
              label="Content"
              fullWidth
              multiline
              required
              rows={20}
              value={editedDocument.content || ''}
              onChange={(e) => setEditedDocument({ ...editedDocument, content: e.target.value })}
              disabled={isLoading}
              sx={{ height: '100%' }}
            />
          </Box>
        </Box>
      </Paper>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {document?.id && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="textSecondary">
            Document ID: {document.id} • Version: {document.version} • Created: {new Date(document.created_at).toLocaleString()} • Last Updated: {new Date(document.updated_at).toLocaleString()}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ResearchDocumentEditor;
