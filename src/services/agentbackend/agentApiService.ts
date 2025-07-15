import axios, { AxiosInstance } from 'axios';

// Types for the agent management system
export interface Agent {
  id: string;
  name: string;
  category: 'healthcare' | 'sales' | 'aesthetic' | 'dental' | 'coaching';
  description: string;
  status: 'active' | 'inactive' | 'maintenance';
  configuration: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface AgentDeployment {
  id: string;
  agentId: string;
  clientId: string;
  clientName: string;
  status: 'deployed' | 'pending' | 'failed' | 'stopped';
  deployedAt: string;
  configuration: Record<string, any>;
}

export interface Client {
  id: string;
  name: string;
  type: string;
  activeDeployments: number;
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    role: string;
  };
}

export interface AgentStats {
  totalAgents: number;
  agentsByCategory: Record<string, number>;
  totalDeployments: number;
  activeDeployments: number;
  deploymentsByClient: Record<string, number>;
}

class AgentApiService {
  private api: AxiosInstance;
  private baseURL = 'https://agentbackend-2932.onrender.com';
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.token = null;
          localStorage.removeItem('agentbackend_token');
        }
        return Promise.reject(error);
      }
    );

    // Initialize token from localStorage
    this.token = localStorage.getItem('agentbackend_token');
  }

  // Authentication methods
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      const response = await this.api.post('/auth/login', credentials);
      const authData = response.data;
      this.token = authData.token;
      localStorage.setItem('agentbackend_token', this.token);
      return authData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    this.token = null;
    localStorage.removeItem('agentbackend_token');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Agent management methods
  async getAllAgents(): Promise<Agent[]> {
    try {
      const response = await this.api.get('/agents');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch agents:', error);
      throw error;
    }
  }

  async getAgentsByCategory(category: string): Promise<Agent[]> {
    try {
      const response = await this.api.get(`/agents?category=${category}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch agents for category ${category}:`, error);
      throw error;
    }
  }

  async getAgent(id: string): Promise<Agent> {
    try {
      const response = await this.api.get(`/agents/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch agent ${id}:`, error);
      throw error;
    }
  }

  async updateAgent(id: string, updates: Partial<Agent>): Promise<Agent> {
    try {
      const response = await this.api.put(`/agents/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error(`Failed to update agent ${id}:`, error);
      throw error;
    }
  }

  async updateAgentConfiguration(id: string, configuration: Record<string, any>): Promise<Agent> {
    try {
      const response = await this.api.put(`/agents/${id}/configuration`, { configuration });
      return response.data;
    } catch (error) {
      console.error(`Failed to update agent configuration ${id}:`, error);
      throw error;
    }
  }

  // Deployment methods
  async deployAgent(agentId: string, clientId: string, configuration?: Record<string, any>): Promise<AgentDeployment> {
    try {
      const response = await this.api.post('/deployments', {
        agentId,
        clientId,
        configuration: configuration || {},
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to deploy agent ${agentId} to client ${clientId}:`, error);
      throw error;
    }
  }

  async getAllDeployments(): Promise<AgentDeployment[]> {
    try {
      const response = await this.api.get('/deployments');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch deployments:', error);
      throw error;
    }
  }

  async getDeploymentsByClient(clientId: string): Promise<AgentDeployment[]> {
    try {
      const response = await this.api.get(`/deployments?clientId=${clientId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch deployments for client ${clientId}:`, error);
      throw error;
    }
  }

  async getDeploymentsByAgent(agentId: string): Promise<AgentDeployment[]> {
    try {
      const response = await this.api.get(`/deployments?agentId=${agentId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch deployments for agent ${agentId}:`, error);
      throw error;
    }
  }

  async stopDeployment(deploymentId: string): Promise<AgentDeployment> {
    try {
      const response = await this.api.put(`/deployments/${deploymentId}/stop`);
      return response.data;
    } catch (error) {
      console.error(`Failed to stop deployment ${deploymentId}:`, error);
      throw error;
    }
  }

  async restartDeployment(deploymentId: string): Promise<AgentDeployment> {
    try {
      const response = await this.api.put(`/deployments/${deploymentId}/restart`);
      return response.data;
    } catch (error) {
      console.error(`Failed to restart deployment ${deploymentId}:`, error);
      throw error;
    }
  }

  // Client management
  async getAllClients(): Promise<Client[]> {
    try {
      const response = await this.api.get('/clients');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      throw error;
    }
  }

  // Statistics and monitoring
  async getAgentStats(): Promise<AgentStats> {
    try {
      const response = await this.api.get('/stats/agents');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch agent stats:', error);
      throw error;
    }
  }

  async getSystemHealth(): Promise<Record<string, any>> {
    try {
      const response = await this.api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch system health:', error);
      throw error;
    }
  }

  // Mock data methods for development/testing
  getMockAgents(): Agent[] {
    return [
      {
        id: '1',
        name: 'Healthcare Assistant',
        category: 'healthcare',
        description: 'AI assistant for healthcare inquiries and patient support',
        status: 'active',
        configuration: { maxTokens: 2048, temperature: 0.7 },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      },
      {
        id: '2',
        name: 'Sales Consultant',
        category: 'sales',
        description: 'AI-powered sales assistant for lead qualification and customer support',
        status: 'active',
        configuration: { maxTokens: 1024, temperature: 0.8 },
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-16T14:20:00Z',
      },
      {
        id: '3',
        name: 'Aesthetic Advisor',
        category: 'aesthetic',
        description: 'Specialized assistant for aesthetic treatments and procedures',
        status: 'active',
        configuration: { maxTokens: 1536, temperature: 0.6 },
        createdAt: '2024-01-03T00:00:00Z',
        updatedAt: '2024-01-17T09:45:00Z',
      },
      {
        id: '4',
        name: 'Dental Care Assistant',
        category: 'dental',
        description: 'AI assistant for dental practice management and patient care',
        status: 'maintenance',
        configuration: { maxTokens: 2048, temperature: 0.7 },
        createdAt: '2024-01-04T00:00:00Z',
        updatedAt: '2024-01-18T16:10:00Z',
      },
      {
        id: '5',
        name: 'Life Coach AI',
        category: 'coaching',
        description: 'Personal development and coaching assistant',
        status: 'active',
        configuration: { maxTokens: 2048, temperature: 0.9 },
        createdAt: '2024-01-05T00:00:00Z',
        updatedAt: '2024-01-19T11:55:00Z',
      },
    ];
  }

  getMockClients(): Client[] {
    return [
      { id: 'pedro', name: 'Pedro', type: 'individual', activeDeployments: 3 },
      { id: 'repconnect1', name: 'RepConnect1', type: 'business', activeDeployments: 5 },
      { id: 'medspa-elite', name: 'MedSpa Elite', type: 'business', activeDeployments: 2 },
      { id: 'dental-pro', name: 'Dental Pro', type: 'business', activeDeployments: 4 },
      { id: 'wellness-coach', name: 'Wellness Coach', type: 'individual', activeDeployments: 1 },
    ];
  }

  getMockDeployments(): AgentDeployment[] {
    return [
      {
        id: 'dep-1',
        agentId: '1',
        clientId: 'pedro',
        clientName: 'Pedro',
        status: 'deployed',
        deployedAt: '2024-01-10T08:00:00Z',
        configuration: { customGreeting: 'Hello Pedro!' },
      },
      {
        id: 'dep-2',
        agentId: '2',
        clientId: 'repconnect1',
        clientName: 'RepConnect1',
        status: 'deployed',
        deployedAt: '2024-01-11T10:30:00Z',
        configuration: { salesGoals: ['lead-generation', 'customer-retention'] },
      },
      {
        id: 'dep-3',
        agentId: '3',
        clientId: 'medspa-elite',
        clientName: 'MedSpa Elite',
        status: 'deployed',
        deployedAt: '2024-01-12T14:15:00Z',
        configuration: { services: ['botox', 'fillers', 'laser-treatments'] },
      },
    ];
  }

  getMockStats(): AgentStats {
    return {
      totalAgents: 29,
      agentsByCategory: {
        healthcare: 8,
        sales: 7,
        aesthetic: 6,
        dental: 5,
        coaching: 3,
      },
      totalDeployments: 47,
      activeDeployments: 43,
      deploymentsByClient: {
        pedro: 3,
        repconnect1: 5,
        'medspa-elite': 2,
        'dental-pro': 4,
        'wellness-coach': 1,
      },
    };
  }
}

export const agentApiService = new AgentApiService();