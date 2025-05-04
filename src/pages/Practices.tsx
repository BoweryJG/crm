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
  Chip,
  CircularProgress,
  Divider,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  SelectChangeEvent
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterListIcon,
  Business as BusinessIcon,
  ImportExport as ImportExportIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Language as LanguageIcon
} from '@mui/icons-material';
import { supabase } from '../services/supabase/supabase';
import { Practice } from '../types/practices';

// Mock data for development purposes
const mockPractices: Practice[] = [
  {
    id: '1',
    name: 'NYC Dental Implants Center',
    address: '225 East 64th St, Ste 1B, New York, NY',
    city: 'New York',
    state: 'NY',
    zipCode: '10065',
    phone: '212-256-0000',
    email: 'info@nycdentalimplantscenter.com',
    website: 'https://www.nycdentalimplantscenter.com',
    type: 'dental',
    size: 'medium',
    isDSO: false,
    numPractitioners: 3,
    specialties: ['Periodontist', 'Prosthodontist'],
    technologies: ['CBCT', 'Intraoral Scanner', 'Surgical Guides', 'In-House Milling'],
    procedures: ['Dental Implants', 'Full Arch', 'Same Day Implants', 'All-on-4', 'All-on-6'],
    notes: 'High-end practice focused on implant dentistry. Good relationship with Dr. Johnson.',
    lastContactDate: '2025-04-01T09:30:00Z',
    createdAt: '2025-01-15T14:30:00Z',
    updatedAt: '2025-04-01T15:45:00Z'
  },
  {
    id: '2',
    name: 'New York Oral & Maxillofacial Surgery',
    address: '800B 5th Ave, New York, NY',
    city: 'New York',
    state: 'NY',
    zipCode: '10065',
    phone: '212-888-4760',
    email: 'office@nyoms.com',
    website: 'https://www.new-york-oral-surgery.com',
    type: 'dental',
    size: 'small',
    isDSO: false,
    numPractitioners: 1,
    specialties: ['Oral Surgeon'],
    technologies: ['CBCT', 'Intraoral Scanner', 'Surgical Guides'],
    procedures: ['Dental Implants', 'Full Arch', 'Same Day Implants', 'All-on-4', 'Zygomatic Implants'],
    notes: 'Solo practitioner specializing in complex implant cases. Performs zygomatic implants.',
    lastContactDate: '2025-03-28T14:00:00Z',
    createdAt: '2025-02-05T09:45:00Z',
    updatedAt: '2025-03-28T16:30:00Z'
  },
  {
    id: '3',
    name: 'Columbia Dental Implant Center',
    address: '630 W 168th St, New York, NY',
    city: 'New York',
    state: 'NY',
    zipCode: '10032',
    phone: '212-305-6100',
    email: 'dental_implants@columbia.edu',
    website: 'https://www.dental.columbia.edu/teaching-clinics/implant-center',
    type: 'dental',
    size: 'large',
    isDSO: false,
    numPractitioners: 12,
    specialties: ['Periodontist', 'Prosthodontist', 'Oral Surgeon', 'General Dentist'],
    technologies: ['CBCT', 'Intraoral Scanner', 'Surgical Guides', 'In-House Milling'],
    procedures: ['Dental Implants', 'Full Arch', 'All-on-4', 'All-on-6', 'Zygomatic Implants'],
    notes: 'Academic center with teaching program. Influential in the NYC dental community.',
    lastContactDate: '2025-03-15T12:00:00Z',
    createdAt: '2025-01-10T11:20:00Z',
    updatedAt: '2025-03-15T14:30:00Z'
  },
  {
    id: '4',
    name: 'Manhattan Aesthetics',
    address: '161 Madison Ave, Ste 7SW, New York, NY',
    city: 'New York',
    state: 'NY',
    zipCode: '10016',
    phone: '212-777-8899',
    email: 'info@manhattanaesthetics.com',
    website: 'https://www.manhattanaesthetics.com',
    type: 'aesthetic',
    size: 'medium',
    isDSO: true,
    numPractitioners: 5,
    specialties: ['Dermatologist', 'Plastic Surgeon', 'Injector'],
    technologies: ['Lasers', 'RF Microneedling', 'Body Contouring'],
    procedures: ['Botox', 'Fillers', 'Laser Skin Resurfacing', 'Body Sculpting', 'Chemical Peels'],
    notes: 'High-volume aesthetic practice with multiple locations. Looking for premium products.',
    lastContactDate: '2025-04-03T11:15:00Z',
    createdAt: '2025-01-25T13:10:00Z',
    updatedAt: '2025-04-03T12:30:00Z'
  },
  {
    id: '5',
    name: 'NY Laser Dermatology',
    address: '317 E 34th St, New York, NY',
    city: 'New York',
    state: 'NY',
    zipCode: '10016',
    phone: '212-333-4567',
    email: 'appointments@nylaserdermatology.com',
    website: 'https://www.nylaserdermatology.com',
    type: 'aesthetic',
    size: 'medium',
    isDSO: false,
    numPractitioners: 3,
    specialties: ['Dermatologist'],
    technologies: ['Lasers', 'RF Microneedling', 'IPL'],
    procedures: ['Laser Hair Removal', 'Skin Rejuvenation', 'Acne Treatment', 'Tattoo Removal'],
    notes: 'Focused on laser treatments and technology-driven procedures. Interested in next-gen devices.',
    lastContactDate: '2025-03-27T15:30:00Z',
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
      id={`practices-tabpanel-${index}`}
      aria-labelledby={`practices-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `practices-tab-${index}`,
    'aria-controls': `practices-tabpanel-${index}`,
  };
}

const Practices: React.FC = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState<boolean>(true);
  const [practices, setPractices] = useState<Practice[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [tabValue, setTabValue] = useState<number>(0);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSize, setFilterSize] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  useEffect(() => {
    const fetchPractices = async () => {
      try {
        setLoading(true);
        // In a real app, this would be a call to supabase or another API
        // const { data, error } = await supabase.from('practices').select('*');
        
        // For now, use mock data
        setTimeout(() => {
          setPractices(mockPractices);
          setLoading(false);
        }, 600); // Simulate network delay
      } catch (error) {
        console.error('Error fetching practices:', error);
        setLoading(false);
      }
    };

    fetchPractices();
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

  const handleFilterSizeChange = (event: SelectChangeEvent) => {
    setFilterSize(event.target.value);
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'card' ? 'table' : 'card');
  };

  const filteredPractices = practices.filter((practice) => {
    const matchesSearch =
      searchTerm === '' ||
      practice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      practice.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      practice.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      practice.procedures.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTab =
      (tabValue === 0) || // All practices
      (tabValue === 1 && practice.type === 'dental') || // Dental
      (tabValue === 2 && practice.type === 'aesthetic'); // Aesthetic

    const matchesType =
      filterType === 'all' || practice.type === filterType;

    const matchesSize =
      filterSize === 'all' || practice.size === filterSize;

    return matchesSearch && matchesTab && matchesType && matchesSize;
  });

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
          Practices
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
            Add Practice
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
                    placeholder="Search practices..."
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
                    <InputLabel id="filter-size-label">Practice Size</InputLabel>
                    <Select
                      labelId="filter-size-label"
                      value={filterSize}
                      label="Practice Size"
                      onChange={handleFilterSizeChange}
                    >
                      <MenuItem value="all">All Sizes</MenuItem>
                      <MenuItem value="small">Small</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="large">Large</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton color="primary" aria-label="more filters">
                      <FilterListIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: 1, 
            borderColor: 'divider' 
          }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="practices tabs"
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label={`All (${practices.length})`} {...a11yProps(0)} />
              <Tab label={`Dental (${practices.filter(p => p.type === 'dental').length})`} {...a11yProps(1)} />
              <Tab label={`Aesthetic (${practices.filter(p => p.type === 'aesthetic').length})`} {...a11yProps(2)} />
            </Tabs>
            <Button 
              variant="text" 
              onClick={toggleViewMode}
              startIcon={viewMode === 'card' ? <TableIcon /> : <ViewModuleIcon />}
            >
              {viewMode === 'card' ? 'Table View' : 'Card View'}
            </Button>
          </Box>

          <TabPanel value={tabValue} index={0}>
            {viewMode === 'card' ? (
              <PracticesCardView practices={filteredPractices} />
            ) : (
              <PracticesTableView practices={filteredPractices} />
            )}
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            {viewMode === 'card' ? (
              <PracticesCardView practices={filteredPractices} />
            ) : (
              <PracticesTableView practices={filteredPractices} />
            )}
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            {viewMode === 'card' ? (
              <PracticesCardView practices={filteredPractices} />
            ) : (
              <PracticesTableView practices={filteredPractices} />
            )}
          </TabPanel>
        </Box>
      </Box>
    </Box>
  );
};

interface PracticesCardViewProps {
  practices: Practice[];
}

const PracticesCardView: React.FC<PracticesCardViewProps> = ({ practices }) => {
  const theme = useTheme();

  if (practices.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
        No practices found matching your filters.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 2 }}>
      {practices.map((practice) => (
        <Box key={practice.id}>
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
                <Typography variant="h6">
                  {practice.name}
                </Typography>
                <Chip 
                  label={practice.type === 'dental' ? 'Dental' : 'Aesthetic'} 
                  color={practice.type === 'dental' ? 'primary' : 'secondary'}
                  size="small"
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                <LocationIcon fontSize="small" sx={{ mr: 1, mt: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {practice.address}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  {practice.phone}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LanguageIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                  {practice.website}
                </Typography>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Specialties
                </Typography>
                <Box>
                  {practice.specialties.map((specialty) => (
                    <Chip 
                      key={specialty} 
                      label={specialty} 
                      size="small" 
                      sx={{ mr: 0.5, mb: 0.5 }} 
                    />
                  ))}
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Technologies
                </Typography>
                <Box>
                  {practice.technologies.map((tech) => (
                    <Chip 
                      key={tech} 
                      label={tech} 
                      size="small" 
                      variant="outlined"
                      sx={{ mr: 0.5, mb: 0.5 }} 
                    />
                  ))}
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Practice Details
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                  <Chip 
                    label={`Size: ${practice.size}`} 
                    size="small" 
                    sx={{ mr: 0.5, mb: 0.5 }} 
                  />
                  <Chip 
                    label={practice.isDSO ? 'DSO' : 'Independent'} 
                    size="small" 
                    sx={{ mr: 0.5, mb: 0.5 }} 
                  />
                  <Chip 
                    label={`${practice.numPractitioners} Practitioners`} 
                    size="small" 
                    sx={{ mr: 0.5, mb: 0.5 }} 
                  />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button 
                  size="small" 
                  startIcon={<EditIcon />}
                  sx={{ mr: 1 }}
                >
                  Edit
                </Button>
                <Button 
                  size="small" 
                  color="error"
                  startIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      ))}
    </Box>
  );
};

interface PracticesTableViewProps {
  practices: Practice[];
}

const PracticesTableView: React.FC<PracticesTableViewProps> = ({ practices }) => {
  if (practices.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
        No practices found matching your filters.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table sx={{ minWidth: 650 }} aria-label="practices table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Specialties</TableCell>
            <TableCell>Contact</TableCell>
            <TableCell>Last Contact</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {practices.map((practice) => (
            <TableRow
              key={practice.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Typography variant="body2" fontWeight="medium">
                  {practice.name}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip 
                  label={practice.type === 'dental' ? 'Dental' : 'Aesthetic'} 
                  color={practice.type === 'dental' ? 'primary' : 'secondary'}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Tooltip title={practice.address}>
                  <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                    {practice.city}, {practice.state}
                  </Typography>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                    {practice.size}
                  </Typography>
                  {practice.isDSO && (
                    <Chip label="DSO" size="small" sx={{ ml: 1 }} />
                  )}
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {practice.specialties.slice(0, 2).map((specialty) => (
                    <Chip 
                      key={specialty} 
                      label={specialty} 
                      size="small" 
                    />
                  ))}
                  {practice.specialties.length > 2 && (
                    <Tooltip title={practice.specialties.slice(2).join(', ')}>
                      <Chip 
                        label={`+${practice.specialties.length - 2}`} 
                        size="small" 
                      />
                    </Tooltip>
                  )}
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{practice.phone}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {practice.lastContactDate ? new Date(practice.lastContactDate).toLocaleDateString() : 'N/A'}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <IconButton size="small">
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small">
                  <DeleteIcon fontSize="small" />
                </IconButton>
                <IconButton size="small">
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// These icons are not imported above, so we need to define them
const TableIcon = () => <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>;
const ViewModuleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M4 11h5V5H4v6zm0 7h5v-6H4v6zm6 0h5v-6h-5v6zm6 0h5v-6h-5v6zm-6-7h5V5h-5v6zm6-6v6h5V5h-5z"/></svg>;

export default Practices;
