// Growth Forge - Skill foundry and fitness tracker
// Where personal development meets industrial strength training

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Stack,
  Grid,
  Fade,
  LinearProgress,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Divider,
  Rating,
  Avatar,
  Badge,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
} from '@mui/material';
import {
  FitnessCenter as GymIcon,
  EmojiEvents as TrophyIcon,
  LocalFireDepartment as FireIcon,
  Timer as TimerIcon,
  TrendingUp as GrowthIcon,
  Star as StarIcon,
  Lock as LockIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Share as ShareIcon,
  WorkspacePremium as CertificateIcon,
  Speed as SpeedIcon,
  Psychology as BrainIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { Monolith, Gallery } from '../../../components/gallery';
import glassEffects from '../../../themes/glassEffects';
import animations from '../../../themes/animations';
import { CanvasBase, AIGenerateButton } from './CanvasBase';
import { useAuth } from '../../../auth';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../../../themes/ThemeContext';

interface Skill {
  id: string;
  name: string;
  icon: React.ReactNode;
  level: number;
  maxLevel: number;
  xp: number;
  xpToNext: number;
  category: string;
  color: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
}

const GrowthForge: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { themeMode } = useThemeContext();
  const [activeMode, setActiveMode] = useState<'track' | 'create'>('track');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('sales');

  // Theme-aware glass effects
  const getThemeGlass = () => {
    switch (themeMode) {
      case 'cyber-neon':
        return {
          ...glassEffects.effects.obsidian,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
          boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.3)}`,
        };
      case 'ocean-depths':
        return {
          ...glassEffects.effects.museum,
          background: `linear-gradient(135deg, ${alpha('#006994', 0.1)}, ${alpha('#00334d', 0.1)})`,
        };
      case 'cartier-gold':
        return glassEffects.effects.goldInfused;
      default:
        return glassEffects.effects.frostedSteel;
    }
  };

  // Mock data
  const skills: Skill[] = [
    {
      id: '1',
      name: 'Cold Calling',
      icon: <GymIcon />,
      level: 7,
      maxLevel: 10,
      xp: 2400,
      xpToNext: 3000,
      category: 'sales',
      color: theme.palette.primary.main,
    },
    {
      id: '2',
      name: 'Product Knowledge',
      icon: <BrainIcon />,
      level: 5,
      maxLevel: 10,
      xp: 1200,
      xpToNext: 2000,
      category: 'knowledge',
      color: theme.palette.secondary.main,
    },
    {
      id: '3',
      name: 'Negotiation',
      icon: <SpeedIcon />,
      level: 8,
      maxLevel: 10,
      xp: 3200,
      xpToNext: 4000,
      category: 'sales',
      color: theme.palette.warning.main,
    },
  ];

  const achievements: Achievement[] = [
    {
      id: '1',
      name: 'First Sale',
      description: 'Close your first deal',
      icon: <TrophyIcon />,
      unlocked: true,
      rarity: 'common',
      unlockedAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'Streak Master',
      description: '30 day activity streak',
      icon: <FireIcon />,
      unlocked: true,
      rarity: 'rare',
      unlockedAt: new Date('2024-02-20'),
    },
    {
      id: '3',
      name: 'Knowledge Champion',
      description: 'Complete all product certifications',
      icon: <CertificateIcon />,
      unlocked: false,
      rarity: 'epic',
    },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return '#FFD700';
      case 'epic':
        return '#B347EA';
      case 'rare':
        return '#4FC3F7';
      default:
        return theme.palette.text.secondary;
    }
  };

  const handleCreateSkill = () => {
    if (!newSkillName) return;
    
    setLoading(true);
    // Simulate skill creation
    setTimeout(() => {
      setLoading(false);
      setNewSkillName('');
      // In real app, would add to skills array
    }, 1500);
  };

  return (
    <CanvasBase
      overline="PERFORMANCE ENHANCEMENT"
      title="GROWTH FORGE"
      subtitle="Forge your skills in the furnace of continuous improvement. Track progress, unlock achievements, and level up your sales mastery."
      emptyStateIcon={<GymIcon />}
      emptyStateMessage="SELECT A SKILL TO BEGIN TRAINING"
      onSignInClick={() => navigate('/login')}
    >
      {/* Mode Toggle */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <ToggleButtonGroup
          value={activeMode}
          exclusive
          onChange={(_, newMode) => newMode && setActiveMode(newMode)}
          sx={{
            ...getThemeGlass(),
            backgroundColor: alpha(theme.palette.background.paper, 0.3),
          }}
        >
          <ToggleButton
            value="track"
            sx={{
              px: 4,
              letterSpacing: '0.1em',
              color: activeMode === 'track' ? theme.palette.primary.main : theme.palette.text.secondary,
            }}
          >
            TRACK PROGRESS
          </ToggleButton>
          <ToggleButton
            value="create"
            sx={{
              px: 4,
              letterSpacing: '0.1em',
              color: activeMode === 'create' ? theme.palette.primary.main : theme.palette.text.secondary,
            }}
          >
            CREATE SKILLS
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {activeMode === 'track' ? (
        <Grid container spacing={3}>
          {/* Left Panel - Skill Gym Equipment */}
          <Grid item xs={12} md={4}>
            <Monolith
              variant={themeMode === 'cartier-gold' ? 'goldInfused' : 'frostedSteel'}
              elevation="elevated"
              hover="none"
              title="SKILL GYM"
              fullHeight
            >
              <Stack spacing={2}>
                {skills.map((skill) => (
                  <Paper
                    key={skill.id}
                    onClick={() => setSelectedSkill(skill)}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      ...getThemeGlass(),
                      backgroundColor: selectedSkill?.id === skill.id
                        ? alpha(skill.color, 0.1)
                        : alpha(theme.palette.background.paper, 0.3),
                      border: `1px solid ${selectedSkill?.id === skill.id
                        ? alpha(skill.color, 0.3)
                        : alpha(theme.palette.divider, 0.1)}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: alpha(skill.color, 0.05),
                        borderColor: alpha(skill.color, 0.2),
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        sx={{
                          backgroundColor: alpha(skill.color, 0.2),
                          color: skill.color,
                        }}
                      >
                        {skill.icon}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            letterSpacing: '0.05em',
                            fontWeight: 600,
                          }}
                        >
                          {skill.name}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography
                            variant="caption"
                            sx={{
                              color: theme.palette.text.secondary,
                              letterSpacing: '0.1em',
                            }}
                          >
                            LEVEL {skill.level}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={(skill.xp / skill.xpToNext) * 100}
                            sx={{
                              width: 60,
                              height: 4,
                              borderRadius: 2,
                              backgroundColor: alpha(skill.color, 0.1),
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: skill.color,
                              },
                            }}
                          />
                        </Stack>
                      </Box>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Monolith>
          </Grid>

          {/* Center Panel - Progress Dashboard */}
          <Grid item xs={12} md={4}>
            <Monolith
              variant={themeMode === 'cyber-neon' ? 'obsidian' : 'museum'}
              elevation="floating"
              hover="none"
              title="PROGRESS TRACKER"
              fullHeight
            >
              {selectedSkill ? (
                <Stack spacing={3}>
                  {/* Skill Progress Circle */}
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                      <CircularProgress
                        variant="determinate"
                        value={(selectedSkill.level / selectedSkill.maxLevel) * 100}
                        size={120}
                        thickness={4}
                        sx={{
                          color: selectedSkill.color,
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography
                          variant="h3"
                          sx={{
                            fontWeight: 100,
                            letterSpacing: '0.1em',
                            color: selectedSkill.color,
                          }}
                        >
                          {selectedSkill.level}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{
                        mt: 2,
                        letterSpacing: '0.15em',
                        fontWeight: 300,
                      }}
                    >
                      {selectedSkill.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: theme.palette.text.secondary,
                        letterSpacing: '0.1em',
                      }}
                    >
                      {selectedSkill.xp} / {selectedSkill.xpToNext} XP
                    </Typography>
                  </Box>

                  <Divider sx={{ opacity: 0.1 }} />

                  {/* Stats */}
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          ...getThemeGlass(),
                        }}
                      >
                        <TimerIcon sx={{ color: theme.palette.primary.main, mb: 1 }} />
                        <Typography variant="h6">42h</Typography>
                        <Typography variant="caption" sx={{ letterSpacing: '0.05em' }}>
                          TIME INVESTED
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          ...getThemeGlass(),
                        }}
                      >
                        <FireIcon sx={{ color: theme.palette.warning.main, mb: 1 }} />
                        <Typography variant="h6">15</Typography>
                        <Typography variant="caption" sx={{ letterSpacing: '0.05em' }}>
                          DAY STREAK
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  {/* Recent Activity */}
                  <Box>
                    <Typography
                      variant="overline"
                      sx={{
                        color: theme.palette.primary.main,
                        letterSpacing: '0.2em',
                      }}
                    >
                      RECENT ACTIVITY
                    </Typography>
                    <Stack spacing={1} sx={{ mt: 1 }}>
                      <Typography variant="body2" sx={{ letterSpacing: '0.02em' }}>
                        • Completed advanced negotiation module (+200 XP)
                      </Typography>
                      <Typography variant="body2" sx={{ letterSpacing: '0.02em' }}>
                        • Practice session: Objection handling (+50 XP)
                      </Typography>
                      <Typography variant="body2" sx={{ letterSpacing: '0.02em' }}>
                        • Achieved 10 successful calls (+100 XP)
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <GrowthIcon sx={{ fontSize: 48, mb: 2, opacity: 0.3 }} />
                  <Typography variant="body2" sx={{ letterSpacing: '0.1em' }}>
                    SELECT A SKILL TO VIEW PROGRESS
                  </Typography>
                </Box>
              )}
            </Monolith>
          </Grid>

          {/* Right Panel - Achievement Showcase */}
          <Grid item xs={12} md={4}>
            <Monolith
              variant={themeMode === 'ocean-depths' ? 'carbon' : 'goldInfused'}
              elevation="elevated"
              hover="none"
              title="ACHIEVEMENT HALL"
              fullHeight
            >
              <Stack spacing={2}>
                {achievements.map((achievement) => (
                  <Paper
                    key={achievement.id}
                    sx={{
                      p: 2,
                      opacity: achievement.unlocked ? 1 : 0.5,
                      ...getThemeGlass(),
                      border: `1px solid ${achievement.unlocked
                        ? alpha(getRarityColor(achievement.rarity), 0.3)
                        : alpha(theme.palette.divider, 0.1)}`,
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Badge
                        badgeContent={achievement.unlocked ? null : <LockIcon sx={{ fontSize: 12 }} />}
                        sx={{
                          '& .MuiBadge-badge': {
                            backgroundColor: theme.palette.background.paper,
                            color: theme.palette.text.secondary,
                          },
                        }}
                      >
                        <Avatar
                          sx={{
                            backgroundColor: alpha(getRarityColor(achievement.rarity), 0.2),
                            color: getRarityColor(achievement.rarity),
                          }}
                        >
                          {achievement.icon}
                        </Avatar>
                      </Badge>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            letterSpacing: '0.05em',
                            fontWeight: 600,
                            color: achievement.unlocked
                              ? theme.palette.text.primary
                              : theme.palette.text.secondary,
                          }}
                        >
                          {achievement.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: theme.palette.text.secondary,
                            letterSpacing: '0.03em',
                          }}
                        >
                          {achievement.description}
                        </Typography>
                        {achievement.unlockedAt && (
                          <Typography
                            variant="caption"
                            sx={{
                              display: 'block',
                              mt: 0.5,
                              color: getRarityColor(achievement.rarity),
                            }}
                          >
                            Unlocked {achievement.unlockedAt.toLocaleDateString()}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Monolith>
          </Grid>
        </Grid>
      ) : (
        /* Create Mode */
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
            <Monolith
              variant="obsidian"
              elevation="floating"
              hover="none"
              title="SKILL DESIGNER"
            >
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="SKILL NAME"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  variant="outlined"
                  sx={{
                    '& .MuiInputLabel-root': {
                      letterSpacing: '0.1em',
                    },
                  }}
                />

                <ToggleButtonGroup
                  value={newSkillCategory}
                  exclusive
                  onChange={(_, newCat) => newCat && setNewSkillCategory(newCat)}
                  fullWidth
                >
                  <ToggleButton value="sales">SALES</ToggleButton>
                  <ToggleButton value="knowledge">KNOWLEDGE</ToggleButton>
                  <ToggleButton value="technical">TECHNICAL</ToggleButton>
                  <ToggleButton value="soft">SOFT SKILLS</ToggleButton>
                </ToggleButtonGroup>

                <Box>
                  <Typography variant="overline" sx={{ letterSpacing: '0.2em' }}>
                    SKILL LEVELS
                  </Typography>
                  <Stack spacing={1} sx={{ mt: 1 }}>
                    {[1, 5, 10].map((level) => (
                      <Stack key={level} direction="row" alignItems="center" spacing={2}>
                        <Typography variant="body2" sx={{ minWidth: 60 }}>
                          Level {level}:
                        </Typography>
                        <TextField
                          size="small"
                          placeholder={`Milestone for level ${level}`}
                          fullWidth
                        />
                      </Stack>
                    ))}
                  </Stack>
                </Box>

                <AIGenerateButton
                  onClick={handleCreateSkill}
                  disabled={!newSkillName}
                  loading={loading}
                  label="CREATE SKILL"
                  fullWidth
                />
              </Stack>
            </Monolith>
          </Grid>
        </Grid>
      )}
    </CanvasBase>
  );
};

export default GrowthForge;