import { useRef, useState, useEffect, lazy, Suspense } from 'react';
import { Upload, ZoomIn, ZoomOut, RotateCw, Palette, Download, Lightbulb, ImagePlus, Sun, Contrast, RefreshCw, Keyboard, Move, Sparkles, Grid3x3, Eye, EyeOff, Wand2, QrCode, History as HistoryIcon, Camera as CameraIcon, SplitSquareVertical } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { motion, AnimatePresence } from 'motion/react';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';
import { Badge } from './ui/badge';
import { GlassCard } from './GlassCard';
import { useLanguage } from '../contexts/LanguageContext';
import { Switch } from './ui/switch';
import { PhotoSession } from '../utils/history';
import { PhotoPreset } from '../utils/presets';
import { PHOTO_SIZE_OPTIONS } from '../utils/layoutConfig';

// Lazy load heavy components for better performance
const QRCodeGenerator = lazy(() => import('./QRCodeGenerator').then(m => ({ default: m.QRCodeGenerator })));
const HistoryPanel = lazy(() => import('./HistoryPanel').then(m => ({ default: m.HistoryPanel })));
const PresetsPanel = lazy(() => import('./PresetsPanel').then(m => ({ default: m.PresetsPanel })));
const BeforeAfterComparison = lazy(() => import('./BeforeAfterComparison').then(m => ({ default: m.BeforeAfterComparison })));
const CameraCapture = lazy(() => import('./CameraCapture').then(m => ({ default: m.CameraCapture })));

