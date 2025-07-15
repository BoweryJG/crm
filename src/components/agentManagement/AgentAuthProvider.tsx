import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { LockOutlined as LockIcon } from '@mui/icons-material';
import { agentApiService, AuthCredentials, AuthResponse } from '../../services/agentbackend/agentApiService';

interface AgentAuthContextType {
  isAuthenticated: boolean;
  user: AuthResponse['user'] | null;
  login: (credentials: AuthCredentials) => Promise<void>;
  logout: () => void;
  showLoginDialog: () => void;
}

const AgentAuthContext = createContext<AgentAuthContextType | undefined>(undefined);

interface AgentAuthProviderProps {
  children: ReactNode;
}

export const AgentAuthProvider: React.FC<AgentAuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [credentials, setCredentials] = useState<AuthCredentials>({ username: '', password: '' });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated on component mount
    const token = localStorage.getItem('agentbackend_token');
    if (token) {
      // Validate token by making a test request
      validateToken();
    }
  }, []);

  const validateToken = async () => {
    try {
      await agentApiService.getSystemHealth();
      setIsAuthenticated(true);
      // You might want to decode the JWT to get user info
      // For now, we'll set a default user
      setUser({
        id: 'admin',
        username: 'admin',
        role: 'administrator',
      });
    } catch (error) {
      // Token is invalid, clear it
      localStorage.removeItem('agentbackend_token');
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const login = async (loginCredentials: AuthCredentials) => {
    setLoginLoading(true);
    setLoginError(null);

    try {
      const authResponse = await agentApiService.login(loginCredentials);
      setIsAuthenticated(true);
      setUser(authResponse.user);
      setLoginDialogOpen(false);
      setCredentials({ username: '', password: '' });
    } catch (error: any) {
      setLoginError(error.response?.data?.message || 'Invalid credentials');
      throw error;
    } finally {
      setLoginLoading(false);
    }
  };

  const logout = () => {
    agentApiService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const showLoginDialog = () => {
    setLoginDialogOpen(true);
    setLoginError(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(credentials);
    } catch (error) {
      // Error is already handled in the login function
    }
  };

  const handleLoginDialogClose = () => {
    setLoginDialogOpen(false);
    setCredentials({ username: '', password: '' });
    setLoginError(null);
  };

  const contextValue: AgentAuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    showLoginDialog,
  };

  return (
    <AgentAuthContext.Provider value={contextValue}>
      {children}
      
      {/* Login Dialog */}
      <Dialog
        open={loginDialogOpen}
        onClose={handleLoginDialogClose}
        maxWidth="sm"
        fullWidth
        disableEscapeKeyDown
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LockIcon color="primary" />
            Agent Management Authentication
          </Box>
        </DialogTitle>
        
        <form onSubmit={handleLoginSubmit}>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Please authenticate to access the Agent Command Center
            </Typography>
            
            {loginError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {loginError}
              </Alert>
            )}
            
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              sx={{ mb: 2 }}
              disabled={loginLoading}
              placeholder="admin"
            />
            
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              disabled={loginLoading}
              placeholder="admin123"
            />
            
            <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
              <Typography variant="caption" color="info.dark">
                <strong>Default Credentials:</strong><br />
                Username: admin<br />
                Password: admin123
              </Typography>
            </Box>
          </DialogContent>
          
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={handleLoginDialogClose}
              disabled={loginLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loginLoading || !credentials.username || !credentials.password}
              startIcon={loginLoading ? <CircularProgress size={20} /> : undefined}
            >
              {loginLoading ? 'Authenticating...' : 'Login'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </AgentAuthContext.Provider>
  );
};

export const useAgentAuth = (): AgentAuthContextType => {
  const context = useContext(AgentAuthContext);
  if (context === undefined) {
    throw new Error('useAgentAuth must be used within an AgentAuthProvider');
  }
  return context;
};