import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import {
  Close as CloseIcon
} from '@mui/icons-material';
import { ContactForm } from './ContactForm';
import { Contact } from '../../types/models';

interface ContactFormModalProps {
  open: boolean;
  onClose: () => void;
  contact?: Contact | null;
  onSubmit: (contact: Partial<Contact>) => Promise<void>;
  mode: 'add' | 'edit';
}

export const ContactFormModal: React.FC<ContactFormModalProps> = ({
  open,
  onClose,
  contact,
  onSubmit,
  mode
}) => {
  const handleSubmit = async (contactData: Partial<Contact>) => {
    await onSubmit(contactData);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '60vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: 1,
        borderColor: 'divider',
        pb: 2
      }}>
        <Box>
          <Typography variant="h5" component="div">
            {mode === 'add' ? 'Add New Contact' : 'Edit Contact'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {mode === 'add' 
              ? 'Fill in the contact details below. Required fields are marked with *'
              : `Editing: ${contact?.first_name} ${contact?.last_name}`
            }
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <ContactForm
          contact={contact}
          onSubmit={handleSubmit}
          onCancel={onClose}
          mode={mode}
        />
      </DialogContent>
    </Dialog>
  );
};