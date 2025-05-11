import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Container, Paper, Tabs, Tab, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../hooks/useAuth';
import ResearchProjectManager from '../components/research/ResearchProjectManager';
import ResearchDocumentEditor from '../components/research/ResearchDocumentEditor';
import { ResearchProject, ResearchDocument, ResearchWorkspaceState } from '../types/research';
import researchService from '../services/research/researchService';

const Research: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [workspaceState, setWorkspaceState] = useState<ResearchWorkspaceState>({
    isLoading: false,
    error: undefined
  });

  // Helper function to update workspace state with type safety
  const updateWorkspaceState = useCallback((updates: Partial<ResearchWorkspaceState>) => {
    setWorkspaceState(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const result = await researchService.getResearchProjects();
        if (result.error) throw result.error;
        setProjects(result.data || []);
      } catch (err) {
        console.error('Error fetching research projects:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDocumentSelect = (document: ResearchDocument) => {
    updateWorkspaceState({
      activeDocument: document
    });
  };

  const handleProjectSelect = async (projectId: string) => {
    updateWorkspaceState({
      isLoading: true,
      error: undefined
    });

    try {
      // Fetch project details
      const projectResult = await researchService.getResearchProjectById(projectId);
      if (projectResult.error) throw projectResult.error;
      if (!projectResult.data) throw new Error(`Project with ID ${projectId} not found`);
      
      const project = projectResult.data;

      // Fetch documents for the selected project
      const documentsResult = await researchService.getResearchDocuments(project.id);
      if (documentsResult.error) throw documentsResult.error;

      // Fetch tasks for the selected project
      const tasksResult = await researchService.getResearchTasks(project.id);
      if (tasksResult.error) throw tasksResult.error;

      // Fetch notes for the selected project
      const notesResult = await researchService.getResearchNotes(project.id);
      if (notesResult.error) throw notesResult.error;

      updateWorkspaceState({
        activeProject: project,
        activeTasks: tasksResult.data || [],
        activeNotes: notesResult.data || [],
        isLoading: false,
        error: undefined
      });

      // If there are documents, select the first one
      if (documentsResult.data && documentsResult.data.length > 0) {
        handleDocumentSelect(documentsResult.data[0]);
      } else {
        updateWorkspaceState({
          activeDocument: undefined
        });
      }
    } catch (err) {
      console.error('Error loading project workspace:', err);
      updateWorkspaceState({
        error: err as Error,
        isLoading: false,
        activeProject: undefined
      });
    }
  };

  const handleDocumentSave = (document: ResearchDocument) => {
    // Update the workspace state with the saved document
    updateWorkspaceState({
      activeDocument: document
    });

    // If this is a new document, refresh the project documents
    if (workspaceState.activeProject) {
      researchService.getResearchDocuments(workspaceState.activeProject.id)
        .then(result => {
          if (!result.error && result.data) {
            // Update any UI that shows the document list
            console.log('Documents refreshed after save');
          }
        });
    }
  };

  const handleProjectCreate = async (project: Omit<ResearchProject, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const result = await researchService.createResearchProject(project);
      if (result.error) throw result.error;
      if (!result.data) throw new Error('Failed to create project');
      
      // Add the new project to the list
      setProjects(prev => [...prev, result.data!]);
      
      // Select the new project
      handleProjectSelect(result.data.id);
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err as Error);
    }
  };

  const handleProjectUpdate = async (projectId: string, updates: Partial<ResearchProject>) => {
    try {
      const result = await researchService.updateResearchProject(projectId, updates);
      if (result.error) throw result.error;
      if (!result.data) throw new Error('Failed to update project');
      
      // Update the project in the list
      setProjects(prev => prev.map(p => p.id === projectId ? result.data! : p));
      
      // Update the active project if it's the one being updated
      if (workspaceState.activeProject?.id === projectId) {
        updateWorkspaceState({
          activeProject: result.data
        });
      }
    } catch (err) {
      console.error('Error updating project:', err);
      setError(err as Error);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Research Module
      </Typography>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Workspace" />
          <Tab label="Projects" />
        </Tabs>
      </Paper>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ mt: 2 }}>
          Error: {error.message}
        </Typography>
      ) : (
        <>
          {tabValue === 0 && (
            <Box sx={{ height: '100%' }}>
              <Typography variant="h5" gutterBottom>
                Research Workspace
              </Typography>
              {workspaceState.activeProject ? (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6">
                    Active Project: {workspaceState.activeProject.title}
                  </Typography>
                  {workspaceState.activeDocument && (
                    <ResearchDocumentEditor
                      document={workspaceState.activeDocument}
                      project={workspaceState.activeProject}
                      onSave={handleDocumentSave}
                      userId={user?.id || ''}
                    />
                  )}
                </Box>
              ) : (
                <Typography>
                  Select a project to start working
                </Typography>
              )}
            </Box>
          )}
          {tabValue === 1 && (
            <ResearchProjectManager
              projects={projects}
              onProjectSelect={handleProjectSelect}
              onCreateProject={(project) => {
                const projectData = {
                  ...project,
                  created_by: user?.id || ''
                };
                handleProjectCreate(projectData);
              }}
              userId={user?.id || ''}
            />
          )}
        </>
      )}
    </Container>
  );
};

export default Research;
