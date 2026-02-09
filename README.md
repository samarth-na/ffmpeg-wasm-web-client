# FFmpeg WASM Web Client

A client-side video processing web app built with Next.js and [ffmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm). All video processing happens directly in the browser — no server or file uploads required.

Supports format conversion, resizing, compression, trimming, and frame rate adjustment for videos up to 500MB.

## Tech Stack

- **Framework:** Next.js 16.1.6 (App Router)
- **Runtime:** React 19
- **Styling:** Tailwind CSS v4, shadcn/ui (New York style)
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Video Processing:** ffmpeg.wasm (planned)
- **Package Manager:** Bun

## Design

The UI follows a **Pastel Neo-Brutalist** design system — soft pastel colors paired with hard 2px black borders and offset box shadows. Dark mode uses a warm grey palette (#3D3D3D) rather than pure black.

## Project Structure

```
app/
├── globals.css                # Theme, CSS variables, component classes
├── layout.tsx                 # Root layout
├── page.tsx                   # Landing page
└── demo/page.tsx              # Component showcase

components/
├── ui/                        # shadcn primitives (button, card, input)
└── video-processor/           # Video processing UI components
    ├── upload-zone.tsx        # Drag & drop file upload
    ├── video-preview.tsx      # Video thumbnail + metadata
    ├── preset-selector.tsx    # Quick presets (YouTube, Instagram, etc.)
    ├── format-selector.tsx    # Output format dropdown
    ├── quality-options.tsx    # Resolution, quality, frame rate controls
    ├── trim-inputs.tsx        # Time-based trimming
    ├── process-button.tsx     # Processing trigger with progress bar
    ├── download-section.tsx   # Download result with file comparison
    └── theme-toggle.tsx       # Dark/light mode toggle

lib/
└── utils.ts                   # Utility functions (cn helper)
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+

### Install dependencies

```bash
bun install
```

### Run the dev server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Other commands

```bash
bun run build    # Production build
bun run start    # Start production server
bun run lint     # Run ESLint
```

## Demo

Visit [http://localhost:3000/demo](http://localhost:3000/demo) to see the component showcase — theme colors, typography, buttons, badges, cards, form elements, and all video processor components.

## Roadmap

- [x] Pastel Neo-Brutalist design system with dark mode
- [x] All video processor UI components
- [x] Component demo/showcase page
- [ ] FFmpeg WASM integration (`hooks/use-ffmpeg.ts`)
- [ ] FFmpeg command builder service (`lib/ffmpeg-commands.ts`)
- [ ] Main processing page connecting UI to FFmpeg
- [ ] Merge videos, extract audio, thumbnail generation
- [ ] Batch processing
- [ ] Error boundaries and memory management
- [ ] Mobile optimization

## Constraints

- **File size:** 500MB max (browser memory limitation)
- **Performance:** WASM is ~12-25x slower than native FFmpeg
- **Multi-threading:** Requires `SharedArrayBuffer` and appropriate COOP/COEP headers
- **Client-only:** No server-side processing; everything runs in the browser
