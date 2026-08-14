import { existsSync, readdirSync } from 'node:fs'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, normalizePath } from 'vite'

/**
 * Production: turn `import './x.css'` into a separate emitted CSS file
 * loaded via <link>, same as forked-file delivery in forked-file mode.
 *
 * The CSS assets are also statically linked from the built HTML <head>,
 * so the browser starts fetching and applying styles in parallel with the
 * JS bundle instead of waiting for JS to inject <link> tags at runtime
 * (which caused a flash of unstyled content).
 */
function cssAsSeparateFilesInBuild() {
  const cssSideEffectImportRE =
    /(?:^|[\n;])\s*import\s+(['"])([^'"]+\.css(?:\?[^'"]*)?)\1\s*;?/g

  const cssOrder = []

  return {
    name: 'css-as-separate-files-in-build',
    apply: 'build',
    enforce: 'pre',
    transform(code, id) {
      const filename = id.split('?')[0]
      if (!/\.[cm]?[jt]sx?$/.test(filename)) return null
      if (!code.includes('.css')) return null

      let n = 0
      let changed = false

      const next = code.replace(
        cssSideEffectImportRE,
        (full, quote, spec) => {
          if (/\?[ &=]*\b(url|inline|raw|commonjs-proxy)\b/.test(spec)) {
            return full
          }

          changed = true
          const cleanSpec = spec.split('?')[0]
          const assetName = `assets/${cleanSpec.split('/').pop()}`
          if (!cssOrder.includes(assetName)) cssOrder.push(assetName)

          const varName = `__soap_css_${n++}`
          const leading = full.match(/^[;\n]?(\s*)/)?.[0] ?? '\n'

          return `${leading}import ${varName} from ${quote}${cleanSpec}?url${quote};
(function () {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = ${varName};
  document.head.appendChild(link);
})();`
        },
      )

      if (!changed) return null
      return { code: next, map: null }
    },
    transformIndexHtml(html, ctx) {
      const bundle = ctx.bundle ?? {}
      const emitted = new Set(
        Object.values(bundle)
          .filter(
            (asset) =>
              asset.type === 'asset' &&
              asset.fileName.startsWith('assets/') &&
              asset.fileName.endsWith('.css'),
          )
          .map((asset) => asset.fileName),
      )
      const ordered = [
        ...new Set([
          ...cssOrder.filter((name) => emitted.has(name)),
          ...emitted,
        ]),
      ]
      if (ordered.length === 0) return html

      ordered.sort((a, b) => {
        const rank = (name) =>
          name === 'assets/index.css' ? -1 : name === 'assets/App.css' ? 1 : 0
        return rank(a) - rank(b)
      })

      const links = ordered
        .map((href) => `    <link rel="stylesheet" href="/${href}" />`)
        .join('\n')

      return html.replace(
        '\n    <link rel="manifest"',
        `\n${links}\n    <link rel="manifest"`,
      )
    },
  }
}

/**
 * Dev: serve CSS as <link rel="stylesheet"> (like production),
 * instead of injecting <style> tags.
 *
 * The links are also statically written into the served HTML <head> so
 * styles are present before the body renders (no flash of unstyled
 * content). The runtime HMR code below reuses those same <link> elements
 * (matched via data-vite-dev-id) instead of creating duplicates.
 */
function cssFilesInDev() {
  let root = ''

  return {
    name: 'css-files-in-dev',
    apply: 'serve',
    enforce: 'post',
    configResolved(config) {
      root = normalizePath(config.root)
    },
    transformIndexHtml(html) {
      if (!root) return html

      const srcDir = path.join(root, 'src')
      if (!existsSync(srcDir)) return html

      const cssFiles = []
      const walk = (dir) => {
        for (const entry of readdirSync(dir, { withFileTypes: true })) {
          const full = path.join(dir, entry.name)
          if (entry.isDirectory()) walk(full)
          else if (entry.isFile() && entry.name.endsWith('.css')) {
            cssFiles.push(full)
          }
        }
      }
      walk(srcDir)

      const rank = (file) => {
        const name = path.basename(file)
        return name === 'index.css' ? -1 : name === 'App.css' ? 1 : 0
      }
      const ordered = cssFiles
        .filter((file) => path.basename(file) !== 'fonts.tokens.css')
        .sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))
        .map((file) => {
          const abs = normalizePath(file)
          return {
            href: `${abs.slice(root.length)}?direct`,
            id: abs,
          }
        })

      if (ordered.length === 0) return html

      const links = ordered
        .map(
          ({ href, id }) =>
            `    <link rel="stylesheet" href="${href}" data-vite-dev-id="${id}" />`,
        )
        .join('\n')

      return html.replace('</head>', `${links}\n  </head>`)
    },
    transform(code, id) {
      if (!code.includes('__vite__updateStyle')) return null

      const idMatch = code.match(
        /const __vite__id\s*=\s*("[^"]*"|'[^']*')/,
      )
      if (!idMatch) return null

      let modulesExport = ''
      const exportIdx = code.search(/\nexport\s/)
      if (exportIdx !== -1) {
        modulesExport = code.slice(exportIdx + 1)
      }

      const filePath = normalizePath(id.split('?')[0])
      const href = filePath.startsWith(root)
        ? filePath.slice(root.length)
        : `/@fs/${filePath}`

      return `
const __vite__id = ${idMatch[1]};
const __vite__href = ${JSON.stringify(href)} + '?direct';
const __vite__selector = 'link[rel="stylesheet"][data-vite-dev-id="' + CSS.escape(__vite__id) + '"]';
let __vite__link = document.querySelector(__vite__selector);
const __vite__hadLink = !!__vite__link;
if (!__vite__link) {
  __vite__link = document.createElement('link');
  __vite__link.rel = 'stylesheet';
  __vite__link.setAttribute('data-vite-dev-id', __vite__id);
  document.head.appendChild(__vite__link);
}
if (import.meta.hot.data.initialized || !__vite__hadLink) {
  __vite__link.href = __vite__href + '&t=' + Date.now();
} else {
  import.meta.hot.data.initialized = true;
}
import.meta.hot.accept();
import.meta.hot.prune(() => {
  __vite__link?.remove();
});
${modulesExport}
`
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    cssAsSeparateFilesInBuild(),
    cssFilesInDev(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    minify: false,
    cssMinify: false,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        assetFileNames(assetInfo) {
          const name = assetInfo.names?.[0] ?? assetInfo.name ?? 'asset'
          if (name.endsWith('.css')) {
            return 'assets/[name][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        },
      },
    },
  },
})
