import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  alpha,
  Grid
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { supabase } from '../../services/supabase/supabase';
import { Contact } from '../../types/models';
import { useAuth } from '../../auth';
import { useAppMode } from '../../contexts/AppModeContext';

interface ContactImportModalProps {
  open: boolean;
  onClose: () => void;
  onImportComplete: (importedCount: number) => void;
}

interface ParsedContact {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
  specialty?: string;
  practice_name?: string;
  [key: string]: any;
}

const steps = ['Upload File', 'Map Fields', 'Preview', 'Import'];

export const ContactImportModal: React.FC<ContactImportModalProps> = ({
  open,
  onClose,
  onImportComplete
}) => {
  const theme = useTheme();
  const { user } = useAuth();
  const { isDemo } = useAppMode();
  const [activeStep, setActiveStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedContact[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [importStats, setImportStats] = useState({
    total: 0,
    imported: 0,
    skipped: 0,
    errors: 0
  });

  // Reset state when modal closes
  const handleClose = () => {
    setActiveStep(0);
    setFile(null);
    setParsedData([]);
    setHeaders([]);
    setFieldMapping({});
    setError(null);
    setImportProgress(0);
    setImportStats({ total: 0, imported: 0, skipped: 0, errors: 0 });
    onClose();
  };

  // File drop handler
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFile(file);
    setError(null);

    // Parse the file
    if (file.name.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data.length > 0) {
            setParsedData(results.data as ParsedContact[]);
            setHeaders(Object.keys(results.data[0] as Record<string, any>));
            autoMapFields(Object.keys(results.data[0] as Record<string, any>));
            setActiveStep(1);
          } else {
            setError('No data found in CSV file');
          }
        },
        error: (err) => {
          setError(`CSV parsing error: ${err.message}`);
        }
      });
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          if (jsonData.length > 0) {
            setParsedData(jsonData as ParsedContact[]);
            setHeaders(Object.keys(jsonData[0] as Record<string, any>));
            autoMapFields(Object.keys(jsonData[0] as Record<string, any>));
            setActiveStep(1);
          } else {
            setError('No data found in Excel file');
          }
        } catch (err: any) {
          setError(`Excel parsing error: ${err.message}`);
        }
      };
      reader.readAsBinaryString(file);
    } else {
      setError('Please upload a CSV or Excel file');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1
  });

  // Auto-map fields based on common patterns
  const autoMapFields = (headers: string[]) => {
    const mapping: Record<string, string> = {};
    const fieldPatterns = {
      first_name: /^(first[_\s]?name|fname|given[_\s]?name)$/i,
      last_name: /^(last[_\s]?name|lname|surname|family[_\s]?name)$/i,
      email: /^(email|e-mail|email[_\s]?address)$/i,
      phone: /^(phone|telephone|mobile|cell|contact[_\s]?number)$/i,
      city: /^(city|location|place)$/i,
      state: /^(state|province|region)$/i,
      specialty: /^(specialty|specialization|type|role|profession)$/i,
      practice_name: /^(practice|practice[_\s]?name|company|organization|clinic)$/i
    };

    headers.forEach(header => {
      for (const [field, pattern] of Object.entries(fieldPatterns)) {
        if (pattern.test(header)) {
          mapping[field] = header;
          break;
        }
      }
    });

    setFieldMapping(mapping);
  };

  // Process and prepare data for import
  const prepareDataForImport = (): Partial<Contact>[] => {
    return parsedData.map(row => {
      const contact: Partial<Contact> = {
        first_name: row[fieldMapping.first_name] || 'Unknown',
        last_name: row[fieldMapping.last_name] || 'Contact',
        email: row[fieldMapping.email] || null,
        phone: row[fieldMapping.phone] || null,
        city: row[fieldMapping.city] || null,
        state: row[fieldMapping.state] || null,
        specialty: row[fieldMapping.specialty] || null,
        type: 'imported',
        overall_score: 50,
        is_starred: false,
        tags: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Clean up phone numbers
      if (contact.phone) {
        contact.phone = contact.phone.replace(/[^\d+]/g, '');
      }

      return contact;
    });
  };

  // Import contacts to database
  const importContacts = async () => {
    setIsProcessing(true);
    setError(null);
    setImportProgress(0);

    const preparedData = prepareDataForImport();
    const batchSize = 100;
    const totalBatches = Math.ceil(preparedData.length / batchSize);
    
    let imported = 0;
    let skipped = 0;
    let errors = 0;

    try {
      // Track all uploads in private admin table (regardless of auth status)
      const uploadMetadata = {
        user_email: user?.email || 'anonymous',
        upload_date: new Date().toISOString(),
        total_contacts: preparedData.length,
        file_name: file?.name || 'unknown',
        is_demo: isDemo,
        is_authenticated: !!user,
        ip_address: 'client', // You could get actual IP from request headers
        user_agent: navigator.userAgent
      };
      
      // Log upload attempt to admin tracking table
      await supabase
        .from('contact_upload_logs')
        .insert(uploadMetadata);

      // If not authenticated, just show preview - don't save contacts
      if (!user) {
        // Simulate processing for demo
        for (let i = 0; i < totalBatches; i++) {
          setImportProgress(((i + 1) / totalBatches) * 100);
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        // Show what would happen
        imported = preparedData.length;
        
        // Mark as preview only
        setImportStats({
          total: preparedData.length,
          imported: 0,
          skipped: 0,
          errors: 0
        });
        
        setActiveStep(3);
        setError('Sign up to save your cleaned contacts!');
        return;
      }

      // For authenticated users, save to their contacts
      const tableName = 'contacts';
      console.log(`Importing to ${tableName} table for user: ${user.email}`);

      for (let i = 0; i < totalBatches; i++) {
        const batch = preparedData.slice(i * batchSize, (i + 1) * batchSize);
        
        // Add user reference
        const batchWithUser = batch.map(contact => ({
          ...contact,
          user_id: user.id,
          import_date: new Date().toISOString()
        }));
        
        // Insert batch - using upsert to avoid duplicates based on email
        const { data, error } = await supabase
          .from(tableName)
          .upsert(batchWithUser, { 
            onConflict: 'email',
            ignoreDuplicates: true 
          })
          .select();

        if (error) {
          console.error(`Batch import error:`, error);
          errors += batch.length;
        } else {
          imported += data?.length || 0;
          skipped += batch.length - (data?.length || 0);
        }

        setImportProgress(((i + 1) / totalBatches) * 100);
      }

      setImportStats({
        total: preparedData.length,
        imported,
        skipped,
        errors
      });

      setActiveStep(3);
      onImportComplete(imported);
    } catch (err: any) {
      setError(`Import error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Download template
  const downloadTemplate = () => {
    const template = [
      {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 555-0123',
        city: 'New York',
        state: 'NY',
        specialty: 'General Dentistry',
        practice_name: 'Smile Dental Clinic'
      }
    ];

    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contact_import_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Import Contacts
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Step 0: Upload File */}
        {activeStep === 0 && (
          <Box>
            <Paper
              {...getRootProps()}
              sx={{
                p: 6,
                textAlign: 'center',
                border: '2px dashed',
                borderColor: isDragActive ? 'primary.main' : 'divider',
                backgroundColor: isDragActive ? alpha(theme.palette.primary.main, 0.05) : 'background.paper',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: alpha(theme.palette.primary.main, 0.02)
                }
              }}
            >
              <input {...getInputProps()} />
              <CloudUploadIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                {isDragActive ? 'Drop your file here' : 'Drag & drop your contact file'}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                or click to select a CSV or Excel file
              </Typography>
              <Button variant="contained" size="large">
                Choose File
              </Button>
            </Paper>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                startIcon={<DownloadIcon />}
                onClick={downloadTemplate}
                variant="outlined"
              >
                Download Template
              </Button>
            </Box>
          </Box>
        )}

        {/* Step 1: Map Fields */}
        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Map Your Fields
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              We've automatically mapped some fields. Please verify and adjust as needed.
            </Typography>

            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>CRM Field</TableCell>
                    <TableCell>Your File Column</TableCell>
                    <TableCell>Sample Data</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {['first_name', 'last_name', 'email', 'phone', 'city', 'state', 'specialty', 'practice_name'].map((field) => (
                    <TableRow key={field}>
                      <TableCell>
                        <Typography fontWeight={500}>
                          {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <select
                          value={fieldMapping[field] || ''}
                          onChange={(e) => setFieldMapping({ ...fieldMapping, [field]: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '8px',
                            borderRadius: '4px',
                            border: '1px solid #ccc'
                          }}
                        >
                          <option value="">-- Not mapped --</option>
                          {headers.map(header => (
                            <option key={header} value={header}>{header}</option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell>
                        {fieldMapping[field] && parsedData[0] && (
                          <Typography variant="caption" color="text.secondary">
                            {parsedData[0][fieldMapping[field]] || 'N/A'}
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button onClick={() => setActiveStep(0)}>Back</Button>
              <Button
                variant="contained"
                onClick={() => setActiveStep(2)}
                disabled={!fieldMapping.first_name || !fieldMapping.last_name}
              >
                Next: Preview
              </Button>
            </Box>
          </Box>
        )}

        {/* Step 2: Preview */}
        {activeStep === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Preview Import
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Showing first 10 contacts of {parsedData.length} total
            </Typography>

            <TableContainer component={Paper} sx={{ mb: 3, maxHeight: 400 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Specialty</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {prepareDataForImport().slice(0, 10).map((contact, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{contact.first_name} {contact.last_name}</TableCell>
                      <TableCell>{contact.email || '-'}</TableCell>
                      <TableCell>{contact.phone || '-'}</TableCell>
                      <TableCell>{[contact.city, contact.state].filter(Boolean).join(', ') || '-'}</TableCell>
                      <TableCell>{contact.specialty || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                • Duplicate emails will be skipped automatically<br />
                • Missing names will be set to "Unknown Contact"<br />
                • All contacts will be imported with a default score of 50<br />
                {!user && '• Sign up to save your cleaned contacts permanently'}
                {user && '• Contacts will be saved to your private CRM'}
              </Typography>
            </Alert>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1">
                Ready to import <strong>{parsedData.length}</strong> contacts
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button onClick={() => setActiveStep(1)}>Back</Button>
                <Button
                  variant="contained"
                  onClick={importContacts}
                  disabled={isProcessing}
                >
                  Start Import
                </Button>
              </Box>
            </Box>

            {isProcessing && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Importing contacts... {Math.round(importProgress)}%
                </Typography>
                <LinearProgress variant="determinate" value={importProgress} />
              </Box>
            )}
          </Box>
        )}

        {/* Step 3: Results */}
        {activeStep === 3 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            {!user ? (
              // Non-authenticated preview results
              <>
                <WarningIcon sx={{ fontSize: 64, color: 'warning.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Contact Cleaning Preview
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  We successfully cleaned and enriched your {importStats.total} contacts!
                </Typography>
                
                <Alert severity="warning" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
                  <Typography variant="body2">
                    To save these cleaned contacts to your CRM, please sign up or log in.
                  </Typography>
                </Alert>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button variant="outlined" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={() => {
                      handleClose();
                      // You could trigger the login modal here
                    }}
                  >
                    Sign Up to Save Contacts
                  </Button>
                </Box>
              </>
            ) : (
              // Authenticated import results
              <>
                <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Import Complete!
                </Typography>

                <Box sx={{ my: 4 }}>
                  <Grid container spacing={2} justifyContent="center">
                    <Grid item>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="primary">
                          {importStats.imported}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Imported
                        </Typography>
                      </Box>
                    </Grid>
                    {importStats.skipped > 0 && (
                      <Grid item>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h4" color="warning.main">
                            {importStats.skipped}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Skipped (Duplicates)
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                    {importStats.errors > 0 && (
                      <Grid item>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h4" color="error">
                            {importStats.errors}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Errors
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Box>

                <Button variant="contained" onClick={handleClose} size="large">
                  Done
                </Button>
              </>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

