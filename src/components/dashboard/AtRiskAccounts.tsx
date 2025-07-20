import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Chip,
  Button,
  Skeleton,
  Alert,
  useTheme,
  alpha
} from '@mui/material';
import {
  Warning as WarningIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  ChevronRight as ChevronRightIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { PrivateDataService } from '../../services/privateDataService';
import { AtRiskAccountData } from '../contacts/AtRiskAccountAlert';

interface AtRiskAccountsProps {
  maxItems?: number;
  showActions?: boolean;
  onRefresh?: () => void;
}

const AtRiskAccounts: React.FC<AtRiskAccountsProps> = ({
  maxItems = 5,
  showActions = true,
  onRefresh
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<AtRiskAccountData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadAtRiskAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await PrivateDataService.loadAtRiskAccounts(user?.id);
      setAccounts(data.slice(0, maxItems));
    } catch (err) {
      console.error('Error loading at-risk accounts:', err);
      setError('Failed to load at-risk accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAtRiskAccounts();
  }, [user, maxItems]);

  const handleRefresh = () => {
    loadAtRiskAccounts();
    onRefresh?.();
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return theme.palette.error.main;
    if (score >= 60) return theme.palette.warning.main;
    return theme.palette.info.main;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader
          title="At-Risk Accounts"
          avatar={<WarningIcon color="error" />}
        />
        <CardContent>
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={60} sx={{ mb: 1 }} />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader
          title="At-Risk Accounts"
          avatar={<WarningIcon color="error" />}
          action={
            <IconButton onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          }
        />
        <CardContent>
          <Alert severity="error">{error}</Alert>
        </CardContent>
      </Card>
    );
  }

  if (accounts.length === 0) {
    return (
      <Card>
        <CardHeader
          title="At-Risk Accounts"
          avatar={<WarningIcon color="action" />}
          action={
            <IconButton onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          }
        />
        <CardContent>
          <Alert severity="info">
            No at-risk accounts found. Great job maintaining healthy relationships!
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6">At-Risk Accounts</Typography>
            <Chip 
              label={accounts.length} 
              size="small" 
              color="error"
              sx={{ minWidth: 24 }}
            />
          </Box>
        }
        avatar={<WarningIcon color="error" />}
        action={
          <IconButton onClick={handleRefresh} size="small">
            <RefreshIcon />
          </IconButton>
        }
      />
      <CardContent sx={{ pt: 0 }}>
        <List sx={{ pt: 0 }}>
          {accounts.map((account, index) => (
            <ListItem
              key={account.accountId || index}
              sx={{
                borderRadius: 1,
                mb: 1,
                backgroundColor: alpha(theme.palette.error.main, 0.04),
                border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.error.main, 0.08),
                  cursor: 'pointer'
                }
              }}
              onClick={() => navigate(`/contacts/${account.accountId}`)}
              secondaryAction={
                showActions && (
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton 
                      edge="end" 
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `tel:${account.assignedTo}`;
                      }}
                    >
                      <PhoneIcon />
                    </IconButton>
                    <IconButton 
                      edge="end" 
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `mailto:${account.assignedTo}`;
                      }}
                    >
                      <EmailIcon />
                    </IconButton>
                    <IconButton edge="end" size="small">
                      <ChevronRightIcon />
                    </IconButton>
                  </Box>
                )
              }
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: getRiskColor(account.riskScore),
                    width: 48,
                    height: 48
                  }}
                >
                  {getInitials(account.accountName)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {account.accountName}
                    </Typography>
                    <Chip
                      label={`Risk: ${account.riskScore}%`}
                      size="small"
                      color="error"
                      variant="outlined"
                    />
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {account.riskFactors[0]?.description || 'Multiple risk factors identified'}
                    </Typography>
                    {account.monthlyValue && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                        <MoneyIcon sx={{ fontSize: 16, color: 'error.main' }} />
                        <Typography variant="caption" color="error">
                          ${account.monthlyValue.toLocaleString()}/month at risk
                        </Typography>
                      </Box>
                    )}
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>

        {accounts.length >= maxItems && (
          <Button
            fullWidth
            variant="outlined"
            color="error"
            onClick={() => navigate('/contacts?filter=at_risk')}
            sx={{ mt: 2 }}
          >
            View All At-Risk Accounts
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default AtRiskAccounts;