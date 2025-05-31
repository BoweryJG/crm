import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { DentalProceduresService } from '../services/knowledgeBase/dentalProcedures';
import ProcedureLibrary from '../components/analytics/ProcedureLibrary';
import ProcedureDetailModal from '../components/analytics/ProcedureDetailModal';
import { DentalProcedure } from '../types';

const KnowledgeDental: React.FC = () => {
  const [dentalProcedures, setDentalProcedures] = useState<DentalProcedure[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [procedureModalOpen, setProcedureModalOpen] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState<DentalProcedure | null>(null);

  useEffect(() => {
    const fetchProcedures = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await DentalProceduresService.getAllProcedures();
        setDentalProcedures(data);
      } catch (err) {
        console.error('Error fetching dental procedures:', err);
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
          Error loading dental procedures: {error.message}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <ProcedureLibrary
        procedures={dentalProcedures}
        type="dental"
        onProcedureClick={(procedure) => {
          setSelectedProcedure(procedure as DentalProcedure);
          setProcedureModalOpen(true);
        }}
      />
      
      <ProcedureDetailModal
        open={procedureModalOpen}
        onClose={() => setProcedureModalOpen(false)}
        procedure={selectedProcedure}
        type="dental"
      />
    </Box>
  );
};

export default KnowledgeDental;