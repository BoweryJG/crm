import React, { useState, useEffect } from 'react';
import EliteLoadingScreen from './EliteLoadingScreen';

interface EliteLoadingWrapperProps {
  children: React.ReactNode;
  loading: boolean;
  loadingText?: string;
  message?: string;
  showPreview?: boolean;
  minLoadingTime?: number; // Minimum time to show loading screen in ms
}

const EliteLoadingWrapper: React.FC<EliteLoadingWrapperProps> = ({
  children,
  loading,
  loadingText,
  message,
  showPreview = true,
  minLoadingTime = 2000
}) => {
  const [showLoading, setShowLoading] = useState(loading);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (loading && !startTime) {
      setStartTime(Date.now());
      setShowLoading(true);
    }

    if (!loading && startTime) {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsed);

      if (remainingTime > 0) {
        const timer = setTimeout(() => {
          setShowLoading(false);
          setStartTime(null);
        }, remainingTime);
        return () => clearTimeout(timer);
      } else {
        setShowLoading(false);
        setStartTime(null);
      }
    }
  }, [loading, startTime, minLoadingTime]);

  if (showLoading) {
    return (
      <EliteLoadingScreen
        loadingText={loadingText}
        message={message}
        showPreview={showPreview}
      />
    );
  }

  return <>{children}</>;
};

export default EliteLoadingWrapper;