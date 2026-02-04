'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: 'purple' | 'blue' | 'green' | 'red' | 'yellow';
}

const colorClasses = {
  purple: {
    gradient: 'from-violet-500 to-purple-600',
    glow: 'shadow-violet-500/30',
    bg: 'bg-violet-500/10',
    text: 'text-violet-400',
    border: 'border-violet-500/30',
  },
  blue: {
    gradient: 'from-blue-500 to-cyan-500',
    glow: 'shadow-blue-500/30',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
  },
  green: {
    gradient: 'from-emerald-500 to-green-500',
    glow: 'shadow-emerald-500/30',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
  red: {
    gradient: 'from-rose-500 to-red-500',
    glow: 'shadow-rose-500/30',
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
  },
  yellow: {
    gradient: 'from-amber-500 to-yellow-500',
    glow: 'shadow-amber-500/30',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
  },
};

export default function StatCard({ title, value, icon: Icon, trend, color }: StatCardProps) {
  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3 }}
      className={`glass-card p-6 relative overflow-hidden group cursor-pointer hover:${colors.border} transition-all duration-300`}
    >
      {/* Background Glow */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${colors.gradient} rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity`} />
      
      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center mb-4`}>
        <Icon className={`w-6 h-6 ${colors.text}`} />
      </div>

      {/* Value */}
      <motion.div
        className="text-4xl font-bold text-white mb-1"
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      >
        {typeof value === 'number' ? (
          <CountUp target={value} />
        ) : (
          value
        )}
      </motion.div>

      {/* Title */}
      <p className="text-sm text-slate-400">{title}</p>

      {/* Trend */}
      {trend && (
        <div className={`absolute top-6 right-6 text-sm font-medium ${trend.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
          {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
        </div>
      )}
    </motion.div>
  );
}

function CountUp({ target }: { target: number }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {target.toLocaleString()}
    </motion.span>
  );
}
