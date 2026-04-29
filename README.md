# Lil-Badu

A fast, free, and private image compression and conversion tool. No file size limits. Files are processed on the fly and never stored.

## Features

- **Image Compression** — Compress PNG, JPG, WebP, and AVIF with before/after size stats and savings percentage
- **Format Conversion** — Convert between PNG, JPG, WebP, AVIF, and HEIC
- **Drag & Drop** — Drop multiple files at once for batch processing
- **Bulk Download** — Download all processed files as a ZIP
- **No size limits** — No file size restrictions
- **Private** — All processing happens server-side per request; nothing is stored

## Stack

- [Next.js 16](https://nextjs.org/) (App Router, TypeScript)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Sharp](https://sharp.pixelplumbing.com/) for server-side image processing
- [heic-convert](https://github.com/catdad-experiments/heic-convert) for HEIC decoding
- [JSZip](https://stuk.github.io/jszip/) for client-side bulk ZIP download

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

```bash
npm run build
npm start
```
