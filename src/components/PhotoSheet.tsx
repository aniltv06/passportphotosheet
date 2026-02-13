import { Printer, ArrowLeft, Maximize2, Download, Grid3x3, FileCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { motion } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { GlassCard } from './GlassCard';
import { Badge } from './ui/badge';
import { PAPER_SIZE_OPTIONS, LAYOUTS } from '../utils/layoutConfig';
import { createPhotoSheet, downloadPhotoSheet } from '../utils/canvasRenderer';

interface PhotoSheetProps {
  uploadedImage: string | null;
  passportSize: string;
  zoom: number;
  rotation: number;
  backgroundColor: string;
  brightness: number;
  contrast: number;
  panX: number;
  panY: number;
  paperSize: string;
  setPaperSize: (size: string) => void;
  borderWidth: number;
  setBorderWidth: (width: number) => void;
  borderColor: string;
  setBorderColor: (color: string) => void;
  onBack: () => void;
  onPrint: () => void;
}

export function PhotoSheet({
  uploadedImage,
  passportSize,
  zoom,
  rotation,
  backgroundColor,
  brightness,
  contrast,
  panX,
  panY,
  paperSize,
  setPaperSize,
  borderWidth,
  setBorderWidth,
  borderColor,
  setBorderColor,
  onBack,
  onPrint,
}: PhotoSheetProps) {
  const [quality, setQuality] = useState<'high' | 'medium'>('high');
  const [gapEnabled, setGapEnabled] = useState(false);
  const [borderEnabled, setBorderEnabled] = useState(false);
  const [previewCanvas, setPreviewCanvas] = useState<HTMLCanvasElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const borderColors = [
    { value: '#ffffff', label: 'White', gradient: 'from-gray-100 to-gray-200' },
    { value: '#000000', label: 'Black', gradient: 'from-gray-800 to-gray-900' },
    { value: '#e5e7eb', label: 'Gray', gradient: 'from-gray-200 to-gray-300' },
    { value: '#dbeafe', label: 'Blue', gradient: 'from-blue-100 to-blue-200' },
  ];

  const backgroundColors = [
    { value: 'original', label: 'Original', color: 'transparent' },
    { value: 'white', label: 'White', color: '#ffffff' },
    { value: 'lightgray', label: 'Light Gray', color: '#f3f4f6' },
    { value: 'lightblue', label: 'Light Blue', color: '#dbeafe' },
    { value: 'cream', label: 'Cream', color: '#fef3c7' },
  ];

  const currentLayout = LAYOUTS[paperSize];
  const currentPaperSizeOption = PAPER_SIZE_OPTIONS.find(s => s.value === paperSize) || PAPER_SIZE_OPTIONS[0];

  // Render preview canvas
  useEffect(() => {
    if (!uploadedImage || !canvasRef.current) return;

    const img = new Image();
    img.onload = () => {
      try {
        const result = createPhotoSheet(img, {
          paperSize,
          quality,
          gapEnabled,
          borderEnabled,
        });

        // Scale down canvas for preview
        const previewScale = 0.5;
        const previewCanvas = document.createElement('canvas');
        previewCanvas.width = result.canvasWidth * previewScale;
        previewCanvas.height = result.canvasHeight * previewScale;

        const previewCtx = previewCanvas.getContext('2d');
        if (previewCtx) {
          previewCtx.drawImage(
            result.canvas,
            0,
            0,
            result.canvasWidth,
            result.canvasHeight,
            0,
            0,
            previewCanvas.width,
            previewCanvas.height
          );
        }

        setPreviewCanvas(previewCanvas);

        // Update canvas ref for display
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            canvasRef.current.width = previewCanvas.width;
            canvasRef.current.height = previewCanvas.height;
            ctx.drawImage(previewCanvas, 0, 0);
          }
        }
      } catch (error) {
        console.error('Error rendering preview:', error);
      }
    };
    img.src = uploadedImage;
  }, [uploadedImage, paperSize, quality, gapEnabled, borderEnabled]);

  const handleDownloadSheet = () => {
    if (!uploadedImage) return;

    const img = new Image();
    img.onload = () => {
      try {
        const result = createPhotoSheet(img, {
          paperSize,
          quality,
          gapEnabled,
          borderEnabled,
        });

        downloadPhotoSheet(result.canvas, paperSize, result.dpi);
      } catch (error) {
        console.error('Error downloading sheet:', error);
        alert('Failed to download photo sheet. Please try again.');
      }
    };
    img.src = uploadedImage;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Panel - Controls */}
      <div className="lg:col-span-1 space-y-4">
        {/* Paper Size */}
        <GlassCard delay={0.1}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <Maximize2 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-white">Paper Size</h2>
            </div>
            <Select value={paperSize} onValueChange={setPaperSize}>
              <SelectTrigger className="w-full h-14 bg-white/10 border-white/30 text-white rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-white/20">
                {PAPER_SIZE_OPTIONS.map((size) => (
                  <SelectItem key={size.value} value={size.value} className="text-white hover:bg-white/10">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{size.icon}</span>
                      <div>
                        <div>{size.label}</div>
                        <div className="text-xs text-white/60">{size.description}</div>
                      </div>
                      {size.badge && (
                        <Badge className="ml-2 bg-emerald-500/80">{size.badge}</Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </GlassCard>

        {/* Quality & Guides */}
        <GlassCard delay={0.15}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Grid3x3 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-white">Print Settings</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/80 mb-2 block">Quality</label>
                <Select value={quality} onValueChange={(val) => setQuality(val as 'high' | 'medium')}>
                  <SelectTrigger className="w-full bg-white/10 border-white/30 text-white rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-white/20">
                    <SelectItem value="high" className="text-white">
                      Professional (300 DPI) ⭐
                    </SelectItem>
                    <SelectItem value="medium" className="text-white">
                      Standard (200 DPI)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-white/80">Cutting Guides</label>
                <Switch checked={gapEnabled} onCheckedChange={setGapEnabled} />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-white/80">Photo Borders</label>
                <Switch checked={borderEnabled} onCheckedChange={setBorderEnabled} />
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="backdrop-blur-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-3xl border border-white/30 p-6 relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/20 rounded-full blur-3xl" />
          <h3 className="text-white mb-4 flex items-center gap-2 relative text-lg">
            📊 Print Summary
          </h3>
          <div className="space-y-3 relative">
            <div className="flex justify-between text-white/90">
              <span className="text-sm">Total Photos:</span>
              <Badge className="bg-white/30 text-white border-white/30 font-semibold">
                {currentLayout.photos}
              </Badge>
            </div>
            <div className="flex justify-between text-white/90">
              <span className="text-sm">Photo Size:</span>
              <span className="font-semibold">2×2"</span>
            </div>
            <div className="flex justify-between text-white/90">
              <span className="text-sm">Paper:</span>
              <span className="font-semibold">{currentLayout.width}×{currentLayout.height}"</span>
            </div>
            <div className="flex justify-between text-white/90">
              <span className="text-sm">Quality:</span>
              <span className="font-semibold">{quality === 'high' ? '300' : '200'} DPI</span>
            </div>
          </div>
        </motion.div>

        {/* Download Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={handleDownloadSheet}
            className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl shadow-2xl shadow-green-500/50"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Sheet
          </Button>
        </motion.div>
      </div>

      {/* Right Panel - Sheet Preview */}
      <div className="lg:col-span-2">
        <GlassCard delay={0.3}>
          <div className="p-8">
            <h2 className="text-white mb-6 flex items-center gap-2 text-xl">
              <span className="text-2xl">🖨️</span>
              Sheet Preview
            </h2>

            {/* Preview Area */}
            <div className="flex items-center justify-center bg-gradient-to-br from-white/5 to-white/10 rounded-3xl p-8 min-h-[700px] relative overflow-hidden border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-50" />

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10"
              >
                <div className="bg-white shadow-2xl rounded-2xl p-4 max-w-full overflow-auto">
                  <canvas
                    ref={canvasRef}
                    className="max-w-full h-auto"
                    style={{
                      imageRendering: 'high-quality',
                    }}
                  />
                </div>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-8 gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={onBack}
                  size="lg"
                  className="px-8 py-6 bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 rounded-2xl backdrop-blur-sm"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Editor
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={onPrint}
                  size="lg"
                  className="px-10 py-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-2xl shadow-2xl shadow-indigo-500/50 text-lg font-semibold"
                >
                  <Printer className="w-5 h-5 mr-2" />
                  Print Sheet
                </Button>
              </motion.div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
