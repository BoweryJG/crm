import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Grid,
  TextField,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Avatar,
  Badge,
  Paper,
  LinearProgress,
  Fab,
  Zoom,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  School as LearnIcon,
  LocalHospital as MedicalIcon,
  Psychology as AestheticIcon,
  Star as StarIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Quiz as QuizIcon,
  EmojiEvents as CertificateIcon,
  VideoLibrary as VideoIcon,
  MenuBook as GuideIcon,
  Timeline as ProgressIcon
} from '@mui/icons-material';
import { DentalProcedure, AestheticProcedure } from '../../types';
import LearningHub from './LearningHub';

interface ProcedureLibraryProps {
  procedures: (DentalProcedure | AestheticProcedure)[];
  type: 'dental' | 'aesthetic';
  onProcedureClick: (procedure: DentalProcedure | AestheticProcedure) => void;
}

const ProcedureLibrary: React.FC<ProcedureLibraryProps> = ({
  procedures,
  type,
  onProcedureClick
}) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'growth' | 'market' | 'popularity'>('popularity');
  const [bookmarkedProcedures, setBookmarkedProcedures] = useState<Set<string>>(new Set());
  const [favoriteProcedures, setFavoriteProcedures] = useState<Set<string>>(new Set());
  const [completedProcedures] = useState<Set<string>>(new Set());

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(procedures.map(p => p.category).filter(Boolean)))];

  // Filter and sort procedures
  const filteredProcedures = procedures
    .filter(procedure => {
      const matchesSearch = (procedure.procedure_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (procedure.category || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || procedure.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.procedure_name || '').localeCompare(b.procedure_name || '');
        case 'growth':
          return (b.yearly_growth_percentage || 0) - (a.yearly_growth_percentage || 0);
        case 'market':
          return (b.market_size_usd_millions || 0) - (a.market_size_usd_millions || 0);
        case 'popularity':
        default:
          return favoriteProcedures.has(b.id) ? 1 : -1;
      }
    });

  const toggleBookmark = (procedureId: string) => {
    setBookmarkedProcedures(prev => {
      const newSet = new Set(prev);
      if (newSet.has(procedureId)) {
        newSet.delete(procedureId);
      } else {
        newSet.add(procedureId);
      }
      return newSet;
    });
  };

  const toggleFavorite = (procedureId: string) => {
    setFavoriteProcedures(prev => {
      const newSet = new Set(prev);
      if (newSet.has(procedureId)) {
        newSet.delete(procedureId);
      } else {
        newSet.add(procedureId);
      }
      return newSet;
    });
  };

  const getProcedureProgress = (procedureId: string) => {
    // Mock progress based on favorites and bookmarks
    if (completedProcedures.has(procedureId)) return 100;
    if (favoriteProcedures.has(procedureId)) return 60;
    if (bookmarkedProcedures.has(procedureId)) return 30;
    return 0;
  };

  const generateEducationalContent = (procedure: DentalProcedure | AestheticProcedure) => {
    const mockContent = {
      videoCount: Math.floor(Math.random() * 10) + 3,
      guideCount: Math.floor(Math.random() * 5) + 1,
      quizCount: Math.floor(Math.random() * 3) + 1,
      certificationAvailable: Math.random() > 0.3,
      difficulty: Math.random() > 0.6 ? 'Advanced' : Math.random() > 0.3 ? 'Intermediate' : 'Beginner',
      estimatedTime: Math.floor(Math.random() * 120) + 15, // 15-135 minutes
      rating: (Math.random() * 2 + 3).toFixed(1) // 3.0-5.0 rating
    };
    return mockContent;
  };

  const ProcedureCard = ({ procedure }: { procedure: DentalProcedure | AestheticProcedure }) => {
    const content = generateEducationalContent(procedure);
    const progress = getProcedureProgress(procedure.id);
    const isBookmarked = bookmarkedProcedures.has(procedure.id);
    const isFavorite = favoriteProcedures.has(procedure.id);

    return (
      <Card 
        elevation={3}
        sx={{ 
          height: viewMode === 'grid' ? 380 : 160,
          borderRadius: 3,
          position: 'relative',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: viewMode === 'grid' ? 'translateY(-8px)' : 'translateY(-2px)',
            boxShadow: theme.shadows[8],
          },
          background: `linear-gradient(135deg, ${
            type === 'dental' ? theme.palette.primary.main : theme.palette.secondary.main
          }08, ${theme.palette.background.paper})`
        }}
      >
        <CardActionArea onClick={() => onProcedureClick(procedure)} sx={{ height: '100%' }}>
          {viewMode === 'grid' && (
            <>
              {/* Hero Image/Icon */}
              <Box
                sx={{
                  height: 140,
                  background: `linear-gradient(45deg, ${
                    type === 'dental' ? theme.palette.primary.main : theme.palette.secondary.main
                  }15, ${theme.palette.info.main}10)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: type === 'dental' ? theme.palette.primary.main : theme.palette.secondary.main,
                  }}
                >
                  {type === 'dental' ? <MedicalIcon fontSize="large" /> : <AestheticIcon fontSize="large" />}
                </Avatar>
                
                {/* Action Buttons */}
                <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(procedure.id);
                    }}
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.9)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                    }}
                  >
                    {isBookmarked ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(procedure.id);
                    }}
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.9)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                    }}
                  >
                    {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                  </IconButton>
                </Box>

                {/* Progress Badge */}
                {progress > 0 && (
                  <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
                    <Badge badgeContent={`${progress}%`} color="success">
                      <ProgressIcon color="action" />
                    </Badge>
                  </Box>
                )}
              </Box>

              <CardContent sx={{ p: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom noWrap>
                  {procedure.procedure_name || 'Unknown Procedure'}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip 
                    label={procedure.category || 'General'} 
                    size="small" 
                    color="primary"
                    variant="outlined"
                  />
                  <Chip 
                    label={content.difficulty} 
                    size="small" 
                    color={content.difficulty === 'Advanced' ? 'error' : 
                           content.difficulty === 'Intermediate' ? 'warning' : 'success'}
                  />
                  {content.certificationAvailable && (
                    <Chip 
                      label="Certified" 
                      size="small" 
                      color="info"
                      icon={<CertificateIcon />}
                    />
                  )}
                </Box>

                {/* Learning Resources */}
                <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <VideoIcon fontSize="small" color="action" />
                    <Typography variant="caption">{content.videoCount}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <GuideIcon fontSize="small" color="action" />
                    <Typography variant="caption">{content.guideCount}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <QuizIcon fontSize="small" color="action" />
                    <Typography variant="caption">{content.quizCount}</Typography>
                  </Box>
                </Box>

                {/* Rating and Time */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <StarIcon fontSize="small" sx={{ color: theme.palette.warning.main }} />
                    <Typography variant="caption">{content.rating}</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {content.estimatedTime}m
                  </Typography>
                </Box>

                {/* Progress Bar */}
                {progress > 0 && (
                  <LinearProgress 
                    variant="determinate" 
                    value={progress} 
                    sx={{ 
                      mt: 1, 
                      height: 6, 
                      borderRadius: 3,
                      bgcolor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 3
                      }
                    }} 
                  />
                )}
              </CardContent>
            </>
          )}

          {viewMode === 'list' && (
            <CardContent sx={{ p: 2, height: '100%', display: 'flex', alignItems: 'center' }}>
              <Avatar
                sx={{
                  width: 50,
                  height: 50,
                  bgcolor: type === 'dental' ? theme.palette.primary.main : theme.palette.secondary.main,
                  mr: 2
                }}
              >
                {type === 'dental' ? <MedicalIcon /> : <AestheticIcon />}
              </Avatar>
              
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="h6" fontWeight="bold" noWrap>
                  {procedure.procedure_name || 'Unknown Procedure'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 0.5, mb: 1 }}>
                  <Chip label={procedure.category || 'General'} size="small" />
                  <Chip label={content.difficulty} size="small" color="primary" />
                </Box>
                <Box sx={{ display: 'flex', gap: 3 }}>
                  <Typography variant="caption" color="text.secondary">
                    {content.videoCount} videos • {content.guideCount} guides
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ⭐ {content.rating} • {content.estimatedTime}m
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); toggleBookmark(procedure.id); }}>
                  {isBookmarked ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
                </IconButton>
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); toggleFavorite(procedure.id); }}>
                  {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                </IconButton>
              </Box>
            </CardContent>
          )}
        </CardActionArea>
      </Card>
    );
  };

  return (
    <Box>
      {/* Learning Hub Section */}
      <LearningHub type={type} procedureCount={procedures.length} />
      
      {/* Header with Search and Controls */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {type === 'dental' ? '🦷 Dental' : '✨ Aesthetic'} Procedure Library
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Master procedures with our comprehensive learning resources
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Badge badgeContent={favoriteProcedures.size} color="error">
              <FavoriteIcon color="action" />
            </Badge>
            <Badge badgeContent={bookmarkedProcedures.size} color="primary">
              <BookmarkIcon color="action" />
            </Badge>
          </Box>
        </Box>

        {/* Search and Filters */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search procedures..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          
          <Grid item xs={6} md={2}>
            <TextField
              select
              fullWidth
              label="Category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              SelectProps={{ native: true }}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={6} md={2}>
            <TextField
              select
              fullWidth
              label="Sort by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              SelectProps={{ native: true }}
            >
              <option value="popularity">Popularity</option>
              <option value="name">Name</option>
              <option value="growth">Growth</option>
              <option value="market">Market Size</option>
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(_, newMode) => newMode && setViewMode(newMode)}
                size="small"
              >
                <ToggleButton value="grid">
                  <GridViewIcon />
                </ToggleButton>
                <ToggleButton value="list">
                  <ListViewIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Procedure Grid/List */}
      <Grid container spacing={viewMode === 'grid' ? 3 : 2}>
        {filteredProcedures.map(procedure => (
          <Grid 
            item 
            xs={12} 
            sm={viewMode === 'grid' ? 6 : 12} 
            md={viewMode === 'grid' ? 4 : 12} 
            lg={viewMode === 'grid' ? 3 : 12}
            key={procedure.id}
          >
            <ProcedureCard procedure={procedure} />
          </Grid>
        ))}
      </Grid>

      {filteredProcedures.length === 0 && (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <LearnIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No procedures found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filter criteria
          </Typography>
        </Paper>
      )}

      {/* Floating Action Button for Quick Actions */}
      <Zoom in={filteredProcedures.length > 0}>
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000
          }}
          onClick={() => {
            // Quick action menu
          }}
        >
          <LearnIcon />
        </Fab>
      </Zoom>
    </Box>
  );
};

export default ProcedureLibrary;