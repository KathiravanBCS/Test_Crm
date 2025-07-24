// API Response types
export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

// Service configuration
export interface ServiceConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

// Import MSAL dependencies
import { PublicClientApplication, InteractionRequiredAuthError } from '@azure/msal-browser';
import { msalConfig } from '@/config/authConfig';

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Initialize MSAL
msalInstance.initialize().catch(console.error);

// Get auth token from MSAL
const getAuthToken = async (): Promise<string | null> => {
  try {
    console.log('[AUTH] Starting token acquisition...');
    
    // Ensure MSAL is initialized
    await msalInstance.initialize();
    console.log('[AUTH] MSAL initialized');
    
    const accounts = msalInstance.getAllAccounts();
    console.log('[AUTH] Found accounts:', accounts.length);
    
    if (accounts.length === 0) {
      console.warn('[AUTH] No accounts found - user not authenticated');
      return null;
    }

    console.log('[AUTH] Using account:', accounts[0].username);
    
    const response = await msalInstance.acquireTokenSilent({
      scopes: ['api://525d427d-09c6-4922-b9b6-0086c3424a73/user'],
      account: accounts[0],
    });
    
    console.log('[AUTH] Token acquired successfully');
    return response.accessToken;
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      // Token refresh required - could trigger popup here if needed
      console.error('[AUTH] Interactive authentication required:', error.message);
    } else {
      console.error('[AUTH] Failed to acquire token:', error);
    }
    return null;
  }
};

// Create base client
export class ApiClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;

  constructor(config: ServiceConfig = {}) {
    this.baseURL = config.baseURL || import.meta.env.VITE_API_BASE_URL || '/api/v1';
    this.timeout = config.timeout || 30000;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
  }

  private async getHeaders(): Promise<HeadersInit> {
    const token = await getAuthToken();
    const headers = {
      ...this.defaultHeaders,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    
    console.log('[API] Request headers:', {
      ...headers,
      Authorization: token ? `Bearer ${token.substring(0, 20)}...` : 'No token'
    });
    
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `HTTP Error ${response.status}: ${response.statusText}`,
        status: response.status,
      }));
      throw { ...error, status: response.status } as ApiError;
    }

    // Handle empty responses (204 No Content)
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  async get<T>(path: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${this.baseURL}${path}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: await this.getHeaders(),
      signal: AbortSignal.timeout(this.timeout),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(path: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${path}`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
      signal: AbortSignal.timeout(this.timeout),
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(path: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${path}`, {
      method: 'PUT',
      headers: await this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
      signal: AbortSignal.timeout(this.timeout),
    });

    return this.handleResponse<T>(response);
  }

  async delete<T = void>(path: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${path}`, {
      method: 'DELETE',
      headers: await this.getHeaders(),
      signal: AbortSignal.timeout(this.timeout),
    });

    return this.handleResponse<T>(response);
  }

  async patch<T>(path: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${path}`, {
      method: 'PATCH',
      headers: await this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
      signal: AbortSignal.timeout(this.timeout),
    });

    return this.handleResponse<T>(response);
  }

  // Upload file method
  async upload<T>(path: string, formData: FormData): Promise<T> {
    const headers = await this.getHeaders();
    // Remove Content-Type to let browser set it with boundary for multipart/form-data
    delete (headers as any)['Content-Type'];

    const response = await fetch(`${this.baseURL}${path}`, {
      method: 'POST',
      headers,
      body: formData,
      signal: AbortSignal.timeout(this.timeout * 2), // Double timeout for uploads
    });

    return this.handleResponse<T>(response);
  }
}

// Create default client instance
export const apiClient = new ApiClient();