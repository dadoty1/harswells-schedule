# Plan Room viewer (massing-pdf)

The drawing viewer is [massing-pdf](https://github.com/MassingCloud/massing-pdf), MIT, TypeScript on PDF.js. The Harswells host in `app/plan-room/host/` is the only code we wrote on top of it: Dropbox save, tile and wall heights, and the phone bar. The massing-pdf sources are not patched.

| | |
|---|---|
| Upstream | https://github.com/MassingCloud/massing-pdf |
| License | MIT (`LICENSE`) |
| Package | `@massingcloud/pdf-viewer` 0.1.0 |
| Pinned commit | `36794b3c54fcfd62e3a0d2d5984cfc45cac83340` |
| Commit date | 2026-08-16 |
| Commit subject | Publish a landing page and a live demo to GitHub Pages |

PDF.js (`pdfjs-dist` 6.1.200, Apache-2.0) is bundled with this build, including its worker. It is not loaded from a CDN.

## How this folder was built

From a checkout of that commit, `npm install` (which runs the package build), then from `app/plan-room/host/`:

```bash
npm install
npm run build
```

The Vite build was copied here. Asset URLs are relative. `demo/sample-finish-plan.pdf` is the public sample sheet, not a Harswells plan. `demo/hws-tile-demo.json` is a hand takeoff in the older OpenTakeoff canvas format; the viewer converts it on open. `demo/hws-auto-sample.json` is an automatic takeoff in that same canvas format, also converted on open, with every shape still unreviewed.

`?sample=1` does not upload to Dropbox. A signed-in job PDF saves `harswells.planroom.v1` to `<Plans>/_takeoffs/<pdf path>.json`.
