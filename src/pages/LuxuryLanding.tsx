import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, useTheme, alpha, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useAuth } from '../auth';
import { isAdminUser } from '../config/adminUsers';

// Animated Orb Component (CSS-based alternative to 3D)
const AnimatedOrb: React.FC<{ size?: number; color?: string; delay?: number }> = ({ 
  size = 200, 
  color = '#8860D0',
  delay = 0 
}) => {
  const orbRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (orbRef.current) {
      gsap.to(orbRef.current, {
        scale: 1.2,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay
      });
    }
  }, [delay]);
  
  return (
    <Box
      ref={orbRef}
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle at 30% 30%, ${alpha(color, 0.8)}, ${alpha(color, 0.4)})`,
        boxShadow: `0 0 60px ${alpha(color, 0.6)}, 0 0 120px ${alpha(color, 0.3)}`,
        filter: 'blur(0.5px)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '30%',
          height: '30%',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.3)',
          filter: 'blur(10px)'
        }
      }}
    />
  );
};

// Feature Preview Card
interface FeatureCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, value, subtitle, delay }) => {
  const theme = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { 
          opacity: 0, 
          y: 50,
          scale: 0.9
        },
        { 
          opacity: 1, 
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: delay,
          ease: "power3.out"
        }
      );
    }
  }, [delay]);
  
  return (
    <Box
      ref={cardRef}
      sx={{
        background: alpha('#1a1f35', 0.8),
        backdropFilter: 'blur(20px)',
        border: '1px solid',
        borderColor: alpha('#8860D0', 0.3),
        borderRadius: 3,
        p: 3,
        minWidth: 200,
        textAlign: 'center',
        opacity: 0,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          borderColor: alpha('#8860D0', 0.6),
          boxShadow: `0 10px 30px ${alpha('#8860D0', 0.3)}`,
        }
      }}
    >
      <Typography
        variant="h3"
        sx={{
          background: 'linear-gradient(45deg, #8860D0 0%, #5CE1E6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 700,
          mb: 1
        }}
      >
        {value}
      </Typography>
      <Typography variant="h6" sx={{ color: '#fff', mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
        {subtitle}
      </Typography>
    </Box>
  );
};

// Main Landing Page Component
const LuxuryLanding: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showFeatures, setShowFeatures] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  // Admin auto-redirect
  useEffect(() => {
    if (user && isAdminUser(user.email)) {
      // Admins skip landing and go straight to dashboard
      navigate('/');
    }
  }, [user, navigate]);
  
  useEffect(() => {
    // Initial animations
    const tl = gsap.timeline();
    
    if (titleRef.current) {
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
      );
    }
    
    if (ctaRef.current) {
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" },
        "-=0.4"
      );
    }
    
    // Show features after delay
    setTimeout(() => setShowFeatures(true), 1500);
  }, []);
  
  const handleEnterCRM = () => {
    // Transition animation
    gsap.to(heroRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 0.5,
      onComplete: () => navigate('/')
    });
  };
  
  const features = [
    { title: "Aesthetic Pipeline", value: "$7.8M", subtitle: "Med Spa & Derm", delay: 0.2 },
    { title: "Avg Deal Size", value: "$185K", subtitle: "Plastic Surgery", delay: 0.4 },
    { title: "Market Coverage", value: "92%", subtitle: "Top Practices", delay: 0.6 },
    { title: "ROI Delivered", value: "412%", subtitle: "Med Spa Average", delay: 0.8 },
    { title: "Tech Database", value: "500+", subtitle: "Aesthetic Devices", delay: 1.0 },
    { title: "Response Time", value: "<1s", subtitle: "AI Powered", delay: 1.2 }
  ];
  
  return (
    <Box
      ref={heroRef}
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0e17 0%, #161b2c 50%, #1a1f35 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {/* Animated Orbs Background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'absolute', top: '10%', left: '20%' }}>
          <AnimatedOrb size={300} color="#8860D0" delay={0} />
        </Box>
        <Box sx={{ position: 'absolute', top: '50%', right: '15%' }}>
          <AnimatedOrb size={250} color="#5CE1E6" delay={0.5} />
        </Box>
        <Box sx={{ position: 'absolute', bottom: '20%', left: '40%' }}>
          <AnimatedOrb size={200} color="#44CFCB" delay={1} />
        </Box>
      </Box>
      
      {/* Content */}
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          py: 8
        }}
      >
        {/* Main Title */}
        <Box ref={titleRef} sx={{ mb: 6 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '3rem', md: '5rem', lg: '6rem' },
              fontWeight: 900,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #8860D0 0%, #5CE1E6 50%, #44CFCB 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 80px rgba(136, 96, 208, 0.5)',
              mb: 2
            }}
          >
            SPHERE OS
          </Typography>
          
          <Typography
            variant="h4"
            sx={{
              color: alpha('#fff', 0.9),
              fontWeight: 300,
              letterSpacing: '0.1em',
              mb: 1
            }}
          >
            QUANTUM CRM INTELLIGENCE
          </Typography>
          
          <Typography
            variant="h6"
            sx={{
              color: alpha('#fff', 0.7),
              fontWeight: 300,
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            The operating system for elite aesthetic & dental device sales. 
            Dominate the $50B medical aesthetics market.
          </Typography>
        </Box>
        
        {/* CTA Button */}
        <Box ref={ctaRef} sx={{ mb: 8 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleEnterCRM}
            sx={{
              background: 'linear-gradient(45deg, #8860D0 30%, #5CE1E6 90%)',
              color: '#fff',
              fontSize: '1.2rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              px: 6,
              py: 2,
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(136, 96, 208, 0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(45deg, #8860D0 10%, #5CE1E6 90%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 30px rgba(136, 96, 208, 0.6)',
              }
            }}
          >
            ENTER COMMAND ROOM
          </Button>
          
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              color: alpha('#fff', 0.5),
              fontSize: '0.9rem'
            }}
          >
            Reserved for Elite Reps Only
          </Typography>
        </Box>
        
        {/* Feature Cards */}
        {showFeatures && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(6, 1fr)'
              },
              gap: 3,
              mt: 8
            }}
          >
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </Box>
        )}
      </Container>
      
      {/* Ambient Particles Effect */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            filter: 'blur(80px)',
            opacity: 0.3,
          },
          '&::before': {
            background: '#8860D0',
            top: '20%',
            left: '10%',
            animation: 'float 20s ease-in-out infinite',
          },
          '&::after': {
            background: '#5CE1E6',
            bottom: '20%',
            right: '10%',
            animation: 'float 20s ease-in-out infinite reverse',
          },
          '@keyframes float': {
            '0%, 100%': { transform: 'translate(0, 0)' },
            '25%': { transform: 'translate(50px, -50px)' },
            '50%': { transform: 'translate(-50px, -100px)' },
            '75%': { transform: 'translate(-100px, -50px)' },
          }
        }}
      />
    </Box>
  );
};

export default LuxuryLanding;