# TryYomi - Precision Dental Surgery Simulator

An interactive 3D simulation demonstrating the dramatic precision improvements achieved with Yomi robotic surgical guidance compared to traditional freehand and static-guided methods.

🔗 **Live Demo**: [https://tryyomi.netlify.app](https://tryyomi.netlify.app)

## Overview

TryYomi provides dental professionals and patients with a hands-on experience showing how robotic guidance revolutionizes implant placement precision. Through an interactive tutorial, users experience firsthand the challenges of freehand surgery and the game-changing stability of Yomi robotics.

## Features

### 🎮 Interactive 3D Simulation
- Photorealistic jaw and tooth models using Three.js
- Real-time surgical drill manipulation
- Dynamic precision metrics and scoring

### 📚 Guided Tutorial Experience
- Step-by-step progression through surgical methods
- Side-by-side comparison of precision scores
- Educational feedback explaining each method's challenges

### 🤖 Three Surgical Methods
1. **Freehand**: Extremely challenging with natural hand tremors
2. **Static Guide**: Improved but still requires steady hands
3. **Yomi Robotic**: Near-perfect precision with minimal effort

### 🔐 Authentication System
- Secure login via Google/Facebook OAuth
- User progress tracking
- Protected simulation access

### 📊 Real-time Metrics
- Angular deviation tracking
- Platform deviation in millimeters
- Depth accuracy percentage
- Time elapsed counter

## Technology Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **3D Graphics**: Three.js with WebGL
- **Authentication**: Supabase Auth with OAuth providers
- **Analytics**: Google Analytics 4
- **Hosting**: Netlify with automatic deployments
- **Version Control**: Git/GitHub

## Getting Started

### Prerequisites
- Modern web browser with WebGL support
- Node.js (for local development)
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/BoweryJG/tryyomi.git
cd TryYomi
```

2. Serve locally:
```bash
python -m http.server 8000
# or
npx serve
```

3. Open http://localhost:8000 in your browser

### Configuration

1. Update `config.js` with your credentials:
```javascript
const CONFIG = {
    GA_MEASUREMENT_ID: 'G-XXXXXXXXXX', // Your GA4 ID
    SUPABASE_URL: 'your-supabase-url',
    SUPABASE_ANON_KEY: 'your-anon-key'
}
```

2. Configure OAuth providers in Supabase:
   - Add redirect URLs for your domain
   - Enable Google/Facebook providers

3. Deploy to Netlify:
   - Connect GitHub repository
   - Automatic deployments on push

## Project Structure

```
TryYomi/
├── index.html          # Landing page with auth
├── simulation.html     # Main 3D simulation
├── config.js          # Configuration file
├── _redirects         # Netlify routing
├── GA_SETUP.md        # Analytics documentation
└── README.md          # This file
```

## Usage

1. Visit the site and click "Start Simulation"
2. Sign in with Google or Facebook
3. Follow the guided tutorial:
   - Try freehand placement (very difficult)
   - Try static guide (moderate difficulty)
   - Experience Yomi precision (easy and accurate)
4. Compare your scores across methods
5. Practice freely after completing tutorial

## Key Differentiators

- **Freehand**: 80-100mm variance, constant shaking
- **Static Guide**: 25mm variance, some stability
- **Yomi Robot**: <1mm variance, rock-solid precision

## Analytics Events

- `sign_in_attempt` - User tries to authenticate
- `simulation_started` - User begins simulation
- `method_selected` - User chooses surgical method
- Score tracking for each attempt

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ to demonstrate the precision advantages of Yomi robotic surgery