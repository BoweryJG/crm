// Mobile-specific style overrides for compact display
// Ensures all text fits within buttons and components on small screens

import { Theme } from '@mui/material/styles';

export const getMobileStyles = (theme: Theme) => ({
  // Compact button styles for mobile
  mobileButton: {
    fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
    padding: { xs: '6px 12px', sm: '8px 16px', md: '8px 24px' },
    letterSpacing: { xs: '0.02em', sm: '0.05em', md: '0.1em' },
    minHeight: { xs: 32, sm: 36, md: 40 },
    whiteSpace: 'nowrap',
    '& .MuiButton-startIcon': {
      marginRight: { xs: '4px', sm: '6px', md: '8px' },
      '& > svg': {
        fontSize: { xs: '16px', sm: '18px', md: '20px' },
      },
    },
  },

  // Compact text for mobile
  mobileText: {
    fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
    letterSpacing: { xs: '0.02em', sm: '0.05em', md: '0.1em' },
  },

  // Compact heading for mobile
  mobileHeading: {
    fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
    letterSpacing: { xs: '0.05em', sm: '0.1em', md: '0.15em' },
    fontWeight: { xs: 500, sm: 600, md: 700 },
  },

  // Compact alert for mobile
  mobileAlert: {
    padding: { xs: '8px 12px', sm: '12px 16px', md: '16px 24px' },
    '& .MuiAlert-message': {
      fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
    },
    '& .MuiButton-root': {
      fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
      padding: { xs: '4px 8px', sm: '6px 12px', md: '8px 16px' },
    },
  },

  // Compact input for mobile
  mobileInput: {
    '& .MuiInputBase-root': {
      fontSize: { xs: '0.875rem', sm: '1rem' },
      height: { xs: 32, sm: 36, md: 40 },
    },
    '& .MuiInputLabel-root': {
      fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
    },
  },

  // Compact chip for mobile
  mobileChip: {
    height: { xs: 24, sm: 28, md: 32 },
    fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
    '& .MuiChip-label': {
      paddingLeft: { xs: '8px', sm: '10px', md: '12px' },
      paddingRight: { xs: '8px', sm: '10px', md: '12px' },
    },
  },

  // Compact tabs for mobile
  mobileTabs: {
    minHeight: { xs: 36, sm: 42, md: 48 },
    '& .MuiTab-root': {
      minHeight: { xs: 36, sm: 42, md: 48 },
      fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
      padding: { xs: '6px 12px', sm: '8px 16px', md: '12px 24px' },
    },
  },

  // Compact empty state for mobile
  mobileEmptyState: {
    '& > .MuiBox-root': {
      fontSize: { xs: '48px', sm: '56px', md: '64px' },
    },
    '& .MuiTypography-h6': {
      fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
    },
  },
});