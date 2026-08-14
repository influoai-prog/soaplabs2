# Soap

Marketing website for Soap, built with React and Vite.

## Project structure

- `src/components/` — reusable page sections and UI components
- `src/pages/` — legal and standalone pages
- `src/lib/` — shared utilities and motion helpers
- `src/assets/` — source-controlled images and graphics
- `public/` — static fonts, media, icons, and manifest files
- `index.html` — Vite HTML entry point
- `vite.config.js` — development and production build configuration
- `vercel.json` — Vercel build and SPA routing configuration

## Local development

```bash
pnpm install
pnpm dev
```

## Checks and production build

```bash
pnpm lint
pnpm build
```

The production build is generated in `dist/` and is intentionally excluded from version control.
