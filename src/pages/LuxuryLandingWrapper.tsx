import React, { lazy, Suspense } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import PremiumLoadingScreen from '../components/common/PremiumLoadingScreen';

const LuxuryLanding = lazy(() => import('./LuxuryLanding'));
const LuxuryLandingMobile = lazy(() => import('./LuxuryLandingMobile'));

const LuxuryLandingWrapper: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <Suspense 
      fallback={
        <PremiumLoadingScreen 
          loadingText="REPSPHERES" 
          message="Preparing experience" 
          minimumDuration={1500}
        />
      }
    >
      {isMobile ? <LuxuryLandingMobile /> : <LuxuryLanding />}
    </Suspense>
  );
};

export default LuxuryLandingWrapper;