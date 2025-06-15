import React, { lazy, Suspense } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import SphereLoadingScreen from '../components/common/SphereLoadingScreen';

const LuxuryLanding = lazy(() => import('./LuxuryLanding'));
const LuxuryLandingMobile = lazy(() => import('./LuxuryLandingMobile'));

const LuxuryLandingWrapper: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <Suspense 
      fallback={
        <SphereLoadingScreen 
          loadingText="SPHERE OS" 
          message="INITIALIZING QUANTUM INTERFACE" 
        />
      }
    >
      {isMobile ? <LuxuryLandingMobile /> : <LuxuryLanding />}
    </Suspense>
  );
};

export default LuxuryLandingWrapper;