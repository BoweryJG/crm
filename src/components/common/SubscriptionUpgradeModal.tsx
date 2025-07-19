import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import { Link } from 'react-router-dom';
import { useAppMode } from '../../contexts/AppModeContext';

export const SubscriptionUpgradeModal: React.FC = () => {
  const { showUpgradeModal, closeUpgradeModal } = useAppMode();
  
  return (
    <Dialog 
      open={showUpgradeModal} 
      onClose={closeUpgradeModal}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <LockIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5">Upgrade to Rep^x to Access Live Mode</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body1" paragraph>
          Live mode connects to your real data sources and enables all premium features of SphereOS CRM.
          Choose from Rep^x1 through Rep^x5 based on your needs.
        </Typography>
        
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
          With Rep^x, you'll get:
        </Typography>
        
        <List dense>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText 
              primary="Professional Business Line (All Rep^x tiers)" 
              secondary="Your eternal professional phone number with AI transcription"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText 
              primary="Market Intelligence (Rep^x2+)" 
              secondary="Email integration and Canvas practice scans"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText 
              primary="Territory Command (Rep^x3+)" 
              secondary="Advanced analytics and competitive intelligence"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText 
              primary="Elite Global Access (Rep^x5)" 
              secondary="Unlimited everything plus real-time AI coaching"
            />
          </ListItem>
        </List>
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={closeUpgradeModal} color="inherit">
          Stay in Demo Mode
        </Button>
        <Button 
          component={Link} 
          to="/subscribe" 
          variant="contained" 
          color="primary"
          onClick={closeUpgradeModal}
        >
          View Rep^x Plans
        </Button>
      </DialogActions>
    </Dialog>
  );
};
