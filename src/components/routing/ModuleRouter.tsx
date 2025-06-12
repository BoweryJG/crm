import React from 'react';
import { Navigate } from 'react-router-dom';

interface ModuleRouterProps {
  module: 'crm' | 'canvas' | 'market-data';
  children: React.ReactNode;
}

// This component can be used to wrap module-specific routes
export const ModuleRouter: React.FC<ModuleRouterProps> = ({ module, children }) => {
  // Store the current module in localStorage for auth returns
  React.useEffect(() => {
    localStorage.setItem('currentModule', module);
    console.log('ModuleRouter - Current module:', module);
  }, [module]);

  return <>{children}</>;
};

// Helper to get the default route for each module
export const getModuleDefaultRoute = (module: string): string => {
  switch (module) {
    case 'canvas':
      return '/canvas';
    case 'market-data':
      return '/market';
    case 'crm':
    default:
      return '/';
  }
};