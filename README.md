# 📸 Passport Photo Maker - Free Online Editor

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![React](https://img.shields.io/badge/react-18.3.1-61dafb.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.6.2-3178c6.svg)

> Create professional passport photos online for free. Edit, resize, and print passport photos for US, India, and international standards.

🔗 **[Live Demo](https://passportphotomaker.com)** | 📖 **[Documentation](#features)** | 🐛 **[Report Bug](https://github.com/aniltv06/passportphotosheet/issues)**

---

## ✨ Features

### 🎨 **Photo Editing**
- **Smart Cropping & Positioning** - Drag to reposition, mouse wheel to zoom (5% increments)
- **Professional Adjustments** - Brightness, contrast, saturation, and rotation controls
- **Background Customization** - White, light gray, light blue, cream, or keep original
- **Real-time Preview** - See changes instantly with face guide overlays
- **HEIC/HEIF Support** - Automatically converts iPhone photos to JPEG

### 📏 **Multiple Photo Standards**
Support for international passport and ID photo sizes:

| Standard | Size | Use Case |
|----------|------|----------|
| 🇺🇸 US Passport | 2×2" | US Passport, Visa |
| 🇮🇳 India Passport | 2×2" (51×51mm) | Indian Passport |
| 🇮🇳 India Visa | 2×2" (51×51mm) | Indian Visa |
| 🌍 European Standard | 35×45mm | Schengen Visa |
| 🎓 Philippines DFA | 4.5×3.5cm | Philippines Passport |
| 🇨🇳 China Visa | 33×48mm | China Visa |
| 📋 Custom | 2.1×2.7" | Aadhaar, PAN, etc. |

### 🖨️ **Print Optimization**
- **Intelligent Paper Sizing** - Automatic layout optimization for maximum photos per sheet
- **Multiple Paper Formats** - 3.5×5", 4×6", 5×7", 6×8", 8×10"
- **High-Quality Output** - 300 DPI professional print quality
- **Custom Borders** - Add borders with adjustable thickness (1-10px) and color
- **Cutting Guides** - Optional guides for precise cutting
- **Efficient Layouts** - Up to 20 photos on 8×10" paper for 2×2" size

### 📱 **Advanced Features**
- **QR Code Generator** - Create vCards with embedded compressed photos (80×80px thumbnails)
- **Session History** - Save and resume editing sessions
- **Preset Manager** - Save favorite editing settings
- **Before/After Comparison** - Visual comparison slider
- **Camera Capture** - Take photos directly from webcam
- **Keyboard Shortcuts** - Fast editing with keyboard controls

### ⚡ **Performance & UX**
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Dark Mode Interface** - Professional checkerboard preview background
- **Progressive Web App** - Install as desktop/mobile app
- **Offline Capable** - Works without internet after first load
- **Zero Server Upload** - All processing happens in your browser for privacy

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone https://github.com/aniltv06/passportphotosheet.git

# Navigate to project directory
cd passportphotosheet

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:3000`

---

## 🎯 How to Use

### 1. **Upload Photo**
- Click "Choose Photo" or drag & drop
- Or use "Try Demo Photo" to test features
- Or use "Capture Photo" to take a photo from webcam
- Supports: JPG, PNG, HEIC, HEIF (up to 10MB)

### 2. **Edit Photo**
- **Select Size**: Choose passport photo standard
- **Adjust Position**: Drag photo or use arrow keys (←↑↓→)
- **Zoom**: Use slider, +/- keys, or mouse wheel
- **Rotate**: Use slider or [ ] keys
- **Enhance**: Adjust brightness, contrast, saturation
- **Background**: Choose white, gray, blue, cream, or original
- **Grid Guide**: Use face guide for perfect positioning

### 3. **Generate Sheet**
- Click "Next Step" to proceed to print layout
- Select paper size (automatically recommends best option)
- Choose quality: Professional (300 DPI) or Standard (200 DPI)
- Enable cutting guides and photo borders if needed
- Preview the complete sheet layout

### 4. **Download & Print**
- Click "Download Sheet" for print-ready PNG
- Download individual edited photo if needed
- Print on photo paper for best results
- Use cutting guides to trim photos precisely

---

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Zoom In | `+` or `=` |
| Zoom Out | `-` |
| Rotate Left | `[` |
| Rotate Right | `]` |
| Move Up | `↑` |
| Move Down | `↓` |
| Move Left | `←` |
| Move Right | `→` |
| Toggle Grid | `g` |
| Reset All | `Ctrl/Cmd + R` |
| Help | `?` |

---

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1** - UI framework
- **TypeScript 5.6.2** - Type safety
- **Vite 6.3.5** - Build tool & dev server
- **Tailwind CSS 3.4.17** - Utility-first styling
- **Framer Motion 11.15.0** - Smooth animations

### Libraries
- **QRCode.js** - QR code generation
- **heic2any** - HEIC/HEIF conversion
- **Lucide React** - Icon library
- **Radix UI** - Accessible components

### Canvas & Image Processing
- **HTML5 Canvas API** - Image rendering
- **Custom algorithms** - Intelligent layout calculation
- **Client-side processing** - No server uploads needed

---

## 📐 Paper Size Optimization

The app intelligently calculates optimal layouts based on your selected photo size:

### 2×2" Photos on Different Papers

| Paper Size | Layout | Total Photos | Efficiency |
|------------|--------|--------------|------------|
| 3.5×5" | 1×1 (centered) | 1 photo | Special layout |
| 4×6" | 2×3 | 6 photos | ~85% |
| 4×6" (Alt) | 2×2 | 4 photos | ~90% |
| 5×7" | 2×3 | 6 photos | ~75% |
| 6×8" | 3×4 | **12 photos** | ~92% |
| 8×10" | 4×5 | **20 photos** | ~100% ✨ |

*Perfect fit layouts maximize paper usage with zero gaps!*

---

## 🔒 Privacy & Security

- ✅ **100% Client-Side** - All photo processing happens in your browser
- ✅ **No Server Upload** - Your photos never leave your device
- ✅ **No Tracking** - No analytics, no cookies, no data collection
- ✅ **Open Source** - Transparent code you can audit
- ✅ **Offline Ready** - Works without internet after first load

---

## 🌍 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |
| Opera | 76+ | ✅ Fully Supported |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

```bash
# Fork the repo and clone your fork
git clone https://github.com/YOUR_USERNAME/passportphotosheet.git

# Create a feature branch
git checkout -b feature/amazing-feature

# Make your changes and commit
git commit -m "Add amazing feature"

# Push to your fork
git push origin feature/amazing-feature

# Open a Pull Request
```

### Code Style
- Follow existing TypeScript patterns
- Use Prettier for formatting
- Write meaningful commit messages
- Add comments for complex logic

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Original design from [Figma Wireframe](https://www.figma.com/design/QLKYpL8rzbW2VnZG2Etue9/Passport-Photo-Maker-Wireframe)
- Face guide overlay inspired by professional photography standards
- Layout calculations based on US State Department and Indian MEA specifications
- Icons from [Lucide Icons](https://lucide.dev/)
- UI components from [Radix UI](https://www.radix-ui.com/)

---

## 📧 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/aniltv06/passportphotosheet/issues)
- **Discussions**: [GitHub Discussions](https://github.com/aniltv06/passportphotosheet/discussions)

---

## 🎯 Roadmap

- [ ] Multi-language support (Spanish, French, Hindi, Chinese)
- [ ] Batch photo processing
- [ ] AI-powered background removal
- [ ] Face detection and auto-positioning
- [ ] Cloud save/sync (optional)
- [ ] Mobile app (React Native)
- [ ] PDF export with multiple layouts
- [ ] Integration with online printing services

---

## ⭐ Star History

If you find this project useful, please consider giving it a star!

[![Star History Chart](https://api.star-history.com/svg?repos=aniltv06/passportphotosheet&type=Date)](https://star-history.com/#aniltv06/passportphotosheet&Date)

---

<div align="center">

Made with ❤️ by developers, for everyone who needs passport photos

**[⬆ Back to Top](#-passport-photo-maker---free-online-editor)**

</div>