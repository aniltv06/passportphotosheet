/**
 * Canvas Renderer for Passport Photo Sheets
 * Ported from oldWebsite/index.html:1087-1289
 *
 * This renderer ensures photos are EXACTLY 2x2 inches when printed at the specified DPI
 */

import { LAYOUTS, PHOTO_SIZE_INCHES, Layout } from './layoutConfig';
import { drawBackgroundGrid } from './gridDrawing';

export interface RenderOptions {
  paperSize: string;
  quality: 'high' | 'medium';
  gapEnabled: boolean;
  borderEnabled: boolean;
}

export interface RenderResult {
  canvas: HTMLCanvasElement;
  canvasWidth: number;
  canvasHeight: number;
  photoCount: number;
  dpi: number;
}

/**
 * Creates a photo sheet canvas with proper 2x2 inch photo sizing
 */
export function createPhotoSheet(
  image: HTMLImageElement,
  options: RenderOptions
): RenderResult {
  const layout = LAYOUTS[options.paperSize];
  if (!layout) {
    throw new Error(`Unknown paper size: ${options.paperSize}`);
  }

  const dpi = options.quality === 'high' ? 300 : 200;
  const gapSize = options.gapEnabled ? 0.05 : 0; // 0.05 inches gap

  // Calculate dimensions
  const canvasWidth = layout.width * dpi;
  const canvasHeight = layout.height * dpi;
  const photoSizePx = PHOTO_SIZE_INCHES * dpi;
  const gapSizePx = gapSize * dpi;

  // Debug logging
  console.log('=== Photo Sheet Dimensions ===');
  console.log(`Layout: ${options.paperSize} (${layout.width}" × ${layout.height}")`);
  console.log(`DPI: ${dpi}`);
  console.log(`Canvas: ${canvasWidth}px × ${canvasHeight}px`);
  console.log(`Photo size constant: ${PHOTO_SIZE_INCHES} inches`);
  console.log(`Photo size in pixels: ${photoSizePx}px × ${photoSizePx}px`);
  console.log(`Photo size in inches: ${photoSizePx / dpi}" × ${photoSizePx / dpi}"`);
  console.log('============================');

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Fill background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Enable image smoothing for better quality
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Handle custom spacing layouts
  if (layout.customSpacing) {
    if (
      layout.spacingType === 'vertical-apart-grid' ||
      layout.spacingType === 'vertical-apart-plain'
    ) {
      renderVerticalApartLayout(ctx, image, layout, photoSizePx, canvasWidth, canvasHeight, dpi, gapSizePx, options);
    } else if (layout.spacingType === 'vertical-centered') {
      renderVerticalCenteredLayout(ctx, image, layout, photoSizePx, gapSizePx, canvasWidth, canvasHeight, options);
    } else if (layout.spacingType === 'grid-aligned') {
      renderGridAlignedLayout(ctx, image, layout, photoSizePx, dpi, canvasWidth, canvasHeight, options);
    }
  } else {
    renderStandardGrid(ctx, image, layout, photoSizePx, gapSizePx, canvasWidth, canvasHeight, options);
  }

  return {
    canvas,
    canvasWidth,
    canvasHeight,
    photoCount: layout.photos,
    dpi,
  };
}

/**
 * Render 4x6 2-photo layout with grid or plain background
 */
function renderVerticalApartLayout(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  layout: Layout,
  photoSizePx: number,
  canvasWidth: number,
  canvasHeight: number,
  dpi: number,
  gapSizePx: number,
  options: RenderOptions
): void {
  const topMargin = 0.5 * dpi; // 0.5" top
  const middleGap = 1.0 * dpi; // 1.0" between photos
  const x = (canvasWidth - photoSizePx) / 2; // Center horizontally

  // Draw background grid if grid variant
  if (layout.forceGrid) {
    drawBackgroundGrid(ctx, canvasWidth, canvasHeight, dpi);
  }

  // Reset context properties for photo drawing
  ctx.globalAlpha = 1.0;
  ctx.globalCompositeOperation = 'source-over';
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  for (let row = 0; row < layout.rows; row++) {
    const y = topMargin + row * (photoSizePx + middleGap);
    ctx.drawImage(image, x, y, photoSizePx, photoSizePx);

    if (options.gapEnabled) {
      ctx.strokeStyle = '#CCCCCC';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, photoSizePx, photoSizePx);
    }

    if (options.borderEnabled) {
      ctx.strokeStyle = '#CCCCCC';
      ctx.lineWidth = Math.max(0.5, dpi / 150);
      const borderOffset = ctx.lineWidth / 2;
      ctx.strokeRect(
        x + borderOffset,
        y + borderOffset,
        photoSizePx - ctx.lineWidth,
        photoSizePx - ctx.lineWidth
      );
    }
  }
}

/**
 * Render 4x6 4-photo centered layout
 */
