import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StepIndicator } from './components/StepIndicator';
import { EnhancedPhotoEditor } from './components/EnhancedPhotoEditor';
import { PhotoSheet } from './components/PhotoSheet';
import { SupportBanner } from './components/SupportBanner';
import { OnboardingTour } from './components/OnboardingTour';
import { LanguageSelector } from './components/LanguageSelector';
import { ThemeSelector } from './components/ThemeSelector';
import { SettingsModal } from './components/SettingsModal';
import { HelpModal } from './components/HelpModal';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { ThemeProvider, useTheme, themes } from './contexts/ThemeContext';
import { Camera, Stars, Settings, HelpCircle, Coffee, Linkedin } from 'lucide-react';
import { Button } from './components/ui/button';

function AppContent() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const currentTheme = themes[theme];
  
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [passportSize, setPassportSize] = useState('2x2');
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [paperSize, setPaperSize] = useState('4x6-2-grid');
  const [borderWidth, setBorderWidth] = useState(2);
  const [borderColor, setBorderColor] = useState('#ffffff');
  const [backgroundColor, setBackgroundColor] = useState('original');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [exportFormat, setExportFormat] = useState('png');
  const [imageQuality, setImageQuality] = useState(95);

  const handleNext = () => {
    if (uploadedImage) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Skip to main content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-gray-900 focus:px-4 focus:py-2 focus:rounded-xl focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Skip to main content
      </a>

      {/* Animated Background with Theme */}
      <div className={`fixed inset-0 bg-gradient-to-br ${currentTheme.gradient}`}>
        {/* Animated gradient orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute top-0 -left-40 w-96 h-96 ${currentTheme.orb1} rounded-full blur-3xl`}
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute top-1/4 right-0 w-[32rem] h-[32rem] ${currentTheme.orb2} rounded-full blur-3xl`}
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute bottom-0 left-1/3 w-96 h-96 ${currentTheme.orb3} rounded-full blur-3xl`}
        />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />
      </div>

      {/* Onboarding Tour */}
      {showOnboarding && (
        <OnboardingTour onComplete={() => setShowOnboarding(false)} />
      )}

      {/* Header with Glassmorphism */}
      <header className="relative z-10 backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between gap-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 sm:gap-4"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className={`absolute inset-0 bg-gradient-to-r ${currentTheme.accent} rounded-2xl blur-lg opacity-75`}
                />
                <div className={`relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${currentTheme.accent} rounded-2xl flex items-center justify-center shadow-2xl`}>
                  <Camera className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-white flex items-center gap-2 text-lg sm:text-2xl">
                  <span className="hidden sm:inline">{t.appName}</span>
                  <span className="sm:hidden">Passport Photo</span>
                  <motion.div
                    animate={{ rotate: [0, 10, 0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Stars className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
                  </motion.div>
                </h1>
                <p className="text-xs sm:text-sm text-white/70 hidden sm:block">{t.appTagline}</p>
              </div>
            </motion.div>
            
            {/* Right side buttons */}
            <div className="flex items-center gap-2">
              {/* Theme Selector */}
              <ThemeSelector />

              {/* Help Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Button
                  onClick={() => setShowHelp(true)}
                  className="w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl"
                  aria-label="Open help"
                >
                  <HelpCircle className="w-5 h-5" aria-hidden="true" />
                  <span className="hidden sm:inline ml-2">{t.help}</span>
                </Button>
              </motion.div>

              {/* Settings Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 }}
              >
                <Button
                  onClick={() => setShowSettings(true)}
                  className="w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl"
                  aria-label="Open settings"
                >
                  <Settings className="w-5 h-5" aria-hidden="true" />
                  <span className="hidden sm:inline ml-2">{t.settings}</span>
                </Button>
              </motion.div>

              {/* Language Selector */}
              <LanguageSelector />
              
              {/* Support CTA */}
              <motion.a
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://buymeacoffee.com/NishithaAnil"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-gray-900 rounded-2xl transition-all duration-200 shadow-2xl hover:shadow-amber-500/50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-1.001-1.379-.197-.069-.42-.098-.57-.241-.152-.143-.196-.366-.231-.572-.065-.378-.125-.756-.192-1.133-.057-.325-.102-.69-.25-.987-.195-.4-.597-.634-.996-.788a5.723 5.723 0 00-.626-.194c-1-.263-2.05-.36-3.077-.416a25.834 25.834 0 00-3.7.062c-.915.083-1.88.184-2.75.5-.318.116-.646.256-.888.501-.297.302-.393.77-.177 1.146.154.267.415.456.692.58.36.162.737.284 1.123.366 1.075.238 2.189.331 3.287.37 1.218.05 2.437.01 3.65-.118.299-.033.598-.073.896-.119.352-.054.578-.513.474-.834-.124-.383-.457-.531-.834-.473-.466.074-.96.108-1.382.146-1.177.08-2.358.082-3.536.006a22.228 22.228 0 01-1.157-.107c-.086-.01-.18-.025-.258-.036-.243-.036-.484-.08-.724-.13-.111-.027-.111-.185 0-.212h.005c.277-.06.557-.108.838-.147h.002c.131-.009.263-.032.394-.048a25.076 25.076 0 013.426-.12c.674.019 1.347.067 2.017.144l.228.031c.267.04.533.088.798.145.392.085.895.113 1.07.542.055.137.08.288.111.431l.319 1.484a.237.237 0 01-.199.284h-.003c-.037.006-.075.01-.112.015a36.704 36.704 0 01-4.743.295 37.059 37.059 0 01-4.699-.304c-.14-.017-.293-.042-.417-.06-.326-.048-.649-.108-.973-.161-.393-.065-.768-.032-1.123.161-.29.16-.527.404-.675.701-.154.316-.199.66-.267 1-.069.34-.176.707-.135 1.056.087.753.613 1.365 1.37 1.502a39.69 39.69 0 0011.343.376.483.483 0 01.535.53l-.071.697-1.018 9.907c-.041.41-.047.832-.125 1.237-.122.637-.553 1.028-1.182 1.171-.577.131-1.165.2-1.756.205-.656.004-1.31-.025-1.966-.022-.699.004-1.556-.06-2.095-.58-.475-.458-.54-1.174-.605-1.793l-.731-7.013-.322-3.094c-.037-.351-.286-.695-.678-.678-.336.015-.718.3-.678.679l.228 2.185.949 9.112c.147 1.344 1.174 2.068 2.446 2.272.742.12 1.503.144 2.257.156.966.016 1.942.053 2.892-.122 1.408-.258 2.465-1.198 2.616-2.657.34-3.332.683-6.663 1.024-9.995l.215-2.087a.484.484 0 01.39-.426c.402-.078.787-.212 1.074-.518.455-.488.546-1.124.385-1.766zm-1.478.772c-.145.137-.363.201-.578.233-2.416.359-4.866.54-7.308.46-1.748-.06-3.477-.254-5.207-.498-.17-.024-.353-.055-.47-.18-.22-.236-.111-.71-.054-.995.052-.26.152-.609.463-.646.484-.057 1.046.148 1.526.22.577.088 1.156.159 1.737.212 2.48.226 5.002.19 7.472-.14.45-.06.899-.13 1.345-.21.399-.072.84-.206 1.08.206.166.281.188.657.162.974a.544.544 0 01-.169.364zm-6.159 3.9c-.862.37-1.84.788-3.109.788a5.884 5.884 0 01-1.569-.217l.877 9.004c.065.78.717 1.38 1.5 1.38 0 0 1.243.065 1.658.065.447 0 1.786-.065 1.786-.065.783 0 1.434-.6 1.499-1.38l.94-9.95a3.996 3.996 0 00-1.322-.238c-.826 0-1.491.284-2.26.613z"/>
                </svg>
                <span className="font-semibold">{t.supportButton}</span>
              </motion.a>
            </div>
          </div>
        </div>
      </header>

      {/* Step Indicator */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-6 sm:py-10">
        <StepIndicator currentStep={currentStep} totalSteps={2} />
      </div>

      {/* Main Content with Animation */}
      <main id="main-content" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <AnimatePresence mode="wait">
          {currentStep === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <EnhancedPhotoEditor
                uploadedImage={uploadedImage}
                setUploadedImage={setUploadedImage}
                passportSize={passportSize}
                setPassportSize={setPassportSize}
                zoom={zoom}
                setZoom={setZoom}
                rotation={rotation}
                setRotation={setRotation}
                backgroundColor={backgroundColor}
                setBackgroundColor={setBackgroundColor}
                brightness={brightness}
                setBrightness={setBrightness}
                contrast={contrast}
                setContrast={setContrast}
                panX={panX}
                setPanX={setPanX}
                panY={panY}
                setPanY={setPanY}
                onNext={handleNext}
              />
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <PhotoSheet
                uploadedImage={uploadedImage}
                passportSize={passportSize}
                zoom={zoom}
                rotation={rotation}
                backgroundColor={backgroundColor}
                brightness={brightness}
                contrast={contrast}
                panX={panX}
                panY={panY}
                paperSize={paperSize}
                setPaperSize={setPaperSize}
                borderWidth={borderWidth}
                setBorderWidth={setBorderWidth}
                borderColor={borderColor}
                setBorderColor={setBorderColor}
                onBack={handleBack}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Support Banner */}
      <SupportBanner />

      {/* Modals */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        exportFormat={exportFormat}
        setExportFormat={setExportFormat}
        imageQuality={imageQuality}
        setImageQuality={setImageQuality}
      />

      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />

      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Footer with Legal Links */}
      <footer className="relative z-10 mt-16 py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-4">
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm">
              <a
                href="/privacy-policy.html"
                className="text-white/70 hover:text-white transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
              <span className="text-white/30">•</span>
              <a
                href="/terms-conditions.html"
                className="text-white/70 hover:text-white transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms & Conditions
              </a>
              <span className="text-white/30">•</span>
              <a
                href="https://buymeacoffee.com/NishithaAnil"
                className="text-white/70 hover:text-white transition-colors duration-200 inline-flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Coffee className="w-3.5 h-3.5" />
                Support
              </a>
              <span className="text-white/30">•</span>
              <a
                href="mailto:nishitha.1190@gmail.com"
                className="text-white/70 hover:text-white transition-colors duration-200"
              >
                Contact Us
              </a>
              <span className="text-white/30">•</span>
              <a
                href="https://www.linkedin.com/in/nishitha-anil/"
                className="text-white/70 hover:text-white transition-colors duration-200 inline-flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-3.5 h-3.5" />
                LinkedIn
              </a>
            </div>
            <p className="text-white/50 text-xs sm:text-sm">
              © {new Date().getFullYear()} Passport Photo Maker. All rights reserved.
            </p>
            <p className="text-white/40 text-xs">
              🔒 Your photos never leave your device. 100% client-side processing.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}
