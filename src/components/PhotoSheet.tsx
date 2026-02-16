import { ArrowLeft, Maximize2, Download, Grid3x3, FileCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { motion } from 'motion/react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { GlassCard } from './GlassCard';
import { Badge } from './ui/badge';
import { PAPER_SIZE_OPTIONS, LAYOUTS, PHOTO_SIZE_OPTIONS, PhotoSize } from '../utils/layoutConfig';
import { createPhotoSheet, downloadPhotoSheet } from '../utils/canvasRenderer';
import { getIntelligentPaperSizes, getOptimalLayout } from '../utils/paperSizeCalculator';

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
}: PhotoSheetProps) {
  const [quality, setQuality] = useState<'high' | 'medium'>('high');
  const [gapEnabled, setGapEnabled] = useState(false);
  const [borderEnabled, setBorderEnabled] = useState(false);
  const [previewCanvas, setPreviewCanvas] = useState<HTMLCanvasElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Get photo dimensions from selected photo size
  const selectedPhotoSize = PHOTO_SIZE_OPTIONS.find(ps => ps.value === passportSize) || PHOTO_SIZE_OPTIONS[0];
  const photoWidth = selectedPhotoSize.width;
  const photoHeight = selectedPhotoSize.height;

  // Get intelligent paper size options based on selected photo size
  const intelligentPaperSizes = useMemo(() => {
    return getIntelligentPaperSizes(passportSize);
  }, [passportSize]);

  // Get optimal layout for current selection
  const optimalLayout = useMemo(() => {
    return getOptimalLayout(passportSize, paperSize);
  }, [passportSize, paperSize]);

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
          // Photo dimensions
          photoWidth,
          photoHeight,
          // Pass all transformations
          zoom,
          rotation,
          panX,
          panY,
          brightness,
          contrast,
          backgroundColor,
          // Border options
          borderWidth,
          borderColor,
          // Pass optimal layout
          optimalLayout,
        });

        // Scale down canvas for preview - use dynamic scaling based on paper size
        // Larger papers need more aggressive scaling to fit in the preview area
        let previewScale = 0.5;
        const paperSizeArea = currentLayout.width * currentLayout.height;

        // Adjust scale based on paper size
        if (paperSizeArea >= 80) { // 8x10 and larger
          previewScale = 0.35;
        } else if (paperSizeArea >= 48) { // 6x8 and larger
          previewScale = 0.4;
        } else if (paperSizeArea >= 35) { // 5x7 and larger
          previewScale = 0.45;
        }

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
  }, [uploadedImage, paperSize, quality, gapEnabled, borderEnabled, photoWidth, photoHeight, zoom, rotation, panX, panY, brightness, contrast, backgroundColor, borderWidth, borderColor, optimalLayout]);

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
          // Photo dimensions
          photoWidth,
          photoHeight,
          // Pass all transformations
          zoom,
          rotation,
          panX,
          panY,
          brightness,
          contrast,
          backgroundColor,
          // Border options
          borderWidth,
          borderColor,
          // Pass optimal layout
          optimalLayout,
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
              <SelectTrigger className="w-full h-14 bg-white/10 border-white/30 text-white rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all text-left">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-white/20">
                {intelligentPaperSizes.map((size) => (
                  <SelectItem key={size.value} value={size.value} className="text-white hover:bg-white/10">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{size.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          {size.label}
                          {size.recommendationLevel === 'best' && (
                            <Badge className="ml-1 bg-emerald-500/90 text-white text-[10px]">Best</Badge>
                          )}
                          {size.recommendationLevel === 'good' && (
                            <Badge className="ml-1 bg-blue-500/90 text-white text-[10px]">Good</Badge>
                          )}
                        </div>
                        <div className="text-xs text-white/60">{size.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </GlassCard>

        {/* Quality & Guides */}
        <GlassCard delay={0.175}>
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
                  <SelectTrigger className="w-full bg-white/10 border-white/30 text-white rounded-xl text-left">
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

        {/* Border Options - Show when borders are enabled */}
        {borderEnabled && (
          <GlassCard delay={0.2}>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <FileCheck className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-white">Border Options</h2>
              </div>

              <div className="space-y-4">
                {/* Border Thickness */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-white/80">Thickness</label>
                    <Badge className="bg-white/20 text-white border-white/30 text-xs">
                      {borderWidth}px
                    </Badge>
                  </div>
                  <Slider
                    value={[borderWidth]}
                    onValueChange={(value) => setBorderWidth(value[0])}
                    min={1}
                    max={10}
                    step={1}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-white/60">
                    <span>Thin</span>
                    <span>Thick</span>
                  </div>
                </div>

                {/* Border Color */}
                <div>
                  <label className="text-sm text-white/80 mb-3 block">Color</label>
                  <div className="grid grid-cols-2 gap-3">
                    {borderColors.map((color) => (
                      <motion.button
                        key={color.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setBorderColor(color.value)}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          borderColor === color.value
                            ? 'border-white bg-white/20 shadow-xl'
                            : 'border-white/20 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className={`w-full h-8 rounded-lg bg-gradient-to-br ${color.gradient} mb-2 shadow-lg`} />
                        <span className="text-xs text-white/90 font-medium">{color.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.225 }}
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
                {optimalLayout.photos}
              </Badge>
            </div>
            <div className="flex justify-between text-white/90">
              <span className="text-sm">Layout:</span>
              <span className="font-semibold">{optimalLayout.cols}×{optimalLayout.rows}</span>
            </div>
            <div className="flex justify-between text-white/90">
              <span className="text-sm">Photo Size:</span>
              <span className="font-semibold">{selectedPhotoSize.label.split(' ')[0]}</span>
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
            <div className="flex items-center justify-center bg-gradient-to-br from-white/5 to-white/10 rounded-3xl p-8 min-h-[700px] max-h-[900px] relative overflow-auto border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-50" />

              {/* Paper Size Badge */}
              <div className="absolute top-6 left-6 z-20">
                <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl px-6 py-3 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{currentPaperSizeOption.icon}</span>
                    <div>
                      <div className="text-white font-semibold text-sm">
                        {currentPaperSizeOption.label}
                      </div>
                      <div className="text-white/70 text-xs">
                        {currentLayout.width}×{currentLayout.height}\" • {optimalLayout.photos} photos • {quality === 'high' ? '300' : '200'} DPI
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10"
              >
                <div className="bg-white shadow-2xl">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-auto block"
                    style={{
                      imageRendering: 'high-quality',
                      maxWidth: '100%',
                      maxHeight: '800px',
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
                  onClick={handleDownloadSheet}
                  size="lg"
                  className="px-10 py-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-2xl shadow-2xl shadow-indigo-500/50 text-lg font-semibold"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Sheet
                </Button>
              </motion.div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