function renderVerticalCenteredLayout(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  layout: Layout,
  photoSizePx: number,
  gapSizePx: number,
  canvasWidth: number,
  canvasHeight: number,
  options: RenderOptions
): void {
  const totalPhotosWidth = layout.cols * photoSizePx + gapSizePx;
  const totalPhotosHeight = layout.rows * photoSizePx + gapSizePx;
  const startX = (canvasWidth - totalPhotosWidth) / 2;
  const startY = (canvasHeight - totalPhotosHeight) / 2;

  for (let row = 0; row < layout.rows; row++) {
    for (let col = 0; col < layout.cols; col++) {
      const x = startX + col * (photoSizePx + gapSizePx);
      const y = startY + row * (photoSizePx + gapSizePx);

      ctx.drawImage(image, x, y, photoSizePx, photoSizePx);

      if (options.gapEnabled) {
        ctx.strokeStyle = '#CCCCCC';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, photoSizePx, photoSizePx);
      }

      if (options.borderEnabled) {
        ctx.strokeStyle = '#CCCCCC';
        ctx.lineWidth = Math.max(0.5, 300 / 150);
        const borderOffset = ctx.lineWidth / 2;
        ctx.strokeRect(
          x + borderOffset,
          y + borderOffset,
          photoSizePx - ctx.lineWidth,
          photoSizePx - ctx.lineWidth
        );
      }
    }
  }
}

/**
 * Render 5x7 layout with grid alignment
 */
function renderGridAlignedLayout(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  layout: Layout,
  photoSizePx: number,
  dpi: number,
  canvasWidth: number,
  canvasHeight: number,
  options: RenderOptions
): void {
  const leftMargin = 0.25 * dpi;
  const topMargin = 0.25 * dpi;
  const colGap = 0.5 * dpi;
  const rowGap = 0.25 * dpi;

  // Draw background grid
  drawBackgroundGrid(ctx, canvasWidth, canvasHeight, dpi);

  // Reset context properties for photo drawing
  ctx.globalAlpha = 1.0;
  ctx.globalCompositeOperation = 'source-over';
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  for (let row = 0; row < layout.rows; row++) {
    for (let col = 0; col < layout.cols; col++) {
      const x = leftMargin + col * (photoSizePx + colGap);
      const y = topMargin + row * (photoSizePx + rowGap);

      ctx.drawImage(image, x, y, photoSizePx, photoSizePx);

      if (options.gapEnabled) {
        ctx.strokeStyle = '#CCCCCC';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, photoSizePx, photoSizePx);
      }

      if (options.borderEnabled) {
        ctx.strokeStyle = '#CCCCCC';
        ctx.lineWidth = Math.max(0.5, dpi / 150);
        const borderOffset = ctx.lineWidth / 2;
        ctx.strokeRect(
          x + borderOffset,
          y + borderOffset,
          photoSizePx - ctx.lineWidth,
          photoSizePx - ctx.lineWidth
        );
      }
    }
  }
}

/**
 * Render standard grid layout (4x6-6, 8x10, etc.)
 */
function renderStandardGrid(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  layout: Layout,
  photoSizePx: number,
  gapSizePx: number,
  canvasWidth: number,
  canvasHeight: number,
  options: RenderOptions
): void {
  const totalPhotosWidth = layout.cols * photoSizePx + (layout.cols - 1) * gapSizePx;
  const totalPhotosHeight = layout.rows * photoSizePx + (layout.rows - 1) * gapSizePx;
  const startX = (canvasWidth - totalPhotosWidth) / 2;
  const startY = (canvasHeight - totalPhotosHeight) / 2;

  for (let row = 0; row < layout.rows; row++) {
    for (let col = 0; col < layout.cols; col++) {
      const x = startX + col * (photoSizePx + gapSizePx);
      const y = startY + row * (photoSizePx + gapSizePx);

      ctx.drawImage(image, x, y, photoSizePx, photoSizePx);

      if (options.gapEnabled) {
        ctx.strokeStyle = '#CCCCCC';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, photoSizePx, photoSizePx);
      }

      if (options.borderEnabled) {
        ctx.strokeStyle = '#CCCCCC';
        ctx.lineWidth = Math.max(0.5, 300 / 150);
        const borderOffset = ctx.lineWidth / 2;
        ctx.strokeRect(
          x + borderOffset,
          y + borderOffset,
          photoSizePx - ctx.lineWidth,
          photoSizePx - ctx.lineWidth
        );
      }
    }
  }
}

/**
 * Download canvas as JPEG with proper quality
 */
export function downloadPhotoSheet(
  canvas: HTMLCanvasElement,
  paperSize: string,
  dpi: number
): void {
  canvas.toBlob(
    (blob) => {
      if (!blob) {
        throw new Error('Failed to create blob');
      }

      const link = document.createElement('a');
      const timestamp = new Date().toISOString().slice(0, 10);
      link.download = `photo-sheet-${paperSize}-${timestamp}.jpg`;

      const url = URL.createObjectURL(blob);
      link.href = url;
      link.click();

      // Clean up
      setTimeout(() => URL.revokeObjectURL(url), 100);
    },
    'image/jpeg',
    0.95
  );
}
