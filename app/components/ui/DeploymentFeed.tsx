'use client';

import { motion } from 'framer-motion';
import { DeploymentEvent, SecurityScan } from '@/app/types';
import { GitCommit, Shield, Clock, ExternalLink, AlertTriangle, CheckCircle, Loader, XCircle } from 'lucide-react';

type ActivityItem = (DeploymentEvent & { type: 'deployment' }) | (SecurityScan & { type: 'security' });

interface DeploymentFeedProps {
  deployments: DeploymentEvent[];
  securityScans: SecurityScan[];
}

const statusConfig = {
  analyzing: { icon: Loader, color: 'text-blue-400', bg: 'bg-blue-500/20', dot: 'status-analyzing', label: 'Analyzing' },
  deploying: { icon: Loader, color: 'text-amber-400', bg: 'bg-amber-500/20', dot: 'status-warning', label: 'Deploying' },
  success: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/20', dot: 'status-success', label: 'Success' },
  updated: { icon: CheckCircle, color: 'text-cyan-400', bg: 'bg-cyan-500/20', dot: 'status-success', label: 'Updated' },
  failed: { icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-500/20', dot: 'status-error', label: 'Failed' },
};

const riskConfig = {
  CRITICAL: { color: 'risk-critical', bg: 'bg-rose-500/20', label: 'Critical' },
  HIGH: { color: 'risk-high', bg: 'bg-orange-500/20', label: 'High' },
  MEDIUM: { color: 'risk-medium', bg: 'bg-amber-500/20', label: 'Medium' },
  LOW: { color: 'risk-low', bg: 'bg-emerald-500/20', label: 'Low' },
  SAFE: { color: 'risk-safe', bg: 'bg-cyan-500/20', label: 'Safe' },
};

export default function DeploymentFeed({ deployments, securityScans }: DeploymentFeedProps) {
  // Combine and sort activities
  const activities: ActivityItem[] = [
    ...deployments.map(d => ({ ...d, type: 'deployment' as const })),
    ...securityScans.map(s => ({ ...s, type: 'security' as const })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        <span className="text-xs text-slate-500">Live Updates</span>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {activities.length === 0 ? (
          <p className="text-center text-slate-500 py-8">No recent activity</p>
        ) : (
          activities.map((activity, index) => (
            <motion.div
              key={`${activity.type}-${activity.id}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              {activity.type === 'deployment' ? (
                <DeploymentItem activity={activity} />
              ) : (
                <SecurityItem activity={activity} />
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

function DeploymentItem({ activity }: { activity: DeploymentEvent & { type: 'deployment' } }) {
  const status = statusConfig[activity.status];
  const StatusIcon = status.icon;

  return (
    <>
      <div className={`p-2 rounded-lg ${status.bg}`}>
        <GitCommit className={`w-4 h-4 ${status.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`status-dot ${status.dot}`} />
          <span className="text-sm font-medium text-white truncate">
            {activity.repo_name}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <code className="mono text-slate-400">{activity.commit_sha.slice(0, 7)}</code>
          <span>•</span>
          <StatusIcon className={`w-3 h-3 ${status.color} ${activity.status === 'analyzing' || activity.status === 'deploying' ? 'animate-spin' : ''}`} />
          <span className={status.color}>{status.label}</span>
        </div>
        {activity.error_message && (
          <p className="text-xs text-rose-400 mt-1 truncate">{activity.error_message}</p>
        )}
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-xs text-slate-500">
          <Clock className="w-3 h-3 inline mr-1" />
          {formatTime(activity.created_at)}
        </span>
        {activity.service_url && (
          <a
            href={activity.service_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </>
  );
}

function SecurityItem({ activity }: { activity: SecurityScan & { type: 'security' } }) {
  const risk = riskConfig[activity.risk_level];

  return (
    <>
      <div className={`p-2 rounded-lg ${risk.bg}`}>
        <Shield className={`w-4 h-4 ${risk.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-white truncate">
            {activity.repo_name}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <code className="mono text-slate-400">{activity.commit_sha.slice(0, 7)}</code>
          <span>•</span>
          <span className={risk.color}>{risk.label}</span>
          {activity.vulnerabilities_count > 0 && (
            <>
              <span>•</span>
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span className="text-amber-400">{activity.vulnerabilities_count} issues</span>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-xs text-slate-500">
          <Clock className="w-3 h-3 inline mr-1" />
          {formatTime(activity.created_at)}
        </span>
        {activity.github_issue_url && (
          <a
            href={activity.github_issue_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </>
  );
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}
