import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Card, 
  CardContent,
  Alert,
  Chip
} from '@mui/material';
import { Phone as PhoneIcon } from '@mui/icons-material';
import { FeatureGate, TierBadge, UpgradePrompt, RepXTier } from '@repspheres/unified-auth';
import { useUnifiedAuth } from '../../contexts/UnifiedAuthContext_20250730';

export const PhoneDialer_20250730: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showUpgrade, setShowUpgrade] = useState(false);
  const { tier, features, checkFeature } = useUnifiedAuth();
  
  const handleCall = () => {
    if (!checkFeature('phoneAccess')) {
      setShowUpgrade(true);
      return;
    }
    
    // Initiate phone call
    console.log('Calling:', phoneNumber);
    // Actual call implementation would go here
  };
  
  return (
    <>
      <FeatureGate 
        feature="phoneAccess"
        fallback={
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6">Phone Dialer</Typography>
                <TierBadge tier={tier} />
              </Box>
              
              <Alert severity="info">
                Phone calling requires RepX² Professional or higher.
                <Box mt={1}>
                  <Button 
                    variant="contained" 
                    size="small"
                    onClick={() => setShowUpgrade(true)}
                  >
                    Upgrade Now
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
              <Typography variant="h6">Phone Dialer</Typography>
              <Box display="flex" gap={1} alignItems="center">
                <TierBadge tier={tier} />
                {features.phoneNumberLimit > 0 && (
                  <Chip 
                    label={`${features.phoneNumberLimit} ${features.phoneNumberLimit === 1 ? 'number' : 'numbers'} available`}
                    size="small"
                    color="primary"
                  />
                )}
              </Box>
            </Box>
            
            <Box display="flex" gap={2} alignItems="center">
              <TextField
                fullWidth
                label="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
              <Button
                variant="contained"
                startIcon={<PhoneIcon />}
                onClick={handleCall}
                disabled={!phoneNumber}
              >
                Call
              </Button>
            </Box>
            
            {features.twilioProvisioning && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Auto-provisioned Twilio number active
              </Alert>
            )}
          </CardContent>
        </Card>
      </FeatureGate>
      
      {showUpgrade && (
        <UpgradePrompt
          currentTier={tier}
          requiredTier={RepXTier.Rep2}
          feature="Phone Calling"
          onUpgrade={() => {
            window.location.href = 'https://osbackend-zl1h.onrender.com/upgrade?feature=phone&from=' + tier;
          }}
          onCancel={() => setShowUpgrade(false)}
        />
      )}
    </>
  );
};