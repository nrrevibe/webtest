import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// --- Types & Constants ---
import { 
  DeviceCategory, 
  DeviceConfig, 
  LighthouseResult, 
  AuditHistoryItem,
  DetailedAIInsight,
  SavedThrottlingPreset
} from './types';
import { DEVICES } from './constants';

// --- Components ---
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DevicePreview } from './components/DevicePreview';
import { AuditReport } from './components/AuditReport';
import ErrorBoundary from './components/ErrorBoundary';
import { HistorySection } from './components/HistorySection';
import { TunnelsSection } from './components/TunnelsSection';
import { AuditOrchestrator } from './components/AuditOrchestrator';
import { PerformanceInsights } from './components/PerformanceInsights';

export default function App() {
  // --- State ---
  const [url, setUrl] = useState('');
  const [activeUrl, setActiveUrl] = useState('');
  const [activeDeviceId, setActiveDeviceId] = useState<string>('desktop-fhd');
  const [customWidth, setCustomWidth] = useState(1200);
  const [customHeight, setCustomHeight] = useState(800);
  const [isRealisticMode, setIsRealisticMode] = useState(true);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [isOrientationLocked, setIsOrientationLocked] = useState(false);
  const [networkSpeed, setNetworkSpeed] = useState<'wifi' | '4g' | '3g' | '2g' | 'dsl' | 'high-latency-4g' | 'edge'>('wifi');
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [showStatusIndicators, setShowStatusIndicators] = useState(true);
  const [isSimulatingLoading, setIsSimulatingLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [screenshotPreviewUrl, setScreenshotPreviewUrl] = useState<string | null>(null);
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualText, setManualText] = useState('');
  const [results, setResults] = useState<LighthouseResult | null>(null);
  const [history, setHistory] = useState<AuditHistoryItem[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSlimMode, setIsSlimMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'settings' | 'tunnels'>('dashboard');
  const [aiInsight, setAiInsight] = useState<DetailedAIInsight | null>(null);
  const [isInsightModalOpen, setIsInsightModalOpen] = useState(false);
  const [savedDevicePresets, setSavedDevicePresets] = useState<DeviceConfig[]>([]);
  const [savedThrottlingPresets, setSavedThrottlingPresets] = useState<SavedThrottlingPreset[]>([]);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceWidth, setNewDeviceWidth] = useState(375);
  const [newDeviceHeight, setNewDeviceHeight] = useState(812);
  const [newDeviceCategory, setNewDeviceCategory] = useState<DeviceCategory>('mobile');
  const [newDeviceIsLandscape, setNewDeviceIsLandscape] = useState(false);
  const [newThrottlingName, setNewThrottlingName] = useState('');
  const [newThrottlingRtt, setNewThrottlingRtt] = useState(150);
  const [newThrottlingThroughput, setNewThrottlingThroughput] = useState(1638.4);
  const [newThrottlingCpu, setNewThrottlingCpu] = useState(4);
  const [error, setError] = useState<string | null>(null);
  const [throttlingConfig, setThrottlingConfig] = useState({
    rtt: 150,
    throughput: 1638.4,
    cpu: 4
  });
  const [isCustomThrottling, setIsCustomThrottling] = useState(false);
  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [comparisonDeviceIds, setComparisonDeviceIds] = useState<string[]>(['desktop-fhd', 'iphone-14-pro']);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  
  const reportRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // --- Effects ---
  useEffect(() => {
    setIsHeaderHidden(false);
    // Sync throttling with device category if not custom
    if (!isCustomThrottling) {
      const category = activeDevice.category;
      if (networkSpeed === 'wifi') {
        if (category === 'desktop') {
          setThrottlingConfig({ rtt: 40, throughput: 10240, cpu: 1 });
        } else {
          setThrottlingConfig({ rtt: 150, throughput: 1638.4, cpu: 4 });
        }
      } else if (networkSpeed === '4g') {
        setThrottlingConfig({ rtt: 150, throughput: 4096, cpu: 4 });
      } else if (networkSpeed === '3g') {
        setThrottlingConfig({ rtt: 300, throughput: 1600, cpu: 4 });
      } else if (networkSpeed === '2g') {
        setThrottlingConfig({ rtt: 800, throughput: 450, cpu: 6 });
      } else if (networkSpeed === 'dsl') {
        setThrottlingConfig({ rtt: 50, throughput: 2048, cpu: 1 });
      } else if (networkSpeed === 'high-latency-4g') {
        setThrottlingConfig({ rtt: 400, throughput: 4096, cpu: 4 });
      } else if (networkSpeed === 'edge') {
        setThrottlingConfig({ rtt: 1000, throughput: 250, cpu: 6 });
      }
    }
  }, [isRealisticMode, activeDeviceId, isCustomThrottling, networkSpeed]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('audit-history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    
    const savedDarkMode = localStorage.getItem('dark-mode');
    if (savedDarkMode === 'true') setDarkMode(true);

    const savedDevicePresets = localStorage.getItem('saved-device-presets');
    if (savedDevicePresets) setSavedDevicePresets(JSON.parse(savedDevicePresets));

    const savedThrottlingPresets = localStorage.getItem('saved-throttling-presets');
    if (savedThrottlingPresets) setSavedThrottlingPresets(JSON.parse(savedThrottlingPresets));
  }, []);

  useEffect(() => {
    localStorage.setItem('audit-history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('saved-device-presets', JSON.stringify(savedDevicePresets));
  }, [savedDevicePresets]);

  useEffect(() => {
    localStorage.setItem('saved-throttling-presets', JSON.stringify(savedThrottlingPresets));
  }, [savedThrottlingPresets]);

  useEffect(() => {
    localStorage.setItem('dark-mode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Scroll detection for Realistic Mode header hiding
  useEffect(() => {
    const element = previewRef.current;
    if (!element || !isRealisticMode) return;

    let lastTouchY = 0;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 10) {
        setIsHeaderHidden(true);
      } else if (e.deltaY < -10) {
        setIsHeaderHidden(false);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const deltaY = lastTouchY - currentY;
      if (deltaY > 10) {
        setIsHeaderHidden(true);
      } else if (deltaY < -10) {
        setIsHeaderHidden(false);
      }
      lastTouchY = currentY;
    };

    element.addEventListener('wheel', handleWheel, { passive: true });
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      element.removeEventListener('wheel', handleWheel);
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isRealisticMode]);

  // --- Handlers ---
  const handleDeviceChange = (id: string) => {
    setActiveDeviceId(id);
    const device = DEVICES.find(d => d.id === id) || savedDevicePresets.find(d => d.id === id);
    if (device && device.isLandscape !== undefined) {
      setIsLandscape(device.isLandscape);
    }
  };

  const activeDevice = activeDeviceId === 'custom' 
    ? { id: 'custom', name: 'Custom Resolution', width: isLandscape ? customHeight : customWidth, height: isLandscape ? customWidth : customHeight, category: 'custom' as DeviceCategory, headerHeight: 40, footerHeight: 0 }
    : (() => {
        const d = DEVICES.find(d => d.id === activeDeviceId) || savedDevicePresets.find(d => d.id === activeDeviceId) || DEVICES[0];
        return isLandscape ? { ...d, width: d.height, height: d.width } : d;
      })();

  const handleTest = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url) return;

    let formattedUrl = url;
    if (!/^https?:\/\//i.test(url)) {
      formattedUrl = 'https://' + url;
    }

    setIsLoading(true);
    setIsSimulatingLoading(true);
    setError(null);
    setActiveUrl(formattedUrl);
    setCurrentStepIndex(0);

    let isFetchingAudit = true;
    const runOrchestrator = async () => {
      await new Promise(r => setTimeout(r, 800)); setCurrentStepIndex(1); // Init -> Launch
      await new Promise(r => setTimeout(r, 1200)); setCurrentStepIndex(2); // Launch -> Navigate
      await new Promise(r => setTimeout(r, 1500)); setCurrentStepIndex(3); // Navigate -> Metrics
      await new Promise(r => setTimeout(r, 1000)); if (isFetchingAudit) setCurrentStepIndex(4); // Metrics -> Audit 
      // Stays on 4 until Lighthouse completes
    };
    runOrchestrator();

    if (isManualMode && manualText) {
      try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error("Gemini API key is required for manual report parsing.");
        
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `Parse this Lighthouse report text and return a JSON object matching this structure:
        {
          "performance": number,
          "accessibility": number,
          "bestPractices": number,
          "seo": number,
          "details": { "fcp": "string", "lcp": "string", "cls": "string", "tbt": "string", "speedIndex": "string" },
          "seoDetails": [{ "id": "string", "title": "string", "description": "string", "score": number }],
          "diagnostics": [{ "label": "string", "value": "string", "savings": "string" }]
        }
        
        Report Text:
        ${manualText}`;

        const genResponse = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
          config: { responseMimeType: "application/json" }
        });

        const parsedResults = JSON.parse(genResponse.text || '{}');
        setResults(parsedResults);
        setAiInsight({
          summary: "Manual report parsed successfully. Here are your insights based on the provided data.",
          recommendations: [
            { title: "Manual Data Analysis", impact: "Provides insights from your pasted text.", steps: "Review the metrics and diagnostics extracted from the manual report." }
          ]
        });
      } catch (err: any) {
        console.error('Manual Parse Error:', err);
        setError("Failed to parse manual report. Please ensure the text contains Lighthouse metrics.");
      } finally {
        setIsLoading(false);
        setIsSimulatingLoading(false);
      }
      return;
    }

    try {
      const isLocalhost = formattedUrl.includes('localhost') || formattedUrl.includes('127.0.0.1');
      
      if (isLocalhost) {
        setError("Note: Auditing localhost requires the server to be accessible from our remote engine. Preview will work if running on your machine.");
      }

      const strategy = activeDevice.category === 'mobile' ? 'mobile' : 'desktop';
      
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: formattedUrl, 
          strategy,
          throttling: isRealisticMode ? throttlingConfig : undefined
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (isLocalhost) {
          throw new Error("Lighthouse could not reach your localhost. Automated audits only work for public URLs. Preview is still active.");
        }
        throw new Error(errorData.error || 'Audit failed. The site might be blocking automated tools or taking too long to load.');
      }

      const apiResults: LighthouseResult = await response.json();
      isFetchingAudit = false;
      setResults(apiResults);
      setCurrentStepIndex(5); // Now start AI Generation step
      
      setHistory(prev => [{ url: formattedUrl, results: apiResults, date: new Date().toISOString() }, ...prev.slice(0, 9)]);

      // Fetch AI Insights
      try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey) {
          const ai = new GoogleGenAI({ apiKey });
          let prompt = `Analyze these Lighthouse scores for a website:
          Performance: ${apiResults.performance}
          Accessibility: ${apiResults.accessibility}
          Best Practices: ${apiResults.bestPractices}
          SEO: ${apiResults.seo}
          
          Metrics:
          FCP: ${apiResults.details.fcp}
          LCP: ${apiResults.details.lcp}
          CLS: ${apiResults.details.cls}
          TBT: ${apiResults.details.tbt}
          
          Provide a detailed expert analysis in JSON format with this structure:
          {
            "summary": "A 1-sentence high-level summary of the site's health",
            "recommendations": [
              {
                "title": "Short title of the recommendation",
                "impact": "Detailed explanation of the impact of this suggestion on metrics",
                "steps": "Specific technical steps to implement this"
              }
            ]
          }
          Provide exactly 3 recommendations. Be specific and technical.`;

          if (isSlimMode) {
            prompt += `\n\nAdditionally, focus on "Slim Optimization" advice. Focus on reducing asset sizes, removing unused code, and minimizing the overall page weight to make the site as "slim" as possible.`;
          }

          const genResponse = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { responseMimeType: "application/json" }
          });
          
          if (genResponse.text) {
            const parsedInsight: DetailedAIInsight = JSON.parse(genResponse.text);
            setAiInsight(parsedInsight);
          }
        } else {
          setAiInsight({
            summary: "Gemini API key not configured.",
            recommendations: [
              { title: "Configure API Key", impact: "Enables AI-powered expert recommendations.", steps: "Add GEMINI_API_KEY to your environment variables." }
            ]
          });
        }
      } catch (aiErr) {
        console.error('AI Insight Error:', aiErr);
        setAiInsight({
          summary: "Failed to generate AI insights.",
          recommendations: [
            { title: "Check Configuration", impact: "Ensures the AI service is reachable.", steps: "Verify your API key and network connection." }
          ]
        });
      }
      
      setCurrentStepIndex(6); // Complete the pipeline
    } catch (err: any) {
      console.error('Audit Error:', err);
      setError(err.message || 'Failed to fetch performance data. Please check the URL and try again.');
    } finally {
      setIsLoading(false);
      setIsSimulatingLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!reportRef.current || !previewRef.current || !results) return;
    
    setIsLoading(true);
    try {
      const reportCanvas = await html2canvas(reportRef.current, { scale: 2 });
      const previewCanvas = await html2canvas(previewRef.current, { scale: 1, useCORS: true });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      
      // Page 1
      pdf.setFillColor(5, 150, 105);
      pdf.rect(0, 0, pageWidth, 40, 'F');
      pdf.setFontSize(24);
      pdf.setTextColor(255, 255, 255);
      pdf.text('Website Audit Report', 15, 25);
      
      const previewImg = previewCanvas.toDataURL('image/png');
      pdf.addImage(previewImg, 'PNG', 15, 150, 100, (previewCanvas.height * 100) / previewCanvas.width);

      pdf.addPage();
      const reportImg = reportCanvas.toDataURL('image/png');
      pdf.addImage(reportImg, 'PNG', 15, 30, 180, (reportCanvas.height * 180) / reportCanvas.width);
      
      pdf.save(`audit-report-${activeUrl.replace(/[^a-z0-9]/gi, '-')}.pdf`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const captureScreenshot = async () => {
    if (!previewRef.current || !activeUrl) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: activeUrl, 
          width: activeDevice.width, 
          height: activeDevice.height,
          deviceScaleFactor: 2 
        })
      });

      if (!response.ok) throw new Error('Failed to fetch capture node from server.');

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setScreenshotPreviewUrl(data.screenshot);
      
      // Wait for the overlay data URI to render in the DOM
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const canvas = await html2canvas(previewRef.current, { 
        scale: 2, 
        useCORS: true,
        backgroundColor: null,
        allowTaint: true
      });

      const link = document.createElement('a');
      link.download = `responsive-audit-${new Date().getTime()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err: any) {
      console.error('Screenshot Error:', err);
      setError(err.message || 'Failed to capture viewport screenshot.');
    } finally {
      setScreenshotPreviewUrl(null);
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (!activeUrl) return;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'ResponsiveCheck', url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied!');
      }
    } catch (err) { console.error(err); }
  };

  const scrollToHistory = () => {
    setActiveTab('history');
    setTimeout(() => {
      const el = document.getElementById('history-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="flex min-h-screen font-sans bg-background selection:bg-brand-primary/10">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
      />
      
      <main className={`flex-1 min-w-0 transition-all duration-300 ${isSidebarOpen ? 'pl-[260px]' : 'pl-[80px]'} bg-background flex flex-col`}>
        <Header 
          activeUrl={activeUrl}
          isManualMode={isManualMode}
          setIsManualMode={setIsManualMode}
          manualText={manualText}
          setManualText={setManualText}
          isComparisonMode={isComparisonMode}
          setIsComparisonMode={setIsComparisonMode}
          isSlimMode={isSlimMode}
          setIsSlimMode={setIsSlimMode}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          handleTest={handleTest}
          handleShare={handleShare}
          setUrl={setUrl}
          url={url}
          isLoading={isLoading}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          setActiveTab={setActiveTab}
        />
        
        <div className="flex-1 p-8 sm:p-12 overflow-y-auto no-scrollbar scroll-smooth">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-[1440px] mx-auto space-y-8"
              >
                {/* Upper Grid: Pipeline + Viewport Configuration */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Audit Pipeline Card */}
                  <div className="bg-surface border border-border rounded-xl p-8 shadow-sm">
                    <div className="mb-8">
                      <h2 className="text-lg font-bold">Audit Pipeline</h2>
                      <p className="text-xs text-muted-foreground font-medium">Real-time Orchestration</p>
                    </div>
                    <AuditOrchestrator 
                      isLoading={isLoading} 
                      currentStepIndex={currentStepIndex} 
                    />
                  </div>

                  {/* Viewport & Simulation Card */}
                  <div className="bg-surface border border-border rounded-xl p-8 shadow-sm">
                    <div className="mb-8">
                      <h2 className="text-lg font-bold">Simulation & Viewport</h2>
                      <p className="text-xs text-muted-foreground font-medium">Configure test environment</p>
                    </div>
                    <DevicePreview 
                      activeDevice={activeDevice}
                      setActiveDeviceId={handleDeviceChange}
                      customWidth={customWidth}
                      setCustomWidth={setCustomWidth}
                      customHeight={customHeight}
                      setCustomHeight={setCustomHeight}
                      isRealisticMode={isRealisticMode}
                      setIsRealisticMode={setIsRealisticMode}
                      networkSpeed={networkSpeed}
                      setNetworkSpeed={setNetworkSpeed}
                      batteryLevel={batteryLevel}
                      setBatteryLevel={setBatteryLevel}
                      isLandscape={isLandscape}
                      setIsLandscape={setIsLandscape}
                      isOrientationLocked={isOrientationLocked}
                      setIsOrientationLocked={setIsOrientationLocked}
                      showStatusIndicators={showStatusIndicators}
                      setShowStatusIndicators={setShowStatusIndicators}
                      isLoading={isLoading}
                      captureScreenshot={captureScreenshot}
                      activeUrl={activeUrl}
                      isSimulatingLoading={isSimulatingLoading}
                      screenshotPreviewUrl={screenshotPreviewUrl}
                      isHeaderHidden={isHeaderHidden}
                      setIsHeaderHidden={setIsHeaderHidden}
                      handleTest={() => handleTest()}
                      previewRef={previewRef}
                      darkMode={darkMode}
                      throttlingConfig={throttlingConfig}
                      setThrottlingConfig={setThrottlingConfig}
                      isCustomThrottling={isCustomThrottling}
                      setIsCustomThrottling={setIsCustomThrottling}
                      savedDevicePresets={savedDevicePresets}
                      savedThrottlingPresets={savedThrottlingPresets}
                      results={results}
                    />
                  </div>
                </div>

                {/* Audit Report Section */}
                {results && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-8"
                  >
                    <div className="bg-surface border border-border rounded-xl shadow-sm">
                      <AuditReport 
                        results={results}
                        isLoading={isLoading}
                        downloadPDF={downloadPDF}
                        scrollToHistory={scrollToHistory}
                        aiInsight={aiInsight}
                        activeUrl={activeUrl}
                        reportRef={reportRef}
                        darkMode={darkMode}
                        isInsightModalOpen={isInsightModalOpen}
                        setIsInsightModalOpen={setIsInsightModalOpen}
                        isSlimMode={isSlimMode}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Benchmarking History (Simplified for Dashboard) */}
                {!isLoading && history.length > 0 && (
                  <div className="bg-surface border border-border rounded-xl p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-base font-bold">Benchmarking History</h3>
                        <p className="text-xs text-muted-foreground font-medium truncate max-w-[300px]">Node Analysis: {activeUrl || 'All Clusters'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-end justify-between gap-4 h-[160px] pb-6 border-b border-border">
                      {history.slice(0, 7).reverse().map((item, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-3 group relative h-full justify-end">
                          {/* Score Label on Hover or for Active */}
                          <div className={`absolute -top-6 left-1/2 -translate-x-1/2 transition-opacity duration-300 ${item.url === activeUrl ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            <span className="text-[10px] font-bold bg-foreground text-background px-1.5 py-0.5 rounded shadow-sm">
                              {item.results.performance}
                            </span>
                          </div>

                          <div 
                            className={`w-full max-w-[40px] rounded-t-lg transition-all duration-700 relative ${item.url === activeUrl ? 'bg-blue-600 shadow-[0_-4px_12px_rgba(37,99,235,0.2)]' : 'bg-muted hover:bg-muted-foreground/10'}`}
                            style={{ height: `${item.results.performance}%` }}
                          />
                          
                          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter truncate w-full text-center">
                            {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between mt-6 px-1">
                       <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-muted" />
                         <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Historical Results</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-blue-600" />
                         <span className="text-[10px] font-bold text-foreground uppercase tracking-widest">Selected Stream</span>
                       </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}


            {activeTab === 'history' && (
              <motion.div 
                key="history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <HistorySection 
                  history={history}
                  setHistory={setHistory}
                  setActiveUrl={setActiveUrl}
                  setUrl={setUrl}
                  setResults={setResults}
                  darkMode={darkMode}
                />
              </motion.div>
            )}

            {activeTab === 'tunnels' && (
              <motion.div 
                key="tunnels"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <TunnelsSection darkMode={darkMode} />
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-2xl mx-auto"
              >
                <div className={`p-8 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
                  <h2 className="text-2xl font-bold mb-6">Settings</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold">Dark Mode</p>
                        <p className="text-sm text-gray-500">Toggle the application theme</p>
                      </div>
                      <button 
                        onClick={() => setDarkMode(!darkMode)}
                        className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-emerald-500' : 'bg-gray-300'} relative`}
                      >
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-6' : ''}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                      <div>
                        <p className="font-bold">Slim Mode</p>
                        <p className="text-sm text-gray-500">Enable deep asset optimization insights (Powered by Slim.sh concepts)</p>
                      </div>
                      <button 
                        onClick={() => setIsSlimMode(!isSlimMode)}
                        className={`w-12 h-6 rounded-full transition-colors ${isSlimMode ? 'bg-emerald-500' : 'bg-gray-300'} relative`}
                      >
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${isSlimMode ? 'translate-x-6' : ''}`} />
                      </button>
                    </div>

                    {/* Custom Device Presets */}
                    <div className="pt-6 border-t border-gray-100">
                      <h3 className="font-bold mb-4">Custom Device Presets</h3>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <input 
                          type="text" 
                          placeholder="Device Name (e.g. iPhone 15)"
                          value={newDeviceName}
                          onChange={(e) => setNewDeviceName(e.target.value)}
                          className={`px-4 py-2 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}
                        />
                        <select 
                          value={newDeviceCategory}
                          onChange={(e) => setNewDeviceCategory(e.target.value as DeviceCategory)}
                          className={`px-4 py-2 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}
                        >
                          <option value="mobile">Mobile</option>
                          <option value="tablet">Tablet</option>
                          <option value="desktop">Desktop</option>
                          <option value="custom">Custom</option>
                        </select>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">W:</span>
                          <input 
                            type="number" 
                            value={newDeviceWidth}
                            onChange={(e) => setNewDeviceWidth(Number(e.target.value))}
                            className={`w-full px-4 py-2 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">H:</span>
                          <input 
                            type="number" 
                            value={newDeviceHeight}
                            onChange={(e) => setNewDeviceHeight(Number(e.target.value))}
                            className={`w-full px-4 py-2 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Landscape:</span>
                          <button 
                            onClick={() => setNewDeviceIsLandscape(!newDeviceIsLandscape)}
                            className={`w-10 h-5 rounded-full transition-colors ${newDeviceIsLandscape ? 'bg-emerald-500' : 'bg-gray-300'} relative`}
                          >
                            <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${newDeviceIsLandscape ? 'translate-x-5' : ''}`} />
                          </button>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          if (!newDeviceName) return;
                          const newDevice: DeviceConfig = {
                            id: `custom-${Date.now()}`,
                            name: newDeviceName,
                            width: newDeviceWidth,
                            height: newDeviceHeight,
                            category: newDeviceCategory,
                            headerHeight: 40,
                            footerHeight: 0,
                            isLandscape: newDeviceIsLandscape
                          };
                          setSavedDevicePresets([...savedDevicePresets, newDevice]);
                          setNewDeviceName('');
                        }}
                        className="w-full py-2 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors"
                      >
                        Save Device Preset
                      </button>

                      {savedDevicePresets.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {savedDevicePresets.map(device => (
                            <div key={device.id} className={`flex items-center justify-between p-3 rounded-xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-100'}`}>
                              <div className="flex flex-col">
                                <span className="text-sm font-bold">{device.name}</span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                                  {device.width}x{device.height} • {device.category} {device.isLandscape ? '• Landscape' : ''}
                                </span>
                              </div>
                              <button 
                                onClick={() => setSavedDevicePresets(savedDevicePresets.filter(d => d.id !== device.id))}
                                className="text-red-500 hover:text-red-600 p-1"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Custom Throttling Presets */}
                    <div className="pt-6 border-t border-gray-100">
                      <h3 className="font-bold mb-4">Custom Throttling Presets</h3>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <input 
                          type="text" 
                          placeholder="Preset Name (e.g. Slow WiFi)"
                          value={newThrottlingName}
                          onChange={(e) => setNewThrottlingName(e.target.value)}
                          className={`px-4 py-2 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">RTT:</span>
                          <input 
                            type="number" 
                            value={newThrottlingRtt}
                            onChange={(e) => setNewThrottlingRtt(Number(e.target.value))}
                            className={`w-full px-4 py-2 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Kbps:</span>
                          <input 
                            type="number" 
                            value={newThrottlingThroughput}
                            onChange={(e) => setNewThrottlingThroughput(Number(e.target.value))}
                            className={`w-full px-4 py-2 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">CPU:</span>
                          <input 
                            type="number" 
                            value={newThrottlingCpu}
                            onChange={(e) => setNewThrottlingCpu(Number(e.target.value))}
                            className={`w-full px-4 py-2 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}
                          />
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          if (!newThrottlingName) return;
                          const newPreset: SavedThrottlingPreset = {
                            id: `throttle-${Date.now()}`,
                            name: newThrottlingName,
                            rtt: newThrottlingRtt,
                            throughput: newThrottlingThroughput,
                            cpu: newThrottlingCpu
                          };
                          setSavedThrottlingPresets([...savedThrottlingPresets, newPreset]);
                          setNewThrottlingName('');
                        }}
                        className="w-full py-2 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors"
                      >
                        Save Throttling Preset
                      </button>

                      {savedThrottlingPresets.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {savedThrottlingPresets.map(preset => (
                            <div key={preset.id} className={`flex items-center justify-between p-3 rounded-xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-100'}`}>
                              <div className="flex flex-col">
                                <span className="text-sm font-bold">{preset.name}</span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-wider">RTT: {preset.rtt}ms • {preset.throughput}Kbps • {preset.cpu}x CPU</span>
                              </div>
                              <button 
                                onClick={() => setSavedThrottlingPresets(savedThrottlingPresets.filter(p => p.id !== preset.id))}
                                className="text-red-500 hover:text-red-600 p-1"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                      <p className="font-bold mb-2 text-red-500">Danger Zone</p>
                      <button 
                        onClick={() => {
                          if(confirm('Clear all audit history?')) {
                            setHistory([]);
                            localStorage.removeItem('audit-history');
                          }
                        }}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors"
                      >
                        Clear All History
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
