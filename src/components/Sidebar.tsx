import React from 'react';
import { 
  LayoutDashboard, 
  History, 
  Settings, 
  Zap, 
  X,
  ChevronRight,
  ExternalLink,
  Globe,
  Link2
} from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activeTab: 'dashboard' | 'history' | 'settings' | 'tunnels';
  setActiveTab: (tab: 'dashboard' | 'history' | 'settings' | 'tunnels') => void;
  darkMode: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  setIsOpen, 
  activeTab, 
  setActiveTab,
  darkMode
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tunnels', label: 'Local Tunnels', icon: Link2 },
    { id: 'history', label: 'Audit History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <motion.aside
      initial={false}
      animate={{ 
        width: isOpen ? 280 : 80,
        x: 0
      }}
      className="fixed left-0 top-0 h-full z-50 transition-all duration-300 border-r border-white/5 bg-black/20 backdrop-blur-xl"
    >
      <div className="flex flex-col h-full mesh-gradient">
        {/* Logo Section */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20 glow-primary animate-float">
              <Zap className="text-white w-6 h-6" />
            </div>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="whitespace-nowrap"
              >
                <h1 className="text-lg font-bold tracking-tight text-white font-display uppercase tracking-widest">Slim Audit</h1>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-400">Performance Suite</p>
              </motion.div>
            )}
          </div>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-white/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all group relative ${
                  isActive 
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                    : 'text-white/40 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-transform ${isActive ? 'text-white' : 'group-hover:scale-110'}`} />
                {isOpen && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm font-semibold whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
                {isActive && isOpen && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer / User Section */}
        <div className="p-4 border-t border-white/5 bg-white/[0.02] mt-auto">
          <div className={`flex items-center gap-3 p-2 rounded-2xl ${isOpen ? 'bg-white/5' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shrink-0 shadow-lg shadow-blue-500/20">
              JD
            </div>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="overflow-hidden"
              >
                <p className="text-sm font-bold truncate text-white">John Doe</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <p className="text-[10px] text-blue-500 font-bold uppercase tracking-[0.2em]">Pro Plan</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.aside>
  );
};
