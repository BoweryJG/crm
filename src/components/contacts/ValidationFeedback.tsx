import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Alert,
  AlertTitle
} from '@mui/material';
import {
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

interface ValidationError {
  field: string;
  message: string;
  severity?: 'error' | 'warning';
}

interface ValidationFeedbackProps {
  errors: ValidationError[];
  show: boolean;
  onClose?: () => void;
}

export const ValidationFeedback: React.FC<ValidationFeedbackProps> = ({
  errors,
  show,
  onClose
}) => {
  if (errors.length === 0) return null;

  const errorCount = errors.filter(e => e.severity !== 'warning').length;
  const warningCount = errors.filter(e => e.severity === 'warning').length;

  return (
    <Collapse in={show}>
      <Alert 
        severity={errorCount > 0 ? 'error' : 'warning'}
        onClose={onClose}
        sx={{ mb: 2 }}
      >
        <AlertTitle>
          {errorCount > 0 
            ? `Please fix ${errorCount} error${errorCount > 1 ? 's' : ''} before submitting`
            : `${warningCount} warning${warningCount > 1 ? 's' : ''} found`
          }
        </AlertTitle>
        <List dense sx={{ mt: 1 }}>
          {errors.map((error, index) => (
            <ListItem key={`${error.field}-${index}`} sx={{ py: 0 }}>
              <ListItemIcon sx={{ minWidth: 30 }}>
                {error.severity === 'warning' ? (
                  <WarningIcon color="warning" fontSize="small" />
                ) : (
                  <ErrorIcon color="error" fontSize="small" />
                )}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2">
                    <strong>{formatFieldName(error.field)}:</strong> {error.message}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Alert>
    </Collapse>
  );
};

// Helper function to format field names for display
function formatFieldName(fieldName: string): string {
  return fieldName
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

// Validation summary component
export const ValidationSummary: React.FC<{
  isValid: boolean;
  errorCount: number;
  warningCount?: number;
}> = ({ isValid, errorCount, warningCount = 0 }) => {
  if (isValid) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
        <CheckCircleIcon sx={{ mr: 1 }} fontSize="small" />
        <Typography variant="body2">All fields are valid</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {errorCount > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
          <ErrorIcon sx={{ mr: 0.5 }} fontSize="small" />
          <Typography variant="body2">
            {errorCount} error{errorCount > 1 ? 's' : ''}
          </Typography>
        </Box>
      )}
      {warningCount > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'warning.main' }}>
          <WarningIcon sx={{ mr: 0.5 }} fontSize="small" />
          <Typography variant="body2">
            {warningCount} warning{warningCount > 1 ? 's' : ''}
          </Typography>
        </Box>
      )}
    </Box>
  );
};