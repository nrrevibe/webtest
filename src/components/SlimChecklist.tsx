import React from 'react';
import { SlimChecklistItem } from '../types';
import { CheckCircle2, XCircle, AlertCircle, ChevronRight } from 'lucide-react';

interface SlimChecklistProps {
  items: SlimChecklistItem[];
  darkMode: boolean;
}

export default function SlimChecklist({ items, darkMode }: SlimChecklistProps) {
  const statusIcons = {
    pass: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    fail: <XCircle className="w-4 h-4 text-rose-500" />,
    warning: <AlertCircle className="w-4 h-4 text-amber-500" />
  };

  return (
    <div className="space-y-4">
      <h3 className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
        Automated "Slim" Checklist
      </h3>
      
      <div className="grid grid-cols-1 gap-3">
        {items.map((item) => (
          <div 
            key={item.id} 
            className={`group p-4 rounded-2xl border transition-all duration-300 ${
              darkMode 
                ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600' 
                : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">{statusIcons[item.status]}</div>
                <div>
                  <h4 className={`text-sm font-bold mb-1 ${darkMode ? 'text-slate-100' : 'text-gray-900'}`}>
                    {item.label}
                  </h4>
                  <p className={`text-xs leading-relaxed mb-3 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    {item.description}
                  </p>
                  
                  {item.status !== 'pass' && (
                    <div className={`p-3 rounded-xl text-[11px] font-medium ${
                      darkMode ? 'bg-slate-900/50 text-emerald-400' : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <ChevronRight className="w-3 h-3" />
                        <span className="font-bold uppercase tracking-wider text-[9px]">How to Slim</span>
                      </div>
                      {item.remedy}
                    </div>
                  )}
                </div>
              </div>
              
              <div className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider ${
                item.status === 'pass' 
                  ? 'bg-emerald-500/10 text-emerald-500' 
                  : item.status === 'fail' 
                    ? 'bg-rose-500/10 text-rose-500' 
                    : 'bg-amber-500/10 text-amber-500'
              }`}>
                {item.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
