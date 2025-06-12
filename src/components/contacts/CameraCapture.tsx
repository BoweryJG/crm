import React, { useRef, useEffect, useState } from 'react';
import {
  Box,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import {
  CameraAlt as CameraIcon,
  FlipCameraIos as FlipCameraIcon,
  FlashOn as FlashOnIcon,
  FlashOff as FlashOffIcon
} from '@mui/icons-material';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onError: (error: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onError }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [hasFlash, setHasFlash] = useState(false);
  const [flashOn, setFlashOn] = useState(false);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [facingMode]);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      
      // Stop any existing stream
      stopCamera();

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Check for flash support
        const videoTrack = stream.getVideoTracks()[0];
        const capabilities = videoTrack.getCapabilities() as any;
        setHasFlash(capabilities?.torch || false);
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Camera error:', err);
      onError('Unable to access camera. Please check your permissions.');
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const toggleFlash = async () => {
    if (!hasFlash || !streamRef.current) return;

    try {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      await (videoTrack as any).applyConstraints({
        advanced: [{ torch: !flashOn }]
      });
      setFlashOn(!flashOn);
    } catch (err) {
      console.error('Flash toggle error:', err);
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64
    const imageData = canvas.toDataURL('image/jpeg', 0.95);
    onCapture(imageData);
  };

  return (
    <Box sx={{ 
      position: 'relative', 
      width: '100%', 
      height: isMobile ? '100vh' : '600px',
      bgcolor: 'black'
    }}>
      {isLoading && (
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10
        }}>
          <CircularProgress size={60} />
        </Box>
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />

      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
      />

      {/* Guide Overlay */}
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: '400px',
        aspectRatio: '1.75',
        border: '3px solid',
        borderColor: theme.palette.primary.main,
        borderRadius: 2,
        pointerEvents: 'none'
      }}>
        <Box sx={{
          position: 'absolute',
          top: -40,
          left: '50%',
          transform: 'translateX(-50%)',
          bgcolor: 'rgba(0, 0, 0, 0.7)',
          px: 2,
          py: 1,
          borderRadius: 1
        }}>
          <Typography variant="body2" sx={{ color: 'white' }}>
            Align business card within frame
          </Typography>
        </Box>

        {/* Corner markers */}
        {[
          { top: -3, left: -3 },
          { top: -3, right: -3 },
          { bottom: -3, left: -3 },
          { bottom: -3, right: -3 }
        ].map((position, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              width: 30,
              height: 30,
              borderWidth: 3,
              borderStyle: 'solid',
              borderColor: theme.palette.primary.main,
              ...position,
              ...(position.top !== undefined && position.left !== undefined && {
                borderBottom: 0,
                borderRight: 0
              }),
              ...(position.top !== undefined && position.right !== undefined && {
                borderBottom: 0,
                borderLeft: 0
              }),
              ...(position.bottom !== undefined && position.left !== undefined && {
                borderTop: 0,
                borderRight: 0
              }),
              ...(position.bottom !== undefined && position.right !== undefined && {
                borderTop: 0,
                borderLeft: 0
              })
            }}
          />
        ))}
      </Box>

      {/* Controls */}
      <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        p: 3,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        bgcolor: 'rgba(0, 0, 0, 0.5)'
      }}>
        <IconButton
          onClick={toggleCamera}
          sx={{ color: 'white' }}
        >
          <FlipCameraIcon />
        </IconButton>

        <IconButton
          onClick={captureImage}
          sx={{
            color: 'white',
            bgcolor: theme.palette.primary.main,
            width: 70,
            height: 70,
            '&:hover': {
              bgcolor: theme.palette.primary.dark
            }
          }}
        >
          <CameraIcon sx={{ fontSize: 35 }} />
        </IconButton>

        <IconButton
          onClick={toggleFlash}
          disabled={!hasFlash}
          sx={{ color: flashOn ? theme.palette.warning.main : 'white' }}
        >
          {flashOn ? <FlashOnIcon /> : <FlashOffIcon />}
        </IconButton>
      </Box>
    </Box>
  );
};

export default CameraCapture;