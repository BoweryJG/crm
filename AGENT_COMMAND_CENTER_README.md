# Agent Command Center - Complete Setup Guide

## Overview

The Agent Command Center is a comprehensive control panel for managing all 29 agents across different categories (healthcare, sales, aesthetic, dental, coaching). It provides a centralized interface to deploy agents to specific clients, monitor active deployments, and manage agent configurations.

## Features

### 🤖 Agent Management
- **View All Agents**: Browse all 29 agents with filtering by category and status
- **Category Filtering**: Filter agents by healthcare, sales, aesthetic, dental, coaching
- **Agent Configuration**: Modify agent settings and parameters
- **Real-time Status**: Monitor agent status (active, inactive, maintenance)

### 🚀 Deployment Management
- **Client Deployment**: Deploy agents to specific clients (Pedro, repconnect1, etc.)
- **Advanced Deployment Wizard**: Step-by-step deployment configuration
- **Environment Selection**: Choose between development, staging, and production
- **Custom Configuration**: Set max tokens, temperature, rate limiting, and more

### 📊 Analytics & Monitoring
- **Dashboard Overview**: Total agents, active deployments, category breakdown
- **Client Analytics**: View deployments per client
- **Performance Monitoring**: Track agent performance and usage
- **Deployment History**: Monitor deployment status and history

### 🔐 Security & Authentication
- **JWT Authentication**: Secure access with admin credentials
- **Role-based Access**: Admin-only access to agent management
- **Session Management**: Automatic token refresh and logout

## Quick Start

### 1. Accessing the Agent Command Center

Navigate to `/agents` in your CRM application. You'll be prompted to authenticate with admin credentials.

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

### 2. Authentication

The system uses JWT authentication to connect to the agentbackend API at `https://agentbackend-2932.onrender.com`. When you first access the Agent Command Center, you'll see an authentication dialog.

### 3. Main Interface

Once authenticated, you'll see four main tabs:

#### Agents Tab
- Browse all available agents
- Filter by category (healthcare, sales, aesthetic, dental, coaching)
- Filter by status (active, inactive, maintenance)
- Search agents by name or description
- Deploy, configure, and view agent details

#### Deployments Tab
- View all active deployments
- Monitor deployment status
- Stop or restart deployments
- View deployment configurations

#### Clients Tab
- Browse all available clients
- View active deployment counts per client
- Access client-specific deployment management

#### Analytics Tab
- View agent distribution by category
- Monitor deployment statistics by client
- Track overall system performance

## API Configuration

### Backend Connection

The Agent Command Center connects to the agentbackend API with the following configuration:

```typescript
// API Base URL
const baseURL = 'https://agentbackend-2932.onrender.com';

// Available Endpoints
GET /agents - List all agents
GET /agents?category={category} - Filter agents by category
GET /agents/{id} - Get specific agent
PUT /agents/{id} - Update agent
PUT /agents/{id}/configuration - Update agent configuration

POST /deployments - Deploy agent to client
GET /deployments - List all deployments
GET /deployments?clientId={clientId} - Filter by client
GET /deployments?agentId={agentId} - Filter by agent
PUT /deployments/{id}/stop - Stop deployment
PUT /deployments/{id}/restart - Restart deployment

GET /clients - List all clients
GET /stats/agents - Get agent statistics
GET /health - System health check

POST /auth/login - Authentication
```

### Development Mode

If the API is not available, the system automatically falls back to mock data for development purposes. This includes:

- 5 sample agents across all categories
- Sample clients (Pedro, repconnect1, medspa-elite, dental-pro, wellness-coach)
- Mock deployment data
- Sample statistics

## Components Architecture

### Core Components

1. **AgentCommandCenter.tsx** - Main dashboard interface
2. **AgentAuthProvider.tsx** - Authentication context and JWT management
3. **AgentAuthGuard.tsx** - Route protection and auth UI
4. **AgentDeploymentManager.tsx** - Advanced deployment wizard
5. **agentApiService.ts** - API service layer with mock data fallback

### Integration Points

