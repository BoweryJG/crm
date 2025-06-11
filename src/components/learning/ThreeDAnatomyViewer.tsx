// 3D Anatomy Viewer - Interactive anatomical visualization for procedure training
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Slider,
  ToggleButtonGroup,
  ToggleButton,
  FormControlLabel,
  Switch,
  Alert,
  AlertTitle,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  alpha,
  Stack,
  Divider,
  Grid
} from '@mui/material';
import {
  ThreeDRotation as ThreeDIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  RotateLeft as RotateLeftIcon,
  RotateRight as RotateRightIcon,
  Refresh as ResetIcon,
  Visibility as ViewIcon,
  VisibilityOff as HideIcon,
  CenterFocusStrong as CenterIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  TouchApp as InteractIcon,
  Warning as WarningIcon,
  LocationOn as PointIcon,
  Info as InfoIcon,
  ExpandMore as ExpandIcon,
  Layers as LayersIcon,
  ColorLens as ColorIcon,
  FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  Settings as SettingsIcon,
  Save as SaveIcon,
  Share as ShareIcon,
  Science as AnatomyIcon,
  Speed as VelocityIcon,
  RadioButtonChecked as ActiveIcon,
  RadioButtonUnchecked as InactiveIcon
} from '@mui/icons-material';
import { procedureTrainingService } from '../../services/procedureTrainingService';
import type { AnatomyRegion, InjectionSite, DangerZone } from '../../services/procedureTrainingService';

interface ThreeDAnatomyViewerProps {
  anatomyRegion: AnatomyRegion;
  onInjectionPointClick?: (injectionSite: InjectionSite) => void;
  onDangerZoneHover?: (dangerZone: DangerZone) => void;
  learningObjectives?: string[];
  interactive?: boolean;
  showControls?: boolean;
  fullscreen?: boolean;
}

interface ViewerState {
  rotation: { x: number; y: number; z: number };
  zoom: number;
  position: { x: number; y: number; z: number };
  showInjectionPoints: boolean;
  showDangerZones: boolean;
  showAnatomicalStructures: boolean;
  selectedInjectionSite: InjectionSite | null;
  selectedDangerZone: DangerZone | null;
  isAnimating: boolean;
  viewMode: '3d' | 'cross_section' | 'layers';
  opacity: number;
  colorMode: 'realistic' | 'educational' | 'highlight';
}

interface InteractionPoint {
  id: string;
  position: { x: number; y: number; z: number };
  type: 'injection' | 'danger' | 'structure';
  data: InjectionSite | DangerZone | any;
  visible: boolean;
}

