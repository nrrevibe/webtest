import React from 'react';
import { AssetInfo } from '../types';
import { motion } from 'motion/react';

interface AssetTreemapProps {
  assets: AssetInfo[];
  darkMode: boolean;
}

export default function AssetTreemap({ assets, darkMode }: AssetTreemapProps) {
  const totalSize = assets.reduce((acc, asset) => acc + asset.size, 0);
  
  const typeColors: Record<string, string> = {
    script: 'bg-amber-500',
    stylesheet: 'bg-blue-500',
    image: 'bg-emerald-500',
    font: 'bg-purple-500',
    other: 'bg-gray-500'
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
          Asset Weight Breakdown
        </h3>
        <span className={`text-[10px] font-mono font-bold ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>
          Total: {formatSize(totalSize)}
        </span>
      </div>

      <div className="flex h-8 w-full rounded-lg overflow-hidden border border-gray-100/10">
        {assets.map((asset, idx) => {
          const width = (asset.size / totalSize) * 100;
          if (width < 1) return null;
          return (
            <motion.div
              key={idx}
              initial={{ width: 0 }}
              animate={{ width: `${width}%` }}
              className={`${typeColors[asset.type] || typeColors.other} h-full border-r border-white/10 last:border-0`}
              title={`${asset.name} (${formatSize(asset.size)})`}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {Object.entries(typeColors).map(([type, color]) => {
          const typeSize = assets
            .filter(a => a.type === type)
            .reduce((acc, a) => acc + a.size, 0);
          if (typeSize === 0) return null;
          
          return (
            <div key={type} className={`p-2 rounded-lg border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-100'}`}>
              <div className="flex items-center gap-1.5 mb-1">
                <div className={`w-2 h-2 rounded-full ${color}`} />
                <span className="text-[9px] font-bold uppercase text-gray-400">{type}</span>
              </div>
              <p className={`text-[11px] font-mono font-bold ${darkMode ? 'text-slate-200' : 'text-gray-700'}`}>
                {formatSize(typeSize)}
              </p>
            </div>
          );
        })}
      </div>

      <div className="space-y-1 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
        {assets.sort((a, b) => b.size - a.size).map((asset, idx) => (
          <div key={idx} className={`flex items-center justify-between p-2 rounded-lg text-[10px] ${darkMode ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'}`}>
            <div className="flex items-center gap-2 overflow-hidden">
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${typeColors[asset.type] || typeColors.other}`} />
              <span className={`truncate font-medium ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{asset.name}</span>
            </div>
            <span className={`font-mono font-bold shrink-0 ml-4 ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>
              {formatSize(asset.size)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
