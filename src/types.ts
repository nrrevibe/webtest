export type DeviceCategory = 'mobile' | 'tablet' | 'desktop' | 'custom';

export interface DeviceConfig {
  id: string;
  name: string;
  width: number;
  height: number;
  category: DeviceCategory;
  headerHeight: number;
  footerHeight: number;
  isLandscape?: boolean;
}

export interface SEOAudit {
  id: string;
  title: string;
  description: string;
  score: number;
}

export interface ThrottlingConfig {
  rtt: number;
  throughput: number;
  cpu: number;
}

export interface LighthouseResult {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  details: {
    fcp: string;
    lcp: string;
    cls: string;
    tbt: string;
    speedIndex: string;
  };
  seoDetails: SEOAudit[];
  diagnostics?: {
    label: string;
    value: string;
    savings?: string;
  }[];
  assets?: AssetInfo[];
  performanceMetrics?: PerformanceMetrics;
  slimChecklist?: SlimChecklistItem[];
}

export interface AssetInfo {
  name: string;
  url: string;
  type: 'js' | 'css' | 'image' | 'font' | 'other';
  size: number; // in bytes
  savings?: number; // potential savings
}

export interface PerformanceMetrics {
  fps: number;
  memoryUsage: number; // in MB
  tti: string; // Time to Interactive
}

export interface SlimChecklistItem {
  id: string;
  label: string;
  status: 'pass' | 'fail' | 'warning';
  description: string;
  remedy: string;
}

export interface DetailedAIInsight {
  summary: string;
  recommendations: {
    title: string;
    impact: string;
    steps: string;
  }[];
}

export interface SavedThrottlingPreset extends ThrottlingConfig {
  id: string;
  name: string;
}

export interface AuditHistoryItem {
  url: string;
  results: LighthouseResult;
  date: string;
}
