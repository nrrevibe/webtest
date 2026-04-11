import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Check, Cpu, Globe, Camera, Zap, LineChart, ChevronDown, ChevronUp } from 'lucide-react';

interface AuditStep {
  id: string;
  label: string;
  icon: React.ElementType;
  logs: string[];
}

const STEPS: AuditStep[] = [
  { id: 'init', label: 'Initializing Engines', icon: Cpu, logs: ['Loading Puppeteer...', 'Warming up Lighthouse...', 'Engine ready.'] },
  { id: 'launch', label: 'Launching Secure Browser', icon: Globe, logs: ['Spawning Chrome process...', 'Connecting to CDP...', 'Browser initialized.'] },
  { id: 'navigate', label: 'Navigating to Target', icon: Globe, logs: ['Requesting URL...', 'Waiting for network idle...', 'Page loaded.'] },
  { id: 'metrics', label: 'Capturing Viewport Metrics', icon: Camera, logs: ['Snapshotting viewport...', 'Calculating layout shifts...', 'Metrics captured.'] },
  { id: 'audit', label: 'Running Performance Audit', icon: Zap, logs: ['Lighthouse execution...', 'Gathering traces...', 'Audit completed.'] },
  { id: 'ai', label: 'Generating AI Insights', icon: LineChart, logs: ['Feeding data to Gemini...', 'Analyzing bottlenecks...', 'Insights ready.'] },
];

interface AuditOrchestratorProps {
  isLoading: boolean;
  currentStepIndex: number;
}

export const AuditOrchestrator: React.FC<AuditOrchestratorProps> = ({ isLoading, currentStepIndex }) => {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading && currentStepIndex >= 0 && currentStepIndex < STEPS.length) {
      setExpandedStep(STEPS[currentStepIndex].id);
    }
  }, [currentStepIndex, isLoading]);

  return (
    <div className="glass-card rounded-[2.5rem] p-8 border-white/5 bg-white/[0.02] relative overflow-hidden group">
      {/* Background Animated Glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-primary/10 rounded-full blur-[80px] group-hover:bg-brand-primary/15 transition-all duration-700" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
            <Terminal className="w-5 h-5 text-brand-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">Audit Pipeline</h3>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-0.5">Real-time Orchestration</p>
          </div>
        </div>
        
        {isLoading && (
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Secure Node Active</span>
          </div>
        )}
      </div>

      <div className="relative z-10 flex items-center justify-between gap-2 no-scrollbar overflow-x-auto pb-4">
        {STEPS.map((step, index) => {
          const isActive = index === currentStepIndex && isLoading;
          const isComplete = index < currentStepIndex;
          const Icon = step.icon;
          
          return (
            <div key={step.id} className="flex-1 min-w-[140px] flex flex-col items-center group/step relative">
              {/* Connector Line */}
              {index < STEPS.length - 1 && (
                <div className="absolute top-5 left-[calc(50%+25px)] right-[-calc(50%-25px)] h-[1px] z-0">
                  <div className={`h-full transition-all duration-700 ${isComplete ? 'bg-brand-primary/50' : 'bg-white/5'}`} />
                </div>
              )}

              <div className="relative z-10 flex flex-col items-center w-full">
                <button 
                  onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-500 border-2 relative ${
                    isActive 
                      ? 'bg-brand-primary border-brand-primary text-white scale-110 shadow-[0_0_20px_rgba(59,130,246,0.5)]' 
                      : isComplete 
                        ? 'bg-brand-primary/20 border-brand-primary/40 text-brand-primary' 
                        : 'bg-white/5 border-white/10 text-white/20'
                  }`}
                >
                  {isComplete ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
                  )}
                  
                  {isActive && (
                    <motion.div 
                      layoutId="active-ring"
                      className="absolute -inset-2 rounded-xl border border-brand-primary/30"
                      animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.5, 0.2] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}

                  {/* Scanning Laser (Active Only) */}
                  {isActive && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
                      <div className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_10px_#fff] animate-laser" />
                    </div>
                  )}
                </button>

                {/* Label */}
                <div className="mt-4 text-center px-1 w-full">
                  <p className={`text-[9px] font-black uppercase tracking-[0.12em] transition-all duration-300 leading-tight ${
                    isActive ? 'text-white' : isComplete ? 'text-brand-primary/80' : 'text-white/20'
                  }`}>
                    {step.label}
                  </p>
                </div>

                {/* Expandable Mini Log */}
                <AnimatePresence>
                  {expandedStep === step.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="w-full mt-4"
                    >
                      <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[9px] font-mono space-y-1.5 overflow-hidden backdrop-blur-md">
                        {step.logs.map((log, i) => (
                          <div key={i} className="flex items-center gap-2 whitespace-nowrap">
                            <span className="text-white/10">[{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                            <span className={isComplete ? 'text-brand-primary/60' : isActive ? 'text-white' : 'text-white/30'}>{log}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
      
      {!isLoading && currentStepIndex === -1 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-12 rounded-[2rem] border border-dashed border-white/5 flex flex-col items-center justify-center text-center bg-white/[0.01]"
        >
          <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
            <Terminal className="w-8 h-8 text-white/20" />
          </div>
          <h4 className="text-white font-bold mb-2">Systems Ready</h4>
          <p className="text-xs text-white/40 font-medium max-w-[240px]">
            Initialize orchestration by searching a domain above.
          </p>
        </motion.div>
      )}
    </div>
  );
};
