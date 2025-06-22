import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, IconButton, CircularProgress, Alert, Button } from '@mui/material';
import { ChevronLeft, ChevronRight, Close, Refresh } from '@mui/icons-material';
import { AIInsightsService, AIInsight } from '../../services/ai/insightsService';
import { useAppMode } from '../../contexts/AppModeContext';
import IndustrialAlertCard from './IndustrialAlertCard';

// Map AIInsight to NowCardData for backward compatibility
interface NowCardData extends AIInsight {
  // AIInsight already has all the fields we need
}

const mockCardsData: NowCardData[] = [
  { 
    id: '1', 
    title: '🔥 HOT LEAD: Dr. Sarah Chen - Implant System', 
    description: 'Dr. Chen from Advanced Dental Care has shown 7 strong purchase signals for the new implant system.', 
    priority: 'high', 
    type: 're_engagement', 
    contactName: 'Dr. Sarah Chen', 
    companyName: 'Advanced Dental Care',
    aiInsight: 'AI detected 94% purchase probability. Practice mentioned patient backlog for implant procedures and insurance reimbursement improvements.',
    leadingIndicators: [
      'Opened implant system pricing email 5x in 2 days',
      'Downloaded clinical study on osseointegration rates',
      'Asked about FDA 510(k) clearance documentation',
      'Mentioned "3 implant cases scheduled next month"',
      'Forwarded specs to oral surgeon partner'
    ],
    confidenceScore: 94,
    timeframe: 'Next 24-48 hours',
    actionRequired: 'Schedule in-office demo with clinical specialist'
  },
  { 
    id: '2', 
    title: '⚡ COMPETITOR THREAT: Dr. Rodriguez - Botox', 
    description: 'Dr. Rodriguez comparing Botox suppliers - Allergan mentioned multiple times.', 
    priority: 'high', 
    type: 'competitor_threat', 
    contactName: 'Dr. Mike Rodriguez', 
    companyName: 'Aesthetic Medicine Associates',
    aiInsight: 'Practice evaluating alternative suppliers. 72% close rate when providing clinical efficacy comparisons within 6 hours.',
    leadingIndicators: [
      'Asked about unit pricing vs Allergan 3x',
      'Comparing reconstitution protocols',
      'Requested patient satisfaction studies',
      'Mentioned "current supplier backorder issues"',
      'Inquired about loyalty program benefits'
    ],
    confidenceScore: 87,
    timeframe: 'Next 6 hours critical',
    actionRequired: 'Send competitive clinical comparison + volume discount'
  },
  { 
    id: '3', 
    title: '💰 BUDGET APPROVED: Dr. Walsh - Laser System', 
    description: 'Budget approved for aesthetic laser system at Walsh Dermatology.', 
    priority: 'high', 
    type: 'budget_approved', 
    contactName: 'Dr. Jennifer Walsh', 
    companyName: 'Walsh Dermatology',
    aiInsight: 'Practice secured financing for capital equipment. Insurance billing codes for new procedures confirmed.',
    leadingIndicators: [
      'Asked for "final pricing with service contract"',
      'Requested lease vs purchase comparison',
      'Confirmed CPT codes 15780-15783 coverage',
      'Added practice administrator to thread',
      'Mentioned "Q1 capital equipment budget"'
    ],
    confidenceScore: 91,
    timeframe: 'This week',
    actionRequired: 'Send contract with training package included'
  },
  { 
    id: '4', 
    title: '🎯 DEMO FOLLOW-UP: Dr. Thompson - Filler', 
    description: 'High engagement during Juvederm product demonstration.', 
    priority: 'medium', 
    type: 'demo_followup', 
    contactName: 'Dr. Alex Thompson', 
    companyName: 'Thompson Plastic Surgery',
    aiInsight: 'Surgeon showed advanced injection technique interest. 78% conversion when following up with hands-on training offer.',
    leadingIndicators: [
      'Attended full 45-min clinical demo',
      'Asked about cross-linking technology',
      'Requested before/after photo database',
      'Inquired about advanced training courses',
      'Mentioned specific patient cases'
    ],
    confidenceScore: 78,
    timeframe: 'Next 24 hours',
    actionRequired: 'Offer exclusive masterclass with KOL'
  },
  { 
    id: '5', 
    title: '⏰ URGENCY SIGNAL: Dr. Kim - Surgical Supplies', 
    description: 'Urgent need for implant surgical kits detected.', 
    priority: 'medium', 
    type: 'urgency_signal', 
    contactName: 'Dr. David Kim', 
    companyName: 'Kim Oral Surgery',
    aiInsight: 'Practice has scheduled complex cases requiring specific instrumentation. 73% close rate with expedited delivery.',
    leadingIndicators: [
      'Mentioned "full arch case next week" 3x',
      'Requested overnight shipping options',
      'Asked about loaner instrument sets',
      'Escalated to office manager',
      'Increased communication frequency 400%'
    ],
    confidenceScore: 73,
    timeframe: 'Next 5 days',
    actionRequired: 'Offer express delivery + loaner kit'
  },
  { 
    id: '6', 
    title: '🔄 RE-ENGAGEMENT: Dr. Park - Aesthetic Devices', 
    description: 'Previously cold lead showing renewed interest in laser technology.', 
    priority: 'medium', 
    type: 're_engagement', 
    contactName: 'Dr. Lisa Park', 
    companyName: 'Park Medical Aesthetics',
    aiInsight: 'Practice expanding aesthetic services after 3-month silence. New physician partner may drive equipment needs.',
    leadingIndicators: [
      'Opened 4 product emails this week',
      'Downloaded IPL vs laser comparison guide',
      'Visited ROI calculator 3 times',
      'LinkedIn shows "added aesthetic physician"',
      'Clicked on financing options'
    ],
    confidenceScore: 65,
    timeframe: 'Next 2 weeks',
    actionRequired: 'Send new physician onboarding package'
  },
  { 
    id: '7', 
    title: '📊 RESEARCH PHASE: Dr. Wilson - Aligners', 
    description: 'Orthodontist researching clear aligner systems extensively.', 
    priority: 'low', 
    type: 'sentiment_shift', 
    contactName: 'Dr. Tom Wilson', 
    companyName: 'Wilson Orthodontics',
    aiInsight: 'Early-stage research behavior for clear aligner adoption. Practice comparing multiple systems.',
    leadingIndicators: [
      'Reviewed aligner pricing models',
      'Downloaded case submission guides',
      'Watched 3 technique videos',
      'Compared lab turnaround times',
      'Read patient satisfaction studies'
    ],
    confidenceScore: 58,
    timeframe: 'Next 30 days',
    actionRequired: 'Invite to aligner certification course'
  }
];

