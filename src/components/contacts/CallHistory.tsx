import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  Phone as PhoneIcon,
  PhoneMissed as PhoneMissedIcon,
  Info as InfoIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { fetchCallHistory } from '../../services/twilio/twilioService';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';

interface CallHistoryProps {
  contactId: string;
}

interface CallActivity {
  id: string;
  contact_id: string;
  practice_id: string;
  user_id: string;
  type: string;
  date: string;
  call_sid: string;
  call_status: string;
  call_duration?: number;
  notes?: string;
  details?: {
    phoneNumber?: string;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}

const CallHistory: React.FC<CallHistoryProps> = ({ contactId }) => {
  const theme = useTheme();
  const [callActivities, setCallActivities] = useState<CallActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCallHistory = async () => {
      try {
        setLoading(true);
        const { data, error } = await fetchCallHistory(contactId);
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setCallActivities(data);
        }
      } catch (err) {
        console.error('Error loading call history:', err);
        setError('Failed to load call history');
      } finally {
        setLoading(false);
      }
    };

    loadCallHistory();
  }, [contactId]);

  // Format duration from seconds to MM:SS
  const formatDuration = (seconds?: number): string => {
    if (!seconds) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get status color based on call status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return theme.palette.success.main;
      case 'failed':
      case 'busy':
      case 'no-answer':
        return theme.palette.error.main;
      case 'in-progress':
        return theme.palette.info.main;
      case 'initiated':
      case 'queued':
      case 'ringing':
        return theme.palette.warning.main;
      default:
        return theme.palette.grey[500];
    }
  };

  // Get status icon based on call status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <PhoneIcon fontSize="small" />;
      case 'failed':
      case 'busy':
      case 'no-answer':
        return <PhoneMissedIcon fontSize="small" />;
      case 'in-progress':
      case 'initiated':
      case 'queued':
      case 'ringing':
        return <AccessTimeIcon fontSize="small" />;
      default:
        return <InfoIcon fontSize="small" />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (callActivities.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body1" color="text.secondary">
          No call history available for this contact.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Call History
      </Typography>
      
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {callActivities.map((activity) => (
              <TableRow key={activity.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title={new Date(activity.date).toLocaleString()}>
                      <Typography variant="body2">
                        {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                      </Typography>
                    </Tooltip>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    icon={getStatusIcon(activity.call_status)}
                    label={activity.call_status}
                    size="small"
                    sx={{
                      backgroundColor: `${getStatusColor(activity.call_status)}20`,
                      color: getStatusColor(activity.call_status),
                      borderColor: getStatusColor(activity.call_status)
                    }}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  {formatDuration(activity.call_duration)}
                </TableCell>
                <TableCell>
                  <Tooltip title={activity.notes || ''}>
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: 200,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {activity.notes || 'No notes'}
                    </Typography>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CallHistory;
