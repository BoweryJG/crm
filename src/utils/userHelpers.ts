import { User } from '../auth/types';

/**
 * Get display name from user object
 * Prioritizes full_name from metadata, then falls back to email username
 */
export const getUserDisplayName = (user: User | null): string => {
  if (!user) return 'User';
  
  // First try to get full_name from user_metadata
  if (user.user_metadata?.full_name) {
    return user.user_metadata.full_name;
  }
  
  // If no full_name, try to extract from email
  if (user.email) {
    const emailUsername = user.email.split('@')[0];
    // Try to format email username as name (e.g., "john.doe" -> "John Doe")
    if (emailUsername.includes('.')) {
      return emailUsername
        .split('.')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ');
    }
    // For single word usernames, just capitalize
    return emailUsername.charAt(0).toUpperCase() + emailUsername.slice(1).toLowerCase();
  }
  
  return 'User';
};

/**
 * Get user initials for avatar display
 */
export const getUserInitials = (user: User | null): string => {
  const displayName = getUserDisplayName(user);
  
  if (displayName === 'User') {
    return 'U';
  }
  
  const names = displayName.split(' ');
  if (names.length >= 2) {
    return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
  }
  
  return displayName.charAt(0).toUpperCase();
};

/**
 * Format first and last name from email or full name
 */
export const getFirstAndLastName = (user: User | null): { firstName: string; lastName: string } => {
  const displayName = getUserDisplayName(user);
  
  if (displayName === 'User') {
    return { firstName: 'User', lastName: '' };
  }
  
  const names = displayName.split(' ');
  if (names.length >= 2) {
    return {
      firstName: names[0],
      lastName: names.slice(1).join(' ')
    };
  }
  
  return { firstName: displayName, lastName: '' };
};