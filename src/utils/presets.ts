export interface PhotoPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  settings: {
    passportSize: string;
    backgroundColor: string;
    brightness: number;
    contrast: number;
    saturation: number;
  };
  isCustom?: boolean;
}

export const defaultPresets: PhotoPreset[] = [
  {
    id: 'us-passport',
    name: 'US Passport',
    description: 'Standard US passport photo requirements',
    icon: '🇺🇸',
    settings: {
      passportSize: '2x2',
      backgroundColor: 'white',
      brightness: 105,
      contrast: 100,
      saturation: 100,
    },
  },
  {
    id: 'eu-passport',
    name: 'EU Passport',
    description: 'European passport photo standards',
    icon: '🇪🇺',
    settings: {
      passportSize: '35x45',
      backgroundColor: 'lightgray',
      brightness: 105,
      contrast: 100,
      saturation: 100,
    },
  },
  {
    id: 'india-visa',
    name: 'India Visa',
    description: 'Indian visa photo requirements',
    icon: '🇮🇳',
    settings: {
      passportSize: '33x48',
      backgroundColor: 'white',
      brightness: 110,
      contrast: 105,
      saturation: 100,
    },
  },
  {
    id: 'professional-bw',
    name: 'Professional B&W',
    description: 'Black and white professional headshot',
    icon: '🎩',
    settings: {
      passportSize: '2x2',
      backgroundColor: 'white',
      brightness: 110,
      contrast: 115,
      saturation: 0,
    },
  },
  {
    id: 'vibrant',
    name: 'Vibrant Colors',
    description: 'Enhanced colors for social media',
    icon: '🌈',
    settings: {
      passportSize: '2x2',
      backgroundColor: 'original',
      brightness: 105,
      contrast: 110,
      saturation: 130,
    },
  },
  {
    id: 'soft',
    name: 'Soft & Natural',
    description: 'Soft lighting for a natural look',
    icon: '✨',
    settings: {
      passportSize: '2x2',
      backgroundColor: 'cream',
      brightness: 108,
      contrast: 95,
      saturation: 95,
    },
  },
];

const CUSTOM_PRESETS_KEY = 'passport_photo_custom_presets';

export function getCustomPresets(): PhotoPreset[] {
  try {
    const stored = localStorage.getItem(CUSTOM_PRESETS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load custom presets:', error);
    return [];
  }
}

export function getAllPresets(): PhotoPreset[] {
  return [...defaultPresets, ...getCustomPresets()];
}

export function saveCustomPreset(preset: Omit<PhotoPreset, 'id' | 'isCustom'>): void {
  try {
    const customPresets = getCustomPresets();
    const newPreset: PhotoPreset = {
      ...preset,
      id: `custom-${Date.now()}`,
      isCustom: true,
    };

    customPresets.push(newPreset);
    localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(customPresets));
  } catch (error) {
    console.error('Failed to save custom preset:', error);
  }
}

export function deleteCustomPreset(id: string): void {
  try {
    const customPresets = getCustomPresets();
    const filtered = customPresets.filter(preset => preset.id !== id);
    localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete custom preset:', error);
  }
}
