import React, { useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  LinearProgress, 
  Chip,
  Tooltip,
  useTheme,
  alpha,
  keyframes
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useMissionStatus } from '../../services/supabase/hooks/useMissionStatus';

// Luxury animations
const glowPulse = keyframes`
  0%, 100% { 
    filter: brightness(1) drop-shadow(0 0 20px rgba(139, 255, 160, 0.5));
  }
  50% { 
    filter: brightness(1.1) drop-shadow(0 0 40px rgba(139, 255, 160, 0.8));
  }
`;

const neuralWave = keyframes`
  0% { 
    background-position: 0% 50%;
  }
  50% { 
    background-position: 100% 50%;
  }
  100% { 
    background-position: 0% 50%;
  }
`;

const filamentGlow = keyframes`
  0%, 100% { 
    opacity: 0.8;
    box-shadow: 0 0 10px currentColor;
  }
  50% { 
    opacity: 1;
    box-shadow: 0 0 20px currentColor, 0 0 40px currentColor;
  }
`;

const sapphireSheen = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`;

// Styled components
const LuxuryContainer = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, 
    ${alpha('#0a0a0a', 0.98)} 0%, 
    ${alpha('#1a1a1a', 0.95)} 50%,
    ${alpha('#0f0f0f', 0.98)} 100%)`,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha('#ffffff', 0.1)}`,
  borderRadius: '20px',
  position: 'relative',
  overflow: 'hidden',
  padding: theme.spacing(4),
  boxShadow: `
    inset 0 2px 4px ${alpha('#ffffff', 0.1)},
    inset 0 -2px 4px ${alpha('#000000', 0.5)},
    0 10px 40px ${alpha('#000000', 0.5)},
    0 2px 10px ${alpha('#8bffa0', 0.2)}
  `,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(45deg, 
      transparent 30%, 
      ${alpha('#ffffff', 0.05)} 50%, 
      transparent 70%)`,
    backgroundSize: '200% 200%',
    animation: `${sapphireSheen} 8s ease-in-out infinite`,
    pointerEvents: 'none'
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `radial-gradient(circle at 30% 80%, 
      ${alpha('#8bffa0', 0.05)} 0%, 
      transparent 50%)`,
    pointerEvents: 'none'
  }
}));

const EngravedTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"GT Sectra", "Söhne", -apple-system, sans-serif',
  fontSize: '14px',
  fontWeight: 700,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: alpha('#ffffff', 0.9),
  textShadow: `
    0 1px 2px ${alpha('#000000', 0.8)},
    inset 0 -1px 1px ${alpha('#ffffff', 0.1)}
  `,
  userSelect: 'none'
}));

const SubTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Söhne", -apple-system, sans-serif',
  fontSize: '11px',
  fontWeight: 400,
  letterSpacing: '0.05em',
  color: alpha('#8bffa0', 0.7),
  marginTop: theme.spacing(0.5),
  userSelect: 'none'
}));

const GlowingCapsule = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2, 4),
  background: `linear-gradient(135deg, 
    ${alpha('#0a0a0a', 0.8)} 0%, 
    ${alpha('#1a1a1a', 0.6)} 100%)`,
  border: `2px solid ${alpha('#8bffa0', 0.4)}`,
  borderRadius: '50px',
  position: 'relative',
  animation: `${glowPulse} 3s ease-in-out infinite`,
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: -2,
    borderRadius: '50px',
    padding: 2,
    background: `linear-gradient(45deg, 
      ${alpha('#8bffa0', 0.8)}, 
      ${alpha('#4ade80', 0.6)},
      ${alpha('#8bffa0', 0.8)})`,
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    opacity: 0.8
  }
}));

const PercentageDisplay = styled(Typography)(({ theme }) => ({
  fontFamily: '"GT Sectra Display", "Söhne", -apple-system, sans-serif',
  fontSize: '72px',
  fontWeight: 300,
  color: '#8bffa0',
  letterSpacing: '-0.02em',
  lineHeight: 1,
  textShadow: `
    0 0 30px ${alpha('#8bffa0', 0.8)},
    0 0 60px ${alpha('#8bffa0', 0.4)}
  `
}));

const FilamentProgress = styled(LinearProgress)(({ theme }) => ({
  height: 2,
  borderRadius: 1,
  backgroundColor: alpha('#ffffff', 0.05),
  '& .MuiLinearProgress-bar': {
    borderRadius: 1,
    background: `linear-gradient(90deg, 
      ${alpha('#8bffa0', 0.8)} 0%, 
      ${alpha('#4ade80', 1)} 50%,
      ${alpha('#8bffa0', 0.8)} 100%)`,
    animation: `${filamentGlow} 2s ease-in-out infinite`,
    boxShadow: `0 0 10px ${alpha('#8bffa0', 0.8)}`
  }
}));

