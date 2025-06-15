import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  useTheme, 
  alpha, 
  Container,
  IconButton,
  SwipeableDrawer 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useAuth } from '../auth';
import { isAdminUser } from '../config/adminUsers';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// Simplified Mobile Feature Card
interface MobileFeatureCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

const MobileFeatureCard: React.FC<MobileFeatureCardProps> = ({ title, value, icon }) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        background: alpha('#1a1f35', 0.8),
        backdropFilter: 'blur(10px)',
        border: '1px solid',
        borderColor: alpha('#8860D0', 0.3),
        borderRadius: 2,
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        width: '100%'
      }}
    >
      <Box sx={{ color: '#8860D0' }}>
        {icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="h6"
          sx={{
            background: 'linear-gradient(45deg, #8860D0 0%, #5CE1E6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700
          }}
        >
          {value}
        </Typography>
        <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
          {title}
        </Typography>
      </Box>
    </Box>
  );
};

// Mobile Landing Page Component
const LuxuryLandingMobile: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showUploadDrawer, setShowUploadDrawer] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Admin auto-redirect
  useEffect(() => {
    if (user && isAdminUser(user.email)) {
      navigate('/');
    }
  }, [user, navigate]);
  
  useEffect(() => {
    // Mobile-optimized animations
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    }
  }, []);
  
  const handleEnterCRM = () => {
    gsap.to(heroRef.current, {
      opacity: 0,
      scale: 0.98,
      duration: 0.3,
      onComplete: () => navigate('/')
    });
  };
  
  return (
    <Box
      ref={heroRef}
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0a0e17 0%, #161b2c 50%, #1a1f35 100%)',
        position: 'relative',
        overflow: 'hidden',
        pb: 8
      }}
    >
      {/* Simplified Background Effect */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(136, 96, 208, 0.3) 0%, transparent 70%)',
          filter: 'blur(60px)'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -100,
          left: -100,
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(92, 225, 230, 0.3) 0%, transparent 70%)',
          filter: 'blur(60px)'
        }}
      />
      
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1, pt: 6 }}>
        {/* Logo & Title */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: '3rem',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #8860D0 0%, #5CE1E6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}
          >
            SPHERE OS
          </Typography>
          
          <Typography
            variant="h6"
            sx={{
              color: alpha('#fff', 0.8),
              fontWeight: 300,
              letterSpacing: '0.05em',
              fontSize: '1rem'
            }}
          >
            QUANTUM CRM INTELLIGENCE
          </Typography>
          
          <Typography
            variant="body2"
            sx={{
              color: alpha('#fff', 0.6),
              mt: 2,
              px: 2
            }}
          >
            Elite sales intelligence for professionals who never miss quota
          </Typography>
        </Box>
        
        {/* Feature Cards */}
        <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <MobileFeatureCard 
            title="Pipeline Value" 
            value="$4.2M" 
            icon={<Typography variant="h5">💎</Typography>} 
          />
          <MobileFeatureCard 
            title="AI Insights" 
            value="24/7" 
            icon={<Typography variant="h5">🧠</Typography>} 
          />
          <MobileFeatureCard 
            title="Conversion Rate" 
            value="87%" 
            icon={<Typography variant="h5">📈</Typography>} 
          />
        </Box>
        
        {/* CTA Buttons */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleEnterCRM}
            sx={{
              background: 'linear-gradient(45deg, #8860D0 30%, #5CE1E6 90%)',
              color: '#fff',
              fontSize: '1.1rem',
              fontWeight: 700,
              py: 1.5,
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(136, 96, 208, 0.4)',
              '&:active': {
                transform: 'scale(0.98)'
              }
            }}
          >
            ENTER COMMAND ROOM
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            fullWidth
            startIcon={<CloudUploadIcon />}
            onClick={() => setShowUploadDrawer(true)}
            sx={{
              borderColor: alpha('#8860D0', 0.5),
              color: '#8860D0',
              fontSize: '1rem',
              py: 1.5,
              borderRadius: 2,
              '&:active': {
                transform: 'scale(0.98)'
              }
            }}
          >
            Clean Your Contacts
          </Button>
        </Box>
        
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            textAlign: 'center',
            mt: 3,
            color: alpha('#fff', 0.4)
          }}
        >
          Reserved for Elite Reps Only
        </Typography>
      </Container>
      
      {/* Upload Drawer (placeholder for now) */}
      <SwipeableDrawer
        anchor="bottom"
        open={showUploadDrawer}
        onClose={() => setShowUploadDrawer(false)}
        onOpen={() => setShowUploadDrawer(true)}
        sx={{
          '& .MuiDrawer-paper': {
            background: '#1a1f35',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            borderTop: '1px solid',
            borderColor: alpha('#8860D0', 0.3)
          }
        }}
      >
        <Box sx={{ p: 3, pb: 4 }}>
          <Box
            sx={{
              width: 40,
              height: 4,
              background: alpha('#fff', 0.3),
              borderRadius: 2,
              mx: 'auto',
              mb: 3
            }}
          />
          <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
            Contact Enrichment Coming Soon
          </Typography>
          <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
            Upload your CSV or Excel file to clean, deduplicate, and enrich your contacts with AI-powered insights.
          </Typography>
        </Box>
      </SwipeableDrawer>
    </Box>
  );
};

export default LuxuryLandingMobile;