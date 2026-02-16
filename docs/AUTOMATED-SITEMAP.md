# Automated Sitemap Generation

## Overview

Your Passport Photo Maker app now has **fully automated sitemap generation** that runs on every build!

---

## ✅ How It Works

### Automatic Generation
Every time you run `npm run build`, the sitemap is automatically generated:

```bash
npm run build
# Output:
# ✓ built in 1.94s
# 🗺️  Generating automated sitemap...
# ✅ Sitemap generated successfully!
#    📍 Location: /build/sitemap.xml
#    📄 Routes: 1
#    🌐 Hostname: https://passportphotomaker.com
```

### What Gets Generated

**Location:** `/build/sitemap.xml`

**Content:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://passportphotomaker.com/</loc>
    <lastmod>2026-02-16</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

### Features
- ✅ **Automatic date updates** - `lastmod` uses current build date
- ✅ **Consistent formatting** - Valid XML with proper encoding
- ✅ **Production-ready** - Generated in `/build/` directory
- ✅ **Zero maintenance** - No manual updates needed
- ✅ **Extensible** - Easy to add new routes as your app grows

---

## 🛠️ Configuration

### Adding New Routes

When you add new pages (privacy, terms, help, etc.), simply edit:

**`scripts/generate-sitemap.js`**

```javascript
const config = {
  hostname: 'https://passportphotomaker.com',
  outDir: path.join(__dirname, '../build'),
  routes: [
    {
      path: '/',
      changefreq: 'weekly',
      priority: 1.0,
      lastmod: new Date().toISOString().split('T')[0],
    },
    // Add new routes here:
    {
      path: '/privacy',
      changefreq: 'monthly',
      priority: 0.5,
      lastmod: new Date().toISOString().split('T')[0],
    },
    {
      path: '/terms',
      changefreq: 'monthly',
      priority: 0.5,
      lastmod: new Date().toISOString().split('T')[0],
    },
    {
      path: '/help',
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date().toISOString().split('T')[0],
    },
  ],
};
```

### Change Frequency Options
- `always` - Changes every visit
- `hourly` - Changes hourly
- `daily` - Daily updates
- `weekly` - Weekly updates ⭐ (recommended for most pages)
- `monthly` - Monthly updates
- `yearly` - Yearly updates
- `never` - Static content

### Priority Scale
- `1.0` - Highest priority (homepage) ⭐
- `0.8` - Very important pages (main features)
- `0.6` - Important pages (documentation)
- `0.5` - Standard pages (terms, privacy)
- `0.3` - Low priority pages (archived content)

---

## 📋 NPM Scripts

### Build with Sitemap (Default)
```bash
npm run build
```
Runs: `vite build && node scripts/generate-sitemap.js`

Generates:
- Production build in `/build/`
- Sitemap at `/build/sitemap.xml`

### Generate Sitemap Only
```bash
npm run build:sitemap
```
Runs: `node scripts/generate-sitemap.js`

Useful for:
- Regenerating sitemap after route changes
- Testing sitemap configuration
- Manual sitemap updates

---

## 🚀 Deployment

### What Gets Deployed

When you deploy `/build/` folder, it contains:
```
build/
├── index.html           # Main app
├── sitemap.xml          # ✅ Auto-generated sitemap
├── robots.txt           # Search engine instructions
├── manifest.json        # PWA manifest
└── assets/              # JS, CSS, images
```

### Search Engine Submission

After deployment, submit your sitemap to:

**Google Search Console:**
1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add property: `https://yourdomain.com`
3. Verify ownership
4. Submit sitemap: `https://yourdomain.com/sitemap.xml`

