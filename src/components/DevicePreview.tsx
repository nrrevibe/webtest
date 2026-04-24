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
  isCapturing: boolean;
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
  results,
  isCapturing
}) => {
  const [iframeError, setIframeError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth - 48; // Padding
        const containerHeight = containerRef.current.clientHeight - 48;
        const scaleX = containerWidth / activeDevice.width;
        const scaleY = containerHeight / activeDevice.height;
        setScale(Math.min(1, scaleX, scaleY));
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [activeDevice.width, activeDevice.height, isRealisticMode]);

  return (
    <div className="flex flex-col h-full min-h-[600px] transition-all duration-300">
      {/* Simulation Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="flex bg-muted p-1 rounded-lg border border-border">
            {(['mobile', 'tablet', 'desktop'] as DeviceCategory[]).map((cat) => {
              const Icon = cat === 'mobile' ? Smartphone : cat === 'tablet' ? Tablet : Monitor;
              return (
                <button 
                  key={cat}
                  className={`p-1.5 rounded-md transition-all ${activeDevice.category === cat ? 'bg-surface shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => {
                    const firstOfCat = DEVICES.find(d => d.category === cat);
                    if (firstOfCat) setActiveDeviceId(firstOfCat.id);
                  }}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
          
          <select 
            className="bg-surface border border-border text-xs font-bold px-3 py-2 rounded-lg outline-none cursor-pointer hover:border-foreground/20 transition-all shadow-sm"
            value={activeDevice.id}
            onChange={(e) => setActiveDeviceId(e.target.value)}
          >
            <option value="" disabled>Select Device</option>
            <optgroup label="System Devices">
              {DEVICES.filter(d => d.category !== 'custom').map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </optgroup>
            {savedDevicePresets.length > 0 && (
              <optgroup label="Custom Presets">
                {savedDevicePresets.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </optgroup>
            )}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg border border-border">
            <button 
              onClick={() => setIsRealisticMode(!isRealisticMode)}
              className="flex items-center gap-2 group mr-2 border-r border-border pr-3"
            >
              <div className={`w-7 h-4 rounded-full relative transition-all ${isRealisticMode ? 'bg-blue-600' : 'bg-slate-300'}`}>
                <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-all ${isRealisticMode ? 'translate-x-3' : ''}`} />
              </div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Realistic</span>
            </button>
            <button 
              onClick={() => setIsLandscape(!isLandscape)}
              className={`p-1 rounded-md transition-all flex items-center gap-2 ${isLandscape ? 'bg-surface shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              title="Rotate Device"
            >
              <RotateCcw className={`w-3.5 h-3.5 transition-transform duration-500 ${isLandscape ? 'rotate-90' : ''}`} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Rotate</span>
            </button>
          </div>
          
          <button 
            onClick={() => captureScreenshot()}
            disabled={isLoading || !activeUrl || isCapturing}
            className={`p-2 bg-surface border border-border rounded-lg text-muted-foreground hover:text-foreground transition-all shadow-sm disabled:opacity-30 relative group overflow-hidden`}
          >
            {isCapturing ? (
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
            ) : (
              <Camera className="w-4 h-4 translate-y-0 group-hover:-translate-y-1 transition-transform" />
            )}
            {isCapturing && (
              <span className="absolute inset-0 bg-blue-500/5 animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* Main Preview Chamber */}
      <div 
        ref={containerRef}
        className="flex-1 bg-muted rounded-xl border border-border/50 flex flex-col items-center justify-center p-6 relative overflow-hidden"
      >
        {/* Subtle Background Markings */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDevice.id}
            ref={previewRef}
            initial={{ opacity: 0, scale: scale * 0.95 }}
            animate={{ opacity: 1, scale: scale }}
            exit={{ opacity: 0, scale: scale * 0.95 }}
            className={`shadow-2xl relative transition-shadow duration-500 origin-center ${
              isRealisticMode ? (activeDevice.category === 'mobile' ? 'rounded-[3.2rem]' : 'rounded-2xl') : ''
            }`}
            style={{ 
              width: activeDevice.width, 
              height: activeDevice.height,
              border: isRealisticMode ? '10px solid #020817' : '1px solid var(--color-border)',
              backgroundColor: '#fff',
              boxShadow: isRealisticMode ? '0 30px 60px -12px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            {/* Realistic Hardware Details */}
            {isRealisticMode && activeDevice.category === 'mobile' && (
              <>
                {/* Dynamic Island / Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-7 bg-[#020817] rounded-full z-[60] flex items-center justify-end px-4 gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500/20" />
                   <div className="w-4 h-1 bg-white/5 rounded-full" />
                </div>
                
                {/* Side Buttons */}
                <div className="absolute top-24 -left-[12px] w-[3px] h-12 bg-[#020817] rounded-r-sm shadow-sm" />
                <div className="absolute top-40 -left-[12px] w-[3px] h-16 bg-[#020817] rounded-r-sm shadow-sm" />
                <div className="absolute top-60 -left-[12px] w-[3px] h-16 bg-[#020817] rounded-r-sm shadow-sm" />
                <div className="absolute top-32 -right-[12px] w-[3px] h-20 bg-[#020817] rounded-l-sm shadow-sm" />
              </>
            )}

            {/* Viewport Content */}
            <div className={`w-full h-full relative overflow-hidden ${isRealisticMode ? (activeDevice.category === 'mobile' ? 'rounded-[2.6rem]' : 'rounded-lg') : ''}`}>
              {/* Browser Chromes */}
              {isRealisticMode && (
                <div 
                  className="absolute top-0 left-0 w-full bg-slate-50 border-b border-slate-200 flex flex-col items-center z-50 px-8"
                  style={{ height: activeDevice.headerHeight }}
                >
                  <div className="w-full flex items-center justify-between mt-6">
                    <div className="flex items-center gap-1.5 flex-1">
                       <div className="bg-slate-200/50 rounded-lg h-8 flex-1 flex items-center px-4 gap-2 text-slate-400">
                          <Lock className="w-3 h-3 text-emerald-500" />
                          <span className="text-[10px] font-medium truncate max-w-[200px]">{activeUrl || 'Search or enter website'}</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                       <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                       <Share2 className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>
                </div>
              )}

              {isSimulatingLoading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-8 text-center">
                  <div className="relative mb-6">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl animate-pulse" />
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-blue-600 mb-1">Engaging Simulation</p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60">{networkSpeed.replace(/-/g, ' ')} Active</p>
                </div>
              )}

              {isCapturing && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-[70] flex flex-col items-center justify-center text-white">
                  <div className="relative mb-4">
                    <Camera className="w-8 h-8 animate-bounce" />
                    <div className="absolute inset-0 bg-white/40 blur-2xl animate-pulse" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-[0.4em] animate-pulse">Capturing Frame</p>
                  <div className="mt-4 w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="w-full h-full bg-blue-500"
                    />
                  </div>
                </div>
              )}

              {activeUrl ? (
                <div className="w-full h-full relative">
                  {screenshotPreviewUrl && (
                    <motion.img 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      src={screenshotPreviewUrl} 
                      className="absolute inset-0 w-full h-full object-cover z-[60]"
                      alt="Screenshot Capture Overlay"
                    />
                  )}
                  {iframeError ? (
                    <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
                      <ShieldAlert className="w-12 h-12 text-amber-500 mb-4" />
                      <h4 className="text-sm font-bold mb-2">Security Restriction</h4>
                      <p className="text-[10px] text-muted-foreground font-medium mb-6">Website blocked iframing via X-Frame-Options.</p>
                      <a href={activeUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-foreground text-background text-[10px] font-bold uppercase rounded-lg">Open Node</a>
                    </div>
                  ) : (
                    <iframe 
                      ref={iframeRef}
                      src={activeUrl} 
                      className={`w-full border-none transition-all ${isSimulatingLoading ? 'opacity-20 blur-sm' : 'opacity-100'}`}
                      style={{ 
                        height: isRealisticMode ? `calc(100% - ${activeDevice.headerHeight}px)` : '100%',
                        marginTop: isRealisticMode ? activeDevice.headerHeight : 0
                      }}
                      onLoad={() => setIframeError(false)}
                      onError={() => setIframeError(true)}
                    />
                  )}
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center text-muted-foreground/30">
                  <Globe className="w-16 h-16 mb-4" />
                  <p className="text-xs font-bold uppercase tracking-widest">Viewport Ready</p>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Viewport Info Footer */}
      <div className="mt-6 flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Resolution</span>
            <span className="text-xs font-bold font-mono">{activeDevice.width} × {activeDevice.height}</span>
          </div>
          <div className="w-[1px] h-6 bg-border" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Network</span>
            <span className="text-xs font-bold uppercase">{networkSpeed}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
           <button 
             onClick={() => setNetworkSpeed('4g')}
             className="text-[10px] font-bold text-blue-600 hover:underline"
           >
             Modify Simulation Config
           </button>
        </div>
      </div>
    </div>
  );
};
