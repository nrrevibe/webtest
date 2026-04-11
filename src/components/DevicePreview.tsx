import React from 'react';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  RotateCcw, 
  Wifi, 
  Eye, 
  Camera, 
  Loader2,
  Lock,
  Unlock,
  Search,
  ChevronLeft,
  ChevronRight,
  Share2,
  RefreshCw,
  Globe,
  ShieldAlert,
  ExternalLink
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DeviceConfig, 
  DeviceCategory, 
  SavedThrottlingPreset,
  LighthouseResult
} from '../types';
import { DEVICES } from '../constants';

import PerformanceHUD from './PerformanceHUD';

interface DevicePreviewProps {
  activeDevice: DeviceConfig;
  setActiveDeviceId: (id: string) => void;
  customWidth: number;
  setCustomWidth: (w: number) => void;
  customHeight: number;
  setCustomHeight: (h: number) => void;
  isRealisticMode: boolean;
  setIsRealisticMode: (mode: boolean) => void;
  networkSpeed: 'wifi' | '4g' | '3g' | '2g' | 'dsl' | 'high-latency-4g' | 'edge';
  setNetworkSpeed: (speed: 'wifi' | '4g' | '3g' | '2g' | 'dsl' | 'high-latency-4g' | 'edge') => void;
  batteryLevel: number;
  setBatteryLevel: (level: number) => void;
  isLandscape: boolean;
  setIsLandscape: (landscape: boolean) => void;
  isOrientationLocked: boolean;
  setIsOrientationLocked: (locked: boolean) => void;
  showStatusIndicators: boolean;
  setShowStatusIndicators: (show: boolean) => void;
  isLoading: boolean;
  captureScreenshot: () => void;
  activeUrl: string;
  isSimulatingLoading: boolean;
  screenshotPreviewUrl: string | null;
  isHeaderHidden: boolean;
  setIsHeaderHidden: (hidden: boolean) => void;
  handleTest: () => void;
  previewRef: React.RefObject<HTMLDivElement | null>;
  darkMode: boolean;
  throttlingConfig: { rtt: number; throughput: number; cpu: number };
  setThrottlingConfig: (config: { rtt: number; throughput: number; cpu: number }) => void;
  isCustomThrottling: boolean;
  setIsCustomThrottling: (isCustom: boolean) => void;
  savedDevicePresets: DeviceConfig[];
  savedThrottlingPresets: SavedThrottlingPreset[];
  results: LighthouseResult | null;
}

