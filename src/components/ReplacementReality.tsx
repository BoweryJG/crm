import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Container, useTheme, alpha } from '@mui/material';
import { gsap } from 'gsap';

// Heartbeat Audio Component
const HeartbeatAudio: React.FC<{ isEquipped: boolean; isPlaying: boolean }> = ({ 
  isEquipped, 
  isPlaying 
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  
  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      
      if (isPlaying) {
        audio.play().catch(() => {
          // Handle autoplay restrictions
          console.log('Autoplay blocked');
        });
      } else {
        audio.pause();
      }
    }
  }, [isPlaying]);
  
  // Create heartbeat sound using Web Audio API
  useEffect(() => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    const bpm = isEquipped ? 60 : 90; // Slower for equipped, faster for unequipped
    const interval = 60000 / bpm;
    
    let heartbeatInterval: NodeJS.Timeout;
    
    const createHeartbeat = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(80, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    };
    
    if (isPlaying) {
      heartbeatInterval = setInterval(createHeartbeat, interval);
    }
    
    return () => {
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
      }
    };
  }, [isEquipped, isPlaying]);
  
  return <audio ref={audioRef} style={{ display: 'none' }} />;
};

// Harvey's Whisper Effect Component
const HarveyWhisper: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  const whisperRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (whisperRef.current) {
      gsap.to(whisperRef.current, {
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.8,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }, [isVisible]);
  
  return (
    <Box
      ref={whisperRef}
      sx={{
        position: 'absolute',
        top: '20%',
        right: '10%',
        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        color: '#000',
        padding: '12px 16px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 600,
        maxWidth: 200,
        zIndex: 3,
        opacity: 0,
        boxShadow: '0 4px 20px rgba(255, 215, 0, 0.4)',
        '&::before': {
          content: '""',
          position: 'absolute',
          bottom: '-8px',
          left: '20px',
          width: 0,
          height: 0,
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderTop: '8px solid #FFD700',
        }
      }}
    >
      "Next, ask about their current patient volume and mention the 40% efficiency gain other practices see with our new laser..."
    </Box>
  );
};

// Auto-transcription floating text
const AutoTranscription: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  const transcriptionRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState('');
  
  const transcriptionText = "Dr. Smith mentioned budget concerns... Harvey suggests highlighting ROI case studies... Follow-up scheduled automatically...";
  
  useEffect(() => {
    if (isVisible && transcriptionRef.current) {
      gsap.to(transcriptionRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out"
      });
      
      // Typewriter effect
      let i = 0;
      const typeWriter = () => {
        if (i < transcriptionText.length) {
          setText(transcriptionText.slice(0, i + 1));
          i++;
          setTimeout(typeWriter, 50);
        }
      };
      typeWriter();
    } else if (transcriptionRef.current) {
      gsap.to(transcriptionRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.3
      });
      setText('');
    }
  }, [isVisible, transcriptionText]);
  
  return (
    <Box
      ref={transcriptionRef}
      sx={{
        position: 'absolute',
        bottom: '15%',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0, 255, 255, 0.3)',
        color: '#00FFFF',
        padding: '8px 12px',
        borderRadius: '8px',
        fontSize: '11px',
        fontFamily: 'monospace',
        maxWidth: 300,
        textAlign: 'center',
        opacity: 0,
        y: 20,
        zIndex: 3,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #00FFFF, transparent)',
          animation: 'scan 2s linear infinite'
        },
        '@keyframes scan': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      }}
    >
      {text}
    </Box>
  );
};

