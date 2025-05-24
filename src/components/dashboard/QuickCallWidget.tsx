import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  IconButton,
  Divider,
  Typography,
  Skeleton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  useTheme
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { supabase } from '../../services/supabase/supabase';
import { callContact, initiateCall } from '../../services/twilio/twilioService';
import { useAuth } from '../../hooks/useAuth';
import { Contact } from '../../types/models';
import mockDataService from '../../services/mockData/mockDataService';

const QuickCallWidget: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [recentContacts, setRecentContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [calling, setCalling] = useState<string | null>(null);
  const [personalNumberDialogOpen, setPersonalNumberDialogOpen] = useState(false);
  const [personalNumber, setPersonalNumber] = useState<string>('');
  const currentContactRef = useRef<Contact | null>(null);

  useEffect(() => {
    const fetchRecentContacts = async () => {
      try {
        setLoading(true);
        
        // STEP 1: First, get recent call activities
        const { data: activityData, error: activityError } = await supabase
          .from('sales_activities')
          .select('contact_id')
          .eq('type', 'call')
          .order('date', { ascending: false })
          .limit(5);
        
        // Log the raw response for sales_activities
        console.log('QuickCallWidget: sales_activities query result:', { activityData, activityError });

        if (activityError) {
          console.error('Error fetching sales activities:', activityError.message, activityError);
          console.log('Falling back to mock contacts data for QuickCallWidget due to activityError.');
          const mockContacts = mockDataService.generateMockContacts(5);
          setRecentContacts(mockContacts);
          return;
        }
        
        if (!activityData || activityData.length === 0) {
          console.log('No call activities found (activityData is null or empty), using mock data. ActivityData:', activityData);
          const mockContacts = mockDataService.generateMockContacts(5);
          setRecentContacts(mockContacts);
          return;
        }
        
        // Extract unique contact IDs
        const uniqueContactIds = Array.from(new Set(
          activityData
            .filter(activity => activity.contact_id) // Filter out null/undefined
            .map(activity => activity.contact_id)
        ));
        
        if (uniqueContactIds.length === 0) {
          console.log('No valid contact IDs found, using mock data');
          const mockContacts = mockDataService.generateMockContacts(5);
          setRecentContacts(mockContacts);
          return;
        }
        
        // STEP 2: Now fetch the actual contacts using the IDs
        const { data: contactsData, error: contactsError } = await supabase
          .from('public_contacts')  // Use the correct table name
          .select('*')
          .in('id', uniqueContactIds);
        
        if (contactsError) {
          console.error('Error fetching contacts:', contactsError);
          console.log('Falling back to mock contacts data for QuickCallWidget');
          const mockContacts = mockDataService.generateMockContacts(5);
          setRecentContacts(mockContacts);
          return;
        }
        
        if (contactsData && contactsData.length > 0) {
          setRecentContacts(contactsData as Contact[]);
        } else {
          console.log('No contacts found for the given IDs, using mock data');
          const mockContacts = mockDataService.generateMockContacts(5);
          setRecentContacts(mockContacts);
        }
      } catch (error) {
        console.error('Error fetching recent contacts:', error);
        console.log('Falling back to mock contacts data for QuickCallWidget');
        // Use mock data if there's an exception
        const mockContacts = mockDataService.generateMockContacts(5);
        setRecentContacts(mockContacts);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchRecentContacts();
    }
  }, [user]);

  // Try to get personal phone from localStorage
  useEffect(() => {
    const savedPersonalNumber = localStorage.getItem('personalPhoneNumber');
    if (savedPersonalNumber) {
      setPersonalNumber(savedPersonalNumber);
    }
  }, []);

  const handleCall = async (contact: Contact) => {
    if (!user) return;
    
    // Store the contact we want to call
    currentContactRef.current = contact;

    // If we don't have a personal number saved yet, ask for it
    if (!personalNumber) {
      setPersonalNumberDialogOpen(true);
      return;
    }
    
    // Otherwise proceed with the call
    executeCall(contact, personalNumber);
  };

  const executeCall = async (contact: Contact, phoneNumber: string) => {
    if (!user) return;
    
    setCalling(contact.id);
    try {
      // Pass the personal number to connect the call to
      const result = await initiateCall({
        to: contact.phone,
        from: process.env.REACT_APP_TWILIO_PHONE_NUMBER || '',
        contactId: contact.id,
        practiceId: contact.practice_id || 'unknown',
        userId: user.id,
        personalNumber: phoneNumber
      });
      
      if (!result.success) {
        alert(`Call failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Error making call:', error);
    } finally {
      setCalling(null);
    }
  };

  const handlePersonalNumberSubmit = () => {
    setPersonalNumberDialogOpen(false);
    
    // Save to localStorage for future use
    localStorage.setItem('personalPhoneNumber', personalNumber);
    
    // Execute the call with the personal number
    if (currentContactRef.current) {
      executeCall(currentContactRef.current, personalNumber);
    }
  };

  return (
    <>
      <Dialog open={personalNumberDialogOpen} onClose={() => setPersonalNumberDialogOpen(false)}>
        <DialogTitle>Connect Call to Your Phone</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter your personal phone number. This is where the call will be connected once the recipient answers.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Your Phone Number"
            type="tel"
            fullWidth
            value={personalNumber}
            onChange={(e) => setPersonalNumber(e.target.value)}
            placeholder="e.g. +1 415 555 1234"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPersonalNumberDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handlePersonalNumberSubmit} color="primary" variant="contained">
            Call Now
          </Button>
        </DialogActions>
      </Dialog>

      <Card variant="outlined">
        <CardHeader 
          title="Quick Call" 
          titleTypographyProps={{ variant: 'h6' }}
        />
        <Divider />
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            // Loading skeleton
            <List>
              {[...Array(5)].map((_, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Skeleton variant="circular" width={40} height={40} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Skeleton width="60%" />}
                    secondary={<Skeleton width="40%" />}
                  />
                  <ListItemSecondaryAction>
                    <Skeleton variant="circular" width={30} height={30} />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          ) : recentContacts.length > 0 ? (
            <List>
              {recentContacts.map((contact) => (
                <ListItem key={contact.id} divider>
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${contact.first_name} ${contact.last_name}`}
                    secondary={contact.phone || 'No phone number'}
                  />
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      color="primary"
                      disabled={!contact.phone || calling === contact.id}
                      onClick={() => handleCall(contact)}
                    >
                      {calling === contact.id ? (
                        <Skeleton variant="circular" width={24} height={24} />
                      ) : (
                        <PhoneIcon />
                      )}
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No recent contacts found.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default QuickCallWidget;
