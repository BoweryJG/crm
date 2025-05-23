import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button
} from '@mui/material';
import {
  Folder as FolderIcon,
  Description as DescriptionIcon,
  Lightbulb as LightbulbIcon,
  Add as AddIcon,
  FlashOn as FlashOnIcon
} from '@mui/icons-material';
import { ResearchProject, ResearchDocument, ResearchProjectStatus } from '../../types/research';
import { useThemeContext } from '../../themes/ThemeContext';
import AnimatedOrbHeroBG from '../dashboard/AnimatedOrbHeroBG';

interface ResearchOverviewProps {
  projects: ResearchProject[];
  documents: ResearchDocument[];
  onNewProject?: () => void;
  onRunPrompt?: () => void;
}

interface OverviewCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  orbIndex?: number;
}

const OverviewCard: React.FC<OverviewCardProps> = ({ title, value, icon, orbIndex = 0 }) => {
  const { themeMode } = useThemeContext();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        backgroundColor:
          themeMode === 'space' ? 'rgba(22, 27, 44, 0.7)' : 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(8px)',
        border: `1px solid ${themeMode === 'space' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={600}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 48,
            height: 48,
            borderRadius: 2,
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <AnimatedOrbHeroBG style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} childIndex={orbIndex} />
          {icon}
        </Box>
      </Box>
    </Paper>
  );
};

const ResearchOverview: React.FC<ResearchOverviewProps> = ({ projects, documents, onNewProject, onRunPrompt }) => {
  const { themeMode } = useThemeContext();
  const activeProjects = projects.filter(p => p.status === ResearchProjectStatus.ACTIVE).length;
  const recentDocuments = documents.filter(d => {
    const updated = d.updated_at || d.created_at;
    return updated && new Date(updated).getTime() >= Date.now() - 7 * 24 * 60 * 60 * 1000;
  }).length;
  const aiDocs = documents.filter(d => d.is_ai_generated).length;

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', md: 'repeat(4,1fr)' }, gap: 3 }}>
        <OverviewCard title="Active Projects" value={activeProjects} icon={<FolderIcon />} orbIndex={0} />
        <OverviewCard title="Recent Docs" value={recentDocuments} icon={<DescriptionIcon />} orbIndex={1} />
        <OverviewCard title="AI Insights" value={aiDocs} icon={<LightbulbIcon />} orbIndex={2} />
        <Paper
          elevation={0}
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 3,
            backgroundColor:
              themeMode === 'space' ? 'rgba(22, 27, 44, 0.7)' : 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${themeMode === 'space' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`
          }}
        >
          <Button variant="contained" startIcon={<AddIcon />} onClick={onNewProject} sx={{ mb: 1 }} fullWidth>
            New Project
          </Button>
          <Button variant="outlined" startIcon={<FlashOnIcon />} onClick={onRunPrompt} fullWidth>
            Run AI Prompt
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default ResearchOverview;
