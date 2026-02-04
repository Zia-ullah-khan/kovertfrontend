'use client';

import { motion } from 'framer-motion';
import { DeployedService } from '@/app/types';
import { Cloud, ExternalLink, RotateCcw, GitBranch, Clock, MapPin } from 'lucide-react';

interface ServiceMapProps {
  services: DeployedService[];
}

export default function ServiceMap({ services }: ServiceMapProps) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Active Cloud Services</h2>
        <span className="text-xs text-emerald-400 flex items-center gap-1">
          <span className="status-dot status-success" />
          {services.length} Running
        </span>
      </div>

      <div className="space-y-3">
        {services.length === 0 ? (
          <p className="text-center text-slate-500 py-8">No active services</p>
        ) : (
          services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))
        )}
      </div>
    </div>
  );
}

function ServiceCard({ service, index }: { service: DeployedService; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.01 }}
      className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-violet-500/30 transition-all group"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500/20 to-blue-500/20">
            <Cloud className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h3 className="font-medium text-white group-hover:text-violet-300 transition-colors">
              {service.service_name}
            </h3>
            <p className="text-xs text-slate-500">{service.repo_name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            title="Redeploy"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
          </button>
          <a
            href={service.service_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-white/5 hover:bg-violet-500/20 transition-colors"
            title="Open URL"
          >
            <ExternalLink className="w-4 h-4 text-violet-400" />
          </a>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {service.region}
        </span>
        <span className="flex items-center gap-1">
          <GitBranch className="w-3 h-3" />
          <code className="mono text-slate-400">{service.last_commit_sha.slice(0, 7)}</code>
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {service.deploy_count} deploys
        </span>
      </div>

      {/* Service URL as clickable link */}
      <a
        href={service.service_url}
        target="_blank"
        rel="noopener noreferrer"
        className="block mt-3 text-xs text-violet-400 hover:text-violet-300 truncate transition-colors"
      >
        {service.service_url}
      </a>
    </motion.div>
  );
}
