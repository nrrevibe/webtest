import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Circle, Loader2, AlertCircle } from 'lucide-react';

interface AuditStep {
  id: string;
  label: string;
  logs: string[];
}

const STEPS: AuditStep[] = [
  { id: 'init', label: 'Initializing Engines', logs: ['Loading Puppeteer...', 'Warming up Lighthouse...', 'Engine ready.'] },
  { id: 'launch', label: 'Launching Secure Browser', logs: ['Spawning Chrome process...', 'Connecting to CDP...', 'Browser initialized.'] },
  { id: 'navigate', label: 'Navigating to Target', logs: ['Requesting URL...', 'Waiting for network idle...', 'Page loaded.'] },
  { id: 'metrics', label: 'Capturing Viewport Metrics', logs: ['Snapshotting viewport...', 'Calculating layout shifts...', 'Metrics captured.'] },
  { id: 'audit', label: 'Running Performance Audit', logs: ['Lighthouse execution...', 'Gathering traces...', 'Audit completed.'] },
  { id: 'ai', label: 'Generating AI Insights', logs: ['Feeding data to Gemini...', 'Analyzing bottlenecks...', 'Insights ready.'] },
];

interface AuditOrchestratorProps {
  isLoading: boolean;
  currentStepIndex: number;
  error?: string | null;
}

export const AuditOrchestrator: React.FC<AuditOrchestratorProps> = ({ isLoading, currentStepIndex, error }) => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (error) {
      setLogs(prev => [...prev, `[CRITICAL_FAILURE] ${error}`, 'Aborting sequence. Please check server deployment requirements.']);
    } else if (currentStepIndex >= 0 && currentStepIndex < STEPS.length) {
      const newLogs = STEPS[currentStepIndex].logs;
      setLogs(prev => [...prev, ...newLogs].slice(-10));
    } else if (!isLoading) {
      setLogs([]);
    }
  }, [currentStepIndex, isLoading, error]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {STEPS.map((step, index) => {
          const isComplete = index < currentStepIndex && !error;
          const isActive = index === currentStepIndex && (isLoading || error);
          const hasError = isActive && error;
          
          return (
            <div key={step.id} className="flex items-center gap-4 group">
              <div className="flex-shrink-0">
                {hasError ? (
                  <AlertCircle className="w-[18px] h-[18px] text-red-500" />
                ) : isComplete ? (
                  <CheckCircle2 className="w-[18px] h-[18px] text-emerald-500" />
                ) : isActive ? (
                  <Loader2 className="w-[18px] h-[18px] text-blue-500 animate-spin" />
                ) : (
                  <Circle className="w-[18px] h-[18px] text-border" />
                )}
              </div>
              <span className={`text-sm font-semibold transition-colors ${
                hasError ? 'text-red-500' : isActive ? 'text-foreground' : isComplete ? 'text-foreground/70' : 'text-muted-foreground'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className={`bg-[#020817] rounded-xl p-6 font-mono text-[13px] shadow-2xl flex flex-col gap-3 min-h-[160px] border relative overflow-hidden group ${error ? 'border-red-500/20' : 'border-white/5'}`}>
        {/* Decorative elements */}
        <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-${error ? 'red' : 'blue'}-500/20 to-transparent`} />
        <div className={`absolute inset-0 bg-${error ? 'red' : 'blue'}-500/[0.02] pointer-events-none`} />
        
        <AnimatePresence mode="popLayout">
          {logs.length > 0 ? (
            logs.map((log, i) => {
              const isErrorLog = log.startsWith('[CRITICAL_FAILURE]') || error;
              return (
              <motion.div 
                key={`${log}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-4 relative z-10"
              >
                <span className="text-slate-600 shrink-0 select-none opacity-50">
                  {new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <span className={`leading-relaxed ${
                  isErrorLog && i >= logs.length - 2 ? 'text-red-400 font-bold' 
                  : i === logs.length - 1 && !error ? 'text-emerald-400 font-bold' 
                  : 'text-slate-300'
                }`}>
                  <span className={`${error ? 'text-red-500' : 'text-blue-500'} mr-2`}>›</span>
                  {log}
                  {i === logs.length - 1 && isLoading && !error && (
                    <motion.span 
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="ml-1 inline-block w-2 h-4 bg-emerald-400 align-middle"
                    />
                  )}
                </span>
              </motion.div>
            )})
          ) : (
            <div className="text-slate-600 flex flex-col items-center justify-center h-full text-center gap-3 py-4">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-800 animate-ping" />
              <span className="text-[11px] uppercase tracking-[0.2em] font-bold">Node idle // Awaiting instruction</span>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
