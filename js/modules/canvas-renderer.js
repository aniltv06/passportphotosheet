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

        // Calculate grid positioning
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
