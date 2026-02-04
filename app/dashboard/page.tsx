'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/app/components/layout/Sidebar';
import StatCard from '@/app/components/ui/StatCard';
import DeploymentFeed from '@/app/components/ui/DeploymentFeed';
import ServiceMap from '@/app/components/ui/ServiceMap';
import DeployModal from '@/app/components/ui/DeployModal';
import { useDashboardData, useTriggerDeployment } from '@/app/hooks/useApi';
import { 
  Cloud, 
  Rocket, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Plus,
  RefreshCw,
  Loader2,
  AlertCircle
} from 'lucide-react';

// Dynamically import 3D background
const DashboardBackground = dynamic(
  () => import('@/app/components/three/DashboardBackground'),
  { ssr: false }
);

export default function DashboardPage() {
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const { 
    stats, 
    services, 
    deployments, 
    securityScans, 
    isLoading, 
    errors,
    refetchAll 
  } = useDashboardData();
  const { trigger: triggerDeploy, isLoading: isDeploying } = useTriggerDeployment();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetchAll();
    setIsRefreshing(false);
  };

  const handleDeploy = async (owner: string, repo: string) => {
    try {
      await triggerDeploy(owner, repo);
      // Refetch data after deployment trigger
      setTimeout(() => refetchAll(), 1000);
    } catch (error) {
      console.error('Deployment failed:', error);
    }
  };

  const successRate = stats && stats.total_deployments > 0
    ? Math.round((stats.successful_deployments / stats.total_deployments) * 100)
    : 0;

  // Check if there are any connection errors
  const hasConnectionError = Object.values(errors).some(e => e !== null);

  return (
    <div className="min-h-screen relative">
      <DashboardBackground />
      
      <div className="flex">
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl lg:text-3xl font-bold text-white mb-1"
              >
                Dashboard
              </motion.h1>
              <p className="text-slate-400 text-sm">
                Monitor your deployments and security scans
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing || isLoading}
                className="p-3 rounded-xl glass-card hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 text-slate-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setIsDeployModalOpen(true)}
                disabled={isDeploying}
                className="glow-button flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">New Deployment</span>
              </button>
            </div>
          </div>

          {/* Connection Error Banner */}
          {hasConnectionError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <div>
                <p className="text-rose-300 font-medium">Unable to connect to API</p>
                <p className="text-rose-400/80 text-sm">Make sure the backend server is running at http://localhost:8000</p>
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {isLoading && !stats && (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-violet-400 animate-spin" />
                <p className="text-slate-400">Loading dashboard data...</p>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                title="Active Services"
                value={services?.length || 0}
                icon={Cloud}
                color="purple"
              />
              <StatCard
                title="Total Deployments"
                value={stats.total_deployments}
                icon={Rocket}
                trend={{ value: 12, isPositive: true }}
                color="blue"
              />
              <StatCard
                title="Critical Risks"
                value={stats.critical_vulnerabilities}
                icon={AlertTriangle}
                color="red"
              />
              <StatCard
                title="Success Rate"
                value={`${successRate}%`}
                icon={CheckCircle}
                trend={{ value: 3, isPositive: true }}
                color="green"
              />
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Active Services */}
            <ServiceMap services={services || []} />

            {/* Activity Feed */}
            <DeploymentFeed 
              deployments={deployments || []} 
              securityScans={securityScans || []} 
            />
          </div>

          {/* Security Overview */}
          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 glass-card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-violet-400" />
                  Security Overview
                </h2>
                <span className="text-xs text-slate-500">Last 24 hours</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { label: 'Total Scans', value: stats.total_security_scans, color: 'text-violet-400' },
                  { label: 'Critical', value: stats.critical_vulnerabilities, color: 'risk-critical' },
                  { label: 'High', value: stats.high_vulnerabilities, color: 'risk-high' },
                  { label: 'Medium', value: Math.max(0, stats.total_security_scans - stats.critical_vulnerabilities - stats.high_vulnerabilities - Math.floor(stats.total_security_scans * 0.6)), color: 'risk-medium' },
                  { label: 'Safe', value: Math.floor(stats.total_security_scans * 0.6), color: 'risk-safe' },
                ].map((item) => (
                  <div key={item.label} className="text-center p-4 rounded-xl bg-white/5">
                    <div className={`text-2xl font-bold ${item.color} mb-1`}>
                      {item.value}
                    </div>
                    <div className="text-xs text-slate-500">{item.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </main>
      </div>

      {/* Deploy Modal */}
      <DeployModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        onDeploy={handleDeploy}
      />
    </div>
  );
}
