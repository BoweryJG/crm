// Micro Components Library for Mobile-First Intelligence Hub
// Compact, touch-optimized components with theme integration

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Autocomplete,
  IconButton,
  Drawer,
  Fab,
  Card,
  Collapse,
  InputAdornment,
  Chip,
  SwipeableDrawer,
  useTheme,
  alpha,
  Zoom,
  Slide,
  styled,
  ButtonBase,
  Typography,
  Stack,
} from '@mui/material';
import {
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useThemeContext } from '../../../themes/ThemeContext';
import glassEffects from '../../../themes/glassEffects';

// Compact Input Field with Floating Label
export const MicroInput = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    height: 36,
    fontSize: '0.875rem',
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.75rem',
    transform: 'translate(12px, 8px) scale(1)',
    '&.MuiInputLabel-shrink': {
      transform: 'translate(12px, -9px) scale(0.75)',
    },
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: alpha(theme.palette.divider, 0.2),
    },
    '&:hover fieldset': {
      borderColor: alpha(theme.palette.primary.main, 0.3),
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: 1,
    },
  },
}));

// Quick Select Dropdown with Search
interface QuickSelectProps<T> {
  options: T[];
  value: T | null;
  onChange: (value: T | null) => void;
  label: string;
  getOptionLabel: (option: T) => string;
  placeholder?: string;
  sx?: any;
}

export function QuickSelect<T>({
  options,
  value,
  onChange,
  label,
  getOptionLabel,
  placeholder,
  sx,
}: QuickSelectProps<T>) {
  const theme = useTheme();
  const { themeMode } = useThemeContext();

  const getThemeGlass = () => {
    switch (themeMode) {
      case 'cyber-neon':
        return glassEffects.effects.obsidian;
      case 'ocean-depths':
        return glassEffects.effects.museum;
      default:
        return glassEffects.effects.frostedSteel;
    }
  };

  return (
    <Autocomplete
      options={options}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      getOptionLabel={getOptionLabel}
      renderInput={(params) => (
        <MicroInput
          {...params}
          label={label}
          placeholder={placeholder}
          size="small"
          sx={{
            ...getThemeGlass(),
            backgroundColor: alpha(theme.palette.background.paper, 0.3),
            ...sx,
          }}
        />
      )}
      sx={{
        '& .MuiAutocomplete-popupIndicator': {
          transform: 'scale(0.8)',
        },
        '& .MuiAutocomplete-clearIndicator': {
          transform: 'scale(0.8)',
        },
      }}
    />
  );
}

// Expandable Result Card
interface ResultTileProps {
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  value?: number;
  color?: string;
  defaultExpanded?: boolean;
}

export const ResultTile: React.FC<ResultTileProps> = ({
  title,
  subtitle,
  content,
  icon,
  value,
  color,
  defaultExpanded = false,
}) => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const [expanded, setExpanded] = useState(defaultExpanded);

  const getThemeGlass = () => {
    switch (themeMode) {
      case 'cyber-neon':
        return {
          ...glassEffects.effects.obsidian,
          border: `1px solid ${alpha(color || theme.palette.primary.main, 0.3)}`,
        };
      default:
        return glassEffects.effects.frostedSteel;
    }
  };

  return (
    <Card
      sx={{
        mb: 1,
        ...getThemeGlass(),
        backgroundColor: alpha(theme.palette.background.paper, 0.3),
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
      onClick={() => setExpanded(!expanded)}
    >
      <Box sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          {icon && (
            <Box sx={{ color: color || theme.palette.primary.main }}>
              {icon}
            </Box>
          )}
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {value !== undefined && (
            <Chip
              label={`${value}%`}
              size="small"
              sx={{
                backgroundColor: alpha(color || theme.palette.primary.main, 0.2),
                color: color || theme.palette.primary.main,
                fontWeight: 600,
              }}
            />
          )}
          <IconButton size="small" onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}>
            {expanded ? <CollapseIcon /> : <ExpandIcon />}
          </IconButton>
        </Stack>
      </Box>
      <Collapse in={expanded}>
        <Box sx={{ px: 2, pb: 2, pt: 0 }}>
          {content}
        </Box>
      </Collapse>
    </Card>
  );
};