**Bing Webmaster Tools:**
1. Go to [bing.com/webmasters](https://www.bing.com/webmasters)
2. Add site and verify
3. Submit sitemap: `https://yourdomain.com/sitemap.xml`

---

## 🔄 How Automation Works

### Build Process Flow

```
npm run build
     ↓
Vite builds React app → /build/
     ↓
Sitemap script executes
     ↓
Reads routes from config
     ↓
Generates XML with current date
     ↓
Writes to /build/sitemap.xml
     ↓
✅ Build complete!
```

### Script Logic

**`scripts/generate-sitemap.js`:**
1. Reads routes configuration
2. Gets current date for `lastmod` field
3. Generates XML with proper formatting
4. Writes to build directory
5. Logs success with route count

### Date Handling
```javascript
lastmod: new Date().toISOString().split('T')[0]
// Output: "2026-02-16" (YYYY-MM-DD)
```
- Updates automatically on every build
- ISO 8601 date format (search engine standard)
- No manual date updates needed

---

## ✅ Validation

### Test Your Sitemap

**After building, verify:**

```bash
# Check file exists
ls -lh build/sitemap.xml

# View contents
cat build/sitemap.xml

# Validate XML syntax (if xmllint installed)
xmllint --noout build/sitemap.xml
```

**Online Validators:**
- [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)
- [Google Search Console Sitemap Tester](https://search.google.com/search-console)

### What to Check
- ✅ Valid XML syntax
- ✅ All important routes included
- ✅ Correct hostname (no placeholder domains)
- ✅ Current `lastmod` dates
- ✅ Appropriate priorities and changefreqs

---

## 🔧 Troubleshooting

### Sitemap Not Generated

**Check 1:** Verify script runs
```bash
npm run build:sitemap
```
Should show: "✅ Sitemap generated successfully!"

**Check 2:** Verify build directory exists
```bash
ls -la build/
```

**Check 3:** Check for JavaScript errors
```bash
node scripts/generate-sitemap.js
```

### Wrong Domain in Sitemap

**Update hostname:**

`scripts/generate-sitemap.js` line 12:
```javascript
hostname: 'https://passportphotomaker.com',  // ← Change this
```

### Missing Routes

**Add route to config:**

`scripts/generate-sitemap.js` lines 14-23:
```javascript
routes: [
  { path: '/', ... },
  { path: '/new-page', ... },  // ← Add here
],
```

---

## 📊 Comparison: Before vs After

| Feature | Static Sitemap | Automated Sitemap |
|---------|---------------|-------------------|
| **Update method** | Manual editing | Automatic on build |
| **Date accuracy** | Manually update dates | Always current |
| **New routes** | Manually add XML | Edit JS config |
| **Maintenance** | High | Zero |
| **Error-prone** | Yes (XML syntax) | No (validated) |
| **Build integration** | No | Yes ✅ |

---

## 🎯 Best Practices

### 1. Update Hostname Before Deploy
```javascript
hostname: 'https://youractual domain.com',  // ✅ Use real domain
```

### 2. Add Routes as You Build
When creating new pages, add them to config immediately.

### 3. Use Appropriate Priorities
- Homepage: 1.0
- Main features: 0.8
- Documentation: 0.6
- Legal pages: 0.5

### 4. Set Realistic Change Frequencies
- Don't set `always` unless content truly changes every visit
- Use `weekly` for actively maintained pages
- Use `monthly` for stable content

### 5. Test After Major Changes
```bash
npm run build:sitemap
cat build/sitemap.xml
```

---

## 📈 Benefits

### For Search Engines
- ✅ Easy discovery of all pages
- ✅ Accurate last-modified dates
- ✅ Clear priority signals
- ✅ Proper XML structure

### For Developers
- ✅ Zero manual maintenance
- ✅ Automatic date updates
- ✅ Easy to extend
- ✅ Built into workflow

### For SEO
- ✅ Faster indexing
- ✅ Better crawl efficiency
- ✅ Up-to-date content signals
- ✅ Professional site structure

---

## 🔐 Security Notes

- Sitemap is **public** - only list public pages
- Don't include admin panels, private routes, or sensitive URLs
- Sitemap doesn't affect access control
- Use `robots.txt` to restrict crawler access if needed

---

## 🚀 Future Enhancements

### Potential Additions

**1. Dynamic Route Discovery**
```javascript
// Auto-detect routes from React Router
import { routes } from '../src/routes';
```

**2. Image Sitemap**
```xml
<image:image>
  <image:loc>https://example.com/image.jpg</image:loc>
  <image:title>Passport Photo Example</image:title>
</image:image>
```

**3. Multi-Language Support**
```xml
<xhtml:link rel="alternate" hreflang="es" href="https://example.com/es/" />
```

**4. Sitemap Index** (for 50,000+ URLs)
```xml
<sitemapindex>
  <sitemap>
    <loc>https://example.com/sitemap1.xml</loc>
  </sitemap>
</sitemapindex>
```

---

## Summary

Your sitemap is now **fully automated**:

✅ Generates on every build
✅ Always has current dates
✅ Easy to extend with new routes
✅ Production-ready
✅ Zero maintenance required

Just run `npm run build` and your sitemap updates automatically!
