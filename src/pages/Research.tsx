import React, { useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import ResearchCanvas from '../components/research/ResearchCanvas';
import ResearchHero from '../components/research/ResearchHero';
import ResearchOverview from '../components/research/ResearchOverview';
import researchService from '../services/research/researchService';
import { ResearchProject, ResearchDocument } from '../types/research';

const Research: React.FC = () => {
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [documents, setDocuments] = useState<ResearchDocument[]>([]);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const { data: projData } = await researchService.getResearchProjects();
        if (projData) setProjects(projData);
        const { data: docData } = await researchService.getResearchDocuments();
        if (docData) setDocuments(docData);
      } catch (err) {
        console.error('Error loading research overview data', err);
      }
    };

    fetchOverviewData();
  }, []);

  const scrollToCanvas = (tabIndex?: number) => {
    if (tabIndex !== undefined) {
      const tabs = document.querySelectorAll('[role="tab"]');
      if (tabs[tabIndex]) (tabs[tabIndex] as HTMLElement).click();
    }
    const el = document.getElementById('research-module-canvas');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
      <ResearchHero />
      <ResearchOverview
        projects={projects}
        documents={documents}
        onNewProject={() => scrollToCanvas(0)}
        onRunPrompt={() => scrollToCanvas(2)}
      />
      <Box id="research-module-canvas">
        <ResearchCanvas />
      </Box>
    </Container>
  );
};

export default Research;
