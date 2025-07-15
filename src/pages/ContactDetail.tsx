import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
  Chip,
  Avatar,
  Grid,
  Paper,
  IconButton,
  CircularProgress,
  useTheme,
  Tab,
  Tabs
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Event as EventIcon,
  Timeline as TimelineIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { fetchContactById } from '../services/supabase/supabaseService';
import { Contact } from '../types/models';
import CallButton from '../components/contacts/CallButton';
import CallHistory from '../components/contacts/CallHistory';
import { ContactFormModal } from '../components/contacts/ContactFormModal';
import { DeleteContactDialog } from '../components/contacts/DeleteContactDialog';
import { supabase } from '../services/supabase/supabase';
import { useAuth } from '../auth';
import { useAppMode } from '../contexts/AppModeContext';
import { useNotification } from '../contexts/NotificationContext';
import InteractionTimeline from '../components/contacts/InteractionTimeline';
import AtRiskAccountAlert from '../components/contacts/AtRiskAccountAlert';
import { PrivateDataService } from '../services/privateDataService';
import EmailButton from '../components/email/EmailButton';
import EmailHistory from '../components/email/EmailHistory';

const ContactDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState<boolean>(true);
  const [contact, setContact] = useState<Contact | null>(null);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [tabValue, setTabValue] = useState(0);
  const [interactions, setInteractions] = useState<any[]>([]);
  const [atRiskData, setAtRiskData] = useState<any | null>(null);
  const { user } = useAuth();
  const { isDemo } = useAppMode();
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    const loadContact = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const { data, error } = await fetchContactById(id);
        
        if (error) {
          console.error('Error fetching contact:', error);
        } else if (data) {
          // Use the data directly since it matches the Contact interface
          const mappedContact: Contact = data;
          setContact(mappedContact);
          
          // Check if this is a special contact with private data
          const contactName = `${data.first_name} ${data.last_name}`.toLowerCase();
          const isGregPedro = contactName.includes('greg pedro') || contactName.includes('cindi') || contactName.includes('cyndi');
          
          if (isGregPedro && user) {
            // Load private interaction data
            const privateInteractions = await PrivateDataService.loadContactInteractions(id, user.id);
            setInteractions(privateInteractions);
            
            // Load at-risk account data
            const riskAccounts = await PrivateDataService.loadAtRiskAccounts(user.id);
            const thisAccountRisk = riskAccounts.find(a => 
              a.accountName.toLowerCase().includes('pedro') || 
              a.accountId === id
            );
            setAtRiskData(thisAccountRisk);
          }
        }
      } catch (error) {
        console.error('Error in contact fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContact();
  }, [id, user]);

  const handleBack = () => {
    navigate('/contacts');
  };

  const handleEdit = () => {
    // Open edit modal instead of navigating
    setEditModalOpen(true);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!contact || !user || isDemo) return;
    
    try {
      setDeleteLoading(true);
      const tableName = 'contacts';
      
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', contact.id)
        .eq('user_id', user.id); // Ensure user can only delete their own contacts
      
      if (error) throw error;
      
      // Navigate back to contacts list after successful deletion
      showSuccess('Contact deleted successfully');
      navigate('/contacts');
    } catch (error: any) {
      console.error('Error deleting contact:', error);
      showError(error.message || 'Failed to delete contact. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const toggleStarred = async () => {
    if (!contact) return;
    
    // Toggle starred status
    setContact(prevContact => {
      if (!prevContact) return null;
      return {
        ...prevContact,
        status: prevContact.status === 'active' ? 'inactive' : 'active'
      };
    });
    
    // In a real app, this would update the database
    // await updateContact(contact.id, { status: contact.status === 'active' ? 'inactive' : 'active' });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getContactInitials = (first_name: string, last_name: string) => {
    return `${first_name.charAt(0)}${last_name.charAt(0)}`.toUpperCase();
  };

  const getAvatarColor = (id: string) => {
    // Generate a consistent color based on the contact's ID
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.error.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.success.main,
    ];
    
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!contact) {
    return (
      <Box sx={{ p: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Back to Contacts
        </Button>
        <Typography variant="h5" sx={{ mt: 2 }}>
          Contact not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Back to Contacts
        </Button>
        <Box>
          <IconButton onClick={toggleStarred} sx={{ mr: 1 }}>
            {contact.status === 'active' ? (
              <StarIcon sx={{ color: theme.palette.warning.main }} />
            ) : (
              <StarBorderIcon />
            )}
          </IconButton>
          <Button 
            variant="outlined" 
            startIcon={<EditIcon />} 
            onClick={handleEdit}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={<DeleteIcon />} 
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' }, gap: 3 }}>
        <Box>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Avatar 
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    mb: 2,
                    bgcolor: getAvatarColor(contact.id),
                    fontSize: '2rem'
                  }}
                >
                  {getContactInitials(contact.first_name, contact.last_name)}
                </Avatar>
                <Typography variant="h4">
                  {contact.first_name} {contact.last_name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {contact.title}
                </Typography>
                
                <Box sx={{ display: 'flex', mt: 2, gap: 1 }}>
                  <CallButton contact={contact} />
                  <EmailButton 
                    contact={contact}
                    variant="outlined"
                    size="medium"
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Contact Information
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {contact.phone}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {contact.email}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Practice Information
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <BusinessIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    Practice ID: {contact.practice_id}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                    Type:
                  </Typography>
                  <Chip 
                    label={contact.specialization ? 
                      contact.specialization.charAt(0).toUpperCase() + contact.specialization.slice(1) : 
                      (contact.type || 'Unknown')} 
                    size="small" 
                    color={contact.specialization === 'dental' ? 'primary' : 'secondary'}
                  />
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Additional Information
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <EventIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                    Last Contacted:
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(contact.last_contacted)}
                  </Typography>
                </Box>
                
                <Box sx={{ mt: 2 }}>
                  {contact.tags && contact.tags.map((tag) => (
                    <Chip 
                      key={tag} 
                      label={tag} 
                      size="small" 
                      sx={{ mr: 0.5, mb: 0.5 }} 
                    />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        
        <Box>
          {/* Show At-Risk Alert if applicable */}
          {atRiskData && (
            <Box sx={{ mb: 3 }}>
              <AtRiskAccountAlert 
                data={atRiskData}
                onContactClick={() => window.location.href = `tel:${contact.phone}`}
                onActionClick={(action) => {
                  showSuccess(`Action noted: ${action.action}`);
                }}
              />
            </Box>
          )}
          
          {/* Tabs for different sections */}
          <Paper variant="outlined">
            <Tabs 
              value={tabValue} 
              onChange={(e, newValue) => setTabValue(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Overview" icon={<BusinessIcon />} iconPosition="start" />
              <Tab label="Call History" icon={<PhoneIcon />} iconPosition="start" />
              <Tab label="Email History" icon={<EmailIcon />} iconPosition="start" />
              {interactions.length > 0 && (
                <Tab label="Interactions" icon={<TimelineIcon />} iconPosition="start" />
              )}
            </Tabs>
            
            <Box sx={{ p: 2 }}>
              {/* Overview Tab */}
              {tabValue === 0 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Notes
                  </Typography>
                  <Typography variant="body1">
                    {contact.notes || 'No notes available for this contact.'}
                  </Typography>
                </Box>
              )}
              
              {/* Call History Tab */}
              {tabValue === 1 && (
                <CallHistory contactId={contact.id} />
              )}
              
              {/* Email History Tab */}
              {tabValue === 2 && (
                <EmailHistory contactId={contact.id} />
              )}
              
              {/* Interactions Timeline Tab */}
              {tabValue === 3 && interactions.length > 0 && (
                <InteractionTimeline
                  contact={{
                    name: `${contact.first_name} ${contact.last_name}`,
                    role: contact.title,
                    company: contact.practice_name || 'Unknown Practice',
                    status: atRiskData ? 'at_risk' : 'active',
                    metrics: atRiskData ? {
                      'Monthly Value': `$${atRiskData.monthlyValue?.toLocaleString() || 0}`,
                      'Risk Score': `${atRiskData.riskScore}/100`
                    } : undefined
                  }}
                  interactions={interactions}
                  showFinancials={!!user && process.env.REACT_APP_ENABLE_PRIVATE_DATA === 'true'}
                />
              )}
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Contact Edit Modal */}
      <ContactFormModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        contact={contact}
        mode="edit"
        onSubmit={async (contactData) => {
          try {
            const tableName = (!user || isDemo) ? 'public_contacts' : 'contacts';
            const { error } = await supabase
              .from(tableName)
              .update(contactData)
              .eq('id', contact?.id);
            
            if (error) throw error;
            
            // Update local state
            setContact(prevContact => {
              if (!prevContact) return null;
              return { ...prevContact, ...contactData } as Contact;
            });
            
            setEditModalOpen(false);
            showSuccess('Contact updated successfully!');
          } catch (error: any) {
            console.error('Error updating contact:', error);
            showError(error.message || 'Failed to update contact');
            throw error;
          }
        }}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteContactDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        contact={contact}
        onConfirm={confirmDelete}
        loading={deleteLoading}
      />
    </Box>
  );
};

export default ContactDetail;
