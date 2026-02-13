import { Palette } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme, themes, Theme } from '../contexts/ThemeContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useState } from 'react';
import { Button } from './ui/button';

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl"
        >
          <Palette className="w-5 h-5" />
          <span className="hidden sm:inline ml-2">Theme</span>
        </Button>
      </motion.div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl bg-gray-900/95 backdrop-blur-xl border-white/20 text-white">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <DialogTitle className="text-white">Choose Your Theme</DialogTitle>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {Object.entries(themes).map(([key, value]) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setTheme(key as Theme);
                  setIsOpen(false);
                }}
                className={`relative overflow-hidden rounded-2xl border-2 transition-all ${
                  theme === key
                    ? 'border-white shadow-2xl shadow-white/20'
                    : 'border-white/20 hover:border-white/40'
                }`}
              >
                <div className={`h-32 bg-gradient-to-br ${value.gradient} p-4 flex flex-col justify-between`}>
                  <div className="flex justify-between items-start">
                    <span className="text-3xl">{value.preview}</span>
                    {theme === key && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 bg-white rounded-full flex items-center justify-center"
                      >
                        <span className="text-gray-900 text-sm">✓</span>
                      </motion.div>
                    )}
                  </div>
                  <div className="text-left">
                    <h4 className="text-white font-semibold">{value.name}</h4>
                    <div className="flex gap-1 mt-2">
                      <div className={`w-8 h-1.5 rounded-full ${value.orb1}`} />
                      <div className={`w-8 h-1.5 rounded-full ${value.orb2}`} />
                      <div className={`w-8 h-1.5 rounded-full ${value.orb3}`} />
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          <p className="text-sm text-white/60 text-center mt-4">
            Your theme choice is saved automatically
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
