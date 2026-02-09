'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Video, Terminal, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import {
  UploadZone,
  VideoPreview,
  PresetFormatSelector,
  AspectRatioSelector,
  QualityOptions,
  TrimInputs,
  ProcessButton,
  DownloadSection,
} from '@/components/video-processor';
import type {
  PresetType,
  VideoFormat,
  AspectRatio,
  Resolution,
  FrameRate,
  ProcessStatus,
} from '@/components/video-processor';
import { useFFmpeg } from '@/hooks/use-ffmpeg';
import type { ProcessOptions } from '@/lib/ffmpeg-commands';
import { getOutputFilename } from '@/lib/ffmpeg-commands';

export default function Home() {
  // --- File state ---
  const [file, setFile] = useState<File | null>(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const videoMetaRef = useRef<HTMLVideoElement | null>(null);

  // --- Preset state ---
  const [selectedPreset, setSelectedPreset] = useState<PresetType | null>(null);

  // --- Options state ---
  const [format, setFormat] = useState<VideoFormat>('mp4');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('original');
  const [resolution, setResolution] = useState<Resolution>('original');
  const [quality, setQuality] = useState(3);
  const [frameRate, setFrameRate] = useState<FrameRate>('original');
  const [startTime, setStartTime] = useState('00:00:00');
  const [endTime, setEndTime] = useState('00:00:00');

  // --- UI state ---
  const [showLog, setShowLog] = useState(false);

  // --- FFmpeg hook ---
  const {
    status,
    progress,
    log,
    error,
    outputUrl,
    outputSize,
    isMultiThreaded,
    load,
    processVideo,
    reset,
  } = useFFmpeg();

  // --- Extract video duration when file is selected ---
  useEffect(() => {
    if (!file) {
      setVideoDuration(0);
      return;
    }

    const video = document.createElement('video');
    videoMetaRef.current = video;
    video.preload = 'metadata';

    const objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;

    const handleLoaded = () => {
      const dur = Math.floor(video.duration);
      setVideoDuration(dur);
      const hrs = Math.floor(dur / 3600);
      const mins = Math.floor((dur % 3600) / 60);
      const secs = Math.floor(dur % 60);
      setEndTime(
        `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      );
      URL.revokeObjectURL(objectUrl);
    };

    video.addEventListener('loadedmetadata', handleLoaded);
    return () => {
      video.removeEventListener('loadedmetadata', handleLoaded);
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  // --- Handlers ---
  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
  }, []);

  const handleRemoveFile = useCallback(() => {
    setFile(null);
    setSelectedPreset(null);
    setFormat('mp4');
    setAspectRatio('original');
    setResolution('original');
    setQuality(3);
    setFrameRate('original');
    setStartTime('00:00:00');
    setEndTime('00:00:00');
    reset();
  }, [reset]);

  const handlePresetSelect = useCallback(
    (preset: PresetType, settings: { format: string; resolution: string; quality: number; frameRate: number | 'original'; aspectRatio?: string }) => {
      setSelectedPreset(preset);
      setFormat(settings.format as VideoFormat);
      setResolution(settings.resolution as Resolution);
      setQuality(settings.quality);
      setFrameRate(settings.frameRate as FrameRate);
      if (settings.aspectRatio) {
        setAspectRatio(settings.aspectRatio as AspectRatio);
      } else {
        setAspectRatio('original');
      }
    },
    []
  );

  // --- Clear preset when user manually changes any option ---
  const handleFormatChange = useCallback((val: VideoFormat) => {
    setFormat(val);
    setSelectedPreset(null);
  }, []);

  const handleAspectRatioChange = useCallback((val: AspectRatio) => {
    setAspectRatio(val);
    setSelectedPreset(null);
  }, []);

  const handleResolutionChange = useCallback((val: Resolution) => {
    setResolution(val);
    setSelectedPreset(null);
  }, []);

  const handleQualityChange = useCallback((val: number) => {
    setQuality(val);
    setSelectedPreset(null);
  }, []);

  const handleFrameRateChange = useCallback((val: FrameRate) => {
    setFrameRate(val);
    setSelectedPreset(null);
  }, []);

  const handleProcess = useCallback(async () => {
    if (!file) return;

    const options: ProcessOptions = {
      format,
      resolution,
      quality,
      frameRate,
      startTime,
      endTime,
      aspectRatio,
    };

    await processVideo(file, options);
  }, [file, format, resolution, quality, frameRate, startTime, endTime, aspectRatio, processVideo]);

  const handleProcessAnother = useCallback(() => {
    handleRemoveFile();
  }, [handleRemoveFile]);

  // --- Map FFmpeg hook status to ProcessButton status ---
  const mapStatus = (): ProcessStatus => {
    switch (status) {
      case 'idle':
        return 'idle';
      case 'loading':
        return 'loading';
      case 'ready':
        return 'idle';
      case 'converting':
        return 'processing';
      case 'done':
        return 'complete';
      case 'error':
        return 'error';
      default:
        return 'idle';
    }
  };

  // --- Generate output filename for download ---
  const getDownloadFilename = (): string => {
    if (!file) return 'output.mp4';
    const ext = file.name.split('.').pop() || 'mp4';
    const inputName = `input.${ext}`;
    const outputName = getOutputFilename(inputName, format);
    const baseName = file.name.replace(/\.[^.]+$/, '');
    const outExt = outputName.split('.').pop() || 'mp4';
    return `${baseName}_processed.${outExt}`;
  };

  const isDone = status === 'done' && outputUrl;
  const isProcessing = status === 'loading' || status === 'converting';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b-2 border-black bg-[var(--pastel-blue)]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-3">
          <div className="icon-container bg-white rounded-lg">
            <Video className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-black">Video Processor</h1>
          <span className="text-sm text-muted-foreground ml-2">
            All processing happens in your browser
          </span>
          {isMultiThreaded && (
            <span className="ml-auto text-xs font-medium bg-[var(--pastel-green)] border border-black px-2 py-1 rounded">
              Multi-Thread
            </span>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-4">
        {/* Load FFmpeg Engine state */}
        {!file && !isDone && status === 'idle' && (
          <section className="max-w-2xl mx-auto py-8 animate-fade-in">
            <div className="brutal-card bg-white rounded-xl p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-[var(--pastel-yellow)] border-2 border-black rounded-xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Zap className="w-8 h-8 text-black" />
                </div>
              </div>
              <h2 className="text-2xl font-black mb-2">Load FFmpeg Engine</h2>
              <p className="text-muted-foreground mb-6">
                Downloads the FFmpeg WASM core (~31MB). This only happens once.
              </p>
              <button
                onClick={load}
                className="brutal-btn text-lg py-3 px-8 rounded-lg inline-flex items-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Load FFmpeg
              </button>
            </div>
          </section>
        )}

        {/* Loading FFmpeg state */}
        {!file && !isDone && status === 'loading' && (
          <section className="max-w-2xl mx-auto py-8 animate-fade-in">
            <div className="brutal-card bg-white rounded-xl p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-[var(--pastel-yellow)] border-2 border-black rounded-xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse">
                  <Zap className="w-8 h-8 text-black" />
                </div>
              </div>
              <h2 className="text-2xl font-black mb-2">Loading FFmpeg...</h2>
              <p className="text-muted-foreground">
                Downloading ~31MB WASM core. Please wait.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {typeof SharedArrayBuffer !== 'undefined' 
                  ? 'Attempting multi-threaded mode (2-5x faster)...' 
                  : 'Single-threaded mode (slower, but compatible)'}
              </p>
            </div>
          </section>
        )}

        {/* Upload state */}
        {!file && !isDone && status === 'ready' && (
          <section className="max-w-2xl mx-auto py-8 animate-fade-in">
            <UploadZone onFileSelect={handleFileSelect} maxSizeMB={500} />
          </section>
        )}

        {/* Options state - compact grid layout */}
        {file && !isDone && (
          <div className="space-y-3 animate-fade-in">
            {/* Performance warning for single-thread */}
            {!isMultiThreaded && (
              <div className="bg-[var(--pastel-yellow)] border-2 border-black rounded-lg p-3 text-sm">
                <strong>Slower Mode:</strong> Multi-threading not available. Processing will take longer (~12-25x slower than native). 
                <a href="https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/docs/performance.md" target="_blank" rel="noopener noreferrer" className="underline ml-1">Learn more</a>
              </div>
            )}
            {/* Row 1: Video Preview (full width) */}
            <VideoPreview file={file} onRemove={handleRemoveFile} />

            {/* Row 2: Presets+Format (left) + Aspect Ratio (right) */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3">
              <div className="brutal-card rounded-lg p-3">
                <PresetFormatSelector
                  selectedPreset={selectedPreset}
                  onPresetSelect={handlePresetSelect}
                  format={format}
                  onFormatChange={handleFormatChange}
                />
              </div>
              <div className="brutal-card rounded-lg p-3">
                <AspectRatioSelector
                  value={aspectRatio}
                  onChange={handleAspectRatioChange}
                />
              </div>
            </div>

            {/* Row 3: Quality + Trim side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="brutal-card rounded-lg p-3">
                <QualityOptions
                  resolution={resolution}
                  onResolutionChange={handleResolutionChange}
                  quality={quality}
                  onQualityChange={handleQualityChange}
                  frameRate={frameRate}
                  onFrameRateChange={handleFrameRateChange}
                />
              </div>
              <div className="brutal-card rounded-lg p-3">
                <TrimInputs
                  startTime={startTime}
                  endTime={endTime}
                  maxDuration={videoDuration}
                  onStartChange={setStartTime}
                  onEndChange={setEndTime}
                />
              </div>
            </div>

            {/* Row 4: Process button full width */}
            <ProcessButton
              status={mapStatus()}
              progress={progress}
              onProcess={handleProcess}
              disabled={!file || isProcessing}
            />

            {/* Error message */}
            {error && (
              <div className="p-3 bg-[var(--pastel-coral)] border-2 border-black rounded-lg animate-fade-in">
                <p className="font-bold">Error</p>
                <p className="text-sm mt-1">{error}</p>
                <button
                  onClick={() => reset()}
                  className="mt-2 brutal-btn-ghost text-sm py-1 px-3 rounded"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Log output (collapsible) */}
            {log && (
              <div>
                <button
                  onClick={() => setShowLog(!showLog)}
                  className="brutal-btn-ghost w-full py-2 px-4 rounded-lg flex items-center justify-between text-sm font-medium"
                >
                  <span className="flex items-center gap-2">
                    <Terminal className="w-4 h-4" />
                    FFmpeg Log
                  </span>
                  {showLog ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {showLog && (
                  <div className="mt-2 p-3 bg-black text-green-400 rounded-lg border-2 border-black font-mono text-xs max-h-40 overflow-y-auto">
                    {log}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Download state */}
        {isDone && outputUrl && (
          <section className="max-w-2xl mx-auto py-6 space-y-4 animate-fade-in">
            <DownloadSection
              downloadUrl={outputUrl}
              fileName={getDownloadFilename()}
              originalSize={file?.size ?? 0}
              newSize={outputSize}
              onProcessAnother={handleProcessAnother}
            />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-black/10 bg-background">
        <div className="max-w-7xl mx-auto px-6 py-3 text-center text-sm text-muted-foreground">
          Powered by{' '}
          <a
            href="https://github.com/ffmpegwasm/ffmpeg.wasm"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium"
          >
            ffmpeg.wasm
          </a>
          {' '}&mdash; No files are uploaded to any server. Max file size 500MB.
        </div>
      </footer>
    </div>
  );
}
