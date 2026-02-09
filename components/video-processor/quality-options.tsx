'use client';

import React from 'react';
import { Maximize, Activity, Gauge } from 'lucide-react';

// Resolution types
export type Resolution = 'original' | '4k' | '1080p' | '720p' | '480p' | 'custom';

interface ResolutionOption {
  value: Resolution;
  label: string;
  dimensions?: string;
}

const resolutions: ResolutionOption[] = [
  { value: 'original', label: 'Original', dimensions: 'Keep source' },
  { value: '4k', label: '4K', dimensions: '3840×2160' },
  { value: '1080p', label: '1080p', dimensions: '1920×1080' },
  { value: '720p', label: '720p', dimensions: '1280×720' },
  { value: '480p', label: '480p', dimensions: '854×480' }
];

// Frame rate types
export type FrameRate = 'original' | 60 | 30 | 24;

interface FrameRateOption {
  value: FrameRate;
  label: string;
}

const frameRates: FrameRateOption[] = [
  { value: 'original', label: 'Original' },
  { value: 60, label: '60fps' },
  { value: 30, label: '30fps' },
  { value: 24, label: '24fps' }
];

// Quality levels
const qualityLabels = ['Low', 'Medium', 'High', 'Best'];

interface QualityOptionsProps {
  resolution: Resolution;
  onResolutionChange: (resolution: Resolution) => void;
  quality: number; // 1-4
  onQualityChange: (quality: number) => void;
  frameRate: FrameRate;
  onFrameRateChange: (fps: FrameRate) => void;
  className?: string;
}

export function QualityOptions({
  resolution,
  onResolutionChange,
  quality,
  onQualityChange,
  frameRate,
  onFrameRateChange,
  className = ''
}: QualityOptionsProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Resolution Selector */}
      <div className="space-y-2">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <span className="icon-container bg-[var(--pastel-green)] rounded-lg">
            <Maximize className="w-4 h-4" />
          </span>
          Resolution
        </h3>
        
        <div className="flex flex-wrap gap-1.5">
          {resolutions.map((res) => (
            <button
              key={res.value}
              onClick={() => onResolutionChange(res.value)}
              className={`
                px-3 py-1.5 font-medium border-2 border-black transition-all duration-100
                ${resolution === res.value 
                  ? 'bg-[var(--pastel-green)] shadow-xs translate-x-0.5 translate-y-0.5' 
                  : 'bg-white hover:bg-secondary shadow-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow'
                }
              `}
            >
              <span className="block text-xs font-bold">{res.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quality Slider */}
      <div className="space-y-2">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <span className="icon-container bg-[var(--pastel-coral)] rounded-lg">
            <Gauge className="w-4 h-4" />
          </span>
          Quality
        </h3>
        
        <div className="space-y-1">
          <input
            type="range"
            min={1}
            max={4}
            step={1}
            value={quality}
            onChange={(e) => onQualityChange(Number(e.target.value))}
            className="brutal-slider rounded"
          />
          <div className="flex justify-between text-xs font-medium">
            {qualityLabels.map((label, index) => (
              <span
                key={label}
                className={quality === index + 1 ? 'font-bold text-black' : 'text-muted-foreground'}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Frame Rate Selector */}
      <div className="space-y-2">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <span className="icon-container bg-[var(--pastel-purple)] rounded-lg">
            <Activity className="w-4 h-4" />
          </span>
          Frame Rate
        </h3>
        
        <div className="toggle-group rounded-lg">
          {frameRates.map((fps, index) => (
            <button
              key={fps.value}
              onClick={() => onFrameRateChange(fps.value)}
              className={`
                toggle-btn
                ${frameRate === fps.value ? 'active' : ''}
                ${index === 0 ? 'rounded-l-lg' : ''}
                ${index === frameRates.length - 1 ? 'rounded-r-lg' : ''}
              `}
            >
              {fps.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export { resolutions, frameRates, qualityLabels };
export type { ResolutionOption, FrameRateOption };
