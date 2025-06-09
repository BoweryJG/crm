import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Divider,
  Button,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  Folder as FolderIcon,
  Description as DescriptionIcon,
  Assignment as AssignmentIcon,
  Lightbulb as LightbulbIcon,
  Analytics as AnalyticsIcon,
  MenuBook as MenuBookIcon
} from '@mui/icons-material';

import ResearchProjectManager from './ResearchProjectManager';
import ResearchDocumentEditor from './ResearchDocumentEditor';
import AIResearchAssistant from './AIResearchAssistant';
import MarketDataExplorer from './MarketDataExplorer';
import ResearchInsights from './ResearchInsights';
import ResearchLibrary from './ResearchLibrary';

import researchService from '../../services/research/researchService';
import { ResearchProject, ResearchDocument, ResearchTask, ResearchCanvasState } from '../../types/research';
import { useAuth } from '../../auth';

// TabPanel component for tab content
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`research-tabpanel-${index}`}
      aria-labelledby={`research-tab-${index}`}
      {...other}
      style={{ height: '100%', overflow: 'auto' }}
    >
      {value === index && (
        <Box sx={{ p: 2, height: '100%' }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const ResearchCanvas: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [canvasState, setCanvasState] = useState<ResearchCanvasState>({
    isLoading: true,
    activeProject: undefined,
    activeDocument: undefined,
    activeTasks: undefined,
    activeNotes: undefined,
    activeDataQuery: undefined,
    activePrompt: undefined,
    generatedContent: undefined,
    error: null
  });
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [documents, setDocuments] = useState<ResearchDocument[]>([]);
  const [tasks, setTasks] = useState<ResearchTask[]>([]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setCanvasState(prev => ({ ...prev, isLoading: true }));
      
      try {
        // Fetch projects
        const projectsResult = await researchService.getResearchProjects();
        if (projectsResult.error) throw projectsResult.error;
        setProjects(projectsResult.data || []);
        
        // If there's at least one project, set it as active
        if (projectsResult.data && projectsResult.data.length > 0) {
          const activeProject = projectsResult.data[0];
          setCanvasState(prev => ({ ...prev, activeProject }));
          
          // Fetch documents for the active project
          const documentsResult = await researchService.getResearchDocuments(activeProject.id);
          if (documentsResult.error) throw documentsResult.error;
          setDocuments(documentsResult.data || []);
          
          // Fetch tasks for the active project
          const tasksResult = await researchService.getResearchTasks(activeProject.id);
          if (tasksResult.error) throw tasksResult.error;
          setTasks(tasksResult.data || []);
        }
      } catch (error) {
        console.error('Error fetching research data:', error);
        setCanvasState(prev => ({ ...prev, error: error as Error }));
      } finally {
        setCanvasState(prev => ({ ...prev, isLoading: false }));
      }
    };
    
    fetchData();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleProjectSelect = async (projectId: string) => {
    setCanvasState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Fetch project details
      const projectResult = await researchService.getResearchProjectById(projectId);
      if (projectResult.error) throw projectResult.error;
      if (!projectResult.data) throw new Error(`Project with ID ${projectId} not found`);
      
      const activeProject = projectResult.data;
      setCanvasState(prev => ({ ...prev, activeProject: activeProject }));
      
      // Fetch documents for the selected project
      const documentsResult = await researchService.getResearchDocuments(projectId);
      if (documentsResult.error) throw documentsResult.error;
      setDocuments(documentsResult.data || []);
      
      // Fetch tasks for the selected project
      const tasksResult = await researchService.getResearchTasks(projectId);
      if (tasksResult.error) throw tasksResult.error;
      setTasks(tasksResult.data || []);
    } catch (error) {
      console.error(`Error selecting project with ID ${projectId}:`, error);
      setCanvasState(prev => ({ ...prev, error: error as Error }));
    } finally {
      setCanvasState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleDocumentSelect = async (documentId: string) => {
    setCanvasState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Fetch document details
      const documentResult = await researchService.getResearchDocumentById(documentId);
      if (documentResult.error) throw documentResult.error;
      if (!documentResult.data) throw new Error(`Document with ID ${documentId} not found`);
      
      const activeDocument = documentResult.data;
      setCanvasState(prev => ({ ...prev, activeDocument: activeDocument }));
      
      // Switch to the document editor tab
      setTabValue(1);
    } catch (error) {
      console.error(`Error selecting document with ID ${documentId}:`, error);
      setCanvasState(prev => ({ ...prev, error: error as Error }));
    } finally {
      setCanvasState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleCreateProject = async (project: Omit<ResearchProject, 'id' | 'created_at' | 'updated_at'>) => {
    setCanvasState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Create the project
      const result = await researchService.createResearchProject(project);
      if (result.error) throw result.error;
      if (!result.data) throw new Error('Failed to create project');
      
      // Add the new project to the list
      setProjects(prev => [result.data!, ...prev]);
      
      // Set the new project as active
      setCanvasState(prev => ({ ...prev, activeProject: result.data || undefined }));
      
      // Clear documents and tasks
      setDocuments([]);
      setTasks([]);
    } catch (error) {
      console.error('Error creating project:', error);
      setCanvasState(prev => ({ ...prev, error: error as Error }));
    } finally {
      setCanvasState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleCreateDocument = async (document: Omit<ResearchDocument, 'id' | 'created_at' | 'updated_at'>) => {
    setCanvasState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Create the document
      const result = await researchService.createResearchDocument(document);
      if (result.error) throw result.error;
      if (!result.data) throw new Error('Failed to create document');
      
      // Add the new document to the list
      setDocuments(prev => [result.data!, ...prev]);
      
      // Set the new document as active
      setCanvasState(prev => ({ ...prev, activeDocument: result.data || undefined }));
      
      // Switch to the document editor tab
      setTabValue(1);
    } catch (error) {
      console.error('Error creating document:', error);
      setCanvasState(prev => ({ ...prev, error: error as Error }));
    } finally {
      setCanvasState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="research canvas tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<FolderIcon />} label="Projects" />
          <Tab icon={<DescriptionIcon />} label="Documents" />
          <Tab icon={<LightbulbIcon />} label="AI Assistant" />
          <Tab icon={<AssignmentIcon />} label="Market Data" />
          <Tab icon={<AnalyticsIcon />} label="Insights" />
          <Tab icon={<MenuBookIcon />} label="Library" />
        </Tabs>
      </Box>
      
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        {canvasState.isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : canvasState.error ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="error">Error: {canvasState.error.message}</Typography>
            <Button 
              variant="contained" 
              sx={{ mt: 2 }}
              onClick={() => window.location.reload()}
            >
              Reload
            </Button>
          </Box>
        ) : (
          <>
            <TabPanel value={tabValue} index={0}>
              <ResearchProjectManager 
                projects={projects}
                activeProject={canvasState.activeProject}
                onProjectSelect={handleProjectSelect}
                onCreateProject={handleCreateProject}
                userId={user?.id || ''}
              />
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              <ResearchDocumentEditor 
                document={canvasState.activeDocument}
                project={canvasState.activeProject}
                onSave={(doc: ResearchDocument) => {
                  // Handle document save
                  console.log('Saving document:', doc);
                }}
                userId={user?.id || ''}
              />
            </TabPanel>
            
            <TabPanel value={tabValue} index={2}>
              <AIResearchAssistant 
                project={canvasState.activeProject}
                document={canvasState.activeDocument}
                onDocumentCreate={handleCreateDocument}
                userId={user?.id || ''}
              />
            </TabPanel>
            
            <TabPanel value={tabValue} index={3}>
              <MarketDataExplorer 
                project={canvasState.activeProject}
                onDocumentCreate={handleCreateDocument}
                userId={user?.id || ''}
              />
            </TabPanel>
            
            <TabPanel value={tabValue} index={4}>
              <ResearchInsights 
                project={canvasState.activeProject}
                documents={documents}
                userId={user?.id || ''}
                onInsightGenerated={(doc) => {
                  // Add the new document to the list
                  setDocuments(prev => [doc, ...prev]);
                }}
              />
            </TabPanel>
            
            <TabPanel value={tabValue} index={5}>
              <ResearchLibrary 
                documents={documents}
                onDocumentSelect={handleDocumentSelect}
                userId={user?.id || ''}
              />
            </TabPanel>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ResearchCanvas;
