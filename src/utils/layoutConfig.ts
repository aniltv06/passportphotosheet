/**
 * Layout Configuration for Passport Photo Sheets
 * Ported from oldWebsite/index.html
 */

export const PHOTO_SIZE_INCHES = 2; // Default 2x2 inch passport photo

// Photo size options for different countries/requirements
export interface PhotoSize {
  value: string;
  label: string;
  width: number; // in inches
  height: number; // in inches
  description: string;
  pixelsAt300DPI: string;
}

export const PHOTO_SIZE_OPTIONS: PhotoSize[] = [
  {
    value: '2x2',
    label: '2×2" (US Passport)',
    width: 2,
    height: 2,
    description: 'Standard US passport photo',
    pixelsAt300DPI: '600×600px',
  },
  {
    value: '2x2-india',
    label: '2×2" (India Passport)',
    width: 2,
    height: 2,
    description: 'Indian passport photo',
    pixelsAt300DPI: '600×600px',
  },
  {
    value: '2.1x2.7',
    label: '2.1×2.7" (Custom)',
    width: 2.1,
    height: 2.7,
    description: 'Custom photo size',
    pixelsAt300DPI: '630×810px',
  },
  {
    value: '1.5x2',
    label: '1.5×2" (US Visa)',
    width: 1.5,
    height: 2,
    description: 'US Visa photo',
    pixelsAt300DPI: '450×600px',
  },
  {
    value: '35x45mm',
    label: '35×45mm (EU Passport)',
    width: 1.378,
    height: 1.772,
    description: 'European passport photo',
    pixelsAt300DPI: '413×531px',
  },
];

export interface Layout {
  width: number;
  height: number;
  cols: number;
  rows: number;
  photos: number;
  icon: string;
  customSpacing?: boolean;
  spacingType?: string;
  forceGrid?: boolean;
  forceNoGrid?: boolean;
}

export const LAYOUTS: Record<string, Layout> = {
  '4x6-2-grid': {
    width: 4,
    height: 6,
    cols: 1,
    rows: 2,
    photos: 2,
    icon: '📐',
    customSpacing: true,
    spacingType: 'vertical-apart-grid',
    forceGrid: true,
  },
  '4x6-2-plain': {
    width: 4,
    height: 6,
    cols: 1,
    rows: 2,
    photos: 2,
    icon: '📄',
    customSpacing: true,
    spacingType: 'vertical-apart-plain',
    forceNoGrid: true,
  },
  '4x6-4': {
    width: 4,
    height: 6,
    cols: 2,
    rows: 2,
    photos: 4,
    icon: '🎴',
    customSpacing: true,
    spacingType: 'vertical-centered',
  },
  '4x6': {
    width: 4,
    height: 6,
    cols: 2,
    rows: 3,
    photos: 6,
    icon: '💰',
  },
  '5x7': {
    width: 5,
    height: 7,
    cols: 2,
    rows: 3,
    photos: 6,
    icon: '💵',
    customSpacing: true,
    spacingType: 'grid-aligned',
  },
  '6x8': {
    width: 6,
    height: 8,
    cols: 3,
    rows: 4,
    photos: 12,
    icon: '📸',
  },
  '8x10': {
    width: 8,
    height: 10,
    cols: 4,
    rows: 5,
    photos: 20,
    icon: '💎',
  },
};

export const PAPER_SIZE_OPTIONS = [
  {
    value: '4x6-2-grid',
    label: '4×6" Print (2 photos - Grid Background)',
    icon: '📐',
    description: 'With measurement grid • 1200×1800px @ 300 DPI',
  },
  {
    value: '4x6-2-plain',
    label: '4×6" Print (2 photos - Plain Background)',
    icon: '📄',
    description: 'Clean white background • 1200×1800px @ 300 DPI',
  },
  {
    value: '4x6-4',
    label: '4×6" Print (4 photos)',
    icon: '🎴',
    description: '2×2 grid layout • 1200×1800px @ 300 DPI',
  },
  {
    value: '4x6',
    label: '4×6" Print (6 photos)',
    icon: '💰',
    description: 'Standard 4×6 print • 1200×1800px @ 300 DPI',
  },
  {
    value: '5x7',
    label: '5×7" Print (6 photos)',
    icon: '💵',
    description: 'Larger print with grid • 1500×2100px @ 300 DPI',
  },
  {
    value: '6x8',
    label: '6×8" Print (12 photos)',
    icon: '📸',
    description: 'Great value - 12 photos • 1800×2400px @ 300 DPI',
  },
  {
    value: '8x10',
    label: '8×10" Print (20 photos)',
    icon: '💎',
    description: 'Best value - 20 photos • 2400×3000px @ 300 DPI',
    badge: 'Best Value',
  },
];
