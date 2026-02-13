/**
 * Canvas Renderer Module
 * Handles all canvas drawing and photo composition
 */

import { calculateCanvasDimensions } from './layout-config.js';

/**
 * Canvas Renderer Class
 * Manages photo sheet composition on canvas
 */
export class CanvasRenderer {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = canvasElement.getContext('2d', { alpha: false });

        // Enable high-quality image rendering
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
    }

    /**
     * Create photo sheet composite
     * @param {HTMLImageElement} image - Source photo image
     * @param {Object} layout - Layout configuration
     * @param {number} dpi - DPI setting
     * @param {Object} options - Rendering options
     */
    createComposite(image, layout, dpi, options = {}) {
        const {
            gapEnabled = false,
            gapSize = 0.05,
            borderEnabled = false
        } = options;

        // Calculate dimensions
        const dimensions = calculateCanvasDimensions(layout, dpi);
        const { width: canvasWidth, height: canvasHeight, photoSize: photoSizePx } = dimensions;
        const gapSizePx = gapEnabled ? gapSize * dpi : 0;

        // Set canvas size
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;

        // Fill background
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Handle custom spacing layouts
        if (layout.customSpacing) {
            this.createCustomSpacingComposite(image, layout, dpi, photoSizePx, gapSizePx, gapEnabled, borderEnabled);
            return;
        }

        // Standard grid positioning
        const totalPhotosWidth = (layout.cols * photoSizePx) + ((layout.cols - 1) * gapSizePx);
        const totalPhotosHeight = (layout.rows * photoSizePx) + ((layout.rows - 1) * gapSizePx);
        const startX = (canvasWidth - totalPhotosWidth) / 2;
        const startY = (canvasHeight - totalPhotosHeight) / 2;

        // Draw photos in grid
        for (let row = 0; row < layout.rows; row++) {
            for (let col = 0; col < layout.cols; col++) {
                const x = startX + (col * (photoSizePx + gapSizePx));
                const y = startY + (row * (photoSizePx + gapSizePx));

                // Draw the image
                this.ctx.drawImage(image, x, y, photoSizePx, photoSizePx);

                // Draw cutting guides if spacing is enabled
                if (gapEnabled) {
                    this.drawCuttingGuide(x, y, photoSizePx);
                }

                // Draw thin border inside photo if enabled
                if (borderEnabled) {
                    this.drawPhotoBorder(x, y, photoSizePx, dpi);
                }
            }
        }
    }

    /**
     * Create composite with custom spacing
     * @param {HTMLImageElement} image - Source photo image
     * @param {Object} layout - Layout configuration
     * @param {number} dpi - DPI setting
     * @param {number} photoSizePx - Photo size in pixels
     * @param {number} gapSizePx - Gap size in pixels
     * @param {boolean} gapEnabled - Whether gap is enabled
     * @param {boolean} borderEnabled - Whether border is enabled
     */
    createCustomSpacingComposite(image, layout, dpi, photoSizePx, gapSizePx, gapEnabled, borderEnabled) {
        const canvasWidth = layout.width * dpi;
        const canvasHeight = layout.height * dpi;

        if (layout.spacingType === 'vertical-apart') {
            // 4x6" with 2 photos - aligned to grid at 0.5" intervals
            // Layout: 0.5" top, photo (2"), 1.0" gap, photo (2"), 0.5" bottom = 6"
            const topMargin = 0.5 * dpi; // 0.5" top (aligns to grid)
            const middleGap = 1.0 * dpi;  // 1.0" between photos (aligns to grid)
            const x = (canvasWidth - photoSizePx) / 2; // Center horizontally

            // Draw background grid and measurement scales for cutting guidance
            this.drawBackgroundGrid(canvasWidth, canvasHeight, dpi);

            // Reset context properties for photo drawing
            this.ctx.globalAlpha = 1.0;
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.imageSmoothingEnabled = true;
            this.ctx.imageSmoothingQuality = 'high';

            for (let row = 0; row < layout.rows; row++) {
                // Photo 1 at 0.5", Photo 2 at 3.5" (0.5" + 2" + 1.0")
                const y = topMargin + (row * (photoSizePx + middleGap));

                // Draw the image
                this.ctx.drawImage(image, x, y, photoSizePx, photoSizePx);

                // Draw cutting guides if spacing is enabled
                if (gapEnabled) {
                    this.drawCuttingGuide(x, y, photoSizePx);
                }

                // Draw thin border inside photo if enabled
                if (borderEnabled) {
                    this.drawPhotoBorder(x, y, photoSizePx, dpi);
                }
            }
        } else if (layout.spacingType === 'vertical-centered') {
            // 4x6" with 4 photos - leave gaps at top and bottom, center the 2x2 grid
            const totalPhotosWidth = (layout.cols * photoSizePx) + gapSizePx;
            const totalPhotosHeight = (layout.rows * photoSizePx) + gapSizePx;
            const startX = (canvasWidth - totalPhotosWidth) / 2;
            const startY = (canvasHeight - totalPhotosHeight) / 2; // Center vertically with gaps at top/bottom

            for (let row = 0; row < layout.rows; row++) {
                for (let col = 0; col < layout.cols; col++) {
                    const x = startX + (col * (photoSizePx + gapSizePx));
                    const y = startY + (row * (photoSizePx + gapSizePx));

                    // Draw the image
                    this.ctx.drawImage(image, x, y, photoSizePx, photoSizePx);

                    // Draw cutting guides if spacing is enabled
                    if (gapEnabled) {
                        this.drawCuttingGuide(x, y, photoSizePx);
                    }

                    // Draw thin border inside photo if enabled
                    if (borderEnabled) {
                        this.drawPhotoBorder(x, y, photoSizePx, dpi);
                    }
                }
            }
        } else if (layout.spacingType === 'grid-aligned') {
            // 5x7" with 6 photos - aligned to 0.25" grid intervals
            // Layout: 0.25" left, 0.5" gap between columns, 0.25" right
            //         0.25" top, 0.25" gaps between rows, 0.25" bottom
            const leftMargin = 0.25 * dpi;   // 0.25" left margin
            const topMargin = 0.25 * dpi;    // 0.25" top margin
            const colGap = 0.5 * dpi;        // 0.5" gap between columns
            const rowGap = 0.25 * dpi;       // 0.25" gap between rows

            // Draw background grid and measurement scales for cutting guidance
            this.drawBackgroundGrid(canvasWidth, canvasHeight, dpi);

            // Reset context properties for photo drawing
            this.ctx.globalAlpha = 1.0;
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.imageSmoothingEnabled = true;
            this.ctx.imageSmoothingQuality = 'high';

            for (let row = 0; row < layout.rows; row++) {
                for (let col = 0; col < layout.cols; col++) {
                    const x = leftMargin + (col * (photoSizePx + colGap)); // 0.5" gap between photos
                    const y = topMargin + (row * (photoSizePx + rowGap));  // 0.25" gaps between rows

                    // Draw the image
                    this.ctx.drawImage(image, x, y, photoSizePx, photoSizePx);

                    // Draw cutting guides if spacing is enabled
                    if (gapEnabled) {
                        this.drawCuttingGuide(x, y, photoSizePx);
                    }

                    // Draw thin border inside photo if enabled
                    if (borderEnabled) {
                        this.drawPhotoBorder(x, y, photoSizePx, dpi);
                    }
                }
            }
        }
    }

    /**
     * Draw cutting guide around photo
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} size - Photo size
     */
    drawCuttingGuide(x, y, size) {
        this.ctx.strokeStyle = '#CCCCCC';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, size, size);
    }

    /**
     * Draw thin border inside photo
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} size - Photo size
     * @param {number} dpi - DPI setting
     */
    drawPhotoBorder(x, y, size, dpi) {
        this.ctx.strokeStyle = '#CCCCCC';
        this.ctx.lineWidth = Math.max(0.5, dpi / 150);
        const borderOffset = this.ctx.lineWidth / 2;

        this.ctx.strokeRect(
            x + borderOffset,
            y + borderOffset,
            size - this.ctx.lineWidth,
            size - this.ctx.lineWidth
        );
    }

    /**
     * Draw background grid with measurement scales for cutting guidance
     * @param {number} canvasWidth - Canvas width in pixels
     * @param {number} canvasHeight - Canvas height in pixels
     * @param {number} dpi - DPI setting
     */
    drawBackgroundGrid(canvasWidth, canvasHeight, dpi) {
        const marginSize = 0.25 * dpi; // 0.25 inch margin for measurements
        const gridInterval = 0.25 * dpi; // 0.25 inch grid (quarter inch)

        // Save context state
        this.ctx.save();

        // Draw very thin light gray grid lines in background
        this.ctx.strokeStyle = '#E0E0E0';
        this.ctx.lineWidth = 0.5;
        this.ctx.globalAlpha = 0.5;

        // Vertical grid lines
        for (let x = 0; x <= canvasWidth; x += gridInterval) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, canvasHeight);
            this.ctx.stroke();
        }

        // Horizontal grid lines
        for (let y = 0; y <= canvasHeight; y += gridInterval) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(canvasWidth, y);
            this.ctx.stroke();
        }

        // Reset alpha for measurement scales
        this.ctx.globalAlpha = 1.0;

        // Draw measurement scales on margins
        this.ctx.fillStyle = '#666666';
        this.ctx.strokeStyle = '#666666';
        this.ctx.lineWidth = 1;
        this.ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
        this.ctx.textAlign = 'center';

        // Top scale (horizontal measurements)
        for (let x = 0; x <= canvasWidth; x += dpi) { // Every inch
            const inches = x / dpi;

            // Draw tick mark
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, marginSize * 0.5);
            this.ctx.stroke();

            // Draw label
            this.ctx.fillText(`${inches}"`, x, marginSize * 0.8);
        }

        // Left scale (vertical measurements)
        this.ctx.textAlign = 'right';
        for (let y = 0; y <= canvasHeight; y += dpi) { // Every inch
            const inches = y / dpi;

            // Draw tick mark
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(marginSize * 0.5, y);
            this.ctx.stroke();

            // Draw label
            this.ctx.save();
            this.ctx.translate(marginSize * 0.9, y);
            this.ctx.rotate(-Math.PI / 2);
            this.ctx.fillText(`${inches}"`, 0, 0);
            this.ctx.restore();
        }

        // Right scale (vertical measurements)
        this.ctx.textAlign = 'left';
        for (let y = 0; y <= canvasHeight; y += dpi) { // Every inch
            const inches = y / dpi;

            // Draw tick mark
            this.ctx.beginPath();
            this.ctx.moveTo(canvasWidth, y);
            this.ctx.lineTo(canvasWidth - marginSize * 0.5, y);
            this.ctx.stroke();

            // Draw label
            this.ctx.save();
            this.ctx.translate(canvasWidth - marginSize * 0.9, y);
            this.ctx.rotate(-Math.PI / 2);
            this.ctx.fillText(`${inches}"`, 0, 0);
            this.ctx.restore();
        }

        // Bottom scale (horizontal measurements)
        this.ctx.textAlign = 'center';
        for (let x = 0; x <= canvasWidth; x += dpi) { // Every inch
            const inches = x / dpi;

            // Draw tick mark
            this.ctx.beginPath();
            this.ctx.moveTo(x, canvasHeight);
            this.ctx.lineTo(x, canvasHeight - marginSize * 0.5);
            this.ctx.stroke();

            // Draw label
            this.ctx.fillText(`${inches}"`, x, canvasHeight - marginSize * 0.2);
        }

        // Draw quarter-inch tick marks (smaller)
        this.ctx.lineWidth = 0.5;
        this.ctx.globalAlpha = 0.7;

        // Top quarter-inch ticks
        for (let x = 0; x <= canvasWidth; x += gridInterval) {
            if (x % dpi !== 0) { // Skip full inch marks
                this.ctx.beginPath();
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, marginSize * 0.3);
                this.ctx.stroke();
            }
        }

        // Bottom quarter-inch ticks
        for (let x = 0; x <= canvasWidth; x += gridInterval) {
            if (x % dpi !== 0) { // Skip full inch marks
                this.ctx.beginPath();
                this.ctx.moveTo(x, canvasHeight);
                this.ctx.lineTo(x, canvasHeight - marginSize * 0.3);
                this.ctx.stroke();
            }
        }

        // Left quarter-inch ticks
        for (let y = 0; y <= canvasHeight; y += gridInterval) {
            if (y % dpi !== 0) { // Skip full inch marks
                this.ctx.beginPath();
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(marginSize * 0.3, y);
                this.ctx.stroke();
            }
        }

        // Right quarter-inch ticks
        for (let y = 0; y <= canvasHeight; y += gridInterval) {
            if (y % dpi !== 0) { // Skip full inch marks
                this.ctx.beginPath();
                this.ctx.moveTo(canvasWidth, y);
                this.ctx.lineTo(canvasWidth - marginSize * 0.3, y);
                this.ctx.stroke();
            }
        }

        // Restore context state
        this.ctx.restore();
    }

    /**
     * Clear the canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Export canvas as data URL
     * @param {string} format - Image format (default: 'image/jpeg')
     * @param {number} quality - Image quality 0-1 (default: 0.95)
     * @returns {string} Data URL
     */
    toDataURL(format = 'image/jpeg', quality = 0.95) {
        return this.canvas.toDataURL(format, quality);
    }
}
