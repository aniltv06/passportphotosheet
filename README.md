# Passport Photo Maker

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![GitHub Stars](https://img.shields.io/github/stars/aniltv06/passportphotosheet?style=social)](https://github.com/aniltv06/passportphotosheet)

> A free, privacy-focused web application to create professional passport photo sheets for printing at any photo service worldwide. Save up to 95% on passport photos.

**[🚀 Live Demo](https://aniltv06.github.io/passportphotosheet/)** • **[🐛 Report Bug](https://github.com/aniltv06/passportphotosheet/issues)** • **[✨ Request Feature](https://github.com/aniltv06/passportphotosheet/issues)**

---

## Overview

Passport Photo Maker is a client-side web application that arranges your 2×2 inch passport photos on standard print sheets (4×6", 5×7", or 8×10"). Print up to 20 photos on a single sheet and cut them yourself.

### Key Features

- **📷 Universal Compatibility** - Upload JPG or PNG images
- **💰 Cost Effective** - Print 6-20 photos per sheet, saving 80-95% compared to single prints
- **🌍 Multi-language** - 12 languages supported (English, Spanish, French, German, Portuguese, Italian, Japanese, Korean, Chinese, Arabic, Hindi, Russian)
- **🔒 Privacy First** - All processing happens locally in your browser. Photos never leave your device
- **📱 Progressive Web App** - Install on any device, works offline
- **♿ Accessible** - WCAG 2.1 AA compliant with full keyboard and screen reader support
- **🎨 High Quality** - 300 DPI output for professional results

---

## Quick Start

### For Users

1. Visit [https://aniltv06.github.io/passportphotosheet/](https://aniltv06.github.io/passportphotosheet/)
2. Upload your 2×2" passport photo
3. Customize your layout (sheet size, quality, cutting guides)
4. Download and print at any photo service

### For Developers

```bash
# Clone the repository
git clone https://github.com/aniltv06/passportphotosheet.git
cd passportphotosheet

# Open in browser (no build required)
open index.html

# Or use a local server
python -m http.server 8000
# Visit http://localhost:8000
```

---

## Technical Details

### Architecture

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Canvas API**: Client-side image processing
- **Service Worker**: Offline functionality
- **No Dependencies**: Zero external libraries for core functionality
- **Analytics**: Optional Google Analytics 4 and Microsoft Clarity integration

### Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome/Edge | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Mobile Safari | iOS 14+ |

### Project Structure

```
passportphotosheet/
├── index.html                 # Main application (all-in-one)
├── manifest.json              # PWA manifest
├── service-worker.js          # Offline support
├── sitemap.xml                # SEO sitemap
├── robots.txt                 # Crawler configuration
├── privacy-policy.html        # Privacy policy
├── terms-of-service.html      # Terms of service
├── faq.html                   # FAQ page
├── contact.html               # Contact page
└── README.md                  # This file
```

---

## Configuration

### 1. Deployment (GitHub Pages)

```bash
# Enable GitHub Pages
# Settings → Pages → Source: main branch, / (root)
```

Your site will be available at: `https://yourusername.github.io/passportphotosheet/`

### 2. Analytics Setup (Optional)

**Google Analytics 4:**
1. Create GA4 property at [analytics.google.com](https://analytics.google.com)
2. Replace `G-BHSENQTDSF` in `index.html` (lines 61, 66)

**Microsoft Clarity:**
1. Create project at [clarity.microsoft.com](https://clarity.microsoft.com)
2. Replace `u9f5jiwh0y` in `index.html` (line 78)

### 3. Custom Domain (Optional)

Update URLs in:
- `index.html` (meta tags, lines 17-35)
- `sitemap.xml` (all URL entries)
- All canonical URLs in HTML pages

---

## Contributing

We welcome contributions! Please follow these guidelines:

### How to Contribute

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/passportphotosheet.git
   cd passportphotosheet
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow existing code style and conventions
   - Test thoroughly across different browsers
   - Ensure accessibility standards are maintained

3. **Submit a Pull Request**
   - Provide a clear description of the changes
   - Reference any related issues
   - Include screenshots for UI changes
   - Ensure all tests pass

### Contribution Ideas

- 🌍 **Translations** - Add support for more languages
- 🎨 **UI/UX** - Improve design and user experience
- 📝 **Documentation** - Enhance guides and documentation
- 🐛 **Bug Fixes** - Report and fix bugs
- ✨ **Features** - Add new photo sizes, layouts, or editing tools
- ♿ **Accessibility** - Improve WCAG compliance
- 🧪 **Testing** - Add automated tests

### Code Style Guidelines

- Use semantic HTML5 elements
- Follow BEM methodology for CSS classes where applicable
- Use ES6+ JavaScript features
- Write self-documenting code with clear variable names
- Add comments for complex logic
- Maintain mobile-first responsive design

### Adding New Languages

To add a new language translation:

1. Edit `index.html` (around line 1462)
2. Add your language code and translations to the `translations` object
3. Add language option to selector (around line 1201)
4. Follow existing translation format

Example:
```javascript
nl: {
    title: "Foto Blad Maker",
    subtitle: "Maak professionele paspoort foto vellen",
    // ... add all translation keys
}
```

Then add to selector:
```html
<option value="nl">🇳🇱 Nederlands</option>
```

### Reporting Issues

When reporting bugs, please include:
- Browser and version
- Operating system
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Console errors (if any)

---

## Privacy & Security

- ✅ **No Server Uploads** - All processing happens in your browser
- ✅ **No Data Collection** - Photos never leave your device
- ✅ **No User Accounts** - No registration required
- ✅ **Anonymous Analytics** - IP addresses anonymized (if enabled)
- ✅ **GDPR & CCPA Compliant** - Full privacy law compliance

---

## Accessibility

This application is designed to be accessible to everyone:

- ✅ WCAG 2.1 Level AA compliant
- ✅ Full keyboard navigation support
- ✅ Screen reader tested (NVDA, JAWS, VoiceOver)
- ✅ High contrast mode support
- ✅ Reduced motion support
- ✅ Semantic HTML with ARIA labels

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### What This Means

You are free to:
- ✓ Use this software commercially
- ✓ Modify the source code
- ✓ Distribute copies
- ✓ Use privately

Under the condition that:
- ⓘ Include the original license and copyright notice

---

## Support

- 📧 **Email**: support@aniltv06.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/aniltv06/passportphotosheet/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/aniltv06/passportphotosheet/discussions)

---

## Roadmap

Future enhancements planned:

- [ ] Support for additional photo sizes (35mm×45mm, 35mm×40mm)
- [ ] Background color selection for visa photos
- [ ] Batch processing for multiple photos
- [ ] Basic image editing tools (crop, rotate, brightness)
- [ ] Country-specific photo templates
- [ ] Print optimization for specific printers
- [ ] Desktop application versions

---

## Acknowledgments

- **Design Inspiration**: Apple's design language
- **Font Stack**: System UI fonts for native feel
- **Icons**: System emoji fonts

---

## FAQ

**Q: Is this really free?**
A: Yes! 100% free, no hidden costs, no watermarks, no premium version.

**Q: Do my photos get uploaded to a server?**
A: No! Everything happens in your browser. Your photos never leave your device.

**Q: Can I use this for commercial purposes?**
A: Yes, under the MIT License. You can use, modify, and distribute this software freely.

**Q: Will my printed photos be accepted for passports?**
A: This tool arranges photos on a sheet. You must ensure your original photo meets official passport photo requirements for your country.

**Q: What photo services can I use?**
A: Any photo printing service that accepts digital uploads (online services, pharmacy photo labs, professional print shops).

---

<div align="center">

**Made with ❤️ by [Anil Kumar Thatha Venkatachalapathy](https://github.com/aniltv06)**

⭐ **Star this repo if you find it useful!**

[Live Demo](https://aniltv06.github.io/passportphotosheet/) • [Report Bug](https://github.com/aniltv06/passportphotosheet/issues) • [Request Feature](https://github.com/aniltv06/passportphotosheet/issues)

</div>
