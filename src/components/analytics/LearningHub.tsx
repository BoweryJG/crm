import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  Button,
  Paper,
  Avatar,
  LinearProgress,
  useTheme,
  Tooltip
} from '@mui/material';
import {
  School as LearnIcon,
  PlayCircle as VideoIcon,
  Quiz as QuizIcon,
  EmojiEvents as CertificateIcon,
  LocalFireDepartment as HotIcon,
  Psychology as InsightIcon
} from '@mui/icons-material';

interface LearningHubProps {
  type: 'dental' | 'aesthetic';
  procedureCount: number;
}

const LearningHub: React.FC<LearningHubProps> = ({ type, procedureCount }) => {
  const theme = useTheme();
  const [learningProgress] = useState(Math.floor(Math.random() * 100));

  const educationalSections = [
    {
      id: 'trending',
      title: '🔥 Hot Topics',
      subtitle: 'What\'s trending right now',
      icon: <HotIcon />,
      color: theme.palette.error.main,
      items: type === 'dental' ? [
        'Digital Dentistry Revolution',
        'Implant Technology Updates',
        'AI in Diagnostics',
        'Teledentistry Best Practices'
      ] : [
        'Non-Invasive Face Lifting',
        'PDO Thread Lifts',
        'Regenerative Medicine',
        'Combination Treatments'
      ]
    },
    {
      id: 'insights',
      title: '💡 Market Insights',
      subtitle: 'Industry intelligence',
      icon: <InsightIcon />,
      color: theme.palette.info.main,
      items: [
        'Patient Demographics Shift',
        'Insurance Coverage Changes',
        'Competitive Landscape',
        'Pricing Strategy Updates'
      ]
    },
    {
      id: 'training',
      title: '🎓 Learning Paths',
      subtitle: 'Structured education',
      icon: <LearnIcon />,
      color: theme.palette.success.main,
      items: [
        'Beginner Fundamentals',
        'Advanced Techniques',
        'Sales Strategies',
        'Patient Communication'
      ]
    }
  ];

  const achievements = [
    { id: 1, name: 'Quick Learner', description: 'Completed 5 procedures', icon: '⚡', earned: true },
    { id: 2, name: 'Knowledge Seeker', description: 'Viewed 20 videos', icon: '📚', earned: true },
    { id: 3, name: 'Quiz Master', description: 'Passed 10 quizzes', icon: '🏆', earned: false },
    { id: 4, name: 'Expert Level', description: 'Completed advanced path', icon: '⭐', earned: false }
  ];

  const weeklyGoals = [
    { id: 1, title: 'Learn 3 new procedures', progress: 67, target: 3, current: 2 },
    { id: 2, title: 'Complete 2 quizzes', progress: 50, target: 2, current: 1 },
    { id: 3, title: 'Watch 5 videos', progress: 80, target: 5, current: 4 }
  ];

  return (
    <Box sx={{ mb: 4 }}>
      {/* Learning Overview Header */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 3,
          background: `linear-gradient(135deg, ${
            type === 'dental' ? theme.palette.primary.main : theme.palette.secondary.main
          }15, ${theme.palette.info.main}08)`
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: type === 'dental' ? theme.palette.primary.main : theme.palette.secondary.main,
                }}
              >
                <LearnIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {type === 'dental' ? '🦷 Dental' : '✨ Aesthetic'} Learning Hub
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Master {procedureCount} procedures with interactive learning
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip 
                icon={<VideoIcon />}
                label="500+ Videos" 
                color="primary" 
                variant="outlined"
              />
              <Chip 
                icon={<QuizIcon />}
                label="Interactive Quizzes" 
                color="secondary" 
                variant="outlined"
              />
              <Chip 
                icon={<CertificateIcon />}
                label="Certifications" 
                color="success" 
                variant="outlined"
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Your Progress
              </Typography>
              <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: `conic-gradient(${theme.palette.primary.main} ${learningProgress * 3.6}deg, ${theme.palette.grey[200]} 0deg)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      bgcolor: 'background.paper',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      {learningProgress}%
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Overall completion
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Educational Sections */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {educationalSections.map((section) => (
          <Grid item xs={12} md={4} key={section.id}>
            <Card 
              elevation={2}
              sx={{ 
                height: '100%',
                borderRadius: 3,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'all 0.3s ease-in-out',
                  boxShadow: theme.shadows[8]
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: `${section.color}20`,
                      color: section.color,
                      mr: 2
                    }}
                  >
                    {section.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {section.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {section.subtitle}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {section.items.map((item, index) => (
                    <Button
                      key={index}
                      variant="text"
                      sx={{
                        justifyContent: 'flex-start',
                        textAlign: 'left',
                        py: 1,
                        px: 2,
                        borderRadius: 2,
                        '&:hover': {
                          bgcolor: `${section.color}10`
                        }
                      }}
                    >
                      {item}
                    </Button>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Weekly Goals and Achievements */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                📅 Weekly Goals
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {weeklyGoals.map((goal) => (
                  <Box key={goal.id}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" fontWeight="medium">
                        {goal.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {goal.current}/{goal.target}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={goal.progress}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          bgcolor: goal.progress >= 100 ? theme.palette.success.main : theme.palette.primary.main
                        }
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                🏆 Achievements
              </Typography>
              <Grid container spacing={1}>
                {achievements.map((achievement) => (
                  <Grid item xs={6} key={achievement.id}>
                    <Tooltip title={achievement.description}>
                      <Paper
                        elevation={achievement.earned ? 2 : 0}
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          borderRadius: 2,
                          bgcolor: achievement.earned ? 'background.paper' : 'grey.100',
                          opacity: achievement.earned ? 1 : 0.5,
                          cursor: 'pointer',
                          '&:hover': {
                            transform: achievement.earned ? 'scale(1.05)' : 'none',
                            transition: 'all 0.2s ease'
                          }
                        }}
                      >
                        <Typography variant="h4" sx={{ mb: 0.5 }}>
                          {achievement.icon}
                        </Typography>
                        <Typography variant="caption" fontWeight="bold">
                          {achievement.name}
                        </Typography>
                      </Paper>
                    </Tooltip>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LearningHub;