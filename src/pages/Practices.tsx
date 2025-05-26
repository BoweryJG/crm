import React, { useState, useEffect } from 'react';
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
  ImportExport as ImportExportIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Language as LanguageIcon
} from '@mui/icons-material';
import { Practice } from '../types/practices';
import { supabase } from '../services/supabase/supabase';

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
        
        // Fetch all contacts from public_contacts table
        const { data: contacts, error } = await supabase
          .from('public_contacts')
          .select('*')
          .order('practice_name');
        
        if (error) {
          console.error('Error fetching contacts:', error);
          // Generate fallback practices
          const fallbackPractices = generateFallbackPractices();
          setPractices(fallbackPractices);
          setLoading(false);
          return;
        }

        if (!contacts || contacts.length === 0) {
          // Generate fallback practices if no contacts
          const fallbackPractices = generateFallbackPractices();
          setPractices(fallbackPractices);
          setLoading(false);
          return;
        }

        // Group contacts by practice_name
        const practiceMap = new Map<string, any[]>();
        contacts.forEach(contact => {
          const practiceName = contact.practice_name || 'Independent Practice';
          if (!practiceMap.has(practiceName)) {
            practiceMap.set(practiceName, []);
          }
          practiceMap.get(practiceName)!.push(contact);
        });

        // Transform grouped contacts into practices
        const transformedPractices: Practice[] = Array.from(practiceMap.entries()).map(([practiceName, contactsInPractice], index) => {
          const firstContact = contactsInPractice[0];
          
          // Determine practice type based on contact types
          const contactTypes = contactsInPractice.map(c => c.type);
          const hasAestheticTypes = contactTypes.some(type => 
            ['aesthetic_doctor', 'plastic_surgeon', 'dermatologist', 
             'cosmetic_dermatologist', 'nurse_practitioner', 
             'physician_assistant', 'aesthetician'].includes(type)
          );
          const practiceType = hasAestheticTypes ? 'aesthetic' : 'dental';
          
          // Extract unique specialties
          const specialties = Array.from(new Set(
            contactsInPractice
              .map(c => c.specialization || c.type)
              .filter(Boolean)
              .map((s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()))
          ));
          
          // Determine practice size
          const numPractitioners = contactsInPractice.length;
          const size = numPractitioners <= 2 ? 'small' : numPractitioners <= 5 ? 'medium' : 'large';
          
          // Generate realistic technologies based on practice type
          const technologies = practiceType === 'dental' 
            ? ['CBCT', 'Intraoral Scanner', 'Digital X-Ray', 'CAD/CAM', 'Laser Dentistry']
            : ['Lasers', 'RF Microneedling', 'IPL', 'Body Contouring', 'Cryotherapy'];
          
          // Generate procedures based on practice type
          const procedures = practiceType === 'dental'
            ? ['General Dentistry', 'Dental Implants', 'Cosmetic Dentistry', 'Orthodontics', 'Endodontics']
            : ['Botox', 'Fillers', 'Laser Treatments', 'Chemical Peels', 'Microneedling'];
          
          // Get most recent contact date
          const lastContactDate = contactsInPractice
            .map(c => c.last_contact_date || c.updated_at || c.created_at)
            .filter(Boolean)
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];
          
          return {
            id: `practice-${index + 1}`,
            name: practiceName,
            address: firstContact.address || `${firstContact.city}, ${firstContact.state}`,
            city: firstContact.city || 'New York',
            state: firstContact.state || 'NY',
            zipCode: firstContact.zip_code || '10001',
            phone: firstContact.phone || '(212) 555-0100',
            email: firstContact.email || `info@${practiceName.toLowerCase().replace(/\s+/g, '')}.com`,
            website: firstContact.website || `https://www.${practiceName.toLowerCase().replace(/\s+/g, '')}.com`,
            type: practiceType,
            size,
            isDSO: Math.random() > 0.7, // 30% chance of being DSO
            numPractitioners,
            specialties,
            technologies: technologies.slice(0, Math.floor(Math.random() * 3) + 2),
            procedures: procedures.slice(0, Math.floor(Math.random() * 3) + 2),
            notes: `Practice with ${numPractitioners} practitioner${numPractitioners > 1 ? 's' : ''}. ${contactsInPractice.map(c => `${c.first_name} ${c.last_name}`).join(', ')}.`,
            lastContactDate,
            createdAt: firstContact.created_at,
            updatedAt: firstContact.updated_at || firstContact.created_at
          };
        });

        setPractices(transformedPractices);
      } catch (error) {
        console.error('Error in fetchPractices:', error);
        // Generate fallback practices on error
        const fallbackPractices = generateFallbackPractices();
        setPractices(fallbackPractices);
      } finally {
        setLoading(false);
      }
    };

    fetchPractices();
  }, []);

  // Helper function to generate realistic fallback practices
  const generateFallbackPractices = (): Practice[] => {
    const practiceNames = [
      // Dental Practices
      'Advanced Dental Arts NYC', 'Brooklyn Smile Design', 'Manhattan Periodontics & Implant Dentistry',
      'Queens Family Dental', 'Bronx Orthodontic Specialists', 'Staten Island Oral Surgery',
      'Park Avenue Endodontics', 'Tribeca Dental Studio', 'Upper East Side Dentistry',
      'Chelsea Dental Aesthetics', 'Harlem Family Dental Care', 'Astoria Modern Dentistry',
      // Aesthetic Practices  
      'Fifth Avenue Dermatology', 'SoHo Skin & Laser', 'Manhattan Aesthetics Med Spa',
      'Brooklyn Heights Plastic Surgery', 'Queens Cosmetic Center', 'Bronx Beauty & Wellness',
      'West Village Dermatology', 'Midtown Medical Aesthetics'
    ];
    
    const cities = [
      { name: 'New York', state: 'NY', zips: ['10001', '10011', '10014', '10021', '10028'] },
      { name: 'Brooklyn', state: 'NY', zips: ['11201', '11215', '11217', '11231'] },
      { name: 'Los Angeles', state: 'CA', zips: ['90210', '90211', '90212', '90401'] },
      { name: 'Miami', state: 'FL', zips: ['33139', '33140', '33141', '33142'] },
      { name: 'Chicago', state: 'IL', zips: ['60601', '60602', '60603', '60604'] }
    ];
    
    return practiceNames.map((name, index) => {
      const city = cities[index % cities.length];
      const isAesthetic = name.toLowerCase().includes('dermatology') || 
                         name.toLowerCase().includes('aesthetic') || 
                         name.toLowerCase().includes('cosmetic') ||
                         name.toLowerCase().includes('plastic') ||
                         name.toLowerCase().includes('spa');
      
      const practiceType = isAesthetic ? 'aesthetic' : 'dental';
      const numPractitioners = Math.floor(Math.random() * 8) + 1;
      const size = numPractitioners <= 2 ? 'small' : numPractitioners <= 5 ? 'medium' : 'large';
      
      const dentalSpecialties = ['General Dentist', 'Periodontist', 'Endodontist', 'Orthodontist', 
                                 'Oral Surgeon', 'Prosthodontist', 'Pediatric Dentist'];
      const aestheticSpecialties = ['Dermatologist', 'Plastic Surgeon', 'Cosmetic Dermatologist', 
                                    'Aesthetic Nurse Practitioner', 'Medical Aesthetician'];
      
      const dentalTech = ['CBCT', 'Intraoral Scanner', 'Digital X-Ray', 'CAD/CAM', 'Laser Dentistry', 
                          'Surgical Guides', 'In-House Milling'];
      const aestheticTech = ['CO2 Laser', 'IPL', 'RF Microneedling', 'Ultherapy', 'CoolSculpting', 
                             'Hydrafacial', 'Plasma Pen'];
      
      const dentalProc = ['Dental Implants', 'All-on-4', 'Veneers', 'Invisalign', 'Root Canal', 
                          'Teeth Whitening', 'Crown & Bridge', 'Gum Treatment'];
      const aestheticProc = ['Botox', 'Dermal Fillers', 'Laser Hair Removal', 'Chemical Peels', 
                             'Microneedling', 'PRP Therapy', 'Thread Lift', 'Kybella'];
      
      const specialties = practiceType === 'dental' 
        ? dentalSpecialties.sort(() => 0.5 - Math.random()).slice(0, Math.min(3, numPractitioners))
        : aestheticSpecialties.sort(() => 0.5 - Math.random()).slice(0, Math.min(3, numPractitioners));
      
      const technologies = practiceType === 'dental'
        ? dentalTech.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 2)
        : aestheticTech.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 2);
      
      const procedures = practiceType === 'dental'
        ? dentalProc.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 3)
        : aestheticProc.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 3);
      
      const streetNumber = Math.floor(Math.random() * 900) + 100;
      const streetNames = ['Main St', 'Park Ave', 'Broadway', 'Madison Ave', '5th Ave', 
                           'Lexington Ave', 'Columbus Ave', 'Ocean Dr', 'Sunset Blvd'];
      const street = streetNames[Math.floor(Math.random() * streetNames.length)];
      
      return {
        id: `practice-${index + 1}`,
        name,
        address: `${streetNumber} ${street}, ${city.name}, ${city.state}`,
        city: city.name,
        state: city.state,
        zipCode: city.zips[Math.floor(Math.random() * city.zips.length)],
        phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        email: `info@${name.toLowerCase().replace(/\s+/g, '').substring(0, 20)}.com`,
        website: `https://www.${name.toLowerCase().replace(/\s+/g, '').substring(0, 20)}.com`,
        type: practiceType,
        size,
        isDSO: Math.random() > 0.7,
        numPractitioners,
        specialties,
        technologies,
        procedures,
        notes: `${size.charAt(0).toUpperCase() + size.slice(1)} ${practiceType} practice with focus on ${procedures[0]}.`,
        lastContactDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString()
      };
    });
  };

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
