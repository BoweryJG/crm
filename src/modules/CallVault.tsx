// CallVault - Archival Recording System
// Every call preserved like a monument
// Auto-transcription and speaker intelligence included

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Stack,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Fade,
  Collapse,
  Menu,
  MenuItem,
  Slider,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Folder as VaultIcon,
  Search as SearchIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  VolumeUp as VolumeIcon,
  Download as DownloadIcon,
  NavigateBefore as BackIcon,
  FilterList as FilterIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Label as LabelIcon,
  AccessTime as DurationIcon,
  GraphicEq as WaveformIcon,
  Transcribe as TranscribeIcon,
  Archive as ArchiveIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  MoreVert as MoreIcon,
  FolderOpen as OpenFolderIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  Monolith,
  GalleryContainer,
  ExhibitionGrid,
  Gallery,
} from '../components/gallery';
import glassEffects from '../themes/glassEffects';
import animations from '../themes/animations';

// Waveform Visualizer Component
const WaveformVisualizer: React.FC<{
  audioData: number[];
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}> = ({ audioData, currentTime, duration, onSeek }) => {
  const theme = useTheme();
  const [hoveredPosition, setHoveredPosition] = useState<number | null>(null);
  
  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    onSeek(percentage * duration);
  };
  
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setHoveredPosition(x / rect.width);
  };
  
  return (
    <Box sx={{ position: 'relative', height: 120, mb: 3 }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1000 120"
        preserveAspectRatio="none"
        style={{ cursor: 'pointer' }}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredPosition(null)}
      >
        {/* Background */}
        <rect
          width="1000"
          height="120"
          fill={alpha(theme.palette.background.paper, 0.3)}
        />
        
        {/* Waveform bars */}
        {audioData.map((amplitude, i) => {
          const x = (i / audioData.length) * 1000;
          const height = amplitude * 100;
          const y = 60 - height / 2;
          const isPlayed = i / audioData.length <= currentTime / duration;
          
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={1000 / audioData.length - 1}
              height={height}
              fill={isPlayed ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.3)}
              style={{
                transition: 'fill 0.3s ease',
              }}
            />
          );
        })}
        
        {/* Playhead */}
        <line
          x1={(currentTime / duration) * 1000}
          y1="0"
          x2={(currentTime / duration) * 1000}
          y2="120"
          stroke={theme.palette.primary.main}
          strokeWidth="2"
          style={{
            filter: `drop-shadow(0 0 8px ${alpha(theme.palette.primary.main, 0.5)})`,
          }}
        />
        
        {/* Hover indicator */}
        {hoveredPosition !== null && (
          <line
            x1={hoveredPosition * 1000}
            y1="0"
            x2={hoveredPosition * 1000}
            y2="120"
            stroke={alpha(theme.palette.primary.main, 0.5)}
            strokeWidth="1"
            strokeDasharray="2,2"
          />
        )}
      </svg>
      
      {/* Time labels */}
      <Box
        sx={{
          position: 'absolute',
          bottom: -20,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
          0:00
        </Typography>
        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
          {formatTime(duration)}
        </Typography>
      </Box>
    </Box>
  );
};

