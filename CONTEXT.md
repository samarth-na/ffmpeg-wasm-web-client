# 🎬 FFmpeg WASM Video Processor - Project Handoff

## Project Overview
Building a **client-side video processing web app** using Next.js + ffmpeg.wasm with a **Pastel Neo-Brutalist UI design**. Users can upload videos (up to 500MB) and perform operations like format conversion, resizing, compression, trimming, and frame rate adjustment - all in the browser without a backend.

## Current Status

### ✅ Completed

**1. Project Setup**
- Next.js 16.1.6 with Tailwind CSS v4 and shadcn/ui
- Installed dependencies: `@ffmpeg/ffmpeg`, `@ffmpeg/util`, `framer-motion`, `lucide-react`
- shadcn components: button, card, input
- Theme: Pastel Neo-Brutalist (soft colors + hard black borders/shadows)

**2. Component Library** (`components/video-processor/`)
All UI components are built and working:
- `upload-zone.tsx` - Drag & drop file upload with validation
- `video-preview.tsx` - Video thumbnail + metadata display
- `preset-selector.tsx` - Quick presets (YouTube, Instagram, WhatsApp, Custom)
- `format-selector.tsx` - Output format dropdown
- `quality-options.tsx` - Resolution, quality slider, frame rate controls
- `trim-inputs.tsx` - Time-based trimming with validation
- `process-button.tsx` - Processing button with states & progress bar
- `download-section.tsx` - Download result with file comparison
- `theme-toggle.tsx` - Dark/light mode toggle

**3. Demo Page** (`app/demo/page.tsx`)
- Interactive showcase of all components
- Accessible at: `http://localhost:3000/demo`
- Shows theme colors, typography, buttons, badges, cards, form elements, and video processor components

**4. Styling** (`app/globals.css`)
- Complete Pastel Neo-Brutalist theme with CSS variables
- Custom component classes: `.brutal-btn`, `.brutal-card`, `.brutal-badge`, etc.
- Dark mode support with greyish theme
- Responsive design patterns

### 🔄 In Progress / Issues Fixed
- Fixed CSS text clipping issues (buttons, badges, cards now have proper padding)
- Fixed border thickness error (was 10px, now 2px)
- Fixed button alignment (was `right`, now `center`)
- All components rendering correctly on demo page

### 📁 Key Files Structure
```
app/
├── globals.css              # Theme styles, CSS variables, component classes
├── demo/page.tsx            # Component showcase page
├── layout.tsx               # Root layout
├── page.tsx                 # Main landing page (basic)
components/
├── video-processor/         # All video processing UI components
│   ├── index.ts            # Exports
│   ├── upload-zone.tsx
│   ├── video-preview.tsx
│   ├── preset-selector.tsx
│   ├── format-selector.tsx
│   ├── quality-options.tsx
│   ├── trim-inputs.tsx
│   ├── process-button.tsx
│   ├── download-section.tsx
│   └── theme-toggle.tsx
├── ui/                      # shadcn components (button, card, input)
```

## 🎯 Next Steps

### Phase 1: FFmpeg Integration (CRITICAL - NOT STARTED)
Need to implement actual video processing:

1. **Create FFmpeg Hook** (`hooks/use-ffmpeg.ts`)
   - Lazy load ffmpeg.wasm (31MB core)
   - Progress tracking during load and processing
   - Error handling and cleanup
   - Support for both single-thread and multi-thread versions

2. **Create Video Processing Service** (`lib/ffmpeg-commands.ts`)
   - Build FFmpeg command generator based on user options
   - Handle format conversion: `-i input.mp4 output.webm`
   - Handle resize: `-vf "scale=1920:1080"`
   - Handle compression: `-crf 23 -vcodec libx264`
   - Handle trim: `-ss 00:00:10 -t 00:01:30`
   - Handle frame rate: `-r 30`

### Phase 2: Main Processing Page
Create `app/process/page.tsx` that:
- Uses UploadZone for file selection
- Shows VideoPreview after upload
- Displays all option cards (Format, Quality, Trim)
- Has ProcessButton that triggers FFmpeg
- Shows progress during processing
- Displays DownloadSection when complete

### Phase 3: Features to Add
- **Merge videos** - Concatenate multiple clips
- **Extract audio** - Save just the audio track
- **Thumbnail generation** - Create preview images
- **Batch processing** - Process multiple files

### Phase 4: Polish
- Add actual ffmpeg.wasm download (currently just UI)
- Error boundaries for processing failures
- Memory management (cleanup virtual filesystem)
- Mobile optimization
- Performance monitoring

## 🎨 Design System Reference

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

**Dark Mode:**
- Background: #3D3D3D (greyish, not pure black)
- Cards: #4A4A4A
- Pastels become muted in dark mode

**Key Styling Patterns:**
- All components use `border: 2px solid var(--black)`
- Shadows: `box-shadow: var(--shadow-sm)` etc. (3px, 4px, 5px offsets)
- Border radius: `rounded-lg` (0.625rem)
- Padding: buttons `0.75rem 1.5rem`, badges `0.5rem 1rem`, cards `1.5rem`

## 🚀 To Continue Development

1. **Start dev server:**
   ```bash
   bun dev
   ```
   Server runs on http://localhost:3000

2. **View demo page:**
   http://localhost:3000/demo

3. **Install FFmpeg packages** (if not already):
   ```bash
   bun add @ffmpeg/ffmpeg @ffmpeg/util
   ```

4. **Next immediate task:**
   Create `app/video-processor/hooks/use-ffmpeg.ts` for FFmpeg integration

## ⚠️ Known Issues / Considerations

- **File size limit**: 500MB max (due to browser memory)
- **Performance**: WASM is 12-25x slower than native FFmpeg
- **Browser support**: Multi-thread needs SharedArrayBuffer + proper headers
- **Memory**: Must clean up virtual filesystem after processing
- **No server**: Everything must happen client-side

## 📚 Resources
- ffmpeg.wasm docs: https://ffmpegwasm.netlify.app/
- GitHub: https://github.com/ffmpegwasm/ffmpeg.wasm
- Current working branch: `main`

---

**Immediate next action:** Implement the FFmpeg hook and processing logic to make the video processor actually functional, then build the main processing page that ties all the UI components together with real video processing capabilities.
