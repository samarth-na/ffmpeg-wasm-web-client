'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';
import {
  buildFFmpegCommand,
  getOutputFilename,
  getMimeType,
  type ProcessOptions,
} from '@/lib/ffmpeg-commands';

export type FFmpegStatus = 'idle' | 'loading' | 'ready' | 'converting' | 'done' | 'error';

// Check if SharedArrayBuffer is available (requires COOP/COEP headers)
const isSharedArrayBufferAvailable = typeof SharedArrayBuffer !== 'undefined';

interface UseFFmpegReturn {
  status: FFmpegStatus;
  progress: number;
  log: string;
  error: string | null;
  // GIF-specific (legacy)
  gifUrl: string | null;
  gifSize: number;
  // Generic output
  outputUrl: string | null;
  outputSize: number;
  isMultiThreaded: boolean;
  load: () => Promise<void>;
  convertToGif: (file: File) => Promise<void>;
  processVideo: (file: File, options: ProcessOptions) => Promise<void>;
  reset: () => void;
}

export function useFFmpeg(): UseFFmpegReturn {
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const [status, setStatus] = useState<FFmpegStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [gifSize, setGifSize] = useState(0);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState(0);
  const [isMultiThreaded, setIsMultiThreaded] = useState(false);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (gifUrl) URL.revokeObjectURL(gifUrl);
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [gifUrl, outputUrl]);

  const load = useCallback(async () => {
    if (ffmpegRef.current) return;

    try {
      setStatus('loading');
      setProgress(0);
      setError(null);

      const ffmpeg = new FFmpeg();

      ffmpeg.on('log', ({ message }) => {
        setLog(message);
      });

      ffmpeg.on('progress', ({ progress: p }) => {
        setProgress(Math.round(Math.min(p, 1) * 100));
      });

      // Try multi-threaded version first if SharedArrayBuffer is available
      if (isSharedArrayBufferAvailable) {
        try {
          const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core-mt@0.12.10/dist/umd';
          
          await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
          });

          ffmpegRef.current = ffmpeg;
          setIsMultiThreaded(true);
          setStatus('ready');
          return;
        } catch (mtError) {
          console.warn('Multi-threaded FFmpeg failed, falling back to single-thread:', mtError);
          // Fall through to single-threaded
        }
      }

      // Single-threaded fallback
      const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd';

      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });

      ffmpegRef.current = ffmpeg;
      setIsMultiThreaded(false);
      setStatus('ready');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load FFmpeg');
      setStatus('error');
    }
  }, []);

  const convertToGif = useCallback(async (file: File) => {
    const ffmpeg = ffmpegRef.current;
    if (!ffmpeg) {
      setError('FFmpeg not loaded');
      setStatus('error');
      return;
    }

    try {
      setStatus('converting');
      setProgress(0);
      setError(null);

      // Revoke previous GIF URL if any
      if (gifUrl) {
        URL.revokeObjectURL(gifUrl);
        setGifUrl(null);
        setGifSize(0);
      }

      const ext = file.name.split('.').pop() || 'mp4';
      const inputName = `input.${ext}`;

      // Write input file to ffmpeg virtual filesystem
      await ffmpeg.writeFile(inputName, await fetchFile(file));

      // Two-pass palette-based GIF conversion for better quality
      // Pass 1: Generate optimal palette (preserve original resolution)
      await ffmpeg.exec([
        '-i', inputName,
        '-vf', 'fps=10,palettegen',
        '-y', 'palette.png',
      ]);

      // Pass 2: Use palette to create high-quality GIF (preserve original resolution)
      await ffmpeg.exec([
        '-i', inputName,
        '-i', 'palette.png',
        '-lavfi', 'fps=10 [x]; [x][1:v] paletteuse',
        '-y', 'output.gif',
      ]);

      // Read the output
      const data = await ffmpeg.readFile('output.gif');
      const uint8 = new Uint8Array(data as Uint8Array);
      const blob = new Blob([uint8], { type: 'image/gif' });

      setGifUrl(URL.createObjectURL(blob));
      setGifSize(blob.size);
      setStatus('done');

      // Cleanup virtual filesystem
      try {
        await ffmpeg.deleteFile(inputName);
        await ffmpeg.deleteFile('palette.png');
        await ffmpeg.deleteFile('output.gif');
      } catch {
        // Ignore cleanup errors
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
      setStatus('error');
    }
  }, [gifUrl]);

  const processVideo = useCallback(async (file: File, options: ProcessOptions) => {
    const ffmpeg = ffmpegRef.current;
    if (!ffmpeg) {
      setError('FFmpeg not loaded. Please load FFmpeg first.');
      setStatus('error');
      return;
    }

    try {
      setStatus('converting');
      setProgress(0);
      setError(null);

      // Revoke previous output URL if any
      if (outputUrl) {
        URL.revokeObjectURL(outputUrl);
        setOutputUrl(null);
        setOutputSize(0);
      }

      const ext = file.name.split('.').pop() || 'mp4';
      const inputName = `input.${ext}`;
      const outputName = getOutputFilename(inputName, options.format);

      // Write input file to ffmpeg virtual filesystem
      await ffmpeg.writeFile(inputName, await fetchFile(file));

      // Build and execute ffmpeg command
      const args = buildFFmpegCommand(inputName, options, isMultiThreaded);
      await ffmpeg.exec(args);

      // Read the output
      const data = await ffmpeg.readFile(outputName);
      const uint8 = new Uint8Array(data as Uint8Array);
      const outputExt = outputName.split('.').pop() || 'mp4';
      const mimeType = getMimeType(outputExt);
      const blob = new Blob([uint8], { type: mimeType });

      setOutputUrl(URL.createObjectURL(blob));
      setOutputSize(blob.size);
      setStatus('done');

      // Cleanup virtual filesystem
      try {
        await ffmpeg.deleteFile(inputName);
        await ffmpeg.deleteFile(outputName);
      } catch {
        // Ignore cleanup errors
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Processing failed');
      setStatus('error');
    }
  }, [outputUrl, isMultiThreaded]);

  const reset = useCallback(() => {
    if (gifUrl) URL.revokeObjectURL(gifUrl);
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setGifUrl(null);
    setGifSize(0);
    setOutputUrl(null);
    setOutputSize(0);
    setProgress(0);
    setLog('');
    setError(null);
    setStatus(ffmpegRef.current ? 'ready' : 'idle');
  }, [gifUrl, outputUrl]);

  return {
    status,
    progress,
    log,
    error,
    gifUrl,
    gifSize,
    outputUrl,
    outputSize,
    isMultiThreaded,
    load,
    convertToGif,
    processVideo,
    reset,
  };
}
