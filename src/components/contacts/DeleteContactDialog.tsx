import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Box
} from '@mui/material';
import {
  Warning as WarningIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { Contact } from '../../types/models';

interface DeleteContactDialogProps {
  open: boolean;
  onClose: () => void;
  contact: Contact | null;
  onConfirm: () => Promise<void>;
  loading?: boolean;
}

export const DeleteContactDialog: React.FC<DeleteContactDialogProps> = ({
  open,
  onClose,
  contact,
  onConfirm,
  loading = false
}) => {
  if (!contact) return null;

  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <WarningIcon color="warning" />
        Confirm Delete
      </DialogTitle>
      
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          This action cannot be undone. All data associated with this contact will be permanently deleted.
        </Alert>
        
        <Typography variant="body1" sx={{ mb: 2 }}>
          Are you sure you want to delete the following contact?
        </Typography>
        
        <Box sx={{ 
          p: 2, 
          bgcolor: 'background.paper', 
          border: 1, 
          borderColor: 'divider', 
          borderRadius: 1 
        }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {contact.first_name} {contact.last_name}
          </Typography>
          {contact.email && (
            <Typography variant="body2" color="text.secondary">
              {contact.email}
            </Typography>
          )}
          {contact.practice_name && (
            <Typography variant="body2" color="text.secondary">
              {contact.practice_name}
            </Typography>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          disabled={loading}
        >
          {loading ? 'Deleting...' : 'Delete Contact'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};