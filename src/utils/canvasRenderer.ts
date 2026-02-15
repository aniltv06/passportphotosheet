/**
 * Canvas Renderer for Passport Photo Sheets
 * Ported from oldWebsite/index.html:1087-1289
 *
 * This renderer ensures photos are at the exact specified dimensions when printed at the specified DPI
 */

import { LAYOUTS, Layout } from './layoutConfig';
import { drawBackgroundGrid } from './gridDrawing';

export interface RenderOptions {
  paperSize: string;
  quality: 'high' | 'medium';
  gapEnabled: boolean;
  borderEnabled: boolean;
  // Photo size (in inches)
  photoWidth?: number;
  photoHeight?: number;
  // Photo transformations
  zoom?: number;
  rotation?: number;
  panX?: number;
  panY?: number;
  brightness?: number;
  contrast?: number;
  backgroundColor?: string;
}

export interface RenderResult {
  canvas: HTMLCanvasElement;
  canvasWidth: number;
  canvasHeight: number;
  photoCount: number;
  dpi: number;
}

/**
 * Apply transformations to the uploaded image to create an edited version
 */
function createEditedImage(
  sourceImage: HTMLImageElement,
  options: RenderOptions,
  photoWidthPx: number,
  photoHeightPx: number
): HTMLCanvasElement {
  const editCanvas = document.createElement('canvas');
  editCanvas.width = photoWidthPx;
  editCanvas.height = photoHeightPx;

  const ctx = editCanvas.getContext('2d', { alpha: false });
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Fill background color
  const bgColors: Record<string, string> = {
    white: '#ffffff',
    lightgray: '#f3f4f6',
    lightblue: '#dbeafe',
    cream: '#fef3c7',
    original: '#ffffff'
  };
  ctx.fillStyle = bgColors[options.backgroundColor || 'original'] || '#ffffff';
  ctx.fillRect(0, 0, photoWidthPx, photoHeightPx);

  // Apply filters
  const brightness = options.brightness || 100;
  const contrast = options.contrast || 100;
  ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

  // Save context for transformations
  ctx.save();

  // Move to center for rotation and zoom
  ctx.translate(photoWidthPx / 2, photoHeightPx / 2);

  // Apply rotation
  const rotation = options.rotation || 0;
  ctx.rotate((rotation * Math.PI) / 180);

  // Apply zoom
  const zoom = options.zoom || 100;
  const scale = zoom / 100;

  // Apply pan
  const panX = options.panX || 0;
  const panY = options.panY || 0;

  // Calculate image dimensions to cover the canvas
  const imageAspect = sourceImage.width / sourceImage.height;
  const canvasAspect = photoWidthPx / photoHeightPx;
  let drawWidth, drawHeight;

  if (imageAspect > canvasAspect) {
    // Image is wider than canvas
    drawHeight = photoHeightPx * scale;
    drawWidth = drawHeight * imageAspect;
  } else {
    // Image is taller or same aspect as canvas
    drawWidth = photoWidthPx * scale;
    drawHeight = drawWidth / imageAspect;
  }

  // Draw image centered with transformations applied
  ctx.drawImage(
    sourceImage,
    -drawWidth / 2 + panX,
    -drawHeight / 2 + panY,
    drawWidth,
    drawHeight
  );

  ctx.restore();

  return editCanvas;
}

/**
 * Creates a photo sheet canvas with the specified photo dimensions
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

  // Use provided photo dimensions or default to 2x2
  const photoWidth = options.photoWidth || 2;
  const photoHeight = options.photoHeight || 2;

  // Calculate dimensions
  const canvasWidth = layout.width * dpi;
  const canvasHeight = layout.height * dpi;
  const photoWidthPx = photoWidth * dpi;
  const photoHeightPx = photoHeight * dpi;
  const gapSizePx = gapSize * dpi;

  // Create edited version of the image with all transformations applied
  const editedImage = createEditedImage(image, options, photoWidthPx, photoHeightPx);

  // Debug logging
  console.log('=== Photo Sheet Dimensions ===');
  console.log(`Layout: ${options.paperSize} (${layout.width}" × ${layout.height}")`);
  console.log(`DPI: ${dpi}`);
  console.log(`Canvas: ${canvasWidth}px × ${canvasHeight}px`);
  console.log(`Photo size: ${photoWidth}" × ${photoHeight}"`);
  console.log(`Photo size in pixels: ${photoWidthPx}px × ${photoHeightPx}px`);
  console.log(`Edits applied: zoom=${options.zoom}, rotation=${options.rotation}, brightness=${options.brightness}, contrast=${options.contrast}`);
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

  // Handle custom spacing layouts - now passing editedImage instead of original image
  if (layout.customSpacing) {
    if (
      layout.spacingType === 'vertical-apart-grid' ||
      layout.spacingType === 'vertical-apart-plain'
    ) {
      renderVerticalApartLayout(ctx, editedImage, layout, photoWidthPx, photoHeightPx, canvasWidth, canvasHeight, dpi, gapSizePx, options);
    } else if (layout.spacingType === 'vertical-centered') {
      renderVerticalCenteredLayout(ctx, editedImage, layout, photoWidthPx, photoHeightPx, gapSizePx, canvasWidth, canvasHeight, options);
    } else if (layout.spacingType === 'grid-aligned') {
      renderGridAlignedLayout(ctx, editedImage, layout, photoWidthPx, photoHeightPx, dpi, canvasWidth, canvasHeight, options);
    }
  } else {
    renderStandardGrid(ctx, editedImage, layout, photoWidthPx, photoHeightPx, gapSizePx, canvasWidth, canvasHeight, options);
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
  image: HTMLImageElement | HTMLCanvasElement,
  layout: Layout,
  photoWidthPx: number,
  photoHeightPx: number,
  canvasWidth: number,
  canvasHeight: number,
  dpi: number,
  gapSizePx: number,
  options: RenderOptions
): void {
  const topMargin = 0.5 * dpi; // 0.5" top
  const middleGap = 1.0 * dpi; // 1.0" between photos
  const x = (canvasWidth - photoWidthPx) / 2; // Center horizontally

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
    const y = topMargin + row * (photoHeightPx + middleGap);
    ctx.drawImage(image, x, y, photoWidthPx, photoHeightPx);

    if (options.gapEnabled) {
      ctx.strokeStyle = '#CCCCCC';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, photoWidthPx, photoHeightPx);
    }

    if (options.borderEnabled) {
      ctx.strokeStyle = '#CCCCCC';
      ctx.lineWidth = Math.max(0.5, dpi / 150);
      const borderOffset = ctx.lineWidth / 2;
      ctx.strokeRect(
        x + borderOffset,
        y + borderOffset,
        photoWidthPx - ctx.lineWidth,
        photoHeightPx - ctx.lineWidth
      );
    }
  }
}

/**
 * Render 4x6 4-photo centered layout
 */
