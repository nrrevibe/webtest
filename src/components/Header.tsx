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
  const isLocalhost = url.includes('localhost') || url.includes('127.0.0.1');

  return (
    <header className="sticky top-0 z-40 transition-all duration-300 bg-black/20 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-xl transition-colors text-white/70 hover:bg-white/10"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20">
              <Zap className="text-emerald-400 w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-white font-display hidden sm:block">Dashboard</h1>
          </div>
        </div>

        <form onSubmit={handleTest} className="flex-1 max-w-2xl w-full flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
            <div className="relative flex-1 group w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors text-white/60 group-focus-within:text-emerald-400" />
              <input 
                type="text" 
                placeholder={isManualMode ? "Enter URL for reference" : "Enter URL (e.g., apple.com or localhost:8080)"}
                className="w-full pl-12 pr-4 py-3 border border-white/5 rounded-2xl outline-none transition-all text-sm font-medium bg-white/5 focus:bg-white/10 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 text-white"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button 
                type="button"
                onClick={() => setIsManualMode(!isManualMode)}
                className={`px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all border ${
                  isManualMode 
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' 
                    : 'bg-white/10 border-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {isManualMode ? 'Manual' : 'Auto'}
              </button>
              <button 
                type="submit"
                disabled={isLoading || !url || (isManualMode && !manualText)}
                className="flex-1 sm:flex-none px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-white/5 disabled:text-white/20 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isManualMode ? 'Analyze' : 'Integrate')}
              </button>
            </div>
          </div>
          {isManualMode && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
              <textarea
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder="Paste your Lighthouse report text here..."
                className="w-full h-32 p-4 border border-white/5 rounded-2xl outline-none transition-all text-xs font-mono resize-none bg-white/5 focus:bg-white/10 focus:border-amber-500/50 text-white"
              />
            </motion.div>
          )}
        </form>

        <div className="flex items-center gap-3 w-full lg:w-auto justify-center lg:justify-end">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-widest leading-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">Secure Node Active</span>
          </div>
          
          <button
            onClick={() => setIsComparisonMode(!isComparisonMode)}
            title={isComparisonMode ? "Single Device Mode" : "Comparison Mode"}
            className={`p-2.5 rounded-xl transition-all ${
              isComparisonMode 
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                : 'text-white/40 hover:bg-white/10'
            }`}
          >
            <Monitor className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setIsSlimMode(!isSlimMode)}
            title={isSlimMode ? "Disable Slim Mode" : "Enable Slim Mode"}
            className={`p-2.5 rounded-xl transition-all ${
              isSlimMode 
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                : 'text-white/40 hover:bg-white/10'
            }`}
          >
            <Zap className={`w-5 h-5 ${isSlimMode ? 'fill-white' : ''}`} />
          </button>

          <button 
            onClick={handleShare}
            disabled={!activeUrl}
            className="p-2.5 rounded-xl transition-colors disabled:opacity-50 text-white/40 hover:bg-white/10"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>

  );
};
