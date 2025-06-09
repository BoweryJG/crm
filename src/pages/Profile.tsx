import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Paper,
  useTheme,
  Avatar,
  Chip,
  IconButton,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Badge as BadgeIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  Security as SecurityIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { useThemeContext } from '../themes/ThemeContext';
import { useAuth } from '../auth';

const Profile: React.FC = () => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  // Profile data state
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@repspheres.com',
    phone: '+1 (555) 123-4567',
    title: 'Senior Sales Representative',
    company: 'Advanced Medical Solutions',
    territory: 'Northeast Region',
    location: 'New York, NY',
    bio: 'Experienced medical device sales professional with 8+ years in the aesthetic and dermatology space. Specialized in building relationships with high-volume practices and driving territory growth.',
    certifications: ['Aesthetic Device Specialist', 'Advanced Sales Certification', 'Medical Ethics Training'],
    goals: 'Achieve 125% of quota this year and expand into 3 new practice segments'
  });

  const [tempData, setTempData] = useState(profileData);

  const handleEdit = () => {
    setTempData(profileData);
    setEditing(true);
  };

  const handleCancel = () => {
    setTempData(profileData);
    setEditing(false);
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    // Simulate API call
    setTimeout(() => {
      setProfileData(tempData);
      setEditing(false);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setTempData(prev => ({ ...prev, [field]: value }));
  };

  const performanceStats = [
    { label: 'Calls This Month', value: '142', trend: '+12%' },
    { label: 'Quota Achievement', value: '108%', trend: '+8%' },
    { label: 'New Contacts', value: '23', trend: '+15%' },
    { label: 'Pipeline Value', value: '$485K', trend: '+22%' }
  ];

  const recentActivity = [
    { type: 'call', text: 'Call with Dr. Martinez - Aesthetic Clinic', time: '2 hours ago' },
    { type: 'meeting', text: 'Product demo at Manhattan Dermatology', time: '1 day ago' },
    { type: 'achievement', text: 'Achieved monthly quota target', time: '3 days ago' },
    { type: 'training', text: 'Completed Advanced Selling Techniques course', time: '1 week ago' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call': return <PhoneIcon />;
      case 'meeting': return <BusinessIcon />;
      case 'achievement': return <StarIcon />;
      case 'training': return <SchoolIcon />;
      default: return <AssignmentIcon />;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            background: themeMode === 'space' 
              ? 'linear-gradient(135deg, #8A60D0 0%, #6366F1 100%)'
              : themeMode === 'luxury'
              ? 'linear-gradient(135deg, #C9B037 0%, #FFD700 100%)'
              : 'linear-gradient(135deg, #3D52D5 0%, #6366F1 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}
        >
          Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your personal information and track your performance
        </Typography>
      </Box>

      {saveStatus === 'saved' && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Profile updated successfully!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Info Card */}
        <Grid item xs={12} lg={8}>
          <Paper 
            elevation={0}
            sx={{ 
              borderRadius: 3,
              border: `1px solid ${
                themeMode === 'space' 
                  ? 'rgba(255, 255, 255, 0.08)'
                  : themeMode === 'luxury'
                  ? 'rgba(201, 176, 55, 0.3)'
                  : 'rgba(0, 0, 0, 0.06)'
              }`,
              p: 3
            }}
          >
            {/* Header with Avatar and Edit Button */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
              <Box sx={{ position: 'relative', mr: 3 }}>
                <Avatar 
                  sx={{ 
                    width: 100, 
                    height: 100,
                    bgcolor: themeMode === 'space' ? '#8860D0' : themeMode === 'luxury' ? '#C9B037' : '#3D52D5',
                    fontSize: '2rem',
                    fontWeight: 700
                  }}
                >
                  {profileData.firstName[0]}{profileData.lastName[0]}
                </Avatar>
                <IconButton
                  size="small"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: theme.palette.background.paper,
                    border: `2px solid ${theme.palette.background.paper}`,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    }
                  }}
                >
                  <PhotoCameraIcon fontSize="small" />
                </IconButton>
              </Box>
              
              <Box sx={{ flex: 1 }}>
                {!editing ? (
                  <>
                    <Typography variant="h5" fontWeight={700} gutterBottom>
                      {profileData.firstName} {profileData.lastName}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      {profileData.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {profileData.company}
                    </Typography>
                  </>
                ) : (
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        value={tempData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        value={tempData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Job Title"
                        value={tempData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Company"
                        value={tempData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                )}
              </Box>

              <Box>
                {!editing ? (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={handleEdit}
                    sx={{
                      borderColor: themeMode === 'space' 
                        ? 'rgba(138, 96, 208, 0.5)'
                        : themeMode === 'luxury'
                        ? 'rgba(201, 176, 55, 0.5)'
                        : 'rgba(61, 82, 213, 0.5)'
                    }}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      disabled={saveStatus === 'saving'}
                      size="small"
                    >
                      {saveStatus === 'saving' ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                      size="small"
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Contact Information */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Contact Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {editing ? (
                    <>
                      <TextField
                        fullWidth
                        label="Email"
                        value={tempData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        InputProps={{
                          startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Phone"
                        value={tempData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        InputProps={{
                          startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Location"
                        value={tempData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        InputProps={{
                          startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon color="action" />
                        <Typography>{profileData.email}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon color="action" />
                        <Typography>{profileData.phone}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationIcon color="action" />
                        <Typography>{profileData.location}</Typography>
                      </Box>
                    </>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Professional Details
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {editing ? (
                    <TextField
                      fullWidth
                      label="Territory"
                      value={tempData.territory}
                      onChange={(e) => handleInputChange('territory', e.target.value)}
                      InputProps={{
                        startAdornment: <BusinessIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                    />
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BusinessIcon color="action" />
                      <Typography>{profileData.territory}</Typography>
                    </Box>
                  )}
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Certifications
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {profileData.certifications.map((cert, index) => (
                        <Chip 
                          key={index} 
                          label={cert} 
                          size="small" 
                          icon={<BadgeIcon />}
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  About
                </Typography>
                {editing ? (
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Bio"
                    value={tempData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                  />
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    {profileData.bio}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Current Goals
                </Typography>
                {editing ? (
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Goals"
                    value={tempData.goals}
                    onChange={(e) => handleInputChange('goals', e.target.value)}
                  />
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    {profileData.goals}
                  </Typography>
                )}
              </Grid>
            </Grid>

            {!editing && (
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<SecurityIcon />}
                  onClick={() => setChangePasswordOpen(true)}
                >
                  Change Password
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Performance & Activity Sidebar */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Performance Stats */}
            <Paper 
              elevation={0}
              sx={{ 
                borderRadius: 3,
                border: `1px solid ${
                  themeMode === 'space' 
                    ? 'rgba(255, 255, 255, 0.08)'
                    : themeMode === 'luxury'
                    ? 'rgba(201, 176, 55, 0.3)'
                    : 'rgba(0, 0, 0, 0.06)'
                }`,
                p: 3
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUpIcon />
                Performance This Month
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {performanceStats.map((stat, index) => (
                  <Box key={index}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {stat.label}
                      </Typography>
                      <Chip 
                        label={stat.trend} 
                        size="small" 
                        color="success"
                        sx={{ height: 20, fontSize: '0.75rem' }}
                      />
                    </Box>
                    <Typography variant="h6" fontWeight={700}>
                      {stat.value}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={75} 
                      sx={{ 
                        height: 4, 
                        borderRadius: 2,
                        backgroundColor: themeMode === 'space' 
                          ? 'rgba(255, 255, 255, 0.1)'
                          : 'rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                  </Box>
                ))}
              </Box>
            </Paper>

            {/* Recent Activity */}
            <Paper 
              elevation={0}
              sx={{ 
                borderRadius: 3,
                border: `1px solid ${
                  themeMode === 'space' 
                    ? 'rgba(255, 255, 255, 0.08)'
                    : themeMode === 'luxury'
                    ? 'rgba(201, 176, 55, 0.3)'
                    : 'rgba(0, 0, 0, 0.06)'
                }`,
                p: 3
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <HistoryIcon />
                Recent Activity
              </Typography>
              <List dense>
                {recentActivity.map((activity, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {getActivityIcon(activity.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.text}
                      secondary={activity.time}
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
        </Grid>
      </Grid>

      {/* Change Password Dialog */}
      <Dialog 
        open={changePasswordOpen} 
        onClose={() => setChangePasswordOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              fullWidth
              type="password"
              label="Current Password"
              variant="outlined"
            />
            <TextField
              fullWidth
              type="password"
              label="New Password"
              variant="outlined"
            />
            <TextField
              fullWidth
              type="password"
              label="Confirm New Password"
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChangePasswordOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={() => setChangePasswordOpen(false)}>
            Update Password
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;