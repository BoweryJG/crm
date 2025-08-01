import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Stack,
  Alert,
  TextField,
  Divider,
  IconButton,
  Collapse,
  Grid
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  ContentCopy,
  CheckCircle,
  Error,
  Warning,
  Refresh
} from '@mui/icons-material';
import { supabase } from '../../auth/supabase';
import { useAuth } from '../../auth/AuthContext';

export const AuthDebugPanel: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [envStatus, setEnvStatus] = useState<any>({});
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testPassword, setTestPassword] = useState('testpassword123');
  const [testResult, setTestResult] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const { user, loading, error } = useAuth();

  useEffect(() => {
    checkEnvironment();
    checkSession();
  }, []);

  const checkEnvironment = () => {
    const env = {
      supabaseUrl: process.env.REACT_APP_SUPABASE_URL || 'NOT SET',
      supabaseAnonKey: process.env.REACT_APP_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
      backendUrl: process.env.REACT_APP_BACKEND_URL || 'NOT SET',
      nodeEnv: process.env.NODE_ENV,
      publicUrl: process.env.PUBLIC_URL || '/',
    };
    setEnvStatus(env);
  };

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        setSessionInfo({ error: error.message });
      } else {
        setSessionInfo({
          exists: !!session,
          user: session?.user?.email,
          expires: session?.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : null,
          provider: session?.user?.app_metadata?.provider,
        });
      }
    } catch (err: any) {
      setSessionInfo({ error: err.message });
    }
  };

  const testSignIn = async () => {
    setTestResult({ loading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });
      
      if (error) {
        setTestResult({ error: error.message, success: false });
      } else {
        setTestResult({ 
          success: true, 
          user: data.user?.email,
          session: !!data.session 
        });
        checkSession();
      }
    } catch (err: any) {
      setTestResult({ error: err.message, success: false });
    }
  };

  const testGoogleOAuth = async () => {
    setTestResult({ loading: true });
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        setTestResult({ error: error.message, success: false });
      } else {
        setTestResult({ 
          success: true, 
          message: 'Redirecting to Google...',
          url: data.url
        });
      }
    } catch (err: any) {
      setTestResult({ error: err.message, success: false });
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const clearSession = async () => {
    await supabase.auth.signOut();
    checkSession();
    window.location.reload();
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 9999,
        maxWidth: 400,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          backgroundColor: 'rgba(18, 18, 18, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 107, 107, 0.3)',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            p: 2,
            backgroundColor: 'rgba(255, 107, 107, 0.1)',
            borderBottom: '1px solid rgba(255, 107, 107, 0.2)',
            cursor: 'pointer',
          }}
          onClick={() => setExpanded(!expanded)}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1}>
              <Warning sx={{ color: '#ff6b6b', fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ color: '#ff6b6b', fontWeight: 600 }}>
                Auth Debug Panel
              </Typography>
            </Stack>
            <IconButton size="small">
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Stack>
        </Box>

        <Collapse in={expanded}>
          <Box sx={{ p: 2, maxHeight: 600, overflowY: 'auto' }}>
            {/* Current Auth State */}
            <Typography variant="caption" sx={{ color: '#888', fontWeight: 600 }}>
              CURRENT AUTH STATE
            </Typography>
            <Box sx={{ mt: 1, mb: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body2" sx={{ color: '#ccc' }}>Status:</Typography>
                <Chip
                  size="small"
                  icon={user ? <CheckCircle /> : <Error />}
                  label={user ? 'Authenticated' : 'Not Authenticated'}
                  color={user ? 'success' : 'error'}
                />
              </Stack>
              {user && (
                <Typography variant="body2" sx={{ color: '#ccc', mt: 1 }}>
                  User: {user.email}
                </Typography>
              )}
              {loading && (
                <Typography variant="body2" sx={{ color: '#ffa726', mt: 1 }}>
                  Loading auth state...
                </Typography>
              )}
              {error && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {error.message}
                </Alert>
              )}
            </Box>

            <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

            {/* Environment Status */}
            <Typography variant="caption" sx={{ color: '#888', fontWeight: 600 }}>
              ENVIRONMENT VARIABLES
            </Typography>
            <Box sx={{ mt: 1, mb: 2 }}>
              {Object.entries(envStatus).map(([key, value]) => (
                <Stack key={key} direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                  <Typography variant="caption" sx={{ color: '#999', minWidth: 120 }}>
                    {key}:
                  </Typography>
                  <Chip
                    size="small"
                    label={String(value)}
                    color={value === 'NOT SET' ? 'error' : 'default'}
                    sx={{ fontSize: '0.7rem' }}
                  />
                </Stack>
              ))}
            </Box>

            <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

            {/* Session Info */}
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="caption" sx={{ color: '#888', fontWeight: 600 }}>
                SESSION INFO
              </Typography>
              <IconButton size="small" onClick={checkSession}>
                <Refresh fontSize="small" />
              </IconButton>
            </Stack>
            <Box sx={{ mt: 1, mb: 2 }}>
              {sessionInfo?.error ? (
                <Alert severity="error">{sessionInfo.error}</Alert>
              ) : sessionInfo ? (
                <Stack spacing={0.5}>
                  <Typography variant="caption" sx={{ color: '#ccc' }}>
                    Session exists: {sessionInfo.exists ? 'Yes' : 'No'}
                  </Typography>
                  {sessionInfo.user && (
                    <Typography variant="caption" sx={{ color: '#ccc' }}>
                      User: {sessionInfo.user}
                    </Typography>
                  )}
                  {sessionInfo.provider && (
                    <Typography variant="caption" sx={{ color: '#ccc' }}>
                      Provider: {sessionInfo.provider}
                    </Typography>
                  )}
                  {sessionInfo.expires && (
                    <Typography variant="caption" sx={{ color: '#ccc' }}>
                      Expires: {sessionInfo.expires}
                    </Typography>
                  )}
                </Stack>
              ) : (
                <Typography variant="caption" sx={{ color: '#666' }}>
                  Loading session info...
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

            {/* Test Authentication */}
            <Typography variant="caption" sx={{ color: '#888', fontWeight: 600 }}>
              TEST AUTHENTICATION
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Test Email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    sx={{ mb: 1 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    type="password"
                    label="Test Password"
                    value={testPassword}
                    onChange={(e) => setTestPassword(e.target.value)}
                    sx={{ mb: 1 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    size="small"
                    variant="outlined"
                    onClick={testSignIn}
                    disabled={testResult?.loading}
                  >
                    Test Sign In
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    size="small"
                    variant="outlined"
                    onClick={testGoogleOAuth}
                    disabled={testResult?.loading}
                    sx={{ borderColor: '#4285f4', color: '#4285f4' }}
                  >
                    Test Google
                  </Button>
                </Grid>
              </Grid>

              {testResult && !testResult.loading && (
                <Alert 
                  severity={testResult.success ? 'success' : 'error'} 
                  sx={{ mt: 2 }}
                >
                  {testResult.error || testResult.message || 'Test completed'}
                  {testResult.user && <div>User: {testResult.user}</div>}
                  {testResult.url && (
                    <div>
                      OAuth URL: 
                      <IconButton
                        size="small"
                        onClick={() => copyToClipboard(testResult.url, 'url')}
                      >
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </div>
                  )}
                </Alert>
              )}
            </Box>

            <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

            {/* Actions */}
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={clearSession}
              >
                Clear Session
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
            </Stack>

            {/* Copy Status */}
            {copied && (
              <Typography variant="caption" sx={{ color: '#4caf50', display: 'block', mt: 1 }}>
                Copied {copied}!
              </Typography>
            )}
          </Box>
        </Collapse>
      </Paper>
    </Box>
  );
};