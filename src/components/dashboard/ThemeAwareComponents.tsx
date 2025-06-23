// Theme-aware utility functions and components
// Provides dynamic theme colors and effects for all dashboard components

import { alpha } from '@mui/material/styles';
import glassEffects from '../../themes/glassEffects';

export interface ThemeAccents {
  primary: string;
  secondary: string;
  glow: string;
  success?: string;
  warning?: string;
  error?: string;
}

export const getThemeAccents = (themeMode: string): ThemeAccents => {
  const themeAccents: Record<string, ThemeAccents> = {
    // Aviation themes
    'boeing-cockpit': { 
      primary: '#1e3a8a', 
      secondary: '#f59e0b', 
      glow: '#00ff41',
      success: '#00ff41',
      warning: '#f59e0b',
      error: '#ff0040'
    },
    'airbus-modern': { 
      primary: '#0ea5e9', 
      secondary: '#06b6d4', 
      glow: '#00ffff',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    },
    'gulfstream-elite': { 
      primary: '#7c3aed', 
      secondary: '#c084fc', 
      glow: '#e879f9',
      success: '#8b5cf6',
      warning: '#f59e0b',
      error: '#ec4899'
    },
    
    // Luxury themes
    'chanel-noir': { 
      primary: '#000000', 
      secondary: '#d4af37', 
      glow: '#ffffff',
      success: '#d4af37',
      warning: '#ffffff',
      error: '#dc2626'
    },
    'cartier-rouge': { 
      primary: '#c41e3a', 
      secondary: '#ffd700', 
      glow: '#ff6b6b',
      success: '#ffd700',
      warning: '#fbbf24',
      error: '#c41e3a'
    },
    'hermes-orange': { 
      primary: '#ff6700', 
      secondary: '#8b4513', 
      glow: '#ffa500',
      success: '#84cc16',
      warning: '#ff6700',
      error: '#dc2626'
    },
    
    // Medical themes
    'surgical-steel': { 
      primary: '#374151', 
      secondary: '#60a5fa', 
      glow: '#3b82f6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    },
    'dental-white': { 
      primary: '#0891b2', 
      secondary: '#06b6d4', 
      glow: '#67e8f9',
      success: '#10b981',
      warning: '#fbbf24',
      error: '#f87171'
    },
    
    // Beauty themes
    'rose-gold': { 
      primary: '#b91c1c', 
      secondary: '#f87171', 
      glow: '#fbbf24',
      success: '#fbbf24',
      warning: '#f87171',
      error: '#b91c1c'
    },
    'botox-blue': { 
      primary: '#1e40af', 
      secondary: '#60a5fa', 
      glow: '#93c5fd',
      success: '#60a5fa',
      warning: '#fbbf24',
      error: '#ef4444'
    },
    
    // Tech themes
    'cyber-neon': { 
      primary: '#8b5cf6', 
      secondary: '#ec4899', 
      glow: '#f97316',
      success: '#10b981',
      warning: '#f97316',
      error: '#ec4899'
    },
    'quantum-field': { 
      primary: '#4c1d95', 
      secondary: '#7c3aed', 
      glow: '#c084fc',
      success: '#8b5cf6',
      warning: '#f59e0b',
      error: '#dc2626'
    },
    
    // Nature themes
    'ocean-depths': { 
      primary: '#0f172a', 
      secondary: '#0284c7', 
      glow: '#0ea5e9',
      success: '#10b981',
      warning: '#fbbf24',
      error: '#ef4444'
    },
    'emerald-forest': { 
      primary: '#14532d', 
      secondary: '#16a34a', 
      glow: '#4ade80',
      success: '#4ade80',
      warning: '#fbbf24',
      error: '#dc2626'
    },
    
    // Classic themes
    'space': { 
      primary: '#8860D0', 
      secondary: '#5CE1E6', 
      glow: '#FFD700',
      success: '#00E676',
      warning: '#FFD700',
      error: '#FF3D00'
    },
    'masterpiece': { 
      primary: '#ff6b6b', 
      secondary: '#4ecdc4', 
      glow: '#45b7d1',
      success: '#96ceb4',
      warning: '#ffeaa7',
      error: '#ff6b6b'
    },
    'gallery': { 
      primary: '#ffd700', 
      secondary: '#ffab00', 
      glow: '#ff6f00',
      success: '#00e676',
      warning: '#ff6f00',
      error: '#ff3d00'
    },
    'boeing': { 
      primary: '#00e676', 
      secondary: '#00c853', 
      glow: '#64dd17',
      success: '#00e676',
      warning: '#ffab00',
      error: '#ff3d00'
    },
    'quantum': { 
      primary: '#e91e63', 
      secondary: '#f06292', 
      glow: '#ce93d8',
      success: '#ab47bc',
      warning: '#ffab00',
      error: '#e91e63'
    },
    
    // Default/fallback
    'default': { 
      primary: '#1976d2', 
      secondary: '#42a5f5', 
      glow: '#90caf9',
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336'
    }
  };
  
  return themeAccents[themeMode] || themeAccents.space;
};

export const getThemeGlass = (themeMode: string) => {
  // Dark themes
  const darkThemes = [
    'boeing-cockpit', 'airbus-modern', 'chanel-noir', 
    'surgical-steel', 'cyber-neon', 'ocean-depths',
    'quantum-field', 'space'
  ];
  
  // Luxury themes
  const luxuryThemes = [
    'cartier-rouge', 'hermes-orange', 'rose-gold',
    'chanel-noir', 'gulfstream-elite'
  ];
  
  // Medical/Clean themes
  const cleanThemes = [
    'dental-white', 'surgical-steel', 'botox-blue'
  ];
  
  if (darkThemes.includes(themeMode)) {
    return glassEffects.effects.obsidian;
  }
  
  if (luxuryThemes.includes(themeMode)) {
    return glassEffects.effects.goldInfused;
  }
  
  if (cleanThemes.includes(themeMode)) {
    return glassEffects.effects.frostedPearl;
  }
  
  // Default
  return glassEffects.effects.museum;
};

export const getThemeAnimation = (themeMode: string) => {
  const techThemes = ['cyber-neon', 'quantum-field', 'airbus-modern'];
  const classicThemes = ['boeing-cockpit', 'surgical-steel', 'dental-white'];
  
  if (techThemes.includes(themeMode)) {
    return {
      duration: 'fast',
      easing: 'easeOut',
      glow: true,
      pulse: true
    };
  }
  
  if (classicThemes.includes(themeMode)) {
    return {
      duration: 'slow',
      easing: 'easeInOut',
      glow: false,
      pulse: false
    };
  }
  
  return {
    duration: 'normal',
    easing: 'ease',
    glow: true,
    pulse: true
  };
};

export const getStatColors = (themeMode: string, index: number) => {
  const themeColors: Record<string, string[]> = {
    // Use specific color palettes for each theme
    'boeing-cockpit': ['#1e3a8a', '#f59e0b', '#00ff41', '#ef4444'],
    'airbus-modern': ['#0ea5e9', '#06b6d4', '#10b981', '#60a5fa'],
    'chanel-noir': ['#000000', '#d4af37', '#ffffff', '#666666'],
    'cartier-rouge': ['#c41e3a', '#ffd700', '#ff6b6b', '#fbbf24'],
    'cyber-neon': ['#8b5cf6', '#ec4899', '#f97316', '#10b981'],
    'space': ['#8860D0', '#5CE1E6', '#FFD700', '#00E676'],
    'masterpiece': ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'],
    'gallery': ['#ffd700', '#ffab00', '#ff6f00', '#ff3d00'],
    'default': ['#1976d2', '#42a5f5', '#90caf9', '#bbdefb'],
  };
  
  const colors = themeColors[themeMode] || themeColors.default;
  return colors[index % colors.length];
};

// Priority colors that adapt to theme
export const getPriorityColor = (priority: string, themeAccents: ThemeAccents) => {
  switch (priority) {
    case 'High':
    case 'high':
      return themeAccents.error || '#ff0040';
    case 'Medium':
    case 'medium':
      return themeAccents.warning || '#ffaa00';
    case 'Low':
    case 'low':
      return themeAccents.success || '#00ff41';
    default:
      return alpha(themeAccents.primary, 0.6);
  }
};