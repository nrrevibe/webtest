import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  History as HistoryIcon, 
  ShieldCheck, 
  AlertCircle, 
  Loader2,
  Zap,
  Search,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { LighthouseResult, DetailedAIInsight, AssetInfo, SlimChecklistItem } from '../types';
import AssetTreemap from './AssetTreemap';
import SlimChecklist from './SlimChecklist';

const CountUp: React.FC<{ value: number; className?: string }> = ({ value, className }) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    let totalDuration = 2000;
    let incrementTime = totalDuration / end;

    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value]);

  return <span className={className}>{count}</span>;
};

interface AuditReportProps {
  results: LighthouseResult | null;
  isLoading: boolean;
  downloadPDF: () => void;
  scrollToHistory: () => void;
  aiInsight: DetailedAIInsight | null;
  activeUrl: string;
  reportRef: React.RefObject<HTMLDivElement | null>;
  darkMode: boolean;
  isInsightModalOpen: boolean;
  setIsInsightModalOpen: (isOpen: boolean) => void;
  isSlimMode: boolean;
}

export const AuditReport: React.FC<AuditReportProps> = ({
  results,
  isLoading,
  downloadPDF,
  scrollToHistory,
  aiInsight,
  activeUrl,
  reportRef,
  darkMode,
  isInsightModalOpen,
  setIsInsightModalOpen,
  isSlimMode
}) => {
  const [expandedRecIndex, setExpandedRecIndex] = useState<number | null>(null);
  const chartData = results ? [
    { name: 'Performance', value: results.performance, color: results.performance > 89 ? '#22c55e' : results.performance > 49 ? '#eab308' : '#ef4444' },
    { name: 'Accessibility', value: results.accessibility, color: results.accessibility > 89 ? '#22c55e' : '#eab308' },
    { name: 'Best Practices', value: results.bestPractices, color: results.bestPractices > 89 ? '#22c55e' : '#eab308' },
    { name: 'SEO', value: results.seo, color: results.seo > 89 ? '#22c55e' : '#eab308' },
  ] : [];

  return (
    <div className="rounded-[2.5rem] border border-white/10 shadow-2xl p-8 flex flex-col h-full min-h-[700px] transition-all duration-500 bg-slate-900/40 backdrop-blur-2xl relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className={`text-xl font-display font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <BarChart3 className="text-emerald-600 w-6 h-6" />
            Audit Report
          </h2>
          {isSlimMode && (
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Slim Mode Active</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {results && (
            <button 
              onClick={downloadPDF}
              className="p-2.5 rounded-xl transition-all border border-white/10 bg-white/5 text-emerald-400 hover:bg-white/10 hover:border-white/20"
              title="Download PDF Report"
            >
              <Download className="w-5 h-5" />
            </button>
          )}
          <button 
            onClick={scrollToHistory}
            className="p-2.5 rounded-xl transition-all border border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:border-white/20"
            title="View History"
          >
            <HistoryIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {!results && !isLoading && (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12 space-y-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20">
            <ShieldCheck className="text-emerald-400 w-8 h-8" />
          </div>
          <p className="text-sm font-medium text-white/40">Run a test to see performance, SEO, and accessibility metrics.</p>
        </div>
      )}

      {isLoading && (
        <div className="flex-1 flex flex-col items-center justify-center py-12 space-y-4">
          <div className="relative">
            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
            <div className="absolute inset-0 bg-emerald-500/20 blur-xl animate-pulse" />
          </div>
          <div className="text-center">
            <p className="font-bold text-white tracking-tight">Synchronizing Data...</p>
            <p className="text-xs text-white/40">Preparing visual analysis</p>
          </div>
        </div>
      )}

      {results && !isLoading && (
        <div ref={reportRef} className="space-y-8 flex-1">
          {/* Scores SVG Rings */}
          <div className="grid grid-cols-2 gap-6">
            {chartData.map((stat, idx) => {
              const radius = 35;
              const circumference = 2 * Math.PI * radius;
              const offset = circumference - (stat.value / 100) * circumference;
              
              return (
                <div key={idx} className="flex flex-col items-center gap-4 p-5 rounded-[2.5rem] prism-glass border-white/10 hover:border-brand-primary/30 transition-all group relative overflow-hidden">
                  {/* Glowing Aura Background */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity blur-[40px] z-0" 
                    style={{ background: stat.color }}
                  />
                  
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="relative w-28 h-28 z-10"
                  >
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="56"
                        cy="56"
                        r={radius}
                        className="stroke-white/5 fill-none"
                        strokeWidth="10"
                      />
                      <motion.circle
                        cx="56"
                        cy="56"
                        r={radius}
                        fill="none"
                        stroke={stat.color}
                        strokeWidth="10"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        whileInView={{ strokeDashoffset: offset }}
                        viewport={{ once: true }}
                        transition={{ duration: 2, ease: "easeOut", delay: idx * 0.1 }}
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_15px_var(--tw-shadow-color)]"
                        style={{ '--tw-shadow-color': stat.color } as any}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <CountUp value={stat.value} className="text-3xl font-mono font-bold text-white tracking-tighter" />
                    </div>
                  </motion.div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 group-hover:text-white transition-colors relative z-10">
                    {stat.name}
                  </span>
                </div>
              );
            })}
          </div>


          {/* Core Web Vitals */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'FCP', value: results.details.fcp, desc: 'First Contentful Paint' },
              { label: 'LCP', value: results.details.lcp, desc: 'Largest Contentful Paint' },
              { label: 'CLS', value: results.details.cls, desc: 'Layout Shift' },
              { label: 'TBT', value: results.details.tbt, desc: 'Total Blocking Time' },
              { label: 'Speed Index', value: results.details.speedIndex, desc: 'Visual Load Speed' },
            ].map((metric) => (
              <div key={metric.label} className="p-4 rounded-2xl border border-white/10 bg-white/[0.04] group transition-all hover:bg-white/[0.06] hover:border-brand-primary/30">
                <p className="text-[9px] uppercase tracking-[0.2em] font-bold mb-2 group-hover:text-brand-primary transition-colors text-white/60">{metric.label}</p>
                <p className="text-lg font-mono font-bold text-white">{metric.value}</p>
                <p className="text-[8px] text-white/50 mt-1 font-medium">{metric.desc}</p>
              </div>
            ))}
          </div>

          {/* Asset Weight Breakdown */}
          {results.assets && results.assets.length > 0 && (
            <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.02]">
              <AssetTreemap assets={results.assets} darkMode={true} />
            </div>
          )}

          {/* Slim Checklist */}
          {results.slimChecklist && results.slimChecklist.length > 0 && (
            <SlimChecklist items={results.slimChecklist} darkMode={darkMode} />
          )}

          {/* Diagnostics */}
          {results.diagnostics && results.diagnostics.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 text-white/30">
                <Zap className="w-4 h-4 text-amber-500" />
                Performance Diagnostics
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {results.diagnostics.map((diag, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border border-white/5 bg-white/[0.01] rounded-2xl transition-all group hover:bg-white/[0.03] hover:border-amber-500/20">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-400 group-hover:scale-125 transition-transform shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                      <div>
                        <span className="text-xs font-bold block text-white/80">{diag.label}</span>
                        {diag.savings && (
                          <span className="text-[10px] text-emerald-400 font-bold opacity-80">Potential Savings: {diag.savings}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-white/40">{diag.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Insight */}
          {aiInsight && (
            <div className={`p-6 rounded-[2rem] border shadow-xl relative overflow-hidden group ${
              darkMode ? 'bg-emerald-950/50 border-emerald-900 shadow-emerald-950/50' : 'bg-emerald-950 border-emerald-800 shadow-emerald-900/20'
            }`}>
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap className="w-16 h-16 text-emerald-400" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                    </div>
                    <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em]">Expert AI Insight</h4>
                  </div>
                  <button 
                    onClick={() => setIsInsightModalOpen(true)}
                    className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-4 transition-colors"
                  >
                    Learn More
                  </button>
                </div>
                <p className={`text-sm font-medium leading-relaxed italic mb-6 ${darkMode ? 'text-emerald-100' : 'text-emerald-50'}`}>
                  "{aiInsight.summary}"
                </p>

                <div className="space-y-3">
                  {aiInsight.recommendations.map((rec, idx) => (
                    <div key={idx} className={`rounded-2xl border transition-all duration-300 ${
                      darkMode ? 'bg-emerald-900/10 border-emerald-800/50' : 'bg-emerald-900/20 border-emerald-800/30'
                    }`}>
                      <button 
                        onClick={() => setExpandedRecIndex(expandedRecIndex === idx ? null : idx)}
                        className="w-full flex items-center justify-between p-4 text-left group/btn"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] font-bold text-emerald-400">
                            {idx + 1}
                          </div>
                          <span className={`text-xs font-bold ${darkMode ? 'text-emerald-100' : 'text-emerald-50'}`}>
                            {rec.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold text-emerald-400 opacity-0 group-hover/btn:opacity-100 transition-opacity">
                            {expandedRecIndex === idx ? 'Collapse' : 'Learn More'}
                          </span>
                          {expandedRecIndex === idx ? (
                            <ChevronUp className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-emerald-400 opacity-50 group-hover/btn:opacity-100 transition-opacity" />
                          )}
                        </div>
                      </button>

                      <AnimatePresence>
                        {expandedRecIndex === idx && (
                          <motion.div 
                            key={`rec-${idx}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 pt-0 space-y-4">
                              <div className={`h-[1px] w-full ${darkMode ? 'bg-emerald-800/30' : 'bg-emerald-800/20'}`} />
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider mb-1">Impact</p>
                                  <p className={`text-[11px] leading-relaxed ${darkMode ? 'text-emerald-100/70' : 'text-emerald-50/80'}`}>
                                    {rec.impact}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider mb-1">Implementation</p>
                                  <p className={`text-[11px] leading-relaxed font-mono ${darkMode ? 'text-emerald-400' : 'text-emerald-300'}`}>
                                    {rec.steps}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SEO Findings */}
          <div className="space-y-4">
            <h3 className={`text-xs font-bold uppercase tracking-[0.15em] flex items-center gap-2 ${darkMode ? 'text-slate-400' : 'text-gray-900'}`}>
              <Search className="w-4 h-4 text-emerald-600" />
              SEO Audit Findings
            </h3>
            <div className="space-y-3">
              {results.seoDetails.map((audit) => (
                <div 
                  key={audit.id} 
                  className={`p-4 rounded-2xl border flex items-start gap-4 transition-all hover:shadow-md ${
                    audit.score === 1 
                      ? darkMode ? 'bg-emerald-900/10 border-emerald-900/30 hover:border-emerald-500/50' : 'bg-emerald-50/30 border-emerald-100 hover:border-emerald-200' 
                      : darkMode ? 'bg-red-900/10 border-red-900/30 hover:border-red-500/50' : 'bg-red-50/30 border-red-100 hover:border-red-200'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    audit.score === 1 ? 'bg-emerald-100/10 text-emerald-500' : 'bg-red-100/10 text-red-500'
                  }`}>
                    {audit.score === 1 ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${audit.score === 1 ? (darkMode ? 'text-emerald-400' : 'text-emerald-900') : (darkMode ? 'text-red-400' : 'text-red-900')}`}>
                      {audit.title}
                    </p>
                    <p className={`text-[10px] leading-relaxed mt-1 ${darkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                      {audit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-auto">
            <a 
              href={`https://pagespeed.web.dev/report?url=${activeUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                darkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-gray-900 text-white hover:bg-black'
              }`}
            >
              View Full Lighthouse Report
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
      {/* AI Insight Detailed Modal */}
      <AnimatePresence>
        {isInsightModalOpen && aiInsight && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInsightModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`relative w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border ${
                darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'
              }`}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Detailed Analysis</h3>
                      <p className="text-xs text-gray-500">AI-powered performance optimization guide</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsInsightModalOpen(false)}
                    className={`p-2 rounded-xl transition-colors ${darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-gray-400'}`}
                  >
                    <HistoryIcon className="w-5 h-5 rotate-45" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-emerald-950/20 border-emerald-900/50' : 'bg-emerald-50 border-emerald-100'}`}>
                    <h4 className={`text-sm font-bold mb-3 flex items-center gap-2 ${darkMode ? 'text-emerald-400' : 'text-emerald-900'}`}>
                      <CheckCircle2 className="w-4 h-4" />
                      Executive Summary
                    </h4>
                    <p className={`text-sm leading-relaxed ${darkMode ? 'text-emerald-100/80' : 'text-emerald-800'}`}>
                      {aiInsight.summary}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className={`text-xs font-bold uppercase tracking-widest px-2 ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>Detailed Recommendations</h4>
                    <div className="grid grid-cols-1 gap-4">
                      {aiInsight.recommendations.map((rec, idx) => (
                        <div key={idx} className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-100'}`}>
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold text-xs shrink-0">
                              {idx + 1}
                            </div>
                            <h5 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{rec.title}</h5>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-12">
                            <div>
                              <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>Impact</p>
                              <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{rec.impact}</p>
                            </div>
                            <div>
                              <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>Next Steps</p>
                              <p className={`text-xs leading-relaxed font-mono ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{rec.steps}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                  <button 
                    onClick={() => setIsInsightModalOpen(false)}
                    className="px-6 py-3 bg-emerald-500 text-white rounded-2xl font-bold text-sm hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
                  >
                    Got it, thanks!
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
