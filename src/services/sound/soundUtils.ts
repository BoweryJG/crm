// Utility functions for luxury sound system
import { soundManager } from './SoundManager';

// Common UI sound mappings
export const playClick = () => soundManager.play('click');
export const playSuccess = () => soundManager.play('success');
export const playError = () => soundManager.play('error');
export const playNavigate = () => soundManager.play('navigate');
export const playHover = () => soundManager.play('hover');

// Convenience functions for common patterns
export const playAction = (success: boolean) => {
  return success ? playSuccess() : playError();
};

export const playTransition = () => playNavigate();

// Export for components that need direct access
export { soundManager };