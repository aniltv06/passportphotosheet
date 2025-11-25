import { defineConfig } from 'vite'
import { resolve } from 'path'
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  // Base public path for GitHub Pages
  // For development: use root path
  // For production: use repository name as base
  base: process.env.NODE_ENV === 'production' ? '/passportphotosheet/' : '/',

  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Generate source maps for debugging (optional)
    sourcemap: false,
    // Optimize for production using esbuild (faster than terser)
    minify: 'esbuild',
    // Copy assets from root to dist
    copyPublicDir: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'photo-editor': resolve(__dirname, 'photo-editor.html'),
        faq: resolve(__dirname, 'public/pages/faq.html'),
        contact: resolve(__dirname, 'public/pages/contact.html'),
        'privacy-policy': resolve(__dirname, 'public/pages/privacy-policy.html'),
        'terms-of-service': resolve(__dirname, 'public/pages/terms-of-service.html')
      },
      output: {
        assetFileNames: (assetInfo) => {
          // Keep CSS in css/ folder
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'css/[name].[hash][extname]'
          }
          // Keep other assets in assets/ folder
          return 'assets/[name].[hash][extname]'
        },
        chunkFileNames: 'js/[name].[hash].js',
        entryFileNames: 'js/[name].[hash].js'
      }
    }
  },

  // Development server configuration
  server: {
    port: 3000,
    open: true, // Auto-open browser
    cors: true,
    host: true // Expose to network
  },

  // Preview server (for testing production build)
  preview: {
    port: 4173,
    open: true
  },

  // Asset optimization
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg', '**/*.webp'],

  // Disable public directory (assets are in root)
  publicDir: false,

  // CSS configuration
  css: {
    devSourcemap: true
  },

  // Plugin to copy static assets
  plugins: [
    {
      name: 'copy-static-assets',
      closeBundle() {
        // Ensure dist directory exists
        if (!existsSync('dist')) {
          mkdirSync('dist', { recursive: true })
        }

        // Copy static files to dist after build
        const assets = [
          { src: 'demo-photo.png', dest: 'dist/demo-photo.png' },
          { src: 'og-image.jpg', dest: 'dist/og-image.jpg' },
          { src: 'robots.txt', dest: 'dist/robots.txt' },
          { src: 'sitemap.xml', dest: 'dist/sitemap.xml' },
          { src: 'manifest.json', dest: 'dist/manifest.json' }
        ]

        assets.forEach(({ src, dest }) => {
          if (existsSync(src)) {
            copyFileSync(src, dest)
            console.log(`✓ Copied ${src} to ${dest}`)
          }
        })

        // Copy favicon directory
        if (existsSync('favicon')) {
          if (!existsSync('dist/favicon')) {
            mkdirSync('dist/favicon', { recursive: true })
          }
          readdirSync('favicon').forEach(file => {
            copyFileSync(`favicon/${file}`, `dist/favicon/${file}`)
          })
          console.log('✓ Copied favicon directory')
        }

        // Copy components directory
        if (existsSync('components')) {
          if (!existsSync('dist/components')) {
            mkdirSync('dist/components', { recursive: true })
          }
          readdirSync('components').forEach(file => {
            copyFileSync(`components/${file}`, `dist/components/${file}`)
          })
          console.log('✓ Copied components directory')
        }
      }
    }
  ]
})
