import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

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
}

export const AuditOrchestrator: React.FC<AuditOrchestratorProps> = ({ isLoading, currentStepIndex }) => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (currentStepIndex >= 0 && currentStepIndex < STEPS.length) {
      const newLogs = STEPS[currentStepIndex].logs;
      setLogs(prev => [...prev, ...newLogs].slice(-10));
    } else if (!isLoading) {
      setLogs([]);
    }
  }, [currentStepIndex, isLoading]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {STEPS.map((step, index) => {
          const isComplete = index < currentStepIndex;
          const isActive = index === currentStepIndex && isLoading;
          
          return (
            <div key={step.id} className="flex items-center gap-4 group">
              <div className="flex-shrink-0">
                {isComplete ? (
                  <CheckCircle2 className="w-[18px] h-[18px] text-emerald-500" />
                ) : isActive ? (
                  <Loader2 className="w-[18px] h-[18px] text-blue-500 animate-spin" />
                ) : (
                  <Circle className="w-[18px] h-[18px] text-border" />
                )}
              </div>
              <span className={`text-sm font-semibold transition-colors ${
                isActive ? 'text-foreground' : isComplete ? 'text-foreground/70' : 'text-muted-foreground'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="bg-[#020817] rounded-lg p-5 font-mono text-[13px] text-slate-300 shadow-inner flex flex-col gap-2 min-h-[140px] border border-border/5">
        <AnimatePresence mode="popLayout">
          {logs.length > 0 ? (
            logs.map((log, i) => (
              <motion.div 
                key={`${log}-${i}`}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-3"
              >
                <span className="text-slate-600 shrink-0">[{new Date().toLocaleTimeString([], { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }).toLowerCase()}]</span>
                <span className={`${i === logs.length - 1 ? 'text-emerald-400' : 'text-slate-300'}`}>{log}</span>
              </motion.div>
            ))
          ) : (
            <div className="text-slate-600 flex flex-col items-center justify-center h-full text-center gap-2">
              <Loader2 className="w-5 h-5 animate-pulse" />
              <span>Waiting for execution pulse...</span>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
