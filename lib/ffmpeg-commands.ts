import type { VideoFormat } from '@/components/video-processor';
import type { Resolution, FrameRate } from '@/components/video-processor';
import type { AspectRatio } from '@/components/video-processor';

export interface ProcessOptions {
  format: VideoFormat;
  resolution: Resolution;
  quality: number; // 1-4
  frameRate: FrameRate;
  startTime: string; // HH:MM:SS
  endTime: string; // HH:MM:SS
  aspectRatio?: AspectRatio;
}

/**
 * Maps resolution presets to FFmpeg scale filter values.
 * Uses -2 for the height/width to maintain aspect ratio with even dimensions.
 */
const RESOLUTION_MAP: Record<string, string> = {
  '4k': '3840:-2',
  '1080p': '1920:-2',
  '720p': '1280:-2',
  '480p': '854:-2',
  '1080p-vertical': '1080:1920',
};

/**
 * Maps quality slider values (1-4) to CRF values.
 * Lower CRF = higher quality, larger file.
 */
const CRF_MAP: Record<number, number> = {
  1: 28, // Low
  2: 23, // Medium
  3: 18, // High
  4: 15, // Best
};

/**
 * Maps quality slider values to CRF-equivalent values for VP9 (webm).
 * VP9 CRF range is different; these approximate similar visual quality.
 */
const CRF_MAP_VP9: Record<number, number> = {
  1: 40,
  2: 33,
  3: 26,
  4: 20,
};

/**
 * Returns the appropriate video codec args for a given format.
 */
function getCodecArgs(format: VideoFormat, quality: number, isMultiThreaded: boolean): string[] {
  if (format === 'gif') {
    // GIF has no video codec flags — handled via filters
    return [];
  }

  const isWebm = format === 'webm';
  const threads = isMultiThreaded ? '0' : '1'; // 0 = auto-detect thread count

  if (isWebm) {
    // VP9: Use faster settings
    return [
      '-c:v', 'libvpx-vp9',
      '-crf', String(CRF_MAP_VP9[quality] ?? 33),
      '-b:v', '0',
      '-threads', threads,
      '-cpu-used', '5', // 0-5, higher = faster (slightly lower quality)
      '-row-mt', '1', // Enable row-based multi-threading
    ];
  }

  // For mp4, mkv, avi, mov — use libx264 + AAC audio with optimized settings
  // Use 'fast' preset for 20-30% speed improvement over 'medium'
  // Reference frames: 1 for speed (default is 3)
  const args: string[] = [
    '-c:v', 'libx264',
    '-crf', String(CRF_MAP[quality] ?? 23),
    '-preset', 'fast', // Changed from 'medium' to 'fast'
    '-threads', threads,
    '-refs', '1', // Reduce reference frames for speed
    '-x264opts', 'rc-lookahead=20', // Optimize rate control
  ];

  // Add faststart for MP4 to enable streaming playback
  if (format === 'mp4') {
    args.push('-movflags', '+faststart');
  }

  return args;
}

/**
 * Returns the audio codec args for a given format.
 */
function getAudioArgs(format: VideoFormat): string[] {
  if (format === 'gif') {
    // GIF has no audio
    return ['-an'];
  }
  if (format === 'webm') {
    return ['-c:a', 'libopus'];
  }
  return ['-c:a', 'aac', '-b:a', '128k'];
}

/**
 * Maps aspect ratio values to the numeric ratio (width / height).
 * Used to build crop filters that force a specific aspect ratio.
 */
const ASPECT_RATIO_MAP: Record<string, number> = {
  '16:9': 16 / 9,
  '9:16': 9 / 16,
  '4:3': 4 / 3,
  '1:1': 1,
  '4:5': 4 / 5,
  '1.91:1': 1.91,
  '21:9': 21 / 9,
};

/**
 * Builds a crop filter string that center-crops to a target aspect ratio.
 * Uses FFmpeg expressions: if the source is wider than target, crop width; otherwise crop height.
 *
 * Example output for 16:9:
 *   "crop=min(iw\\,ih*16/9):min(ih\\,iw*9/16)"
 */
