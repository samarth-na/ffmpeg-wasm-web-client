'use client';

import React from 'react';
import { Download, RotateCcw, FileVideo, ArrowRight, Check } from 'lucide-react';

interface DownloadSectionProps {
  downloadUrl: string;
  fileName: string;
  originalSize: number;
  newSize: number;
  onProcessAnother: () => void;
  className?: string;
}

export function DownloadSection({
  downloadUrl,
  fileName,
  originalSize,
  newSize,
  onProcessAnother,
  className = ''
}: DownloadSectionProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const sizeReduction = ((originalSize - newSize) / originalSize) * 100;
  const hasReduction = sizeReduction > 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Success message */}
      <div className="section-card-green rounded-lg text-center animate-fade-in">
        <div className="icon-container bg-white mx-auto rounded-full mb-3">
          <Check className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-xl font-bold">Processing Complete!</h3>
        <p className="text-muted-foreground mt-1">
          Your video is ready for download
        </p>
      </div>

      {/* File comparison */}
      <div className="section-card rounded-lg">
        <h4 className="font-bold mb-4 flex items-center gap-2">
          <span className="icon-container bg-[var(--pastel-yellow)] rounded-lg">
            <FileVideo className="w-5 h-5" />
          </span>
          File Comparison
        </h4>
        
        <div className="grid grid-cols-3 gap-4 items-center">
          {/* Original */}
          <div className="text-center p-4 bg-secondary rounded-lg">
            <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Original</p>
            <p className="text-lg font-bold">{formatFileSize(originalSize)}</p>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="icon-container bg-white rounded-lg">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>

          {/* New */}
          <div className="text-center p-4 bg-[var(--pastel-green)] rounded-lg border-2 border-black">
            <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Processed</p>
            <p className="text-lg font-bold">{formatFileSize(newSize)}</p>
          </div>
        </div>

        {/* Size reduction badge */}
        {hasReduction && (
          <div className="mt-4 text-center">
            <span className="brutal-badge-green inline-flex items-center gap-1">
              <Check className="w-3 h-3" />
              {sizeReduction.toFixed(1)}% smaller
            </span>
          </div>
        )}
      </div>

      {/* Download button */}
      <a
        href={downloadUrl}
        download={fileName}
        className="brutal-btn w-full py-6 text-xl bg-[var(--pastel-green)] rounded-lg"
      >
        <span className="icon-container bg-white rounded-lg">
          <Download className="w-6 h-6" />
        </span>
        <span className="font-black tracking-wide uppercase">
          Download Video
        </span>
      </a>

      {/* Process another button */}
      <button
        onClick={onProcessAnother}
        className="brutal-btn-outline w-full py-3 rounded-lg"
      >
        <span className="icon-container bg-white rounded-lg">
          <RotateCcw className="w-5 h-5" />
        </span>
        <span className="font-semibold">Process Another Video</span>
      </button>
    </div>
  );
}
