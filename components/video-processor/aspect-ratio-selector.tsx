'use client';

import React from 'react';
import { RatioIcon } from 'lucide-react';

export type AspectRatio = 'original' | '16:9' | '9:16' | '4:3' | '1:1' | '4:5' | '1.91:1' | '21:9';

interface AspectRatioOption {
  value: AspectRatio;
  label: string;
  description: string;
  visual: { w: number; h: number }; // relative proportions for the visual box
}

const aspectRatios: AspectRatioOption[] = [
  { value: 'original', label: 'Original', description: 'Keep source', visual: { w: 16, h: 12 } },
  { value: '16:9', label: '16:9', description: 'Widescreen', visual: { w: 16, h: 9 } },
  { value: '9:16', label: '9:16', description: 'Vertical', visual: { w: 9, h: 16 } },
  { value: '4:3', label: '4:3', description: 'Standard', visual: { w: 4, h: 3 } },
  { value: '1:1', label: '1:1', description: 'Square', visual: { w: 1, h: 1 } },
  { value: '4:5', label: '4:5', description: 'Portrait', visual: { w: 4, h: 5 } },
  { value: '1.91:1', label: '1.91:1', description: 'Landscape', visual: { w: 19, h: 10 } },
  { value: '21:9', label: '21:9', description: 'Ultrawide', visual: { w: 21, h: 9 } },
];

interface AspectRatioSelectorProps {
  value: AspectRatio;
  onChange: (ratio: AspectRatio) => void;
  className?: string;
}

export function AspectRatioSelector({ value, onChange, className = '' }: AspectRatioSelectorProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="font-bold text-sm flex items-center gap-2">
        <span className="icon-container bg-[var(--pastel-yellow)] rounded-lg">
          <RatioIcon className="w-4 h-4" />
        </span>
        Aspect Ratio
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
        {aspectRatios.map((ar) => {
          const maxDim = 20;
          const scale = maxDim / Math.max(ar.visual.w, ar.visual.h);
          const w = Math.round(ar.visual.w * scale);
          const h = Math.round(ar.visual.h * scale);
          return (
            <button
              key={ar.value}
              onClick={() => onChange(ar.value)}
              className={`
                flex flex-col items-center gap-1 px-2 py-1.5 border-2 border-black rounded transition-all duration-100
                ${value === ar.value
                  ? 'bg-[var(--pastel-yellow)] shadow-xs translate-x-0.5 translate-y-0.5 font-bold'
                  : 'bg-white hover:bg-secondary shadow-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow'
                }
              `}
            >
              <div
                className="border-2 border-black/40 rounded-sm bg-black/5"
                style={{ width: `${w}px`, height: `${h}px` }}
              />
              <span className="text-[10px] font-bold leading-tight">{ar.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { aspectRatios };
export type { AspectRatioOption };
