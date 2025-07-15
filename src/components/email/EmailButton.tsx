import React, { useState } from 'react';
import { Button, IconButton, Tooltip } from '@mui/material';
import { Email as EmailIcon } from '@mui/icons-material';
import EmailComposer from './EmailComposer';
import { Contact } from '../../types/models';

interface EmailButtonProps {
  contact?: Contact;
  contacts?: Contact[];
  variant?: 'text' | 'outlined' | 'contained';
  size?: 'small' | 'medium' | 'large';
  iconOnly?: boolean;
  prefilledSubject?: string;
  disabled?: boolean;
}

const EmailButton: React.FC<EmailButtonProps> = ({
  contact,
  contacts = [],
  variant = 'outlined',
  size = 'medium',
  iconOnly = false,
  prefilledSubject,
  disabled = false
}) => {
  const [composerOpen, setComposerOpen] = useState(false);

  const handleClick = () => {
    setComposerOpen(true);
  };

  const isDisabled = disabled || (contact && !contact.email);

  if (iconOnly) {
    return (
      <>
        <Tooltip title={isDisabled ? 'No email address' : 'Send email'}>
          <span>
            <IconButton
              onClick={handleClick}
              disabled={isDisabled}
              size={size}
              color="primary"
            >
              <EmailIcon />
            </IconButton>
          </span>
        </Tooltip>
        <EmailComposer
          open={composerOpen}
          onClose={() => setComposerOpen(false)}
          contact={contact}
          contacts={contacts}
          prefilledSubject={prefilledSubject}
        />
      </>
    );
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        startIcon={<EmailIcon />}
        onClick={handleClick}
        disabled={isDisabled}
      >
        Send Email
      </Button>
      <EmailComposer
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        contact={contact}
        contacts={contacts}
        prefilledSubject={prefilledSubject}
      />
    </>
  );
};

export default EmailButton;