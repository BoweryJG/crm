import React from 'react';
import { Box, Typography, keyframes } from '@mui/material';
import { Warning, Flag, Timer } from '@mui/icons-material';

const urgentPulse = keyframes`
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
`;

interface Task {
  id: string;
  type: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
}

interface MissionBriefingCardProps {
  tasks: Task[];
  title: string;
}

const MissionBriefingCard: React.FC<MissionBriefingCardProps> = ({ tasks, title }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return '#ff0040';
      case 'Medium': return '#ffaa00';
      case 'Low': return '#00ff41';
      default: return '#666';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High': return <Warning sx={{ fontSize: 16 }} />;
      case 'Medium': return <Flag sx={{ fontSize: 16 }} />;
      case 'Low': return <Timer sx={{ fontSize: 16 }} />;
      default: return null;
    }
  };

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
            color: '#ffaa00',
            textTransform: 'uppercase',
            letterSpacing: 2,
            fontSize: '0.9rem',
          }}
        >
          {title}
        </Typography>
        
        {/* Mission count */}
        <Box
          sx={{
            px: 2,
            py: 0.5,
            background: 'rgba(255, 170, 0, 0.1)',
            border: '1px solid rgba(255, 170, 0, 0.3)',
            borderRadius: 1,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontFamily: 'monospace',
              color: '#ffaa00',
              fontWeight: 600,
            }}
          >
            {tasks.length} ACTIVE
          </Typography>
        </Box>
      </Box>

      {/* Tasks list */}
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
            background: 'rgba(255, 170, 0, 0.3)',
            borderRadius: 2,
          },
        }}
      >
        {tasks.map((task, index) => (
          <Box
            key={task.id}
            sx={{
              mb: 2,
              p: 2,
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderLeft: `3px solid ${getPriorityColor(task.priority)}`,
              borderRadius: 1,
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(0, 0, 0, 0.5)',
                borderLeftWidth: 5,
                transform: 'translateX(2px)',
              },
            }}
          >
            {/* Priority warning stripe for high priority */}
            {task.priority === 'High' && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 40,
                  height: 40,
                  background: `repeating-linear-gradient(
                    -45deg,
                    transparent,
                    transparent 5px,
                    ${getPriorityColor(task.priority)}20 5px,
                    ${getPriorityColor(task.priority)}20 10px
                  )`,
                  animation: `${urgentPulse} 2s ease-in-out infinite`,
                }}
              />
            )}

            {/* Task header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Box
                sx={{
                  color: getPriorityColor(task.priority),
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {getPriorityIcon(task.priority)}
              </Box>
              
              <Typography
                variant="caption"
                sx={{
                  fontFamily: 'monospace',
                  color: getPriorityColor(task.priority),
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                }}
              >
                {task.priority} PRIORITY
              </Typography>
              
              <Typography
                variant="caption"
                sx={{
                  fontFamily: 'monospace',
                  color: '#666',
                  fontSize: '0.7rem',
                }}
              >
                #{task.id.slice(0, 6).toUpperCase()}
              </Typography>
              
              <Typography
                variant="caption"
                sx={{
                  ml: 'auto',
                  fontFamily: 'monospace',
                  color: task.dueDate === 'Today' ? '#ff0040' : 
                         task.dueDate === 'Tomorrow' ? '#ffaa00' : 
                         '#666',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                }}
              >
                {task.dueDate}
              </Typography>
            </Box>

            {/* Task type */}
            <Typography
              variant="caption"
              sx={{
                fontFamily: 'monospace',
                color: '#999',
                textTransform: 'uppercase',
                display: 'block',
                mb: 0.5,
                fontSize: '0.7rem',
              }}
            >
              Mission: {task.type}
            </Typography>

            {/* Task description */}
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'monospace',
                color: '#ccc',
                fontSize: '0.85rem',
                lineHeight: 1.4,
              }}
            >
              {task.description}
            </Typography>

            {/* Status indicator */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: getPriorityColor(task.priority),
                boxShadow: `0 0 10px ${getPriorityColor(task.priority)}`,
                animation: task.priority === 'High' ? `${urgentPulse} 1s ease-in-out infinite` : 'none',
              }}
            />
          </Box>
        ))}
      </Box>

      {/* Tactical grid overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.02,
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(255,170,0,0.1) 30px, rgba(255,170,0,0.1) 31px),
            repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(255,170,0,0.1) 30px, rgba(255,170,0,0.1) 31px)
          `,
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
};

export default MissionBriefingCard;