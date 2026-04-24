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

  const isAudited = Array.isArray(detectedTech);

  const displayTech = isAudited && detectedTech.length > 0 
    ? detectedTech.map(t => ({
        ...t,
        icon: categories[t.category]?.icon || Code2,
        color: categories[t.category]?.color || 'text-slate-400'
      }))
    : (!isAudited ? defaultTech : []);

  // Group technologies by category
  const groupedTech = displayTech.reduce((acc, curr) => {
    if (!acc[curr.category]) {
      acc[curr.category] = {
        icon: curr.icon,
        color: curr.color,
        items: []
      };
    }
    acc[curr.category].items.push(curr);
    return acc;
  }, {} as Record<string, { icon: any, color: string, items: typeof displayTech }>);

  // Additional Icons for newly added categories
  const extendedCategories: Record<string, any> = {
    ...categories,
    'Video players': { icon: Box, color: 'text-fuchsia-400' },
    'Caching': { icon: Zap, color: 'text-yellow-400' },
    'SEO': { icon: Activity, color: 'text-indigo-400' },
    'WordPress plugins': { icon: Component, color: 'text-blue-400' },
    'Miscellaneous': { icon: Layers, color: 'text-slate-400' },
    'Live chat': { icon: Globe2, color: 'text-green-400' },
    'Widgets': { icon: LayoutDashboard, color: 'text-purple-400' },
    'Page builder': { icon: Palette, color: 'text-pink-400' },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold">Engine Specifications</h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
            {isAudited ? 'Target Site Node Discovery' : 'Audit Engine Baseline (This App)'}
          </p>
        </div>
        {isAudited && !isLoading && (
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
      
      {displayTech.length > 0 ? (
        <div className={`space-y-8 transition-all duration-500 ${isLoading ? 'opacity-40 blur-[1px] grayscale outline outline-1 outline-blue-500/10' : 'opacity-100'}`}>
          {Object.entries(groupedTech).map(([category, group], idx) => {
            const CategoryIcon = extendedCategories[category]?.icon || group.icon;
            const categoryColor = extendedCategories[category]?.color || group.color;
            
            return (
              <motion.div 
                key={category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                  <CategoryIcon className={`w-4 h-4 ${categoryColor}`} />
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-widest">{category}</h4>
                  <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full font-bold ml-2">{group.items.length}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {group.items.map((item, i) => (
                    <div 
                      key={`${item.name}-${i}`} 
                      className={`flex items-center gap-3 p-3 rounded-xl border border-border group hover:border-brand-primary/30 transition-all ${isAudited ? 'bg-surface' : 'bg-surface/50 backdrop-blur-sm'}`}
                    >
                      <div className="flex flex-col overflow-hidden w-full">
                        <span className="text-sm font-bold truncate group-hover:text-brand-primary transition-colors">{item.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="py-10 text-center border rounded-xl bg-surface/50 border-dashed border-border/50">
          <Cpu className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-30" />
          <p className="text-sm font-bold text-muted-foreground">Standard Architecture Detected</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">No distinct third-party frameworks, CMS variants, or recognizable engines were fingerprinted on this node.</p>
        </div>
      )}
    </div>
  );
};
