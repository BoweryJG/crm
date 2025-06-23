// Research Lab - Scientific research facility for market intelligence
// Mobile-optimized with compact controls and themed visuals

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Fade,
  Container,
  useMediaQuery,
  useTheme,
  alpha,
  Fab,
  InputAdornment,
  Chip,
  LinearProgress,
  Avatar,
  Paper,
} from '@mui/material';
import {
  Science as LabIcon,
  Search as SearchIcon,
  Biotech as BiotechIcon,
  TrendingUp as TrendingIcon,
  Business as BusinessIcon,
  LocalHospital as HospitalIcon,
  AttachMoney as MoneyIcon,
  FilterList as FilterIcon,
  AutoAwesome as AIIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import { CanvasBase } from './CanvasBase';
import {
  MicroInput,
  ResultTile,
  FloatingControls,
  SwipeableInputDrawer,
  MicroTabs,
} from './MicroComponents';
import { useAuth } from '../../../auth';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../../../themes/ThemeContext';
import glassEffects from '../../../themes/glassEffects';

interface ResearchResult {
  id: string;
  title: string;
  category: 'market' | 'clinical' | 'competitor' | 'financial';
  summary: string;
  confidence: number;
  source: string;
  date: string;
  insights: string[];
  icon: React.ReactNode;
}

const ResearchLab: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { themeMode } = useThemeContext();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ResearchResult[]>([]);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleResearch = () => {
    if (!query.trim()) return;
    
    setLoading(true);
    
    // Simulate AI research
    setTimeout(() => {
      setResults([
        {
          id: '1',
          title: 'BTL Aesthetics Market Growth Analysis',
          category: 'market',
          summary: 'The global energy-based aesthetic devices market is experiencing 12.3% CAGR, with BTL leading innovation in non-invasive treatments.',
          confidence: 92,
          source: 'Industry Reports 2024',
          date: '2024-03-15',
          insights: [
            'Market expected to reach $5.2B by 2026',
            'Non-invasive procedures growing 18% YoY',
            'BTL holds 23% market share in body contouring',
          ],
          icon: <TrendingIcon />,
        },
        {
          id: '2',
          title: 'Clinical Efficacy Study: BTL Exilis Ultra',
          category: 'clinical',
          summary: 'Recent peer-reviewed study demonstrates 94% patient satisfaction rate with BTL Exilis Ultra for facial rejuvenation.',
          confidence: 88,
          source: 'Journal of Aesthetic Medicine',
          date: '2024-02-28',
          insights: [
            '2.5mm average skin tightening after 4 sessions',
            'No downtime reported in 98% of cases',
            'Combines radiofrequency with ultrasound technology',
          ],
          icon: <BiotechIcon />,
        },
        {
          id: '3',
          title: 'Competitive Landscape: CoolSculpting vs BTL',
          category: 'competitor',
          summary: 'BTL Vanquish ME shows 33% faster treatment times compared to CoolSculpting Elite, with broader treatment areas.',
          confidence: 85,
          source: 'Competitive Intelligence',
          date: '2024-03-10',
          insights: [
            'BTL treats 4x larger area per session',
            'No consumables required (cost advantage)',
            'Pain-free vs mild discomfort reported',
          ],
          icon: <BusinessIcon />,
        },
        {
          id: '4',
          title: 'ROI Analysis for Medical Practices',
          category: 'financial',
          summary: 'Average medical practice sees full ROI within 6-8 months when adding BTL aesthetic devices to their service menu.',
          confidence: 90,
          source: 'Practice Analytics Database',
          date: '2024-03-01',
          insights: [
            'Average revenue per treatment: $450-650',
            'Patient retention increases by 35%',
            'Cross-selling opportunities with skincare lines',
          ],
          icon: <MoneyIcon />,
        },
      ]);
      setLoading(false);
    }, 1500);
  };

  const getThemeGlass = () => {
    switch (themeMode) {
      case 'cyber-neon':
        return {
          ...glassEffects.effects.obsidian,
          boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.2)}`,
        };
      case 'ocean-depths':
        return {
          ...glassEffects.effects.museum,
          background: alpha('#003d5c', 0.3),
        };
      default:
        return glassEffects.effects.frostedSteel;
    }
  };

  const categoryTabs = [
    { label: 'All', icon: <LabIcon /> },
    { label: 'Market', icon: <TrendingIcon /> },
    { label: 'Clinical', icon: <BiotechIcon /> },
    { label: 'Competitor', icon: <BusinessIcon /> },
    { label: 'Financial', icon: <MoneyIcon /> },
  ];

  const getCategoryFromTab = (tab: number): string | null => {
    switch (tab) {
      case 1: return 'market';
      case 2: return 'clinical';
      case 3: return 'competitor';
      case 4: return 'financial';
      default: return null;
    }
  };

  const filteredResults = results.filter(r => {
    const category = getCategoryFromTab(activeCategory);
    return !category || r.category === category;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'market': return theme.palette.info.main;
      case 'clinical': return theme.palette.success.main;
      case 'competitor': return theme.palette.warning.main;
      case 'financial': return theme.palette.error.main;
      default: return theme.palette.primary.main;
    }
  };

  return (
    <CanvasBase
      overline="AI RESEARCH FACILITY"
      title="RESEARCH LAB"
      subtitle={isMobile ? "Instant market intelligence" : "AI-powered research and market intelligence at your fingertips"}
      emptyStateIcon={<LabIcon />}
      emptyStateMessage="ENTER QUERY TO BEGIN RESEARCH"
      onSignInClick={() => navigate('/login')}
      isGenerating={loading}
      loadingMessage="ANALYZING DATA SOURCES..."
    >
      <Container maxWidth="lg" sx={{ px: { xs: 0, sm: 2 } }}>
        {/* Search Bar */}
        <Paper
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 3,
            ...getThemeGlass(),
            backgroundColor: alpha(theme.palette.background.paper, 0.3),
          }}
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <MicroInput
              fullWidth
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about markets, competitors, clinical data, or ROI..."
              onKeyPress={(e) => e.key === 'Enter' && handleResearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{ flex: 1 }}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Fab
                size="small"
                color="primary"
                onClick={handleResearch}
                disabled={!query.trim() || loading}
              >
                <AIIcon />
              </Fab>
              {isMobile && (
                <Fab
                  size="small"
                  onClick={() => setFilterDrawerOpen(true)}
                >
                  <FilterIcon />
                </Fab>
              )}
            </Box>
          </Stack>

          {/* Quick Suggestions */}
          <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
            {['BTL market share', 'ROI calculator', 'Clinical studies', 'Competitor analysis'].map((suggestion) => (
              <Chip
                key={suggestion}
                label={suggestion}
                size="small"
                onClick={() => setQuery(suggestion)}
                sx={{
                  cursor: 'pointer',
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                  },
                }}
              />
            ))}
          </Stack>
        </Paper>

        {/* Category Tabs */}
        {!isMobile && results.length > 0 && (
          <MicroTabs
            value={activeCategory}
            onChange={setActiveCategory}
            tabs={categoryTabs}
          />
        )}

        {/* Results */}
        {filteredResults.length > 0 && (
          <Stack spacing={2}>
            {filteredResults.map((result, index) => (
              <Fade key={result.id} in timeout={300 + index * 100}>
                <div>
                  <ResultTile
                    title={result.title}
                    subtitle={`${result.source} • ${result.date}`}
                    content={
                      <Box>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {result.summary}
                        </Typography>
                        <Typography variant="caption" sx={{ letterSpacing: '0.1em', color: theme.palette.primary.main }}>
                          KEY INSIGHTS
                        </Typography>
                        <Stack spacing={1} sx={{ mt: 1 }}>
                          {result.insights.map((insight, i) => (
                            <Stack key={i} direction="row" spacing={1} alignItems="flex-start">
                              <Box
                                sx={{
                                  width: 4,
                                  height: 4,
                                  borderRadius: '50%',
                                  backgroundColor: getCategoryColor(result.category),
                                  mt: 0.75,
                                  flexShrink: 0,
                                }}
                              />
                              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                                {insight}
                              </Typography>
                            </Stack>
                          ))}
                        </Stack>
                      </Box>
                    }
                    icon={result.icon}
                    value={result.confidence}
                    color={getCategoryColor(result.category)}
                    defaultExpanded={!isMobile && index === 0}
                  />
                </div>
              </Fade>
            ))}
          </Stack>
        )}

        {/* Mobile: Filter Drawer */}
        {isMobile && (
          <SwipeableInputDrawer
            open={filterDrawerOpen}
            onOpen={() => setFilterDrawerOpen(true)}
            onClose={() => setFilterDrawerOpen(false)}
            title="FILTER RESULTS"
            height="40vh"
          >
            <MicroTabs
              value={activeCategory}
              onChange={(val) => {
                setActiveCategory(val);
                setFilterDrawerOpen(false);
              }}
              tabs={categoryTabs}
            />
          </SwipeableInputDrawer>
        )}
      </Container>
    </CanvasBase>
  );
};

export default ResearchLab;