// SUIS (SPHEREOS Unified Intelligence System) Main Export
// Central export file for all SUIS components and utilities

// Core Provider
export { SUISProvider, useSUIS } from './components/SUISProvider';

// Phase Components
export { default as IntelligenceDashboard } from './components/IntelligenceDashboard';
export { default as ContactUniverse } from './components/ContactUniverse';
export { default as ResearchAssistant } from './components/ResearchAssistant';
export { default as ContentGenerator } from './components/ContentGenerator';
export { default as MarketIntelligenceFeed } from './components/MarketIntelligenceFeed';
export { default as LearningPathway } from './components/LearningPathway';
export { default as ThemeCustomizer } from './components/ThemeCustomizer';

// Types
export * from './types';

// API Clients
export * from './api';

// Hooks
export * from './hooks';

// Utils (if any utility functions are created)
// export * from './utils';