// Floating Action Button Group
interface FloatingControlsProps {
  actions: Array<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    color?: 'primary' | 'secondary' | 'default';
  }>;
  position?: 'bottom-right' | 'bottom-center' | 'bottom-left';
}

export const FloatingControls: React.FC<FloatingControlsProps> = ({
  actions,
  position = 'bottom-right',
}) => {
  const [open, setOpen] = useState(false);

  const getPositionStyles = () => {
    switch (position) {
      case 'bottom-center':
        return { bottom: 16, left: '50%', transform: 'translateX(-50%)' };
      case 'bottom-left':
        return { bottom: 16, left: 16 };
      default:
        return { bottom: 16, right: 16 };
    }
  };

  return (
    <Box sx={{ position: 'fixed', ...getPositionStyles(), zIndex: 1000 }}>
      <Stack spacing={1} alignItems="center">
        {actions.map((action, index) => (
          <Zoom
            key={index}
            in={open}
            timeout={{ enter: 200 + index * 50, exit: 200 }}
            unmountOnExit
          >
            <Fab
              size="small"
              color={action.color || 'default'}
              onClick={action.onClick}
              sx={{ boxShadow: 4 }}
            >
              {action.icon}
            </Fab>
          </Zoom>
        ))}
        <Fab
          color="primary"
          onClick={() => setOpen(!open)}
          sx={{
            boxShadow: 6,
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        >
          <AddIcon />
        </Fab>
      </Stack>
    </Box>
  );
};

// Swipeable Input Drawer
interface SwipeableInputDrawerProps {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  anchor?: 'bottom' | 'right';
  height?: string | number;
}

export const SwipeableInputDrawer: React.FC<SwipeableInputDrawerProps> = ({
  open,
  onOpen,
  onClose,
  title,
  children,
  anchor = 'bottom',
  height = '50vh',
}) => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();

  const getThemeGlass = () => {
    switch (themeMode) {
      case 'chanel-noir':
        return glassEffects.effects.carbon;
      case 'cartier-gold':
        return glassEffects.effects.goldInfused;
      default:
        return glassEffects.effects.museum;
    }
  };

  return (
    <SwipeableDrawer
      anchor={anchor}
      open={open}
      onOpen={onOpen}
      onClose={onClose}
      PaperProps={{
        sx: {
          height: anchor === 'bottom' ? height : '100%',
          width: anchor === 'right' ? { xs: '85vw', sm: '400px' } : '100%',
          borderTopLeftRadius: anchor === 'bottom' ? 16 : 0,
          borderTopRightRadius: anchor === 'bottom' ? 16 : 0,
          ...getThemeGlass(),
          backgroundColor: alpha(theme.palette.background.paper, 0.95),
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        {/* Swipe Handle for Bottom Drawer */}
        {anchor === 'bottom' && (
          <Box
            sx={{
              width: 40,
              height: 4,
              backgroundColor: alpha(theme.palette.text.primary, 0.2),
              borderRadius: 2,
              mx: 'auto',
              mb: 2,
            }}
          />
        )}
        
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" sx={{ letterSpacing: '0.1em' }}>
            {title}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
        
        {children}
      </Box>
    </SwipeableDrawer>
  );
};

// Compact Tab Selector
interface MicroTabsProps {
  value: number;
  onChange: (value: number) => void;
  tabs: Array<{
    label: string;
    icon?: React.ReactNode;
  }>;
}

export const MicroTabs: React.FC<MicroTabsProps> = ({ value, onChange, tabs }) => {
  const theme = useTheme();
  
  return (
    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
      {tabs.map((tab, index) => (
        <ButtonBase
          key={index}
          onClick={() => onChange(index)}
          sx={{
            flex: 1,
            py: 1,
            px: 2,
            borderRadius: 1,
            backgroundColor: value === index
              ? alpha(theme.palette.primary.main, 0.2)
              : alpha(theme.palette.background.paper, 0.3),
            border: `1px solid ${value === index
              ? alpha(theme.palette.primary.main, 0.3)
              : alpha(theme.palette.divider, 0.1)}`,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            {tab.icon && <Box sx={{ fontSize: 18 }}>{tab.icon}</Box>}
            <Typography
              variant="caption"
              sx={{
                fontWeight: value === index ? 600 : 400,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              {tab.label}
            </Typography>
          </Stack>
        </ButtonBase>
      ))}
    </Stack>
  );
};