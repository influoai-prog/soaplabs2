# soap

Marketing website for Soap, built with React and Vite.

## folder guide

- `src/components/layout/` — navigation, footer, and page layout components
- `src/components/sections/` — homepage content sections
- `src/components/branding/` — logo and brand-mark components
- `src/components/ui/` — reusable buttons and icons
- `src/pages/` — standalone legal pages
- `src/utilities/` — shared animation, scrolling, and styling helpers
- `src/assets/` — images and graphics imported by source code
- `public/fonts/` — locally hosted font files
- `public/images/` — images served directly by the browser
- `public/workflow-showcase.mp4` — homepage workflow demonstration
- `index.html` — browser entry document
- `vite.config.js` — local and production build configuration
- `vercel.json` — deployment and route configuration

## local development

```bash
pnpm install
pnpm dev
```

## checks and production build

```bash
pnpm lint
pnpm build
```

Generated output is written to `dist/` and excluded from version control.
