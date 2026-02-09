'use client';

import React from 'react';
import { FileType } from 'lucide-react';

export type VideoFormat = 'mp4' | 'webm' | 'mkv' | 'avi' | 'mov' | 'original';

interface FormatOption {
  value: VideoFormat;
  label: string;
  extension: string;
}

const formats: FormatOption[] = [
  { value: 'original', label: 'Keep Original', extension: '' },
  { value: 'mp4', label: 'MP4', extension: '.mp4' },
  { value: 'webm', label: 'WebM', extension: '.webm' },
  { value: 'mkv', label: 'MKV', extension: '.mkv' },
  { value: 'avi', label: 'AVI', extension: '.avi' },
  { value: 'mov', label: 'MOV', extension: '.mov' }
];

interface FormatSelectorProps {
  value: VideoFormat;
  onChange: (format: VideoFormat) => void;
  className?: string;
}

export function FormatSelector({ value, onChange, className = '' }: FormatSelectorProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="font-bold text-lg flex items-center gap-2">
        <span className="icon-container bg-[var(--pastel-blue)] rounded-lg">
          <FileType className="w-5 h-5" />
        </span>
        Output Format
      </h3>
      
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as VideoFormat)}
          className="brutal-select rounded-lg"
        >
          {formats.map((format) => (
            <option key={format.value} value={format.value}>
              {format.label}
            </option>
          ))}
        </select>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Select the output format for your processed video
      </p>
    </div>
  );
}

export { formats };
export type { FormatOption };
