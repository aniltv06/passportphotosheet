import { useRef, useState, useEffect } from 'react';
import { Upload, ZoomIn, RotateCw, Palette, Download, Lightbulb, ImagePlus, Sun, Contrast, RefreshCw, Keyboard, Move, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { motion, AnimatePresence } from 'motion/react';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';
import { Badge } from './ui/badge';
import { GlassCard } from './GlassCard';

interface PhotoEditorProps {
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
}

export function PhotoEditor({
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
}: PhotoEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [showTips, setShowTips] = useState(true);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

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
        case '?':
          setShowKeyboardHelp(true);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [uploadedImage]);

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
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
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
    { value: 'original', label: 'Original', color: 'transparent', gradient: 'from-gray-400 to-gray-600' },
    { value: 'white', label: 'White', color: '#ffffff', gradient: 'from-gray-100 to-gray-200' },
    { value: 'lightgray', label: 'Light Gray', color: '#f3f4f6', gradient: 'from-gray-200 to-gray-300' },
    { value: 'lightblue', label: 'Light Blue', color: '#dbeafe', gradient: 'from-blue-200 to-blue-300' },
    { value: 'cream', label: 'Cream', color: '#fef3c7', gradient: 'from-amber-100 to-amber-200' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Panel - Controls */}
      <div className="lg:col-span-1 space-y-4">
        {/* Keyboard Shortcuts Help Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={() => setShowKeyboardHelp(true)}
            className="w-full h-14 backdrop-blur-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-2 border-white/30 hover:border-white/50 text-white rounded-2xl transition-all duration-300 shadow-xl hover:shadow-indigo-500/50"
          >
            <Keyboard className="w-5 h-5 mr-2" />
            Keyboard Shortcuts
            <Badge variant="secondary" className="ml-auto bg-white/20 text-white border-white/30">?</Badge>
          </Button>
        </motion.div>

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
                    Pro Tips
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                  </h3>
                  <ul className="text-sm text-white/90 space-y-2 leading-relaxed">
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span> Face fills 70-80% of frame
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span> Look directly at camera
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span> Neutral expression
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span> Plain background
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span> Good lighting
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
              <h2 className="text-white">Upload Photo</h2>
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
                      {uploadedImage ? 'Change Photo' : 'Choose Photo'}
                    </span>
                    <span className="text-xs text-white/60">JPG, PNG up to 10MB</span>
                  </div>
                </div>
              </Button>
            </motion.div>

            {uploadedImage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2 mt-4"
              >
                <Button
                  onClick={handleDownloadSingle}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  onClick={handleReset}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </motion.div>
            )}
          </div>
        </GlassCard>

        {/* Passport Size */}
        <GlassCard delay={0.15}>
          <div className="p-6">
            <h2 className="text-white mb-4 flex items-center gap-2">
              📏 Passport Size
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
              <h2 className="text-white">Background</h2>
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

        {/* Position Control */}
        <GlassCard delay={0.25}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Move className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-white">Position</h2>
              <Badge className="ml-auto bg-white/20 text-white border-white/30 text-xs">←↑↓→</Badge>
            </div>
            <p className="text-sm text-white/70 mb-4">
              Drag photo or use arrow keys
            </p>
            <Button
              onClick={() => { setPanX(0); setPanY(0); }}
              className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl"
            >
              Center Photo
            </Button>
          </div>
        </GlassCard>

        {/* Zoom Control */}
        <GlassCard delay={0.3}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <ZoomIn className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-white">Zoom</h2>
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
        <GlassCard delay={0.35}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <RotateCw className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-white">Rotation</h2>
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
        <GlassCard delay={0.4}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sun className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-white">Brightness</h2>
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
              <span className="text-white/60">Dark</span>
              <span className="text-white font-semibold">{brightness}%</span>
              <span className="text-white/60">Bright</span>
            </div>
          </div>
        </GlassCard>

        {/* Contrast Control */}
        <GlassCard delay={0.45}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <Contrast className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-white">Contrast</h2>
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
              <span className="text-white/60">Low</span>
              <span className="text-white font-semibold">{contrast}%</span>
              <span className="text-white/60">High</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Right Panel - Preview Canvas */}
      <div className="lg:col-span-2">
        <GlassCard delay={0.5}>
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white flex items-center gap-2">
                <span className="text-2xl">👁️</span>
                Photo Preview
              </h2>
              {uploadedImage && (
                <Badge className="gap-2 bg-white/20 text-white border-white/30">
                  <Move className="w-3 h-3" />
                  Drag to reposition
                </Badge>
              )}
            </div>
            
            {/* Preview Canvas */}
            <div className="flex items-center justify-center bg-gradient-to-br from-white/5 to-white/10 rounded-3xl p-12 min-h-[600px] relative overflow-hidden border border-white/20">
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
                          filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                        }}
                        draggable={false}
                      />
                    </div>
                    
                    {/* Guideline Overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        {/* Head guideline */}
                        <div className="absolute top-[15%] left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                        <div className="absolute top-[15%] left-0 right-0 text-center -translate-y-8">
                          <span className="inline-block bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-xs px-4 py-1.5 rounded-full shadow-xl font-semibold">
                            Top of head
                          </span>
                        </div>
                        
                        {/* Eye level */}
                        <div className="absolute top-[35%] left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
                        
                        {/* Chin guideline */}
                        <div className="absolute top-[60%] left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                        <div className="absolute top-[60%] left-0 right-0 text-center translate-y-8">
                          <span className="inline-block bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-xs px-4 py-1.5 rounded-full shadow-xl font-semibold">
                            Chin line
                          </span>
                        </div>
                        
                        {/* Center line */}
                        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent" />
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
                  <p className="text-xl mb-2 text-white">Upload a photo to get started</p>
                  <p className="text-sm text-white/50">Supported: JPG, PNG</p>
                </motion.div>
              )}
            </div>

            {/* Next Button */}
            <motion.div 
              className="flex justify-end mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
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
                  Next Step
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
    </div>
  );
}
