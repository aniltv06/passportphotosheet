import { useState } from 'react';
import { Menu, X, Home, Info, Heart, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Menu"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 top-[73px]"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-[73px] bottom-0 w-72 bg-white shadow-2xl z-50 p-6"
            >
              <nav className="space-y-2">
                <a
                  href="#home"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Home className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Home</span>
                </a>

                <a
                  href="#features"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Info className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Features</span>
                </a>

                <a
                  href="#help"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <HelpCircle className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Help</span>
                </a>

                <div className="pt-4 mt-4 border-t border-gray-200">
                  <a
                    href="https://buymeacoffee.com/NishithaAnil"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-400 hover:bg-amber-500 text-gray-900 rounded-lg transition-all duration-200 shadow-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <Heart className="w-5 h-5" />
                    <span>Support This Tool</span>
                  </a>
                </div>
              </nav>

              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-100">
                  <p className="text-sm text-indigo-900 mb-1">💡 Pro Tip</p>
                  <p className="text-xs text-indigo-700">
                    Use keyboard shortcuts for faster editing. Press "?" to see all shortcuts.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
