import { useState, useEffect } from 'react';
import { Sparkles, Plus, Trash2, Save, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from './ui/badge';
import { 
  getAllPresets, 
  saveCustomPreset, 
  deleteCustomPreset, 
  PhotoPreset,
  defaultPresets 
} from '../utils/presets';

interface PresetsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPreset: (preset: PhotoPreset) => void;
  currentSettings?: {
    passportSize: string;
    backgroundColor: string;
    brightness: number;
    contrast: number;
    saturation: number;
  };
}

export function PresetsPanel({ 
  isOpen, 
  onClose, 
  onApplyPreset,
  currentSettings 
}: PresetsPanelProps) {
  const [presets, setPresets] = useState<PhotoPreset[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetDesc, setNewPresetDesc] = useState('');
  const [newPresetIcon, setNewPresetIcon] = useState('⭐');

  useEffect(() => {
    if (isOpen) {
      loadPresets();
    }
  }, [isOpen]);

  const loadPresets = () => {
    setPresets(getAllPresets());
  };

  const handleApply = (preset: PhotoPreset) => {
    onApplyPreset(preset);
    onClose();
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this preset?')) {
      deleteCustomPreset(id);
      loadPresets();
    }
  };

  const handleSaveCurrentAsPreset = () => {
    if (!currentSettings || !newPresetName) return;

    saveCustomPreset({
      name: newPresetName,
      description: newPresetDesc || 'Custom preset',
      icon: newPresetIcon,
      settings: currentSettings,
    });

    setNewPresetName('');
    setNewPresetDesc('');
    setNewPresetIcon('⭐');
    setShowSaveDialog(false);
    loadPresets();
  };

  const emojiOptions = ['⭐', '✨', '🎨', '🎯', '💎', '🔥', '🌟', '💫', '🎭', '🎪', '🎬', '🎤'];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden bg-gray-900/95 backdrop-blur-xl border-white/20 text-white flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-white">Presets & Templates</DialogTitle>
                  <p className="text-sm text-white/60">Quick apply professional settings</p>
                </div>
              </div>
              {currentSettings && (
                <Button
                  onClick={() => setShowSaveDialog(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Save Current
                </Button>
              )}
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto mt-6 pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {/* Default Presets */}
            <div className="mb-8">
              <h3 className="text-white/80 text-sm mb-4 flex items-center gap-2">
                <span className="text-lg">🎯</span>
                Default Templates
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {defaultPresets.map((preset, index) => (
                  <motion.button
                    key={preset.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleApply(preset)}
                    className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border-2 border-white/20 hover:border-white/40 p-6 text-left transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-4xl">{preset.icon}</span>
                      <motion.div
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1 }}
                        className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Check className="w-4 h-4 text-white" />
                      </motion.div>
                    </div>
                    <h4 className="text-white mb-1">{preset.name}</h4>
                    <p className="text-xs text-white/60 mb-3">{preset.description}</p>
                    <div className="flex flex-wrap gap-1">
                      <Badge className="bg-white/20 text-white border-white/30 text-xs">
                        {preset.settings.passportSize}
                      </Badge>
                      <Badge className="bg-white/20 text-white border-white/30 text-xs">
                        {preset.settings.backgroundColor}
                      </Badge>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Custom Presets */}
            {presets.filter(p => p.isCustom).length > 0 && (
              <div>
                <h3 className="text-white/80 text-sm mb-4 flex items-center gap-2">
                  <span className="text-lg">✨</span>
                  Your Custom Presets
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {presets.filter(p => p.isCustom).map((preset, index) => (
                    <motion.div
                      key={preset.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="relative group"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleApply(preset)}
                        className="w-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border-2 border-white/20 hover:border-white/40 p-6 text-left transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-4xl">{preset.icon}</span>
                          <button
                            onClick={(e) => handleDelete(preset.id, e)}
                            className="w-8 h-8 bg-red-500/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                          </button>
                        </div>
                        <h4 className="text-white mb-1">{preset.name}</h4>
                        <p className="text-xs text-white/60 mb-3">{preset.description}</p>
                        <div className="flex flex-wrap gap-1">
                          <Badge className="bg-white/20 text-white border-white/30 text-xs">
                            Custom
                          </Badge>
                          <Badge className="bg-white/20 text-white border-white/30 text-xs">
                            {preset.settings.passportSize}
                          </Badge>
                        </div>
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Save Preset Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="max-w-md bg-gray-900/95 backdrop-blur-xl border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Save as Preset</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="icon" className="text-white/90 mb-3 block">
                Choose Icon
              </Label>
              <div className="grid grid-cols-6 gap-2">
                {emojiOptions.map((emoji) => (
                  <motion.button
                    key={emoji}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setNewPresetIcon(emoji)}
                    className={`text-3xl p-3 rounded-xl border-2 transition-all ${
                      newPresetIcon === emoji
                        ? 'border-indigo-400 bg-indigo-500/20'
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="name" className="text-white/90 mb-2 block">
                Preset Name
              </Label>
              <Input
                id="name"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                className="bg-white/10 border-white/20 text-white rounded-xl"
                placeholder="My Custom Preset"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-white/90 mb-2 block">
                Description (Optional)
              </Label>
              <Input
                id="description"
                value={newPresetDesc}
                onChange={(e) => setNewPresetDesc(e.target.value)}
                className="bg-white/10 border-white/20 text-white rounded-xl"
                placeholder="Perfect for..."
              />
            </div>

            {currentSettings && (
              <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl border border-white/20 p-4">
                <h3 className="text-white text-sm mb-2">Current Settings</h3>
                <div className="grid grid-cols-2 gap-2 text-xs text-white/80">
                  <div>Size: {currentSettings.passportSize}</div>
                  <div>Background: {currentSettings.backgroundColor}</div>
                  <div>Brightness: {currentSettings.brightness}%</div>
                  <div>Contrast: {currentSettings.contrast}%</div>
                  <div>Saturation: {currentSettings.saturation}%</div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setShowSaveDialog(false)}
                variant="outline"
                className="flex-1 bg-white/5 hover:bg-white/10 text-white border-white/20 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveCurrentAsPreset}
                disabled={!newPresetName}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Preset
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
