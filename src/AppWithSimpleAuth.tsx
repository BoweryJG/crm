import React from 'react';
import App from './App';
import SimpleAuthWrapper from './components/common/SimpleAuthWrapper';

/**
 * App with Simple Auth Wrapper
 * This wraps the main App component with authentication check
 */
function AppWithSimpleAuth() {
  return (
    <SimpleAuthWrapper requireAuth={true}>
      <App />
    </SimpleAuthWrapper>
  );
}

export default AppWithSimpleAuth;