const MetricCard = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, 
    ${alpha('#0f0f0f', 0.9)} 0%, 
    ${alpha('#1a1a1a', 0.8)} 100%)`,
  border: `1px solid ${alpha('#ffffff', 0.1)}`,
  borderRadius: '12px',
  padding: theme.spacing(2),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: `linear-gradient(90deg, 
      transparent, 
      ${alpha('#8bffa0', 0.4)}, 
      transparent)`,
  }
}));

const MomentumChip = styled(Chip)<{ status: string }>(({ theme, status }) => {
  const colors = {
    stable: { primary: '#8bffa0', secondary: '#4ade80' },
    accelerating: { primary: '#fbbf24', secondary: '#f59e0b' },
    at_risk: { primary: '#ef4444', secondary: '#dc2626' }
  };
  
  const color = colors[status as keyof typeof colors] || colors.stable;
  
  return {
    background: `linear-gradient(135deg, 
      ${alpha(color.primary, 0.1)} 0%, 
      ${alpha(color.secondary, 0.05)} 100%)`,
    border: `1px solid ${alpha(color.primary, 0.4)}`,
    color: color.primary,
    fontWeight: 600,
    letterSpacing: '0.05em',
    padding: theme.spacing(0.5, 2),
    '& .MuiChip-label': {
      fontSize: '11px',
      textTransform: 'uppercase'
    }
  };
});

const NeuralBackground = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  opacity: 0.03,
  background: `linear-gradient(45deg, 
    #8bffa0 25%, 
    transparent 25%, 
    transparent 75%, 
    #8bffa0 75%, 
    #8bffa0),
    linear-gradient(45deg, 
    #8bffa0 25%, 
    transparent 25%, 
    transparent 75%, 
    #8bffa0 75%, 
    #8bffa0)`,
  backgroundSize: '60px 60px',
  backgroundPosition: '0 0, 30px 30px',
  animation: `${neuralWave} 20s linear infinite`,
  pointerEvents: 'none'
});

interface CartierBlendedProps {
  live?: boolean;
}

const CartierBlended: React.FC<CartierBlendedProps> = ({ live = true }) => {
  const { data } = useMissionStatus(live);
  
  // Animated percentage
  const springConfig = { stiffness: 50, damping: 20 };
  const progressSpring = useSpring(data?.progress_percent || 0, springConfig);
  const displayProgress = useTransform(progressSpring, (value) => Math.round(value));
  
  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${Math.round(value / 1000)}K`;
    }
    return `$${value}`;
  };

  useEffect(() => {
    if (data?.progress_percent !== undefined) {
      progressSpring.set(data.progress_percent);
    }
  }, [data?.progress_percent, progressSpring]);

  return (
    <LuxuryContainer elevation={0}>
      <NeuralBackground />
      
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <EngravedTitle>Mission Progress</EngravedTitle>
          <SubTitle>Revenue Intelligence Status — Live AI Sync</SubTitle>
        </Box>

        {/* Main Progress Display */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          mb: 4 
        }}>
          <GlowingCapsule>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <PercentageDisplay>
                <motion.span>{displayProgress}</motion.span>%
              </PercentageDisplay>
            </motion.div>
          </GlowingCapsule>
        </Box>

        {/* Progress Bar */}
        <Box sx={{ mb: 4 }}>
          <FilamentProgress 
            variant="determinate" 
            value={data?.progress_percent || 0}
          />
        </Box>

        {/* Metrics Grid */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 2,
          mb: 3
        }}>
          <Tooltip title="Current revenue this period" arrow>
            <MetricCard elevation={0}>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: alpha('#ffffff', 0.5),
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase'
                }}
              >
                Current Revenue
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: '#8bffa0',
                  fontFamily: '"GT Sectra Display", sans-serif',
                  fontWeight: 400,
                  mt: 0.5
                }}
              >
                {formatCurrency(data?.current_revenue || 0)}
              </Typography>
            </MetricCard>
          </Tooltip>

          <Tooltip title="Target revenue for this period" arrow>
            <MetricCard elevation={0}>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: alpha('#ffffff', 0.5),
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase'
                }}
              >
                Target Revenue
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: '#fbbf24',
                  fontFamily: '"GT Sectra Display", sans-serif',
                  fontWeight: 400,
                  mt: 0.5
                }}
              >
                {formatCurrency(data?.target_revenue || 0)}
              </Typography>
            </MetricCard>
          </Tooltip>
        </Box>

        {/* Status Row */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: alpha('#ffffff', 0.5),
                fontSize: '10px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}
            >
              Momentum Engine:
            </Typography>
            <MomentumChip 
              label={data?.momentum_status || 'stable'}
              size="small"
              status={data?.momentum_status || 'stable'}
            />
          </Box>

          <Tooltip title="Projected completion date at current pace" arrow>
            <Box sx={{ textAlign: 'right' }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: alpha('#ffffff', 0.5),
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase'
                }}
              >
                Projected ETA
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: alpha('#ffffff', 0.8),
                  fontFamily: '"Söhne", sans-serif'
                }}
              >
                ~{data?.eta_days || 0} days
              </Typography>
            </Box>
          </Tooltip>
        </Box>
      </Box>
    </LuxuryContainer>
  );
};

export default CartierBlended;