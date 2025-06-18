// SUIS Phase 4: Contact Universe & Acquisition System
// Contact Universe Management Component

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  LinearProgress, 
  IconButton, 
  TextField,
  InputAdornment,
  Button, 
  Avatar, 
  Badge,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  Slider,
  Autocomplete
} from '@mui/material';
import { 
  Users, UserPlus, Filter, Search, Star, Mail, Phone,
  Calendar, TrendingUp, Award, Target, Activity,
  MapPin, Building, Briefcase, DollarSign, Clock,
  ChevronRight, Download, Upload, Brain
} from 'lucide-react';
import { useAuth } from '../../auth';
import { useNavigate } from 'react-router-dom';
import { useAppMode } from '../../contexts/AppModeContext';
import { generateContactUniverseData, ContactUniverseData } from '../../services/mockData/suisIntelligenceMockData';

const ContactUniverse: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDemo } = useAppMode();
  
  const [contacts, setContacts] = useState<ContactUniverseData[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<ContactUniverseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<ContactUniverseData | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [filterChannel, setFilterChannel] = useState('all');
  const [engagementRange, setEngagementRange] = useState<number[]>([0, 100]);
  const [aiScoreRange, setAiScoreRange] = useState<number[]>([0, 100]);
  const [showOnlyStarred, setShowOnlyStarred] = useState(false);

  useEffect(() => {
    // Load mock data in demo mode
    if (isDemo || !user) {
      setTimeout(() => {
        const mockContacts = generateContactUniverseData(150);
        setContacts(mockContacts);
        setFilteredContacts(mockContacts);
        setLoading(false);
      }, 1000);
    } else {
      // Load real data for authenticated users
      setLoading(false);
    }
  }, [isDemo, user]);

  useEffect(() => {
    // Apply filters
    let filtered = [...contacts];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(contact => 
        `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.practice.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Location filter
    if (filterLocation !== 'all') {
      filtered = filtered.filter(contact => contact.location === filterLocation);
    }

    // Specialty filter
    if (filterSpecialty !== 'all') {
      filtered = filtered.filter(contact => contact.specialty === filterSpecialty);
    }

    // Channel filter
    if (filterChannel !== 'all') {
      filtered = filtered.filter(contact => contact.preferredChannel === filterChannel);
    }

    // Engagement score filter
    filtered = filtered.filter(contact => 
      contact.engagementScore >= engagementRange[0] && 
      contact.engagementScore <= engagementRange[1]
    );

    // AI score filter
    filtered = filtered.filter(contact => 
      contact.aiScore >= aiScoreRange[0] && 
      contact.aiScore <= aiScoreRange[1]
    );

    // Starred filter
    if (showOnlyStarred) {
      filtered = filtered.filter(contact => contact.tags.includes('VIP'));
    }

    setFilteredContacts(filtered);
  }, [contacts, searchTerm, filterLocation, filterSpecialty, filterChannel, engagementRange, aiScoreRange, showOnlyStarred]);

  const uniqueLocations = ['all', ...new Set(contacts.map(c => c.location))];
  const uniqueSpecialties = ['all', ...new Set(contacts.map(c => c.specialty))];

  const getEngagementColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getAIScoreGradient = (score: number) => {
    const hue = (score / 100) * 120; // 0 = red, 120 = green
    return `linear-gradient(135deg, hsl(${hue}, 70%, 50%) 0%, hsl(${hue}, 70%, 40%) 100%)`;
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Loading Contact Universe...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Contact Universe
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            AI-powered contact intelligence and engagement
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {(isDemo || !user) && (
            <Chip label="Demo Mode" color="primary" variant="outlined" size="small" />
          )}
          <Button variant="outlined" startIcon={<Upload />}>
            Import
          </Button>
          <Button variant="outlined" startIcon={<Download />}>
            Export
          </Button>
          <Button variant="contained" startIcon={<UserPlus />}>
            Add Contact
          </Button>
        </Box>
      </Box>

      {/* AI Summary */}
      <Card sx={{ mb: 3, background: getAIScoreGradient(75) }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'white' }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
              <Brain size={32} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="bold">
                AI Contact Intelligence
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {filteredContacts.length} contacts analyzed • {contacts.filter(c => c.aiScore >= 80).length} high-value targets identified • {contacts.filter(c => c.tags.includes('VIP')).length} VIP contacts
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h3" fontWeight="bold">
                {Math.round(filteredContacts.reduce((acc, c) => acc + c.aiScore, 0) / filteredContacts.length || 0)}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Avg AI Score
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Location</InputLabel>
              <Select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                label="Location"
              >
                {uniqueLocations.map(loc => (
                  <MenuItem key={loc} value={loc}>
                    {loc === 'all' ? 'All Locations' : loc}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Specialty</InputLabel>
              <Select
                value={filterSpecialty}
                onChange={(e) => setFilterSpecialty(e.target.value)}
                label="Specialty"
              >
                {uniqueSpecialties.map(spec => (
                  <MenuItem key={spec} value={spec}>
                    {spec === 'all' ? 'All Specialties' : spec}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Channel</InputLabel>
              <Select
                value={filterChannel}
                onChange={(e) => setFilterChannel(e.target.value)}
                label="Channel"
              >
                <MenuItem value="all">All Channels</MenuItem>
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="phone">Phone</MenuItem>
                <MenuItem value="in-person">In-Person</MenuItem>
                <MenuItem value="digital">Digital</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <ToggleButton
                value="starred"
                selected={showOnlyStarred}
                onChange={() => setShowOnlyStarred(!showOnlyStarred)}
                sx={{ px: 2 }}
              >
                <Star size={18} />
              </ToggleButton>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(e, newMode) => newMode && setViewMode(newMode)}
                size="small"
              >
                <ToggleButton value="grid">Grid</ToggleButton>
                <ToggleButton value="list">List</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Grid>
        </Grid>

        {/* Advanced Filters */}
        <Box sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: 'divider' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography gutterBottom>
                Engagement Score: {engagementRange[0]} - {engagementRange[1]}
              </Typography>
              <Slider
                value={engagementRange}
                onChange={(e, newValue) => setEngagementRange(newValue as number[])}
                valueLabelDisplay="auto"
                min={0}
                max={100}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography gutterBottom>
                AI Score: {aiScoreRange[0]} - {aiScoreRange[1]}
              </Typography>
              <Slider
                value={aiScoreRange}
                onChange={(e, newValue) => setAiScoreRange(newValue as number[])}
                valueLabelDisplay="auto"
                min={0}
                max={100}
                sx={{
                  '& .MuiSlider-thumb': {
                    background: getAIScoreGradient(75)
                  },
                  '& .MuiSlider-track': {
                    background: getAIScoreGradient(75)
                  }
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Results Summary */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredContacts.length} of {contacts.length} contacts
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Chip label={`${contacts.filter(c => c.tags.includes('High Volume')).length} High Volume`} size="small" />
          <Chip label={`${contacts.filter(c => c.tags.includes('Early Adopter')).length} Early Adopters`} size="small" />
          <Chip label={`${contacts.filter(c => c.tags.includes('Opinion Leader')).length} Opinion Leaders`} size="small" />
        </Box>
      </Box>

      {/* Contact Grid/List */}
      {viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {filteredContacts.slice(0, 12).map((contact) => (
            <Grid item xs={12} md={6} lg={4} key={contact.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
                onClick={() => setSelectedContact(contact)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 48, height: 48, bgcolor: theme.palette.primary.main }}>
                        {contact.firstName[0]}{contact.lastName[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
                          {contact.firstName} {contact.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {contact.title}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Box 
                        sx={{ 
                          width: 40, 
                          height: 40, 
                          borderRadius: '50%',
                          background: getAIScoreGradient(contact.aiScore),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.9rem'
                        }}
                      >
                        {contact.aiScore}
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Building size={14} />
                      <Typography variant="body2">{contact.practice}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <MapPin size={14} />
                      <Typography variant="body2" color="text.secondary">{contact.location}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Briefcase size={14} />
                      <Typography variant="body2" color="text.secondary">{contact.specialty}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption">Engagement</Typography>
                      <Typography variant="caption" fontWeight="bold">
                        {contact.engagementScore}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={contact.engagementScore} 
                      color={getEngagementColor(contact.engagementScore)}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      Next Best Action:
                    </Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                      {contact.nextBestAction}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {contact.tags.map((tag, idx) => (
                      <Chip 
                        key={idx} 
                        label={tag} 
                        size="small"
                        color={tag === 'VIP' ? 'primary' : 'default'}
                      />
                    ))}
                  </Box>

                  <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-around' }}>
                    <IconButton size="small">
                      <Mail size={18} />
                    </IconButton>
                    <IconButton size="small">
                      <Phone size={18} />
                    </IconButton>
                    <IconButton size="small">
                      <Calendar size={18} />
                    </IconButton>
                    <IconButton size="small">
                      <ChevronRight size={18} />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <List>
          {filteredContacts.slice(0, 20).map((contact, index) => (
            <React.Fragment key={contact.id}>
              {index > 0 && <Divider />}
              <ListItem 
                button 
                onClick={() => setSelectedContact(contact)}
                sx={{ py: 2 }}
              >
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <Avatar 
                        sx={{ 
                          width: 22, 
                          height: 22, 
                          background: getAIScoreGradient(contact.aiScore),
                          fontSize: '0.7rem'
                        }}
                      >
                        {contact.aiScore}
                      </Avatar>
                    }
                  >
                    <Avatar sx={{ width: 48, height: 48, bgcolor: theme.palette.primary.main }}>
                      {contact.firstName[0]}{contact.lastName[0]}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {contact.firstName} {contact.lastName}
                      </Typography>
                      {contact.tags.includes('VIP') && <Star size={16} color={theme.palette.warning.main} />}
                      <Typography variant="body2" color="text.secondary">
                        • {contact.title} at {contact.practice}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Box sx={{ display: 'flex', gap: 3, mb: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          <MapPin size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                          {contact.location}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          <Briefcase size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                          {contact.specialty}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          <Activity size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                          {contact.engagementScore}% engaged
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        Next: {contact.nextBestAction}
                      </Typography>
                    </Box>
                  }
                />
                <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                  <IconButton size="small">
                    <Mail size={18} />
                  </IconButton>
                  <IconButton size="small">
                    <Phone size={18} />
                  </IconButton>
                  <IconButton size="small">
                    <Calendar size={18} />
                  </IconButton>
                </Box>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};

export default ContactUniverse;