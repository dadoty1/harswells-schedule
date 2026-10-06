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

PDF.js (`pdfjs-dist` 6.4.299, Apache-2.0) is bundled with this build, including its worker. It is not loaded from a CDN.

## How this folder was built

From a checkout of that commit, `npm install` (which runs the package build), then from `app/plan-room/host/`:

```bash
npm install
npm run build
```

The Vite build was copied here. Asset URLs are relative. `demo/sample-finish-plan.pdf`, `demo/hws-tile-demo.json`, and `demo/hws-auto-sample.json` stay in this folder for tests. The Pages build copies `demo/sample-finish-plan.pdf` (plus the tiny orient and permit samples) so the viewer opens without Dropbox. Takeoff JSON and CAD samples stay in the repo.

`?sample=1` does not upload to Dropbox. A signed-in job PDF saves `harswells.planroom.v1` to `<Plans>/_takeoffs/<pdf path>.json`.
