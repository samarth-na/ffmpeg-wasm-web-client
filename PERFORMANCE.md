# FFmpeg Performance Optimizations

## Multi-Threaded Processing (Recommended)

The app now supports multi-threaded FFmpeg which provides **2-5x speedup**. However, it requires special headers to enable `SharedArrayBuffer`.

### Option 1: Vercel (vercel.json)
Add to your `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cross-Origin-Opener-Policy",
          "value": "same-origin"
        },
        {
          "key": "Cross-Origin-Embedder-Policy",
          "value": "require-corp"
        }
      ]
    }
  ]
}
```

### Option 2: Next.js Config (next.config.js)
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

### Option 3: Nginx
```nginx
add_header Cross-Origin-Opener-Policy "same-origin" always;
add_header Cross-Origin-Embedder-Policy "require-corp" always;
```

## Fallback Mode

If you cannot add COOP/COEP headers, the app will automatically fall back to single-threaded mode. It will still work but be slower.

## Other Optimizations Applied

1. **x264 Preset**: Changed from `medium` to `fast` for 20-30% speed improvement
2. **Thread Count**: Explicitly set thread count based on CPU cores
3. **Filter Optimization**: Skip unnecessary filters
4. **Input Buffer**: Optimized for streaming

## Performance Expectations

- **Single-thread**: ~12-25x slower than native FFmpeg
- **Multi-thread**: ~5-10x slower than native FFmpeg (with COOP/COEP headers)
- **Small videos (< 100MB)**: Usually 10-60 seconds
- **Large videos (> 500MB)**: May take several minutes
