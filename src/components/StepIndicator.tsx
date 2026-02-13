import { Check } from 'lucide-react';
import { motion } from 'motion/react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const steps = [
    { number: 1, title: 'Upload & Adjust', emoji: '📸' },
    { number: 2, title: 'Preview & Print', emoji: '🖨️' },
  ];

  return (
    <div className="flex items-center justify-center gap-12">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center gap-12">
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Step Circle with Glow */}
            <div className="relative">
              {currentStep >= step.number && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-2xl blur-xl opacity-75"
                />
              )}
              <motion.div
                initial={false}
                animate={{
                  scale: currentStep === step.number ? 1.05 : 1,
                }}
                transition={{ type: 'spring', stiffness: 300 }}
                className={`relative flex items-center justify-center w-16 h-16 rounded-2xl transition-all duration-500 ${
                  currentStep > step.number
                    ? 'bg-gradient-to-br from-emerald-400 to-green-500 shadow-2xl shadow-emerald-500/50'
                    : currentStep === step.number
                    ? 'bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 shadow-2xl shadow-indigo-500/50'
                    : 'bg-white/10 backdrop-blur-sm border-2 border-white/30'
                }`}
              >
                {currentStep > step.number ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  >
                    <Check className="w-7 h-7 text-white" strokeWidth={3} />
                  </motion.div>
                ) : (
                  <span className="text-2xl">{step.emoji}</span>
                )}
              </motion.div>
            </div>

            {/* Step Title */}
            <div className="flex flex-col">
              <span className="text-xs text-white/60 uppercase tracking-wider font-semibold">
                Step {step.number}
              </span>
              <span
                className={`text-lg transition-all duration-300 ${
                  currentStep === step.number
                    ? 'text-white font-semibold'
                    : 'text-white/70'
                }`}
              >
                {step.title}
              </span>
            </div>
          </motion.div>

          {/* Connector Line with Progress */}
          {index < totalSteps - 1 && (
            <div className="relative w-32 h-1 bg-white/10 backdrop-blur-sm rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: currentStep > step.number ? '100%' : '0%',
                }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full shadow-lg shadow-emerald-500/50"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
