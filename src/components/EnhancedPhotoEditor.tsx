import { useRef, useState, useEffect } from 'react';
import { Upload, ZoomIn, RotateCw, Palette, Download, Lightbulb, ImagePlus, Sun, Contrast, RefreshCw, Keyboard, Move, Sparkles, Grid3x3, Eye, EyeOff, Wand2, QrCode, History as HistoryIcon, Camera as CameraIcon, SplitSquareVertical } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { motion, AnimatePresence } from 'motion/react';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';
import { Badge } from './ui/badge';
import { GlassCard } from './GlassCard';
import { useLanguage } from '../contexts/LanguageContext';
import { Switch } from './ui/switch';
import { QRCodeGenerator } from './QRCodeGenerator';
import { HistoryPanel } from './HistoryPanel';
import { PresetsPanel } from './PresetsPanel';
import { BeforeAfterComparison } from './BeforeAfterComparison';
import { CameraCapture } from './CameraCapture';
import { PhotoSession } from '../utils/history';
import { PhotoPreset } from '../utils/presets';

interface EnhancedPhotoEditorProps {
  uploadedImage: string | null;
  setUploadedImage: (image: string | null) => void;
  passportSize: string;
  setPassportSize: (size: string) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  rotation: number;
  setRotation: (rotation: number) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  brightness: number;
  setBrightness: (brightness: number) => void;
  contrast: number;
  setContrast: (contrast: number) => void;
  panX: number;
  setPanX: (panX: number) => void;
  panY: number;
  setPanY: (panY: number) => void;
  onNext: () => void;
  onLoadSession?: (session: PhotoSession) => void;
  onApplyPreset?: (preset: PhotoPreset) => void;
}

type GridType = 'none' | 'thirds' | 'golden' | 'center';

