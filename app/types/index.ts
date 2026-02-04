// Core Entity Interfaces for Kovert

export interface StatMetrics {
  total_deployments: number;
  successful_deployments: number;
  updated_deployments: number;
  failed_deployments: number;
  total_security_scans: number;
  critical_vulnerabilities: number;
  high_vulnerabilities: number;
}

export interface DeployedService {
  id: number;
  repo_name: string;
  service_name: string;
  service_url: string;
  provider: 'gcp' | 'aws';
  region: string;
  last_commit_sha: string;
  deploy_count: number;
  last_updated_at: string; // ISO Date
}

export interface DeploymentEvent {
  id: number;
  repo_name: string;
  commit_sha: string;
  status: 'analyzing' | 'deploying' | 'success' | 'failed' | 'updated';
  service_url?: string;
  error_message?: string;
  created_at: string;
  completed_at?: string;
}

export interface SecurityScan {
  id: number;
  repo_name: string;
  commit_sha: string;
  risk_level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE';
  vulnerabilities_count: number;
  scan_result: string; // Markdown content
  github_issue_url?: string;
  created_at: string;
}

export interface ServicesResponse {
  services: DeployedService[];
  count: number;
}

export interface DeploymentsResponse {
  deployments: DeploymentEvent[];
  count: number;
}

export interface SecurityScansResponse {
  scans: SecurityScan[];
  count: number;
}
