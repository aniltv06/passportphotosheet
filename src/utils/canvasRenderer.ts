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
  // Optimal layout configuration
  optimalLayout?: {
    cols: number;
    rows: number;
    photos: number;
    useCustomSpacing: boolean;
    spacingType?: string;
    useLandscapeOrientation?: boolean;
  };
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
  photoHeightPx: number,
  applyLandscapeRotation: boolean = false
): HTMLCanvasElement {
  const editCanvas = document.createElement('canvas');

  // If applying landscape rotation, swap canvas dimensions
  if (applyLandscapeRotation) {
    editCanvas.width = photoHeightPx;
    editCanvas.height = photoWidthPx;
  } else {
    editCanvas.width = photoWidthPx;
    editCanvas.height = photoHeightPx;
  }

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
  ctx.fillRect(0, 0, editCanvas.width, editCanvas.height);

  // Apply filters
  const brightness = options.brightness || 100;
  const contrast = options.contrast || 100;
  ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

  // Save context for transformations
  ctx.save();

  // Move to center for rotation and zoom
  ctx.translate(editCanvas.width / 2, editCanvas.height / 2);

  // Apply user rotation
  const rotation = options.rotation || 0;
  let totalRotation = rotation;

  // Add 90 degree rotation if landscape orientation
  if (applyLandscapeRotation) {
    totalRotation += 90;
  }

  ctx.rotate((totalRotation * Math.PI) / 180);

  // Apply zoom
  const zoom = options.zoom || 100;
  const scale = zoom / 100;

  // Apply pan
  const panX = options.panX || 0;
  const panY = options.panY || 0;

  // Calculate image dimensions to cover the canvas
  // Use original canvas dimensions before rotation for aspect ratio calculation
  const targetWidth = applyLandscapeRotation ? photoHeightPx : photoWidthPx;
  const targetHeight = applyLandscapeRotation ? photoWidthPx : photoHeightPx;

  const imageAspect = sourceImage.width / sourceImage.height;
  const canvasAspect = targetWidth / targetHeight;
  let drawWidth, drawHeight;

  if (imageAspect > canvasAspect) {
    // Image is wider than canvas
    drawHeight = targetHeight * scale;
    drawWidth = drawHeight * imageAspect;
  } else {
    // Image is taller or same aspect as canvas
    drawWidth = targetWidth * scale;
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

  // Use optimal layout if provided, otherwise use static layout
  const activeLayout = options.optimalLayout || layout;

  const dpi = options.quality === 'high' ? 300 : 200;
  const gapSize = options.gapEnabled ? 0.05 : 0; // 0.05 inches gap

  // Use provided photo dimensions or default to 2x2
  // Keep original dimensions - rotation will be handled in createEditedImage
  const photoWidth = options.photoWidth || 2;
  const photoHeight = options.photoHeight || 2;

  // Calculate dimensions
  const canvasWidth = layout.width * dpi;
  const canvasHeight = layout.height * dpi;
  const photoWidthPx = photoWidth * dpi;
  const photoHeightPx = photoHeight * dpi;
  const gapSizePx = gapSize * dpi;

  // Create edited version of the image with all transformations applied
  // Pass landscape rotation flag to createEditedImage
  const editedImage = createEditedImage(
    image,
    options,
    photoWidthPx,
    photoHeightPx,
    activeLayout.useLandscapeOrientation || false
  );

  // Debug logging
  console.log('=== Photo Sheet Dimensions ===');
  console.log(`Layout: ${options.paperSize} (${layout.width}" × ${layout.height}")`);
  console.log(`DPI: ${dpi}`);
  console.log(`Canvas: ${canvasWidth}px × ${canvasHeight}px`);
  console.log(`Photo size: ${photoWidth}" × ${photoHeight}"`);
  console.log(`Photo size in pixels: ${photoWidthPx}px × ${photoHeightPx}px`);
  console.log(`Active Layout: ${activeLayout.cols}×${activeLayout.rows} = ${activeLayout.photos} photos`);
  console.log(`Custom spacing: ${activeLayout.useCustomSpacing}, Type: ${activeLayout.spacingType || 'N/A'}`);
  console.log(`Landscape orientation: ${activeLayout.useLandscapeOrientation || false}`);
  console.log(`Edited image dimensions: ${editedImage.width}px × ${editedImage.height}px`);
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
  if (activeLayout.useCustomSpacing) {
    if (activeLayout.spacingType === 'single-centered-with-guides') {
      renderSingleCenteredWithGuides(ctx, editedImage, activeLayout, photoWidthPx, photoHeightPx, canvasWidth, canvasHeight, dpi, options);
    } else if (
      activeLayout.spacingType === 'vertical-apart-grid' ||
      activeLayout.spacingType === 'vertical-apart-plain'
    ) {
      renderVerticalApartLayout(ctx, editedImage, activeLayout, photoWidthPx, photoHeightPx, canvasWidth, canvasHeight, dpi, gapSizePx, options, layout.forceGrid);
    } else if (
      activeLayout.spacingType === 'horizontal-apart-grid' ||
      activeLayout.spacingType === 'horizontal-apart-plain'
    ) {
      renderHorizontalApartLayout(ctx, editedImage, activeLayout, photoWidthPx, photoHeightPx, canvasWidth, canvasHeight, dpi, gapSizePx, options, layout.forceGrid);
    } else if (activeLayout.spacingType === 'vertical-centered') {
      renderVerticalCenteredLayout(ctx, editedImage, activeLayout, photoWidthPx, photoHeightPx, gapSizePx, canvasWidth, canvasHeight, options);
    } else if (activeLayout.spacingType === 'grid-aligned') {
      renderGridAlignedLayout(ctx, editedImage, activeLayout, photoWidthPx, photoHeightPx, dpi, canvasWidth, canvasHeight, options);
    }
  } else {
    renderStandardGrid(ctx, editedImage, activeLayout, photoWidthPx, photoHeightPx, gapSizePx, canvasWidth, canvasHeight, options);
  }

  return {
    canvas,
    canvasWidth,
    canvasHeight,
    photoCount: activeLayout.photos,
    dpi,
  };
}

/**
 * Render single centered photo with guides and printer safe margins (3.5×5" paper)
 * Uses 0.25" printer safe margins on all sides
 */
function renderSingleCenteredWithGuides(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement | HTMLCanvasElement,
  layout: Layout | { cols: number; rows: number; photos: number; useCustomSpacing: boolean; spacingType?: string },
  photoWidthPx: number,
  photoHeightPx: number,
  canvasWidth: number,
  canvasHeight: number,
  dpi: number,
  options: RenderOptions
): void {
  // Use actual image dimensions
  const actualPhotoWidth = image.width;
  const actualPhotoHeight = image.height;

  // Printer safe margins (0.25" on all sides)
  const safeMargin = 0.25 * dpi;

  // Calculate center position
  const x = (canvasWidth - actualPhotoWidth) / 2;
  const y = (canvasHeight - actualPhotoHeight) / 2;

  console.log('=== Single Centered Layout ===');
  console.log(`Paper: ${canvasWidth / dpi}" × ${canvasHeight / dpi}"`);
  console.log(`Photo dimensions: ${actualPhotoWidth}px × ${actualPhotoHeight}px`);
  console.log(`Safe margins: ${safeMargin / dpi}"`);
  console.log(`Centered position: (${x}px, ${y}px)`);
  console.log('================================');

  // Reset context properties
  ctx.globalAlpha = 1.0;
  ctx.globalCompositeOperation = 'source-over';
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Draw the photo centered
  ctx.drawImage(image, x, y, actualPhotoWidth, actualPhotoHeight);

  // Draw cutting guides around the photo
  if (options.gapEnabled) {
    ctx.strokeStyle = '#CCCCCC';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, actualPhotoWidth, actualPhotoHeight);
  }

  // Draw photo border if enabled
  if (options.borderEnabled) {
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = Math.max(2, dpi / 150);
    const borderOffset = ctx.lineWidth / 2;
    ctx.strokeRect(
      x + borderOffset,
      y + borderOffset,
      actualPhotoWidth - ctx.lineWidth,
      actualPhotoHeight - ctx.lineWidth
    );
  }

  // Draw corner guides for cutting (L-shaped marks at corners)
  ctx.strokeStyle = '#999999';
  ctx.lineWidth = 1;
  const guideLength = 0.25 * dpi; // 0.25" guide marks

  // Top-left corner
  ctx.beginPath();
  ctx.moveTo(x - guideLength, y);
  ctx.lineTo(x, y);
  ctx.lineTo(x, y - guideLength);
  ctx.stroke();

  // Top-right corner
  ctx.beginPath();
  ctx.moveTo(x + actualPhotoWidth + guideLength, y);
  ctx.lineTo(x + actualPhotoWidth, y);
  ctx.lineTo(x + actualPhotoWidth, y - guideLength);
  ctx.stroke();

  // Bottom-left corner
  ctx.beginPath();
  ctx.moveTo(x - guideLength, y + actualPhotoHeight);
  ctx.lineTo(x, y + actualPhotoHeight);
  ctx.lineTo(x, y + actualPhotoHeight + guideLength);
  ctx.stroke();

  // Bottom-right corner
  ctx.beginPath();
  ctx.moveTo(x + actualPhotoWidth + guideLength, y + actualPhotoHeight);
  ctx.lineTo(x + actualPhotoWidth, y + actualPhotoHeight);
  ctx.lineTo(x + actualPhotoWidth, y + actualPhotoHeight + guideLength);
  ctx.stroke();

  // Draw printer safe margin guides (dashed lines)
  ctx.strokeStyle = '#DDDDDD';
  ctx.lineWidth = 0.5;
  ctx.setLineDash([5, 5]);

  // Top safe margin line
  ctx.beginPath();
  ctx.moveTo(safeMargin, safeMargin);
  ctx.lineTo(canvasWidth - safeMargin, safeMargin);
  ctx.stroke();

  // Bottom safe margin line
  ctx.beginPath();
  ctx.moveTo(safeMargin, canvasHeight - safeMargin);
  ctx.lineTo(canvasWidth - safeMargin, canvasHeight - safeMargin);
  ctx.stroke();

  // Left safe margin line
  ctx.beginPath();
  ctx.moveTo(safeMargin, safeMargin);
  ctx.lineTo(safeMargin, canvasHeight - safeMargin);
  ctx.stroke();

  // Right safe margin line
  ctx.beginPath();
  ctx.moveTo(canvasWidth - safeMargin, safeMargin);
  ctx.lineTo(canvasWidth - safeMargin, canvasHeight - safeMargin);
  ctx.stroke();

  // Reset line dash
  ctx.setLineDash([]);
}

