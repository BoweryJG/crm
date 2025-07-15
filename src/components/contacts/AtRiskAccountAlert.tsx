import React from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Chip,
  Grid,
  Divider,
  LinearProgress,
  useTheme,
  alpha
} from '@mui/material';
import {
  Warning as WarningIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  Timer as TimerIcon,
  Assignment as TaskIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  PriorityHigh as PriorityIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';

export interface RiskFactor {
  type: 'financial' | 'relationship' | 'performance' | 'operational';
  severity: 'critical' | 'high' | 'medium';
  description: string;
  impact?: string;
}

export interface ActionItem {
  id: string;
  action: string;
  priority: 'immediate' | 'urgent' | 'normal';
  deadline?: string;
  completed?: boolean;
}

export interface AtRiskAccountData {
  accountName: string;
  accountId?: string;
  riskScore: number; // 0-100, higher is worse
  monthlyValue?: number;
  lastContact?: string;
  assignedTo?: string;
  riskFactors: RiskFactor[];
  actionItems: ActionItem[];
  notes?: string;
}

interface AtRiskAccountAlertProps {
  data: AtRiskAccountData;
  onActionClick?: (action: ActionItem) => void;
  onContactClick?: () => void;
  showFullDetails?: boolean;
  elevation?: number;
}

const AtRiskAccountAlert: React.FC<AtRiskAccountAlertProps> = ({
  data,
  onActionClick,
  onContactClick,
  showFullDetails = true,
  elevation = 3
}) => {
  const theme = useTheme();

  const getRiskSeverityColor = (score: number) => {
    if (score >= 80) return theme.palette.error.main;
    if (score >= 60) return theme.palette.warning.main;
    return theme.palette.info.main;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'immediate': return 'error';
      case 'urgent': return 'warning';
      default: return 'info';
    }
  };

  const getRiskTypeIcon = (type: string) => {
    switch (type) {
      case 'financial': return <MoneyIcon />;
      case 'relationship': return <WarningIcon />;
      case 'performance': return <TrendingDownIcon />;
      default: return <PriorityIcon />;
    }
  };

  const criticalFactors = data.riskFactors.filter(f => f.severity === 'critical');
  const immediateActions = data.actionItems.filter(a => a.priority === 'immediate' && !a.completed);

  return (
    <Card 
      elevation={elevation}
      sx={{ 
        borderLeft: `4px solid ${getRiskSeverityColor(data.riskScore)}`,
        backgroundColor: alpha(theme.palette.error.main, 0.02)
      }}
    >
      <CardContent>
        {/* Header Alert */}
        <Alert 
          severity="error" 
          icon={<WarningIcon />}
          sx={{ mb: 2 }}
        >
          <AlertTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                At-Risk Account: {data.accountName}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Chip 
                  label={`Risk Score: ${data.riskScore}/100`}
                  color="error"
                  size="small"
                />
                {data.monthlyValue && (
                  <Chip 
                    label={`$${data.monthlyValue.toLocaleString()}/mo`}
                    icon={<MoneyIcon />}
                    color="error"
                    variant="outlined"
                    size="small"
                  />
                )}
              </Box>
            </Box>
          </AlertTitle>
          
          {/* Risk Progress Bar */}
          <Box sx={{ mt: 1, mb: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={data.riskScore} 
              color="error"
              sx={{ height: 8, borderRadius: 1 }}
            />
          </Box>

          {/* Quick Stats */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="error">
                <strong>{criticalFactors.length}</strong> Critical Risk Factors
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="error">
                <strong>{immediateActions.length}</strong> Immediate Actions Required
              </Typography>
            </Grid>
            {data.lastContact && (
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Last Contact: <strong>{data.lastContact}</strong>
                </Typography>
              </Grid>
            )}
          </Grid>
        </Alert>

        {showFullDetails && (
          <>
            {/* Critical Risk Factors */}
            {criticalFactors.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Critical Risk Factors
                </Typography>
                <List dense>
                  {criticalFactors.map((factor, index) => (
                    <ListItem key={index} sx={{ pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {getRiskTypeIcon(factor.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={factor.description}
                        secondary={factor.impact}
                        primaryTypographyProps={{ 
                          color: 'error',
                          fontWeight: 'medium'
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Immediate Actions */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Immediate Actions Required
              </Typography>
              {immediateActions.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No immediate actions pending
                </Typography>
              ) : (
                <List dense>
                  {immediateActions.map((action) => (
                    <ListItem 
                      key={action.id}
                      sx={{ 
                        pl: 0,
                        cursor: onActionClick ? 'pointer' : 'default',
                        '&:hover': onActionClick ? { backgroundColor: alpha(theme.palette.action.hover, 0.04) } : {}
                      }}
                      onClick={() => onActionClick?.(action)}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {action.completed ? <CheckIcon color="success" /> : <TaskIcon color="error" />}
                      </ListItemIcon>
                      <ListItemText
                        primary={action.action}
                        secondary={action.deadline ? `Due: ${action.deadline}` : undefined}
                      />
                      <Chip
                        label={action.priority}
                        size="small"
                        color={getPriorityColor(action.priority)}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                variant="contained"
                color="error"
                startIcon={<PhoneIcon />}
                onClick={onContactClick}
                fullWidth
              >
                Contact Now
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<EmailIcon />}
                fullWidth
              >
                Send Email
              </Button>
            </Box>

            {/* Additional Notes */}
            {data.notes && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">{data.notes}</Typography>
              </Alert>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

// Compact version for dashboards
export const AtRiskAccountAlertCompact: React.FC<AtRiskAccountAlertProps> = (props) => {
  return <AtRiskAccountAlert {...props} showFullDetails={false} elevation={1} />;
};

export default AtRiskAccountAlert;