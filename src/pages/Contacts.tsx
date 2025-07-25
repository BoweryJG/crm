import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Select,
  MenuItem,
  InputAdornment,
  FormControl,
  InputLabel,
  IconButton,
  Tabs,
  Tab,
  Avatar,
  Chip,
  CircularProgress,
  Divider,
  useTheme,
  SelectChangeEvent
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterListIcon,
  Business as BusinessIcon,
  ImportExport as ImportExportIcon,
  Email as EmailIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import CallButton from '../components/contacts/CallButton';
import ContactMetrics from '../components/contacts/ContactMetrics';
import ContactChatWidget from '../components/contacts/ContactChatWidget';
import { ContactImportModal } from '../components/contacts/ContactImportModal';
import { ContactFormModal } from '../components/contacts/ContactFormModal';
import { Contact } from '../types/models';
import { supabase } from '../services/supabase/supabase';
import { sanitize } from '../utils/validation';
import mockDataService from '../services/mockData/mockDataService';
import { useNotification } from '../contexts/NotificationContext';
import { useAppMode } from '../contexts/AppModeContext';
import { logger } from '../utils/logger';
import { useAuth } from '../auth';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`contacts-tabpanel-${index}`}
      aria-labelledby={`contacts-tab-${index}`}
      style={{ height: '100%', overflow: 'auto' }}
      {...other}
    >
      {value === index && <Box sx={{ py: 3, height: '100%' }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `contacts-tab-${index}`,
    'aria-controls': `contacts-tabpanel-${index}`,
  };
}

