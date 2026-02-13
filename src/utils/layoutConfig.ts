/**
 * Layout Configuration for Passport Photo Sheets
 * Ported from oldWebsite/index.html
 */

export const PHOTO_SIZE_INCHES = 2; // Standard 2x2 inch passport photo

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
    description: 'With measurement grid for precise cutting',
  },
  {
    value: '4x6-2-plain',
    label: '4×6" Print (2 photos - Plain Background)',
    icon: '📄',
    description: 'Clean white background',
  },
  {
    value: '4x6-4',
    label: '4×6" Print (4 photos)',
    icon: '🎴',
    description: '2×2 grid layout',
  },
  {
    value: '4x6',
    label: '4×6" Print (6 photos)',
    icon: '💰',
    description: 'Standard 4×6 print',
  },
  {
    value: '5x7',
    label: '5×7" Print (6 photos)',
    icon: '💵',
    description: 'Larger print with grid',
  },
  {
    value: '8x10',
    label: '8×10" Print (20 photos)',
    icon: '💎',
    description: 'Best value - 20 photos',
    badge: 'Best Value',
  },
];
