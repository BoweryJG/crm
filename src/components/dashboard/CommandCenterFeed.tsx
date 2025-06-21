import React from 'react';
import { Box, Typography, keyframes } from '@mui/material';
import { Circle } from '@mui/icons-material';

const typewriter = keyframes`
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
`;

const blink = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
`;

interface Activity {
  id: string;
  type: string;
  description: string;
  timeAgo: string;
}

interface CommandCenterFeedProps {
  activities: Activity[];
  title: string;
}

const CommandCenterFeed: React.FC<CommandCenterFeedProps> = ({ activities, title }) => {
  return (
    <Box
      sx={{
        height: '100%',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          background: 'rgba(0, 0, 0, 0.5)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"Orbitron", monospace',
            fontWeight: 700,
            color: '#00ff41',
            textTransform: 'uppercase',
            letterSpacing: 2,
            fontSize: '0.9rem',
          }}
        >
          {title}
        </Typography>
        
        {/* Status indicator */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#00ff41',
              boxShadow: '0 0 10px #00ff41',
              animation: `${blink} 2s ease-in-out infinite`,
            }}
          />
          <Typography
            variant="caption"
            sx={{
              fontFamily: 'monospace',
              color: '#00ff41',
              textTransform: 'uppercase',
              fontSize: '0.7rem',
            }}
          >
            Live Feed
          </Typography>
        </Box>
      </Box>

      {/* Activity feed */}
      <Box
        sx={{
          p: 2,
          height: 'calc(100% - 60px)',
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: 4,
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255, 255, 255, 0.05)',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0, 255, 65, 0.3)',
            borderRadius: 2,
          },
        }}
      >
        {activities.map((activity, index) => (
          <Box
            key={activity.id}
            sx={{
              mb: 2,
              pb: 2,
              borderBottom: index < activities.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
              animation: `${typewriter} 0.5s steps(40, end)`,
              animationDelay: `${index * 0.1}s`,
              animationFillMode: 'both',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {/* Timestamp and type */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: 'monospace',
                  color: '#666',
                  fontSize: '0.75rem',
                }}
              >
                [{new Date().toLocaleTimeString('en-US', { hour12: false })}]
              </Typography>
              
              <Typography
                variant="caption"
                sx={{
                  fontFamily: 'monospace',
                  color: '#ffaa00',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                {activity.type}
              </Typography>
              
              <Typography
                variant="caption"
                sx={{
                  fontFamily: 'monospace',
                  color: '#666',
                  fontSize: '0.7rem',
                  ml: 'auto',
                }}
              >
                {activity.timeAgo}
              </Typography>
            </Box>

            {/* Activity description */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <Circle sx={{ fontSize: 6, color: '#00ff41', mt: 0.5 }} />
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'monospace',
                  color: '#ccc',
                  fontSize: '0.85rem',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                }}
              >
                {activity.description}
              </Typography>
            </Box>
          </Box>
        ))}
        
        {/* Cursor */}
        <Box
          sx={{
            display: 'inline-block',
            width: 8,
            height: 14,
            backgroundColor: '#00ff41',
            animation: `${blink} 1s ease-in-out infinite`,
            ml: 0.5,
          }}
        />
      </Box>

      {/* Grid overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.02,
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(0,255,65,0.1) 20px, rgba(0,255,65,0.1) 21px),
            repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,255,65,0.1) 20px, rgba(0,255,65,0.1) 21px)
          `,
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
};

export default CommandCenterFeed;