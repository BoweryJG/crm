// SUIS React Hook for unified intelligence integration
import { useContext } from 'react';
import { SUISContext } from '../suis/components/SUISProvider';

export const useSUIS = () => {
  const context = useContext(SUISContext);
  
  if (!context) {
    throw new Error('useSUIS must be used within a SUISProvider');
  }
  
  return context;
};

// Optional SUIS hook that returns null if not in provider
export const useSUISOptional = () => {
  const context = useContext(SUISContext);
  return context;
};

export default useSUIS;