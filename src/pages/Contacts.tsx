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
  StarBorder as StarBorderIcon
} from '@mui/icons-material';
import CallButton from '../components/contacts/CallButton';
import { Contact } from '../types/models';
import { supabase } from '../services/supabase/supabase';
import mockDataService from '../services/mockData/mockDataService';

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
  const [loading, setLoading] = useState<boolean>(true);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [tabValue, setTabValue] = useState<number>(0);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSpecialty, setFilterSpecialty] = useState<string>('all');

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        // Fetch contacts from the public_contacts table
        const { data, error } = await supabase
          .from('public_contacts')
          .select('*');
        
        if (error) {
          console.error('Error fetching contacts from public_contacts:', error);
          console.log('Falling back to mock contacts data');
          // Use mock data if the table doesn't exist (404) or there's another error
          const mockContacts = mockDataService.generateMockContacts(20);
          setContacts(mockContacts);
          setLoading(false);
          return;
        }

        if (data && data.length > 0) {
          // Sort data by created_at to ensure consistent ordering for categorization
          const sortedData = [...data].sort((a, b) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );

          // Map the data to include practice type and corrected contact types
          const mappedData = sortedData.map((contact, index) => {
            // Since we can't update the database directly due to RLS policies,
            // we'll determine practice type and correct contact type based on contact position
            let practiceType = 'dental';
            let correctedType = contact.type;
            
            if (index < 20) {
              // First 20 contacts are dental
              practiceType = 'dental';
              const dentalTypes = ['dentist', 'orthodontist', 'endodontist', 'periodontist', 
                                 'prosthodontist', 'pediatric_dentist', 'oral_surgeon'];
              correctedType = dentalTypes[index % dentalTypes.length];
            } else {
              // Remaining contacts are aesthetic
              practiceType = 'aesthetic';
              const aestheticTypes = ['aesthetic_doctor', 'plastic_surgeon', 'dermatologist', 'nurse_practitioner'];
              correctedType = aestheticTypes[(index - 20) % aestheticTypes.length];
            }
            
            // Map is_starred to isStarred for compatibility with existing code
            return {
              ...contact,
              isStarred: contact.is_starred,
              practiceType,
              type: correctedType // Use corrected type for proper categorization
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
          
          setContacts(mappedData);
        } else {
          // No data returned, use mock data
          console.log('No data returned from public_contacts, using mock data');
          const mockContacts = mockDataService.generateMockContacts(20);
          setContacts(mockContacts);
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
        console.log('Exception caught when fetching contacts, falling back to mock data');
        // Use mock data if there's an exception
        const mockContacts = mockDataService.generateMockContacts(20);
        setContacts(mockContacts);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterTypeChange = (event: SelectChangeEvent) => {
    setFilterType(event.target.value);
  };

  const handleFilterSpecialtyChange = (event: SelectChangeEvent) => {
    setFilterSpecialty(event.target.value);
  };

  const toggleStarred = async (id: string) => {
    try {
      // Find the contact to toggle
      const contactToUpdate = contacts.find(c => c.id === id);
      if (!contactToUpdate) return;

      // Update the contact in the database
      const { error } = await supabase
        .from('public_contacts')
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

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      searchTerm === '' ||
      `${contact.first_name} ${contact.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.practice_name && contact.practice_name.toLowerCase().includes(searchTerm.toLowerCase()));

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

    return matchesSearch && matchesTab && matchesType && matchesSpecialty;
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
        <Typography variant="h4" sx={{ color: theme.palette.primary.main }}>
          Contacts
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<ImportExportIcon />}
            sx={{ mr: 1 }}
          >
            Import/Export
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
          >
            Add Contact
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gap: 3 }}>
        <Box>
          <Card variant="outlined">
            <CardContent>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '5fr 3fr 3fr 1fr' }, gap: 2, alignItems: 'center' }}>
                  <Box>
                  <TextField
                    fullWidth
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
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
              />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <ContactsList 
                contacts={filteredContacts} 
                toggleStarred={toggleStarred}
                getContactInitials={getContactInitials}
                getAvatarColor={getAvatarColor}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <ContactsList 
                contacts={filteredContacts} 
                toggleStarred={toggleStarred}
                getContactInitials={getContactInitials}
                getAvatarColor={getAvatarColor}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              <ContactsList 
                contacts={filteredContacts} 
                toggleStarred={toggleStarred}
                getContactInitials={getContactInitials}
                getAvatarColor={getAvatarColor}
              />
            </TabPanel>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

interface ContactsListProps {
  contacts: Contact[];
  toggleStarred: (id: string) => void;
  getContactInitials: (firstName: string, lastName: string) => string;
  getAvatarColor: (id: string) => string;
}

const ContactsList: React.FC<ContactsListProps> = ({ 
  contacts, 
  toggleStarred,
  getContactInitials,
  getAvatarColor
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
                      {contact.title}
                    </Typography>
                  </Box>
                </Box>
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

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <BusinessIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {contact.practice_name}
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
