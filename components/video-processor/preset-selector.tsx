'use client';

import React from 'react';
import { Youtube, Smartphone, MessageCircle, Settings, FileType, Film, Image, Clapperboard } from 'lucide-react';

export type PresetType =
  | 'youtube'
  | 'yt-shorts'
  | 'instagram-reels'
  | 'instagram-post-v'
  | 'instagram-post-l'
  | 'instagram-story'
  | 'whatsapp'
  | 'custom';

export type VideoFormat = 'mp4' | 'webm' | 'mkv' | 'avi' | 'mov' | 'gif' | 'original';

interface FormatOption {
  value: VideoFormat;
  label: string;
}

const formats: FormatOption[] = [
  { value: 'mp4', label: 'MP4' },
  { value: 'webm', label: 'WebM' },
  { value: 'mkv', label: 'MKV' },
  { value: 'avi', label: 'AVI' },
  { value: 'mov', label: 'MOV' },
  { value: 'gif', label: 'GIF' },
  { value: 'original', label: 'Keep' },
];

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
    aspectRatio?: string;
  };
}

const presets: Preset[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    description: '1080p 16:9',
    icon: <Youtube className="w-4 h-4" />,
    color: 'bg-[var(--pastel-pink)]',
    settings: { format: 'mp4', resolution: '1080p', quality: 3, frameRate: 30, aspectRatio: '16:9' },
  },
  {
    id: 'yt-shorts',
    name: 'YT Shorts',
    description: '1080p 9:16',
    icon: <Film className="w-4 h-4" />,
    color: 'bg-[var(--pastel-pink)]',
    settings: { format: 'mp4', resolution: '1080p-vertical', quality: 3, frameRate: 30, aspectRatio: '9:16' },
  },
  {
    id: 'instagram-reels',
    name: 'Reels',
    description: '1080p 9:16',
    icon: <Clapperboard className="w-4 h-4" />,
    color: 'bg-[var(--pastel-purple)]',
    settings: { format: 'mp4', resolution: '1080p-vertical', quality: 3, frameRate: 30, aspectRatio: '9:16' },
  },
  {
    id: 'instagram-story',
    name: 'Insta Story',
    description: '1080p 9:16',
    icon: <Smartphone className="w-4 h-4" />,
    color: 'bg-[var(--pastel-purple)]',
    settings: { format: 'mp4', resolution: '1080p-vertical', quality: 3, frameRate: 30, aspectRatio: '9:16' },
  },
  {
    id: 'instagram-post-v',
    name: 'Insta Post V',
    description: '1080p 4:5',
    icon: <Image className="w-4 h-4" />,
    color: 'bg-[var(--pastel-purple)]',
    settings: { format: 'mp4', resolution: '1080p', quality: 3, frameRate: 30, aspectRatio: '4:5' },
  },
  {
    id: 'instagram-post-l',
    name: 'Insta Post L',
    description: '1080p 1.91:1',
    icon: <Image className="w-4 h-4" />,
    color: 'bg-[var(--pastel-purple)]',
    settings: { format: 'mp4', resolution: '1080p', quality: 3, frameRate: 30, aspectRatio: '1.91:1' },
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    description: '480p small',
    icon: <MessageCircle className="w-4 h-4" />,
    color: 'bg-[var(--pastel-green)]',
    settings: { format: 'mp4', resolution: '480p', quality: 2, frameRate: 24 },
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Manual',
    icon: <Settings className="w-4 h-4" />,
    color: 'bg-[var(--pastel-blue)]',
    settings: { format: 'original', resolution: 'original', quality: 3, frameRate: 'original' },
  },
];

interface PresetFormatSelectorProps {
  selectedPreset: PresetType | null;
  onPresetSelect: (preset: PresetType, settings: Preset['settings']) => void;
  format: VideoFormat;
  onFormatChange: (format: VideoFormat) => void;
  className?: string;
}

export function PresetFormatSelector({
  selectedPreset,
  onPresetSelect,
  format,
  onFormatChange,
  className = '',
}: PresetFormatSelectorProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Presets */}
      <div className="space-y-1.5">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <span className="icon-container bg-[var(--pastel-yellow)] rounded-lg">
            <Settings className="w-4 h-4" />
          </span>
          Presets
        </h3>
        <div className="flex flex-col gap-1.5 md:grid md:grid-cols-4">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onPresetSelect(preset.id, preset.settings)}
              className={`
                rounded px-2 py-1.5 text-left transition-all duration-100 border-2 border-black
                ${selectedPreset === preset.id
                  ? 'ring-2 ring-black ring-offset-1 shadow-xs translate-x-0.5 translate-y-0.5'
                  : 'shadow-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow'
                }
                ${preset.color}
              `}
            >
              <div className="flex items-center gap-1.5">
                <span className="flex-shrink-0 [&_svg]:w-3 [&_svg]:h-3">{preset.icon}</span>
                <div className="min-w-0 flex items-center gap-2 md:block">
                  <p className="font-bold text-[11px] leading-tight">{preset.name}</p>
                  <p className="text-[9px] text-muted-foreground leading-tight">{preset.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Format */}
      <div className="space-y-1.5">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <span className="icon-container bg-[var(--pastel-blue)] rounded-lg">
            <FileType className="w-4 h-4" />
          </span>
          Output Format
        </h3>
        <div className="flex flex-wrap gap-1">
          {formats.map((fmt) => (
            <button
              key={fmt.value}
              onClick={() => onFormatChange(fmt.value)}
              className={`
                px-2.5 py-1 text-xs font-medium border-2 border-black rounded transition-all duration-100
                ${format === fmt.value
                  ? 'bg-[var(--pastel-blue)] shadow-xs translate-x-0.5 translate-y-0.5 font-bold'
                  : 'bg-white hover:bg-secondary shadow-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow'
                }
              `}
            >
              {fmt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export { presets, formats };
export type { Preset, FormatOption };