/**
 * Render 4x6 2-photo layout with grid or plain background (vertical)
 */
function renderVerticalApartLayout(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement | HTMLCanvasElement,
  layout: Layout | { cols: number; rows: number; photos: number; useCustomSpacing: boolean; spacingType?: string },
  photoWidthPx: number,
  photoHeightPx: number,
  canvasWidth: number,
  canvasHeight: number,
  dpi: number,
  gapSizePx: number,
  options: RenderOptions,
  forceGrid?: boolean
): void {
  // Use actual image dimensions (which are rotated if landscape)
  const actualPhotoWidth = image.width;
  const actualPhotoHeight = image.height;

  // Custom placement calculations based on photo size
  const paperWidthInches = canvasWidth / dpi;
  const paperHeightInches = canvasHeight / dpi;
  const photoWidthInches = actualPhotoWidth / dpi;
  const photoHeightInches = actualPhotoHeight / dpi;

  // Calculate optimal placement
  // Available space: paper height - 2 photos - margins
  const totalPhotosHeight = 2 * photoHeightInches;
  const availableSpace = paperHeightInches - totalPhotosHeight;

  // Use custom margins for better centering
  // Distribute remaining space: top margin + gap + bottom margin
  const topMargin = availableSpace * 0.25 * dpi; // 25% on top
  const middleGap = availableSpace * 0.5 * dpi; // 50% in middle
  // Bottom margin is automatic (remaining 25%)

  // Center horizontally
  const x = (canvasWidth - actualPhotoWidth) / 2;

  console.log('=== Vertical Layout Placement ===');
  console.log(`Paper: ${paperWidthInches}" × ${paperHeightInches}"`);
  console.log(`Rotated photo: ${photoWidthInches}" × ${photoHeightInches}"`);
  console.log(`Photo dimensions (px): ${actualPhotoWidth}px × ${actualPhotoHeight}px`);
  console.log(`Top margin: ${(topMargin / dpi).toFixed(3)}"`);
  console.log(`Middle gap: ${(middleGap / dpi).toFixed(3)}"`);
  console.log(`X position (centered): ${x}px`);
  console.log('====================================');

  // Draw background grid if grid variant
  if (forceGrid) {
    drawBackgroundGrid(ctx, canvasWidth, canvasHeight, dpi);
  }

  // Reset context properties for photo drawing
  ctx.globalAlpha = 1.0;
  ctx.globalCompositeOperation = 'source-over';
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  for (let row = 0; row < layout.rows; row++) {
    const y = topMargin + row * (actualPhotoHeight + middleGap);
    ctx.drawImage(image, x, y, actualPhotoWidth, actualPhotoHeight);

    if (options.gapEnabled) {
      ctx.strokeStyle = '#CCCCCC';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, actualPhotoWidth, actualPhotoHeight);
    }

    if (options.borderEnabled) {
      ctx.strokeStyle = '#CCCCCC';
      ctx.lineWidth = Math.max(0.5, dpi / 150);
      const borderOffset = ctx.lineWidth / 2;
      ctx.strokeRect(
        x + borderOffset,
        y + borderOffset,
        actualPhotoWidth - ctx.lineWidth,
        actualPhotoHeight - ctx.lineWidth
      );
    }
  }
}

