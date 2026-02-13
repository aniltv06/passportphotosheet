import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'dark' | 'midnight' | 'sunset' | 'ocean' | 'forest' | 'rose';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const themes = {
  dark: {
    name: 'Dark Purple',
    gradient: 'from-indigo-950 via-purple-900 to-pink-950',
    orb1: 'bg-indigo-500/30',
    orb2: 'bg-purple-500/30',
    orb3: 'bg-pink-500/30',
    accent: 'from-indigo-500 via-purple-500 to-pink-500',
    preview: '🌌',
  },
  midnight: {
    name: 'Midnight Blue',
    gradient: 'from-slate-950 via-blue-950 to-slate-900',
    orb1: 'bg-blue-500/30',
    orb2: 'bg-cyan-500/30',
    orb3: 'bg-indigo-500/30',
    accent: 'from-blue-500 via-cyan-500 to-indigo-500',
    preview: '🌙',
  },
  sunset: {
    name: 'Sunset',
    gradient: 'from-orange-950 via-red-900 to-purple-950',
    orb1: 'bg-orange-500/30',
    orb2: 'bg-red-500/30',
    orb3: 'bg-purple-500/30',
    accent: 'from-orange-500 via-red-500 to-purple-500',
    preview: '🌅',
  },
  ocean: {
    name: 'Ocean',
    gradient: 'from-blue-950 via-teal-900 to-cyan-950',
    orb1: 'bg-blue-500/30',
    orb2: 'bg-teal-500/30',
    orb3: 'bg-cyan-500/30',
    accent: 'from-blue-500 via-teal-500 to-cyan-500',
    preview: '🌊',
  },
  forest: {
    name: 'Forest',
    gradient: 'from-green-950 via-emerald-900 to-teal-950',
    orb1: 'bg-green-500/30',
    orb2: 'bg-emerald-500/30',
    orb3: 'bg-teal-500/30',
    accent: 'from-green-500 via-emerald-500 to-teal-500',
    preview: '🌲',
  },
  rose: {
    name: 'Rose Gold',
    gradient: 'from-pink-950 via-rose-900 to-amber-950',
    orb1: 'bg-pink-500/30',
    orb2: 'bg-rose-500/30',
    orb3: 'bg-amber-500/30',
    accent: 'from-pink-500 via-rose-500 to-amber-500',
    preview: '🌹',
  },
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'dark';
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
