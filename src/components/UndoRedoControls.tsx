import { Undo2, Redo2, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';

interface UndoRedoControlsProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  historyInfo?: { current: number; total: number };
}

export function UndoRedoControls({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onReset,
  historyInfo,
}: UndoRedoControlsProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Undo */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={onUndo}
          disabled={!canUndo}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Undo</span>
          <Badge variant="secondary" className="ml-2 bg-white/20 text-white border-white/30 text-xs hidden md:inline">
            Ctrl+Z
          </Badge>
        </Button>
      </motion.div>

      {/* Redo */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={onRedo}
          disabled={!canRedo}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Redo</span>
          <Badge variant="secondary" className="ml-2 bg-white/20 text-white border-white/30 text-xs hidden md:inline">
            Ctrl+Y
          </Badge>
        </Button>
      </motion.div>

      {/* Reset */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={onReset}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl"
          title="Reset all adjustments (Ctrl+R)"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Reset</span>
        </Button>
      </motion.div>

      {/* History Info */}
      {historyInfo && historyInfo.total > 0 && (
        <Badge className="bg-white/20 text-white border-white/30 text-xs ml-auto hidden lg:inline-flex">
          {historyInfo.current} / {historyInfo.total}
        </Badge>
      )}
    </div>
  );
}