export function EnhancedPhotoEditor({
  uploadedImage,
  setUploadedImage,
  passportSize,
  setPassportSize,
  zoom,
  setZoom,
  rotation,
  setRotation,
  backgroundColor,
  setBackgroundColor,
  brightness,
  setBrightness,
  contrast,
  setContrast,
  panX,
  setPanX,
  panY,
  setPanY,
  onNext,
  onLoadSession,
  onApplyPreset,
}: EnhancedPhotoEditorProps) {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [showTips, setShowTips] = useState(true);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [gridType, setGridType] = useState<GridType>('thirds');
  const [showGrid, setShowGrid] = useState(true);
  const [saturation, setSaturation] = useState(100);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!uploadedImage) return;

      if (['+', '-', '=', '[', ']', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case '+':
        case '=':
          setZoom((prev) => Math.min(200, prev + 5));
          break;
        case '-':
          setZoom((prev) => Math.max(50, prev - 5));
          break;
        case '[':
          setRotation((prev) => prev - 5);
          break;
        case ']':
          setRotation((prev) => prev + 5);
          break;
        case 'ArrowUp':
          setPanY((prev) => prev - 10);
          break;
        case 'ArrowDown':
          setPanY((prev) => prev + 10);
          break;
        case 'ArrowLeft':
          setPanX((prev) => prev - 10);
          break;
        case 'ArrowRight':
          setPanX((prev) => prev + 10);
          break;
        case 'r':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            handleReset();
          }
          break;
        case 'g':
          setShowGrid(!showGrid);
          break;
        case '?':
          setShowKeyboardHelp(true);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [uploadedImage, showGrid]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!uploadedImage) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanX(e.clientX - dragStart.x);
    setPanY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setOriginalImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleLoadDemoPhoto = () => {
    // Create an anime-style SVG demo photo with white background
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500">
        <defs>
          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#4a5568;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#2d3748;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#ffe4d6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#ffd4c1;stop-opacity:1" />
          </linearGradient>
          <radialGradient id="eyeShine">
            <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#60a5fa;stop-opacity:1" />
          </radialGradient>
        </defs>
        
        <!-- White Background -->
        <rect width="400" height="500" fill="#ffffff"/>
        
        <!-- Neck -->
        <rect x="150" y="380" width="100" height="120" fill="url(#skinGrad)" rx="20"/>
        
        <!-- Shirt/Collar -->
        <path d="M 130 450 L 150 420 L 180 410 L 200 405 L 220 410 L 250 420 L 270 450 L 270 500 L 130 500 Z" fill="#3b82f6"/>
        <path d="M 180 410 L 200 430 L 220 410 Z" fill="#ffffff"/>
        
        <!-- Head Base -->
        <ellipse cx="200" cy="250" rx="85" ry="100" fill="url(#skinGrad)"/>
        
        <!-- Ears -->
        <ellipse cx="135" cy="250" rx="15" ry="25" fill="#ffd4c1"/>
        <ellipse cx="140" cy="250" rx="8" ry="15" fill="#ffb8a0"/>
        <ellipse cx="265" cy="250" rx="15" ry="25" fill="#ffd4c1"/>
        <ellipse cx="260" cy="250" rx="8" ry="15" fill="#ffb8a0"/>
        
        <!-- Hair Back -->
        <ellipse cx="200" cy="170" rx="90" ry="80" fill="url(#hairGrad)"/>
        
        <!-- Face Details - Blush -->
        <ellipse cx="155" cy="270" rx="20" ry="12" fill="#ffb3c1" opacity="0.4"/>
        <ellipse cx="245" cy="270" rx="20" ry="12" fill="#ffb3c1" opacity="0.4"/>
        
        <!-- Eyes (Anime style - large and expressive) -->
        <!-- Left Eye -->
        <ellipse cx="170" cy="245" rx="18" ry="24" fill="#1e293b"/>
        <ellipse cx="170" cy="245" rx="14" ry="20" fill="url(#eyeShine)"/>
        <circle cx="172" cy="242" r="8" fill="#1e293b"/>
        <circle cx="175" cy="238" r="5" fill="#ffffff"/>
        <circle cx="168" cy="248" r="3" fill="#ffffff" opacity="0.8"/>
        <path d="M 152 230 Q 162 225 175 227" stroke="#2d3748" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M 152 232 Q 162 228 175 230" stroke="#2d3748" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.3"/>
        
        <!-- Right Eye -->
        <ellipse cx="230" cy="245" rx="18" ry="24" fill="#1e293b"/>
        <ellipse cx="230" cy="245" rx="14" ry="20" fill="url(#eyeShine)"/>
        <circle cx="228" cy="242" r="8" fill="#1e293b"/>
        <circle cx="225" cy="238" r="5" fill="#ffffff"/>
        <circle cx="232" cy="248" r="3" fill="#ffffff" opacity="0.8"/>
        <path d="M 225 227 Q 238 225 248 230" stroke="#2d3748" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M 225 230 Q 238 228 248 232" stroke="#2d3748" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.3"/>
        
        <!-- Eyelashes -->
        <path d="M 155 235 Q 152 228 150 225" stroke="#1e293b" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M 160 233 Q 158 225 157 220" stroke="#1e293b" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M 245 235 Q 248 228 250 225" stroke="#1e293b" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M 240 233 Q 242 225 243 220" stroke="#1e293b" stroke-width="2" fill="none" stroke-linecap="round"/>
        
        <!-- Nose (simple anime style) -->
        <path d="M 200 260 L 197 275" stroke="#ffb8a0" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/>
        
        <!-- Mouth (cute anime smile) -->
        <path d="M 180 295 Q 200 305 220 295" stroke="#ff6b9d" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M 185 296 Q 200 302 215 296" fill="#ff6b9d" opacity="0.2"/>
        
        <!-- Hair Front Strands -->
        <path d="M 115 180 Q 110 200 115 240 L 125 245 Q 120 210 125 180 Z" fill="url(#hairGrad)"/>
        <path d="M 285 180 Q 290 200 285 240 L 275 245 Q 280 210 275 180 Z" fill="url(#hairGrad)"/>
        <path d="M 150 150 Q 145 180 150 200 L 160 200 Q 157 170 160 150 Z" fill="url(#hairGrad)"/>
        <path d="M 250 150 Q 255 180 250 200 L 240 200 Q 243 170 240 150 Z" fill="url(#hairGrad)"/>
        
        <!-- Hair Bangs -->
        <ellipse cx="170" cy="180" rx="25" ry="40" fill="url(#hairGrad)"/>
        <ellipse cx="200" cy="175" rx="25" ry="45" fill="url(#hairGrad)"/>
        <ellipse cx="230" cy="180" rx="25" ry="40" fill="url(#hairGrad)"/>
        
        <!-- Hair highlights -->
        <ellipse cx="185" cy="160" rx="15" ry="25" fill="#718096" opacity="0.3"/>
        <ellipse cx="215" cy="160" rx="12" ry="20" fill="#718096" opacity="0.3"/>
        
        <!-- Neck shadow -->
        <ellipse cx="200" cy="350" rx="40" ry="8" fill="#1e293b" opacity="0.05"/>
      </svg>
    `;
    
    // Convert SVG to data URL
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setUploadedImage(dataUrl);
      setOriginalImage(dataUrl);
    };
    reader.readAsDataURL(blob);
  };

  const handleDownloadSingle = () => {
    if (!uploadedImage) return;
    const link = document.createElement('a');
    link.href = uploadedImage;
    link.download = 'passport-photo.png';
    link.click();
  };

  const handleReset = () => {
    setZoom(100);
    setRotation(0);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setPanX(0);
    setPanY(0);
  };

  const passportSizes = [
    { value: '2x2', label: '2×2 inches (US)', dimensions: '51×51mm', flag: '🇺🇸' },
    { value: '35x45', label: '35×45 mm (EU)', dimensions: '35×45mm', flag: '🇪🇺' },
    { value: '33x48', label: '33×48 mm (India)', dimensions: '33×48mm', flag: '🇮🇳' },
    { value: '35x35', label: '35×35 mm (ID)', dimensions: '35×35mm', flag: '🆔' },
    { value: '51x51', label: '51×51 mm (China)', dimensions: '51×51mm', flag: '🇨🇳' },
    { value: '45x35', label: '45×35 mm (Japan)', dimensions: '45×35mm', flag: '🇯🇵' },
  ];

  const backgroundColors = [
    { value: 'original', label: t.original, color: 'transparent', gradient: 'from-gray-400 to-gray-600' },
    { value: 'white', label: t.white, color: '#ffffff', gradient: 'from-gray-100 to-gray-200' },
    { value: 'lightgray', label: t.lightGray, color: '#f3f4f6', gradient: 'from-gray-200 to-gray-300' },
    { value: 'lightblue', label: t.lightBlue, color: '#dbeafe', gradient: 'from-blue-200 to-blue-300' },
    { value: 'cream', label: t.cream, color: '#fef3c7', gradient: 'from-amber-100 to-amber-200' },
  ];

  const renderGrid = () => {
    if (!showGrid || gridType === 'none') return null;

    const gridLines = {
      thirds: (
        <>
          {/* Vertical lines */}
          <div className="absolute left-1/3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-cyan-400/60 to-transparent" />
          <div className="absolute right-1/3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-cyan-400/60 to-transparent" />
          {/* Horizontal lines */}
          <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
          <div className="absolute bottom-1/3 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
        </>
      ),
      golden: (
        <>
          {/* Golden ratio: 0.618 */}
          <div className="absolute left-[38.2%] top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-amber-400/60 to-transparent" />
          <div className="absolute right-[38.2%] top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-amber-400/60 to-transparent" />
          <div className="absolute top-[38.2%] left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
          <div className="absolute bottom-[38.2%] left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
        </>
      ),
      center: (
        <>
          {/* Center crosshair */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-purple-400/60 to-transparent" />
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-400/60 to-transparent" />
          {/* Face guidelines */}
          <div className="absolute top-[15%] left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
          <div className="absolute top-[60%] left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        </>
      ),
    };

    return gridLines[gridType];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Panel - Scrollable Controls - Takes 5 columns */}
      <div className="lg:col-span-5 space-y-4 lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto lg:pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => setShowKeyboardHelp(true)}
              className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-2 border-white/30 hover:border-white/50 text-white rounded-xl"
            >
              <Keyboard className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">{t.keyboardShortcuts}</span>
              <Badge variant="secondary" className="ml-2 bg-white/20 text-white border-white/30">?</Badge>
            </Button>
          </motion.div>

          {uploadedImage && (
            <>
              <Button
                onClick={handleDownloadSingle}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl"
              >
                <Download className="w-4 h-4 mr-2" />
                {t.download}
              </Button>
              <Button
                onClick={handleReset}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {t.reset}
              </Button>
            </>
          )}
        </div>

        {/* Tips Card */}
        <AnimatePresence>
          {showTips && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-3xl border border-white/30 p-6 relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl" />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowTips(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-colors"
              >
                ✕
              </motion.button>
              <div className="flex items-start gap-4 relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white mb-3 flex items-center gap-2">
                    {t.proTips}
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                  </h3>
                  <ul className="text-sm text-white/90 space-y-2 leading-relaxed">
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span> {t.tip1}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span> {t.tip2}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span> {t.tip3}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span> {t.tip4}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span> {t.tip5}
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Area */}
        <GlassCard delay={0.1}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <ImagePlus className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-white">{t.uploadPhoto}</h2>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleUploadClick}
                className="w-full h-32 border-2 border-dashed border-white/30 hover:border-white/60 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-2xl transition-all group text-white"
              >
                <div className="flex flex-col items-center gap-3">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl"
                  >
                    <Upload className="w-7 h-7 text-white" />
                  </motion.div>
                  <div>
                    <span className="text-white font-semibold block">
                      {uploadedImage ? t.changePhoto : t.choosePhoto}
                    </span>
                    <span className="text-xs text-white/60">{t.fileSize}</span>
                  </div>
                </div>
              </Button>
            </motion.div>
            
            {/* Demo Photo Button */}
            {!uploadedImage && (
              <div className="mt-4 relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <span className="text-xs text-white/50 px-2">or</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleLoadDemoPhoto}
                    className="w-full h-16 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border-2 border-emerald-400/30 hover:border-emerald-400/60 text-white rounded-xl backdrop-blur-sm transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg"
                      >
                        <Sparkles className="w-5 h-5 text-white" />
                      </motion.div>
                      <div className="text-left">
                        <span className="text-white font-semibold block">Try Demo Photo</span>
                        <span className="text-xs text-white/60">See how it works instantly</span>
                      </div>
                    </div>
                  </Button>
                </motion.div>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Passport Size */}
        <GlassCard delay={0.15}>
          <div className="p-6">
            <h2 className="text-white mb-4 flex items-center gap-2">
              📏 {t.passportSize}
            </h2>
            <Select value={passportSize} onValueChange={setPassportSize}>
              <SelectTrigger className="w-full h-14 bg-white/10 border-white/30 text-white rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-white/20">
                {passportSizes.map((size) => (
                  <SelectItem key={size.value} value={size.value} className="text-white hover:bg-white/10">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{size.flag}</span>
                      <div className="flex flex-col">
                        <span>{size.label}</span>
                        <span className="text-xs text-white/60">{size.dimensions}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </GlassCard>

        {/* Background Color */}
        <GlassCard delay={0.2}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-white">{t.background}</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {backgroundColors.map((bg) => (
                <motion.button
                  key={bg.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setBackgroundColor(bg.value)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    backgroundColor === bg.value
                      ? 'border-white bg-white/20 shadow-xl'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className={`w-full h-12 rounded-lg bg-gradient-to-br ${bg.gradient} mb-2 shadow-lg`} />
                  <span className="text-xs text-white/90 font-medium">{bg.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Grid Options */}
        <GlassCard delay={0.25}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Grid3x3 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-white">Grid Overlay</h2>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={showGrid}
                  onCheckedChange={setShowGrid}
                  className="data-[state=checked]:bg-indigo-500"
                />
                {showGrid ? (
                  <Eye className="w-4 h-4 text-green-400" />
                ) : (
                  <EyeOff className="w-4 h-4 text-white/40" />
                )}
              </div>
            </div>
            {showGrid && (
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'thirds', label: 'Rule of Thirds', icon: '⊞' },
                  { value: 'golden', label: 'Golden Ratio', icon: 'φ' },
                  { value: 'center', label: 'Center Guide', icon: '✛' },
                  { value: 'none', label: 'No Grid', icon: '○' },
                ].map((grid) => (
                  <motion.button
                    key={grid.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setGridType(grid.value as GridType)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      gridType === grid.value
                        ? 'border-cyan-400 bg-cyan-500/20 shadow-xl'
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-2xl mb-1">{grid.icon}</div>
                    <span className="text-xs text-white/90">{grid.label}</span>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </GlassCard>

        {/* Position Control */}
        <GlassCard delay={0.3}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Move className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-white">{t.position}</h2>
              <Badge className="ml-auto bg-white/20 text-white border-white/30 text-xs">←↑↓→</Badge>
            </div>
            <p className="text-sm text-white/70 mb-4">
              {t.dragToReposition}
            </p>
            <Button
              onClick={() => { setPanX(0); setPanY(0); }}
              className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl"
            >
              {t.centerPhoto}
            </Button>
          </div>
        </GlassCard>

        {/* Zoom Control */}
        <GlassCard delay={0.35}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <ZoomIn className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-white">{t.zoom}</h2>
              </div>
              <Badge className="bg-white/20 text-white border-white/30 text-xs">+/−</Badge>
            </div>
            <Slider
              value={[zoom]}
              onValueChange={(value) => setZoom(value[0])}
              min={50}
              max={200}
              step={1}
              className="mb-3"
            />
            <div className="flex justify-between text-sm">
              <span className="text-white/60">50%</span>
              <span className="text-white font-semibold">{zoom}%</span>
              <span className="text-white/60">200%</span>
            </div>
          </div>
        </GlassCard>

        {/* Rotation Control */}
        <GlassCard delay={0.4}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <RotateCw className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-white">{t.rotation}</h2>
              </div>
              <Badge className="bg-white/20 text-white border-white/30 text-xs">[ ]</Badge>
            </div>
            <Slider
              value={[rotation]}
              onValueChange={(value) => setRotation(value[0])}
              min={-180}
              max={180}
              step={1}
              className="mb-3"
            />
            <div className="flex justify-between text-sm">
              <span className="text-white/60">-180°</span>
              <span className="text-white font-semibold">{rotation}°</span>
              <span className="text-white/60">180°</span>
            </div>
          </div>
        </GlassCard>

        {/* Brightness Control */}
        <GlassCard delay={0.45}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sun className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-white">{t.brightness}</h2>
            </div>
            <Slider
              value={[brightness]}
              onValueChange={(value) => setBrightness(value[0])}
              min={50}
              max={150}
              step={1}
              className="mb-3"
            />
            <div className="flex justify-between text-sm">
              <span className="text-white/60">{t.dark}</span>
              <span className="text-white font-semibold">{brightness}%</span>
              <span className="text-white/60">{t.bright}</span>
            </div>
          </div>
        </GlassCard>

        {/* Contrast Control */}
        <GlassCard delay={0.5}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <Contrast className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-white">{t.contrast}</h2>
            </div>
            <Slider
              value={[contrast]}
              onValueChange={(value) => setContrast(value[0])}
              min={50}
              max={150}
              step={1}
              className="mb-3"
            />
            <div className="flex justify-between text-sm">
              <span className="text-white/60">{t.low}</span>
              <span className="text-white font-semibold">{contrast}%</span>
              <span className="text-white/60">{t.high}</span>
            </div>
          </div>
        </GlassCard>

        {/* Saturation Control */}
        <GlassCard delay={0.55}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <Wand2 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-white">Saturation</h2>
            </div>
            <Slider
              value={[saturation]}
              onValueChange={(value) => setSaturation(value[0])}
              min={0}
              max={200}
              step={5}
              className="mb-3"
            />
            <div className="flex justify-between text-sm">
              <span className="text-white/60">B&W</span>
              <span className="text-white font-semibold">{saturation}%</span>
              <span className="text-white/60">Vibrant</span>
            </div>
          </div>
        </GlassCard>

        {/* QR Code Generator */}
        <GlassCard delay={0.6}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <QrCode className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-white">QR Code</h2>
            </div>
            <Button
              onClick={() => setShowQRCode(true)}
              className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl"
            >
              Generate QR Code
            </Button>
          </div>
        </GlassCard>

        {/* History Panel */}
        <GlassCard delay={0.65}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl flex items-center justify-center shadow-lg">
                <HistoryIcon className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-white">History</h2>
            </div>
            <Button
              onClick={() => setShowHistory(true)}
              className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl"
            >
              View History
            </Button>
          </div>
        </GlassCard>

        {/* Presets Panel */}
        <GlassCard delay={0.7}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                <SplitSquareVertical className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-white">Presets</h2>
            </div>
            <Button
              onClick={() => setShowPresets(true)}
              className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl"
            >
              Apply Preset
            </Button>
          </div>
        </GlassCard>

        {/* Before-After Comparison */}
        <GlassCard delay={0.75}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <CameraIcon className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-white">Comparison</h2>
            </div>
            <Button
              onClick={() => setShowComparison(true)}
              className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl"
            >
              Compare Before & After
            </Button>
          </div>
        </GlassCard>

        {/* Camera Capture */}
        <GlassCard delay={0.8}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <CameraIcon className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-white">Camera</h2>
            </div>
            <Button
              onClick={() => setShowCamera(true)}
              className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl"
            >
              Capture Photo
            </Button>
          </div>
        </GlassCard>
      </div>

      {/* Right Panel - Sticky Preview - Takes 7 columns */}
      <div className="lg:col-span-7 lg:sticky lg:top-32 lg:self-start">
        <GlassCard delay={0.6}>
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white flex items-center gap-2 text-xl">
                <span className="text-2xl">👁️</span>
                {t.photoPreview}
              </h2>
              {uploadedImage && (
                <Badge className="gap-2 bg-white/20 text-white border-white/30">
                  <Move className="w-3 h-3" />
                  {t.dragToReposition}
                </Badge>
              )}
            </div>
            
            {/* Preview Canvas */}
            <div className="flex items-center justify-center bg-gradient-to-br from-white/5 to-white/10 rounded-3xl p-8 sm:p-12 min-h-[500px] sm:min-h-[600px] relative overflow-hidden border border-white/20">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-50" />
              
              {uploadedImage ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, type: 'spring' }}
                  className="relative z-10"
                >
                  <div
                    ref={canvasRef}
                    className={`relative rounded-2xl overflow-hidden shadow-2xl ${isDragging ? 'cursor-grabbing scale-105' : 'cursor-grab'} transition-transform`}
                    style={{
                      width: '360px',
                      height: '480px',
                      backgroundColor: backgroundColors.find(bg => bg.value === backgroundColor)?.color || 'white',
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    {/* Photo */}
                    <div className="absolute inset-0 overflow-hidden">
                      <img
                        src={uploadedImage}
                        alt="Preview"
                        className="absolute top-1/2 left-1/2 object-cover pointer-events-none select-none"
                        style={{
                          transform: `translate(calc(-50% + ${panX}px), calc(-50% + ${panY}px)) scale(${zoom / 100}) rotate(${rotation}deg)`,
                          width: '100%',
                          height: '100%',
                          transformOrigin: 'center',
                          mixBlendMode: backgroundColor !== 'original' ? 'multiply' : 'normal',
                          filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
                        }}
                        draggable={false}
                      />
                    </div>
                    
                    {/* Grid Overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        {renderGrid()}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-white/60 relative z-10"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                      <Upload className="w-16 h-16 text-white/40" />
                    </div>
                  </motion.div>
                  <p className="text-xl mb-2 text-white">{t.uploadToStart}</p>
                  <p className="text-sm text-white/50">{t.supportedFormats}</p>
                </motion.div>
              )}
            </div>

            {/* Next Button */}
            <motion.div 
              className="flex justify-end mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={onNext}
                  disabled={!uploadedImage}
                  size="lg"
                  className="px-10 py-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-2xl shadow-2xl shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
                >
                  {t.nextStep}
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="ml-2"
                  >
                    →
                  </motion.span>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </GlassCard>
      </div>

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={showKeyboardHelp}
        onClose={() => setShowKeyboardHelp(false)}
      />

      {/* QR Code Generator */}
      <QRCodeGenerator
        isOpen={showQRCode}
        onClose={() => setShowQRCode(false)}
        imageUrl={uploadedImage}
      />

      {/* History Panel */}
      <HistoryPanel
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onLoadSession={onLoadSession}
      />

      {/* Presets Panel */}
      <PresetsPanel
        isOpen={showPresets}
        onClose={() => setShowPresets(false)}
        onApplyPreset={onApplyPreset}
      />

      {/* Before-After Comparison */}
      <BeforeAfterComparison
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
        originalImage={originalImage}
        editedImage={uploadedImage}
      />

      {/* Camera Capture */}
      <CameraCapture
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={setUploadedImage}
      />
    </div>
  );
}