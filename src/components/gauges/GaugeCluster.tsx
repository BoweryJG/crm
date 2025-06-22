import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { AviationDashboard } from './AviationGauges';

interface GaugeClusterProps {
  period?: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  onPeriodChange?: (period: string) => void;
  onGaugeClick?: (metric: string) => void;
}

const GaugeContainer = styled(Paper)(({ theme }) => ({
  background: 'rgba(10, 10, 10, 0.9)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(201, 176, 55, 0.3)',
  borderRadius: 16,
  padding: theme.spacing(3),
  position: 'relative',
  overflow: 'visible',
}));

const GaugeTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Orbitron", monospace',
  fontSize: '1.5rem',
  fontWeight: 700,
  letterSpacing: '0.1em',
  color: '#C9B037',
  textAlign: 'center',
  marginBottom: theme.spacing(3),
  textTransform: 'uppercase',
  textShadow: '0 0 20px rgba(201, 176, 55, 0.5)',
}));

const GaugeCluster: React.FC<GaugeClusterProps> = ({ 
  period = 'monthly',
  onPeriodChange,
  onGaugeClick 
}) => {
  // Dynamic values - in real app these would come from data
  const targetAlignment = 87;
  const performanceIndex = 92;
  const confidenceAssured = 94;

  return (
    <GaugeContainer elevation={0}>
      <GaugeTitle>REPSPHERES COMMAND CENTER</GaugeTitle>
      
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        gap: 3,
        alignItems: 'center',
        justifyContent: 'center',
        overflowX: 'auto',
        overflowY: 'hidden',
        // Hide scrollbar but keep functionality
        '&::-webkit-scrollbar': {
          display: 'none'
        },
        msOverflowStyle: 'none',
        scrollbarWidth: 'none'
      }}>
        {/* Target Alignment Gauge - Always visible */}
        <Box sx={{ cursor: 'pointer', flex: '0 0 auto', display: { xs: 'block', sm: 'block' } }} onClick={() => onGaugeClick?.('quota')}>
          <AviationDashboard
            metrics={{
              winProbability: targetAlignment
            }}
            size="medium"
          />
          <Typography sx={{
            textAlign: 'center',
            color: '#C9B037',
            fontFamily: '"Orbitron", monospace',
            fontSize: '0.9rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            mt: 2,
            textTransform: 'uppercase'
          }}>
            TARGET ALIGNMENT
          </Typography>
        </Box>

        {/* Performance Index Gauge - Hidden on mobile */}
        <Box sx={{ cursor: 'pointer', flex: '0 0 auto', display: { xs: 'none', sm: 'block' } }} onClick={() => onGaugeClick?.('performance')}>
          <AviationDashboard
            metrics={{
              winProbability: performanceIndex
            }}
            size="medium"
          />
          <Typography sx={{
            textAlign: 'center',
            color: '#C9B037',
            fontFamily: '"Orbitron", monospace',
            fontSize: '0.9rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            mt: 2,
            textTransform: 'uppercase'
          }}>
            PERFORMANCE INDEX
          </Typography>
        </Box>

        {/* Confidence Assured Gauge - Hidden on mobile and small screens */}
        <Box sx={{ cursor: 'pointer', flex: '0 0 auto', display: { xs: 'none', sm: 'none', md: 'block' } }} onClick={() => onGaugeClick?.('confidence')}>
          <AviationDashboard
            metrics={{
              confidence: confidenceAssured
            }}
            size="medium"
          />
          <Typography sx={{
            textAlign: 'center',
            color: '#C9B037',
            fontFamily: '"Orbitron", monospace',
            fontSize: '0.9rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            mt: 2,
            textTransform: 'uppercase'
          }}>
            CONFIDENCE ASSURED
          </Typography>
        </Box>
      </Box>
    </GaugeContainer>
  );
};

export default GaugeCluster;