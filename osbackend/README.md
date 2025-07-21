# OSBackend - Centralized CRM Backend

A centralized backend service for CRM and RepX functionality, providing unified API endpoints for subscription management, email services, automation workflows, and AI prompt management.

## Features

### CRM Endpoints
- **Feature Access Validation** (`POST /api/crm/repx/validate-access`)
- **Subscription Management** (`GET /api/crm/stripe/subscription`)
- **Email Services** (`POST /api/crm/email/send`, `POST /api/crm/email/send-smtp`)
- **AI Prompt Management** (`GET /api/crm/prompts`, `POST /api/crm/prompts/{id}/increment-usage`)
- **Automation Workflows** (`POST /api/crm/automation/start`, `POST /api/crm/automation/cancel`)

## Installation

1. Navigate to the osbackend directory:
```bash
cd osbackend
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`

5. Start the development server:
```bash
npm run dev
```

Or start the production server:
```bash
npm start
```

## API Endpoints

### Health Check
- `GET /health` - Server health status
- `GET /api/crm/health` - CRM service health status

### Feature Access Validation
- `POST /api/crm/repx/validate-access`
  - Validates user access to specific features based on their tier
  - Body: `{ userTier, feature, usage }`

### Subscription Management
- `GET /api/crm/stripe/subscription`
  - Retrieves Stripe subscription status
  - Query: `customerId` or `subscriptionId`

### Email Services
- `POST /api/crm/email/send`
  - Sends basic emails
  - Body: `{ to, subject, body, from?, html?, attachments? }`

- `POST /api/crm/email/send-smtp`
  - Sends emails via SMTP
  - Body: `{ to, subject, body, from?, html?, attachments?, smtp_config? }`

### AI Prompt Management
- `GET /api/crm/prompts`
  - Lists available AI prompts
  - Query: `category?`, `active_only?`

- `POST /api/crm/prompts/{id}/increment-usage`
  - Tracks prompt usage
  - Body: `{ userId, metadata? }`

### Automation Workflows
- `POST /api/crm/automation/start`
  - Starts automation workflows
  - Body: `{ workflow_id, trigger_data, contact_id, user_id, config? }`

- `POST /api/crm/automation/cancel`
  - Cancels running automations
  - Body: `{ execution_id?, workflow_id?, contact_id?, user_id, reason? }`

## Environment Variables

See `.env.example` for all available configuration options.

### Required Variables
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `DEFAULT_FROM_EMAIL` - Default sender email address

### Optional Variables
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `ALLOWED_ORIGINS` - CORS allowed origins

## CRM Tier System

The system supports three tiers with different feature limits:

### Basic Tier
- 1,000 contacts
- 50 emails/day
- 3 automations
- 10 AI prompts/month
- No Canvas scans

### Professional Tier
- 5,000 contacts
- 200 emails/day
- 10 automations
- 25 Canvas scans/day
- 50 AI prompts/month

### Enterprise Tier
- Unlimited contacts
- Unlimited emails
- Unlimited automations
- Unlimited Canvas scans
- Unlimited AI prompts

## AI Prompts

Built-in prompt templates:
- `email-follow-up` - Generate personalized follow-up emails
- `call-preparation` - Prepare talking points for sales calls
- `market-analysis` - Analyze market opportunities
- `objection-handling` - Generate responses to common objections

## Development

### Running in Development Mode
```bash
npm run dev
```

This uses nodemon for auto-reloading during development.

### Project Structure
```
osbackend/
├── server.js              # Main server file
├── crm-endpoints.js        # CRM-specific endpoints
├── package.json           # Dependencies and scripts
├── .env.example           # Environment variables template
└── README.md             # This file
```

## Deployment

1. Set `NODE_ENV=production` in your environment
2. Configure production environment variables
3. Start with `npm start`

## Integration

To integrate with your existing applications, import and mount the CRM routes:

```javascript
import crmRoutes from './crm-endpoints.js';
app.use('/api/crm', crmRoutes);
```

All CRM endpoints will be available under the `/api/crm/` path prefix.