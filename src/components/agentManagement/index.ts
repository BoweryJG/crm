// Agent Management Components
export { AgentAuthProvider, useAgentAuth } from './AgentAuthProvider';
export { AgentAuthGuard } from './AgentAuthGuard';
export { AgentDeploymentManager } from './AgentDeploymentManager';

// Re-export the main page component
export { AgentCommandCenter } from '../../pages/AgentManagement/AgentCommandCenter';

// Re-export the API service
export { agentApiService } from '../../services/agentbackend/agentApiService';
export type { 
  Agent, 
  AgentDeployment, 
  Client, 
  AgentStats, 
  AuthCredentials, 
  AuthResponse 
} from '../../services/agentbackend/agentApiService';