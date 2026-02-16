import { Heart, Coffee, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function SupportBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="fixed bottom-6 right-6 z-50 max-w-sm"
      >
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-2xl shadow-2xl p-6 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          {/* Close Button */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Coffee className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Love this tool?</h3>
                <p className="text-sm text-white/90">Support my work</p>
              </div>
            </div>

            <p className="text-sm text-white/90 mb-4 leading-relaxed">
              This tool is free to use. If you find it helpful, consider buying me a coffee to support development!
            </p>

            <div className="flex gap-3">
              <a
                href="https://buymeacoffee.com/NishithaAnil"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-orange-600 rounded-xl hover:bg-orange-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span className="font-medium">Buy me a coffee</span>
              </a>
            </div>

            <p className="text-xs text-white/70 mt-3 text-center">
              Your support keeps this tool free for everyone!
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
