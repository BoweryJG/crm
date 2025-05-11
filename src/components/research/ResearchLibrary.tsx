import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Divider,
  TextField,
  InputAdornment,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  Description as DocumentIcon,
  Folder as FolderIcon,
  LocalOffer as TagIcon
} from '@mui/icons-material';

import { ResearchDocument, ResearchDocumentType } from '../../types/research';

interface ResearchLibraryProps {
  documents: ResearchDocument[];
  onDocumentSelect: (documentId: string) => void;
  userId: string;
}

const ResearchLibrary: React.FC<ResearchLibraryProps> = ({
  documents,
  onDocumentSelect,
  userId
}) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  // Get all unique tags from documents
  const allTags = Array.from(
    new Set(
      documents
        .filter(doc => doc.tags && doc.tags.length > 0)
        .flatMap(doc => doc.tags || [])
    )
  ).sort();

  // Filter documents based on search query, type, and tag
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      searchQuery === '' || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = 
      selectedType === 'all' || 
      doc.document_type === selectedType;
    
    const matchesTag = 
      selectedTag === 'all' || 
      (doc.tags && doc.tags.includes(selectedTag));
    
    return matchesSearch && matchesType && matchesTag;
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    setSelectedType(event.target.value);
  };

  const handleTagChange = (event: SelectChangeEvent<string>) => {
    setSelectedTag(event.target.value);
  };

  // Get document type label
  const getDocumentTypeLabel = (type: string): string => {
    switch (type) {
      case ResearchDocumentType.MARKET_ANALYSIS:
        return 'Market Analysis';
      case ResearchDocumentType.COMPETITOR_PROFILE:
        return 'Competitor Profile';
      case ResearchDocumentType.PRACTICE_PROFILE:
        return 'Practice Profile';
      case ResearchDocumentType.TREND_ANALYSIS:
        return 'Trend Analysis';
      case ResearchDocumentType.TECHNOLOGY_ASSESSMENT:
        return 'Technology Assessment';
      case ResearchDocumentType.LITERATURE_REVIEW:
        return 'Literature Review';
      case ResearchDocumentType.SURVEY_RESULTS:
        return 'Survey Results';
      case ResearchDocumentType.INTERVIEW_NOTES:
        return 'Interview Notes';
      case ResearchDocumentType.OTHER:
      default:
        return 'Other';
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        Research Library
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <TextField
            fullWidth
            placeholder="Search documents..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="document-type-label">Document Type</InputLabel>
            <Select
              labelId="document-type-label"
              value={selectedType}
              label="Document Type"
              onChange={handleTypeChange}
            >
              <MenuItem value="all">All Types</MenuItem>
              {Object.values(ResearchDocumentType).map((type) => (
                <MenuItem key={type} value={type}>
                  {getDocumentTypeLabel(type)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="tag-label">Tag</InputLabel>
            <Select
              labelId="tag-label"
              value={selectedTag}
              label="Tag"
              onChange={handleTagChange}
            >
              <MenuItem value="all">All Tags</MenuItem>
              {allTags.map((tag) => (
                <MenuItem key={tag} value={tag}>
                  {tag}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>
      
      <Paper sx={{ flexGrow: 1, overflow: 'auto' }}>
        {filteredDocuments.length > 0 ? (
          <List>
            {filteredDocuments.map((document) => (
              <React.Fragment key={document.id}>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => onDocumentSelect(document.id)}>
                    <ListItemIcon>
                      <DocumentIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={document.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" component="span">
                            {getDocumentTypeLabel(document.document_type)}
                          </Typography>
                          <Typography variant="caption" component="span" sx={{ ml: 1 }}>
                            {new Date(document.created_at).toLocaleDateString()}
                          </Typography>
                          {document.is_ai_generated && (
                            <Chip 
                              label="AI Generated" 
                              size="small" 
                              color="secondary" 
                              sx={{ ml: 1 }} 
                            />
                          )}
                          {document.tags && document.tags.length > 0 && (
                            <Box sx={{ mt: 0.5, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {document.tags.map(tag => (
                                <Chip 
                                  key={tag} 
                                  label={tag} 
                                  size="small" 
                                  variant="outlined"
                                  icon={<TagIcon sx={{ fontSize: '0.75rem' }} />}
                                />
                              ))}
                            </Box>
                          )}
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No documents found matching your criteria.
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ResearchLibrary;
