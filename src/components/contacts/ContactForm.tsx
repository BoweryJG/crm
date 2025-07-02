import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Tooltip,
  Chip,
  Autocomplete
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { Contact } from '../../types/models';
import { validateField, sanitize, ValidationRules } from '../../utils/validation';
import { supabase } from '../../services/supabase/supabase';
import { useAuth } from '../../auth';
import { useAppMode } from '../../contexts/AppModeContext';
import { ValidationFeedback, ValidationSummary } from './ValidationFeedback';

interface ContactFormProps {
  contact?: Contact | null;
  onSubmit: (contact: Partial<Contact>) => Promise<void>;
  onCancel: () => void;
  mode: 'add' | 'edit';
}

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  specialty: string;
  practice_name: string;
  type: string;
  notes: string;
  tags: string[];
}

interface FormErrors {
  [key: string]: string;
}

const CONTACT_TYPES = [
  { value: 'dentist', label: 'Dentist' },
  { value: 'orthodontist', label: 'Orthodontist' },
  { value: 'oral_surgeon', label: 'Oral Surgeon' },
  { value: 'periodontist', label: 'Periodontist' },
  { value: 'endodontist', label: 'Endodontist' },
  { value: 'prosthodontist', label: 'Prosthodontist' },
  { value: 'aesthetic_doctor', label: 'Aesthetic Doctor' },
  { value: 'plastic_surgeon', label: 'Plastic Surgeon' },
  { value: 'dermatologist', label: 'Dermatologist' },
  { value: 'cosmetic_dermatologist', label: 'Cosmetic Dermatologist' },
  { value: 'nurse_practitioner', label: 'Nurse Practitioner' },
  { value: 'physician_assistant', label: 'Physician Assistant' },
  { value: 'aesthetician', label: 'Aesthetician' },
  { value: 'other', label: 'Other' }
];

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const COMMON_TAGS = [
  'VIP', 'High Value', 'New Lead', 'Follow Up',
  'Decision Maker', 'Influencer', 'Champion',
  'Hot Lead', 'Warm Lead', 'Cold Lead',
  'Dental', 'Aesthetic', 'Multi-Practice'
];

