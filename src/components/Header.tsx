import React from 'react';
import { 
  Search, 
  Zap, 
  Eye, 
  Share2, 
  ShieldCheck, 
  Loader2,
  Menu,
  X,
  Link2,
  Monitor
} from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  url: string;
  setUrl: (url: string) => void;
  isManualMode: boolean;
  setIsManualMode: (isManualMode: boolean) => void;
  manualText: string;
  setManualText: (text: string) => void;
  isLoading: boolean;
  handleTest: (e?: React.FormEvent) => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  handleShare: () => void;
  activeUrl: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  isSlimMode: boolean;
  setIsSlimMode: (isSlimMode: boolean) => void;
  setActiveTab: (tab: 'dashboard' | 'history' | 'settings' | 'tunnels') => void;
  isComparisonMode: boolean;
  setIsComparisonMode: (isComparisonMode: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  url,
  setUrl,
  isManualMode,
  setIsManualMode,
  manualText,
  setManualText,
  isLoading,
  handleTest,
  darkMode,
  setDarkMode,
  handleShare,
  activeUrl,
  isSidebarOpen,
  setIsSidebarOpen,
  isSlimMode,
  setIsSlimMode,
  setActiveTab,
  isComparisonMode,
  setIsComparisonMode
}) => {
  return (
    <header className="bg-background border-b border-border px-8 py-6 sticky top-0 z-40">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-[28px] font-bold tracking-tight text-foreground leading-none">
              Performance Suite
            </h1>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">Matrix Insight Engine</p>
          </div>
          
          <div className="flex items-center gap-4">
            {activeUrl && (
              <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-xs font-semibold text-muted-foreground border border-border shadow-sm">
                <Link2 className="w-3.5 h-3.5" />
                {activeUrl}
              </div>
            )}
            
            <div className="flex items-center gap-2 px-4 py-2 bg-[#ECFDF5] border border-[#A7F3D0] rounded-full text-xs font-semibold text-emerald-600 shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Secure Node Active
            </div>

            <div className="flex items-center gap-1 ml-4 border-l border-border pl-4">
              <button
                onClick={() => setIsComparisonMode(!isComparisonMode)}
                className={`p-2 rounded-lg transition-colors ${isComparisonMode ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted'}`}
                title="Comparison Mode"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsSlimMode(!isSlimMode)}
                className={`p-2 rounded-lg transition-colors ${isSlimMode ? 'bg-emerald-500 text-white' : 'text-muted-foreground hover:bg-muted'}`}
                title="Slim Mode"
              >
                <Zap className={`w-4 h-4 ${isSlimMode ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
                title="Share Report"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Command Bar */}
        <form onSubmit={handleTest} className="relative group max-w-2xl">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-blue-500 transition-colors">
            <Search className="w-4 h-4" />
          </div>
          <input 
            type="text" 
            placeholder={isManualMode ? "Reference URL for analysis..." : "Enter URL to audit performance..."}
            className="w-full bg-surface border border-border rounded-xl pl-11 pr-32 py-3 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
             <button 
                type="button"
                onClick={() => setIsManualMode(!isManualMode)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                  isManualMode 
                    ? 'bg-amber-500 text-white border-amber-600' 
                    : 'bg-muted border-border text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {isManualMode ? 'Manual' : 'Auto'}
              </button>
            <button 
              type="submit"
              disabled={isLoading || !url}
              className="bg-foreground text-background px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-20 active:scale-95"
            >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" /> : 'Execute'}
            </button>
          </div>

          {isManualMode && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="absolute top-full left-0 right-0 mt-3 p-6 bg-surface border border-border rounded-xl shadow-xl z-50"
            >
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold uppercase tracking-widest">Manual Data Entry</span>
              </div>
              <textarea
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder="Paste JSON report here..."
                className="w-full h-40 p-4 bg-muted border border-border rounded-lg outline-none text-xs font-mono resize-none focus:border-amber-500 transition-colors"
              />
            </motion.div>
          )}
        </form>
      </div>
    </header>
  );
};
