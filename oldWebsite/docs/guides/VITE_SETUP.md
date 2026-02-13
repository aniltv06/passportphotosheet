# Vite Development Setup

This project uses Vite for fast development and optimized production builds, fully compatible with GitHub Pages deployment.

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- npm (comes with Node.js)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Development Server

Start the development server with hot module replacement (HMR):

```bash
npm run dev
```

This will:
- Start the dev server at `http://localhost:3000`
- Automatically open your browser
- Enable hot module replacement for instant updates

### 3. Build for Production

Create an optimized production build:

```bash
npm run build
```

This will:
- Generate optimized assets in the `dist/` folder
- Minify HTML, CSS, and JavaScript
- Optimize images and other assets
- Set correct base path for GitHub Pages (`/passportphotosheet/`)

### 4. Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

This will serve the `dist/` folder at `http://localhost:4173`

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run deploy` | Build and deploy to GitHub Pages |

## 🌐 GitHub Pages Deployment

### Manual Deployment

```bash
npm run deploy
```

This command will:
1. Build the production version
2. Deploy to `gh-pages` branch
3. Automatically publish to GitHub Pages

### Automatic Deployment (GitHub Actions)

The project includes a GitHub Actions workflow that automatically deploys to GitHub Pages on every push to the `main` branch.

See `.github/workflows/deploy.yml` for details.

## 📁 Project Structure

```
passportphotosheet/
├── index.html              # Main page
├── photo-editor.html       # Photo editor page
├── faq.html               # FAQ page
├── contact.html           # Contact page
├── privacy-policy.html    # Privacy policy
├── terms-of-service.html  # Terms of service
├── css/                   # Stylesheets
│   ├── common.css
│   ├── components.css
│   └── ux-components.css
├── js/                    # JavaScript modules
│   ├── editor-app.js
│   ├── photoHandler.js
│   └── ...
├── translations/          # i18n files
├── components/            # Shared components
├── favicon/              # Favicon files
├── vite.config.js        # Vite configuration
├── package.json          # Dependencies
└── dist/                 # Build output (generated)
```

## ⚙️ Vite Configuration

Key features in `vite.config.js`:

- **Base Path**: Set to `/passportphotosheet/` for GitHub Pages
- **Multi-page**: All 6 HTML pages are entry points
- **Asset Optimization**: Minification and compression
- **Static Assets**: Automatic copying of favicon, images, etc.
- **Dev Server**: Port 3000 with auto-open and HMR
- **CSS Organization**: Maintains existing folder structure

## 🔧 Development Tips

### Hot Module Replacement (HMR)

Vite provides instant updates without full page reloads:
- Edit CSS → See changes immediately
- Edit JavaScript → Module hot-updates
- Edit HTML → Page reloads

### Module Imports

Use ES modules for better tree-shaking:

```javascript
// Instead of script tags, use:
import { initPhotoEditor } from './js/editor-app.js'
```

### Asset References

Reference assets relative to the file:

```html
<!-- In HTML -->
<img src="./demo-photo.png" alt="Demo">

<!-- In CSS -->
background-image: url('./demo-photo.png');
```

### Environment Variables

Create `.env` files for different environments:

```bash
# .env.development
VITE_API_URL=http://localhost:8080

# .env.production
VITE_API_URL=https://api.production.com
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL
```

## 🐛 Troubleshooting

### Port Already in Use

Change the port in `vite.config.js`:
```javascript
server: {
  port: 3001  // Change to any available port
}
```

### Build Fails

1. Clear cache: `rm -rf node_modules dist`
2. Reinstall: `npm install`
3. Rebuild: `npm run build`

### Assets Not Loading

Check the base path in `vite.config.js` matches your GitHub repo name.

## 📚 Resources

- [Vite Documentation](https://vitejs.dev/)
- [GitHub Pages Guide](https://docs.github.com/en/pages)
- [Vite + GitHub Pages](https://vitejs.dev/guide/static-deploy.html#github-pages)

## 🔄 Migration Notes

This project was migrated from a static setup to Vite. All existing functionality is preserved with added benefits:

- ✅ Faster development with HMR
- ✅ Optimized production builds
- ✅ Better code splitting
- ✅ Modern ES modules
- ✅ Maintained GitHub Pages compatibility
- ✅ Zero breaking changes to functionality
