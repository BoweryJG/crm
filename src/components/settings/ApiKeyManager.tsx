// API Key Management Component
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  TextField,
  Alert,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  ContentCopy as CopyIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Key as KeyIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { apiKeyService, ApiKey } from '../../services/apiKeyService';
import { format } from 'date-fns';

const ApiKeyManager: React.FC = () => {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyType, setNewKeyType] = useState<'sphere1a' | 'openrouter' | 'custom'>('sphere1a');
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    try {
      setLoading(true);
      const userKeys = await apiKeyService.getUserApiKeys();
      setKeys(userKeys);
    } catch (err) {
      setError('Failed to load API keys');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      setError('Please enter a key name');
      return;
    }

    try {
      const newKey = await apiKeyService.generateApiKey(newKeyName, newKeyType);
      setCreatedKey(newKey.api_key);
      await loadApiKeys();
    } catch (err) {
      setError('Failed to create API key');
      console.error(err);
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    if (!window.confirm('Are you sure you want to revoke this API key?')) {
      return;
    }

    try {
      await apiKeyService.revokeApiKey(keyId);
      await loadApiKeys();
    } catch (err) {
      setError('Failed to revoke API key');
      console.error(err);
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const copyToClipboard = async (text: string, keyId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(keyId);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 20) return key;
    return `${key.substring(0, 10)}...${key.substring(key.length - 10)}`;
  };

  const getKeyTypeColor = (type: string) => {
    switch (type) {
      case 'sphere1a':
        return 'primary';
      case 'openrouter':
        return 'secondary';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <CardHeader
        title="API Keys"
        subheader="Manage your API keys for SUIS integrations"
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowCreateDialog(true)}
          >
            Create API Key
          </Button>
        }
      />
      <CardContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {keys.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <KeyIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              No API keys found. Create your first key to get started.
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>API Key</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Last Used</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {keys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {key.keyName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={key.keyType}
                        size="small"
                        color={getKeyTypeColor(key.keyType)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
                        >
                          {visibleKeys.has(key.id) ? key.apiKey : maskApiKey(key.apiKey)}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => toggleKeyVisibility(key.id)}
                        >
                          {visibleKeys.has(key.id) ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => copyToClipboard(key.apiKey, key.id)}
                        >
                          {copiedKey === key.id ? <CheckIcon color="success" /> : <CopyIcon />}
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={key.isActive ? 'Active' : 'Revoked'}
                        size="small"
                        color={key.isActive ? 'success' : 'error'}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {format(new Date(key.createdAt), 'MMM d, yyyy')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {key.lastUsedAt
                          ? format(new Date(key.lastUsedAt), 'MMM d, yyyy')
                          : 'Never'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Revoke key">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteKey(key.id)}
                          disabled={!key.isActive}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Create Key Dialog */}
        <Dialog
          open={showCreateDialog}
          onClose={() => {
            setShowCreateDialog(false);
            setCreatedKey(null);
            setNewKeyName('');
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Create New API Key</DialogTitle>
          <DialogContent>
            {createdKey ? (
              <Box>
                <Alert severity="success" sx={{ mb: 2 }}>
                  API key created successfully! Make sure to copy it now - you won't be able to see it again.
                </Alert>
                <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1, mb: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}
                  >
                    {createdKey}
                  </Typography>
                </Box>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<CopyIcon />}
                  onClick={() => copyToClipboard(createdKey, 'new')}
                >
                  Copy to Clipboard
                </Button>
              </Box>
            ) : (
              <Box>
                <TextField
                  fullWidth
                  label="Key Name"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g., Production API Key"
                  sx={{ mb: 2 }}
                />
                <Typography variant="body2" color="text.secondary">
                  This key will automatically be used for SUIS operations.
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            {createdKey ? (
              <Button
                onClick={() => {
                  setShowCreateDialog(false);
                  setCreatedKey(null);
                  setNewKeyName('');
                }}
              >
                Done
              </Button>
            ) : (
              <>
                <Button onClick={() => setShowCreateDialog(false)}>Cancel</Button>
                <Button variant="contained" onClick={handleCreateKey}>
                  Create Key
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ApiKeyManager;