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
          <Typography variant="h5">Upgrade to Access Live Mode</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body1" paragraph>
          Live mode connects to your real data sources and enables all premium features of SphereOS CRM.
        </Typography>
        
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
          With a subscription, you'll get:
        </Typography>
        
        <List dense>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText 
              primary="Real-time data synchronization" 
              secondary="Connect to your actual contacts, practices, and call data"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText 
              primary="Advanced linguistics analysis" 
              secondary="Get detailed insights from your actual sales calls"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText 
              primary="Customized dental/aesthetic sales intelligence" 
              secondary="Industry-specific insights tailored to your specialty"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText 
              primary="Unlimited call recordings and analysis" 
              secondary="No limits on the number of calls you can analyze"
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
          View Subscription Plans
        </Button>
      </DialogActions>
    </Dialog>
  );
};
