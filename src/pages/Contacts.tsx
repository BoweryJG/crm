import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
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
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterListIcon,
  Business as BusinessIcon,
  ImportExport as ImportExportIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';
import { supabase } from '../services/supabase/supabase';
import { Contact } from '../types/contacts';

// Mock data for development purposes
const mockContacts: Contact[] = [
  {
    id: '1',
    firstName: 'Robert',
    lastName: 'Johnson',
    email: 'rjohnson@nycimplants.com',
    phone: '212-555-1234',
    role: 'Lead Periodontist',
    practiceId: '1',
    practiceName: 'NYC Dental Implants Center',
    practiceType: 'dental',
    specialty: 'Periodontist',
    notes: 'Interested in Straumann BLX implant system. Prefers early morning meetings.',
    isStarred: true,
    lastContactDate: '2025-04-01T09:30:00Z',
    tags: ['Implants', 'Surgical'],
    createdAt: '2025-01-15T14:30:00Z',
    updatedAt: '2025-04-01T15:45:00Z'
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Chang',
    email: 'schang@columbia.edu',
    phone: '212-305-7676',
    role: 'Program Director',
    practiceId: '3',
    practiceName: 'Columbia Dental Implant Center',
    practiceType: 'dental',
    specialty: 'Prosthodontist',
    notes: 'Very influential in the teaching program. Conducts regular lunch and learns.',
    isStarred: true,
    lastContactDate: '2025-03-15T12:00:00Z',
    tags: ['Academic', 'Implants', 'Prosthetics'],
    createdAt: '2025-01-10T11:20:00Z',
    updatedAt: '2025-03-15T14:30:00Z'
  },
  {
    id: '3',
    firstName: 'Mark',
    lastName: 'Stein',
    email: 'mstein@nyoms.com',
    phone: '212-888-4760',
    role: 'Oral Surgeon',
    practiceId: '2',
    practiceName: 'New York Oral & Maxillofacial Surgery',
    practiceType: 'dental',
    specialty: 'Oral Surgeon',
    notes: 'Interested in guided surgery solutions. Performs zygomatic implants.',
    isStarred: false,
    lastContactDate: '2025-03-28T14:00:00Z',
    tags: ['Implants', 'Surgical', 'Zygomatic'],
    createdAt: '2025-02-05T09:45:00Z',
    updatedAt: '2025-03-28T16:30:00Z'
  },
  {
    id: '4',
    firstName: 'Jennifer',
    lastName: 'Smith',
    email: 'jsmith@manhattanaesthetics.com',
    phone: '212-777-8899',
    role: 'Lead Injector',
    practiceId: '4',
    practiceName: 'Manhattan Aesthetics',
    practiceType: 'aesthetic',
    specialty: 'Injector',
    notes: 'Specializes in facial rejuvenation. Looking for premium filler products.',
    isStarred: true,
    lastContactDate: '2025-04-03T11:15:00Z',
    tags: ['Injectables', 'Fillers', 'Premium'],
    createdAt: '2025-01-25T13:10:00Z',
    updatedAt: '2025-04-03T12:30:00Z'
  },
  {
    id: '5',
    firstName: 'Michael',
    lastName: 'Reynolds',
    email: 'mreynolds@nylaserdermatology.com',
    phone: '212-333-4567',
    role: 'Medical Director',
    practiceId: '5',
    practiceName: 'NY Laser Dermatology',
    practiceType: 'aesthetic',
    specialty: 'Dermatologist',
    notes: 'Interested in next-gen laser technology. High-volume practice.',
    isStarred: false,
    lastContactDate: '2025-03-27T15:30:00Z',
    tags: ['Lasers', 'Technology', 'Skin'],
    createdAt: '2025-02-12T10:15:00Z',
    updatedAt: '2025-03-27T16:45:00Z'
  }
];

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
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
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
        // In a real app, this would be a call to supabase or another API
        // const { data, error } = await supabase.from('contacts').select('*');
        
        // For now, use mock data
        setTimeout(() => {
          setContacts(mockContacts);
          setLoading(false);
        }, 600); // Simulate network delay
      } catch (error) {
        console.error('Error fetching contacts:', error);
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

  const handleFilterTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFilterType(event.target.value as string);
  };

  const handleFilterSpecialtyChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFilterSpecialty(event.target.value as string);
  };

  const toggleStarred = (id: string) => {
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === id ? { ...contact, isStarred: !contact.isStarred } : contact
      )
    );
  };

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      searchTerm === '' ||
      `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.practiceName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab =
      (tabValue === 0) || // All contacts
      (tabValue === 1 && contact.isStarred) || // Starred
      (tabValue === 2 && contact.practiceType === 'dental') || // Dental
      (tabValue === 3 && contact.practiceType === 'aesthetic'); // Aesthetic

    const matchesType =
      filterType === 'all' || contact.practiceType === filterType;

    const matchesSpecialty =
      filterSpecialty === 'all' || contact.specialty === filterSpecialty;

    return matchesSearch && matchesTab && matchesType && matchesSpecialty;
  });

  // Extract unique specialties for filter dropdown
  const specialties = Array.from(new Set(contacts.map((contact) => contact.specialty)));

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

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={5}>
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
                </Grid>
                <Grid item xs={12} md={3}>
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
                </Grid>
                <Grid item xs={12} md={3}>
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
                          {specialty}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={1}>
                  <IconButton color="primary" aria-label="more filters">
                    <FilterListIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
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
        </Grid>
      </Grid>
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
  const theme = useTheme();

  if (contacts.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
        No contacts found matching your filters.
      </Typography>
    );
  }

  return (
    <Grid container spacing={2}>
      {contacts.map((contact) => (
        <Grid item xs={12} md={6} lg={4} key={contact.id}>
          <Card 
            variant="outlined" 
            sx={{ 
              height: '100%',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: theme.shadows[4],
                transform: 'translateY(-2px)'
              }
            }}
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
                    {getContactInitials(contact.firstName, contact.lastName)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {contact.firstName} {contact.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {contact.role}
                    </Typography>
                  </Box>
                </Box>
                <IconButton onClick={() => toggleStarred(contact.id)}>
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
                  {contact.practiceName}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  {contact.phone}
                </Typography>
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
        </Grid>
      ))}
    </Grid>
  );
};

export default Contacts;
