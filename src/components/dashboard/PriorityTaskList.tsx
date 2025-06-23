// Priority Task List - Mobile-optimized task display
// Shows tasks with priority badges and swipe actions

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Checkbox,
  alpha,
  useTheme,
  SwipeableDrawer,
  Button,
} from '@mui/material';
import {
  Warning as HighPriorityIcon,
  Flag as MediumPriorityIcon,
  Timer as LowPriorityIcon,
  CheckCircle as CompleteIcon,
  Schedule as ScheduleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { ThemeAccents, getPriorityColor } from './ThemeAwareComponents';

interface Task {
  id: string;
  type: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  completed?: boolean;
}

interface PriorityTaskListProps {
  tasks: Task[];
  themeAccents: ThemeAccents;
}

const PriorityTaskList: React.FC<PriorityTaskListProps> = ({ tasks, themeAccents }) => {
  const theme = useTheme();
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const toggleComplete = (taskId: string) => {
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
    }
    setCompletedTasks(newCompleted);
  };
  
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High':
        return <HighPriorityIcon sx={{ fontSize: 16 }} />;
      case 'Medium':
        return <MediumPriorityIcon sx={{ fontSize: 16 }} />;
      case 'Low':
        return <LowPriorityIcon sx={{ fontSize: 16 }} />;
      default:
        return undefined;
    }
  };
  
  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays} days`;
  };
  
  // Sort tasks by priority
  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
  
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {sortedTasks.map((task) => {
          const isCompleted = completedTasks.has(task.id);
          const priorityColor = getPriorityColor(task.priority, themeAccents);
          const daysUntilDue = getDaysUntilDue(task.dueDate);
          const isOverdue = daysUntilDue === 'Overdue';
          
          return (
            <Box
              key={task.id}
              onClick={() => {
                setSelectedTask(task);
                setDrawerOpen(true);
              }}
              sx={{
                p: 1.5,
                borderRadius: 1,
                background: alpha(theme.palette.background.paper, 0.5),
                border: `1px solid ${alpha(priorityColor, 0.2)}`,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                opacity: isCompleted ? 0.6 : 1,
                '&:hover': {
                  borderColor: alpha(priorityColor, 0.4),
                  background: alpha(theme.palette.background.paper, 0.7),
                  transform: 'translateX(4px)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: '4px',
                  background: priorityColor,
                  opacity: isCompleted ? 0.4 : 0.8,
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <Checkbox
                  size="small"
                  checked={isCompleted}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleComplete(task.id);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  sx={{
                    p: 0,
                    color: priorityColor,
                    '&.Mui-checked': {
                      color: priorityColor,
                    },
                  }}
                />
                
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 500,
                      textDecoration: isCompleted ? 'line-through' : 'none',
                      color: isCompleted ? theme.palette.text.secondary : theme.palette.text.primary,
                      mb: 0.5,
                    }}
                  >
                    {task.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      icon={getPriorityIcon(task.priority)}
                      label={task.priority}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.65rem',
                        backgroundColor: alpha(priorityColor, 0.1),
                        color: priorityColor,
                        '& .MuiChip-label': {
                          px: 0.5,
                        },
                        '& .MuiChip-icon': {
                          marginLeft: '4px',
                          marginRight: '-2px',
                        },
                      }}
                    />
                    
                    <Chip
                      icon={<ScheduleIcon />}
                      label={daysUntilDue}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.65rem',
                        backgroundColor: alpha(
                          isOverdue ? theme.palette.error.main : theme.palette.text.secondary,
                          0.1
                        ),
                        color: isOverdue ? theme.palette.error.main : theme.palette.text.secondary,
                        '& .MuiChip-label': {
                          px: 0.5,
                        },
                        '& .MuiChip-icon': {
                          fontSize: 14,
                          marginLeft: '4px',
                          marginRight: '-2px',
                        },
                      }}
                    />
                    
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: theme.palette.text.secondary,
                        fontSize: '0.65rem',
                      }}
                    >
                      {task.type}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          );
        })}
        
        {tasks.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CompleteIcon sx={{ fontSize: 48, color: themeAccents.success, mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              All tasks completed!
            </Typography>
          </Box>
        )}
      </Box>
      
      {/* Task Details Drawer */}
      <SwipeableDrawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpen={() => {}}
        sx={{
          '& .MuiDrawer-paper': {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            p: 3,
            maxHeight: '50vh',
          },
        }}
      >
        {selectedTask && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Task Details
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {selectedTask.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <Chip
                icon={getPriorityIcon(selectedTask.priority)}
                label={`${selectedTask.priority} Priority`}
                color={selectedTask.priority === 'High' ? 'error' : 'default'}
              />
              <Chip
                icon={<ScheduleIcon />}
                label={`Due: ${selectedTask.dueDate}`}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                startIcon={<EditIcon />} 
                variant="outlined"
                onClick={() => setDrawerOpen(false)}
              >
                Edit
              </Button>
              <Button 
                startIcon={<DeleteIcon />} 
                color="error"
                onClick={() => setDrawerOpen(false)}
              >
                Delete
              </Button>
              <Button 
                variant="contained" 
                onClick={() => setDrawerOpen(false)}
                sx={{ ml: 'auto' }}
              >
                Close
              </Button>
            </Box>
          </Box>
        )}
      </SwipeableDrawer>
    </>
  );
};

export default PriorityTaskList;