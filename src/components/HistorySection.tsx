import React from 'react';
import { History as HistoryIcon, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { AuditHistoryItem, LighthouseResult } from '../types';

interface HistorySectionProps {
  history: AuditHistoryItem[];
  setHistory: (history: AuditHistoryItem[]) => void;
  setActiveUrl: (url: string) => void;
  setUrl: (url: string) => void;
  setResults: (results: LighthouseResult) => void;
  darkMode: boolean;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  history,
  setHistory,
  setActiveUrl,
  setUrl,
  setResults,
  darkMode
}) => {
  return (
    <section id="history-section" className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className={`text-2xl font-display font-bold flex items-center gap-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          <HistoryIcon className="text-emerald-600 w-8 h-8" />
          Recent Audits
        </h2>
        {history.length > 0 && (
          <button 
            onClick={() => {
              setHistory([]);
              localStorage.removeItem('audit-history');
            }}
            className={`text-xs font-bold uppercase tracking-wider transition-colors ${darkMode ? 'text-slate-500 hover:text-red-400' : 'text-gray-400 hover:text-red-600'}`}
          >
            Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className={`p-12 rounded-[2.5rem] border border-dashed flex flex-col items-center justify-center text-center ${
          darkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-gray-50 border-gray-200'
        }`}>
          <HistoryIcon className={`w-12 h-12 mb-4 opacity-20 ${darkMode ? 'text-slate-400' : 'text-gray-400'}`} />
          <p className={`text-sm font-medium ${darkMode ? 'text-slate-500' : 'text-gray-500'}`}>Your audit history will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-6 rounded-3xl border transition-all hover:shadow-xl group cursor-pointer ${
                darkMode ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/30' : 'bg-white border-gray-100 hover:border-emerald-200'
              }`}
              onClick={() => {
                setActiveUrl(item.url);
                setUrl(item.url);
                setResults(item.results);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? 'bg-emerald-900/20' : 'bg-emerald-50'}`}>
                  <Zap className="text-emerald-600 w-5 h-5" />
                </div>
                <span className={`text-[10px] font-mono font-bold ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                  {new Date(item.date).toLocaleDateString()}
                </span>
              </div>
              <h3 className={`text-sm font-bold truncate mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.url}</h3>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Perf', val: item.results.performance },
                  { label: 'Acc', val: item.results.accessibility },
                  { label: 'Best', val: item.results.bestPractices },
                  { label: 'SEO', val: item.results.seo },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <p className={`text-[8px] font-bold uppercase mb-1 ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>{s.label}</p>
                    <p className={`text-xs font-bold ${s.val > 89 ? 'text-emerald-500' : s.val > 49 ? 'text-amber-500' : 'text-red-500'}`}>{s.val}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};