- **Routing**: Integrated into main CRM routing (`/agents`, `/agents/management`)
- **Sidebar Navigation**: Added "Agent Control" menu item
- **Authentication**: Separate from CRM auth, uses dedicated JWT system
- **Error Handling**: Graceful fallback to mock data when API unavailable

## Deployment Workflow

### Standard Deployment

1. **Select Agent**: Choose from the agents list
2. **Choose Client**: Select target client from dropdown
3. **Configure**: Set deployment parameters (optional)
4. **Deploy**: Execute deployment with real-time status

### Advanced Deployment

1. **Agent Selection**: Choose agent to deploy
2. **Client Selection**: Select target client with active deployment info
3. **Configuration**: 
   - Environment (development/staging/production)
   - Performance settings (max tokens, temperature)
   - Features (rate limiting, monitoring, logging)
   - Advanced settings (custom prompts, endpoints)
4. **Review**: Confirm all settings
5. **Deploy**: Execute with progress tracking

## Configuration Options

### Agent Configuration
- **Max Tokens**: Control response length (256-4096)
- **Temperature**: Adjust creativity (0.0-1.0)
- **System Prompt**: Custom instructions for the agent
- **Rate Limiting**: Requests per minute limits
- **Environment**: Development, staging, or production deployment

### Deployment Settings
- **Auto Start**: Automatically start agent after deployment
- **Monitoring**: Enable performance tracking
- **Logging**: Enable detailed logging
- **Backup**: Automatic configuration backup
- **Custom Endpoint**: Override default API endpoints

## Client Management

### Supported Clients

The system supports deployment to various client types:

- **Pedro** - Individual client
- **repconnect1** - Business client
- **medspa-elite** - MedSpa business
- **dental-pro** - Dental practice
- **wellness-coach** - Coaching business

### Client Features

- Active deployment tracking
- Client-specific configuration profiles
- Deployment history per client
- Performance metrics by client

## Monitoring & Analytics

### Dashboard Metrics

- **Total Agents**: 29 agents across 5 categories
- **Active Deployments**: Real-time count of running deployments
- **Category Breakdown**: Agent distribution by specialty
- **Client Activity**: Deployment counts per client

### Performance Monitoring

- Deployment success/failure rates
- Agent response times
- Usage statistics
- Error tracking and reporting

## Security Features

### Authentication Security
- JWT-based authentication
- Secure token storage
- Automatic token refresh
- Session timeout handling

### Access Control
- Admin-only access to agent management
- Role-based permissions
- Secure API communication
- Protected routes and components

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Verify admin credentials (admin/admin123)
   - Check network connection to agentbackend API
   - Clear browser cache and try again

2. **API Connection Issues**
   - System automatically falls back to mock data
   - Check console for API error messages
   - Verify agentbackend service is running

3. **Deployment Failures**
   - Check client availability
   - Verify agent configuration
   - Review deployment logs in console

### Mock Data Mode

When the API is unavailable, the system uses mock data:
- All features remain functional
- Data changes are not persisted
- Deployment simulations work as expected
- Perfect for development and testing

## Development

### Adding New Features

1. **API Service**: Extend `agentApiService.ts` with new endpoints
2. **Components**: Add new components in `/components/agentManagement/`
3. **Types**: Update TypeScript interfaces in the service file
4. **UI**: Extend the main dashboard with new functionality

### Testing

- Use mock data mode for development
- Test all authentication flows
- Verify deployment wizard steps
- Test error handling scenarios

### Deployment

1. Ensure agentbackend API is accessible
2. Configure environment variables if needed
3. Build and deploy the CRM application
4. Test authentication with production credentials

## Support

For issues or questions regarding the Agent Command Center:

1. Check the browser console for error messages
2. Verify API connectivity
3. Test with mock data mode
4. Review authentication credentials
5. Check network connectivity to agentbackend service

## Future Enhancements

- **Real-time Updates**: WebSocket integration for live deployment status
- **Advanced Analytics**: Detailed performance metrics and reporting
- **Bulk Operations**: Deploy multiple agents at once
- **Configuration Templates**: Saved deployment configurations
- **Audit Logging**: Detailed activity logs and change tracking
- **Multi-environment**: Enhanced environment management
- **Custom Dashboards**: Personalized monitoring views