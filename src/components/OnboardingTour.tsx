import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, Upload, Sliders, Printer, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

interface OnboardingTourProps {
  onComplete: () => void;
}

export function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if user has seen the tour
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setShow(true);
    }
  }, []);

  const steps = [
    {
      icon: Upload,
      title: 'Welcome to Passport Photo Maker!',
      description: 'Create professional passport photos in just 2 easy steps. Let me show you how it works.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Sliders,
      title: 'Step 1: Upload & Adjust',
      description: 'Upload your photo and use our tools to zoom, rotate, adjust brightness, and position your photo perfectly. Use keyboard shortcuts for precise control!',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Printer,
      title: 'Step 2: Print Your Sheet',
      description: 'Customize your photo sheet with different paper sizes, grid layouts, and borders. Then download or print!',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Sparkles,
      title: 'You\'re All Set!',
      description: 'Press "?" anytime to see keyboard shortcuts. If you find this tool helpful, consider supporting development. Happy photo making!',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleSkip = () => {
    handleClose();
  };

  const handleClose = () => {
    localStorage.setItem('hasSeenTour', 'true');
    setShow(false);
    onComplete();
  };

  if (!show) return null;

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleSkip}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with gradient */}
          <div className={`bg-gradient-to-r ${step.color} p-8 text-white relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              aria-label="Close tour"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>

            <div className="relative">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
                <Icon className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">{step.title}</h2>
              <p className="text-white/90 leading-relaxed">{step.description}</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-6">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? 'w-8 bg-indigo-500'
                      : index < currentStep
                      ? 'w-2 bg-green-500'
                      : 'w-2 bg-gray-200'
                  }`}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {currentStep > 0 && (
                <Button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
              )}
              <Button
                onClick={handleNext}
                className={`flex-1 bg-gradient-to-r ${step.color} hover:opacity-90 transition-opacity`}
              >
                {currentStep === steps.length - 1 ? (
                  'Get Started'
                ) : (
                  <>
                    Next <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>

            {currentStep === 0 && (
              <button
                onClick={handleSkip}
                className="w-full text-center text-sm text-gray-500 hover:text-gray-700 mt-4 transition-colors"
              >
                Skip tutorial
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
