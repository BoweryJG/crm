import React, { useState } from 'react';
import {
  Box,
  TextField,
  Grid,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Avatar,
  Paper,
  Divider,
  Alert,
  SelectChangeEvent
} from '@mui/material';
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as WebsiteIcon,
  LinkedIn as LinkedInIcon,
  LocalOffer as TagIcon
} from '@mui/icons-material';
import { Contact } from '../../types/models';
import { BusinessCardContact } from './CardProcessor';

interface ContactReviewProps {
  data: BusinessCardContact;
  image?: string | null;
  onSave: (contact: BusinessCardContact) => void;
  onRetake: () => void;
  isPublicDemo?: boolean;
}

const ContactReview: React.FC<ContactReviewProps> = ({
  data,
  image,
  onSave,
  onRetake,
  isPublicDemo = false
}) => {
  const [formData, setFormData] = useState<BusinessCardContact>({
    ...data,
    status: 'active',
    type: data.specialization_detail === 'Aesthetic Nursing' ? 'nurse_practitioner' : 
          data.specialization_detail === 'Plastic Surgery' ? 'plastic_surgeon' :
          data.specialization_detail === 'Dermatology' ? 'dermatologist' :
          data.specialization_detail === 'Aesthetic Medicine' ? 'aesthetic_doctor' :
          data.specialization_detail === 'Orthodontics' ? 'orthodontist' :
          data.specialization_detail === 'Periodontics' ? 'periodontist' :
          data.specialization_detail === 'Oral Surgery' ? 'oral_surgeon' :
          data.specialization_detail === 'Endodontics' ? 'endodontist' :
          'dentist'
  });
  
  const [newTag, setNewTag] = useState('');

  const handleChange = (field: keyof BusinessCardContact) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  const getContactTypeOptions = () => {
    if (formData.practiceType === 'dental') {
      return [
        { value: 'dentist', label: 'General Dentist' },
        { value: 'orthodontist', label: 'Orthodontist' },
        { value: 'periodontist', label: 'Periodontist' },
        { value: 'oral_surgeon', label: 'Oral Surgeon' },
        { value: 'endodontist', label: 'Endodontist' },
        { value: 'prosthodontist', label: 'Prosthodontist' },
        { value: 'pediatric_dentist', label: 'Pediatric Dentist' }
      ];
    } else {
      return [
        { value: 'plastic_surgeon', label: 'Plastic Surgeon' },
        { value: 'dermatologist', label: 'Dermatologist' },
        { value: 'aesthetic_doctor', label: 'Aesthetic Physician' },
        { value: 'nurse_practitioner', label: 'Nurse Practitioner' },
        { value: 'physician_assistant', label: 'Physician Assistant' },
        { value: 'aesthetician', label: 'Aesthetician' }
      ];
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {isPublicDemo && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Demo Mode: This contact will not be saved to the database
        </Alert>
      )}

      {image && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.100' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Scanned Business Card
          </Typography>
          <Box sx={{ 
            maxHeight: 200, 
            overflow: 'hidden',
            borderRadius: 1,
            display: 'flex',
            justifyContent: 'center'
          }}>
            <img 
              src={image} 
              alt="Business card" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '200px',
                objectFit: 'contain' 
              }} 
            />
          </Box>
        </Paper>
      )}

      <Typography variant="h6" gutterBottom>
        Review Contact Information
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Please verify and correct any information as needed
      </Typography>

      <Box sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          {/* Name Section */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                <PersonIcon />
              </Avatar>
              <Typography variant="subtitle1" fontWeight="medium">
                Personal Information
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.first_name || ''}
                  onChange={handleChange('first_name')}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.last_name || ''}
                  onChange={handleChange('last_name')}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  value={formData.title || ''}
                  onChange={handleChange('title')}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Practice Information */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ mr: 2, bgcolor: 'secondary.main' }}>
                <BusinessIcon />
              </Avatar>
              <Typography variant="subtitle1" fontWeight="medium">
                Practice Information
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Practice/Company Name"
                  value={formData.practice_name || ''}
                  onChange={handleChange('practice_name')}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Practice Type</InputLabel>
                  <Select
                    value={formData.practiceType || 'dental'}
                    onChange={handleChange('practiceType')}
                    label="Practice Type"
                  >
                    <MenuItem value="dental">Dental</MenuItem>
                    <MenuItem value="aesthetic">Aesthetic</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Specialty</InputLabel>
                  <Select
                    value={formData.type || ''}
                    onChange={handleChange('type')}
                    label="Specialty"
                  >
                    {getContactTypeOptions().map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Contact Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={formData.email || ''}
                  onChange={handleChange('email')}
                  type="email"
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.phone || ''}
                  onChange={handleChange('phone')}
                  InputProps={{
                    startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />
                  }}
                />
              </Grid>
              {formData.website && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Website"
                    value={formData.website || ''}
                    onChange={handleChange('website' as keyof BusinessCardContact)}
                    InputProps={{
                      startAdornment: <WebsiteIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Grid>
              )}
              {formData.linkedIn && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="LinkedIn"
                    value={formData.linkedIn || ''}
                    onChange={handleChange('linkedIn' as keyof BusinessCardContact)}
                    InputProps={{
                      startAdornment: <LinkedInIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Tags */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Tags
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
              {formData.tags?.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  size="small"
                  sx={{ mb: 1 }}
                />
              ))}
            </Stack>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                placeholder="Add a tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                InputProps={{
                  startAdornment: <TagIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
              <Button variant="outlined" size="small" onClick={handleAddTag}>
                Add
              </Button>
            </Box>
          </Grid>

          {/* Notes */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Notes"
              value={formData.notes || ''}
              onChange={handleChange('notes')}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={onRetake}>
            Retake Photo
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={!formData.first_name || !formData.last_name}
          >
            {isPublicDemo ? 'Save (Demo)' : 'Save Contact'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ContactReview;