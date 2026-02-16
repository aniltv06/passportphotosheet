import { Grid3x3, Eye, EyeOff, Sliders } from 'lucide-react';
import { motion } from 'motion/react';
import { GlassCard } from './GlassCard';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';

export type GridType = 'none' | 'thirds' | 'golden' | 'center' | 'diagonal' | 'spiral' | 'passport';

interface AdvancedGridControlsProps {
  gridType: GridType;
  setGridType: (type: GridType) => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  gridOpacity: number;
  setGridOpacity: (opacity: number) => void;
  gridColor: string;
  setGridColor: (color: string) => void;
}

export function AdvancedGridControls({
  gridType,
  setGridType,
  showGrid,
  setShowGrid,
  gridOpacity,
  setGridOpacity,
  gridColor,
  setGridColor,
}: AdvancedGridControlsProps) {
  const gridOptions = [
    { 
      value: 'thirds', 
      label: 'Rule of Thirds', 
      icon: '⊞',
      description: 'Classic 3x3 composition grid'
    },
    { 
      value: 'golden', 
      label: 'Golden Ratio', 
      icon: 'φ',
      description: 'Professional φ (1.618) grid'
    },
    { 
      value: 'center', 
      label: 'Center Guide', 
      icon: '✛',
      description: 'Face alignment crosshair'
    },
    { 
      value: 'diagonal', 
      label: 'Diagonal', 
      icon: '╱',
      description: 'Dynamic composition lines'
    },
    { 
      value: 'spiral', 
      label: 'Fibonacci Spiral', 
      icon: '🌀',
      description: 'Natural flow composition'
    },
    { 
      value: 'passport', 
      label: 'Passport Guide', 
      icon: '📐',
      description: 'Official passport measurements'
    },
    { 
      value: 'none', 
      label: 'No Grid', 
      icon: '○',
      description: 'Clean view'
    },
  ];

  const colorOptions = [
    { value: 'cyan', label: 'Cyan', color: 'rgb(34, 211, 238)' },
    { value: 'amber', label: 'Amber', color: 'rgb(251, 191, 36)' },
    { value: 'purple', label: 'Purple', color: 'rgb(168, 85, 247)' },
    { value: 'green', label: 'Green', color: 'rgb(34, 197, 94)' },
    { value: 'red', label: 'Red', color: 'rgb(239, 68, 68)' },
    { value: 'white', label: 'White', color: 'rgb(255, 255, 255)' },
  ];

  return (
    <GlassCard delay={0.25}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <Grid3x3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white">Advanced Grids</h2>
              <p className="text-xs text-white/60">Professional composition tools</p>
            </div>
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
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4"
          >
            {/* Grid Type Selection */}
            <div className="grid grid-cols-2 gap-2">
              {gridOptions.map((grid) => (
                <motion.button
                  key={grid.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGridType(grid.value as GridType)}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    gridType === grid.value
                      ? 'border-cyan-400 bg-cyan-500/20 shadow-xl'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                  title={grid.description}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{grid.icon}</span>
                    {gridType === grid.value && (
                      <Badge className="bg-cyan-400/30 text-cyan-200 border-cyan-400/50 text-xs">
                        Active
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-white/90 block">{grid.label}</span>
                  <span className="text-[10px] text-white/50 block mt-0.5">{grid.description}</span>
                </motion.button>
              ))}
            </div>

            {/* Grid Opacity Control */}
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-3">
                <Sliders className="w-4 h-4 text-white/70" />
                <h3 className="text-sm text-white/90">Grid Opacity</h3>
                <Badge className="ml-auto bg-white/20 text-white border-white/30 text-xs">
                  {gridOpacity}%
                </Badge>
              </div>
              <Slider
                value={[gridOpacity]}
                onValueChange={(value) => setGridOpacity(value[0])}
                min={20}
                max={100}
                step={5}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-white/50">
                <span>Subtle</span>
                <span>Bold</span>
              </div>
            </div>

            {/* Grid Color Selection */}
            <div className="pt-2">
              <h3 className="text-sm text-white/90 mb-3 flex items-center gap-2">
                <span>🎨</span> Grid Color
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {colorOptions.map((color) => (
                  <motion.button
                    key={color.value}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setGridColor(color.value)}
                    className={`p-2 rounded-lg border-2 transition-all flex items-center gap-2 ${
                      gridColor === color.value
                        ? 'border-white bg-white/20'
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div 
                      className="w-4 h-4 rounded-full shadow-lg" 
                      style={{ backgroundColor: color.color }}
                    />
                    <span className="text-xs text-white/90">{color.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Grid Info */}
            {gridType !== 'none' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl border border-white/20 p-3 mt-3"
              >
                <p className="text-xs text-white/80">
                  <span className="font-semibold text-white">Pro Tip:</span>{' '}
                  {gridType === 'thirds' && 'Place your subject at intersecting points for balanced composition.'}
                  {gridType === 'golden' && 'Use golden ratio (φ = 1.618) for naturally pleasing compositions.'}
                  {gridType === 'center' && 'Align eyes at top line, chin at bottom line for passport photos.'}
                  {gridType === 'diagonal' && 'Use diagonals to create dynamic energy and movement.'}
                  {gridType === 'spiral' && 'Follow the spiral for natural, flowing compositions.'}
                  {gridType === 'passport' && 'Official measurements: Head 70-80% of frame, eyes at 50-70% height.'}
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </GlassCard>
  );
}
