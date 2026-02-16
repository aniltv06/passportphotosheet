# OG Image Generator Guide

## Overview

This folder contains standalone HTML pages for generating Open Graph (OG) images for social media sharing. These images appear when your website is shared on platforms like Facebook, Twitter, LinkedIn, etc.

---

## Available Generators

### 1. Dark Theme (Default)
**File**: `og-image-generator.html`

**Design**:
- Dark gradient background (slate-900 → purple-900)
- Animated gradient orbs
- Professional, modern aesthetic
- Best for: Tech-focused audiences

### 2. Light Theme
**File**: `og-image-generator-light.html`

**Design**:
- Light gradient background (blue → purple → pink)
- Clean, vibrant aesthetic
- Floating animations
- Best for: General audiences, social media

---

## How to Use

### Step 1: Open the Generator

1. Navigate to the generator file in your browser:
   ```
   file:///Users/aniltv/Git_Repos/public-git/aniltv06/passportphotosheet/public/og-image-generator.html
   ```

2. Or double-click the file to open in your default browser

### Step 2: Take Screenshot

#### On Mac:
1. Press `Cmd + Shift + 4`
2. Press `Space` to capture window, or drag to select area
3. Select only the **1200x630px canvas** (the dark/light gradient box)
4. Screenshot saved to Desktop

#### On Windows:
1. Press `Win + Shift + S`
2. Select "Rectangular Snip"
3. Drag to select only the **1200x630px canvas**
4. Save the screenshot

#### Using Browser DevTools (Most Accurate):
1. Right-click on the canvas → Inspect
2. In DevTools, right-click the `<div class="og-image">` element
3. Select "Capture node screenshot"
4. Image automatically saved to Downloads

### Step 3: Save the Image

1. Rename the screenshot to: `og-image.png`
2. Move it to your project's public folder:
   ```
   /Users/aniltv/Git_Repos/public-git/aniltv06/passportphotosheet/public/og-image.png
   ```

### Step 4: Add Meta Tags

Update your `index.html` file with these meta tags:

```html
<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://passportphotomaker.com/" />
<meta property="og:title" content="Passport Photo Maker - Create Perfect Passport Photos Instantly" />
<meta property="og:description" content="AI-powered passport photo maker with professional grid overlays and instant printable sheets. 100% free, no signup required." />
<meta property="og:image" content="https://passportphotomaker.com/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Passport Photo Maker - Create professional passport photos instantly" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="https://passportphotomaker.com/" />
<meta name="twitter:title" content="Passport Photo Maker - Create Perfect Passport Photos Instantly" />
<meta name="twitter:description" content="AI-powered passport photo maker with professional grid overlays and instant printable sheets. 100% free, no signup required." />
<meta name="twitter:image" content="https://passportphotomaker.com/og-image.png" />
```

---

## OG Image Specifications

### Dimensions
- **Recommended**: 1200 x 630 pixels
- **Minimum**: 600 x 315 pixels
- **Aspect Ratio**: 1.91:1

### File Format
- **Best**: PNG (lossless, transparency support)
- **Alternative**: JPG (smaller file size)
- **Max Size**: 8 MB (but keep under 1 MB for performance)

### Safe Zone
- Keep important text/elements within **center 1200 x 600px**
- Some platforms crop edges

---

## Testing Your OG Image

### Facebook Sharing Debugger
1. Visit: https://developers.facebook.com/tools/debug/
2. Enter your URL: `https://passportphotomaker.com`
3. Click "Debug" to see how Facebook sees your OG image
4. Click "Scrape Again" to refresh cache

### Twitter Card Validator
1. Visit: https://cards-dev.twitter.com/validator
2. Enter your URL
3. Preview how your card looks on Twitter

### LinkedIn Post Inspector
1. Visit: https://www.linkedin.com/post-inspector/
2. Enter your URL
3. Preview and inspect OG tags

### OpenGraph.xyz (All-in-One)
1. Visit: https://www.opengraph.xyz/
2. Enter your URL
3. See previews for Facebook, Twitter, LinkedIn, Discord, etc.

---

## Customization Tips

### Change Colors
Edit the CSS gradient values:

```css
/* Dark theme */
background: linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%);

/* Light theme */
background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 50%, #fce7f3 100%);
```

### Change Text
Edit the HTML content:

```html
<!-- Main title -->
<h1 class="main-title">
  Your Custom<br>Title Here
</h1>

<!-- Features -->
<span class="feature-text">Your Feature Text</span>
```

### Change Designer Credit
Update the credit badge:

```html
<span class="credit-name">Your Name Here</span>
```

---

## Troubleshooting

### Image not showing on social media
1. Check file path is correct (`/og-image.png`)
2. Use absolute URL (`https://yourdomain.com/og-image.png`)
3. Clear social media cache using debugger tools
4. Verify image is publicly accessible (not blocked by robots.txt)

### Image looks blurry
1. Ensure screenshot is exactly 1200x630px
2. Save as PNG (not JPG) for best quality
3. Use "Capture node screenshot" in DevTools for pixel-perfect capture

### Wrong image showing
1. Social media platforms cache OG images
2. Use Facebook Debugger → "Scrape Again"
3. Wait 24 hours for cache to clear naturally

---

## File Sizes

After creating your OG image, optimize it:

### Using ImageOptim (Mac)
1. Download: https://imageoptim.com/
2. Drag `og-image.png` into app
3. Optimized image saved automatically

### Using TinyPNG (Web)
1. Visit: https://tinypng.com/
2. Upload `og-image.png`
3. Download optimized version

### Using Sharp CLI (Terminal)
```bash
npm install -g sharp-cli
sharp -i og-image.png -o og-image-optimized.png --format png --quality 90
```

**Target file size**: Under 300 KB for best performance

---

## Examples of Good OG Images

1. **High contrast** - Text clearly readable
2. **Branded** - Logo visible
3. **Simple** - Not too cluttered
4. **Descriptive** - Shows what the app does
5. **Professional** - Polished design

---

## Next Steps

1. ✅ Open `og-image-generator.html` or `og-image-generator-light.html`
2. ✅ Take screenshot of 1200x630px canvas
3. ✅ Save as `og-image.png`
4. ✅ Upload to `/public/` folder
5. ✅ Add meta tags to `index.html`
6. ✅ Test with Facebook Debugger
7. ✅ Deploy and share!

---

## Resources

- [Open Graph Protocol](https://ogp.me/) - Official OG documentation
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards) - Twitter card docs
- [LinkedIn Share](https://www.linkedin.com/help/linkedin/answer/46687) - LinkedIn sharing best practices
- [ogimage.gallery](https://www.ogimage.gallery/) - OG image inspiration

---

## Support

Need help? Check the main project README or open an issue on GitHub.

**Generated on**: 2024-02-15
**Project**: Passport Photo Maker
**Designer**: Nishitha Thatha Anil
