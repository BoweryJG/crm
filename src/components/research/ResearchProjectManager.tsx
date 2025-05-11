import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  IconButton,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Archive as ArchiveIcon
} from '@mui/icons-material';

import { ResearchProject, ResearchProjectStatus } from '../../types/research';

interface ResearchProjectManagerProps {
  projects: ResearchProject[];
  activeProject?: ResearchProject;
  onProjectSelect: (projectId: string) => void;
  onCreateProject: (project: Omit<ResearchProject, 'id' | 'created_at' | 'updated_at'>) => void;
  userId: string;
}

const ResearchProjectManager: React.FC<ResearchProjectManagerProps> = ({
  projects,
  activeProject,
  onProjectSelect,
  onCreateProject,
  userId
}) => {
  const theme = useTheme();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newProject, setNewProject] = useState<Partial<ResearchProject>>({
    title: '',
    description: '',
    status: ResearchProjectStatus.ACTIVE,
    created_by: userId,
    tags: [],
    priority: 3
  });
  const [newTag, setNewTag] = useState('');

  const handleCreateDialogOpen = () => {
    setOpenCreateDialog(true);
  };

  const handleCreateDialogClose = () => {
    setOpenCreateDialog(false);
    // Reset form
    setNewProject({
      title: '',
      description: '',
      status: ResearchProjectStatus.ACTIVE,
      created_by: userId,
      tags: [],
      priority: 3
    });
    setNewTag('');
  };

  const handleCreateProject = () => {
    if (!newProject.title) {
      return; // Title is required
    }

    onCreateProject({
      title: newProject.title,
      description: newProject.description || '',
      status: newProject.status || ResearchProjectStatus.ACTIVE,
      created_by: userId,
      tags: newProject.tags || [],
      priority: newProject.priority || 3,
      progress: 0
    });

    handleCreateDialogClose();
  };

  const handleAddTag = () => {
    if (newTag && newProject.tags) {
      setNewProject({
        ...newProject,
        tags: [...newProject.tags, newTag]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (newProject.tags) {
      setNewProject({
        ...newProject,
        tags: newProject.tags.filter(tag => tag !== tagToRemove)
      });
    }
  };

  const getStatusColor = (status: ResearchProjectStatus) => {
    switch (status) {
      case ResearchProjectStatus.ACTIVE:
        return theme.palette.success.main;
      case ResearchProjectStatus.COMPLETED:
        return theme.palette.info.main;
      case ResearchProjectStatus.ARCHIVED:
        return theme.palette.text.disabled;
      case ResearchProjectStatus.ON_HOLD:
        return theme.palette.warning.main;
      default:
        return theme.palette.text.primary;
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2">
          Research Projects
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateDialogOpen}
        >
          New Project
        </Button>
      </Box>

      <Paper sx={{ flexGrow: 1, overflow: 'auto' }}>
        {projects.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary">
              No research projects found. Create your first project to get started.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleCreateDialogOpen}
              sx={{ mt: 2 }}
            >
              Create Project
            </Button>
          </Box>
        ) : (
          <List>
            {projects.map((project, index) => (
              <React.Fragment key={project.id}>
                {index > 0 && <Divider />}
                <ListItem
                  sx={{ 
                    cursor: 'pointer',
                    bgcolor: activeProject?.id === project.id ? 'action.selected' : 'inherit'
                  }}
                  onClick={() => onProjectSelect(project.id)}
                >
                  <ListItemIcon>
                    {activeProject?.id === project.id ? (
                      <FolderOpenIcon color="primary" />
                    ) : (
                      <FolderIcon />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="subtitle1" component="span">
                          {project.title}
                        </Typography>
                        <Chip
                          label={project.status}
                          size="small"
                          sx={{
                            ml: 1,
                            backgroundColor: getStatusColor(project.status),
                            color: '#fff'
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="textSecondary" noWrap>
                          {project.description}
                        </Typography>
                        <Box sx={{ mt: 0.5 }}>
                          {project.tags?.map(tag => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          ))}
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {/* Create Project Dialog */}
      <Dialog open={openCreateDialog} onClose={handleCreateDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Create New Research Project</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mt: 1 }}>
            <Box sx={{ gridColumn: '1 / -1' }}>
              <TextField
                label="Project Title"
                fullWidth
                required
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              />
            </Box>
            <Box sx={{ gridColumn: '1 / -1' }}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={newProject.description || ''}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              />
            </Box>
            <Box>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newProject.status}
                  label="Status"
                  onChange={(e) => setNewProject({ ...newProject, status: e.target.value as ResearchProjectStatus })}
                >
                  <MenuItem value={ResearchProjectStatus.ACTIVE}>Active</MenuItem>
                  <MenuItem value={ResearchProjectStatus.ON_HOLD}>On Hold</MenuItem>
                  <MenuItem value={ResearchProjectStatus.COMPLETED}>Completed</MenuItem>
                  <MenuItem value={ResearchProjectStatus.ARCHIVED}>Archived</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={newProject.priority}
                  label="Priority"
                  onChange={(e) => setNewProject({ ...newProject, priority: e.target.value as number })}
                >
                  <MenuItem value={1}>Highest</MenuItem>
                  <MenuItem value={2}>High</MenuItem>
                  <MenuItem value={3}>Medium</MenuItem>
                  <MenuItem value={4}>Low</MenuItem>
                  <MenuItem value={5}>Lowest</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ gridColumn: '1 / -1' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  label="Add Tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  sx={{ flexGrow: 1 }}
                />
                <Button
                  variant="contained"
                  onClick={handleAddTag}
                  disabled={!newTag}
                  sx={{ ml: 1, height: 56 }}
                >
                  Add
                </Button>
              </Box>
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap' }}>
                {newProject.tags?.map(tag => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateDialogClose}>Cancel</Button>
          <Button
            onClick={handleCreateProject}
            variant="contained"
            disabled={!newProject.title}
          >
            Create Project
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResearchProjectManager;
