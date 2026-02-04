'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  getStats, 
  getServices, 
  getDeployments, 
  getSecurityScans,
  triggerDeployment,
  GetDeploymentsParams,
  GetSecurityScansParams
} from '@/app/lib/api';
import { 
  StatMetrics, 
  DeployedService, 
  DeploymentEvent, 
  SecurityScan 
} from '@/app/types';

// Hook for fetching stats
export function useStats() {
  const [data, setData] = useState<StatMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getStats();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch stats'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}

// Hook for fetching services
export function useServices() {
  const [data, setData] = useState<DeployedService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getServices();
      setData(result.services);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch services'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}

// Hook for fetching deployments
export function useDeployments(params?: GetDeploymentsParams) {
  const [data, setData] = useState<DeploymentEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getDeployments(params);
      setData(result.deployments);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch deployments'));
    } finally {
      setIsLoading(false);
    }
  }, [params?.limit, params?.repo]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}

// Hook for fetching security scans
export function useSecurityScans(params?: GetSecurityScansParams) {
  const [data, setData] = useState<SecurityScan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getSecurityScans(params);
      setData(result.scans);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch security scans'));
    } finally {
      setIsLoading(false);
    }
  }, [params?.limit, params?.repo]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}

// Hook for triggering deployments
export function useTriggerDeployment() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const trigger = useCallback(async (owner: string, repo: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await triggerDeployment(owner, repo);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to trigger deployment');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { trigger, isLoading, error };
}

// Combined hook for all dashboard data
export function useDashboardData() {
  const stats = useStats();
  const services = useServices();
  const deployments = useDeployments({ limit: 20 });
  const securityScans = useSecurityScans({ limit: 20 });

  const isLoading = stats.isLoading || services.isLoading || deployments.isLoading || securityScans.isLoading;
  
  const refetchAll = useCallback(async () => {
    await Promise.all([
      stats.refetch(),
      services.refetch(),
      deployments.refetch(),
      securityScans.refetch(),
    ]);
  }, [stats.refetch, services.refetch, deployments.refetch, securityScans.refetch]);

  return {
    stats: stats.data,
    services: services.data,
    deployments: deployments.data,
    securityScans: securityScans.data,
    isLoading,
    errors: {
      stats: stats.error,
      services: services.error,
      deployments: deployments.error,
      securityScans: securityScans.error,
    },
    refetchAll,
  };
}
