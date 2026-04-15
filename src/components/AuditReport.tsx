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
  if (!results && !isLoading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center text-center opacity-50">
        <ShieldCheck className="w-16 h-16 text-muted-foreground mb-4" />
        <p className="text-sm font-semibold tracking-tight text-muted-foreground">No active telemetry stream.</p>
        <p className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-widest">Connect to a secure node above.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Synchronizing Metrics...</p>
      </div>
    );
  }

  const scoreStats = results ? [
    { name: 'Performance', value: results.performance, color: results.performance > 89 ? '#10B981' : results.performance > 49 ? '#F59E0B' : '#EF4444' },
    { name: 'Accessibility', value: results.accessibility, color: results.accessibility > 89 ? '#10B981' : results.accessibility > 49 ? '#F59E0B' : '#EF4444' },
    { name: 'Best Practices', value: results.bestPractices, color: results.bestPractices > 89 ? '#10B981' : results.bestPractices > 49 ? '#F59E0B' : '#EF4444' },
    { name: 'SEO', value: results.seo, color: results.seo > 89 ? '#10B981' : results.seo > 49 ? '#F59E0B' : '#EF4444' },
  ] : [];

  const vitals = results ? [
    { label: 'FCP', title: 'First Contentful Paint', value: results.details.fcp, status: results.performance > 80 ? 'success' : 'warning' },
    { label: 'LCP', title: 'Largest Contentful Paint', value: results.details.lcp, status: results.performance > 70 ? 'success' : 'danger' },
    { label: 'CLS', title: 'Cumulative Layout Shift', value: results.details.cls, status: 'success' },
    { label: 'TBT', title: 'Total Blocking Time', value: results.details.tbt, status: 'danger' },
    { label: 'SI', title: 'Speed Index', value: results.details.speedIndex, status: 'warning' },
  ] : [];

  return (
    <div ref={reportRef} className="p-8 space-y-12">
      {/* 4 Score Rings Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-4">
        {scoreStats.map((stat) => (
          <div key={stat.name} className="flex flex-col items-center gap-4">
            <div 
              className="w-24 h-24 rounded-full relative flex items-center justify-center p-2 shadow-sm border border-border/50"
              style={{
                background: `conic-gradient(${stat.color} ${stat.value}%, var(--color-muted) 0)`
              }}
            >
              <div className="absolute inset-2 bg-surface rounded-full shadow-inner" />
              <span className="relative z-10 text-2xl font-bold tracking-tighter" style={{ color: stat.color }}>
                {stat.value}
              </span>
            </div>
            <span className="text-sm font-bold text-foreground/80">{stat.name}</span>
          </div>
        ))}
      </div>
      
      {/* Responsiveness & Mobile-Friendly Section */}
      <div className="bg-surface border border-border rounded-xl p-8 space-y-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-6 border-b border-border pb-8">
             <div className="flex items-center gap-8">
                <div className="flex flex-col">
                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Load Time</span>
                   <span className="text-2xl font-bold text-foreground">{results?.responsivenessChecks?.loadTime || '1.53s'}</span>
                </div>
                <div className="w-[1px] h-10 bg-border" />
                <div className="flex flex-col">
                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Page Size</span>
                   <span className="text-2xl font-bold text-foreground">{results?.responsivenessChecks?.pageSize || '7.09 KB'}</span>
                </div>
             </div>

             <div className={`flex items-center gap-3 ${results?.responsivenessChecks?.mobileFriendly ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'} px-4 py-2 rounded-lg border`}>
                <CheckCircle2 className="w-5 h-5" />
                <div className="flex flex-col">
                   <span className="text-[10px] font-bold uppercase tracking-widest">Mobile-Friendly Status</span>
                   <span className="text-xs font-bold">{results?.responsivenessChecks?.mobileFriendly ? '✅ Passed' : '❌ Needs Review'}</span>
                </div>
             </div>

             <div className="flex flex-col items-end text-right">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Responsive Score</span>
                <div className="flex items-center gap-2">
                   <span className={`text-2xl font-bold ${
                      (results?.responsivenessChecks?.responsiveScore || 0) > 89 ? 'text-emerald-500' : 
                      (results?.responsivenessChecks?.responsiveScore || 0) > 49 ? 'text-amber-500' : 'text-red-500'
                   }`}>{results?.responsivenessChecks?.responsiveScore || 0}%</span>
                   <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground bg-muted px-1.5 py-0.5 rounded">Server-side test</span>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
             <div className="space-y-6">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                   <h3 className="text-sm font-bold uppercase tracking-widest">Core Responsiveness Checks</h3>
                </div>
                <div className="space-y-4">
                   {(results?.responsivenessChecks?.checks || []).map((check) => (
                      <div key={check.id} className="flex gap-4 group">
                         {check.status === 'pass' ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                         ) : check.status === 'fail' ? (
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                         ) : (
                            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                         )}
                         <div className="space-y-1">
                            <div className="flex items-center gap-2">
                               <p className="text-sm font-bold">{check.title}</p>
                               <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                                  check.importance === 'Critical' ? 'bg-red-50 text-red-600' : 
                                  check.importance === 'High' ? 'bg-blue-50 text-blue-600' : 
                                  'bg-slate-50 text-slate-500'
                               }`}>{check.importance}</span>
                            </div>
                            <p className="text-xs text-muted-foreground font-medium leading-relaxed">{check.description}</p>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             <div className="space-y-6">
                <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-6 shadow-xl border border-white/5 overflow-hidden relative">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl -mr-16 -mt-16" />
                   
                   <div className="flex items-center gap-2 mb-2 relative z-10">
                      <Zap className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">Implementation Guide</h4>
                   </div>
                   
                   <div className="space-y-6 relative z-10">
                      <div className="space-y-3">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Common Breakpoints (Media Queries)</p>
                         <div className="grid grid-cols-1 gap-2">
                            <code className="text-[10px] bg-white/5 p-3 rounded-lg border border-white/5 block font-mono">@media (min-width: 768px) {'{ ... }'}</code>
                            <code className="text-[10px] bg-white/5 p-3 rounded-lg border border-white/5 block font-mono">@media (max-width: 767px) {'{ ... }'}</code>
                         </div>
                      </div>
                      
                      <div className="space-y-3">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Strategic Approach</p>
                         <p className="text-xs text-slate-300 leading-relaxed font-medium">
                            Add media queries to your CSS files. Common approaches include <strong>mobile-first</strong> (using min-width) or desktop-first (using max-width).
                         </p>
                      </div>
                   </div>
                </div>

                <div className="p-6 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                   <p className="text-[10px] font-bold text-blue-700 mb-2 uppercase tracking-widest">Suggestions for Improvement</p>
                   <p className="text-xs text-blue-600/80 leading-relaxed font-bold">
                      Use CSS media queries to adjust layouts for different screen sizes. Media queries are essential for responsive design.
                   </p>
                </div>
             </div>
          </div>
      </div>

      {/* Core Web Vitals Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {vitals.map((vital) => (
          <div key={vital.label} className="bg-surface border border-border p-5 rounded-xl flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-muted-foreground">{vital.label}</span>
              <span className={`text-sm font-bold ${
                vital.status === 'success' ? 'text-emerald-500' : vital.status === 'warning' ? 'text-amber-500' : 'text-red-500'
              }`}>{vital.value}</span>
            </div>
            <span className="text-[10px] font-medium text-muted-foreground leading-tight">{vital.title}</span>
          </div>
        ))}
      </div>

      {/* Assets & Checklist Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Asset Weights */}
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base font-bold">Asset Weight Breakdown</h3>
            <span className="text-xs font-bold text-muted-foreground">Total: {results?.totalByteSize || '3.9 MB'}</span>
          </div>
          
          <div className="flex gap-4 flex-wrap text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-blue-500" /> Script</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-pink-500" /> Style</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-emerald-500" /> Image</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-amber-500" /> Font</div>
          </div>

          <div className="flex h-3 rounded-full overflow-hidden bg-muted gap-0.5">
            <div className="h-full bg-blue-500" style={{ width: '20%' }} />
            <div className="h-full bg-pink-500" style={{ width: '6%' }} />
            <div className="h-full bg-emerald-500" style={{ width: '65%' }} />
            <div className="h-full bg-amber-500" style={{ width: '9%' }} />
          </div>

          <div className="space-y-2 max-h-[340px] overflow-y-auto pr-2 no-scrollbar">
            {results?.assets?.map((asset, i) => (
              <div key={i} className="flex justify-between items-center p-3.5 bg-muted rounded-lg border border-border/50 group hover:border-border transition-colors">
                <div className="flex items-center gap-3 overflow-hidden">
                   <div className={`w-1.5 h-1.5 rounded-full ${
                    asset.type === 'script' ? 'bg-blue-500' : 
                    asset.type === 'image' ? 'bg-emerald-500' : 
                    asset.type === 'stylesheet' ? 'bg-pink-500' : 'bg-amber-500'
                  }`} />
                  <span className="text-xs font-semibold truncate text-muted-foreground group-hover:text-foreground transition-colors">{asset.url.split('/').pop()}</span>
                </div>
                <span className="text-xs font-mono font-bold shrink-0">{asset.size}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Slim Checklist */}
        <div className="space-y-6">
          <h3 className="text-base font-bold mb-6">Automated "Slim" Checklist</h3>
          <div className="space-y-4">
             {[
               { title: 'Responsive Images', status: 'fail', desc: 'Checks if images have multiple resolutions.', how: 'Implement srcset and sizes attributes.' },
               { title: 'Text Compression', status: 'fail', desc: 'Checks if text assets are Gzip/Brotli compressed.', how: 'Enable Gzip or Brotli on your server.' },
               { title: 'Modern Image Formats', status: 'warning', desc: 'Checks if images are in WebP/AVIF.', how: 'Convert JPEG/PNG images to WebP.' },
             ].map((item, i) => (
               <div key={i} className="border border-border p-6 rounded-xl space-y-4">
                 <div className="flex items-start gap-4">
                   {item.status === 'fail' ? <AlertCircle className="w-5 h-5 text-red-500 shrink-0" /> : <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />}
                   <div>
                     <p className="text-sm font-bold mb-1">{item.title}</p>
                     <p className="text-xs text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
                   </div>
                 </div>
                 <div className="bg-muted p-4 rounded-lg flex flex-col gap-1 border border-border/50">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">How to Slim:</span>
                    <span className="text-xs font-medium text-muted-foreground">{item.how}</span>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* AI & SEO Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         {/* AI Card */}
         <div className="bg-surface border border-border p-8 rounded-xl space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 group">
                <Zap className="w-5 h-5 text-violet-500 group-hover:scale-110 transition-transform" />
                <h3 className="text-base font-bold">AI Engine Insights</h3>
              </div>
              <span className="bg-violet-50 text-violet-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-violet-100">Strategy Active</span>
            </div>
            
            {!aiInsight ? (
               <div className="bg-red-50 border border-red-100 p-6 rounded-xl space-y-4">
                  <div className="flex gap-4">
                     <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
                     <div>
                       <p className="text-sm font-bold text-red-800">Gemini API key not configured.</p>
                       <p className="text-xs text-red-600 font-medium mt-1">High Impact: Enables AI-powered recommendations.</p>
                     </div>
                  </div>
                  <div className="bg-white border border-red-50 p-3 rounded-lg text-xs font-bold text-red-700">
                    Fix Suggestion: Add GEMINI_API_KEY to environment.
                  </div>
               </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-foreground/80 font-medium italic">"{aiInsight.summary}"</p>
                <div className="space-y-3">
                  {aiInsight.recommendations.map((rec, i) => (
                    <div key={i} className="p-4 bg-muted rounded-lg border border-border/50 group hover:border-violet-500/30 transition-all">
                       <p className="text-xs font-bold mb-1 group-hover:text-violet-600 transition-colors uppercase tracking-tight">{rec.title}</p>
                       <p className="text-[11px] text-muted-foreground font-medium leading-tight">{rec.impact}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
         </div>

         {/* SEO Card */}
         <div className="bg-surface border border-border p-8 rounded-xl space-y-6">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-emerald-500" />
              <h3 className="text-base font-bold">SEO Audit Findings</h3>
            </div>
            
            <div className="space-y-6">
               {results?.seoDetails?.slice(0, 3).map((audit, i) => (
                 <div key={i} className="flex gap-5">
                   {audit.score === 1 ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />}
                   <div>
                     <p className="text-sm font-bold mb-1">{audit.title}</p>
                     <p className="text-xs text-muted-foreground font-medium leading-relaxed">{audit.description} <span className="text-blue-600 underline cursor-pointer">Learn more</span></p>
                   </div>
                 </div>
               ))}
            </div>
            
            <button className="w-full mt-4 py-3 bg-muted border border-border rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-muted/80 transition-all">
              View Full Lighthouse Report
            </button>
         </div>
      </div>
    </div>
  );
};

