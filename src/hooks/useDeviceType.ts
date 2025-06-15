import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export const useDeviceType = (): DeviceType => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  
  useEffect(() => {
    if (isMobile) {
      setDeviceType('mobile');
    } else if (isTablet) {
      setDeviceType('tablet');
    } else {
      setDeviceType('desktop');
    }
  }, [isMobile, isTablet]);
  
  return deviceType;
};

// Additional helper hook for responsive values
export const useResponsive = <T,>(mobile: T, tablet: T, desktop: T): T => {
  const deviceType = useDeviceType();
  
  switch (deviceType) {
    case 'mobile':
      return mobile;
    case 'tablet':
      return tablet;
    case 'desktop':
    default:
      return desktop;
  }
};