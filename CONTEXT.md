# FFmpeg WASM Video Processor - Project Handoff

## Project Overview
Building a **client-side video processing web app** using Next.js + ffmpeg.wasm with a **Pastel Neo-Brutalist UI design** (light mode only). Users can upload videos (up to 500MB) and perform operations like format conversion (including GIF), resizing, compression, trimming, aspect ratio cropping, and frame rate adjustment - all in the browser without a backend.

## Current Status

### Completed

**1. Project Setup**
- Next.js 16.1.6 with Tailwind CSS v4 and shadcn/ui
- Installed dependencies: `@ffmpeg/ffmpeg@0.12.15`, `@ffmpeg/util@0.12.2`, `framer-motion`, `lucide-react`
- shadcn components: button, card, input
- Theme: Pastel Neo-Brutalist (soft colors + hard black borders/shadows, light mode only)

**2. Component Library** (`components/video-processor/`)
All UI components are built and working:
- `upload-zone.tsx` - Drag & drop file upload with validation
- `video-preview.tsx` - Video thumbnail + metadata display
- `preset-selector.tsx` - **Combined** `PresetFormatSelector` component:
  - 8 presets in 4-column grid: YouTube, YT Shorts, Reels, Insta Story, Insta Post V, Insta Post L, WhatsApp, Custom
  - Format pills row below presets (MP4, WebM, MKV, AVI, MOV, GIF, Keep)
  - Exports: `PresetFormatSelector`, `presets`, `formats`, types `Preset`, `FormatOption`, `PresetType`, `VideoFormat`
  - Each preset includes optional `aspectRatio` setting
- `aspect-ratio-selector.tsx` - **NEW** Aspect ratio selector:
  - 8 ratios: Original, 16:9, 9:16, 4:3, 1:1, 4:5, 1.91:1, 21:9
  - 4-column grid with visual ratio boxes showing proportions
  - Exports: `AspectRatioSelector`, `aspectRatios`, types `AspectRatio`, `AspectRatioOption`
- `quality-options.tsx` - Resolution, quality slider, frame rate controls
- `trim-inputs.tsx` - Time-based trimming with validation
- `process-button.tsx` - Processing button with states & progress bar
- `download-section.tsx` - Download result with file comparison

**3. Demo Page** (`app/demo/page.tsx`)
- Interactive showcase of all components
- Accessible at: `http://localhost:3000/demo`
- Shows theme colors, typography, buttons, badges, cards, form elements, and video processor components
- Updated to use `PresetFormatSelector` and `AspectRatioSelector`

**4. Styling** (`app/globals.css`)
- Complete Pastel Neo-Brutalist theme with CSS variables
- Custom component classes: `.brutal-btn`, `.brutal-card`, `.brutal-badge`, etc.
- Light mode only (dark mode removed)
- Responsive design patterns

**5. FFmpeg Integration**
- `hooks/use-ffmpeg.ts` - Custom React hook for FFmpeg WASM
  - Lazy-loads ffmpeg.wasm core (~31MB) from CDN
  - Two-pass palette-based GIF conversion for quality output (`convertToGif`)
  - Generic video processing with full option support (`processVideo`)
  - Auto-loads FFmpeg engine if not already loaded
  - Progress tracking via `progress` event
  - Log output via `log` event
  - Status state machine: `idle` -> `loading` -> `ready` -> `converting` -> `done`
  - Virtual filesystem cleanup after conversion
  - Error handling with user-friendly messages
  - Returns both GIF-specific (`gifUrl`, `gifSize`) and generic output (`outputUrl`, `outputSize`)

**6. Home Page - Full Video Processor** (`app/page.tsx`)
- Single-page video processor at `/` with `h-screen` layout (no scrolling on desktop)
- Uses `max-w-7xl` wide layout with tight spacing, `mb-10` on main content
- **Upload**: UploadZone with 500MB limit, drag & drop support
- **Compact grid layout** when file is selected:
  - Row 1: Video Preview (full width)
  - Row 2: PresetFormatSelector (left, wider) + AspectRatioSelector (right)
  - Row 3: Quality Options + Trim Inputs (side by side)
  - Row 4: Process button (full width)
- **Preset behavior**: Selecting a preset highlights it and fills all options (including aspect ratio); manually changing any option clears the preset highlight
- Format selector is a pill row inside the PresetFormatSelector card
- GIF is treated as just another output format via `processVideo()`
- Collapsible FFmpeg log viewer
- Auto-loads FFmpeg engine on first process (no separate load step)
- Error handling with retry
- Download section with file size comparison
- Footer always at bottom with border

**7. Metadata Updates**
- Updated `app/layout.tsx` with proper title and description

