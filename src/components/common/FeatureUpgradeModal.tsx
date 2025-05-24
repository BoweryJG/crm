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
import StarIcon from '@mui/icons-material/Star';
import { Link } from 'react-router-dom';
import { useAppMode } from '../../contexts/AppModeContext';

export const FeatureUpgradeModal: React.FC = () => {
  const { showFeatureUpgradeModal, closeFeatureUpgradeModal } = useAppMode();
  
  return (
    <Dialog 
      open={showFeatureUpgradeModal} 
      onClose={closeFeatureUpgradeModal}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <StarIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5">Upgrade to Premium Features</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body1" paragraph>
          Unlock advanced linguistics analysis and gain deeper insights from your sales calls with our premium features.
        </Typography>
        
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
          With premium features, you'll get:
        </Typography>
        
        <List dense>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText 
              primary="Advanced Linguistics Analysis" 
              secondary="Detailed breakdown of language patterns, sentiment progression, and speaking pace"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText 
              primary="Key Phrase Extraction" 
              secondary="Automatically identify important topics and phrases from your calls"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText 
              primary="Action Item Identification" 
              secondary="Never miss a follow-up task with automatic action item extraction"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText 
              primary="Competitive Intelligence" 
              secondary="Identify when competitors are mentioned and get talking points to counter objections"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText 
              primary="Opportunity Scoring" 
              secondary="Get AI-powered predictions on deal likelihood and velocity"
            />
          </ListItem>
        </List>
        
        <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
          Premium features are available for just $79/month or $790/year (save 17%)
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={closeFeatureUpgradeModal} color="inherit">
          Stay with Basic Features
        </Button>
        <Button 
          component={Link} 
          to="/subscribe" 
          variant="contained" 
          color="primary"
          onClick={closeFeatureUpgradeModal}
        >
          Upgrade to Premium
        </Button>
      </DialogActions>
    </Dialog>
  );
};
