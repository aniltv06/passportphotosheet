import { useState } from 'react';
import { SplitSquareVertical, Maximize2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { motion } from 'motion/react';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';

interface BeforeAfterComparisonProps {
  isOpen: boolean;
  onClose: () => void;
  originalImage: string;
  editedImage: string;
}

export function BeforeAfterComparison({
  isOpen,
  onClose,
  originalImage,
  editedImage,
}: BeforeAfterComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [viewMode, setViewMode] = useState<'slider' | 'sidebyside'>('slider');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden bg-gray-900/95 backdrop-blur-xl border-white/20 text-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                <SplitSquareVertical className="w-5 h-5 text-white" />
              </div>
              <DialogTitle className="text-white">Before & After Comparison</DialogTitle>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('slider')}
                className={`px-4 py-2 rounded-xl transition-all ${
                  viewMode === 'slider'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                Slider
              </button>
              <button
                onClick={() => setViewMode('sidebyside')}
                className={`px-4 py-2 rounded-xl transition-all ${
                  viewMode === 'sidebyside'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                Side by Side
              </button>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6">
          {viewMode === 'slider' ? (
            <div className="space-y-4">
              {/* Slider Comparison */}
              <div className="relative w-full aspect-[4/5] bg-gray-800 rounded-2xl overflow-hidden">
                {/* Before Image (Full) */}
                <img
                  src={originalImage}
                  alt="Original photo before editing"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* After Image (Clipped) */}
                <motion.div
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                  <img
                    src={editedImage}
                    alt="Edited photo with adjustments applied"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </motion.div>

                {/* Slider Line */}
                <motion.div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl cursor-ew-resize z-10"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-2xl flex items-center justify-center">
                    <SplitSquareVertical className="w-5 h-5 text-gray-900" />
                  </div>
                </motion.div>

                {/* Labels */}
                <Badge className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white border-white/30">
                  Before
                </Badge>
                <Badge className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white border-white/30">
                  After
                </Badge>
              </div>

              {/* Slider Control */}
              <div className="px-4">
                <Slider
                  value={[sliderPosition]}
                  onValueChange={(value) => setSliderPosition(value[0])}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-white/60 mt-2">
                  <span>Before</span>
                  <span>{sliderPosition}%</span>
                  <span>After</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Before */}
              <div className="space-y-3">
                <Badge className="bg-white/20 text-white border-white/30">
                  Before (Original)
                </Badge>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="aspect-[4/5] bg-gray-800 rounded-2xl overflow-hidden"
                >
                  <img
                    src={originalImage}
                    alt="Original photo before editing"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>

              {/* After */}
              <div className="space-y-3">
                <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0">
                  After (Edited)
                </Badge>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="aspect-[4/5] bg-gray-800 rounded-2xl overflow-hidden"
                >
                  <img
                    src={editedImage}
                    alt="Edited photo with adjustments applied"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="mt-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl border border-white/20 p-4">
            <p className="text-sm text-white/80">
              <Maximize2 className="w-4 h-4 inline mr-2" />
              Drag the slider or toggle views to compare your original photo with the edited version
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
