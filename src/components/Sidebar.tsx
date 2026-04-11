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
    { id: 'tunnels', label: 'Local Tunnels', icon: Globe },
    { id: 'history', label: 'Audit History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <motion.aside
      initial={false}
      animate={{ 
        width: isOpen ? 260 : 80,
      }}
      className="fixed left-0 top-0 h-full z-50 bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 shadow-xl"
    >
      <div className="flex flex-col h-full relative">
        {/* Logo Section */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
            <Zap className="text-white w-4 h-4 fill-white" />
          </div>
          {isOpen && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-bold tracking-tight text-white whitespace-nowrap"
            >
              SlimAudit
            </motion.span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-lg transition-all duration-200 group relative ${
                  isActive 
                    ? 'bg-sidebar-muted text-white' 
                    : 'text-slate-400 hover:bg-sidebar-muted/50 hover:text-slate-100'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-blue-400' : ''}`} />
                {isOpen && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-6 border-t border-sidebar-muted">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sidebar font-bold text-sm shrink-0 shadow-sm">
              JD
            </div>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="overflow-hidden"
              >
                <p className="text-sm font-bold text-white truncate">John Doe</p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Pro Plan</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

