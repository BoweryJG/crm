# RepSpheres CRM

A visually stunning and comprehensive CRM specifically designed for medical sales representatives in the aesthetic and dental industries.

## Overview

RepSpheres CRM combines an intuitive, space-themed interface with powerful industry-specific features to help sales representatives in the medical field manage their contacts, track practices, monitor sales activity, and access comprehensive knowledge bases for dental and aesthetic procedures.

## Features

- **Visually Stunning Interface**: Space-themed dark mode with vibrant, thrilling colors
- **Comprehensive Industry Data**: Specialized for dental and aesthetic industries
- **AI-Enhanced Tools**: Content generation, call analysis, and market intelligence
- **Advanced Contact & Practice Management**: Track relationships and engagement
- **Procedure Knowledge Base**: Detailed information on dental and aesthetic procedures
- **Companies Database**: Comprehensive directory of industry vendors and manufacturers
- **Sales Performance Tracking**: Monitor goals, achievements, and activities

## Tech Stack

- **Frontend**: React 18 with TypeScript, Material UI
- **Backend**: Supabase (PostgreSQL)
- **State Management**: React Context API
- **Styling**: CSS-in-JS with Material UI
- **Data Visualization**: Recharts (coming soon)
- **Authentication**: Supabase Auth (coming soon)
- **Hosting**: GitHub Pages (planned)

## Project Structure

```
/
├── public/              # Static assets
├── src/                 # Source code
│   ├── assets/          # Images, icons, etc.
│   ├── components/      # Reusable components
│   │   ├── common/      # Generic UI components
│   │   ├── dashboard/   # Dashboard-related components
│   │   └── layout/      # Layout components (header, sidebar, etc.)
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Top-level page components
│   ├── services/        # API and service integrations
│   │   └── supabase/    # Supabase integration
│   ├── themes/          # Theme configurations
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── supabase/            # Supabase configuration
│   └── schema.sql       # Database schema
└── .env.local.example   # Environment variables template
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- A Supabase account

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/BoweryJG/SphereOsCrM.git
   cd SphereOsCrM
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file based on `.env.local.example` and add your Supabase credentials:
   ```
   REACT_APP_SUPABASE_URL=your_supabase_url_here
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. Set up your Supabase database using the schema in `supabase/schema.sql`.

5. Start the development server:
   ```
   npm start
   ```

## Database Setup

RepSpheres CRM uses Supabase as a backend. The database schema includes:

- **Contacts**: Medical professionals in dental/aesthetic practices
- **Practices**: Dental and aesthetic clinics/offices
- **Procedures**: Detailed information on medical procedures
- **Companies**: Manufacturers and vendors in the industry
- **Sales Activities**: Call logs, meetings, demos, etc.
- **Call Analysis**: Recorded calls with sentiment and transcript data
- **Tasks**: Follow-ups and to-dos
- **Market Intelligence**: Industry trends and insights
- **Public Contacts**: Demo contacts available to all users

Import the schema from `supabase/schema.sql` to set up your database structure.

## Development Roadmap

- [x] Initial UI framework
- [x] Dashboard design and implementation
- [x] Supabase database schema
- [x] Data models and service layer
- [ ] Authentication and user management
- [ ] Contacts and practices CRUD operations
- [ ] Procedures knowledge base
- [ ] Companies database
- [ ] Task management
- [ ] Sales activity tracking
- [ ] Reporting and analytics
- [ ] AI-powered features
- [ ] Mobile optimization

## License

All rights reserved.

## Contact

For more information, visit [repspheres.com](https://www.repspheres.com).
