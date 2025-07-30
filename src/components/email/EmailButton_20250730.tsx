import React, { useState } from 'react';
import { Button, IconButton, Tooltip } from '@mui/material';
import { Email as EmailIcon } from '@mui/icons-material';
import EmailComposer from './EmailComposer';
import { Contact } from '../../types/models';
import { useUnifiedAuth } from '../../contexts/UnifiedAuthContext_20250730';
import { TierBadge, UpgradePrompt, RepXTier } from '@repspheres/unified-auth';

interface EmailButtonProps {
  contact?: Contact;
  contacts?: Contact[];
  variant?: 'text' | 'outlined' | 'contained';
  size?: 'small' | 'medium' | 'large';
  iconOnly?: boolean;
  prefilledSubject?: string;
  disabled?: boolean;
}

const EmailButton_20250730: React.FC<EmailButtonProps> = ({
  contact,
  contacts = [],
  variant = 'outlined',
  size = 'medium',
  iconOnly = false,
  prefilledSubject,
  disabled = false
}) => {
  const [composerOpen, setComposerOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { tier, canSendEmails } = useUnifiedAuth();

  const handleClick = () => {
    // Check if user has email access
    if (!canSendEmails()) {
      setShowUpgradeModal(true);
      return;
    }
    setComposerOpen(true);
  };

  const isDisabled = disabled || (contact && !contact.email);

  if (iconOnly) {
    return (
      <>
        <Tooltip title={
          !canSendEmails() ? 'Email requires Rep¹ Explorer or higher' :
          isDisabled ? 'No email address' : 'Send email'
        }>
          <span>
            <IconButton
              onClick={handleClick}
              disabled={isDisabled && canSendEmails()}
              size={size}
              color={canSendEmails() ? "primary" : "default"}
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
        {showUpgradeModal && (
          <UpgradePrompt
            currentTier={tier}
            requiredTier={RepXTier.Rep1}
            feature="Email Access"
            onUpgrade={() => {
              window.location.href = 'https://osbackend-zl1h.onrender.com/upgrade?feature=email&from=' + tier;
            }}
            onCancel={() => setShowUpgradeModal(false)}
          />
        )}
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
        disabled={isDisabled && canSendEmails()}
        color={canSendEmails() ? "primary" : "inherit"}
      >
        Send Email
        {!canSendEmails() && <TierBadge tier={tier} size="small" sx={{ ml: 1 }} />}
      </Button>
      <EmailComposer
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        contact={contact}
        contacts={contacts}
        prefilledSubject={prefilledSubject}
      />
      {showUpgradeModal && (
        <UpgradePrompt
          currentTier={tier}
          requiredTier={RepXTier.Rep1}
          feature="Email Access"
          onUpgrade={() => {
            window.location.href = 'https://osbackend-zl1h.onrender.com/upgrade?feature=email&from=' + tier;
          }}
          onCancel={() => setShowUpgradeModal(false)}
        />
      )}
    </>
  );
};

export default EmailButton_20250730;