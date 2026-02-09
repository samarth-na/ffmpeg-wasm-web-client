'use client';

import React, { useCallback, useState } from 'react';
import { Upload, FileVideo, X } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  className?: string;
}

export function UploadZone({
  onFileSelect,
  maxSizeMB = 500,
  acceptedTypes = ['video/mp4', 'video/webm', 'video/avi', 'video/quicktime', 'video/x-matroska'],
  className = ''
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    setError(null);
    
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`File too large. Maximum size is ${maxSizeMB}MB`);
      return false;
    }
    
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a video file.');
      return false;
    }
    
    return true;
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  }, [onFileSelect, maxSizeMB, acceptedTypes]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  }, [onFileSelect, maxSizeMB, acceptedTypes]);

  const clearError = () => setError(null);

  return (
    <div className={`relative ${className}`}>
      <label
        className={`
          upload-zone block rounded-lg cursor-pointer
          ${isDragging ? 'dragging' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="hidden"
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
        />
        
        <div className="flex flex-col items-center gap-4">
          <div className="icon-container bg-white rounded-lg">
            <Upload className="w-5 h-5" />
          </div>
          
          <div className="space-y-2">
            <p className="text-lg font-bold">
              Drop video here or click to browse
            </p>
            <p className="text-sm text-muted-foreground">
              Supported formats: MP4, WebM, AVI, MOV, MKV
            </p>
          </div>
          
          <div className="flex gap-2">
            <FileVideo className="w-4 h-4 text-muted-foreground" />
            <span className="brutal-badge-yellow">
              Max {maxSizeMB}MB
            </span>
          </div>
        </div>
      </label>

      {error && (
        <div className="mt-4 p-4 bg-[var(--pastel-coral)] border-2 border-black rounded-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <X className="w-5 h-5" />
            <p className="font-semibold">{error}</p>
          </div>
          <button
            onClick={clearError}
            className="mt-2 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
