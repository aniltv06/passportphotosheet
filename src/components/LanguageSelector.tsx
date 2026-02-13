import { Languages, Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../utils/i18n';
import { motion } from 'motion/react';

const languages: { value: Language; label: string; flag: string }[] = [
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'es', label: 'Español', flag: '🇪🇸' },
  { value: 'fr', label: 'Français', flag: '🇫🇷' },
  { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { value: 'zh', label: '中文', flag: '🇨🇳' },
  { value: 'ja', label: '日本語', flag: '🇯🇵' },
  { value: 'ar', label: 'العربية', flag: '🇸🇦' },
  { value: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { value: 'pt', label: 'Português', flag: '🇵🇹' },
  { value: 'ru', label: 'Русский', flag: '🇷🇺' },
];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const currentLang = languages.find(l => l.value === language);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="relative"
    >
      <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
        <SelectTrigger className="w-auto min-w-[140px] h-12 bg-white/10 border-white/30 text-white rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all gap-2">
          <Globe className="w-4 h-4" />
          <SelectValue>
            <div className="flex items-center gap-2">
              <span className="text-lg">{currentLang?.flag}</span>
              <span className="hidden sm:inline">{currentLang?.label}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-white/20 max-h-[400px]">
          {languages.map((lang) => (
            <SelectItem 
              key={lang.value} 
              value={lang.value}
              className="text-white hover:bg-white/10 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{lang.flag}</span>
                <span>{lang.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </motion.div>
  );
}
