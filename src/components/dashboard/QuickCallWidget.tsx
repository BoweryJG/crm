import React, { useState, useEffect } from 'react';
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
  useTheme
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { supabase } from '../../services/supabase/supabase';
import { callContact } from '../../services/twilio/twilioService';
import { useAuth } from '../../hooks/useAuth';
import { Contact } from '../../types/models';
import mockDataService from '../../services/mockData/mockDataService';

const QuickCallWidget: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [recentContacts, setRecentContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [calling, setCalling] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentContacts = async () => {
      try {
        setLoading(true);
        
        // Fetch recent contacts from Supabase
        // This query gets contacts who were recently called or interacted with
        const { data, error } = await supabase
          .from('sales_activities')
          .select('contact_id, contacts(*)')
          .eq('type', 'call')
          .order('date', { ascending: false })
          .limit(5);
          
        // Define the type for the activity data
        interface ActivityWithContact {
          contact_id: string;
          contacts: Contact;
        }
        
        if (error) {
          console.error('Error fetching recent contacts from sales_activities:', error);
          console.log('Falling back to mock contacts data for QuickCallWidget');
          // Use mock data if the table doesn't exist (404) or there's another error
          const mockContacts = mockDataService.generateMockContacts(5);
          setRecentContacts(mockContacts);
          return;
        }
        
        if (data && data.length > 0) {
          // Extract unique contacts
          const uniqueContacts: Contact[] = [];
          const contactIds = new Set();
          
          // Type check and process each activity
          data.forEach((activity: any) => {
            // Make sure contacts is an object with an id property
            if (activity.contacts && 
                typeof activity.contacts === 'object' && 
                !Array.isArray(activity.contacts) && 
                'id' in activity.contacts) {
              
              const contact = activity.contacts as Contact;
              if (!contactIds.has(contact.id)) {
                contactIds.add(contact.id);
                uniqueContacts.push(contact);
              }
            }
          });
          
          if (uniqueContacts.length > 0) {
            setRecentContacts(uniqueContacts);
          } else {
            // No valid contacts found in the data, use mock data
            console.log('No valid contacts found in sales_activities, using mock data');
            const mockContacts = mockDataService.generateMockContacts(5);
            setRecentContacts(mockContacts);
          }
        } else {
          // No data returned, use mock data
          console.log('No data returned from sales_activities, using mock data');
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

  const handleCall = async (contact: Contact) => {
    if (!user) return;
    
    setCalling(contact.id);
    try {
      const result = await callContact(contact, user.id);
      
      if (!result.success) {
        alert(`Call failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Error making call:', error);
    } finally {
      setCalling(null);
    }
  };

  return (
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
  );
};

export default QuickCallWidget;