const Contacts: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDemo, mode } = useAppMode();
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [tabValue, setTabValue] = useState<number>(0);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSpecialty, setFilterSpecialty] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalContacts, setTotalContacts] = useState<number>(0);
  const [searchDebounce, setSearchDebounce] = useState<NodeJS.Timeout | null>(null);
  const [importModalOpen, setImportModalOpen] = useState<boolean>(false);
  const [formModalOpen, setFormModalOpen] = useState<boolean>(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const CONTACTS_PER_PAGE = 100;

  const fetchContactsPage = async (page: number, append: boolean = false, search: string = '') => {
    try {
      if (!append) setLoading(true);
      else setLoadingMore(true);
      
      // Determine which table to use based on mode and authentication
      let tableName = 'public_contacts'; // Default to public
      
      if (user && !isDemo) {
        // Check if this is your account for personal contacts
        if (user.email === 'jasonwilliamgolden@gmail.com' || user.email === 'jgolden@bowerycreativeagency.com') {
          // Use personal_contacts for your private tracking
          tableName = 'personal_contacts';
        }
        // Other authenticated users still see public_contacts
      }
      
      logger.debug(`Using ${tableName} table (user: ${user?.email}, user ID: ${user?.id}, mode: ${mode}`);
      
      // Build query to match actual table structure
      let countQuery = supabase.from(tableName).select('*', { count: 'exact', head: true });
      let dataQuery = supabase.from(tableName).select('*');
      
      // Add search filters if search term exists
      if (search.trim()) {
        // Search across multiple fields for better results
        const searchFilter = [
          `first_name.ilike.%${search}%`,
          `last_name.ilike.%${search}%`,
          `email.ilike.%${search}%`,
          `city.ilike.%${search}%`,
          `state.ilike.%${search}%`,
          `specialty.ilike.%${search}%`,
          `phone.ilike.%${search}%`
        ].join(',');
        
        countQuery = countQuery.or(searchFilter);
        dataQuery = dataQuery.or(searchFilter);
      }
      
      // Get total count with search filter
      const { count } = await countQuery;
      if (count !== null) {
        setTotalContacts(count);
        logger.debug(`Total contacts in ${tableName}: ${count}`);
      }
      
      // Also check both tables for debugging
      if (!search.trim()) {
        const { count: publicCount } = await supabase
          .from('public_contacts')
          .select('*', { count: 'exact', head: true });
        
        const { count: privateCount } = await supabase
          .from('contacts')
          .select('*', { count: 'exact', head: true });
          
        // Check contacts for current user specifically
        let userContactCount = 0;
        if (user) {
          const { count: userCount } = await supabase
            .from('contacts')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);
          userContactCount = userCount || 0;
        }
          
        logger.debug('=== Contact Count Debug ===');
        logger.debug(`public_contacts table: ${publicCount || 0} contacts`);
        logger.debug(`contacts table (private): ${privateCount || 0} contacts`);
        logger.debug(`Contacts for current user (${user?.id}): ${userContactCount} contacts`);
        logger.debug(`Currently viewing: ${tableName} table`);
        logger.debug(`Authenticated: ${!!user}, Demo mode: ${isDemo}`);
        logger.debug('==========================');
      }
      
      // Fetch contacts with search filter and pagination
      // Use different ordering based on table (overall_score exists only in contacts table)
      const orderColumn = tableName === 'contacts' ? 'overall_score' : 'created_at';
      const { data, error } = await dataQuery
        .order(orderColumn, { ascending: false })
        .range(page * CONTACTS_PER_PAGE, (page + 1) * CONTACTS_PER_PAGE - 1);
        
        if (error) {
          logger.error(`Error fetching contacts from ${tableName}:`, error);
          logger.info('Falling back to mock contacts data');
          // Use mock data if the table doesn't exist (404) or there's another error
          const mockContacts = mockDataService.generateMockContacts(20);
          setContacts(mockContacts);
          setLoading(false);
          return;
        }

        if (data && data.length > 0) {
          // Map the data to include practice type based on contact type
          const mappedData = data.map(contact => {
            // Determine practice type based on contact type
            let practiceType = 'dental';
            if (['aesthetic_doctor', 'plastic_surgeon', 'dermatologist', 
                 'cosmetic_dermatologist', 'nurse_practitioner', 
                 'physician_assistant', 'aesthetician'].includes(contact.type)) {
              practiceType = 'aesthetic';
            }
            
            // Map is_starred to isStarred for compatibility with existing code
            return {
              ...contact,
              isStarred: contact.is_starred,
              practiceType
            };
          });
          
          // Debug: Log the practice type distribution
          const dentalCount = mappedData.filter(c => c.practiceType === 'dental').length;
          const aestheticCount = mappedData.filter(c => c.practiceType === 'aesthetic').length;
          console.log('Contact distribution:', { 
            total: mappedData.length, 
            dental: dentalCount, 
            aesthetic: aestheticCount 
          });
          console.log('Sample contacts:', mappedData.slice(0, 5).map(c => ({
            name: `${c.first_name} ${c.last_name}`,
            type: c.type,
            practiceType: c.practiceType
          })));
          
          if (append) {
            setContacts(prev => [...prev, ...mappedData]);
          } else {
            setContacts(mappedData);
          }
          
          // Check if there are more contacts to load
          setHasMore(mappedData.length === CONTACTS_PER_PAGE);
        } else {
          // No data returned, use mock data
          console.log(`No data returned from ${tableName}, using mock data`);
          const mockContacts = mockDataService.generateMockContacts(20);
          setContacts(mockContacts);
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
        console.log('Exception caught when fetching contacts, falling back to mock data');
        // Use mock data if there's an exception
        const mockContacts = mockDataService.generateMockContacts(20);
        setContacts(mockContacts);
        setHasMore(false);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

  useEffect(() => {
    fetchContactsPage(0, false, '');
  }, []);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchContactsPage(nextPage, true, searchTerm);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Sanitize search input to prevent XSS
    const newSearchTerm = sanitize.escape(event.target.value);
    setSearchTerm(newSearchTerm);
    
    // Clear existing debounce
    if (searchDebounce) {
      clearTimeout(searchDebounce);
    }
    
    // Don't search if less than 2 characters (unless clearing)
    if (newSearchTerm.length > 0 && newSearchTerm.length < 2) {
      return;
    }
    
    // Set new debounce with longer delay
    const newDebounce = setTimeout(() => {
      setCurrentPage(0);
      fetchContactsPage(0, false, newSearchTerm);
    }, 500); // 500ms delay for better UX
    
    setSearchDebounce(newDebounce);
  };

  const handleFilterTypeChange = (event: SelectChangeEvent) => {
    setFilterType(event.target.value);
  };

  const handleFilterSpecialtyChange = (event: SelectChangeEvent) => {
    setFilterSpecialty(event.target.value);
  };

  const toggleStarred = async (id: string) => {
    // Don't allow toggling in demo mode or when not authenticated
    if (!user || isDemo) {
      console.log('Cannot toggle starred status in demo mode');
      return;
    }
    
    try {
      // Find the contact to toggle
      const contactToUpdate = contacts.find(c => c.id === id);
      if (!contactToUpdate) return;

      // Update the contact in the database (only in live mode with authenticated user)
      let tableName = 'public_contacts';
      if (user.email === 'jasonwilliamgolden@gmail.com' || user.email === 'jgolden@bowerycreativeagency.com') {
        tableName = 'personal_contacts';
      }
      const { error } = await supabase
        .from(tableName)
        .update({ is_starred: !contactToUpdate.isStarred })
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update the local state
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === id ? { ...contact, isStarred: !contact.isStarred } : contact
        )
      );
    } catch (error) {
      console.error('Error toggling starred status:', error);
    }
  };

  // Client-side filtering for tabs and filters (search is server-side)
  const filteredContacts = contacts.filter((contact) => {
    const matchesTab =
      (tabValue === 0) || // All contacts
      (tabValue === 1 && contact.isStarred) || // Starred
      (tabValue === 2 && contact.practiceType === 'dental') || // Dental
      (tabValue === 3 && contact.practiceType === 'aesthetic'); // Aesthetic

    const matchesType =
      filterType === 'all' || contact.practiceType === filterType;

    // For specialty, we'll use the contact type as a fallback
    const contactSpecialty = contact.specialization || contact.type;
    const matchesSpecialty =
      filterSpecialty === 'all' || contactSpecialty === filterSpecialty;

    return matchesTab && matchesType && matchesSpecialty;
  });

  // Extract unique specialties for filter dropdown
  const specialties = Array.from(new Set(contacts.map((contact) => 
    contact.specialization || contact.type
  )));

  const getContactInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
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

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ color: theme.palette.primary.main }}>
            {user && !isDemo && (user.email === 'jasonwilliamgolden@gmail.com' || user.email === 'jgolden@bowerycreativeagency.com') ? 'Personal Contacts' : 'Contacts'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total: {totalContacts.toLocaleString()} contacts in database
            {user && !isDemo && (user.email === 'jasonwilliamgolden@gmail.com' || user.email === 'jgolden@bowerycreativeagency.com') && ' (Private - Only visible to you)'}
          </Typography>
        </Box>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<ImportExportIcon />}
            sx={{ mr: 1 }}
            onClick={() => setImportModalOpen(true)}
          >
            Import/Export
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            sx={{ ml: 1 }}
            onClick={() => {
              setSelectedContact(null);
              setFormMode('add');
              setFormModalOpen(true);
            }}
          >
            Add Contact
          </Button>
        </Box>
      </Box>

      {/* Contact Metrics Display */}
      <ContactMetrics
        totalContacts={totalContacts}
        viewingStart={currentPage * CONTACTS_PER_PAGE + 1}
        viewingEnd={Math.min((currentPage + 1) * CONTACTS_PER_PAGE, totalContacts)}
        activeFilters={[
          ...(searchTerm ? [`Search: "${searchTerm}"`] : []),
          ...(filterType !== 'all' ? [`Type: ${filterType}`] : []),
          ...(filterSpecialty !== 'all' ? [`Specialization: ${filterSpecialty}`] : [])
        ]}
      />

      <Box sx={{ display: 'grid', gap: 3 }}>
        <Box>
          <Card variant="outlined">
            <CardContent>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '5fr 3fr 3fr 1fr' }, gap: 2, alignItems: 'center' }}>
                  <Box>
                  <TextField
                    fullWidth
                    placeholder="Search by name, email, city, state, specialty..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                      endAdornment: loading && searchTerm ? (
                        <InputAdornment position="end">
                          <CircularProgress size={20} />
                        </InputAdornment>
                      ) : null,
                    }}
                    helperText={searchTerm.length === 1 ? "Type at least 2 characters to search" : ""}
                  />
                  </Box>
                  <Box>
                  <FormControl fullWidth>
                    <InputLabel id="filter-type-label">Practice Type</InputLabel>
                    <Select
                      labelId="filter-type-label"
                      value={filterType}
                      label="Practice Type"
                      onChange={handleFilterTypeChange}
                    >
                      <MenuItem value="all">All Types</MenuItem>
                      <MenuItem value="dental">Dental</MenuItem>
                      <MenuItem value="aesthetic">Aesthetic</MenuItem>
                    </Select>
                  </FormControl>
                  </Box>
                  <Box>
                  <FormControl fullWidth>
                    <InputLabel id="filter-specialty-label">Specialty</InputLabel>
                    <Select
                      labelId="filter-specialty-label"
                      value={filterSpecialty}
                      label="Specialty"
                      onChange={handleFilterSpecialtyChange}
                    >
                      <MenuItem value="all">All Specialties</MenuItem>
                      {specialties.map((specialty) => (
                        <MenuItem key={specialty} value={specialty}>
                          {specialty ? specialty.replace('_', ' ') : 'Unknown'}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  </Box>
                  <Box>
                  <IconButton color="primary" aria-label="more filters">
                    <FilterListIcon />
                  </IconButton>
                  </Box>
                </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden', height: 'calc(100vh - 250px)' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="contacts tabs"
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label={`All (${contacts.length})`} {...a11yProps(0)} />
              <Tab label={`Starred (${contacts.filter(c => c.isStarred).length})`} {...a11yProps(1)} />
              <Tab label={`Dental (${contacts.filter(c => c.practiceType === 'dental').length})`} {...a11yProps(2)} />
              <Tab label={`Aesthetic (${contacts.filter(c => c.practiceType === 'aesthetic').length})`} {...a11yProps(3)} />
            </Tabs>
          </Box>

          <Box sx={{ flexGrow: 1, overflow: 'auto', height: 'calc(100% - 48px)' }}>
            <TabPanel value={tabValue} index={0}>
              <ContactsList 
                contacts={filteredContacts} 
                toggleStarred={toggleStarred}
                getContactInitials={getContactInitials}
                getAvatarColor={getAvatarColor}
                onEditContact={(contact) => {
                  setSelectedContact(contact);
                  setFormMode('edit');
                  setFormModalOpen(true);
                }}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <ContactsList 
                contacts={filteredContacts} 
                toggleStarred={toggleStarred}
                getContactInitials={getContactInitials}
                getAvatarColor={getAvatarColor}
                onEditContact={(contact) => {
                  setSelectedContact(contact);
                  setFormMode('edit');
                  setFormModalOpen(true);
                }}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <ContactsList 
                contacts={filteredContacts} 
                toggleStarred={toggleStarred}
                getContactInitials={getContactInitials}
                getAvatarColor={getAvatarColor}
                onEditContact={(contact) => {
                  setSelectedContact(contact);
                  setFormMode('edit');
                  setFormModalOpen(true);
                }}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              <ContactsList 
                contacts={filteredContacts} 
                toggleStarred={toggleStarred}
                getContactInitials={getContactInitials}
                getAvatarColor={getAvatarColor}
                onEditContact={(contact) => {
                  setSelectedContact(contact);
                  setFormMode('edit');
                  setFormModalOpen(true);
                }}
              />
            </TabPanel>
          </Box>
          
          {/* Load More Button */}
          {hasMore && !loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                variant="outlined"
                onClick={handleLoadMore}
                disabled={loadingMore}
                startIcon={loadingMore ? <CircularProgress size={20} /> : null}
                sx={{ px: 4, py: 1.5 }}
              >
                {loadingMore ? 'Loading...' : `Load More (${contacts.length} of ${totalContacts || '...'})`}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      
      {/* Contact Assistant Chat Widget */}
      <ContactChatWidget 
        onContactsUpdate={(newContacts) => {
          setContacts(newContacts);
          setTotalContacts(newContacts.length);
        }}
      />

      {/* Contact Import Modal */}
      <ContactImportModal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImportComplete={(importedCount) => {
          setImportModalOpen(false);
          // Refresh the contacts list
          fetchContactsPage(0, false, searchTerm);
          // Show success message
          showSuccess(`Successfully imported ${importedCount} contacts`);
        }}
      />

      {/* Contact Form Modal */}
      <ContactFormModal
        open={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setSelectedContact(null);
        }}
        contact={selectedContact}
        mode={formMode}
        onSubmit={async (contactData) => {
          try {
            if (formMode === 'add') {
              // Add new contact
              let tableName = 'public_contacts';
              if (user && !isDemo && (user.email === 'jasonwilliamgolden@gmail.com' || user.email === 'jgolden@bowerycreativeagency.com')) {
                tableName = 'personal_contacts';
              }
              const { error } = await supabase
                .from(tableName)
                .insert([contactData]);
              
              if (error) throw error;
              
              // Refresh the contacts list
              fetchContactsPage(0, false, searchTerm);
              showSuccess('Contact added successfully!');
            } else {
              // Update existing contact
              let tableName = 'public_contacts';
              if (user && !isDemo && (user.email === 'jasonwilliamgolden@gmail.com' || user.email === 'jgolden@bowerycreativeagency.com')) {
                tableName = 'personal_contacts';
              }
              const { error } = await supabase
                .from(tableName)
                .update(contactData)
                .eq('id', selectedContact?.id);
              
              if (error) throw error;
              
              // Update local state
              setContacts(prevContacts =>
                prevContacts.map(c =>
                  c.id === selectedContact?.id ? { ...c, ...contactData } : c
                )
              );
              showSuccess('Contact updated successfully!');
            }
          } catch (error: any) {
            console.error('Error saving contact:', error);
            showError(error.message || 'Failed to save contact');
            throw error;
          }
        }}
      />
    </Box>
  );
};

interface ContactsListProps {
  contacts: Contact[];
  toggleStarred: (id: string) => void;
  getContactInitials: (firstName: string, lastName: string) => string;
  getAvatarColor: (id: string) => string;
  onEditContact: (contact: Contact) => void;
}

const ContactsList: React.FC<ContactsListProps> = ({ 
  contacts, 
  toggleStarred,
  getContactInitials,
  getAvatarColor,
  onEditContact
}) => {
  const navigate = useNavigate();
  
  const handleContactClick = (id: string) => {
    navigate(`/contacts/${id}`);
  };
  const theme = useTheme();

  if (contacts.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
        No contacts found matching your filters.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 2, pb: 4 }}>
      {contacts.map((contact) => (
        <Box key={contact.id}>
          <Card 
            variant="outlined" 
            sx={{ 
              height: '100%',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: theme.shadows[4],
                transform: 'translateY(-2px)',
                cursor: 'pointer'
              }
            }}
            onClick={() => handleContactClick(contact.id)}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    sx={{ 
                      mr: 2,
                      bgcolor: getAvatarColor(contact.id),
                    }}
                  >
                    {getContactInitials(contact.first_name, contact.last_name)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {contact.first_name} {contact.last_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {contact.specialty || 'Healthcare Professional'}
                    </Typography>
                    {(contact.practice?.city || contact.city || contact.practice?.state || contact.state) && (
                      <Typography variant="caption" color="primary">
                        <BusinessIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                        {[
                          contact.practice?.city || contact.city, 
                          contact.practice?.state || contact.state
                        ].filter(Boolean).join(', ')}
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Box>
                  <IconButton 
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditContact(contact);
                    }}
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStarred(contact.id);
                    }}
                  >
                    {contact.isStarred ? (
                      <StarIcon sx={{ color: theme.palette.warning.main }} />
                    ) : (
                      <StarBorderIcon />
                    )}
                  </IconButton>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <BusinessIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {contact.practice?.name || contact.practice_name || 'No practice assigned'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box onClick={(e) => e.stopPropagation()}>
                    <CallButton contact={contact} />
                  </Box>
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {contact.phone}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  {contact.email}
                </Typography>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {contact.notes && contact.notes.length > 100
                  ? `${contact.notes.substring(0, 100)}...`
                  : contact.notes}
              </Typography>

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
            </CardContent>
          </Card>
        </Box>
      ))}
    </Box>
  );
};

export default Contacts;
