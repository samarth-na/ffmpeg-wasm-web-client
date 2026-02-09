'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Video, Clock, Monitor, X, FileVideo } from 'lucide-react';

interface VideoPreviewProps {
  file: File;
  onRemove: () => void;
  className?: string;
}

export function VideoPreview({ file, onRemove, className = '' }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [metadata, setMetadata] = useState<{
    duration: number;
    width: number;
    height: number;
  } | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;

    const handleLoadedMetadata = () => {
      setMetadata({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight
      });
      
      // Generate thumbnail at 1 second
      video.currentTime = 1;
    };

    const handleSeeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setThumbnail(canvas.toDataURL('image/jpeg'));
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('seeked', handleSeeked);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('seeked', handleSeeked);
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`brutal-card rounded-lg p-4 animate-fade-in ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-4">
        {/* Video Thumbnail */}
        <div className="relative aspect-video bg-black rounded overflow-hidden border-2 border-black">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt="Video thumbnail"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[var(--pastel-blue)]">
              <FileVideo className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
          <video ref={videoRef} className="hidden" />
          
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
            <div className="icon-container bg-white rounded-full">
              <Video className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* File Info */}
        <div className="flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-lg truncate" title={file.name}>
                {file.name}
              </h3>
              <button
                onClick={onRemove}
                className="brutal-btn-ghost p-2 rounded-lg"
                aria-label="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="brutal-badge-yellow flex items-center gap-1">
                <span>{formatFileSize(file.size)}</span>
              </div>
              
              {metadata && (
                <>
                  <div className="brutal-badge-blue flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDuration(metadata.duration)}</span>
                  </div>
                  
                  <div className="brutal-badge-green flex items-center gap-1">
                    <Monitor className="w-3 h-3" />
                    <span>{metadata.width}×{metadata.height}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t-2 border-black/10">
            <p className="text-sm text-muted-foreground">
              Ready to process. Select your options below.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