const ThreeDAnatomyViewer: React.FC<ThreeDAnatomyViewerProps> = ({
  anatomyRegion,
  onInjectionPointClick,
  onDangerZoneHover,
  learningObjectives = [],
  interactive = true,
  showControls = true,
  fullscreen = false
}) => {
  const theme = useTheme();
  const viewerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State
  const [viewerState, setViewerState] = useState<ViewerState>({
    rotation: { x: 0, y: 0, z: 0 },
    zoom: 1,
    position: { x: 0, y: 0, z: 0 },
    showInjectionPoints: true,
    showDangerZones: true,
    showAnatomicalStructures: true,
    selectedInjectionSite: null,
    selectedDangerZone: null,
    isAnimating: false,
    viewMode: '3d',
    opacity: 1,
    colorMode: 'educational'
  });

  const [isFullscreen, setIsFullscreen] = useState(fullscreen);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [interactionPoints, setInteractionPoints] = useState<InteractionPoint[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize 3D viewer
  useEffect(() => {
    initializeViewer();
    generateInteractionPoints();
  }, [anatomyRegion]);

  // Update viewer when state changes
  useEffect(() => {
    if (!loading) {
      updateViewer();
    }
  }, [viewerState, loading]);

  const initializeViewer = async () => {
    try {
      setLoading(true);
      
      // Simulate 3D model loading
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Initialize WebGL context or Three.js scene here
      // For demo purposes, we'll simulate the 3D environment
      
      setLoading(false);
    } catch (error) {
      console.error('Error initializing 3D viewer:', error);
      setLoading(false);
    }
  };

  const generateInteractionPoints = () => {
    const points: InteractionPoint[] = [];

    // Add injection sites
    anatomyRegion.injection_sites.forEach(site => {
      points.push({
        id: `injection_${site.name}`,
        position: site.coordinates,
        type: 'injection',
        data: site,
        visible: true
      });
    });

    // Add danger zones
    anatomyRegion.danger_zones.forEach(zone => {
      points.push({
        id: `danger_${zone.name}`,
        position: zone.coordinates,
        type: 'danger',
        data: zone,
        visible: true
      });
    });

    // Add anatomical structures
    anatomyRegion.key_structures.forEach((structure, index) => {
      points.push({
        id: `structure_${index}`,
        position: { 
          x: Math.random() * 100 - 50, 
          y: Math.random() * 100 - 50, 
          z: Math.random() * 50 
        },
        type: 'structure',
        data: { name: structure },
        visible: true
      });
    });

    setInteractionPoints(points);
  };

  const updateViewer = () => {
    // Update 3D scene based on viewerState
    // This would typically involve Three.js or WebGL operations
    console.log('Updating 3D viewer with state:', viewerState);
  };

  const handleRotate = (axis: 'x' | 'y' | 'z', delta: number) => {
    setViewerState(prev => ({
      ...prev,
      rotation: {
        ...prev.rotation,
        [axis]: prev.rotation[axis] + delta
      }
    }));
  };

  const handleZoom = (delta: number) => {
    setViewerState(prev => ({
      ...prev,
      zoom: Math.max(0.5, Math.min(3, prev.zoom + delta))
    }));
  };

  const handleReset = () => {
    setViewerState(prev => ({
      ...prev,
      rotation: { x: 0, y: 0, z: 0 },
      zoom: 1,
      position: { x: 0, y: 0, z: 0 }
    }));
  };

  const handleInjectionSiteClick = (site: InjectionSite) => {
    setViewerState(prev => ({
      ...prev,
      selectedInjectionSite: site
    }));
    setDetailDialogOpen(true);
    onInjectionPointClick?.(site);
  };

  const handleDangerZoneHover = (zone: DangerZone) => {
    setViewerState(prev => ({
      ...prev,
      selectedDangerZone: zone
    }));
    onDangerZoneHover?.(zone);
  };

  const toggleAnimation = () => {
    setViewerState(prev => ({
      ...prev,
      isAnimating: !prev.isAnimating
    }));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    
    if (!isFullscreen && viewerRef.current) {
      viewerRef.current.requestFullscreen?.();
    } else if (document.fullscreenElement) {
      document.exitFullscreen?.();
    }
  };

  const getRiskLevelColor = (riskLevel: DangerZone['risk_level']) => {
    const colors = {
      low: theme.palette.success.main,
      medium: theme.palette.warning.main,
      high: theme.palette.error.main,
      critical: theme.palette.error.dark
    };
    return colors[riskLevel];
  };

  const getInteractionPointColor = (point: InteractionPoint) => {
    switch (point.type) {
      case 'injection':
        return theme.palette.primary.main;
      case 'danger':
        return getRiskLevelColor((point.data as DangerZone).risk_level);
      case 'structure':
        return theme.palette.info.main;
      default:
        return theme.palette.grey[500];
    }
  };

  return (
    <Box 
      ref={viewerRef}
      sx={{ 
        position: 'relative',
        height: isFullscreen ? '100vh' : 600,
        width: '100%',
        borderRadius: isFullscreen ? 0 : 2,
        overflow: 'hidden',
        bgcolor: 'grey.100'
      }}
    >
      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          cursor: interactive ? 'grab' : 'default'
        }}
      />

      {/* Loading Overlay */}
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha(theme.palette.background.default, 0.9),
            zIndex: 10
          }}
        >
          <Stack alignItems="center" spacing={2}>
            <ThreeDIcon sx={{ fontSize: 60, color: 'primary.main', animation: 'spin 2s linear infinite' }} />
            <Typography variant="h6">Loading 3D Anatomy Model...</Typography>
            <Typography variant="body2" color="text.secondary">
              {anatomyRegion.name}
            </Typography>
          </Stack>
        </Box>
      )}

      {/* Viewer Controls */}
      {showControls && !loading && (
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            p: 1,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.background.paper, 0.9)
          }}
        >
          <Stack direction="row" spacing={1}>
            <Tooltip title="Zoom In">
              <IconButton size="small" onClick={() => handleZoom(0.1)}>
                <ZoomInIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Zoom Out">
              <IconButton size="small" onClick={() => handleZoom(-0.1)}>
                <ZoomOutIcon />
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem />
            <Tooltip title="Rotate Left">
              <IconButton size="small" onClick={() => handleRotate('y', -15)}>
                <RotateLeftIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Rotate Right">
              <IconButton size="small" onClick={() => handleRotate('y', 15)}>
                <RotateRightIcon />
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem />
            <Tooltip title="Reset View">
              <IconButton size="small" onClick={handleReset}>
                <ResetIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Center View">
              <IconButton size="small" onClick={() => handleReset()}>
                <CenterIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Paper>
      )}

      {/* Animation Controls */}
      {showControls && !loading && (
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            p: 1,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.background.paper, 0.9)
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title={viewerState.isAnimating ? "Pause Animation" : "Start Animation"}>
              <IconButton size="small" onClick={toggleAnimation}>
                {viewerState.isAnimating ? <PauseIcon /> : <PlayIcon />}
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem />
            <Tooltip title="Settings">
              <IconButton size="small" onClick={() => setSettingsOpen(true)}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
              <IconButton size="small" onClick={toggleFullscreen}>
                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
            </Tooltip>
          </Stack>
        </Paper>
      )}

      {/* Layer Controls */}
      {showControls && !loading && (
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            p: 2,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.background.paper, 0.9),
            minWidth: 200
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Layers
          </Typography>
          <Stack spacing={1}>
            <FormControlLabel
              control={
                <Switch
                  checked={viewerState.showInjectionPoints}
                  onChange={(e) => setViewerState(prev => ({
                    ...prev,
                    showInjectionPoints: e.target.checked
                  }))}
                  size="small"
                />
              }
              label="Injection Points"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={viewerState.showDangerZones}
                  onChange={(e) => setViewerState(prev => ({
                    ...prev,
                    showDangerZones: e.target.checked
                  }))}
                  size="small"
                />
              }
              label="Danger Zones"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={viewerState.showAnatomicalStructures}
                  onChange={(e) => setViewerState(prev => ({
                    ...prev,
                    showAnatomicalStructures: e.target.checked
                  }))}
                  size="small"
                />
              }
              label="Anatomical Structures"
            />
          </Stack>
        </Paper>
      )}

      {/* Interaction Points Info */}
      {showControls && !loading && (
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            p: 2,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.background.paper, 0.9),
            maxWidth: 300,
            maxHeight: 200,
            overflow: 'auto'
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Interactive Points
          </Typography>
          <List dense>
            {interactionPoints
              .filter(point => {
                if (point.type === 'injection' && !viewerState.showInjectionPoints) return false;
                if (point.type === 'danger' && !viewerState.showDangerZones) return false;
                if (point.type === 'structure' && !viewerState.showAnatomicalStructures) return false;
                return true;
              })
              .slice(0, 5)
              .map((point) => (
                <ListItem 
                  key={point.id} 
                  sx={{ py: 0.5 }}
                  onClick={() => {
                    if (point.type === 'injection') {
                      handleInjectionSiteClick(point.data as InjectionSite);
                    } else if (point.type === 'danger') {
                      handleDangerZoneHover(point.data as DangerZone);
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar 
                      sx={{ 
                        width: 24, 
                        height: 24, 
                        bgcolor: alpha(getInteractionPointColor(point), 0.1),
                        color: getInteractionPointColor(point)
                      }}
                    >
                      {point.type === 'injection' ? <PointIcon sx={{ fontSize: 16 }} /> :
                       point.type === 'danger' ? <WarningIcon sx={{ fontSize: 16 }} /> :
                       <AnatomyIcon sx={{ fontSize: 16 }} />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={point.data.name}
                    primaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              ))}
          </List>
        </Paper>
      )}

      {/* Viewer Info */}
      <Paper
        elevation={3}
        sx={{
          position: 'absolute',
          top: 80,
          left: 16,
          p: 2,
          borderRadius: 2,
          bgcolor: alpha(theme.palette.background.paper, 0.9),
          maxWidth: 250
        }}
      >
        <Stack spacing={1}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ThreeDIcon color="primary" />
            {anatomyRegion.name}
          </Typography>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Zoom: {(viewerState.zoom * 100).toFixed(0)}%
            </Typography>
            <br />
            <Typography variant="caption" color="text.secondary">
              Rotation: Y {viewerState.rotation.y}°
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip 
              label={`${anatomyRegion.injection_sites.length} Points`}
              size="small"
              color="primary"
              variant="outlined"
            />
            <Chip 
              label={`${anatomyRegion.danger_zones.length} Zones`}
              size="small"
              color="error"
              variant="outlined"
            />
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default ThreeDAnatomyViewer;