'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Rocket, 
  Shield, 
  Settings, 
  Cloud,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Deployments', href: '/dashboard/deployments', icon: Rocket },
  { name: 'Security', href: '/dashboard/security', icon: Shield },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg glass-card lg:hidden"
      >
        {isMobileOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: isMobileOpen ? 0 : -100, opacity: isMobileOpen ? 1 : 0 }}
        className="fixed top-0 left-0 h-full w-64 glass-card border-r border-white/10 z-40 lg:translate-x-0 lg:opacity-100 lg:relative lg:block"
        style={{ display: 'block' }}
      >
        {/* Ensure sidebar is always visible on desktop */}
        <div className="hidden lg:block absolute inset-0" />

        <div className="p-6 relative">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-10">
            <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500">
              <Cloud className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Kovert</span>
          </Link>

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group ${
                    isActive
                      ? 'bg-violet-500/20 text-violet-300'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-violet-500 to-blue-500 rounded-r-full"
                    />
                  )}
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-violet-400' : ''}`} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Card */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/30">
              <p className="text-sm text-slate-300 mb-3">
                Automate your deployments with AI-powered analysis
              </p>
              <Link
                href="/dashboard"
                className="text-sm text-violet-400 hover:text-violet-300 font-medium transition-colors"
              >
                Learn more →
              </Link>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Desktop Sidebar - Always visible */}
      <aside className="hidden lg:block fixed top-0 left-0 h-full w-64 glass-card border-r border-white/10 z-40">
        <div className="p-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-10">
            <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500">
              <Cloud className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Kovert</span>
          </Link>

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group ${
                    isActive
                      ? 'bg-violet-500/20 text-violet-300'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavDesktop"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-violet-500 to-blue-500 rounded-r-full"
                    />
                  )}
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-violet-400' : ''}`} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Card */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/30">
              <p className="text-sm text-slate-300 mb-3">
                Automate your deployments with AI-powered analysis
              </p>
              <Link
                href="/dashboard"
                className="text-sm text-violet-400 hover:text-violet-300 font-medium transition-colors"
              >
                Learn more →
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