export const DevicePreview: React.FC<DevicePreviewProps> = ({
  activeDevice,
  setActiveDeviceId,
  customWidth,
  setCustomWidth,
  customHeight,
  setCustomHeight,
  isRealisticMode,
  setIsRealisticMode,
  networkSpeed,
  setNetworkSpeed,
  batteryLevel,
  setBatteryLevel,
  isLandscape,
  setIsLandscape,
  isOrientationLocked,
  setIsOrientationLocked,
  showStatusIndicators,
  setShowStatusIndicators,
  isLoading,
  captureScreenshot,
  activeUrl,
  isSimulatingLoading,
  screenshotPreviewUrl,
  isHeaderHidden,
  setIsHeaderHidden,
  handleTest,
  previewRef,
  darkMode,
  throttlingConfig,
  setThrottlingConfig,
  isCustomThrottling,
  setIsCustomThrottling,
  savedDevicePresets,
  savedThrottlingPresets,
  results
}) => {
  const [iframeError, setIframeError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setIframeError(false);
    if (!activeUrl) return;

    const timer = setTimeout(() => {
      try {
        if (!iframeRef.current?.contentWindow || iframeRef.current.contentWindow.location.href === 'about:blank') {
          // If it's still about:blank or hidden by SAMEORIGIN headers
          // We can't really detect SAMEORIGIN but we can assume if nothing loaded in 5s and it's a known blocked site
        }
      } catch (e) {
        // Cross-origin access error is actually a good sign (it loaded!)
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [activeUrl]);

  return (
    <div className="glass-card rounded-[2.5rem] overflow-hidden flex flex-col h-[750px] transition-all duration-500">
      <div className="px-6 py-4 border-b border-white/5 flex flex-wrap items-center justify-between gap-4 bg-white/[0.02]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            {(['mobile', 'tablet', 'desktop', 'custom'] as DeviceCategory[]).map((cat) => (
              <div key={cat} className={`flex items-center gap-1 border-r pr-2 last:border-0 border-white/10`}>
                <div className="p-1.5 text-white/40">
                  {cat === 'mobile' && <Smartphone className="w-4 h-4" />}
                  {cat === 'tablet' && <Tablet className="w-4 h-4" />}
                  {cat === 'desktop' && <Monitor className="w-4 h-4" />}
                  {cat === 'custom' && <RotateCcw className="w-4 h-4" />}
                </div>
                <select 
                  className="bg-transparent text-xs font-bold outline-none cursor-pointer hover:text-brand-primary transition-colors text-white/50"
                  value={activeDevice.category === cat ? activeDevice.id : ''}
                  onChange={(e) => e.target.value && setActiveDeviceId(e.target.value)}
                >
                  <option value="" disabled>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  {cat === 'custom' ? (
                    <>
                      <option value="custom">Custom</option>
                      {savedDevicePresets.filter(d => d.category === 'custom').map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </>
                  ) : (
                    <>
                      {DEVICES.filter(d => d.category === cat).map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                      {savedDevicePresets.filter(d => d.category === 'cat').map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-6 ml-4 border-l border-white/10 pl-6">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={isRealisticMode}
                  onChange={() => setIsRealisticMode(!isRealisticMode)}
                />
                <div className={`w-11 h-6 rounded-full transition-all duration-300 ${isRealisticMode ? 'bg-brand-primary' : 'bg-white/10'}`} />
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${isRealisticMode ? 'translate-x-5' : ''}`} />
              </div>
              <span className="text-[11px] font-black text-white/30 group-hover:text-white transition-colors uppercase tracking-[0.2em]">Realistic</span>
            </label>

            <button 
              onClick={() => captureScreenshot()}
              disabled={isLoading}
              className="p-2 rounded-xl text-brand-primary bg-brand-primary/10 border border-brand-primary/20 hover:bg-brand-primary/20 transition-all disabled:opacity-50"
              title="Capture Screenshot"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
            </button>
          </div>
        </div>
        
        <div className="text-[10px] font-mono text-white/20 bg-white/5 px-3 py-1 rounded-lg">
          {activeDevice.width} × {activeDevice.height}
        </div>
      </div>

      <div className="flex-1 p-8 overflow-auto flex items-start justify-center transition-colors duration-300 bg-black/40 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDevice.id}
            ref={previewRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className={`shadow-2xl overflow-hidden border-[12px] border-surface-dark relative origin-top prism-glass ${
              activeDevice.category === 'mobile' ? 'rounded-[3rem]' : 'rounded-2xl'
            }`}
            style={{ 
              width: activeDevice.width, 
              height: activeDevice.height,
              maxWidth: '100%',
              backgroundColor: '#000'
            }}
          >
            {/* Realistic Hardware Overlay */}
            {isRealisticMode && (
              <div className="absolute inset-0 pointer-events-none z-50 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-30" />
            )}

            {/* Content Area */}
            <div className="w-full h-full relative bg-slate-900">
              {results?.performanceMetrics && (
                <PerformanceHUD 
                  metrics={results.performanceMetrics} 
                  darkMode={true} 
                  isLoading={isSimulatingLoading} 
                />
              )}

              {isSimulatingLoading && (
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl z-[60] flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mb-6">
                    <motion.div 
                      className="h-full bg-brand-primary"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    />
                  </div>
                  <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em]">Throttling {networkSpeed.toUpperCase()} Network...</p>
                </div>
              )}

              {/* Iframe Fallback Overlay */}
              {iframeError && (
                <div className="absolute inset-0 z-[55] bg-slate-900 flex flex-col items-center justify-center p-8 text-center">
                  <ShieldAlert className="w-12 h-12 text-amber-500 mb-6" />
                  <h3 className="text-lg font-bold text-white mb-2">Preview Restricted</h3>
                  <p className="text-xs text-white/40 max-w-[200px] leading-relaxed mb-6">
                    This site blocks iframing for security. Automated audits still work!
                  </p>
                  <a 
                    href={activeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-brand-primary/20 text-brand-primary rounded-xl font-bold text-[10px] uppercase border border-brand-primary/30"
                  >
                    Open Externally
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {activeUrl ? (
                <div className="w-full h-full relative">
                  {isRealisticMode && (
                    <div 
                      className="absolute top-0 left-0 w-full bg-slate-100 flex items-center px-4 gap-3 z-40 border-b border-slate-200"
                      style={{ height: activeDevice.headerHeight }}
                    >
                      <div className="flex-1 bg-white rounded-lg h-8 border border-slate-200 flex items-center px-3 gap-2 overflow-hidden">
                        <Lock className="w-3 h-3 text-emerald-600" />
                        <span className="text-[10px] text-slate-400 truncate">{activeUrl.replace(/^https?:\/\//, '')}</span>
                      </div>
                      <button onClick={handleTest} className="hover:bg-slate-200 p-1 rounded-full"><RefreshCw className="w-3 h-3 text-slate-400" /></button>
                    </div>
                  )}
                  <iframe 
                    ref={iframeRef}
                    src={activeUrl} 
                    className={`w-full border-none transition-all duration-700 ${isSimulatingLoading ? 'blur-2xl opacity-50 scale-105' : 'blur-0 opacity-100 scale-100'}`}
                    style={{ 
                      height: isRealisticMode ? `calc(100% - ${activeDevice.headerHeight + activeDevice.footerHeight}px)` : '100%',
                      marginTop: isRealisticMode ? activeDevice.headerHeight : 0
                    }}
                    onLoad={() => setIframeError(false)}
                    onError={() => setIframeError(true)}
                  />
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center">
                    <Globe className="w-8 h-8 text-white/10" />
                  </div>
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">No Target Site</p>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
