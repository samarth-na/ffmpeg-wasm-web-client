"use client";

import React, { useState } from "react";
import {
  UploadZone,
  VideoPreview,
  PresetSelector,
  FormatSelector,
  QualityOptions,
  TrimInputs,
  ProcessButton,
  DownloadSection,
  ThemeToggle,
  type PresetType,
  type VideoFormat,
  type Resolution,
  type FrameRate,
  type ProcessStatus,
} from "@/components/video-processor";
import {
  Upload,
  FileVideo,
  Settings,
  FileType,
  Maximize,
  Scissors,
  Zap,
  Download,
  Palette,
  Type,
  CircleDot,
  Layers,
  Box,
} from "lucide-react";

export default function DemoPage() {
  // Component states
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<PresetType | null>(null);
  const [format, setFormat] = useState<VideoFormat>("mp4");
  const [resolution, setResolution] = useState<Resolution>("original");
  const [quality, setQuality] = useState<number>(3);
  const [frameRate, setFrameRate] = useState<FrameRate>("original");
  const [startTime, setStartTime] = useState<string>("00:00:00");
  const [endTime, setEndTime] = useState<string>("00:02:30");
  const [processStatus, setProcessStatus] = useState<ProcessStatus>("idle");
  const [progress, setProgress] = useState<number>(0);
  const [showDownload, setShowDownload] = useState<boolean>(false);

  // Demo file for VideoPreview
  const demoFile = new File([""], "demo-video.mp4", { type: "video/mp4" });

  // Color swatches for theme showcase
  const pastelColors = [
    {
      name: "Pastel Pink",
      class: "bg-[var(--pastel-pink)]",
      var: "--pastel-pink",
    },
    {
      name: "Pastel Yellow",
      class: "bg-[var(--pastel-yellow)]",
      var: "--pastel-yellow",
    },
    {
      name: "Pastel Blue",
      class: "bg-[var(--pastel-blue)]",
      var: "--pastel-blue",
    },
    {
      name: "Pastel Green",
      class: "bg-[var(--pastel-green)]",
      var: "--pastel-green",
    },
    {
      name: "Pastel Purple",
      class: "bg-[var(--pastel-purple)]",
      var: "--pastel-purple",
    },
    {
      name: "Pastel Coral",
      class: "bg-[var(--pastel-coral)]",
      var: "--pastel-coral",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b-2 border-black">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="icon-container bg-[var(--pastel-yellow)] rounded-lg">
              <Box className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black">Theme Components</h1>
              <p className="text-sm text-muted-foreground">
                Neo-Brutalist Video Processor UI
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-16">
        {/* Theme Colors Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-black flex items-center gap-3">
            <span className="icon-container bg-[var(--pastel-pink)] rounded-lg">
              <Palette className="w-6 h-6" />
            </span>
            Theme Colors
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {pastelColors.map((color) => (
              <div
                key={color.name}
                className="brutal-card rounded-lg p-4 text-center hover:-translate-y-1"
              >
                <div
                  className={`h-20 rounded border-2 border-black mb-3 ${color.class}`}
                />
                <p className="font-bold text-sm">{color.name}</p>
                <code className="text-xs text-muted-foreground">
                  {color.var}
                </code>
              </div>
            ))}
          </div>
        </section>

        {/* Typography Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-black flex items-center gap-3">
            <span className="icon-container bg-[var(--pastel-blue)] rounded-lg">
              <Type className="w-6 h-6" />
            </span>
            Typography
          </h2>

          <div className="section-card rounded-lg space-y-6">
            <div>
              <h1 className="text-4xl font-black mb-2">
                Heading 1 - The quick brown fox
              </h1>
              <p className="text-sm text-muted-foreground">
                text-4xl font-black
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-2">
                Heading 2 - The quick brown fox
              </h2>
              <p className="text-sm text-muted-foreground">
                text-3xl font-bold
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-2">
                Heading 3 - The quick brown fox
              </h3>
              <p className="text-sm text-muted-foreground">
                text-2xl font-bold
              </p>
            </div>

            <div>
              <p className="text-base mb-2">
                Body text - The quick brown fox jumps over the lazy dog. This is
                how regular body text looks.
              </p>
              <p className="text-sm text-muted-foreground">text-base</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Muted text - The quick brown fox jumps over the lazy dog. This
                is muted/secondary text.
              </p>
              <p className="text-sm text-muted-foreground">
                text-sm text-muted-foreground
              </p>
            </div>
          </div>
        </section>

        {/* Buttons Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-black flex items-center gap-3">
            <span className="icon-container bg-[var(--pastel-green)] rounded-lg">
              <CircleDot className="w-6 h-6" />
            </span>
            Buttons
          </h2>

          <div className="section-card rounded-lg space-y-6">
            <div className="flex flex-wrap gap-3">
              <button className=" px-4 brutal-btn-primary rounded-lg">
                Primary
              </button>
              <button className=" brutal-btn-secondary rounded-lg">
                Secondary
              </button>
              <button className="brutal-btn-outline rounded-lg">Outline</button>
              <button className="brutal-btn-ghost rounded-lg">Ghost</button>
            </div>

            <div className="flex flex-wrap gap-3">
              <button className=" px-4 brutal-btn-pink rounded-lg">Pink</button>
              <button className="brutal-btn-yellow rounded-lg">Yellow</button>
              <button className="brutal-btn-blue rounded-lg">Blue</button>
              <button className="brutal-btn-green rounded-lg">Green</button>
              <button className="brutal-btn-purple rounded-lg">Purple</button>
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="px-4 brutal-btn-primary rounded-lg" disabled>
                Disabled
              </button>
              <button className="brutal-btn-primary rounded-lg text-sm py-2 px-4">
                Small
              </button>
              <button className="brutal-btn-primary rounded-lg text-lg py-3 px-6">
                Large
              </button>
            </div>
          </div>
        </section>

        {/* Badges Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-black flex items-center gap-3">
            <span className="icon-container bg-[var(--pastel-purple)] rounded-lg">
              <CircleDot className="w-6 h-6" />
            </span>
            Badges
          </h2>

          <div className="section-card rounded-lg">
            <div className="flex flex-wrap gap-3">
              <span className="brutal-badge  rounded bg-white">Default</span>
              <span className="brutal-badge-pink rounded">Pink Badge</span>
              <span className="brutal-badge-yellow rounded">Yellow Badge</span>
              <span className="brutal-badge-blue rounded">Blue Badge</span>
              <span className="brutal-badge-green rounded">Green Badge</span>
              <span className="brutal-badge-purple rounded">Purple Badge</span>
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-black flex items-center gap-3">
            <span className="icon-container bg-[var(--pastel-coral)] rounded-lg">
              <Layers className="w-6 h-6" />
            </span>
            Cards
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="section-card rounded-lg">
              <h3 className="font-bold text-lg mb-2">Basic Card</h3>
              <p className="text-sm text-muted-foreground">
                This is a basic card component with the brutal-card styling.
              </p>
            </div>

            <div className="section-card-pink rounded-lg">
              <h3 className="font-bold text-lg mb-2">Pink Card</h3>
              <p className="text-sm text-muted-foreground">
                This card has a pink pastel background.
              </p>
            </div>

            <div className="section-card-blue rounded-lg">
              <h3 className="font-bold text-lg mb-2">Blue Card</h3>
              <p className="text-sm text-muted-foreground">
                This card has a blue pastel background.
              </p>
            </div>
          </div>
        </section>

        {/* Form Elements Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-black flex items-center gap-3">
            <span className="icon-container bg-[var(--pastel-orange)] rounded-lg">
              <FileType className="w-6 h-6" />
            </span>
            Form Elements
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="section-card rounded-lg space-y-4">
              <h3 className="font-bold">Inputs</h3>
              <input
                type="text"
                placeholder="Regular input..."
                className="brutal-input rounded-lg"
              />
              <input
                type="text"
                value="Focused input"
                readOnly
                className="brutal-input rounded-lg bg-[var(--pastel-yellow)]"
              />
            </div>

            <div className="section-card rounded-lg space-y-4">
              <h3 className="font-bold">Select</h3>
              <select className="brutal-select rounded-lg">
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
          </div>
        </section>

        {/* Video Processor Components Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-black flex items-center gap-3">
            <span className="icon-container bg-[var(--pastel-pink)] rounded-lg">
              <FileVideo className="w-6 h-6" />
            </span>
            Video Processor Components
          </h2>

          {/* Upload Zone */}
          <div className="section-card rounded-lg space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Zone
            </h3>
            <UploadZone onFileSelect={setUploadedFile} maxSizeMB={500} />
            {uploadedFile && (
              <div className="brutal-badge-green inline-flex">
                File selected: {uploadedFile.name}
              </div>
            )}
          </div>

          {/* Video Preview */}
          <div className="section-card rounded-lg space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <FileVideo className="w-5 h-5" />
              Video Preview (Demo)
            </h3>
            <VideoPreview
              file={demoFile}
              onRemove={() => console.log("Remove clicked")}
            />
          </div>

          {/* Preset Selector */}
          <div className="section-card rounded-lg space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Preset Selector
            </h3>
            <PresetSelector
              selected={selectedPreset}
              onSelect={(preset, settings) => {
                setSelectedPreset(preset);
                console.log("Preset settings:", settings);
              }}
            />
          </div>

          {/* Format Selector */}
          <div className="section-card rounded-lg space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <FileType className="w-5 h-5" />
              Format Selector
            </h3>
            <FormatSelector value={format} onChange={setFormat} />
          </div>

          {/* Quality Options */}
          <div className="section-card rounded-lg space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Maximize className="w-5 h-5" />
              Quality Options
            </h3>
            <QualityOptions
              resolution={resolution}
              onResolutionChange={setResolution}
              quality={quality}
              onQualityChange={setQuality}
              frameRate={frameRate}
              onFrameRateChange={setFrameRate}
            />
          </div>

          {/* Trim Inputs */}
          <div className="section-card rounded-lg space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Scissors className="w-5 h-5" />
              Trim Inputs
            </h3>
            <TrimInputs
              startTime={startTime}
              endTime={endTime}
              maxDuration={150}
              onStartChange={setStartTime}
              onEndChange={setEndTime}
            />
          </div>

          {/* Process Button */}
          <div className="section-card rounded-lg space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Process Button
            </h3>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setProcessStatus("idle")}
                  className="brutal-btn-ghost text-sm rounded"
                >
                  Set Idle
                </button>
                <button
                  onClick={() => setProcessStatus("loading")}
                  className="brutal-btn-ghost text-sm rounded"
                >
                  Set Loading
                </button>
                <button
                  onClick={() => setProcessStatus("processing")}
                  className="brutal-btn-ghost text-sm rounded"
                >
                  Set Processing
                </button>
                <button
                  onClick={() => setProcessStatus("complete")}
                  className="brutal-btn-ghost text-sm rounded"
                >
                  Set Complete
                </button>
                <button
                  onClick={() => setProcessStatus("error")}
                  className="brutal-btn-ghost text-sm rounded"
                >
                  Set Error
                </button>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="brutal-slider rounded"
              />

              <ProcessButton
                status={processStatus}
                progress={progress}
                onProcess={() => console.log("Process started")}
                onCancel={() => setProcessStatus("idle")}
              />
            </div>
          </div>

          {/* Download Section */}
          <div className="section-card rounded-lg space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Download className="w-5 h-5" />
              Download Section
            </h3>

            <button
              onClick={() => setShowDownload(!showDownload)}
              className="brutal-btn-secondary rounded-lg"
            >
              {showDownload ? "Hide" : "Show"} Download Section
            </button>

            {showDownload && (
              <DownloadSection
                downloadUrl="#"
                fileName="processed-video.mp4"
                originalSize={52428800}
                newSize={31457280}
                onProcessAnother={() => setShowDownload(false)}
              />
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t-2 border-black">
          <div className="text-center text-muted-foreground">
            <p>Pastel Neo-Brutalist Theme Demo</p>
            <p className="text-sm mt-1">
              Built with React, Tailwind CSS & shadcn/ui
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
