import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery,
  Fab,
  Zoom
} from '@mui/material';
import {
  CameraAlt as CameraIcon,
  Close as CloseIcon,
  PhotoCamera as PhotoCameraIcon,
  CheckCircle as CheckCircleIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import CameraCapture from './CameraCapture';
import CardProcessor from './CardProcessor';
import ContactReview from './ContactReview';
import { Contact } from '../../types/models';

interface BusinessCardScannerProps {
  onContactCreated?: (contact: Contact) => void;
  isPublicDemo?: boolean;
}

type ScanStep = 'camera' | 'processing' | 'review' | 'saving';

const BusinessCardScanner: React.FC<BusinessCardScannerProps> = ({ 
  onContactCreated,
  isPublicDemo = false 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<ScanStep>('camera');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<Partial<Contact> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpen = () => {
    setOpen(true);
    setStep('camera');
    setError(null);
  };

  const handleClose = () => {
    setOpen(false);
    setCapturedImage(null);
    setExtractedData(null);
    setError(null);
    setStep('camera');
  };

  const handleCapture = (imageData: string) => {
    setCapturedImage(imageData);
    setStep('processing');
    processImage(imageData);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        handleCapture(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (imageData: string) => {
    try {
      const processor = new CardProcessor();
      const data = await processor.processBusinessCard(imageData);
      setExtractedData(data);
      setStep('review');
    } catch (err) {
      setError('Failed to process business card. Please try again.');
      setStep('camera');
    }
  };

  const handleSave = async (contactData: Partial<Contact>) => {
    if (isPublicDemo) {
      setSuccess(true);
      setTimeout(() => {
        handleClose();
        setSuccess(false);
      }, 2000);
      return;
    }

    setStep('saving');
    try {
      // TODO: Implement actual save to database
      // const savedContact = await saveContact(contactData);
      // if (onContactCreated) {
      //   onContactCreated(savedContact);
      // }
      
      setSuccess(true);
      setTimeout(() => {
        handleClose();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError('Failed to save contact. Please try again.');
      setStep('review');
    }
  };

  const getStepContent = () => {
    switch (step) {
      case 'camera':
        return (
          <CameraCapture
            onCapture={handleCapture}
            onError={(err) => setError(err)}
          />
        );
      
      case 'processing':
        return (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            py: 8 
          }}>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h6" gutterBottom>
              Processing Business Card
            </Typography>
            <Typography color="text.secondary">
              Using AI to extract contact information...
            </Typography>
          </Box>
        );
      
      case 'review':
        return extractedData ? (
          <ContactReview
            data={extractedData}
            image={capturedImage}
            onSave={handleSave}
            onRetake={() => {
              setStep('camera');
              setCapturedImage(null);
              setExtractedData(null);
            }}
            isPublicDemo={isPublicDemo}
          />
        ) : null;
      
      case 'saving':
        return (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            py: 8 
          }}>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h6">
              Saving Contact...
            </Typography>
          </Box>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      {/* Floating Action Button for Mobile */}
      {isMobile ? (
        <Zoom in={true}>
          <Fab
            color="primary"
            aria-label="scan business card"
            onClick={handleOpen}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1000
            }}
          >
            <PhotoCameraIcon />
          </Fab>
        </Zoom>
      ) : (
        <Button
          variant="contained"
          startIcon={<PhotoCameraIcon />}
          onClick={handleOpen}
          sx={{ ml: 1 }}
        >
          Scan Card
        </Button>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: 'divider'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CameraIcon sx={{ mr: 1 }} />
            <Typography variant="h6">
              Business Card Scanner
            </Typography>
          </Box>
          <IconButton edge="end" color="inherit" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0, position: 'relative' }}>
          {error && (
            <Alert 
              severity="error" 
              onClose={() => setError(null)}
              sx={{ m: 2 }}
            >
              {error}
            </Alert>
          )}

          {getStepContent()}

          {/* File Upload Option */}
          {step === 'camera' && (
            <Box sx={{ 
              position: 'absolute', 
              bottom: 20, 
              left: '50%', 
              transform: 'translateX(-50%)',
              zIndex: 10
            }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
              <Button
                variant="contained"
                color="secondary"
                startIcon={<CloudUploadIcon />}
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  color: 'text.primary',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 1)'
                  }
                }}
              >
                Upload Photo
              </Button>
            </Box>
          )}
        </DialogContent>

        {step === 'review' && (
          <DialogActions sx={{ 
            borderTop: 1, 
            borderColor: 'divider',
            p: 2
          }}>
            <Button 
              onClick={() => {
                setStep('camera');
                setCapturedImage(null);
                setExtractedData(null);
              }}
            >
              Retake
            </Button>
            <Button 
              variant="contained" 
              onClick={() => extractedData && handleSave(extractedData)}
              disabled={!extractedData}
            >
              Save Contact
            </Button>
          </DialogActions>
        )}
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity="success" 
          icon={<CheckCircleIcon />}
          sx={{ width: '100%' }}
        >
          {isPublicDemo 
            ? 'Demo: Contact would be saved!' 
            : 'Contact saved successfully!'
          }
        </Alert>
      </Snackbar>
    </>
  );
};

export default BusinessCardScanner;