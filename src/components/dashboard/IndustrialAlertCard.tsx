import React, { useState } from 'react';
import { Box, Typography, IconButton, keyframes, Collapse } from '@mui/material';
import { 
  Warning, 
  ExpandMore, 
  ExpandLess,
  FlashOn,
  TrendingUp,
  AttachMoney,
  Timeline,
  AccessTime
} from '@mui/icons-material';

const alertPulse = keyframes`
  0%, 100% {
    opacity: 0.8;
    box-shadow: 0 0 20px currentColor;
  }
  50% {
    opacity: 1;
    box-shadow: 0 0 40px currentColor, 0 0 60px currentColor;
  }
`;

const dataStream = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

const staticNoise = keyframes`
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100% 100%;
  }
`;

interface IndustrialAlertCardProps {
  card: {
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    type: string;
    contactName?: string;
    companyName?: string;
    aiInsight: string;
    leadingIndicators: string[];
    confidenceScore: number;
    timeframe: string;
    actionRequired: string;
  };
  isActive: boolean;
  index: number;
}

const IndustrialAlertCard: React.FC<IndustrialAlertCardProps> = ({ card, isActive, index }) => {
  const [expanded, setExpanded] = useState(false);
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff0040';
      case 'medium': return '#ffaa00';
      case 'low': return '#00ff41';
      default: return '#666';
    }
  };

  const getTypeIcon = (type: string) => {
    if (type.includes('budget')) return <AttachMoney />;
    if (type.includes('competitor')) return <Warning />;
    if (type.includes('urgency')) return <AccessTime />;
    if (type.includes('engagement')) return <TrendingUp />;
    return <FlashOn />;
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: { xs: '100%', sm: '500px', md: '600px' },
        mx: 'auto',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderLeft: `4px solid ${getPriorityColor(card.priority)}`,
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isActive ? 'scale(1)' : 'scale(0.95)',
        opacity: isActive ? 1 : 0.7,
        cursor: 'pointer',
        animation: card.priority === 'high' ? `${alertPulse} 2s ease-in-out infinite` : 'none',
        '&:hover': {
          transform: isActive ? 'scale(1.01)' : 'scale(0.97)',
          boxShadow: `0 20px 40px rgba(0, 0, 0, 0.8), 0 0 40px ${getPriorityColor(card.priority)}40`,
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${getPriorityColor(card.priority)}, transparent)`,
          animation: `${dataStream} 3s linear infinite`,
          animationDelay: `${index * 0.5}s`,
        }
      }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Static noise overlay for high priority */}
      {card.priority === 'high' && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.03,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence baseFrequency="0.9" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.5" /%3E%3C/svg%3E")',
            backgroundSize: '100px 100px',
            animation: `${staticNoise} 0.5s steps(10) infinite`,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Alert header */}
      <Box
        sx={{
          p: 2,
          pb: 1,
          background: 'rgba(0, 0, 0, 0.3)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Priority indicator */}
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: getPriorityColor(card.priority),
              boxShadow: `0 0 10px ${getPriorityColor(card.priority)}`,
              animation: `${alertPulse} 1s ease-in-out infinite`,
            }}
          />
          
          {/* Type icon */}
          <Box
            sx={{
              color: getPriorityColor(card.priority),
              display: 'flex',
              alignItems: 'center',
              '& svg': {
                fontSize: 20,
                filter: `drop-shadow(0 0 4px ${getPriorityColor(card.priority)})`,
              }
            }}
          >
            {getTypeIcon(card.type)}
          </Box>

          {/* Alert ID */}
          <Typography
            variant="caption"
            sx={{
              fontFamily: 'monospace',
              color: '#666',
              letterSpacing: 1,
            }}
          >
            ALERT #{card.id.slice(0, 6).toUpperCase()}
          </Typography>
        </Box>

        {/* Confidence score */}
        <Box
          sx={{
            px: 1.5,
            py: 0.5,
            background: `${getPriorityColor(card.priority)}20`,
            border: `1px solid ${getPriorityColor(card.priority)}40`,
            borderRadius: 1,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontFamily: '"Orbitron", monospace',
              fontWeight: 700,
              color: getPriorityColor(card.priority),
              fontSize: '0.75rem',
            }}
          >
            {card.confidenceScore}% CONF
          </Typography>
        </Box>
      </Box>

      {/* Main content */}
      <Box sx={{ p: 2 }}>
        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"Orbitron", monospace',
            fontWeight: 700,
            fontSize: '1rem',
            color: '#fff',
            mb: 1,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          {card.title}
        </Typography>

        {/* Contact info */}
        {card.contactName && (
          <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
            <Typography
              variant="caption"
              sx={{
                fontFamily: 'monospace',
                color: '#999',
                textTransform: 'uppercase',
              }}
            >
              Target:
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontFamily: 'monospace',
                color: getPriorityColor(card.priority),
              }}
            >
              {card.contactName} {card.companyName && `@ ${card.companyName}`}
            </Typography>
          </Box>
        )}

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: '#ccc',
            mb: 2,
            lineHeight: 1.5,
          }}
        >
          {card.description}
        </Typography>

        {/* AI Analysis */}
        <Box
          sx={{
            p: 1.5,
            background: 'rgba(0, 255, 65, 0.05)',
            border: '1px solid rgba(0, 255, 65, 0.2)',
            borderRadius: 1,
            mb: 2,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontFamily: 'monospace',
              color: '#00ff41',
              display: 'block',
              mb: 0.5,
              textTransform: 'uppercase',
            }}
          >
            AI Analysis:
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'monospace',
              color: '#00ff41',
              fontSize: '0.85rem',
            }}
          >
            {card.aiInsight}
          </Typography>
        </Box>

        {/* Timeframe and action */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 1 }}>
          <Box
            sx={{
              p: 1,
              background: 'rgba(255, 0, 64, 0.05)',
              border: '1px solid rgba(255, 0, 64, 0.2)',
              borderRadius: 1,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontFamily: 'monospace',
                color: '#666',
                display: 'block',
                textTransform: 'uppercase',
                fontSize: '0.7rem',
              }}
            >
              Window:
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontFamily: 'monospace',
                color: '#ff0040',
                fontWeight: 600,
              }}
            >
              {card.timeframe}
            </Typography>
          </Box>

          <Box
            sx={{
              p: 1,
              background: 'rgba(255, 170, 0, 0.05)',
              border: '1px solid rgba(255, 170, 0, 0.2)',
              borderRadius: 1,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontFamily: 'monospace',
                color: '#666',
                display: 'block',
                textTransform: 'uppercase',
                fontSize: '0.7rem',
              }}
            >
              Priority:
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontFamily: 'monospace',
                color: '#ffaa00',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              {card.priority}
            </Typography>
          </Box>
        </Box>

        {/* Expand button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            sx={{
              color: '#666',
              '&:hover': {
                color: '#999',
              }
            }}
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>

        {/* Expanded content */}
        <Collapse in={expanded}>
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
            {/* Leading indicators */}
            <Typography
              variant="caption"
              sx={{
                fontFamily: 'monospace',
                color: '#999',
                textTransform: 'uppercase',
                display: 'block',
                mb: 1,
              }}
            >
              Signal Analysis:
            </Typography>
            <Box sx={{ mb: 2 }}>
              {card.leadingIndicators.map((indicator, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 0.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 4,
                      height: 4,
                      backgroundColor: '#00ff41',
                      borderRadius: '50%',
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: 'monospace',
                      color: '#999',
                      fontSize: '0.8rem',
                    }}
                  >
                    {indicator}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Action required */}
            <Box
              sx={{
                p: 1.5,
                background: 'rgba(255, 0, 64, 0.1)',
                border: '1px solid rgba(255, 0, 64, 0.3)',
                borderRadius: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontFamily: 'monospace',
                  color: '#ff0040',
                  textTransform: 'uppercase',
                  display: 'block',
                  mb: 0.5,
                  fontWeight: 600,
                }}
              >
                Required Action:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'monospace',
                  color: '#ff0040',
                  fontSize: '0.85rem',
                }}
              >
                {card.actionRequired}
              </Typography>
            </Box>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};

export default IndustrialAlertCard;