/**
 * Render 4x6 2-photo layout with grid or plain background (horizontal/landscape)
 */
function renderHorizontalApartLayout(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement | HTMLCanvasElement,
  layout: Layout | { cols: number; rows: number; photos: number; useCustomSpacing: boolean; spacingType?: string },
  photoWidthPx: number,
  photoHeightPx: number,
  canvasWidth: number,
  canvasHeight: number,
  dpi: number,
  gapSizePx: number,
  options: RenderOptions,
  forceGrid?: boolean
): void {
  // Use actual image dimensions (which are rotated if landscape)
  const actualPhotoWidth = image.width;
  const actualPhotoHeight = image.height;

  // Custom placement calculations based on photo size
  // For 2.1×2.7" (630×810) photos rotated to landscape on 4×6" paper
  const paperWidthInches = canvasWidth / dpi;
  const paperHeightInches = canvasHeight / dpi;
  const photoWidthInches = actualPhotoWidth / dpi;
  const photoHeightInches = actualPhotoHeight / dpi;

  // Calculate optimal placement
  // Available space: paper width - 2 photos - margins
  const totalPhotosWidth = 2 * photoWidthInches;
  const availableSpace = paperWidthInches - totalPhotosWidth;

  // Use custom margins for better centering
  // Distribute remaining space: left margin + gap + right margin
  const leftMargin = availableSpace * 0.25 * dpi; // 25% on left
  const middleGap = availableSpace * 0.5 * dpi; // 50% in middle
  // Right margin is automatic (remaining space)

  // Center vertically
  const y = (canvasHeight - actualPhotoHeight) / 2;

  console.log('=== Horizontal Layout Placement ===');
  console.log(`Paper: ${paperWidthInches}" × ${paperHeightInches}"`);
  console.log(`Rotated photo: ${photoWidthInches}" × ${photoHeightInches}"`);
  console.log(`Photo dimensions (px): ${actualPhotoWidth}px × ${actualPhotoHeight}px`);
  console.log(`Left margin: ${(leftMargin / dpi).toFixed(3)}"`);
  console.log(`Middle gap: ${(middleGap / dpi).toFixed(3)}"`);
  console.log(`Y position (centered): ${y}px`);
  console.log('====================================');

  // Draw background grid if grid variant
  if (forceGrid) {
    drawBackgroundGrid(ctx, canvasWidth, canvasHeight, dpi);
  }

  // Reset context properties for photo drawing
  ctx.globalAlpha = 1.0;
  ctx.globalCompositeOperation = 'source-over';
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  for (let col = 0; col < layout.cols; col++) {
    const x = leftMargin + col * (actualPhotoWidth + middleGap);
    ctx.drawImage(image, x, y, actualPhotoWidth, actualPhotoHeight);

    if (options.gapEnabled) {
      ctx.strokeStyle = '#CCCCCC';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, actualPhotoWidth, actualPhotoHeight);
    }

    if (options.borderEnabled) {
      ctx.strokeStyle = '#CCCCCC';
      ctx.lineWidth = Math.max(0.5, dpi / 150);
      const borderOffset = ctx.lineWidth / 2;
      ctx.strokeRect(
        x + borderOffset,
        y + borderOffset,
        actualPhotoWidth - ctx.lineWidth,
        actualPhotoHeight - ctx.lineWidth
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
  layout: Layout | { cols: number; rows: number; photos: number; useCustomSpacing: boolean; spacingType?: string },
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
  layout: Layout | { cols: number; rows: number; photos: number; useCustomSpacing: boolean; spacingType?: string },
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
  layout: Layout | { cols: number; rows: number; photos: number; useCustomSpacing: boolean; spacingType?: string },
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