// Recording Card Component
const RecordingCard: React.FC<{
  recording: {
    id: string;
    title: string;
    date: string;
    duration: number;
    speakers: string[];
    transcribed: boolean;
    starred: boolean;
    tags: string[];
  };
  onPlay: () => void;
  onStar: () => void;
}> = ({ recording, onPlay, onStar }) => {
  const theme = useTheme();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  
  return (
    <Box
      sx={{
        ...glassEffects.effects.obsidian,
        p: 3,
        cursor: 'pointer',
        position: 'relative',
        transition: animations.utils.createTransition().transition,
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.05),
          transform: 'translateY(-2px)',
        },
      }}
      onClick={onPlay}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 300, letterSpacing: '0.05em', mb: 1 }}>
            {recording.title}
          </Typography>
          
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Chip
              icon={<CalendarIcon />}
              label={recording.date}
              size="small"
              sx={{ backgroundColor: alpha(theme.palette.background.paper, 0.5) }}
            />
            <Chip
              icon={<DurationIcon />}
              label={formatTime(recording.duration)}
              size="small"
              sx={{ backgroundColor: alpha(theme.palette.background.paper, 0.5) }}
            />
            {recording.transcribed && (
              <Chip
                icon={<TranscribeIcon />}
                label="Transcribed"
                size="small"
                sx={{
                  backgroundColor: alpha(theme.palette.success.main, 0.1),
                  color: theme.palette.success.main,
                  border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                }}
              />
            )}
          </Stack>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {recording.speakers.map((speaker) => (
              <Typography
                key={speaker}
                variant="caption"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: theme.palette.text.secondary,
                }}
              >
                <PersonIcon sx={{ fontSize: 14 }} />
                {speaker}
              </Typography>
            ))}
          </Box>
          
          {recording.tags.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.5, mt: 2 }}>
              {recording.tags.map((tag) => (
                <Box
                  key={tag}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    fontSize: '0.75rem',
                    letterSpacing: '0.05em',
                  }}
                >
                  {tag}
                </Box>
              ))}
            </Box>
          )}
        </Box>
        
        <Stack direction="row" spacing={1}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onStar();
            }}
            sx={{
              color: recording.starred ? theme.palette.primary.main : theme.palette.text.secondary,
            }}
          >
            {recording.starred ? <StarIcon /> : <StarBorderIcon />}
          </IconButton>
          
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setMenuAnchor(e.currentTarget);
            }}
          >
            <MoreIcon />
          </IconButton>
        </Stack>
      </Box>
      
      {/* Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        sx={{
          '& .MuiPaper-root': {
            ...glassEffects.effects.carbon,
            borderRadius: 0,
          },
        }}
      >
        <MenuItem onClick={() => setMenuAnchor(null)}>
          <DownloadIcon sx={{ mr: 1 }} />
          Download Recording
        </MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)}>
          <TranscribeIcon sx={{ mr: 1 }} />
          View Transcript
        </MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)}>
          <LabelIcon sx={{ mr: 1 }} />
          Edit Tags
        </MenuItem>
      </Menu>
    </Box>
  );
};

// Helper functions
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const generateWaveformData = (length: number = 100) => {
  return Array.from({ length }, () => 0.2 + Math.random() * 0.8);
};

// Main CallVault Component
const CallVault: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'starred' | 'recent'>('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentRecording, setCurrentRecording] = useState<string | null>(null);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
  
  // Mock data - in real app, this would come from API
  const recordings = [
    {
      id: '1',
      title: 'Dr. Sarah Johnson - Aesthetic Solutions Demo',
      date: '2024-01-20',
      duration: 1247,
      speakers: ['John Smith (Rep)', 'Dr. Sarah Johnson'],
      transcribed: true,
      starred: true,
      tags: ['Product Demo', 'Aesthetic', 'High Interest'],
      waveform: generateWaveformData(),
    },
    {
      id: '2',
      title: 'Dr. Michael Chen - Follow-up Discussion',
      date: '2024-01-19',
      duration: 842,
      speakers: ['John Smith (Rep)', 'Dr. Michael Chen'],
      transcribed: true,
      starred: false,
      tags: ['Follow-up', 'Technical Questions'],
      waveform: generateWaveformData(),
    },
    {
      id: '3',
      title: 'Dr. Emily Davis - Initial Cold Call',
      date: '2024-01-18',
      duration: 523,
      speakers: ['John Smith (Rep)', 'Dr. Emily Davis'],
      transcribed: false,
      starred: false,
      tags: ['Cold Call', 'Needs Analysis'],
      waveform: generateWaveformData(),
    },
    {
      id: '4',
      title: 'Dr. Robert Wilson - Contract Negotiation',
      date: '2024-01-17',
      duration: 1856,
      speakers: ['John Smith (Rep)', 'Dr. Robert Wilson', 'Practice Manager'],
      transcribed: true,
      starred: true,
      tags: ['Negotiation', 'Decision Stage', 'Multi-stakeholder'],
      waveform: generateWaveformData(),
    },
  ];
  
  // Filter recordings based on search and filter
  const filteredRecordings = recordings.filter((recording) => {
    const matchesSearch = recording.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recording.speakers.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      recording.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' ||
      (selectedFilter === 'starred' && recording.starred) ||
      (selectedFilter === 'recent' && new Date(recording.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    
    return matchesSearch && matchesFilter;
  });
  
  // Calculate vault statistics
  const vaultStats = {
    totalRecordings: recordings.length,
    totalDuration: recordings.reduce((sum, r) => sum + r.duration, 0),
    transcribedCount: recordings.filter(r => r.transcribed).length,
    starredCount: recordings.filter(r => r.starred).length,
  };
  
  // Simulate playback
  useEffect(() => {
    if (isPlaying && currentRecording) {
      const recording = recordings.find(r => r.id === currentRecording);
      if (!recording) return;
      
      const interval = setInterval(() => {
        setPlaybackTime((prev) => {
          if (prev >= recording.duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isPlaying, currentRecording, recordings]);
  
  const handlePlayRecording = (recordingId: string) => {
    if (currentRecording === recordingId) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentRecording(recordingId);
      setPlaybackTime(0);
      setIsPlaying(true);
    }
  };
  
  const handleSeek = (time: number) => {
    setPlaybackTime(time);
  };
  
  const handleStarRecording = (recordingId: string) => {
    // In real app, this would update the database
    console.log('Starring recording:', recordingId);
  };
  
  return (
    <GalleryContainer maxWidth="xl">
      <Fade in timeout={animations.durations.cinematic}>
        <Box>
          {/* Header */}
          <Box sx={{ mb: 6 }}>
            <Button
              startIcon={<BackIcon />}
              onClick={() => navigate('/command-room')}
              sx={{
                mb: 4,
                color: theme.palette.text.secondary,
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              COMMAND ROOM
            </Button>
            
            <Typography
              variant="overline"
              sx={{
                color: theme.palette.primary.main,
                letterSpacing: '0.3em',
                display: 'block',
                mb: 2,
              }}
            >
              ARCHIVAL RECORDING SYSTEM
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4 }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 100,
                  letterSpacing: '0.2em',
                }}
              >
                CALLVAULT
              </Typography>
              
              <Stack direction="row" spacing={2}>
                <TextField
                  placeholder="Search recordings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    width: 300,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                      backgroundColor: alpha(theme.palette.background.paper, 0.05),
                    },
                  }}
                />
                
                <Button
                  startIcon={<FilterIcon />}
                  onClick={(e) => setFilterMenuAnchor(e.currentTarget)}
                  sx={{
                    borderRadius: 0,
                    px: 3,
                    borderWidth: 2,
                    borderColor: selectedFilter !== 'all' ? theme.palette.primary.main : undefined,
                  }}
                  variant="outlined"
                >
                  {selectedFilter.toUpperCase()}
                </Button>
              </Stack>
            </Box>
          </Box>
          
          {/* Vault Statistics */}
          <ExhibitionGrid columns={{ xs: 1, sm: 2, md: 4 }} spacing={3}>
            <Monolith variant="goldInfused" hover="subtle" animationDelay={0}>
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <VaultIcon sx={{ fontSize: 32, color: theme.palette.primary.main, mb: 1 }} />
                <Typography variant="h3" sx={{ fontWeight: 100 }}>
                  {vaultStats.totalRecordings}
                </Typography>
                <Typography variant="overline" sx={{ color: theme.palette.text.secondary }}>
                  TOTAL RECORDINGS
                </Typography>
              </Box>
            </Monolith>
            
            <Monolith variant="carbon" hover="subtle" animationDelay={100}>
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <DurationIcon sx={{ fontSize: 32, color: theme.palette.primary.main, mb: 1 }} />
                <Typography variant="h3" sx={{ fontWeight: 100 }}>
                  {Math.round(vaultStats.totalDuration / 60)}
                </Typography>
                <Typography variant="overline" sx={{ color: theme.palette.text.secondary }}>
                  TOTAL MINUTES
                </Typography>
              </Box>
            </Monolith>
            
            <Monolith variant="obsidian" hover="subtle" animationDelay={200}>
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <TranscribeIcon sx={{ fontSize: 32, color: theme.palette.success.main, mb: 1 }} />
                <Typography variant="h3" sx={{ fontWeight: 100, color: theme.palette.success.main }}>
                  {vaultStats.transcribedCount}
                </Typography>
                <Typography variant="overline" sx={{ color: theme.palette.text.secondary }}>
                  TRANSCRIBED
                </Typography>
              </Box>
            </Monolith>
            
            <Monolith variant="frostedSteel" hover="subtle" animationDelay={300}>
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <StarIcon sx={{ fontSize: 32, color: theme.palette.primary.main, mb: 1 }} />
                <Typography variant="h3" sx={{ fontWeight: 100 }}>
                  {vaultStats.starredCount}
                </Typography>
                <Typography variant="overline" sx={{ color: theme.palette.text.secondary }}>
                  STARRED
                </Typography>
              </Box>
            </Monolith>
          </ExhibitionGrid>
          
          <Gallery.Space height={40} />
          
          {/* Currently Playing */}
          {currentRecording && (
            <Monolith
              title="NOW PLAYING"
              subtitle={recordings.find(r => r.id === currentRecording)?.title}
              variant="museum"
              animationDelay={400}
            >
              <WaveformVisualizer
                audioData={recordings.find(r => r.id === currentRecording)?.waveform || []}
                currentTime={playbackTime}
                duration={recordings.find(r => r.id === currentRecording)?.duration || 0}
                onSeek={handleSeek}
              />
              
              {/* Playback Controls */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <IconButton
                  onClick={() => setIsPlaying(!isPlaying)}
                  sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.2),
                    },
                  }}
                >
                  {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </IconButton>
                
                <Typography variant="body2" sx={{ minWidth: 100 }}>
                  {formatTime(playbackTime)} / {formatTime(recordings.find(r => r.id === currentRecording)?.duration || 0)}
                </Typography>
                
                <Box sx={{ flex: 1 }} />
                
                <VolumeIcon sx={{ color: theme.palette.text.secondary }} />
                <Slider
                  value={volume}
                  onChange={(_, value) => setVolume(value as number)}
                  max={1}
                  step={0.1}
                  sx={{
                    width: 100,
                    '& .MuiSlider-rail': {
                      height: 4,
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                    '& .MuiSlider-track': {
                      height: 4,
                      backgroundColor: theme.palette.primary.main,
                      border: 'none',
                    },
                    '& .MuiSlider-thumb': {
                      width: 12,
                      height: 12,
                      backgroundColor: theme.palette.primary.main,
                    },
                  }}
                />
              </Box>
            </Monolith>
          )}
          
          {/* Recordings Archive */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 100,
              letterSpacing: '0.15em',
              mb: 4,
              mt: currentRecording ? 6 : 0,
            }}
          >
            RECORDING ARCHIVE
          </Typography>
          
          <Stack spacing={2}>
            {filteredRecordings.map((recording) => (
              <RecordingCard
                key={recording.id}
                recording={recording}
                onPlay={() => handlePlayRecording(recording.id)}
                onStar={() => handleStarRecording(recording.id)}
              />
            ))}
          </Stack>
          
          {filteredRecordings.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <ArchiveIcon sx={{ fontSize: 64, color: theme.palette.text.secondary, opacity: 0.3, mb: 2 }} />
              <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
                No recordings found matching your criteria
              </Typography>
            </Box>
          )}
          
          {/* Filter Menu */}
          <Menu
            anchorEl={filterMenuAnchor}
            open={Boolean(filterMenuAnchor)}
            onClose={() => setFilterMenuAnchor(null)}
            sx={{
              '& .MuiPaper-root': {
                ...glassEffects.effects.carbon,
                borderRadius: 0,
              },
            }}
          >
            <MenuItem
              selected={selectedFilter === 'all'}
              onClick={() => {
                setSelectedFilter('all');
                setFilterMenuAnchor(null);
              }}
            >
              All Recordings
            </MenuItem>
            <MenuItem
              selected={selectedFilter === 'starred'}
              onClick={() => {
                setSelectedFilter('starred');
                setFilterMenuAnchor(null);
              }}
            >
              Starred Only
            </MenuItem>
            <MenuItem
              selected={selectedFilter === 'recent'}
              onClick={() => {
                setSelectedFilter('recent');
                setFilterMenuAnchor(null);
              }}
            >
              Recent (7 days)
            </MenuItem>
          </Menu>
          
          {/* Footer */}
          <Gallery.Space height={80} pattern="grid" />
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 100,
                letterSpacing: '0.2em',
                mb: 2,
                color: theme.palette.text.secondary,
              }}
            >
              EVERY CONVERSATION IS A MONUMENT
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                maxWidth: 600,
                mx: 'auto',
                letterSpacing: '0.05em',
              }}
            >
              CallVault preserves your sales conversations like sculptures in a gallery. 
              Each recording is a testament to your craft, ready to be studied and perfected.
            </Typography>
          </Box>
        </Box>
      </Fade>
    </GalleryContainer>
  );
};

export default CallVault;