function renderVerticalCenteredLayout(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement | HTMLCanvasElement,
  layout: Layout,
  photoWidthPx: number,
  photoHeightPx: number,
  gapSizePx: number,
  canvasWidth: number,
  canvasHeight: number,
  options: RenderOptions
): void {
  const totalPhotosWidth = layout.cols * photoWidthPx + gapSizePx;
  const totalPhotosHeight = layout.rows * photoHeightPx + gapSizePx;
  const startX = (canvasWidth - totalPhotosWidth) / 2;
  const startY = (canvasHeight - totalPhotosHeight) / 2;

  for (let row = 0; row < layout.rows; row++) {
    for (let col = 0; col < layout.cols; col++) {
      const x = startX + col * (photoWidthPx + gapSizePx);
      const y = startY + row * (photoHeightPx + gapSizePx);

      ctx.drawImage(image, x, y, photoWidthPx, photoHeightPx);

      if (options.gapEnabled) {
        ctx.strokeStyle = '#CCCCCC';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, photoWidthPx, photoHeightPx);
      }

      if (options.borderEnabled) {
        ctx.strokeStyle = '#CCCCCC';
        ctx.lineWidth = Math.max(0.5, 300 / 150);
        const borderOffset = ctx.lineWidth / 2;
        ctx.strokeRect(
          x + borderOffset,
          y + borderOffset,
          photoWidthPx - ctx.lineWidth,
          photoHeightPx - ctx.lineWidth
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
  image: HTMLImageElement | HTMLCanvasElement,
  layout: Layout,
  photoWidthPx: number,
  photoHeightPx: number,
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
      const x = leftMargin + col * (photoWidthPx + colGap);
      const y = topMargin + row * (photoHeightPx + rowGap);

      ctx.drawImage(image, x, y, photoWidthPx, photoHeightPx);

      if (options.gapEnabled) {
        ctx.strokeStyle = '#CCCCCC';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, photoWidthPx, photoHeightPx);
      }

      if (options.borderEnabled) {
        ctx.strokeStyle = '#CCCCCC';
        ctx.lineWidth = Math.max(0.5, dpi / 150);
        const borderOffset = ctx.lineWidth / 2;
        ctx.strokeRect(
          x + borderOffset,
          y + borderOffset,
          photoWidthPx - ctx.lineWidth,
          photoHeightPx - ctx.lineWidth
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
  image: HTMLImageElement | HTMLCanvasElement,
  layout: Layout,
  photoWidthPx: number,
  photoHeightPx: number,
  gapSizePx: number,
  canvasWidth: number,
  canvasHeight: number,
  options: RenderOptions
): void {
  const totalPhotosWidth = layout.cols * photoWidthPx + (layout.cols - 1) * gapSizePx;
  const totalPhotosHeight = layout.rows * photoHeightPx + (layout.rows - 1) * gapSizePx;
  const startX = (canvasWidth - totalPhotosWidth) / 2;
  const startY = (canvasHeight - totalPhotosHeight) / 2;

  for (let row = 0; row < layout.rows; row++) {
    for (let col = 0; col < layout.cols; col++) {
      const x = startX + col * (photoWidthPx + gapSizePx);
      const y = startY + row * (photoHeightPx + gapSizePx);

      ctx.drawImage(image, x, y, photoWidthPx, photoHeightPx);

      if (options.gapEnabled) {
        ctx.strokeStyle = '#CCCCCC';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, photoWidthPx, photoHeightPx);
      }

      if (options.borderEnabled) {
        ctx.strokeStyle = '#CCCCCC';
        ctx.lineWidth = Math.max(0.5, 300 / 150);
        const borderOffset = ctx.lineWidth / 2;
        ctx.strokeRect(
          x + borderOffset,
          y + borderOffset,
          photoWidthPx - ctx.lineWidth,
          photoHeightPx - ctx.lineWidth
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
