'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';

export type FFmpegStatus = 'idle' | 'loading' | 'ready' | 'converting' | 'done' | 'error';

interface UseFFmpegReturn {
  status: FFmpegStatus;
  progress: number;
  log: string;
  error: string | null;
  gifUrl: string | null;
  gifSize: number;
  load: () => Promise<void>;
  convertToGif: (file: File) => Promise<void>;
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

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (gifUrl) {
        URL.revokeObjectURL(gifUrl);
      }
    };
  }, [gifUrl]);

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

      const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd';

      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });

      ffmpegRef.current = ffmpeg;
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

  const reset = useCallback(() => {
    if (gifUrl) {
      URL.revokeObjectURL(gifUrl);
    }
    setGifUrl(null);
    setGifSize(0);
    setProgress(0);
    setLog('');
    setError(null);
    setStatus(ffmpegRef.current ? 'ready' : 'idle');
  }, [gifUrl]);

  return {
    status,
    progress,
    log,
    error,
    gifUrl,
    gifSize,
    load,
    convertToGif,
    reset,
  };
}
