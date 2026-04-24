import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Code2, Layers, Server, Globe2, Palette, Box, Activity, Component, ExternalLink, LayoutDashboard, Zap } from 'lucide-react';
import { DetectedTech } from '../types';

interface TechStackProps {
  detectedTech?: DetectedTech[];
  isLoading?: boolean;
}

export const TechStack: React.FC<TechStackProps> = ({ detectedTech, isLoading }) => {
  const defaultTech = [
    { category: 'JavaScript frameworks', name: 'React', icon: Code2, color: 'text-blue-400' },
    { category: 'Font scripts', name: 'Lucide', icon: Palette, color: 'text-pink-400' },
    { category: 'Web frameworks', name: 'Express', icon: Layers, color: 'text-emerald-400' },
    { category: 'Web servers', name: 'Express', icon: Server, color: 'text-amber-400' },
    { category: 'Programming languages', name: 'Node.js', icon: Globe2, color: 'text-green-400' },
    { category: 'JavaScript libraries', name: 'Framer Motion', icon: Box, color: 'text-violet-400' },
    { category: 'UI frameworks', name: 'Tailwind CSS', icon: Cpu, color: 'text-sky-400' },
  ];

  const categories: Record<string, any> = {
    'JavaScript frameworks': { icon: Code2, color: 'text-blue-400' },
    'Font scripts': { icon: Palette, color: 'text-pink-400' },
    'Web frameworks': { icon: Layers, color: 'text-emerald-400' },
    'Web servers': { icon: Server, color: 'text-amber-400' },
    'Programming languages': { icon: Globe2, color: 'text-green-400' },
    'JavaScript libraries': { icon: Box, color: 'text-violet-400' },
    'UI frameworks': { icon: Cpu, color: 'text-sky-400' },
    'CMS': { icon: Component, color: 'text-orange-400' },
    'Analytics': { icon: Activity, color: 'text-indigo-400' },
    'Marketing tools': { icon: Zap, color: 'text-yellow-400' },
    'CDN': { icon: Globe2, color: 'text-cyan-400' },
    'Ecommerce': { icon: LayoutDashboard, color: 'text-rose-400' },
  };

  const displayTech = detectedTech && detectedTech.length > 0 
    ? detectedTech.map(t => ({
        ...t,
        icon: categories[t.category]?.icon || Code2,
        color: categories[t.category]?.color || 'text-slate-400'
      }))
    : defaultTech;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold">Engine Specifications</h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
            {detectedTech && detectedTech.length > 0 ? 'Target Site Node Discovery' : 'Audit Engine Baseline (This App)'}
          </p>
        </div>
        {detectedTech && detectedTech.length > 0 && !isLoading && (
          <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-3 py-1.5 rounded-full border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Node Verified</span>
          </div>
        )}
        {isLoading && (
          <div className="flex items-center gap-2 bg-brand-primary/10 text-brand-primary px-3 py-1.5 rounded-full border border-brand-primary/20 animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.1)]">
            <Server className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Engaging Secure Telemetry...</span>
          </div>
        )}
      </div>
      
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-500 ${isLoading ? 'opacity-40 blur-[1px] grayscale outline outline-1 outline-blue-500/10' : 'opacity-100'}`}>
        {displayTech.map((item, i) => (
          <motion.div 
            key={`${item.name}-${i}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`flex items-center gap-4 p-4 rounded-xl border border-border group hover:border-brand-primary/20 transition-all ${detectedTech && detectedTech.length > 0 ? 'bg-surface' : 'bg-surface/50 backdrop-blur-sm'}`}
          >
            <div className={`p-2.5 rounded-lg bg-muted ${item.color} group-hover:scale-110 transition-transform shadow-sm`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate mb-0.5">{item.category}</span>
              <span className="text-sm font-bold truncate group-hover:text-brand-primary transition-colors">{item.name}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
