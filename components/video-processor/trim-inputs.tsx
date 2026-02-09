'use client';

import React, { useState, useEffect } from 'react';
import { Scissors, Clock, ArrowRight } from 'lucide-react';

interface TrimInputsProps {
  startTime: string;
  endTime: string;
  maxDuration: number; // in seconds
  onStartChange: (time: string) => void;
  onEndChange: (time: string) => void;
  className?: string;
}

export function TrimInputs({
  startTime,
  endTime,
  maxDuration,
  onStartChange,
  onEndChange,
  className = ''
}: TrimInputsProps) {
  const [error, setError] = useState<string | null>(null);

  // Convert seconds to HH:MM:SS format
  const secondsToTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Convert HH:MM:SS to seconds
  const timeToSeconds = (time: string): number => {
    const parts = time.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
  };

  // Validate times
  useEffect(() => {
    const start = timeToSeconds(startTime);
    const end = timeToSeconds(endTime);

    if (start >= end) {
      setError('End time must be after start time');
    } else if (end > maxDuration) {
      setError(`End time cannot exceed video duration (${secondsToTime(maxDuration)})`);
    } else {
      setError(null);
    }
  }, [startTime, endTime, maxDuration]);

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9:]/g, '');
    
    // Auto-format as user types
    if (value.length === 2 && !value.includes(':')) {
      value += ':';
    } else if (value.length === 5 && value.split(':').length === 2) {
      value += ':';
    }
    
    onStartChange(value);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9:]/g, '');
    
    // Auto-format as user types
    if (value.length === 2 && !value.includes(':')) {
      value += ':';
    } else if (value.length === 5 && value.split(':').length === 2) {
      value += ':';
    }
    
    onEndChange(value);
  };

  const calculatedDuration = timeToSeconds(endTime) - timeToSeconds(startTime);

  const setQuickTrim = (seconds: number) => {
    const end = Math.min(seconds, maxDuration);
    onStartChange('00:00:00');
    onEndChange(secondsToTime(end));
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="font-bold text-sm flex items-center gap-2">
        <span className="icon-container bg-[var(--pastel-pink)] rounded-lg">
          <Scissors className="w-4 h-4" />
        </span>
        Trim Video
      </h3>

      {/* Quick trim buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setQuickTrim(30)}
          className="brutal-btn-ghost text-sm py-1.5 px-3 rounded"
        >
          First 30s
        </button>
        <button
          onClick={() => setQuickTrim(60)}
          className="brutal-btn-ghost text-sm py-1.5 px-3 rounded"
        >
          First 1min
        </button>
        <button
          onClick={() => {
            onStartChange(secondsToTime(Math.max(0, maxDuration - 30)));
            onEndChange(secondsToTime(maxDuration));
          }}
          className="brutal-btn-ghost text-sm py-1.5 px-3 rounded"
        >
          Last 30s
        </button>
        <button
          onClick={() => {
            onStartChange('00:00:00');
            onEndChange(secondsToTime(maxDuration));
          }}
          className="brutal-btn-ghost text-sm py-1.5 px-3 rounded"
        >
          Full video
        </button>
      </div>

      {/* Time inputs */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Start Time
          </label>
          <input
            type="text"
            value={startTime}
            onChange={handleStartChange}
            placeholder="00:00:00"
            maxLength={8}
            className="brutal-input w-32 text-center font-mono text-lg rounded-lg"
          />
        </div>

        <div className="icon-container bg-white rounded-lg self-end mb-1">
          <ArrowRight className="w-5 h-5" />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium flex items-center gap-1">
            <Clock className="w-4 h-4" />
            End Time
          </label>
          <input
            type="text"
            value={endTime}
            onChange={handleEndChange}
            placeholder={secondsToTime(maxDuration)}
            maxLength={8}
            className="brutal-input w-32 text-center font-mono text-lg rounded-lg"
          />
        </div>
      </div>

      {/* Duration info */}
      {calculatedDuration > 0 && !error && (
        <div className="brutal-badge-blue inline-flex">
          <Clock className="w-3 h-3" />
          <span>Duration: {secondsToTime(calculatedDuration)}</span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="p-3 bg-[var(--pastel-coral)] border-2 border-black rounded-lg text-sm font-medium animate-fade-in">
          {error}
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        Enter times in HH:MM:SS format. Leave as 00:00:00 to keep full video.
      </p>
    </div>
  );
}
