import { useState } from 'react';
import { Wand2, Sparkles, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { GlassCard } from './GlassCard';
import { Badge } from './ui/badge';
import { autoEnhance, EnhancementResult } from '../utils/autoEnhance';
import { toast } from 'sonner@2.0.3';

interface AutoEnhancePanelProps {
  uploadedImage: string | null;
  onApplyEnhancement: (result: EnhancementResult) => void;
}

export function AutoEnhancePanel({ uploadedImage, onApplyEnhancement }: AutoEnhancePanelProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAutoEnhance = async (style: 'natural' | 'vibrant' | 'professional' | 'passport') => {
    if (!uploadedImage) return;

    setIsProcessing(true);
    try {
      const result = await autoEnhance(uploadedImage, style);
      onApplyEnhancement(result);
      toast.success('Auto-enhanced!', {
        description: result.description,
      });
    } catch (error) {
      console.error('Auto-enhance failed:', error);
      toast.error('Enhancement failed', {
        description: 'Please try again',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const enhanceStyles = [
    {
      id: 'natural',
      name: 'Natural',
      icon: '🌿',
      description: 'Subtle, balanced enhancements',
      gradient: 'from-green-400 to-emerald-500',
    },
    {
      id: 'vibrant',
      name: 'Vibrant',
      icon: '🌈',
      description: 'Bold colors and contrast',
      gradient: 'from-pink-400 to-purple-500',
    },
    {
      id: 'professional',
      name: 'Professional',
      icon: '💼',
      description: 'Clean, business look',
      gradient: 'from-blue-400 to-indigo-500',
    },
    {
      id: 'passport',
      name: 'Passport',
      icon: '🛂',
      description: 'Optimized for ID photos',
      gradient: 'from-amber-400 to-orange-500',
    },
  ];

  return (
    <GlassCard delay={0.6}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
            <Wand2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-white flex items-center gap-2">
              Auto-Enhance
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </h2>
            <p className="text-xs text-white/60">AI-powered one-click optimization</p>
          </div>
        </div>

        {!uploadedImage ? (
          <div className="text-center py-6 text-white/50 text-sm">
            Upload a photo to use auto-enhance
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {enhanceStyles.map((style, index) => (
              <motion.div
                key={style.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  onClick={() => handleAutoEnhance(style.id as any)}
                  disabled={isProcessing}
                  className={`w-full h-auto p-4 bg-gradient-to-br ${style.gradient} hover:opacity-90 text-white border-0 rounded-xl transition-all group disabled:opacity-50`}
                >
                  <div className="flex flex-col items-center gap-2 w-full">
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      className="text-3xl"
                    >
                      {style.icon}
                    </motion.div>
                    <div className="text-center">
                      <div className="font-semibold text-sm mb-0.5">{style.name}</div>
                      <div className="text-[10px] text-white/80 leading-tight">
                        {style.description}
                      </div>
                    </div>
                    {isProcessing && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Zap className="w-4 h-4" />
                      </motion.div>
                    )}
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-white/20 p-3">
          <p className="text-xs text-white/80 flex items-start gap-2">
            <Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0 text-yellow-300" />
            <span>
              Auto-enhance analyzes your photo and applies optimal adjustments instantly. 
              You can fine-tune the results manually after.
            </span>
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