function getAspectRatioCropFilter(ratio: number): string {
  // Target W/H ratio
  // Crop to the largest centered rectangle that fits the target aspect ratio:
  //   if source is too wide:  crop width  = ih * ratio,  keep height
  //   if source is too tall:  keep width,  crop height = iw / ratio
  return `crop=min(iw\\,ih*${ratio.toFixed(4)}):min(ih\\,iw/${ratio.toFixed(4)})`;
}

/**
 * Checks if a time string is a valid non-zero HH:MM:SS value.
 */
function isValidTime(time: string): boolean {
  if (!time || time === '00:00:00') return false;
  return /^\d{2}:\d{2}:\d{2}$/.test(time);
}

/**
 * Converts HH:MM:SS to seconds.
 */
export function timeToSeconds(time: string): number {
  const parts = time.split(':').map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
}

/**
 * Determines the output file extension based on the format and input filename.
 */
export function getOutputFilename(inputName: string, format: VideoFormat): string {
  const baseName = inputName.replace(/\.[^.]+$/, '');

  if (format === 'original') {
    const ext = inputName.split('.').pop() || 'mp4';
    return `output.${ext}`;
  }

  return `output.${format}`;
}

/**
 * Builds the FFmpeg command arguments from the given process options.
 *
 * Example output for mp4, 720p, quality 3, 30fps, trim 00:00:10 to 00:01:30:
 *   ['-ss', '00:00:10', '-to', '00:01:30', '-i', 'input.mp4',
 *    '-vf', 'scale=1280:-2', '-r', '30',
 *    '-c:v', 'libx264', '-crf', '18', '-preset', 'fast',
 *    '-c:a', 'aac', '-b:a', '128k',
 *    '-y', 'output.mp4']
 */
export function buildFFmpegCommand(
  inputName: string,
  options: ProcessOptions,
  isMultiThreaded: boolean = false
): string[] {
  const { format, resolution, quality, frameRate, startTime, endTime, aspectRatio } = options;
  const args: string[] = [];

  // --- Trim (input-seeking for speed) ---
  const hasStart = isValidTime(startTime);
  const hasEnd = isValidTime(endTime);

  if (hasStart) {
    args.push('-ss', startTime);
  }
  if (hasEnd) {
    args.push('-to', endTime);
  }

  // --- Input ---
  args.push('-i', inputName);

  // --- Determine effective format ---
  const effectiveFormat: VideoFormat =
    format === 'original'
      ? (inputName.split('.').pop() as VideoFormat) || 'mp4'
      : format;

  // --- Video filters ---
  const filters: string[] = [];

  // Aspect ratio crop (applied first, before scaling)
  if (aspectRatio && aspectRatio !== 'original') {
    const ratio = ASPECT_RATIO_MAP[aspectRatio];
    if (ratio) {
      filters.push(getAspectRatioCropFilter(ratio));
    }
  }

  // GIF needs fps filter for reasonable file size
  if (effectiveFormat === 'gif') {
    filters.push('fps=10');
  }

  if (resolution !== 'original' && resolution !== 'custom') {
    const scale = RESOLUTION_MAP[resolution];
    if (scale) {
      filters.push(`scale=${scale}`);
    }
  }

  if (filters.length > 0) {
    args.push('-vf', filters.join(','));
  }

  // --- Frame rate (skip for GIF — handled by fps filter) ---
  if (frameRate !== 'original' && effectiveFormat !== 'gif') {
    args.push('-r', String(frameRate));
  }

  // --- Codec & quality ---
  args.push(...getCodecArgs(effectiveFormat, quality, isMultiThreaded));
  args.push(...getAudioArgs(effectiveFormat));

  // --- Output ---
  const outputName = getOutputFilename(inputName, format);
  args.push('-y', outputName);

  return args;
}

/**
 * Returns the MIME type for a given format/extension.
 */
export function getMimeType(format: string): string {
  const mimeMap: Record<string, string> = {
    mp4: 'video/mp4',
    webm: 'video/webm',
    mkv: 'video/x-matroska',
    avi: 'video/x-msvideo',
    mov: 'video/quicktime',
    gif: 'image/gif',
  };
  return mimeMap[format] || 'video/mp4';
}