// Sales Rep Component
const SalesRep: React.FC<{ 
  isEquipped: boolean; 
  isHovered: boolean; 
  onHover: (hovered: boolean) => void 
}> = ({ isEquipped, isHovered, onHover }) => {
  const repRef = useRef<HTMLDivElement>(null);
  const [isHeartbeatPlaying, setIsHeartbeatPlaying] = useState(false);
  
  useEffect(() => {
    if (repRef.current) {
      const tl = gsap.timeline();
      
      if (isEquipped) {
        // Equipped rep - confident, glowing
        tl.to(repRef.current, {
          filter: 'brightness(1.2) saturate(1.3)',
          duration: 0.5
        });
      } else {
        // Unequipped rep - stressed, muted
        tl.to(repRef.current, {
          filter: 'brightness(0.7) saturate(0.6) contrast(0.8)',
          duration: 0.5
        });
      }
    }
  }, [isEquipped]);
  
  useEffect(() => {
    // Start heartbeat when component mounts
    const timer = setTimeout(() => {
      setIsHeartbeatPlaying(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const baseColor = isEquipped ? '#00FF88' : '#666';
  const neuralColor = isEquipped ? '#00FFFF' : 'transparent';
  
  return (
    <Box
      ref={repRef}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: isEquipped ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: isEquipped ? 'scale(1.05)' : 'none'
        }
      }}
    >
      <HeartbeatAudio 
        isEquipped={isEquipped} 
        isPlaying={isHeartbeatPlaying} 
      />
      
      {/* Neural Network Connections (only for equipped) */}
      {isEquipped && (
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
              width: '2px',
              background: `linear-gradient(90deg, transparent, ${neuralColor}, transparent)`,
              animation: 'neuralPulse 3s ease-in-out infinite',
            },
            '&::before': {
              height: '60%',
              top: '20%',
              left: '30%',
              transform: 'rotate(45deg)',
            },
            '&::after': {
              height: '40%',
              top: '30%',
              right: '25%',
              transform: 'rotate(-30deg)',
              animationDelay: '1s',
            },
            '@keyframes neuralPulse': {
              '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
              '50%': { opacity: 1, transform: 'scale(1.1)' }
            }
          }}
        />
      )}
      
      {/* Sales Rep Avatar */}
      <Box
        sx={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: isEquipped 
            ? `linear-gradient(135deg, ${alpha('#00FF88', 0.8)}, ${alpha('#00FFFF', 0.6)})` 
            : `linear-gradient(135deg, ${alpha('#666', 0.8)}, ${alpha('#999', 0.6)})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48px',
          mb: 2,
          boxShadow: isEquipped 
            ? `0 0 30px ${alpha('#00FF88', 0.5)}` 
            : `0 0 10px ${alpha('#666', 0.3)}`,
          border: `2px solid ${baseColor}`,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        👨‍💼
        
        {/* Glowing effect for equipped rep */}
        {isEquipped && (
          <Box
            sx={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: `conic-gradient(from 0deg, transparent, ${alpha('#00FFFF', 0.3)}, transparent)`,
              animation: 'rotate 4s linear infinite',
              '@keyframes rotate': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              }
            }}
          />
        )}
      </Box>
      
      {/* Office Environment */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          mb: 2
        }}
      >
        {/* Desk items */}
        <Box sx={{ fontSize: '24px', opacity: isEquipped ? 0.8 : 1 }}>
          {isEquipped ? '💻' : '📄'}
        </Box>
        <Box sx={{ fontSize: '24px', opacity: isEquipped ? 0.8 : 1 }}>
          {isEquipped ? '📱' : '📝'}
        </Box>
        <Box sx={{ fontSize: '24px', opacity: isEquipped ? 0.8 : 1 }}>
          {isEquipped ? '🎯' : '📊'}
        </Box>
      </Box>
      
      {/* Status indicators */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: baseColor,
            fontSize: '14px',
            fontWeight: 600
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: baseColor,
              animation: isEquipped ? 'pulse 2s infinite' : 'fastPulse 1s infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 0.5, transform: 'scale(1)' },
                '50%': { opacity: 1, transform: 'scale(1.2)' }
              },
              '@keyframes fastPulse': {
                '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
                '50%': { opacity: 1, transform: 'scale(1.3)' }
              }
            }}
          />
          {isEquipped ? 'AI-Powered' : 'Manual Process'}
        </Box>
        
        <Typography
          variant="caption"
          sx={{
            color: isEquipped ? '#00FFFF' : '#999',
            textAlign: 'center',
            fontSize: '12px'
          }}
        >
          {isEquipped ? 'Focus on Closing' : 'Drowning in Admin'}
        </Typography>
      </Box>
      
      {/* Harvey's Whisper (only for equipped rep) */}
      {isEquipped && (
        <HarveyWhisper isVisible={isHovered} />
      )}
      
      {/* Auto-transcription (only for equipped rep) */}
      {isEquipped && (
        <AutoTranscription isVisible={isHovered} />
      )}
    </Box>
  );
};

// Main Component
const ReplacementReality: React.FC = () => {
  const theme = useTheme();
  const [hoveredEquipped, setHoveredEquipped] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate title
            gsap.fromTo(
              titleRef.current,
              { opacity: 0, y: 50 },
              { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
            );
            
            // Animate copy with delay
            gsap.fromTo(
              copyRef.current,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "power3.out" }
            );
          }
        });
      },
      { threshold: 0.3 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <Box
      ref={sectionRef}
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0e17 0%, #1a1f35 100%)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        py: 8
      }}
    >
      <Container maxWidth="xl">
        {/* Section Title */}
        <Box ref={titleRef} sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
              fontWeight: 900,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #FF6B6B 0%, #FFD93D 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            The Replacement Reality
          </Typography>
          
          <Typography
            variant="h6"
            sx={{
              color: alpha('#fff', 0.8),
              maxWidth: 800,
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            AI isn't replacing humans. Humans using AI are replacing humans who don't.
          </Typography>
        </Box>
        
        {/* Split Screen Comparison */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 4,
            mb: 6,
            minHeight: 500
          }}
        >
          {/* Unequipped Rep */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, rgba(100, 116, 139, 0.1) 0%, rgba(71, 85, 105, 0.1) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(100, 116, 139, 0.3)',
              borderRadius: 3,
              p: 4,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: '#94A3B8',
                mb: 3,
                textAlign: 'center',
                fontWeight: 600
              }}
            >
              Traditional Rep
            </Typography>
            
            <SalesRep
              isEquipped={false}
              isHovered={false}
              onHover={() => {}}
            />
          </Box>
          
          {/* Equipped Rep */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 255, 255, 0.1) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 255, 136, 0.3)',
              borderRadius: 3,
              p: 4,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: '#00FF88',
                mb: 3,
                textAlign: 'center',
                fontWeight: 600
              }}
            >
              Harvey-Equipped Rep
            </Typography>
            
            <SalesRep
              isEquipped={true}
              isHovered={hoveredEquipped}
              onHover={setHoveredEquipped}
            />
          </Box>
        </Box>
        
        {/* Key Copy */}
        <Box ref={copyRef} sx={{ textAlign: 'center', maxWidth: 900, mx: 'auto' }}>
          <Typography
            variant="h6"
            sx={{
              color: '#fff',
              lineHeight: 1.8,
              mb: 3,
              fontSize: { xs: '1.1rem', md: '1.3rem' }
            }}
          >
            While you're making calls, they have Harvey whispering coaching in their ear.{' '}
            <Box component="span" sx={{ color: '#00FFFF', fontWeight: 700 }}>
              Auto transcription.
            </Box>{' '}
            <Box component="span" sx={{ color: '#FFD700', fontWeight: 700 }}>
              Auto follow-ups.
            </Box>{' '}
            <Box component="span" sx={{ color: '#00FF88', fontWeight: 700 }}>
              Auto reminders.
            </Box>
          </Typography>
          
          <Typography
            variant="h6"
            sx={{
              color: '#fff',
              lineHeight: 1.8,
              mb: 3,
              fontSize: { xs: '1.1rem', md: '1.3rem' }
            }}
          >
            They focus on closing deals—not admin tasks.
          </Typography>
          
          <Typography
            variant="h5"
            sx={{
              color: '#FF6B6B',
              fontWeight: 700,
              fontSize: { xs: '1.3rem', md: '1.5rem' }
            }}
          >
            How can you compete against someone using this against you?
          </Typography>
        </Box>
      </Container>
      
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: -1,
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            borderRadius: '50%',
            filter: 'blur(60px)',
            opacity: 0.1,
          },
          '&::before': {
            width: '400px',
            height: '400px',
            background: '#FF6B6B',
            top: '20%',
            left: '10%',
            animation: 'float 15s ease-in-out infinite',
          },
          '&::after': {
            width: '300px',
            height: '300px',
            background: '#00FF88',
            bottom: '20%',
            right: '10%',
            animation: 'float 15s ease-in-out infinite reverse',
          },
          '@keyframes float': {
            '0%, 100%': { transform: 'translate(0, 0)' },
            '25%': { transform: 'translate(30px, -30px)' },
            '50%': { transform: 'translate(-30px, -60px)' },
            '75%': { transform: 'translate(-60px, -30px)' },
          }
        }}
      />
    </Box>
  );
};

export default ReplacementReality;