import { HelpCircle, Camera, Sliders, Printer, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';
import { Badge } from './ui/badge';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const { t } = useLanguage();

  const faqs = [
    {
      icon: Camera,
      question: 'What photo requirements should I follow?',
      answer: 'Ensure your face fills 70-80% of the frame, look directly at the camera with a neutral expression, use a plain background, and have good even lighting without shadows.',
      color: 'from-blue-400 to-cyan-500',
    },
    {
      icon: Sliders,
      question: 'How do I adjust my photo?',
      answer: 'Use the zoom slider or +/- keys to scale, rotation slider or [ ] keys to rotate, arrow keys to pan, and adjust brightness/contrast for perfect results.',
      color: 'from-purple-400 to-pink-500',
    },
    {
      icon: Printer,
      question: 'What paper size should I use?',
      answer: 'Choose 4×6 inches for home printing, A4 for standard office printers, or Letter size (8.5×11") for US standard printers.',
      color: 'from-green-400 to-emerald-500',
    },
    {
      icon: Zap,
      question: 'Can I save my settings?',
      answer: 'Yes! Your language preference and settings are automatically saved in your browser. Your photo data stays private and is never uploaded to any server.',
      color: 'from-amber-400 to-orange-500',
    },
  ];

  const quickTips = [
    'Press "?" to see all keyboard shortcuts',
    'Drag the photo preview to reposition quickly',
    'Use high image quality (95-100%) for printing',
    'Download single photo first to check before creating sheet',
    'Choose PNG format for best quality, JPG for smaller files',
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-gray-900/95 backdrop-blur-xl border-white/20 text-white">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <DialogTitle className="text-white">{t.help} & {t.faq}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* How to Use */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-xl">📚</span>
              {t.howToUse}
            </h3>
            <div className="space-y-3">
              {[
                { step: 1, text: 'Upload your photo using the upload button', emoji: '📸' },
                { step: 2, text: 'Adjust zoom, rotation, position, brightness, and contrast', emoji: '⚙️' },
                { step: 3, text: 'Select your passport size and background color', emoji: '🎨' },
                { step: 4, text: 'Click "Next Step" to create your print sheet', emoji: '➡️' },
                { step: 5, text: 'Customize grid layout and borders', emoji: '🖼️' },
                { step: 6, text: 'Download or print your passport photo sheet', emoji: '🖨️' },
              ].map((item) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: item.step * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10"
                >
                  <Badge className="bg-indigo-500/30 text-white border-indigo-400/50 w-8 h-8 flex items-center justify-center rounded-full">
                    {item.step}
                  </Badge>
                  <span className="text-xl">{item.emoji}</span>
                  <span className="text-white/90">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-xl">❓</span>
              {t.faq}
            </h3>
            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const Icon = faq.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/20 p-5 hover:border-white/30 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${faq.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold mb-2">{faq.question}</h4>
                        <p className="text-sm text-white/70 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Quick Tips */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-xl">⚡</span>
              Quick Tips
            </h3>
            <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-2xl border border-yellow-400/30 p-5">
              <ul className="space-y-2">
                {quickTips.map((tip, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-2 text-white/90"
                  >
                    <span className="text-yellow-400 mt-0.5">▸</span>
                    <span className="text-sm">{tip}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Support */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl border border-white/20 p-5 text-center"
          >
            <h3 className="text-white font-semibold mb-2">Need More Help?</h3>
            <p className="text-sm text-white/70 mb-4">
              If you're still having issues or have questions, feel free to reach out for support.
            </p>
            <a
              href="mailto:nishitha.1190@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl transition-all"
            >
              {t.contactSupport}
            </a>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