**8. FFmpeg Command Builder** (`lib/ffmpeg-commands.ts`)
- Utility that builds FFmpeg CLI args from user options
  - Format conversion: MP4, WebM, MKV, AVI, MOV, GIF (with appropriate codecs)
  - GIF support: no video codec flags, `-an` for no audio, `fps=10` filter for reasonable file size
  - **Aspect ratio support**: Center-crop filter using `crop=min(iw,ih*ratio):min(ih,iw/ratio)` for 16:9, 9:16, 4:3, 1:1, 4:5, 1.91:1, 21:9
  - Aspect ratio crop is applied first in the filter chain (before scaling)
  - Resolution scaling: 4K, 1080p, 720p, 480p, 1080p-vertical (Instagram), original
  - Quality control: CRF mapping (quality 1-4 -> CRF 28/23/18/15 for x264, 40/33/26/20 for VP9)
  - Codec selection: libx264+AAC for MP4/MKV/AVI/MOV, libvpx-vp9+libopus for WebM
  - Frame rate adjustment: 24, 30, 60fps or original (skipped for GIF)
  - Time trimming: input-seeking with `-ss` and `-to` for fast seeking
  - Video filter composition: combines crop + scale + fps filters into single `-vf` string
  - `ProcessOptions` interface includes `aspectRatio?: AspectRatio`
  - Helper functions: `getOutputFilename()`, `getMimeType()`, `timeToSeconds()`

### Removed
- **Dark mode** - Removed entirely (CSS variables, `.dark` block, `ThemeToggle` component, `dark:` Tailwind prefixes)
- **`/process` route** - Merged into home page; `app/process/page.tsx` deleted
- **`theme-toggle.tsx`** - Component deleted, export removed from `index.ts`
- **`format-selector.tsx`** - Deleted; functionality merged into `preset-selector.tsx` as `PresetFormatSelector`
- **`PresetSelector`** (old) - Replaced by `PresetFormatSelector` combined component

### Key Files Structure
```
app/
├── globals.css              # Theme styles, CSS variables, component classes (light only)
├── layout.tsx               # Root layout with metadata
├── demo/page.tsx            # Component showcase page
└── page.tsx                 # Home page: Full video processor (h-screen layout)

hooks/
└── use-ffmpeg.ts            # Custom hook: convertToGif + processVideo

lib/
├── utils.ts                 # shadcn utility
└── ffmpeg-commands.ts       # FFmpeg command builder (format, resolution, aspect ratio, trim, GIF)

components/
├── video-processor/         # All video processing UI components
│   ├── index.ts            # Barrel exports (PresetFormatSelector, AspectRatioSelector, etc.)
│   ├── upload-zone.tsx
│   ├── video-preview.tsx
│   ├── preset-selector.tsx  # Combined PresetFormatSelector (presets + format pills)
│   ├── aspect-ratio-selector.tsx  # NEW: AspectRatioSelector with visual ratio boxes
│   ├── quality-options.tsx
│   ├── trim-inputs.tsx
│   ├── process-button.tsx
│   └── download-section.tsx
├── ui/                      # shadcn components (button, card, input)
└── aceternity/              # Additional UI components
```

## Next Steps

### Phase 3: Features to Add
- **Merge videos** - Concatenate multiple clips
- **Extract audio** - Save just the audio track
- **Thumbnail generation** - Create preview images
- **Batch processing** - Process multiple files

### Phase 4: Polish
- Error boundaries for processing failures
- Memory management optimization
- Mobile optimization
- Performance monitoring
- Add multi-thread version with COOP/COEP headers for faster processing

## Design System Reference

**Colors:**
```css
--pastel-pink: #FFD6E0
--pastel-yellow: #FFF4BD
--pastel-blue: #D4E5FF
--pastel-green: #D4F5D4
--pastel-purple: #E6D5FF
--pastel-coral: #FF8B8B
--primary: #F97316 (orange)
```

**Key Styling Patterns:**
- All components use `border: 2px solid var(--black)`
- Shadows: `box-shadow: var(--shadow-sm)` etc. (3px, 4px, 5px offsets)
- Border radius: `rounded-lg` (0.625rem)
- Padding: buttons `0.75rem 1.5rem`, badges `0.5rem 1rem`, cards `1rem-1.5rem`

## To Continue Development

1. **Start dev server:**
   ```bash
   bun dev
   ```
   Server runs on http://localhost:3000

2. **View the app:**
   - Home page: http://localhost:3000 - Full video processor
   - Demo page: http://localhost:3000/demo - Component showcase

3. **Test the video processor (home page):**
   - Upload a video (up to 500MB, drag & drop or click)
   - Optionally pick a preset (YouTube, YT Shorts, Reels, Insta Story, Insta Post V/L, WhatsApp) or configure manually
   - Choose format (MP4, WebM, MKV, AVI, MOV, GIF, Keep), aspect ratio, resolution, quality, frame rate
   - Optionally set trim start/end times
   - Click "Process Video" (FFmpeg loads automatically on first use, ~31MB download)
   - Download the processed video/GIF

4. **Next immediate task:**
   Implement Phase 3 features (merge videos, extract audio, thumbnails, batch processing)

## Known Issues / Considerations

- **File size limit**: 500MB max (due to browser memory)
- **Performance**: WASM is 12-25x slower than native FFmpeg
- **Browser support**: Multi-thread needs SharedArrayBuffer + proper headers
- **Memory**: Must clean up virtual filesystem after processing
- **No server**: Everything must happen client-side
- **Resolution type gap**: `Resolution` type doesn't include `'1080p-vertical'`; works at runtime via `as Resolution` cast in preset handler

## Resources
- ffmpeg.wasm docs: https://ffmpegwasm.netlify.app/
- GitHub: https://github.com/ffmpegwasm/ffmpeg.wasm
- Current working branch: `main`

---

**Immediate next action:** Implement Phase 3 features - merge videos, extract audio, thumbnail generation, and batch processing.
