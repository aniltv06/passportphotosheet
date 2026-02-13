import { Settings, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { useLanguage } from '../contexts/LanguageContext';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  exportFormat: string;
  setExportFormat: (format: string) => void;
  imageQuality: number;
  setImageQuality: (quality: number) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  exportFormat,
  setExportFormat,
  imageQuality,
  setImageQuality,
}: SettingsModalProps) {
  const { t } = useLanguage();

  const exportFormats = [
    { value: 'png', label: 'PNG', description: 'Lossless, larger file size' },
    { value: 'jpg', label: 'JPG', description: 'Smaller file size' },
    { value: 'webp', label: 'WebP', description: 'Modern, efficient' },
    { value: 'pdf', label: 'PDF', description: 'Print-ready document' },
  ];

  const handleRestoreDefaults = () => {
    setExportFormat('png');
    setImageQuality(95);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-900/95 backdrop-blur-xl border-white/20 text-white">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <DialogTitle className="text-white">{t.settings}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Export Format */}
          <div>
            <label className="text-sm text-white/80 mb-3 block font-semibold">
              {t.exportFormat}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {exportFormats.map((format) => (
                <motion.button
                  key={format.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setExportFormat(format.value)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    exportFormat === format.value
                      ? 'border-indigo-400 bg-indigo-500/20 shadow-xl shadow-indigo-500/20'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white">{format.label}</span>
                    {exportFormat === format.value && (
                      <Badge className="bg-indigo-500 text-white border-0">✓</Badge>
                    )}
                  </div>
                  <p className="text-xs text-white/60">{format.description}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Image Quality */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm text-white/80 font-semibold">
                {t.imageQuality}
              </label>
              <Badge className="bg-white/20 text-white border-white/30">
                {imageQuality}%
              </Badge>
            </div>
            <Slider
              value={[imageQuality]}
              onValueChange={(value) => setImageQuality(value[0])}
              min={60}
              max={100}
              step={5}
              className="mb-3"
            />
            <div className="flex justify-between text-xs text-white/60">
              <span>{t.low} (60%)</span>
              <span>{t.medium} (80%)</span>
              <span>{t.high} (100%)</span>
            </div>
          </div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl border border-white/20 p-4"
          >
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xl">💡</span>
              </div>
              <div>
                <h4 className="text-white mb-1">{t.proTip}</h4>
                <p className="text-sm text-white/80">
                  Higher quality settings result in larger file sizes. For web use, 80-90% quality is optimal. For professional printing, use 95-100%.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <Button
              onClick={handleRestoreDefaults}
              variant="outline"
              className="flex-1 bg-white/5 hover:bg-white/10 text-white border-white/20 rounded-xl"
            >
              {t.restoreDefaults}
            </Button>
            <Button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl"
            >
              {t.save}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
