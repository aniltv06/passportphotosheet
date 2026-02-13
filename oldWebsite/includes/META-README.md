# Meta Tags Management System

This project uses a smart meta tag management system that automatically handles cache control based on the environment.

## 📁 Files

- **`js/meta-loader.js`** - Automatically detects development vs production and adds appropriate cache control
- **`includes/meta-common-template.html`** - Template showing the common meta structure for all pages

## 🚀 How It Works

### Automatic Cache Control

The `meta-loader.js` module automatically detects your environment:

**Development Mode** (localhost, 127.0.0.1, file://, etc.):
```html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
```
- Disables all caching
- Makes testing easier - changes appear immediately
- Console message: "🔧 Development mode: Cache control disabled for easier testing"

**Production Mode** (aniltv06.github.io):
```html
<meta http-equiv="Cache-Control" content="public, max-age=3600">
```
- Enables caching for 1 hour
- Improves page load performance
- Console message: "🚀 Production mode: Caching enabled for better performance"

## 📝 Usage

### 1. Include in HTML Pages

Add this line to the `<head>` section of your HTML files (after favicons, before other scripts):

```html
<!-- Dynamic Cache Control -->
<script type="module" src="js/meta-loader.js"></script>
```

### 2. Follow Common Meta Structure

Use the template in `includes/meta-common-template.html` as a reference for all pages.

**Common Meta Tags** (keep consistent across all pages):
- `charset`, `viewport`
- `author`: "Photo Sheet Maker"
- `theme-color`: "#007AFF"
- All favicons
- Social media defaults (og:site_name, og:locale, etc.)

**Page-Specific Meta Tags** (customize for each page):
- `title`, `description`, `keywords`
- `canonical` URL
- Open Graph (og:title, og:description, og:url, og:image)
- Twitter Card (twitter:title, twitter:description, twitter:url)

### 3. Test Your Pages

**Development Testing:**
```bash
# Start local server
python3 -m http.server 8000

# Open browser
http://localhost:8000/

# Check console - should see:
# 🔧 Development mode: Cache control disabled for easier testing
```

**Production Testing:**
```bash
# Open production URL
https://aniltv06.github.io/passportphotosheet/

# Check console - should see:
# 🚀 Production mode: Caching enabled for better performance
```

## 🎯 Benefits

1. **No Manual Configuration** - Automatically detects environment
2. **Better Development Experience** - No stale cache during development
3. **Better Production Performance** - Proper caching in production
4. **Consistent Meta Structure** - Common template for all pages
5. **Easy Maintenance** - Update one file, affects all pages

## 🔧 Environment Detection

The system detects development mode if the hostname is:
- `localhost`
- `127.0.0.1`
- `192.168.*` (local network)
- `10.*` (private network)
- `*.local` (mDNS)
- `file://` protocol

Any other hostname is considered production.

## 📚 Example Pages

### index.html
```html
<head>
    <!-- ... other meta tags ... -->

    <!-- Dynamic Cache Control -->
    <script type="module" src="js/meta-loader.js"></script>

    <!-- ... rest of head ... -->
</head>
```

### photo-editor.html
```html
<head>
    <!-- ... other meta tags ... -->

    <!-- Dynamic Cache Control -->
    <script type="module" src="js/meta-loader.js"></script>

    <!-- ... rest of head ... -->
</head>
```

## 🛠️ Customization

If you need to override the default behavior, you can modify `js/meta-loader.js`:

```javascript
// Change production cache duration
content: 'public, max-age=7200' // 2 hours instead of 1 hour

// Add more development indicators
hostname.includes('.dev') ||
hostname.includes('.staging')
```

## ⚠️ Important Notes

1. **Never manually add cache control meta tags** - Let meta-loader.js handle it
2. **Always test in both environments** - Development and production
3. **Keep common meta consistent** - Use the template as reference
4. **Update page-specific meta** - Customize for each page's content

## 🔍 Debugging

To debug cache control:

```javascript
// Check what the system detected
console.log('Hostname:', window.location.hostname);
console.log('Protocol:', window.location.protocol);

// View added meta tags
document.querySelectorAll('meta[http-equiv^="Cache"]').forEach(tag => {
    console.log(tag.httpEquiv, ':', tag.content);
});
```

## 📦 Adding New Pages

When creating a new page:

1. Copy meta structure from `includes/meta-common-template.html`
2. Customize page-specific values (title, description, URLs)
3. Add `<script type="module" src="js/meta-loader.js"></script>`
4. Test in development mode
5. Verify in production

That's it! The cache control will work automatically. 🎉
