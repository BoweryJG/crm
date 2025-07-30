import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Card, 
  CardContent,
  Alert,
  LinearProgress,
  Chip
} from '@mui/material';
import { Email as EmailIcon, Send as SendIcon } from '@mui/icons-material';
import { FeatureGate, TierBadge, UpgradePrompt, RepXTier } from '@repspheres/unified-auth';
import { useUnifiedAuth } from '../../contexts/UnifiedAuthContext_20250730';

export const EmailComposer_20250730: React.FC = () => {
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    body: ''
  });
  const [emailsSent, setEmailsSent] = useState(0); // This would come from backend
  const [showUpgrade, setShowUpgrade] = useState(false);
  const { tier, features, checkFeature } = useUnifiedAuth();
  
  const emailLimit = features.emailSendLimit;
  const hasLimit = emailLimit !== null && emailLimit > 0;
  const percentUsed = hasLimit ? (emailsSent / emailLimit) * 100 : 0;
  
  const handleSend = () => {
    if (!checkFeature('emailAccess')) {
      setShowUpgrade(true);
      return;
    }
    
    if (hasLimit && emailsSent >= emailLimit) {
      alert('Monthly email limit reached. Please upgrade for more emails.');
      setShowUpgrade(true);
      return;
    }
    
    // Send email
    console.log('Sending email:', emailData);
    setEmailsSent(prev => prev + 1);
  };
  
  return (
    <>
      <FeatureGate 
        feature="emailAccess"
        fallback={
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6">Email Composer</Typography>
                <TierBadge tier={tier} />
              </Box>
              
              <Alert severity="info">
                Email access requires RepX¹ Explorer or higher.
                <Box mt={1}>
                  <Button 
                    variant="contained" 
                    size="small"
                    onClick={() => setShowUpgrade(true)}
                  >
                    Upgrade to Send Emails
                  </Button>
                </Box>
              </Alert>
            </CardContent>
          </Card>
        }
      >
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6">Email Composer</Typography>
              <Box display="flex" gap={1} alignItems="center">
                <TierBadge tier={tier} />
                {features.gmailIntegration && (
                  <Chip 
                    label="Gmail Connected" 
                    size="small" 
                    color="success"
                    icon={<EmailIcon />}
                  />
                )}
              </Box>
            </Box>
            
            {hasLimit && (
              <Box mb={3}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Monthly Email Usage
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {emailsSent} / {emailLimit} emails
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={percentUsed} 
                  color={percentUsed > 80 ? "warning" : "primary"}
                />
              </Box>
            )}
            
            {!hasLimit && emailLimit === null && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Unlimited emails available with your {tier} plan!
              </Alert>
            )}
            
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                fullWidth
                label="To"
                value={emailData.to}
                onChange={(e) => setEmailData({...emailData, to: e.target.value})}
                placeholder="recipient@example.com"
              />
              
              <TextField
                fullWidth
                label="Subject"
                value={emailData.subject}
                onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
              />
              
              <TextField
                fullWidth
                multiline
                rows={6}
                label="Message"
                value={emailData.body}
                onChange={(e) => setEmailData({...emailData, body: e.target.value})}
              />
              
              <Button
                variant="contained"
                startIcon={<SendIcon />}
                onClick={handleSend}
                disabled={!emailData.to || !emailData.subject || !emailData.body}
              >
                Send Email
              </Button>
            </Box>
          </CardContent>
        </Card>
      </FeatureGate>
      
      {showUpgrade && (
        <UpgradePrompt
          currentTier={tier}
          requiredTier={emailLimit === null ? tier : RepXTier.Rep1}
          feature="Email Access"
          onUpgrade={() => {
            window.location.href = 'https://osbackend-zl1h.onrender.com/upgrade?feature=email&from=' + tier;
          }}
          onCancel={() => setShowUpgrade(false)}
        />
      )}
    </>
  );
};