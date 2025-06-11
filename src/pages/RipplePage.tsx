// Ripple Page - Handles ripple URL routing
import React from 'react';
import { useParams } from 'react-router-dom';
import RippleViewer from '../components/ripple/RippleViewer';

const RipplePage: React.FC = () => {
  const { rippleToken } = useParams<{ rippleToken: string }>();

  if (!rippleToken) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Invalid ripple link
      </div>
    );
  }

  return <RippleViewer rippleToken={rippleToken} />;
};

export default RipplePage;