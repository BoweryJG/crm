# Claude Agent Configuration - TryYomi

## Project Overview
TryYomi is an interactive 3D dental surgery simulator that demonstrates the precision advantages of Yomi robotic guidance over traditional surgical methods. The project emphasizes user experience through a guided tutorial that walks users through increasingly precise surgical techniques.

## Key Objectives
1. **Demonstrate Yomi's Value**: Show how robotic guidance makes precision surgery accessible and easy
2. **Educational Experience**: Guide users through the challenges of different surgical methods
3. **Engagement**: Create an interactive, memorable experience that highlights precision differences
4. **Professional Presentation**: Maintain high-quality visuals and smooth user experience

## Technical Context
- **Framework**: Vanilla JavaScript with Three.js for 3D graphics
- **Authentication**: Supabase OAuth (Google/Facebook)
- **Hosting**: Netlify with automatic deployments
- **Analytics**: Google Analytics 4 for user behavior tracking

## Development Guidelines

### Code Style
- Use ES6 modules with proper imports
- Maintain clean, commented code
- Follow existing patterns in the codebase
- Ensure mobile responsiveness

### 3D Simulation Specifics
- **Freehand Method**: High variance (0.08), significant shake, very difficult
- **Static Guide**: Moderate variance (0.025), some stability
- **Yomi Robot**: Minimal variance (0.001), rock-solid precision

### User Experience Priorities
1. **Tutorial Flow**: Users must experience methods in order (freehand → static → Yomi)
2. **Clear Feedback**: Immediate visual and text feedback on precision differences
3. **Authentication**: Required before accessing simulation to track users
4. **Smooth Performance**: Maintain 60fps for professional feel

## Common Tasks

### Adding New Features
- Check existing patterns in simulation.html
- Maintain tutorial flow integrity
- Test on mobile devices
- Update README if adding major features

### Modifying Precision Values
- Edit `methodData` object in simulation.html
- Ensure Yomi remains significantly more precise
- Test that differences are visually apparent

### Updating Authentication
- Configuration in config.js
- OAuth redirect URLs must match domain
- Test both local and production environments

## Testing Checklist
- [ ] Tutorial completes successfully
- [ ] Authentication works with both providers
- [ ] Precision differences are clearly visible
- [ ] Mobile experience is smooth
- [ ] Analytics events fire correctly

## Important Files
- `index.html` - Landing page with authentication
- `simulation.html` - Main 3D simulation and tutorial
- `config.js` - Centralized configuration
- `GA_SETUP.md` - Analytics implementation details

## Deployment Notes
- Commits to main branch auto-deploy to Netlify
- Update config.js with production credentials
- Test OAuth redirects after deployment
- Monitor analytics for user behavior

## Future Enhancements to Consider
- Save high scores to leaderboard
- Add more surgical scenarios
- Implement haptic feedback support
- Create video tutorials
- Add multilingual support

## Contact & Support
Repository: https://github.com/BoweryJG/tryyomi
Live Site: https://tryyomi.netlify.app

Remember: The goal is to make users say "Wow, Yomi makes this so much easier!"