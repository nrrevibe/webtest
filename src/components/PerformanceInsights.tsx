import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Target, ArrowRight, MessageSquare, Sparkles } from 'lucide-react';
import { DetailedAIInsight } from '../types';

interface PerformanceInsightsProps {
  insight: DetailedAIInsight | null;
  darkMode: boolean;
}

export const PerformanceInsights: React.FC<PerformanceInsightsProps> = ({ insight, darkMode }) => {
  if (!insight) return null;

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-[2rem] p-8 border-brand-primary/20 relative overflow-hidden group">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-primary/10 rounded-full blur-3xl group-hover:bg-brand-primary/20 transition-all duration-500" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center glow-primary animate-float shadow-xl shadow-brand-primary/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-white">AI Engine Insights</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em]">Strategy Active</span>
              </div>
            </div>
          </div>

          <div className="bg-black/30 rounded-2xl p-6 border border-white/5 mb-8">
            <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
              <MessageSquare className="w-3.5 h-3.5" />
              Intelligence Summary
            </div>
            <p className="text-sm leading-relaxed text-blue-100/90 font-medium">
              "{insight.summary}"
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {insight.recommendations.map((rec, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group/card relative rounded-[1.5rem] border border-white/5 p-6 bg-white/[0.01] hover:bg-white/[0.03] transition-all overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full blur-3xl group-hover/card:bg-brand-primary/10 transition-all" />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                        <Target className="w-5 h-5 text-brand-primary" />
                      </div>
                      <h4 className="text-sm font-bold text-white">{rec.title}</h4>
                    </div>
                    <span className="text-[9px] font-bold text-brand-primary uppercase tracking-[0.2em] px-2.5 py-1 bg-brand-primary/10 rounded-full border border-brand-primary/20">
                      High Impact
                    </span>
                  </div>
                  
                  <p className="text-xs text-white/50 leading-relaxed mb-6 font-medium">
                    {rec.impact}
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-black/40 rounded-xl p-4 border border-white/5 font-mono">
                      <div className="flex items-center gap-2 mb-2 text-[9px] font-bold text-white/20 uppercase tracking-widest">
                        <Zap className="w-3 h-3" />
                        Fix Suggestion
                      </div>
                      <p className="text-[11px] text-blue-100/70 break-all leading-tight">
                        {rec.steps}
                      </p>
                    </div>
                    
                    <button className="h-14 w-14 rounded-xl bg-brand-primary hover:bg-blue-600 text-white flex items-center justify-center transition-all shadow-lg shadow-brand-primary/20 group/btn">
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <button className="w-full mt-8 h-14 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold text-sm transition-all border border-white/10 flex items-center justify-center gap-3 group">
            <Sparkles className="w-4 h-4 text-brand-primary" />
            Full Optimization Protocol
          </button>
        </div>
      </div>
    </div>
  );
};
