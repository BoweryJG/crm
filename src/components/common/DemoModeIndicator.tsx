import React, { useState } from 'react';
import { useAppMode } from '../../contexts/AppModeContext';
import { useAuth } from '../../auth';
import { Chip, Box, Tooltip } from '@mui/material';
import ScienceIcon from '@mui/icons-material/Science';
import LoginIcon from '@mui/icons-material/Login';
import { CRMQuickLoginModal } from './CRMQuickLoginModal';

export const DemoModeIndicator: React.FC = () => {
  const { isDemo } = useAppMode();
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  if (!isDemo) return null;
  
  const isPublicUser = !user;
  
  const handleClick = () => {
    if (isPublicUser) {
      setShowLoginModal(true);
    }
  };
  
  return (
    <>
      <Tooltip title={isPublicUser ? "Sign in to access live data and full features" : "You're viewing demo data. Subscribe to access live mode with your real data."}>
        <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}>
          <Chip
            icon={isPublicUser ? <LoginIcon /> : <ScienceIcon />}
            label={isPublicUser ? "PREVIEW MODE - SIGN IN" : "DEMO MODE"}
            color={isPublicUser ? "primary" : "warning"}
            sx={{ 
              fontWeight: 'bold',
              cursor: isPublicUser ? 'pointer' : 'default',
              '&:hover': isPublicUser ? {
                transform: 'scale(1.05)',
                transition: 'transform 0.2s ease'
              } : {}
            }}
            onClick={handleClick}
          />
        </Box>
      </Tooltip>
      
      {/* Login Modal */}
      <CRMQuickLoginModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => {
          setShowLoginModal(false);
          window.location.reload();
        }}
      />
    </>
  );
};
