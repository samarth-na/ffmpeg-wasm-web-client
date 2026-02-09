'use client';

import React from 'react';
import { Youtube, Smartphone, MessageCircle, Settings } from 'lucide-react';

export type PresetType = 'youtube' | 'instagram' | 'whatsapp' | 'custom';

interface Preset {
  id: PresetType;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  settings: {
    format: string;
    resolution: string;
    quality: number;
    frameRate: number | 'original';
  };
}

const presets: Preset[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    description: '1080p, MP4, High quality',
    icon: <Youtube className="w-6 h-6" />,
    color: 'bg-[var(--pastel-pink)]',
    settings: {
      format: 'mp4',
      resolution: '1080p',
      quality: 3,
      frameRate: 30
    }
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Vertical 1080×1920',
    icon: <Smartphone className="w-6 h-6" />,
    color: 'bg-[var(--pastel-purple)]',
    settings: {
      format: 'mp4',
      resolution: '1080p-vertical',
      quality: 3,
      frameRate: 30
    }
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    description: 'Compressed, small size',
    icon: <MessageCircle className="w-6 h-6" />,
    color: 'bg-[var(--pastel-green)]',
    settings: {
      format: 'mp4',
      resolution: '480p',
      quality: 2,
      frameRate: 24
    }
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Configure manually',
    icon: <Settings className="w-6 h-6" />,
    color: 'bg-[var(--pastel-blue)]',
    settings: {
      format: 'original',
      resolution: 'original',
      quality: 3,
      frameRate: 'original'
    }
  }
];

interface PresetSelectorProps {
  selected: PresetType | null;
  onSelect: (preset: PresetType, settings: Preset['settings']) => void;
  className?: string;
}

export function PresetSelector({ selected, onSelect, className = '' }: PresetSelectorProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="font-bold text-lg flex items-center gap-2">
        <span className="icon-container bg-[var(--pastel-yellow)] rounded-lg">
          <Settings className="w-5 h-5" />
        </span>
        Quick Presets
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelect(preset.id, preset.settings)}
            className={`
              brutal-card rounded-lg p-4 text-left transition-all duration-150
              ${selected === preset.id ? 'ring-2 ring-black ring-offset-2' : ''}
              ${preset.color}
            `}
          >
            <div className="flex flex-col items-center text-center gap-2">
              <div className="icon-container bg-white rounded-lg">
                {preset.icon}
              </div>
              <div>
                <p className="font-bold">{preset.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {preset.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export { presets };
export type { Preset };
