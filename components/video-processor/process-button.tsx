'use client';

import React from 'react';
import { Zap, Loader2, Check, X } from 'lucide-react';

type ProcessStatus = 'idle' | 'loading' | 'processing' | 'complete' | 'error';

interface ProcessButtonProps {
  status: ProcessStatus;
  progress: number; // 0-100
  onProcess: () => void;
  onCancel?: () => void;
  disabled?: boolean;
  className?: string;
}

export function ProcessButton({
  status,
  progress,
  onProcess,
  onCancel,
  disabled = false,
  className = ''
}: ProcessButtonProps) {
  const getStatusText = () => {
    switch (status) {
      case 'loading':
        return 'Loading FFmpeg...';
      case 'processing':
        return `Processing... ${progress}%`;
      case 'complete':
        return 'Complete!';
      case 'error':
        return 'Error occurred';
      default:
        return 'Process Video';
    }
  };

  const getButtonIcon = () => {
    switch (status) {
      case 'loading':
      case 'processing':
        return <Loader2 className="w-6 h-6 animate-spin" />;
      case 'complete':
        return <Check className="w-6 h-6" />;
      case 'error':
        return <X className="w-6 h-6" />;
      default:
        return <Zap className="w-6 h-6" />;
    }
  };

  const getButtonClass = () => {
    switch (status) {
      case 'loading':
      case 'processing':
        return 'bg-[var(--pastel-blue)] cursor-wait';
      case 'complete':
        return 'bg-[var(--pastel-green)]';
      case 'error':
        return 'bg-[var(--pastel-coral)]';
      default:
        return 'bg-[var(--pastel-orange)] hover:shadow-md';
    }
  };

  const isProcessing = status === 'loading' || status === 'processing';
  const isComplete = status === 'complete';

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main button */}
      <button
        onClick={onProcess}
        disabled={disabled || isProcessing || isComplete}
        className={`
          brutal-btn w-full py-6 text-xl rounded-lg
          ${getButtonClass()}
          ${isProcessing ? 'animate-pulse-subtle' : ''}
        `}
      >
        <span className="icon-container bg-white/80 rounded-lg">
          {getButtonIcon()}
        </span>
        <span className="font-black tracking-wide uppercase">
          {getStatusText()}
        </span>
      </button>

      {/* Progress bar */}
      {(isProcessing || isComplete) && (
        <div className="space-y-2 animate-fade-in">
          <div className="progress-container rounded-lg">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Cancel button during processing */}
          {isProcessing && onCancel && (
            <button
              onClick={onCancel}
              className="brutal-btn-outline w-full py-2 rounded-lg text-sm"
            >
              <X className="w-4 h-4" />
              Cancel Processing
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export type { ProcessStatus };