const getPriorityColor = (priority: NowCardData['priority']) => {
  switch (priority) {
    case 'high':
      return '#ff0040';
    case 'medium':
      return '#ffaa00';
    case 'low':
      return '#00ff41';
    default:
      return '#666666';
  }
};

const NowCard: React.FC<{ card: NowCardData; onDismiss: (id: string) => void; isActive: boolean }> = ({ card, onDismiss, isActive }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Paper
      elevation={isActive ? 16 : 4}
      sx={(theme) => ({
        p: 3,
        minWidth: 380,
        maxWidth: 420,
        minHeight: expanded ? 500 : 280,
        maxHeight: expanded ? 600 : 280,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
        borderLeft: `6px solid ${getPriorityColor(card.priority)}`,
        transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
        transform: isActive ? 'scale(1)' : 'scale(0.95)',
        opacity: isActive ? 1 : 0.8,
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        '&:hover': {
          transform: isActive ? 'scale(1.02)' : 'scale(0.97)',
        },
        // Enhanced snake animation
        '&::before': isActive ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 'inherit',
          padding: '2px',
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
          backgroundSize: '200% 100%',
          animation: 'snakeBorder 3s linear infinite',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'xor',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          pointerEvents: 'none',
        } : {},
        '@keyframes snakeBorder': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
      })}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Confidence Score Badge */}
      <Box
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          background: `linear-gradient(45deg, ${getPriorityColor(card.priority)}, ${getPriorityColor(card.priority)}88)`,
          color: 'white',
          px: 1.5,
          py: 0.5,
          borderRadius: 2,
          fontSize: '0.75rem',
          fontWeight: 'bold',
          boxShadow: 2,
        }}
      >
        {card.confidenceScore}% AI
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, pr: 6 }}>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            fontWeight: 'bold',
            fontSize: '1.1rem',
            lineHeight: 1.3,
            mb: 1,
            color: 'text.primary'
          }}
        >
          {card.title}
        </Typography>
        
        {card.contactName && (
          <Typography 
            variant="subtitle2" 
            sx={{ 
              color: 'text.secondary',
              fontWeight: 500,
              mb: 1
            }}
          >
            {card.contactName} {card.companyName && ` • ${card.companyName}`}
          </Typography>
        )}
        
        <Typography 
          variant="body2" 
          sx={{ 
            mb: 2,
            color: 'text.primary',
            lineHeight: 1.4
          }}
        >
          {card.description}
        </Typography>

        {/* AI Insight */}
        <Box
          sx={{
            background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
            p: 2,
            borderRadius: 2,
            border: (theme) => `1px solid ${theme.palette.primary.main}30`,
            mb: 2,
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              fontStyle: 'italic',
              color: 'text.primary',
              fontWeight: 500
            }}
          >
            🤖 {card.aiInsight}
          </Typography>
        </Box>

        {/* Expanded Content */}
        {expanded && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
              Leading Indicators:
            </Typography>
            <Box sx={{ mb: 2 }}>
              {card.leadingIndicators.map((indicator, index) => (
                <Typography 
                  key={index}
                  variant="body2" 
                  sx={{ 
                    display: 'flex',
                    alignItems: 'flex-start',
                    mb: 0.5,
                    color: 'text.secondary'
                  }}
                >
                  <Box 
                    component="span" 
                    sx={{ 
                      color: 'success.main', 
                      mr: 1,
                      fontSize: '0.8rem'
                    }}
                  >
                    ✓
                  </Box>
                  {indicator}
                </Typography>
              ))}
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  Timeframe
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                  ⏱️ {card.timeframe}
                </Typography>
              </Box>
            </Box>
            
            <Box
              sx={{
                background: (theme) => `linear-gradient(45deg, ${theme.palette.success.main}15, ${theme.palette.success.main}25)`,
                p: 2,
                borderRadius: 2,
                border: (theme) => `1px solid ${theme.palette.success.main}50`,
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'success.main', mb: 0.5 }}>
                Recommended Action:
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
                🎯 {card.actionRequired}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* Bottom Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography 
            variant="caption" 
            sx={{ 
              textTransform: 'uppercase', 
              color: getPriorityColor(card.priority),
              fontWeight: 'bold',
              fontSize: '0.7rem'
            }}
          >
            {card.priority} Priority
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            • Click to {expanded ? 'collapse' : 'expand'}
          </Typography>
        </Box>
        <IconButton 
          size="small" 
          onClick={(e) => {
            e.stopPropagation();
            onDismiss(card.id);
          }} 
          aria-label="Dismiss card"
          sx={{
            color: 'text.secondary',
            '&:hover': {
              background: 'error.main',
              color: 'white',
            }
          }}
        >
          <Close fontSize="small" />
        </IconButton>
      </Box>
    </Paper>
  );
};


