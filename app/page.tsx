'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Cloud, 
  Rocket, 
  Shield, 
  Cpu, 
  Bell, 
  Github, 
  ArrowRight,
  Zap,
  Lock,
  BarChart3,
  GitBranch,
  Server,
  CheckCircle
} from 'lucide-react';

// Dynamically import 3D component to avoid SSR issues
const FloatingCubes = dynamic(() => import('./components/three/FloatingCubes'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-900 to-slate-800" />
});

const features = [
  {
    icon: Cpu,
    title: 'AI-Powered Analysis',
    description: 'Uses LLMs to understand your codebase and generate optimal deployment configs',
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: Rocket,
    title: 'GCP Auto-Deployment',
    description: 'Automatically deploys to Cloud Run with load balancing and auto-scaling',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Shield,
    title: 'Security Scanning',
    description: 'Deep code analysis for vulnerabilities with actionable fixes',
    color: 'from-emerald-500 to-green-500',
  },
  {
    icon: BarChart3,
    title: 'Real-time Dashboard',
    description: 'Monitor deployments and security scans in real-time',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Slack/Discord alerts for deployments and security issues',
    color: 'from-rose-500 to-pink-500',
  },
  {
    icon: Github,
    title: 'GitHub Integration',
    description: 'Automatic security issue creation on repositories',
    color: 'from-slate-400 to-slate-600',
  },
];

const architectureSteps = [
  { icon: Github, label: 'GitHub Push', color: 'text-slate-400' },
  { icon: Server, label: 'Webhook Handler', color: 'text-violet-400' },
  { icon: Cpu, label: 'AI Analysis', color: 'text-blue-400' },
  { icon: Shield, label: 'Security Scan', color: 'text-emerald-400' },
  { icon: Cloud, label: 'GCP Deploy', color: 'text-cyan-400' },
  { icon: Bell, label: 'Notify', color: 'text-amber-400' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <FloatingCubes />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500">
              <Cloud className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Kovert Cloud</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link 
              href="https://github.com" 
              target="_blank"
              className="hidden sm:flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </Link>
            <Link href="/dashboard" className="glow-button flex items-center gap-2">
              <span>Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-slate-300">AI-Powered Cloud DevOps</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="gradient-text-glow">Deploy Smarter,</span>
              <br />
              <span className="text-white">Secure Faster</span>
            </h1>

            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
              Kovert automatically analyzes your GitHub repositories, generates GCP deployment 
              configurations, scans for security vulnerabilities, and deploys your applications.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard" className="glow-button px-8 py-4 text-lg flex items-center gap-2">
                <Rocket className="w-5 h-5" />
                Get Started
              </Link>
              <a 
                href="https://github.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="outline-button px-8 py-4 text-lg flex items-center gap-2"
              >
                <Github className="w-5 h-5" />
                View on GitHub
              </a>
            </div>
          </motion.div>

          {/* Floating Stats */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20"
          >
            {[
              { label: 'Deployments', value: '10K+', color: 'text-violet-400' },
              { label: 'Scans Run', value: '50K+', color: 'text-blue-400' },
              { label: 'Vulnerabilities Found', value: '5K+', color: 'text-rose-400' },
              { label: 'Uptime', value: '99.9%', color: 'text-emerald-400' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              From push to production in minutes with automated security analysis
            </p>
          </motion.div>

          {/* Architecture Flow */}
          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent hidden md:block" />
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {architectureSteps.map((step, index) => (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div className="glass-card p-4 rounded-2xl mb-3 relative z-10">
                    <step.icon className={`w-8 h-8 ${step.color}`} />
                  </div>
                  <span className="text-sm text-slate-400 text-center">{step.label}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Terminal Preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-16 terminal max-w-3xl mx-auto"
          >
            <div className="terminal-header">
              <div className="terminal-dot bg-rose-500" />
              <div className="terminal-dot bg-amber-500" />
              <div className="terminal-dot bg-emerald-500" />
              <span className="ml-4 text-xs text-slate-500">kovert-deploy.sh</span>
            </div>
            <div className="p-4 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">$</span>
                <span className="text-slate-300">git push origin main</span>
              </div>
              <div className="text-violet-400">→ Webhook received from GitHub</div>
              <div className="text-blue-400">→ Cloning repository...</div>
              <div className="text-cyan-400">→ AI analyzing codebase...</div>
              <div className="text-amber-400">→ Running security scan...</div>
              <div className="text-emerald-400">→ Building Docker container...</div>
              <div className="text-emerald-400">→ Deploying to Cloud Run...</div>
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle className="w-4 h-4" />
                <span>Deployed successfully to https://my-app-xyz.run.app</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Powerful <span className="gradient-text">Features</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Everything you need to automate your DevOps workflow
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-card p-6 group cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} p-3 mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-full h-full text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-violet-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="glass-card p-8 md:p-12 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-violet-500/30 to-blue-500/30 rounded-full blur-3xl" />
            
            <div className="relative grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Enterprise-Grade <span className="gradient-text">Security</span>
                </h2>
                <ul className="space-y-4">
                  {[
                    'Webhook Signature Verification (HMAC-SHA256)',
                    'API Key Authentication',
                    'Rate Limiting & DDoS Protection',
                    'Input Sanitization & Path Traversal Prevention',
                    'Structured Audit Logging',
                    'Configurable CORS Policies',
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3 text-slate-300"
                    >
                      <Lock className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 gap-4"
              >
                {[
                  { label: 'XSS Detection', value: '100%', color: 'text-emerald-400' },
                  { label: 'SQLi Prevention', value: '100%', color: 'text-blue-400' },
                  { label: 'Secret Scanning', value: 'Active', color: 'text-violet-400' },
                  { label: 'Response Time', value: '<50ms', color: 'text-amber-400' },
                ].map((stat, i) => (
                  <div key={stat.label} className="glass-card p-4 text-center">
                    <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                    <div className="text-xs text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to <span className="gradient-text">Automate</span> Your DevOps?
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
              Start deploying smarter and more securely today with Kovert Cloud
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard" className="glow-button px-10 py-4 text-lg flex items-center gap-2">
                <Rocket className="w-5 h-5" />
                Launch Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <span className="text-slate-400">Kovert Cloud © 2026</span>
          </div>
          <p className="text-sm text-slate-500">
            Built with ❤️ using FastAPI, LangChain, and Ollama
          </p>
        </div>
      </footer>
    </div>
  );
}