// Dynamic import for heic2any (only loaded when needed)
let heic2any: any = null;
const loadHeic2any = async () => {
  if (!heic2any) {
    heic2any = (await import('heic2any')).default;
  }
  return heic2any;
};

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
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [gridType, setGridType] = useState<GridType>('center');
  const [showGrid, setShowGrid] = useState(true);
  const [saturation, setSaturation] = useState(100);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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

  // Mouse wheel zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    if (!uploadedImage) return;

    // Prevent page scroll when zooming
    e.preventDefault();
    e.stopPropagation();

    // Determine zoom direction and amount
    // deltaY < 0 means scroll up (zoom in), > 0 means scroll down (zoom out)
    const zoomDelta = e.deltaY > 0 ? -5 : 5; // 5% per scroll for step-based control

    // Apply zoom with bounds checking
    setZoom((prevZoom) => {
      const newZoom = prevZoom + zoomDelta;
      return Math.max(50, Math.min(200, newZoom));
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await processFile(file);

    // Reset the input so the same file can be selected again
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/') || file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')) {
        await processFile(file);
      } else {
        alert('Please drop an image file (JPG, PNG, HEIC)');
      }
    }
  };

  // Extract file processing logic to reuse for both file input and drag-drop
  const processFile = async (file: File) => {
    setIsUploading(true);

    try {
      // Check if file is HEIC/HEIF format
      const isHEIC = file.type === 'image/heic' ||
                     file.type === 'image/heif' ||
                     file.name.toLowerCase().endsWith('.heic') ||
                     file.name.toLowerCase().endsWith('.heif');

      let processedFile: Blob = file;

      if (isHEIC) {
        // Dynamically load heic2any only when needed
        const heic2anyModule = await loadHeic2any();

        // Convert HEIC to JPEG
        const convertedBlob = await heic2anyModule({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.95
        });

        // heic2any might return an array of blobs, handle both cases
        processedFile = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
      }

      // Read the file (original or converted)
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setOriginalImage(event.target?.result as string);
        setIsUploading(false);
      };
      reader.onerror = () => {
        setIsUploading(false);
        alert('Failed to read image file. Please try again.');
      };
      reader.readAsDataURL(processedFile);
    } catch (error) {
      console.error('Failed to process image:', error);
      alert('Failed to process image. Please try a different file.');
      setIsUploading(false);
    }
  };

  const handleLoadDemoPhoto = async () => {
    // Randomly select one of the 9 demo photos
    const randomIndex = Math.floor(Math.random() * 9) + 1;
    const demoPhotoPath = `/demos/Demo${randomIndex}.png`;

    try {
      // Fetch the demo photo
      const response = await fetch(demoPhotoPath);
      const blob = await response.blob();

      // Convert to data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setUploadedImage(dataUrl);
        setOriginalImage(dataUrl);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error loading demo photo:', error);
    }
  };

  const handleDownloadSingle = () => {
    if (!uploadedImage) return;

    // Get selected photo size dimensions
    const selectedPhotoSize = PHOTO_SIZE_OPTIONS.find(ps => ps.value === passportSize) || PHOTO_SIZE_OPTIONS[0];
    const photoWidthInches = selectedPhotoSize.width;
    const photoHeightInches = selectedPhotoSize.height;

    // Create a canvas to render the edited image at 300 DPI
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size based on selected photo size at 300 DPI
    const dpi = 300;
    const canvasWidth = Math.round(photoWidthInches * dpi);
    const canvasHeight = Math.round(photoHeightInches * dpi);
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Calculate scale factor between preview and download canvas
    // panX and panY are in preview pixel coordinates, need to scale them
    const scaleFactorX = canvasWidth / previewDimensions.width;
    const scaleFactorY = canvasHeight / previewDimensions.height;

    // Fill background color
    const bgColors: Record<string, string> = {
      white: '#ffffff',
      lightgray: '#f3f4f6',
      lightblue: '#dbeafe',
      cream: '#fef3c7',
      original: 'transparent'
    };
    ctx.fillStyle = bgColors[backgroundColor] || '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Load and draw the image with transformations
    const img = new Image();
    img.onload = () => {
      ctx.save();

      // Apply filters
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;

      // Move to center for rotation and zoom
      ctx.translate(canvasWidth / 2, canvasHeight / 2);

      // Apply rotation
      ctx.rotate((rotation * Math.PI) / 180);

      // Apply zoom
      const scale = zoom / 100;

      // Calculate image dimensions to cover the canvas
      const imageAspect = img.width / img.height;
      const canvasAspect = canvasWidth / canvasHeight;
      let drawWidth, drawHeight;

      if (imageAspect > canvasAspect) {
        drawHeight = canvasHeight * scale;
        drawWidth = drawHeight * imageAspect;
      } else {
        drawWidth = canvasWidth * scale;
        drawHeight = drawWidth / imageAspect;
      }

      // Draw image with pan offset
      // Scale panX and panY from preview coordinates to download canvas coordinates
      ctx.drawImage(
        img,
        -drawWidth / 2 + (panX * scaleFactorX),
        -drawHeight / 2 + (panY * scaleFactorY),
        drawWidth,
        drawHeight
      );

      ctx.restore();

      // Download the canvas
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        link.download = `edited-photo-${selectedPhotoSize.value}-${timestamp}.png`;
        link.href = url;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 100);
      }, 'image/png', 0.95);
    };
    img.src = uploadedImage;
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

  const backgroundColors = [
    { value: 'original', label: t.original, color: 'transparent', gradient: 'from-gray-400 to-gray-600' },
    { value: 'white', label: t.white, color: '#ffffff', gradient: 'from-gray-100 to-gray-200' },
    { value: 'lightgray', label: t.lightGray, color: '#f3f4f6', gradient: 'from-gray-200 to-gray-300' },
    { value: 'lightblue', label: t.lightBlue, color: '#dbeafe', gradient: 'from-blue-200 to-blue-300' },
    { value: 'cream', label: t.cream, color: '#fef3c7', gradient: 'from-amber-100 to-amber-200' },
  ];

  // Calculate preview dimensions based on selected passport size
  const getPreviewDimensions = () => {
    const selectedPhotoSize = PHOTO_SIZE_OPTIONS.find(ps => ps.value === passportSize) || PHOTO_SIZE_OPTIONS[0];
    const aspectRatio = selectedPhotoSize.width / selectedPhotoSize.height;

    // Base height for preview
    const baseHeight = 480;
    const width = Math.round(baseHeight * aspectRatio);

    return { width, height: baseHeight };
  };

  const previewDimensions = getPreviewDimensions();

  // Update SVG viewBox based on preview dimensions
  const svgViewBox = `0 0 ${previewDimensions.width} ${previewDimensions.height}`;

  // Calculate face oval position based on aspect ratio
  const getFaceOvalParams = () => {
    const { width, height } = previewDimensions;
    const centerX = width / 2;
    const centerY = height * 0.46; // Slightly above center for face positioning

    // Face oval should always be taller than wide (portrait oval)
    // Base the dimensions on height to maintain proper face proportions
    const radiusX = height * 0.18; // Width of oval (narrower)
    const radiusY = height * 0.23; // Height of oval (taller)

    return { centerX, centerY, radiusX, radiusY, width, height };
  };

  const faceOvalParams = getFaceOvalParams();

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

          {/* Face Oval Guide */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={svgViewBox}>
            <defs>
              <linearGradient id="faceOvalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="rangeZoneGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.15" />
                <stop offset="50%" stopColor="#34d399" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#34d399" stopOpacity="0.15" />
              </linearGradient>
            </defs>

            {/* Main face oval - positioned for passport photo standards */}
            <ellipse
              cx={faceOvalParams.centerX}
              cy={faceOvalParams.centerY}
              rx={faceOvalParams.radiusX}
              ry={faceOvalParams.radiusY}
              fill="none"
              stroke="url(#faceOvalGradient)"
              strokeWidth="3"
              strokeDasharray="8 6"
              opacity="0.8"
            />
            {/* Inner guide oval for face area */}
            <ellipse
              cx={faceOvalParams.centerX}
              cy={faceOvalParams.centerY}
              rx={faceOvalParams.radiusX * 0.88}
              ry={faceOvalParams.radiusY * 0.91}
              fill="none"
              stroke="#60a5fa"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.5"
            />

            {/* Head Height Range Indicator - Different for US vs Indian Passport */}

            {/* Calculate range positions based on passport type */}
            {(() => {
              const isIndianPassport = passportSize === '2x2-india';

              // Head height requirements
              // US: 50-69% of image height
              // India: 1" to 1 3/8" on 2" photo = 50% to 68.75%
              const minHeadPercent = 0.50;
              const maxHeadPercent = isIndianPassport ? 0.6875 : 0.69;

              const minHeadHeight = faceOvalParams.height * minHeadPercent;
              const maxHeadHeight = faceOvalParams.height * maxHeadPercent;

              // Center the range zone vertically
              const rangeCenter = faceOvalParams.height * 0.50;
              const minY = rangeCenter - maxHeadHeight / 2;
              const maxY = rangeCenter + maxHeadHeight / 2;
              const minHeightY = rangeCenter - minHeadHeight / 2;
              const maxHeightY = rangeCenter + minHeadHeight / 2;

              return (
                <>
                  {/* Head Height Range Zone */}
                  <rect
                    x={faceOvalParams.centerX - faceOvalParams.radiusX * 1.5}
                    y={minY}
                    width={faceOvalParams.radiusX * 3}
                    height={maxY - minY}
                    fill="url(#rangeZoneGradient)"
                    opacity="0.3"
                  />

                  {/* Top boundary line (max head height) */}
                  <line
                    x1={faceOvalParams.centerX - faceOvalParams.radiusX * 1.3}
                    y1={minY}
                    x2={faceOvalParams.centerX + faceOvalParams.radiusX * 1.3}
                    y2={minY}
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray="6 3"
                    opacity="0.7"
                  />

                  {/* Bottom boundary line (max head height) */}
                  <line
                    x1={faceOvalParams.centerX - faceOvalParams.radiusX * 1.3}
                    y1={maxY}
                    x2={faceOvalParams.centerX + faceOvalParams.radiusX * 1.3}
                    y2={maxY}
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray="6 3"
                    opacity="0.7"
                  />

                  {/* Inner range lines (min head height) */}
                  <line
                    x1={faceOvalParams.centerX - faceOvalParams.radiusX * 1.1}
                    y1={minHeightY}
                    x2={faceOvalParams.centerX + faceOvalParams.radiusX * 1.1}
                    y2={minHeightY}
                    stroke="#34d399"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    opacity="0.6"
                  />
                  <line
                    x1={faceOvalParams.centerX - faceOvalParams.radiusX * 1.1}
                    y1={maxHeightY}
                    x2={faceOvalParams.centerX + faceOvalParams.radiusX * 1.1}
                    y2={maxHeightY}
                    stroke="#34d399"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    opacity="0.6"
                  />

                  {/* Side brackets for head height */}
                  <path
                    d={`M ${faceOvalParams.centerX - faceOvalParams.radiusX * 1.5} ${minY}
                        L ${faceOvalParams.centerX - faceOvalParams.radiusX * 1.6} ${minY}
                        L ${faceOvalParams.centerX - faceOvalParams.radiusX * 1.6} ${maxY}
                        L ${faceOvalParams.centerX - faceOvalParams.radiusX * 1.5} ${maxY}`}
                    stroke="#10b981"
                    strokeWidth="2.5"
                    fill="none"
                    opacity="0.8"
                  />
                  <path
                    d={`M ${faceOvalParams.centerX + faceOvalParams.radiusX * 1.5} ${minY}
                        L ${faceOvalParams.centerX + faceOvalParams.radiusX * 1.6} ${minY}
                        L ${faceOvalParams.centerX + faceOvalParams.radiusX * 1.6} ${maxY}
                        L ${faceOvalParams.centerX + faceOvalParams.radiusX * 1.5} ${maxY}`}
                    stroke="#10b981"
                    strokeWidth="2.5"
                    fill="none"
                    opacity="0.8"
                  />

                  {/* Head height label */}
                  <text
                    x={faceOvalParams.centerX}
                    y={minY - 10}
                    fill="#10b981"
                    fontSize="11"
                    fontWeight="600"
                    textAnchor="middle"
                    opacity="0.9"
                  >
                    {isIndianPassport ? 'Head: 1"-1⅜" (50-69%)' : 'Head Height: 50-69%'}
                  </text>
                </>
              );
            })()}

          </svg>
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
          <div
            className="p-6"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <ImagePlus className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-white">{t.uploadPhoto}</h2>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.heic,.heif"
              onChange={handleFileUpload}
              className="hidden"
            />
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleUploadClick}
                disabled={isUploading}
                aria-label={isUploading ? "Processing photo" : (uploadedImage ? "Change uploaded photo" : "Choose photo to upload")}
                className={`w-full h-32 border-2 border-dashed ${
                  isDragOver
                    ? 'border-indigo-400 bg-indigo-500/20 scale-105'
                    : 'border-white/30 hover:border-white/60 bg-white/5 hover:bg-white/10'
                } backdrop-blur-sm rounded-2xl transition-all group text-white disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex flex-col items-center gap-3">
                  <motion.div
                    animate={isUploading ? { rotate: 360 } : {}}
                    transition={isUploading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
                    whileHover={!isUploading ? { scale: 1.1, rotate: 5 } : {}}
                    className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl"
                  >
                    {isUploading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-7 h-7 border-3 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <Upload className="w-7 h-7 text-white" aria-hidden="true" />
                    )}
                  </motion.div>
                  <div>
                    <span className="text-white font-semibold block">
                      {isUploading ? 'Processing...' : (uploadedImage ? t.changePhoto : t.choosePhoto)}
                    </span>
                    <span className="text-xs text-white/60">
                      {isUploading ? 'Please wait' : t.fileSize}
                    </span>
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
                    disabled={isUploading}
                    className="w-full h-16 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border-2 border-emerald-400/30 hover:border-emerald-400/60 text-white rounded-xl backdrop-blur-sm transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
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
              <SelectTrigger className="w-full h-14 bg-white/10 border-white/30 text-white rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all text-left">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-white/20">
                {PHOTO_SIZE_OPTIONS.map((size) => (
                  <SelectItem key={size.value} value={size.value} className="text-white hover:bg-white/10">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span>{size.label}</span>
                        <span className="text-xs text-white/60">{size.description} • {size.pixelsAt300DPI}</span>
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
                  { value: 'center', label: 'Face Guide', icon: '👤' },
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
              <Badge className="bg-white/20 text-white border-white/30 text-xs">🖱️ +/−</Badge>
            </div>

            {/* Step-based Zoom Buttons */}
            <div className="flex items-center gap-2 mb-4">
              <Button
                onClick={() => setZoom(Math.max(50, zoom - 5))}
                disabled={zoom <= 50}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ZoomOut className="w-4 h-4 mr-2" />
                {t.zoomOut || 'Zoom Out'}
              </Button>
              <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/20 min-w-[80px] text-center">
                <span className="text-white font-semibold text-lg">{zoom}%</span>
              </div>
              <Button
                onClick={() => setZoom(Math.min(200, zoom + 5))}
                disabled={zoom >= 200}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ZoomIn className="w-4 h-4 mr-2" />
                {t.zoomIn || 'Zoom In'}
              </Button>
            </div>

            {/* Preset Zoom Levels */}
            <div className="grid grid-cols-6 gap-2 mb-4">
              {[50, 75, 100, 125, 150, 200].map((presetZoom) => (
                <button
                  key={presetZoom}
                  onClick={() => setZoom(presetZoom)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    zoom === presetZoom
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg scale-105'
                      : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/20'
                  }`}
                >
                  {presetZoom}%
                </button>
              ))}
            </div>

            {/* Fine-tune Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>Fine-tune</span>
                <span>Drag slider for precise control</span>
              </div>
              <Slider
                value={[zoom]}
                onValueChange={(value) => setZoom(value[0])}
                min={50}
                max={200}
                step={5}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-white/60">
                <span>50%</span>
                <span>200%</span>
              </div>
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
            <div className="flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 sm:p-12 min-h-[500px] sm:min-h-[600px] relative overflow-hidden border-2 border-white/30">
              {/* Dark checkerboard pattern background */}
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(45deg, #1f2937 25%, transparent 25%),
                  linear-gradient(-45deg, #1f2937 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #1f2937 75%),
                  linear-gradient(-45deg, transparent 75%, #1f2937 75%)
                `,
                backgroundSize: '30px 30px',
                backgroundPosition: '0 0, 0 15px, 15px -15px, -15px 0px',
                opacity: 0.3
              }} />
              
              {uploadedImage ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, type: 'spring' }}
                  className="relative z-10"
                >
                  <div
                    ref={canvasRef}
                    className={`relative overflow-hidden shadow-2xl border-4 border-indigo-400/80 ${isDragging ? 'cursor-grabbing scale-105 border-purple-400' : 'cursor-grab'} transition-all`}
                    style={{
                      width: `${previewDimensions.width}px`,
                      height: `${previewDimensions.height}px`,
                      backgroundColor: backgroundColors.find(bg => bg.value === backgroundColor)?.color || 'white',
                      boxShadow: '0 0 30px rgba(99, 102, 241, 0.4), 0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onWheel={handleWheel}
                  >
                    {/* Photo */}
                    <div className="absolute inset-0 overflow-hidden">
                      <img
                        src={uploadedImage}
                        alt="Passport photo preview with editing adjustments"
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
                  onClick={handleUploadClick}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`text-center text-white/60 relative z-10 cursor-pointer transition-all duration-300 ${
                    isDragOver ? 'scale-105' : 'hover:scale-102'
                  }`}
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className={`w-32 h-32 mx-auto mb-6 rounded-3xl flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${
                      isDragOver
                        ? 'bg-gradient-to-br from-indigo-400/40 to-purple-500/40 border-2 border-indigo-400'
                        : 'bg-gradient-to-br from-indigo-400/20 to-purple-500/20 border border-white/20'
                    }`}>
                      <Upload className={`w-16 h-16 transition-colors duration-300 ${
                        isDragOver ? 'text-indigo-300' : 'text-white/40'
                      }`} />
                    </div>
                  </motion.div>
                  <p className="text-xl mb-2 text-white">{t.uploadToStart}</p>
                  <p className="text-sm text-white/50">{t.supportedFormats}</p>
                  {isDragOver && (
                    <p className="text-sm text-indigo-300 mt-4 font-semibold animate-pulse">Drop your photo here</p>
                  )}
                </motion.div>
              )}
            </div>

            {/* Action Buttons */}
            <motion.div
              className="flex justify-between items-center gap-4 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {/* Download Edited Photo Button */}
              {uploadedImage && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleDownloadSingle}
                    size="lg"
                    className="px-8 py-6 bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 rounded-2xl backdrop-blur-sm"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Edited Photo
                  </Button>
                </motion.div>
              )}

              {/* Next Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={uploadedImage ? '' : 'w-full'}
              >
                <Button
                  onClick={onNext}
                  disabled={!uploadedImage}
                  size="lg"
                  className={`${uploadedImage ? 'px-10' : 'w-full'} py-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-2xl shadow-2xl shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold`}
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
      <Suspense fallback={<div />}>
        <QRCodeGenerator
          isOpen={showQRCode}
          onClose={() => setShowQRCode(false)}
          imageUrl={uploadedImage}
        />
      </Suspense>

      {/* History Panel */}
      <Suspense fallback={<div />}>
        <HistoryPanel
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          onLoadSession={onLoadSession}
        />
      </Suspense>

      {/* Presets Panel */}
      <Suspense fallback={<div />}>
        <PresetsPanel
          isOpen={showPresets}
          onClose={() => setShowPresets(false)}
          onApplyPreset={onApplyPreset}
        />
      </Suspense>

      {/* Before-After Comparison */}
      <Suspense fallback={<div />}>
        <BeforeAfterComparison
          isOpen={showComparison}
          onClose={() => setShowComparison(false)}
          originalImage={originalImage}
          editedImage={uploadedImage}
        />
      </Suspense>

      {/* Camera Capture */}
      <Suspense fallback={<div />}>
        <CameraCapture
          isOpen={showCamera}
          onClose={() => setShowCamera(false)}
          onCapture={setUploadedImage}
        />
      </Suspense>
    </div>
  );
}