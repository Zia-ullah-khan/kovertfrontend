# Kovert Frontend Specification

## 1. Project Overview
**Kovert** is an AI-powered Agentic DevOps & Security Platform. It automates the entire software delivery lifecycle:
1.  **Detects Pushes**: Listens to GitHub webhooks.
2.  **Analyzes Code**: AI agents scan for security vulnerabilities (XSS, SQLi, Secrets) and determine deployment requirements (Dockerfiles, Cloud Run config).
3.  **Deploys**: Automatically builds containers and deploys them to Google Cloud Run.
4.  **Reports**: Provides real-time dashboards for deployment status and security health.

The frontend is a **dashboard** for developers and security engineers to monitor these automated pipelines.

---

## 2. Design System & Aesthetics
The application must feel **premium, futuristic, and "hacker-chic"**.

### **a. Theme**
-   **Style**: Glassmorphism + Cyberpunk/Dark Future.
-   **Mode**: Dark Mode ONLY.
-   **Vibe**: "Minority Report" meets "Vercel".

### **b. Color Palette**
-   **Background**: Deep Charcoal / Midnight Blue (`#0f172a` to `#1e293b`).
-   **Primary Brand**: Electric Violet (`#8b5cf6`) to Neon Blue (`#3b82f6`) gradients.
-   **Success**: Emerald Green (`#10b981`) - glowing.
-   **Error/Danger**: Rose Red (`#f43f5e`) - glowing.
-   **Warning**: Amber (`#f59e0b`).
-   **Cards/Panels**: `rgba(255, 255, 255, 0.05)` with `backdrop-filter: blur(12px)`.

### **c. Typography**
-   **Font Family**: 'Inter', 'Roboto', or 'Space Grotesk' (for headers).
-   **Headings**: Bold, uppercase tracking, gradient text fills.
-   **Monospace**: 'JetBrains Mono' or 'Fira Code' for logs, commit hashes, and code snippets.

### **d. UI Elements**
-   **Buttons**: Gradient borders, glow effects on hover, scale transformations.
-   **Cards**: Glass effect, thin borders (`1px solid rgba(255,255,255,0.1)`).
-   **Animations**: Smooth transitions (framer-motion), live counters, pulsing status indicators.

---

## 3. API Documentation

**Base URL**: `http://localhost:8000` (or production domain)
**Auth**: Headers: `X-API-Key: <your-key>`

### **a. Statistics**
GET `/api/stats`
Returns aggregate metrics for the top of the dashboard.
```json
{
  "total_deployments": 42,
  "successful_deployments": 40,
  "updated_deployments": 5,
  "failed_deployments": 2,
  "total_security_scans": 42,
  "critical_vulnerabilities": 3,
  "high_vulnerabilities": 10
}
```

### **b. Active Services**
GET `/api/services`
Lists all currently running Cloud Run services.
```json
{
  "services": [
    {
      "id": 1,
      "repo_name": "Zia-ullah-khan/zia",
      "service_name": "zia-service",
      "service_url": "https://zia-service-xyz.a.run.app",
      "provider": "gcp",
      "region": "us-central1",
      "last_commit_sha": "a1b2c3d",
      "deploy_count": 5,
      "last_updated_at": "2026-02-03T01:30:00"
    }
  ],
  "count": 1
}
```

### **c. Deployment History**
GET `/api/deployments?limit=10&repo=owner/name`
Returns historical log of deployment attempts.
```json
{
  "deployments": [
    {
      "id": 105,
      "repo_name": "Zia-ullah-khan/zia",
      "commit_sha": "a1b2c3d4e5f6...",
      "status": "success", // or "failed", "analyzing", "deploying"
      "service_url": "https://zia-service-xyz.a.run.app",
      "error_message": null,
      "created_at": "2026-02-03T01:25:00",
      "completed_at": "2026-02-03T01:28:00"
    }
  ],
  "count": 1
}
```

### **d. Security Scans**
GET `/api/security-scans?limit=10&repo=owner/name`
Returns security analysis reports.
```json
{
  "scans": [
    {
      "id": 55,
      "repo_name": "Zia-ullah-khan/zia",
      "commit_sha": "a1b2c3d",
      "risk_level": "CRITICAL", // "HIGH", "MEDIUM", "LOW"
      "vulnerabilities_count": 2,
      "scan_result": "Full markdown report...",
      "github_issue_url": "https://github.com/.../issues/12",
      "created_at": "2026-02-03T01:26:00"
    }
  ],
  "count": 1
}
```

### **e. Trigger Deployment** (Manual)
POST `/api/deploy/{repo_owner}/{repo_name}`
Manually kicks off the pipeline.
```json
{
  "status": "success",
  "message": "Deployment triggered for Zia-ullah-khan/zia"
}
```

---

## 4. Frontend Data Models (TypeScript)

```typescript
// Core Entity Interfaces

export interface StatMetrics {
  total_deployments: number;
  successful_deployments: number;
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
```

---

## 5. Recommended Components

1.  **AppShell**: Sidebar navigation (Dashboard, Deployments, Security, Settings) + Glassmorphism container.
2.  **StatCard**: Displays a single metric with an icon and trend line.
    *   *Props*: `title`, `value`, `icon`, `trend`, `color`.
3.  **DeploymentFeed**: A realtime list of deployment activities.
    *   *Visuals*: Use status dots (Green pulsing = Success, Yellow spinning = Deploying).
4.  **ServiceMap**: A grid of cards showing active services.
    *   *Actions*: "Visit URL", "Redeploy", "View Logs".
5.  **VulnerabilityHeatmap**: A visual representation of security risks (Red = Critical).
6.  **LogViewer**: A terminal-like window to show deployment logs (if available).

## 6. User Flows

### **Dashboard View (Home)**
1.  **Top Row**: 4 Stat Cards (Active Services, Total Deploys, Critical Risks, Success Rate).
2.  **Left Column**: "Active Cloud Services" list. Each item should link to the deployed URL.
3.  **Right Column**: "Recent Activity" feed combining both Deployments and Security Scans chronologically.

### **Manual Trigger Flow**
1.  User clicks "New Deployment" button (Primary CTA).
2.  Modal appears asking for "Repo Owner" and "Repo Name".
3.  User submits form -> POST `/api/deploy/...`.
4.  Frontend receives success -> Toasts "Deployment Started".
5.  Dashboard "Recent Activity" updates to show "Analyzing...".
