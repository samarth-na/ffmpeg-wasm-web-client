'use client';

import { useState } from 'react';
import { Upload, FileVideo, Download, RotateCcw, Loader2, Zap, AlertCircle } from 'lucide-react';
import { useFFmpeg } from '@/hooks/use-ffmpeg';

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default function Home() {
  const {
    status,
    progress,
    log,
    error,
    gifUrl,
    gifSize,
    load,
    convertToGif,
    reset,
  } = useFFmpeg();

  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const MAX_SIZE_MB = 10;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

  const handleFile = (f: File) => {
    if (f.size > MAX_SIZE_BYTES) {
      alert(`File too large. Maximum size is ${MAX_SIZE_MB}MB.`);
      return;
    }
    if (!f.type.startsWith('video/')) {
      alert('Please upload a video file.');
      return;
    }
    setFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    if (!status.match(/ready|done|error/)) {
      // Need to load first
      await load();
    }
    await convertToGif(file);
  };

  const handleReset = () => {
    setFile(null);
    reset();
  };

  const isLoading = status === 'loading';
  const isConverting = status === 'converting';
  const isDone = status === 'done';
  const isWorking = isLoading || isConverting;

  return (
    <div className="min-h-screen bg-[var(--background)] py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-black tracking-tight">
            Video to GIF
          </h1>
          <p className="text-lg text-[var(--muted-foreground)]">
            Convert any video to GIF right in your browser. No uploads, no server.
          </p>
        </div>

        {/* Step 1: Load FFmpeg */}
        {status === 'idle' && (
          <div className="brutal-card rounded-lg p-6 text-center space-y-4 animate-fade-in">
            <div className="icon-container bg-[var(--pastel-yellow)] rounded-lg mx-auto">
              <Zap className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">Load FFmpeg Engine</h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              Downloads the FFmpeg WASM core (~31MB). This only happens once.
            </p>
            <button
              onClick={load}
              className="brutal-btn brutal-btn-primary rounded-lg mx-auto"
            >
              <Zap className="w-4 h-4" />
              Load FFmpeg
            </button>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="brutal-card rounded-lg p-6 text-center space-y-4 animate-fade-in">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--primary)]" />
            <h2 className="text-xl font-bold">Loading FFmpeg...</h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              Downloading WASM core (~31MB). Please wait.
            </p>
          </div>
        )}

        {/* Step 2: Upload Video (shown when ready, done, or error with ffmpeg loaded) */}
        {(status === 'ready' || isDone || (status === 'error' && !isWorking)) && (
          <>
            {/* Upload zone */}
            {!file && !isDone && (
              <label
                className={`upload-zone block rounded-lg cursor-pointer animate-fade-in ${isDragging ? 'dragging' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  className="hidden"
                  accept="video/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFile(e.target.files[0]);
                  }}
                />
                <div className="flex flex-col items-center gap-4">
                  <div className="icon-container bg-white rounded-lg">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-bold">Drop video here or click to browse</p>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      MP4, WebM, AVI, MOV, MKV
                    </p>
                  </div>
                  <span className="brutal-badge brutal-badge-yellow rounded-lg">
                    Max {MAX_SIZE_MB}MB
                  </span>
                </div>
              </label>
            )}

            {/* File selected - show info + convert button */}
            {file && !isDone && (
              <div className="space-y-4 animate-fade-in">
                <div className="brutal-card rounded-lg p-5">
                  <div className="flex items-center gap-4">
                    <div className="icon-container bg-[var(--pastel-blue)] rounded-lg flex-shrink-0">
                      <FileVideo className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{file.name}</p>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                    <button
                      onClick={() => setFile(null)}
                      className="brutal-btn brutal-btn-ghost rounded-lg p-2"
                      title="Remove file"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleConvert}
                  disabled={isConverting}
                  className="brutal-btn brutal-btn-primary rounded-lg w-full py-4 text-lg"
                >
                  <Zap className="w-5 h-5" />
                  <span className="font-black uppercase tracking-wide">Convert to GIF</span>
                </button>
              </div>
            )}
          </>
        )}

        {/* Converting state */}
        {isConverting && (
          <div className="brutal-card rounded-lg p-6 space-y-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-[var(--primary)]" />
              <h2 className="text-xl font-bold">Converting...</h2>
            </div>

            {/* Progress bar */}
            <div className="progress-container rounded-lg">
              <div
                className="progress-fill"
                style={{ width: `${Math.max(progress, 2)}%` }}
              />
            </div>
            <p className="text-sm text-[var(--muted-foreground)] font-mono truncate">
              {log || 'Starting conversion...'}
            </p>
          </div>
        )}

        {/* Result */}
        {isDone && gifUrl && (
          <div className="space-y-6 animate-fade-in">
            {/* GIF preview */}
            <div className="brutal-card rounded-lg p-4 space-y-4">
              <h2 className="text-xl font-bold text-center">Your GIF is ready!</h2>
              <div className="flex justify-center">
                <img
                  src={gifUrl}
                  alt="Converted GIF"
                  className="rounded-lg border-2 border-[var(--black)] max-w-full"
                  style={{ maxHeight: 400 }}
                />
              </div>

              {/* Size comparison */}
              {file && (
                <div className="grid grid-cols-3 gap-3 items-center">
                  <div className="text-center p-3 bg-[var(--secondary)] rounded-lg">
                    <p className="text-xs text-[var(--muted-foreground)] uppercase font-bold mb-1">
                      Original
                    </p>
                    <p className="text-base font-bold">{formatFileSize(file.size)}</p>
                  </div>
                  <div className="flex justify-center text-[var(--muted-foreground)]">
                    &rarr;
                  </div>
                  <div className="text-center p-3 bg-[var(--pastel-green)] border-2 border-[var(--black)] rounded-lg">
                    <p className="text-xs text-[var(--muted-foreground)] uppercase font-bold mb-1">
                      GIF
                    </p>
                    <p className="text-base font-bold">{formatFileSize(gifSize)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Download button */}
            <a
              href={gifUrl}
              download={file ? file.name.replace(/\.[^.]+$/, '.gif') : 'output.gif'}
              className="brutal-btn w-full py-5 text-lg bg-[var(--pastel-green)] rounded-lg"
            >
              <Download className="w-6 h-6" />
              <span className="font-black uppercase tracking-wide">Download GIF</span>
            </a>

            {/* Convert another */}
            <button
              onClick={handleReset}
              className="brutal-btn brutal-btn-outline w-full py-3 rounded-lg"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="font-semibold">Convert Another Video</span>
            </button>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="brutal-card rounded-lg p-5 bg-[var(--pastel-coral)] animate-fade-in">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-bold">Something went wrong</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="brutal-btn brutal-btn-outline rounded-lg mt-4"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
