import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  LinearProgress,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { 
  processPublicContactUpload, 
  generateSessionId,
  getEnrichmentPreview,
  calculatePotentialROI
} from '../../services/publicContactService';
import { EnrichedContact } from '../../services/contactEnrichmentService';

interface ContactUploaderProps {
  onComplete?: (sessionId: string) => void;
}

const steps = ['Upload File', 'Preview & Enrich', 'Payment'];

export const ContactUploader: React.FC<ContactUploaderProps> = ({ onComplete }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [rawContacts, setRawContacts] = useState<any[]>([]);
  const [enrichedContacts, setEnrichedContacts] = useState<EnrichedContact[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [roi, setRoi] = useState<any>(null);
  const [sessionId] = useState(generateSessionId());
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
        complete: (results) => {
          setRawContacts(results.data);
          setActiveStep(1);
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
          setRawContacts(jsonData);
          setActiveStep(1);
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
  
  // Process and enrich contacts
  const processContacts = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const result = await processPublicContactUpload(rawContacts, sessionId);
      setEnrichedContacts(result.enriched_data);
      setStats(result.enrichment_metadata);
      
      // Calculate ROI
      const roiData = calculatePotentialROI(result.enrichment_metadata);
      setRoi(roiData);
      
      setActiveStep(2);
    } catch (err: any) {
      setError(`Processing error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Proceed to payment
  const proceedToPayment = () => {
    if (onComplete) {
      onComplete(sessionId);
    }
  };
  
  // Get preview contacts
  const previewContacts = enrichedContacts.length > 0 
    ? getEnrichmentPreview(enrichedContacts, 10)
    : [];
  
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #8860D0 30%, #5CE1E6 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}
        >
          Contact List Enrichment
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Upload your contacts, get them cleaned, enriched, and categorized instantly
        </Typography>
      </Box>
      
      {/* Stepper */}
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
      
      {/* Step 1: Upload */}
      {activeStep === 0 && (
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
      )}
      
      {/* Step 2: Preview & Enrich */}
      {activeStep === 1 && (
        <Box>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                File: {file?.name}
              </Typography>
              <Chip 
                label={`${rawContacts.length} contacts`} 
                color="primary" 
                icon={<DataUsageIcon />}
              />
            </Box>
            
            {!isProcessing && !enrichedContacts.length && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Ready to clean, deduplicate, and enrich your {rawContacts.length} contacts
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={processContacts}
                  startIcon={<DataUsageIcon />}
                >
                  Process & Enrich Contacts
                </Button>
              </Box>
            )}
            
            {isProcessing && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress size={60} sx={{ mb: 3 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Processing your contacts...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cleaning, deduplicating, and enriching with industry data
                </Typography>
                <LinearProgress sx={{ mt: 3, maxWidth: 400, mx: 'auto' }} />
              </Box>
            )}
          </Paper>
          
          {/* Preview Results */}
          {enrichedContacts.length > 0 && !isProcessing && (
            <>
              {/* Stats */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Enrichment Results
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                  <Box>
                    <Typography variant="h4" color="primary">{stats.total}</Typography>
                    <Typography variant="body2" color="text.secondary">Enriched Contacts</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4" color="error">{stats.duplicatesRemoved}</Typography>
                    <Typography variant="body2" color="text.secondary">Duplicates Removed</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4" color="success.main">{stats.averageScore}</Typography>
                    <Typography variant="body2" color="text.secondary">Avg Quality Score</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ color: '#8860D0' }}>{stats.aestheticCount}</Typography>
                    <Typography variant="body2" color="text.secondary">Aesthetic Practices</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ color: '#5CE1E6' }}>{stats.dentalCount}</Typography>
                    <Typography variant="body2" color="text.secondary">Dental Practices</Typography>
                  </Box>
                </Box>
              </Paper>
              
              {/* Preview Table */}
              <Paper sx={{ mb: 3 }}>
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="h6">
                    Preview (First 10 Contacts)
                  </Typography>
                </Box>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Specialty</TableCell>
                        <TableCell>Industry</TableCell>
                        <TableCell>Score</TableCell>
                        <TableCell>Tier</TableCell>
                        <TableCell>Est. Value</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {previewContacts.map((contact, idx) => (
                        <TableRow key={idx}>
                          <TableCell>
                            {contact.first_name} {contact.last_name}
                          </TableCell>
                          <TableCell>{contact.specialty}</TableCell>
                          <TableCell>
                            <Chip 
                              label={contact.industry} 
                              size="small"
                              color={contact.industry === 'aesthetic' ? 'secondary' : 'primary'}
                            />
                          </TableCell>
                          <TableCell>{contact.overall_score}</TableCell>
                          <TableCell>
                            <Chip 
                              label={contact.lead_tier} 
                              size="small"
                              color={contact.lead_tier === 'A' ? 'success' : 'default'}
                            />
                          </TableCell>
                          <TableCell>${contact.estimated_deal_value.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
              
              <Box sx={{ textAlign: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => setActiveStep(2)}
                  startIcon={<AttachMoneyIcon />}
                >
                  Save My Enriched Contacts - $0.99
                </Button>
              </Box>
            </>
          )}
        </Box>
      )}
      
      {/* Step 3: Payment */}
      {activeStep === 2 && roi && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Your Contacts Are Ready!
          </Typography>
          
          <Box sx={{ my: 4, p: 3, backgroundColor: alpha(theme.palette.success.main, 0.1), borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Potential ROI from These Contacts
            </Typography>
            <Typography variant="h3" color="success.main" gutterBottom>
              ${roi.totalPotentialValue.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Based on {roi.topTierLeads} high-quality leads with ~{roi.estimatedClosedDeals} potential closed deals
            </Typography>
          </Box>
          
          <Typography variant="body1" sx={{ mb: 4 }}>
            Store your {stats.total} enriched contacts forever for just <strong>$0.99</strong>
          </Typography>
          
          <Button
            variant="contained"
            size="large"
            color="success"
            onClick={proceedToPayment}
            sx={{ px: 6, py: 2 }}
          >
            Complete Payment - $0.99
          </Button>
          
          <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary' }}>
            One-time payment • No subscription required • Download anytime
          </Typography>
        </Paper>
      )}
    </Box>
  );
};