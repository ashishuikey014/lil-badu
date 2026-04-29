# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Turbopack) at localhost:3000
npm run build    # Production build
npm run start    # Start production server
npx tsc --noEmit # Type-check without emitting
```

There is no test suite or linter configured.

## Git & GitHub

Always commit and push to GitHub after meaningful changes.

```bash
# gh CLI is not on bash PATH — add it before use
export PATH="$PATH:/c/Program Files/GitHub CLI"

git add <files>
git commit -m "message"
git push
```

Remote: `https://github.com/ashishuikey014/lil-badu.git` (branch: `master`)

## Architecture

This is a Next.js 16 (App Router, Turbopack) image tool with two server-side API routes and a fully client-side UI.

### Data flow

```
User drops files
  └── DropZone → onFilesAdded(files: File[])
        └── useCompressFiles / useConvertFiles (hook)
              ├── Deduplicates by name+size against current entries[]
              ├── Appends CompressEntry[] / ConvertEntry[] (status: "queued")
              └── POSTs each file to /api/compress or /api/convert
                    └── Returns binary response + stats headers
                          └── Hook stores Blob in entry, status → "done"
                                └── FileCard renders stats; download triggers URL.createObjectURL
```

### API routes (server-only)

Both routes receive `multipart/form-data` and return raw binary with `Content-Type` matching the output format.

- **`/api/compress`** — accepts JPEG/PNG/WebP/AVIF; returns compressed binary. Response headers carry `X-Original-Size`, `X-Compressed-Size`, `X-Saved-Percent`. If the compressed result is larger than the original, returns the original unchanged with `X-Saved-Percent: 0`. HEIC is explicitly rejected with a helpful error (use Convert instead).

- **`/api/convert`** — accepts any supported format + `targetFormat` field (`jpeg|png|webp|avif`). HEIC detection uses both MIME type and file extension (iOS sometimes sends empty MIME). HEIC is decoded to a lossless JPEG buffer via `heic-convert` first, then Sharp re-encodes to the target format.

### Server-side image processing (`lib/`)

- `lib/compression/compressImage.ts` — Sharp pipeline per MIME type; quality presets in `lib/constants.ts` (`COMPRESS_QUALITY_PRESETS`)
- `lib/conversion/convertImage.ts` — Sharp output encoding for target format
- `lib/conversion/heicToBuffer.ts` — `heic-convert` wrapper; always decodes at `quality: 1` (lossless) to avoid double-compression loss before Sharp's final encode
- `lib/formatUtils.ts` — pure utilities: `formatBytes`, `replaceExtension`, `sanitizeFilename`, `isHeic`, `calcSavedPercent`
- `lib/constants.ts` — single source of truth for accepted MIME types, quality presets, format↔extension/MIME maps

### Client state (`hooks/`)

`useCompressFiles` and `useConvertFiles` own all file list state. They are the only place fetch calls are made. Key behaviours:
- Deduplication reads `entries` at call time (not inside the state updater) to avoid firing API calls for already-listed files
- All files in a batch are processed concurrently — no queue
- `useConvertFiles` also holds `globalTargetFormat`; changing it updates idle/queued entries' format but not already-processing or done ones

### Critical Next.js 16 constraints

- **Turbopack is the default** — do not add a `webpack` config to `next.config.ts`; use `turbopack: {}` if you need to acknowledge any Turbopack setting
- **`serverExternalPackages: ["sharp", "heic-convert"]`** must remain in `next.config.ts`; removing it causes Sharp to fail at runtime by bundling native binaries incorrectly
- Route handlers run on the Node.js runtime (not Edge) — never add `export const runtime = 'edge'` to API routes
- Sharp returns `Buffer<ArrayBufferLike>`; use `Buffer.from(ab as ArrayBuffer)` when converting from `arrayBuffer()`, and `new Uint8Array(buf)` when passing to `NextResponse`
- `heic-convert` has no `@types` package — declaration is in `types/heic-convert.d.ts`

### Tailwind v4

Configuration is CSS-only — there is no `tailwind.config.ts`. All custom tokens (brand colors, fonts, animations) are declared in `app/globals.css` under `@theme { ... }` and used as standard Tailwind utilities (e.g. `bg-brand`, `text-accent`, `text-text-secondary`).