export const ContactForm: React.FC<ContactFormProps> = ({
  contact,
  onSubmit,
  onCancel,
  mode
}) => {
  const { user } = useAuth();
  const { isDemo } = useAppMode();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    first_name: contact?.first_name || '',
    last_name: contact?.last_name || '',
    email: contact?.email || '',
    phone: contact?.phone || '',
    city: contact?.city || '',
    state: contact?.state || '',
    specialty: contact?.specialty || '',
    practice_name: contact?.practice_name || '',
    type: contact?.type || 'dentist',
    notes: contact?.notes || '',
    tags: contact?.tags || []
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showValidationFeedback, setShowValidationFeedback] = useState(false);

  // Real-time validation
  useEffect(() => {
    const newErrors: FormErrors = {};
    
    touched.forEach(fieldName => {
      const value = formData[fieldName as keyof FormData];
      const validation = validateField(fieldName, value);
      
      if (!validation.valid && validation.error) {
        newErrors[fieldName] = validation.error;
      }
    });
    
    setErrors(newErrors);
  }, [formData, touched]);

  const handleChange = (field: keyof FormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    
    // Sanitize input based on field type
    let sanitizedValue = value;
    if (field === 'email') {
      sanitizedValue = sanitize.whitespace(value);
    } else if (field === 'notes') {
      sanitizedValue = sanitize.html(value);
    } else {
      sanitizedValue = sanitize.escape(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: sanitizedValue
    }));
    
    // Clear submit error when user starts typing
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleSelectChange = (field: keyof FormData) => (
    event: any
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleBlur = (field: string) => () => {
    setTouched(prev => new Set(prev).add(field));
  };

  const handleTagsChange = (event: any, newValue: string[]) => {
    setFormData(prev => ({
      ...prev,
      tags: newValue
    }));
  };

  const validateForm = (): boolean => {
    const requiredFields = ['first_name', 'last_name'];
    const newErrors: FormErrors = {};
    let isValid = true;

    // Check required fields
    requiredFields.forEach(field => {
      const value = formData[field as keyof FormData];
      if (!value || (typeof value === 'string' && !value.trim())) {
        newErrors[field] = 'This field is required';
        isValid = false;
      }
    });

    // Validate all fields
    Object.keys(formData).forEach(field => {
      const value = formData[field as keyof FormData];
      const validation = validateField(field, value);
      
      if (!validation.valid && validation.error) {
        newErrors[field] = validation.error;
        isValid = false;
      }
    });

    // Custom validations
    if (formData.email && !ValidationRules.email.pattern.test(formData.email)) {
      newErrors.email = ValidationRules.email.message;
      isValid = false;
    }

    if (formData.phone && !ValidationRules.phone.pattern.test(formData.phone)) {
      newErrors.phone = ValidationRules.phone.message;
      isValid = false;
    }


    setErrors(newErrors);
    setTouched(new Set(Object.keys(formData)));
    setShowValidationFeedback(!isValid);
    
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      setSubmitError('Please fix the errors in the form');
      return;
    }

    if (!user && !isDemo) {
      setSubmitError('You must be logged in to save contacts');
      return;
    }

    setLoading(true);
    setSubmitError(null);

    try {
      // Prepare contact data
      const contactData: Partial<Contact> = {
        first_name: sanitize.whitespace(formData.first_name),
        last_name: sanitize.whitespace(formData.last_name),
        email: formData.email ? sanitize.whitespace(formData.email.toLowerCase()) : undefined,
        phone: formData.phone ? sanitize.whitespace(formData.phone) : undefined,
        city: formData.city ? sanitize.whitespace(formData.city) : undefined,
        state: formData.state || undefined,
        specialty: formData.specialty ? sanitize.whitespace(formData.specialty) : undefined,
        practice_name: formData.practice_name ? sanitize.whitespace(formData.practice_name) : undefined,
        type: formData.type,
        notes: formData.notes ? sanitize.html(formData.notes) : undefined,
        tags: formData.tags,
        updated_at: new Date().toISOString()
      };

      // Add user_id for authenticated users
      if (user && !isDemo) {
        contactData.user_id = user.id;
      }

      // Add created_at for new contacts
      if (mode === 'add') {
        contactData.created_at = new Date().toISOString();
        contactData.overall_score = 50; // Default score
        contactData.is_starred = false;
      }

      // Determine practice type based on contact type
      let practiceType = 'dental';
      if (['aesthetic_doctor', 'plastic_surgeon', 'dermatologist', 
           'cosmetic_dermatologist', 'nurse_practitioner', 
           'physician_assistant', 'aesthetician'].includes(formData.type)) {
        practiceType = 'aesthetic';
      }
      
      await onSubmit({ ...contactData, practiceType });
    } catch (error: any) {
      console.error('Error saving contact:', error);
      setSubmitError(error.message || 'Failed to save contact. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get validation errors for feedback
  const getValidationErrors = () => {
    return Object.entries(errors).map(([field, message]) => ({
      field,
      message,
      severity: 'error' as const
    }));
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {submitError && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setSubmitError(null)}>
          {submitError}
        </Alert>
      )}

      <ValidationFeedback
        errors={getValidationErrors()}
        show={showValidationFeedback}
        onClose={() => setShowValidationFeedback(false)}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="First Name"
            value={formData.first_name}
            onChange={handleChange('first_name')}
            onBlur={handleBlur('first_name')}
            error={touched.has('first_name') && !!errors.first_name}
            helperText={touched.has('first_name') ? errors.first_name : ''}
            required
            disabled={loading}
            InputProps={{
              endAdornment: errors.first_name && (
                <InputAdornment position="end">
                  <Tooltip title={errors.first_name}>
                    <InfoIcon color="error" fontSize="small" />
                  </Tooltip>
                </InputAdornment>
              )
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Last Name"
            value={formData.last_name}
            onChange={handleChange('last_name')}
            onBlur={handleBlur('last_name')}
            error={touched.has('last_name') && !!errors.last_name}
            helperText={touched.has('last_name') ? errors.last_name : ''}
            required
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            error={touched.has('email') && !!errors.email}
            helperText={touched.has('email') ? errors.email : 'Optional but recommended'}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone"
            value={formData.phone}
            onChange={handleChange('phone')}
            onBlur={handleBlur('phone')}
            error={touched.has('phone') && !!errors.phone}
            helperText={touched.has('phone') ? errors.phone : 'Format: +1 555-0123'}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={touched.has('type') && !!errors.type}>
            <InputLabel>Contact Type</InputLabel>
            <Select
              value={formData.type}
              onChange={handleSelectChange('type')}
              onBlur={handleBlur('type')}
              label="Contact Type"
              disabled={loading}
            >
              {CONTACT_TYPES.map(type => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
            {touched.has('type') && errors.type && (
              <FormHelperText>{errors.type}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Specialty"
            value={formData.specialty}
            onChange={handleChange('specialty')}
            onBlur={handleBlur('specialty')}
            error={touched.has('specialty') && !!errors.specialty}
            helperText={touched.has('specialty') ? errors.specialty : ''}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Practice Name"
            value={formData.practice_name}
            onChange={handleChange('practice_name')}
            onBlur={handleBlur('practice_name')}
            error={touched.has('practice_name') && !!errors.practice_name}
            helperText={touched.has('practice_name') ? errors.practice_name : ''}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="City"
            value={formData.city}
            onChange={handleChange('city')}
            onBlur={handleBlur('city')}
            error={touched.has('city') && !!errors.city}
            helperText={touched.has('city') ? errors.city : ''}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={touched.has('state') && !!errors.state}>
            <InputLabel>State</InputLabel>
            <Select
              value={formData.state}
              onChange={handleSelectChange('state')}
              onBlur={handleBlur('state')}
              label="State"
              disabled={loading}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {US_STATES.map(state => (
                <MenuItem key={state} value={state}>
                  {state}
                </MenuItem>
              ))}
            </Select>
            {touched.has('state') && errors.state && (
              <FormHelperText>{errors.state}</FormHelperText>
            )}
          </FormControl>
        </Grid>


        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Notes"
            multiline
            rows={4}
            value={formData.notes}
            onChange={handleChange('notes')}
            onBlur={handleBlur('notes')}
            error={touched.has('notes') && !!errors.notes}
            helperText={touched.has('notes') ? errors.notes : `${formData.notes.length}/5000 characters`}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12}>
          <Autocomplete
            multiple
            freeSolo
            options={COMMON_TAGS}
            value={formData.tags}
            onChange={handleTagsChange}
            disabled={loading}
            renderTags={(value: readonly string[], getTagProps) =>
              value.map((option: string, index: number) => (
                <Chip variant="outlined" label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tags"
                placeholder="Add tags"
                helperText="Press Enter to add custom tags"
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={onCancel}
              startIcon={<CancelIcon />}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={loading}
            >
              {loading ? 'Saving...' : (mode === 'add' ? 'Add Contact' : 'Save Changes')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};