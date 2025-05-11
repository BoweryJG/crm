import React from 'react';
import { Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  redirectPath?: string;
  children?: React.ReactNode;
}

/**
 * A route wrapper that previously protected routes requiring authentication.
 * Now always allows access without authentication checks.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children
}) => {
  // Always render children or outlet without authentication check
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