const NowCardsStack: React.FC = () => {
  const { isDemo } = useAppMode();
  const [cards, setCards] = useState<NowCardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load insights on component mount
  useEffect(() => {
    loadInsights();
  }, [isDemo]);

  const loadInsights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (isDemo) {
        // In demo mode, use mock data with medical/dental context
        setCards(mockCardsData);
      } else {
        // In production mode, fetch real insights from linguistics analysis
        const insights = await AIInsightsService.generateInsights(10);
        if (insights.length === 0) {
          // If no real insights, show a subset of mock data as examples
          setCards(mockCardsData.slice(0, 3));
        } else {
          setCards(insights);
        }
      }
    } catch (err) {
      console.error('Error loading insights:', err);
      setError('Failed to load insights. Using demo data.');
      setCards(mockCardsData.slice(0, 3));
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadInsights();
  };

  const handleDismiss = (id: string) => {
    const cardToRemoveIndex = cards.findIndex(c => c.id === id);
    const newCards = cards.filter(card => card.id !== id);
    setCards(newCards);

    if (newCards.length === 0) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(prevCurrentIndex => {
        let nextIndex = prevCurrentIndex;
        if (cardToRemoveIndex < prevCurrentIndex) {
          nextIndex = Math.max(0, prevCurrentIndex - 1);
        } else if (cardToRemoveIndex === prevCurrentIndex) {
          // If the dismissed card was the current one, try to stay at the same index
          // or move to the new last card if the current index is now out of bounds.
          nextIndex = Math.min(prevCurrentIndex, newCards.length - 1);
        }
        // Ensure index is always within bounds of the new array
        return Math.max(0, Math.min(nextIndex, newCards.length - 1));
      });
    }
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      width: '100%',
      maxWidth: { xs: '100%', md: '1400px' },
      mx: 'auto',
      p: { xs: 2, md: 3 }
    }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        width: '100%',
        mb: 3,
        borderBottom: '2px solid',
        borderColor: 'divider',
        pb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 'bold', 
              color: 'primary.main',
              fontFamily: '"Orbitron", monospace',
              textTransform: 'uppercase',
              letterSpacing: 2,
            }}
          >
            Alert Monitor
          </Typography>
          <IconButton 
            onClick={handleRefresh} 
            size="small"
            disabled={loading}
            sx={{ 
              color: 'primary.main',
              '&:hover': { backgroundColor: 'primary.main', color: 'white' }
            }}
          >
            <Refresh />
          </IconButton>
        </Box>
        
        {/* Alert Stats Summary */}
        {!loading && cards.length > 0 && (
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#ff0040', fontWeight: 'bold' }}>
                {cards.filter(c => c.priority === 'high').length}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                HIGH
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#ffaa00', fontWeight: 'bold' }}>
                {cards.filter(c => c.priority === 'medium').length}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                MEDIUM
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#00ff41', fontWeight: 'bold' }}>
                {cards.filter(c => c.priority === 'low').length}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                LOW
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {error && (
        <Alert severity="warning" sx={{ mb: 2, maxWidth: 450 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
          <CircularProgress size={48} />
          <Typography sx={{ mt: 2, color: 'text.secondary' }}>
            Analyzing linguistics data...
          </Typography>
        </Box>
      ) : cards.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8, 
          px: 4,
          maxWidth: 450,
          background: (theme) => theme.palette.action.hover,
          borderRadius: 3,
          border: (theme) => `2px dashed ${theme.palette.divider}`
        }}>
          <Typography variant="h6" gutterBottom sx={{ color: 'text.secondary' }}>
            No Active Insights
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            {isDemo 
              ? "In demo mode, insights are shown as examples. Switch to production mode to see real call analysis."
              : "Great job! No urgent actions needed right now. Insights will appear here as new calls are analyzed."
            }
          </Typography>
          <IconButton 
            onClick={handleRefresh}
            sx={{ 
              color: 'primary.main',
              border: (theme) => `1px solid ${theme.palette.primary.main}`,
              '&:hover': { backgroundColor: 'primary.main', color: 'white' }
            }}
          >
            <Refresh />
          </IconButton>
        </Box>
      ) : (
        <>
          {/* Main Content Area */}
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '280px 1fr 280px' },
            gap: 3,
            width: '100%',
            alignItems: 'start'
          }}>
            {/* Left Panel - Alert Queue */}
            <Box sx={{ 
              display: { xs: 'none', lg: 'block' },
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: 2,
              p: 2,
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <Typography variant="subtitle2" sx={{ 
                fontFamily: '"Orbitron", monospace',
                color: 'text.secondary',
                mb: 2,
                textTransform: 'uppercase'
              }}>
                Alert Queue
              </Typography>
              {cards.map((card, idx) => (
                <Box
                  key={card.id}
                  onClick={() => setCurrentIndex(idx)}
                  sx={{
                    p: 1.5,
                    mb: 1,
                    borderRadius: 1,
                    cursor: 'pointer',
                    background: idx === currentIndex ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    border: '1px solid',
                    borderColor: idx === currentIndex ? getPriorityColor(card.priority) : 'transparent',
                    transition: 'all 0.2s',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(255, 255, 255, 0.2)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Box sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: getPriorityColor(card.priority)
                    }} />
                    <Typography variant="caption" sx={{ 
                      fontWeight: 'bold',
                      color: getPriorityColor(card.priority)
                    }}>
                      {card.priority.toUpperCase()}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ 
                    fontSize: '0.8rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    color: idx === currentIndex ? 'text.primary' : 'text.secondary'
                  }}>
                    {card.title.replace(/[🔥⚡💰🎯⏰🔄📊]/g, '').trim()}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Center - Active Card */}
            <Box sx={{ 
              position: 'relative',
              width: '100%',
              maxWidth: { xs: '100%', md: '600px' },
              mx: 'auto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: { xs: 'auto', md: '650px' }
            }}>
              <Box
                sx={{
                  width: '100%',
                  opacity: 0,
                  animation: 'fadeIn 0.5s forwards',
                  '@keyframes fadeIn': {
                    from: { opacity: 0, transform: 'translateY(20px)' },
                    to: { opacity: 1, transform: 'translateY(0)' }
                  }
                }}
              >
                <IndustrialAlertCard 
                  card={cards[currentIndex]} 
                  isActive={true} 
                  index={currentIndex} 
                />
              </Box>
            </Box>

            {/* Right Panel - Actions & Insights */}
            <Box sx={{ 
              display: { xs: 'none', lg: 'block' },
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: 2,
              p: 2,
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <Typography variant="subtitle2" sx={{ 
                fontFamily: '"Orbitron", monospace',
                color: 'text.secondary',
                mb: 2,
                textTransform: 'uppercase'
              }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ 
                    borderColor: getPriorityColor(cards[currentIndex].priority),
                    color: getPriorityColor(cards[currentIndex].priority),
                    '&:hover': {
                      backgroundColor: `${getPriorityColor(cards[currentIndex].priority)}20`,
                      borderColor: getPriorityColor(cards[currentIndex].priority)
                    }
                  }}
                >
                  Contact Now
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ 
                    borderColor: 'text.secondary',
                    color: 'text.secondary'
                  }}
                >
                  Schedule Follow-up
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ 
                    borderColor: 'text.secondary',
                    color: 'text.secondary'
                  }}
                >
                  View Full Analysis
                </Button>
              </Box>
              
              <Typography variant="subtitle2" sx={{ 
                fontFamily: '"Orbitron", monospace',
                color: 'text.secondary',
                mt: 3,
                mb: 2,
                textTransform: 'uppercase'
              }}>
                AI Confidence
              </Typography>
              <Box sx={{ 
                position: 'relative',
                height: 8,
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 4,
                overflow: 'hidden'
              }}>
                <Box sx={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: `${cards[currentIndex].confidenceScore}%`,
                  background: `linear-gradient(90deg, 
                    ${getPriorityColor(cards[currentIndex].priority)}80,
                    ${getPriorityColor(cards[currentIndex].priority)}
                  )`,
                  transition: 'width 0.5s ease'
                }} />
              </Box>
              <Typography variant="h4" sx={{ 
                fontFamily: '"Orbitron", monospace',
                color: getPriorityColor(cards[currentIndex].priority),
                mt: 1,
                textAlign: 'center'
              }}>
                {cards[currentIndex].confidenceScore}%
              </Typography>
            </Box>
          </Box>
          {/* Navigation Controls */}
          {cards.length > 1 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              mt: 3,
              gap: 2
            }}>
              <IconButton 
                onClick={handlePrev} 
                aria-label="Previous card"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                <ChevronLeft />
              </IconButton>
              
              {/* Card Indicators */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                {cards.map((_, idx) => (
                  <Box
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: idx === currentIndex 
                        ? getPriorityColor(cards[currentIndex].priority) 
                        : 'rgba(255, 255, 255, 0.2)',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      '&:hover': {
                        backgroundColor: idx === currentIndex 
                          ? getPriorityColor(cards[currentIndex].priority)
                          : 'rgba(255, 255, 255, 0.4)'
                      }
                    }}
                  />
                ))}
              </Box>
              
              <IconButton 
                onClick={handleNext} 
                aria-label="Next card"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                <ChevronRight />
              </IconButton>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default NowCardsStack;
