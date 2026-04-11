import React, { useEffect, useState } from 'react';
import { PerformanceMetrics } from '../types';
import { Activity, Cpu, Zap } from 'lucide-react';

interface PerformanceHUDProps {
  metrics: PerformanceMetrics;
  darkMode: boolean;
  isLoading: boolean;
}

export default function PerformanceHUD({ metrics, darkMode, isLoading }: PerformanceHUDProps) {
  const [liveFps, setLiveFps] = useState(60);
  const [liveMemory, setLiveMemory] = useState(metrics.memoryUsage);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLiveFps(Math.round(Math.random() * 10 + 50));
        setLiveMemory(prev => Math.max(20, prev + (Math.random() * 2 - 1)));
      }, 500);
      return () => clearInterval(interval);
    } else {
      setLiveFps(60);
      setLiveMemory(metrics.memoryUsage);
    }
  }, [isLoading, metrics.memoryUsage]);

  return (
    <div className={`absolute top-8 right-8 z-[70] flex flex-col gap-3 pointer-events-none transition-all duration-700 ${isLoading ? 'opacity-100 scale-100 y-0' : 'opacity-80 scale-95 hover:opacity-100 hover:scale-100'}`}>
      <div className="flex items-center gap-5 px-6 py-4 rounded-3xl border border-white/20 prism-glass shadow-[0_20px_60px_rgba(0,0,0,0.6)] group">
        <div className="flex items-center gap-3 pr-5 border-r border-white/10 relative">
          <Activity className={`w-5 h-5 ${liveFps < 55 ? 'text-amber-400' : 'text-emerald-400'} drop-shadow-[0_0_8px_currentColor]`} />
          <div className="flex flex-col">
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/40">FPS</span>
            <span className="text-sm font-mono font-bold text-white leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{liveFps}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 pr-5 border-r border-white/10 relative">
          <Cpu className="w-5 h-5 text-brand-primary drop-shadow-[0_0_8px_var(--color-brand-primary)]" />
          <div className="flex flex-col">
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/40">MEM</span>
            <span className="text-sm font-mono font-bold text-white leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{liveMemory.toFixed(1)}MB</span>
          </div>
        </div>

        <div className="flex items-center gap-3 relative">
          <Zap className="w-5 h-5 text-amber-500 drop-shadow-[0_0_8px_currentColor]" />
          <div className="flex flex-col">
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/40">TTI</span>
            <span className="text-sm font-mono font-bold text-white leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{metrics.tti}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
