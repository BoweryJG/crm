// SUIS Phase 8: Enhanced Theme System
// Dynamic Theme Customization Component

import React, { useState, useEffect } from 'react';
import { useSUIS } from './SUISProvider';
import { UserPreferences } from '../types';
import { 
  Palette, Sun, Moon, Monitor, Check, Sliders,
  Eye, Copy, Download, RefreshCw, Sparkles,
  Droplet, Layout, Type, Square, Brain
} from 'lucide-react';

interface ColorPreset {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
}

interface ThemePreview {
  component: string;
  preview: React.ReactNode;
}

const ThemeCustomizer: React.FC = () => {
  const { state, actions } = useSUIS();
  const [preferences, setPreferences] = useState<any>(
    state.intelligenceProfile?.preferences || {
      userId: state.user?.id || '',
      theme: 'light',
      notifications: {
        email: true,
        push: true,
        sms: false,
        frequency: 'realtime',
        quietHours: {
          enabled: false,
          start: '22:00',
          end: '08:00',
          timezone: 'UTC'
        }
      },
      display: {
        density: 'comfortable',
        sidebarCollapsed: false,
        showMetrics: true,
        defaultView: 'dashboard'
      },
      aiPreferences: {
        autoSuggestions: true,
        personalizedInsights: true,
        dataUsageConsent: true,
        preferredModels: ['gpt-4', 'claude-3']
      },
      accessibility: {
        highContrast: false,
        fontSize: 'medium',
        reduceMotion: false,
        screenReaderOptimized: false
      },
      customizations: {
        dashboardLayout: {},
        shortcuts: [],
        savedFilters: [],
        customFields: []
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  );

  const [selectedPreset, setSelectedPreset] = useState<string>('default');
  const [customColors, setCustomColors] = useState({
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    accent: '#EC4899',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    background: '#FFFFFF',
    surface: '#F9FAFB',
    text: '#111827',
    textSecondary: '#6B7280'
  });

  const colorPresets: ColorPreset[] = [
    {
      id: 'default',
      name: 'Default Blue',
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      accent: '#EC4899',
      background: '#FFFFFF',
      surface: '#F9FAFB',
      text: '#111827',
      textSecondary: '#6B7280'
    },
    {
      id: 'emerald',
      name: 'Emerald Fresh',
      primary: '#10B981',
      secondary: '#14B8A6',
      accent: '#F59E0B',
      background: '#FFFFFF',
      surface: '#F0FDF4',
      text: '#064E3B',
      textSecondary: '#047857'
    },
    {
      id: 'purple',
      name: 'Purple Dream',
      primary: '#8B5CF6',
      secondary: '#EC4899',
      accent: '#F59E0B',
      background: '#FDFCFF',
      surface: '#FAF5FF',
      text: '#2E1065',
      textSecondary: '#6B21A8'
    },
    {
      id: 'midnight',
      name: 'Midnight Dark',
      primary: '#60A5FA',
      secondary: '#A78BFA',
      accent: '#F472B6',
      background: '#0F172A',
      surface: '#1E293B',
      text: '#F1F5F9',
      textSecondary: '#CBD5E1'
    }
  ];

  const fontOptions = [
    { value: 'system', label: 'System Default', family: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
    { value: 'inter', label: 'Inter', family: 'Inter, sans-serif' },
    { value: 'roboto', label: 'Roboto', family: 'Roboto, sans-serif' },
    { value: 'poppins', label: 'Poppins', family: 'Poppins, sans-serif' }
  ];

  const densityOptions = [
    { value: 'compact', label: 'Compact', spacing: '0.5rem' },
    { value: 'comfortable', label: 'Comfortable', spacing: '1rem' },
    { value: 'spacious', label: 'Spacious', spacing: '1.5rem' }
  ];

  const handlePresetChange = (presetId: string) => {
    const preset = colorPresets.find(p => p.id === presetId);
    if (preset) {
      setSelectedPreset(presetId);
      setCustomColors({
        ...customColors,
        primary: preset.primary,
        secondary: preset.secondary,
        accent: preset.accent,
        background: preset.background,
        surface: preset.surface,
        text: preset.text,
        textSecondary: preset.textSecondary
      });
    }
  };

  const handleColorChange = (colorKey: string, value: string) => {
    setCustomColors({
      ...customColors,
      [colorKey]: value
    });
    setSelectedPreset('custom');
  };

  const handleThemeToggle = (theme: 'light' | 'dark' | 'system') => {
    setPreferences({
      ...preferences,
      theme
    });
  };

  const applyTheme = () => {
    // Apply theme to CSS variables
    const root = document.documentElement;
    Object.entries(customColors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Save preferences (TODO: implement theme preference saving)
    // For now, just update the theme with custom colors
    actions.updateTheme({ 
      currentTheme: preferences.theme as any,
      themes: state.theme.themes 
    });
  };

  const exportTheme = () => {
    const theme = {
      name: 'Custom Theme',
      colors: customColors,
      preferences: preferences
    };
    
    const blob = new Blob([JSON.stringify(theme, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'suis-theme.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const ComponentPreview: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">{title}</h4>
      {children}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Theme Customizer</h2>
          <p className="text-gray-600 dark:text-gray-400">Personalize your SUIS experience</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportTheme}
            className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Theme
          </button>
          <button
            onClick={applyTheme}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Check className="w-4 h-4 mr-2" />
            Apply Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Theme Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Theme Mode */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Sun className="w-5 h-5 mr-2" />
              Theme Mode
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleThemeToggle('light')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  preferences.theme === 'light' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Sun className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm font-medium">Light</p>
              </button>
              <button
                onClick={() => handleThemeToggle('dark')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  preferences.theme === 'dark' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Moon className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm font-medium">Dark</p>
              </button>
              <button
                onClick={() => handleThemeToggle('system')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  preferences.theme === 'system' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Monitor className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm font-medium">System</p>
              </button>
            </div>
          </div>

          {/* Color Presets */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              Color Presets
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {colorPresets.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetChange(preset.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedPreset === preset.id 
                      ? 'border-blue-500' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{preset.name}</span>
                    {selectedPreset === preset.id && <Check className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div className="flex space-x-1">
                    <div 
                      className="w-8 h-8 rounded" 
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div 
                      className="w-8 h-8 rounded" 
                      style={{ backgroundColor: preset.secondary }}
                    />
                    <div 
                      className="w-8 h-8 rounded" 
                      style={{ backgroundColor: preset.accent }}
                    />
                    <div 
                      className="w-8 h-8 rounded border border-gray-200" 
                      style={{ backgroundColor: preset.background }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Droplet className="w-5 h-5 mr-2" />
              Custom Colors
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(customColors).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Display Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Layout className="w-5 h-5 mr-2" />
              Display Settings
            </h3>
            
            <div className="space-y-4">
              {/* Font Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Font Family
                </label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  defaultValue="system"
                >
                  {fontOptions.map(font => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Density */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Display Density
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {densityOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => setPreferences({
                        ...preferences,
                        display: { ...preferences.display, density: option.value as any }
                      })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        preferences.display.density === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="text-sm font-medium">{option.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Font Size
                </label>
                <div className="flex items-center space-x-4">
                  <button className="p-2 border border-gray-300 rounded">
                    <Type className="w-4 h-4" />
                  </button>
                  <input
                    type="range"
                    min="12"
                    max="20"
                    defaultValue="16"
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-12">16px</span>
                </div>
              </div>

              {/* Border Radius */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Border Radius
                </label>
                <div className="flex items-center space-x-4">
                  <Square className="w-4 h-4" />
                  <input
                    type="range"
                    min="0"
                    max="16"
                    defaultValue="8"
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-12">8px</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Enhancements */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              AI Theme Suggestions
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Let AI analyze your usage patterns and suggest optimal theme settings
            </p>
            <button className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700">
              <Brain className="w-5 h-5 mr-2" />
              Generate AI Suggestions
            </button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Live Preview
            </h3>
            
            <div className="space-y-4">
              {/* Button Preview */}
              <ComponentPreview title="Buttons">
                <div className="space-y-2">
                  <button 
                    className="w-full px-4 py-2 rounded-lg text-white"
                    style={{ backgroundColor: customColors.primary }}
                  >
                    Primary Button
                  </button>
                  <button 
                    className="w-full px-4 py-2 rounded-lg text-white"
                    style={{ backgroundColor: customColors.secondary }}
                  >
                    Secondary Button
                  </button>
                  <button 
                    className="w-full px-4 py-2 rounded-lg border-2"
                    style={{ 
                      borderColor: customColors.primary,
                      color: customColors.primary 
                    }}
                  >
                    Outline Button
                  </button>
                </div>
              </ComponentPreview>

              {/* Card Preview */}
              <ComponentPreview title="Cards">
                <div 
                  className="p-4 rounded-lg"
                  style={{ 
                    backgroundColor: customColors.surface,
                    color: customColors.text 
                  }}
                >
                  <h4 className="font-semibold mb-2">Card Title</h4>
                  <p style={{ color: customColors.textSecondary }} className="text-sm">
                    This is how your cards will look with the selected theme.
                  </p>
                  <div className="mt-3 flex space-x-2">
                    <span 
                      className="px-2 py-1 rounded text-xs"
                      style={{ 
                        backgroundColor: customColors.accent,
                        color: '#FFFFFF' 
                      }}
                    >
                      Tag 1
                    </span>
                    <span 
                      className="px-2 py-1 rounded text-xs"
                      style={{ 
                        backgroundColor: customColors.success,
                        color: '#FFFFFF' 
                      }}
                    >
                      Tag 2
                    </span>
                  </div>
                </div>
              </ComponentPreview>

              {/* Status Indicators */}
              <ComponentPreview title="Status Indicators">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Success</span>
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: customColors.success }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Warning</span>
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: customColors.warning }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Error</span>
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: customColors.error }}
                    />
                  </div>
                </div>
              </ComponentPreview>

              {/* Reset Button */}
              <button className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset to Default
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizer;