/**
 * Intelligent Paper Size Calculator
 * Calculates optimal layouts and filters paper sizes based on photo dimensions
 */

import { PHOTO_SIZE_OPTIONS, LAYOUTS, PAPER_SIZE_OPTIONS } from './layoutConfig';

export interface PaperSizeOption {
  value: string;
  label: string;
  icon: string;
  description: string;
  badge?: string;
  calculatedPhotos?: number;
  recommendationLevel?: 'best' | 'good' | 'okay';
}

/**
 * Calculate how many photos can fit on a paper size for a given photo size
 */
export function calculatePhotoFit(
  paperWidth: number,
  paperHeight: number,
  photoWidth: number,
  photoHeight: number,
  minMargin: number = 0.25,
  minGap: number = 0.1
): { cols: number; rows: number; photos: number; efficiency: number } {
  // Calculate available space with margins
  const availableWidth = paperWidth - (2 * minMargin);
  const availableHeight = paperHeight - (2 * minMargin);

  // Calculate how many photos fit with gaps
  const cols = Math.floor((availableWidth + minGap) / (photoWidth + minGap));
  const rows = Math.floor((availableHeight + minGap) / (photoHeight + minGap));
  const photos = cols * rows;

  // Calculate efficiency (how much of the paper is used)
  const usedWidth = cols * photoWidth + (cols - 1) * minGap;
  const usedHeight = rows * photoHeight + (rows - 1) * minGap;
  const efficiency = (usedWidth * usedHeight) / (availableWidth * availableHeight);

  return { cols, rows, photos, efficiency };
}

/**
 * Get intelligent paper size options based on selected photo size
 */
export function getIntelligentPaperSizes(photoSizeValue: string): PaperSizeOption[] {
  const selectedPhoto = PHOTO_SIZE_OPTIONS.find(ps => ps.value === photoSizeValue);
  if (!selectedPhoto) return PAPER_SIZE_OPTIONS;

  const photoWidth = selectedPhoto.width;
  const photoHeight = selectedPhoto.height;

  // Calculate fit for each paper size
  const optionsWithCalculations = PAPER_SIZE_OPTIONS.map(option => {
    const layout = LAYOUTS[option.value];
    const fit = calculatePhotoFit(layout.width, layout.height, photoWidth, photoHeight);

    // Determine recommendation level based on efficiency and count
    let recommendationLevel: 'best' | 'good' | 'okay' = 'okay';
    if (fit.photos >= 6 && fit.efficiency > 0.7) {
      recommendationLevel = 'best';
    } else if (fit.photos >= 4 && fit.efficiency > 0.6) {
      recommendationLevel = 'good';
    }

    // Update description with calculated photos
    let updatedDescription = option.description;
    if (fit.photos !== layout.photos) {
      updatedDescription = `Fits ${fit.photos} photos (${fit.cols}×${fit.rows}) • ${layout.width}×${layout.height}"`;
    }

    // Add badge for best options
    let badge = option.badge;
    if (recommendationLevel === 'best' && !badge) {
      badge = 'Recommended';
    }

    return {
      ...option,
      description: updatedDescription,
      calculatedPhotos: fit.photos,
      recommendationLevel,
      badge,
    };
  });

  // Sort by recommendation level and photo count
  const sorted = optionsWithCalculations.sort((a, b) => {
    // Prioritize best recommendations
    const levelWeight = { best: 3, good: 2, okay: 1 };
    const levelDiff = levelWeight[b.recommendationLevel!] - levelWeight[a.recommendationLevel!];
    if (levelDiff !== 0) return levelDiff;

    // Then by photo count
    return (b.calculatedPhotos || 0) - (a.calculatedPhotos || 0);
  });

  return sorted;
}

/**
 * Get optimal layout configuration for a photo size on a paper size
 */
export function getOptimalLayout(
  photoSizeValue: string,
  paperSizeValue: string
): {
  cols: number;
  rows: number;
  photos: number;
  useCustomSpacing: boolean;
  spacingType?: string;
  useLandscapeOrientation?: boolean;
} {
  const selectedPhoto = PHOTO_SIZE_OPTIONS.find(ps => ps.value === photoSizeValue);
  const layout = LAYOUTS[paperSizeValue];

  if (!selectedPhoto || !layout) {
    return {
      cols: 2,
      rows: 2,
      photos: 4,
      useCustomSpacing: false,
    };
  }

  const photoWidth = selectedPhoto.width;
  const photoHeight = selectedPhoto.height;
  const fit = calculatePhotoFit(layout.width, layout.height, photoWidth, photoHeight);

  // For 3.5×5" paper - single centered photo with guides (printer safe margins)
  if (paperSizeValue === '3.5x5') {
    return {
      cols: 1,
      rows: 1,
      photos: 1,
      useCustomSpacing: true,
      spacingType: 'single-centered-with-guides',
    };
  }

  // For 2-photo layouts, check if landscape orientation is better
  if (fit.photos === 2 || paperSizeValue.includes('-2-')) {
    // Special case: 2.1×2.7" photos on 4×6" paper - use landscape for better fit
    const useLandscape = photoSizeValue === '2.1x2.7' && layout.width === 4 && layout.height === 6;

    // If using landscape, calculate fit with swapped dimensions
    const landscapeFit = useLandscape
      ? calculatePhotoFit(layout.width, layout.height, photoHeight, photoWidth)
      : fit;

    return {
      cols: 1,
      rows: 2,
      photos: 2,
      useCustomSpacing: true,
      spacingType: paperSizeValue.includes('grid') ? 'vertical-apart-grid' : 'vertical-apart-plain',
      useLandscapeOrientation: useLandscape,
    };
  }

  // For 4-photo layouts on 4x6
  if (fit.photos === 4 && layout.width === 4 && layout.height === 6) {
    return {
      cols: fit.cols,
      rows: fit.rows,
      photos: fit.photos,
      useCustomSpacing: true,
      spacingType: 'vertical-centered',
    };
  }

  // For 5x7 paper
  if (layout.width === 5 && layout.height === 7) {
    return {
      cols: fit.cols,
      rows: fit.rows,
      photos: fit.photos,
      useCustomSpacing: true,
      spacingType: 'grid-aligned',
    };
  }

  // Standard grid layout
  return {
    cols: fit.cols,
    rows: fit.rows,
    photos: fit.photos,
    useCustomSpacing: false,
  };
}
