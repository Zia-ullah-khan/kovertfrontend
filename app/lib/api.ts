// Kovert API Client
// Base URL for the API - can be overridden via environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

import { 
  StatMetrics, 
  DeployedService, 
  DeploymentEvent, 
  SecurityScan,
  ServicesResponse,
  DeploymentsResponse,
  SecurityScansResponse
} from '@/app/types';

// Generic fetch wrapper with error handling
async function fetchAPI<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // API key can be added here if needed in the future
  // if (apiKey) {
  //   headers['X-API-Key'] = apiKey;
  // }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status} - ${error}`);
  }

  return response.json();
}

// ============ Statistics ============
export async function getStats(): Promise<StatMetrics> {
  return fetchAPI<StatMetrics>('/api/stats');
}

// ============ Services ============
export async function getServices(): Promise<ServicesResponse> {
  return fetchAPI<ServicesResponse>('/api/services');
}

// ============ Deployments ============
export interface GetDeploymentsParams {
  limit?: number;
  repo?: string;
}

export async function getDeployments(params?: GetDeploymentsParams): Promise<DeploymentsResponse> {
  const searchParams = new URLSearchParams();
  
  if (params?.limit) {
    searchParams.set('limit', params.limit.toString());
  }
  if (params?.repo) {
    searchParams.set('repo', params.repo);
  }

  const query = searchParams.toString();
  const endpoint = `/api/deployments${query ? `?${query}` : ''}`;
  
  return fetchAPI<DeploymentsResponse>(endpoint);
}

// ============ Security Scans ============
export interface GetSecurityScansParams {
  limit?: number;
  repo?: string;
}

export async function getSecurityScans(params?: GetSecurityScansParams): Promise<SecurityScansResponse> {
  const searchParams = new URLSearchParams();
  
  if (params?.limit) {
    searchParams.set('limit', params.limit.toString());
  }
  if (params?.repo) {
    searchParams.set('repo', params.repo);
  }

  const query = searchParams.toString();
  const endpoint = `/api/security-scans${query ? `?${query}` : ''}`;
  
  return fetchAPI<SecurityScansResponse>(endpoint);
}

// ============ Trigger Deployment ============
export interface TriggerDeploymentResponse {
  status: 'success' | 'error';
  message: string;
}

export async function triggerDeployment(
  repoOwner: string, 
  repoName: string
): Promise<TriggerDeploymentResponse> {
  return fetchAPI<TriggerDeploymentResponse>(
    `/api/deploy/${repoOwner}/${repoName}`,
    { method: 'POST' }
  );
}

// ============ React Query / SWR style hooks helper ============
// Custom hook for data fetching with loading/error states
export function createApiHook<T, P = void>(
  fetcher: (params: P) => Promise<T>
) {
  return function useApiData(params: P) {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const refetch = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetcher(params);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      refetch();
    }, [JSON.stringify(params)]);

    return { data, isLoading, error, refetch };
  };
}

// Import hooks at the top level for the helper
import { useState, useEffect } from 'react';
