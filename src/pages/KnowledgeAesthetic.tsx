import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { AestheticProceduresService } from '../services/knowledgeBase/aestheticProcedures';
import ProcedureLibrary from '../components/analytics/ProcedureLibrary';
import ProcedureDetailModal from '../components/analytics/ProcedureDetailModal';
import { AestheticProcedure } from '../types';

const KnowledgeAesthetic: React.FC = () => {
  const [aestheticProcedures, setAestheticProcedures] = useState<AestheticProcedure[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [procedureModalOpen, setProcedureModalOpen] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState<AestheticProcedure | null>(null);

  useEffect(() => {
    const fetchProcedures = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await AestheticProceduresService.getAllProcedures();
        setAestheticProcedures(data);
      } catch (err) {
        console.error('Error fetching aesthetic procedures:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProcedures();
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" variant="h6">
          Error loading aesthetic procedures: {error.message}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <ProcedureLibrary
        procedures={aestheticProcedures}
        type="aesthetic"
        onProcedureClick={(procedure) => {
          setSelectedProcedure(procedure as AestheticProcedure);
          setProcedureModalOpen(true);
        }}
      />
      
      <ProcedureDetailModal
        open={procedureModalOpen}
        onClose={() => setProcedureModalOpen(false)}
        procedure={selectedProcedure}
        type="aesthetic"
      />
    </Box>
  );
};

export default KnowledgeAesthetic;