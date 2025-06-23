// CallVault - Dual Mode Conference Phone System
// Live mode: Real Twilio integration
// Demo mode: Realistic dental/aesthetic sales conversations

import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth';
import { useAppMode } from '../contexts/AppModeContext';
import LiveCallVault from './LiveCallVault';
import DemoCallVault from './DemoCallVault';
import '../styles/callVault.css';

// Main CallVault Component with Mode Detection
const CallVault: React.FC = () => {
  const { user } = useAuth();
  const { isDemo } = useAppMode();
  const [hasTwilioConfig, setHasTwilioConfig] = useState(false);

  // Check if Twilio is properly configured
  useEffect(() => {
    const checkTwilioConfig = () => {
      const hasConfig = Boolean(
        process.env.REACT_APP_TWILIO_ACCOUNT_SID &&
        process.env.REACT_APP_TWILIO_AUTH_TOKEN &&
        process.env.REACT_APP_TWILIO_PHONE_NUMBER
      );
      setHasTwilioConfig(hasConfig);
    };
    checkTwilioConfig();
  }, []);

  // Determine which mode to use
  const useDemo = !user || isDemo || !hasTwilioConfig;

  // Add Orbitron font for LCD display
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return useDemo ? <DemoCallVault /> : <LiveCallVault />;
};

export default CallVault;