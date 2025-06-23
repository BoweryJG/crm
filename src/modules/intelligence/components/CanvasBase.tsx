// CanvasBase - Shared foundation for Intelligence Hub modules
// Provides common gallery components, AI integration, and authentication logic

import React, { ReactNode } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Fade,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Lock as LockIcon,
  AutoAwesome as AIIcon,
} from '@mui/icons-material';
import { Gallery, GalleryContainer, Monolith } from '../../../components/gallery';
import glassEffects from '../../../themes/glassEffects';
import animations from '../../../themes/animations';
import { useAuth } from '../../../auth';
import { useAppMode } from '../../../contexts/AppModeContext';

interface CanvasBaseProps {
  title: string;
  subtitle: string;
  overline: string;
  children: ReactNode;
  isGenerating?: boolean;
  loadingMessage?: string;
  emptyStateIcon?: ReactNode;
  emptyStateMessage?: string;
  onSignInClick?: () => void;
}

export const CanvasBase: React.FC<CanvasBaseProps> = ({
  title,
  subtitle,
  overline,
  children,
  isGenerating = false,
  loadingMessage = 'AI PROCESSING...',
  emptyStateIcon,
  emptyStateMessage = 'SELECT PARAMETERS TO BEGIN',
  onSignInClick,
}) => {
  const theme = useTheme();
  const { user } = useAuth();
  const { isDemo } = useAppMode();

  return (
    <Gallery.Container maxWidth="lg">
      <Fade in timeout={animations.durations.deliberate}>
        <Box>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="overline"
              sx={{
                color: theme.palette.primary.main,
                letterSpacing: '0.3em',
                display: 'block',
                mb: 2,
              }}
            >
              {overline}
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 200,
                letterSpacing: '0.15em',
                mb: 3,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                maxWidth: 600,
                mx: 'auto',
                letterSpacing: '0.05em',
              }}
            >
              {subtitle}
            </Typography>
          </Box>

          {/* Demo Mode Alert */}
          {(isDemo || !user) && (
            <Alert
              severity="info"
              icon={<LockIcon />}
              action={
                onSignInClick && (
                  <Button
                    size="small"
                    onClick={onSignInClick}
                    sx={{ letterSpacing: '0.05em' }}
                  >
                    Sign In
                  </Button>
                )
              }
              sx={{
                mb: 4,
                ...glassEffects.effects.museum,
                borderRadius: 0,
                '& .MuiAlert-icon': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              <Typography variant="body2" sx={{ letterSpacing: '0.05em' }}>
                {isDemo
                  ? 'Demo Mode: Generate and preview content. Sign in to save, send, and track.'
                  : 'Public Access: Explore all features. Sign in to save and automate your workflow.'}
              </Typography>
            </Alert>
          )}

          {/* Main Content */}
          {children}

          {/* Empty State */}
          {!isGenerating && emptyStateIcon && (
            <Box
              sx={{
                mt: 8,
                textAlign: 'center',
                py: 8,
                ...glassEffects.effects.museum,
                borderRadius: 0,
              }}
            >
              <Box
                sx={{
                  fontSize: 64,
                  color: alpha(theme.palette.primary.main, 0.2),
                  mb: 2,
                }}
              >
                {emptyStateIcon}
              </Box>
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.text.secondary,
                  letterSpacing: '0.1em',
                  fontWeight: 300,
                }}
              >
                {emptyStateMessage}
              </Typography>
            </Box>
          )}
        </Box>
      </Fade>
    </Gallery.Container>
  );
};

// Shared AI Button Component
export const AIGenerateButton: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
  fullWidth?: boolean;
}> = ({ onClick, disabled, loading, label = 'GENERATE', fullWidth }) => {
  const theme = useTheme();

  return (
    <Button
      variant="contained"
      size="large"
      onClick={onClick}
      disabled={disabled || loading}
      startIcon={<AIIcon />}
      fullWidth={fullWidth}
      sx={{
        px: 6,
        py: 1.5,
        letterSpacing: '0.15em',
        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.8)})`,
        '&:hover': {
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.8)}, ${theme.palette.primary.main})`,
          transform: 'translateY(-1px)',
          boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
        },
        '&.Mui-disabled': {
          background: alpha(theme.palette.primary.main, 0.3),
        },
      }}
    >
      {loading ? 'PROCESSING...' : label}
    </Button>
  );
};

// Shared Result Card Component
export const ResultCard: React.FC<{
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  animationDelay?: number;
  onClick?: () => void;
}> = ({ children, variant = 'primary', animationDelay = 0, onClick }) => {
  const variantMap = {
    primary: 'goldInfused',
    secondary: 'carbon',
    accent: 'museum',
  };

  return (
    <Monolith
      variant={variantMap[variant] as any}
      hover={onClick ? 'subtle' : 'none'}
      animationDelay={animationDelay}
      onClick={onClick}
    >
      {children}
    </Monolith>
  );
};

export default CanvasBase;