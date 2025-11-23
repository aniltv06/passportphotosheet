/**
 * Crop Mode Module
 * Handles interactive cropping functionality
 */

/**
 * Crop Manager Class
 * Manages crop mode and rectangle selection
 */
export class CropManager {
    constructor(overlayCanvas, options = {}) {
        this.overlayCanvas = overlayCanvas;
        this.ctx = overlayCanvas.getContext('2d', { alpha: true });
        this.canvasSize = options.canvasSize || 600;

        // State
        this.cropMode = false;
        this.cropRect = null;
        this.isCropping = false;
        this.cropStartX = 0;
        this.cropStartY = 0;

        // Callbacks
        this.onCropStart = options.onCropStart || null;
        this.onCropEnd = options.onCropEnd || null;
        this.onCropCancel = options.onCropCancel || null;
    }

    /**
     * Enable crop mode
     */
    enable() {
        this.cropMode = true;
        this.cropRect = null;
        this.overlayCanvas.style.cursor = 'crosshair';

        if (this.onCropStart) {
            this.onCropStart();
        }

        this.setupCropListeners();
    }

    /**
     * Disable crop mode
     */
    disable() {
        this.cropMode = false;
        this.cropRect = null;
        this.isCropping = false;
        this.overlayCanvas.style.cursor = 'default';
        this.clearCropOverlay();
        this.removeCropListeners();
    }

    /**
     * Cancel crop mode
     */
    cancel() {
        this.disable();

        if (this.onCropCancel) {
            this.onCropCancel();
        }
    }

    /**
     * Setup crop event listeners
     */
    setupCropListeners() {
        this.mouseDownHandler = (e) => this.startCrop(e);
        this.mouseMoveHandler = (e) => this.updateCrop(e);
        this.mouseUpHandler = (e) => this.endCrop(e);

        this.overlayCanvas.addEventListener('mousedown', this.mouseDownHandler);
        this.overlayCanvas.addEventListener('mousemove', this.mouseMoveHandler);
        this.overlayCanvas.addEventListener('mouseup', this.mouseUpHandler);

        // Touch events
        this.touchStartHandler = (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.startCrop({ clientX: touch.clientX, clientY: touch.clientY });
        };
        this.touchMoveHandler = (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.updateCrop({ clientX: touch.clientX, clientY: touch.clientY });
        };
        this.touchEndHandler = (e) => {
            e.preventDefault();
            this.endCrop({});
        };

        this.overlayCanvas.addEventListener('touchstart', this.touchStartHandler, { passive: false });
        this.overlayCanvas.addEventListener('touchmove', this.touchMoveHandler, { passive: false });
        this.overlayCanvas.addEventListener('touchend', this.touchEndHandler, { passive: false });
    }

    /**
     * Remove crop event listeners
     */
    removeCropListeners() {
        this.overlayCanvas.removeEventListener('mousedown', this.mouseDownHandler);
        this.overlayCanvas.removeEventListener('mousemove', this.mouseMoveHandler);
        this.overlayCanvas.removeEventListener('mouseup', this.mouseUpHandler);
        this.overlayCanvas.removeEventListener('touchstart', this.touchStartHandler);
        this.overlayCanvas.removeEventListener('touchmove', this.touchMoveHandler);
        this.overlayCanvas.removeEventListener('touchend', this.touchEndHandler);
    }

    /**
     * Start crop selection
     */
    startCrop(e) {
        if (!this.cropMode) return;

        const rect = this.overlayCanvas.getBoundingClientRect();
        const scaleX = this.canvasSize / rect.width;
        const scaleY = this.canvasSize / rect.height;

        this.cropStartX = (e.clientX - rect.left) * scaleX;
        this.cropStartY = (e.clientY - rect.top) * scaleY;
        this.isCropping = true;

        this.cropRect = {
            x: this.cropStartX,
            y: this.cropStartY,
            width: 0,
            height: 0
        };
    }

    /**
     * Update crop selection
     */
    updateCrop(e) {
        if (!this.isCropping) return;

        const rect = this.overlayCanvas.getBoundingClientRect();
        const scaleX = this.canvasSize / rect.width;
        const scaleY = this.canvasSize / rect.height;

        const currentX = (e.clientX - rect.left) * scaleX;
        const currentY = (e.clientY - rect.top) * scaleY;

        this.cropRect = {
            x: Math.min(this.cropStartX, currentX),
            y: Math.min(this.cropStartY, currentY),
            width: Math.abs(currentX - this.cropStartX),
            height: Math.abs(currentY - this.cropStartY)
        };

        this.drawCropOverlay();
    }

    /**
     * End crop selection
     */
    endCrop(e) {
        if (!this.isCropping) return;

        this.isCropping = false;

        // Check if crop rect is valid (not too small)
        if (this.cropRect && this.cropRect.width > 10 && this.cropRect.height > 10) {
            if (this.onCropEnd) {
                this.onCropEnd(this.cropRect);
            }
        }

        this.disable();
    }

    /**
     * Draw crop overlay
     */
    drawCropOverlay() {
        if (!this.cropRect) return;

        // Clear overlay
        this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);

        // Draw darkened overlay outside crop area
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);

        // Clear crop area
        this.ctx.clearRect(
            this.cropRect.x,
            this.cropRect.y,
            this.cropRect.width,
            this.cropRect.height
        );

        // Draw crop rectangle border
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.strokeRect(
            this.cropRect.x,
            this.cropRect.y,
            this.cropRect.width,
            this.cropRect.height
        );

        // Draw corner handles
        this.drawCornerHandles();

        // Draw dimensions label
        this.drawDimensionsLabel();
    }

    /**
     * Draw corner handles
     */
    drawCornerHandles() {
        if (!this.cropRect) return;

        const handleSize = 8;
        const corners = [
            { x: this.cropRect.x, y: this.cropRect.y },
            { x: this.cropRect.x + this.cropRect.width, y: this.cropRect.y },
            { x: this.cropRect.x, y: this.cropRect.y + this.cropRect.height },
            { x: this.cropRect.x + this.cropRect.width, y: this.cropRect.y + this.cropRect.height }
        ];

        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.setLineDash([]);

        corners.forEach(corner => {
            this.ctx.fillRect(
                corner.x - handleSize / 2,
                corner.y - handleSize / 2,
                handleSize,
                handleSize
            );
        });
    }

    /**
     * Draw dimensions label
     */
    drawDimensionsLabel() {
        if (!this.cropRect) return;

        const widthInches = (this.cropRect.width / 300).toFixed(2);
        const heightInches = (this.cropRect.height / 300).toFixed(2);
        const label = `${widthInches}" × ${heightInches}"`;

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.font = '14px -apple-system, BlinkMacSystemFont, sans-serif';
        this.ctx.textAlign = 'center';

        const labelX = this.cropRect.x + this.cropRect.width / 2;
        const labelY = this.cropRect.y - 10;

        // Background for label
        const textMetrics = this.ctx.measureText(label);
        this.ctx.fillRect(
            labelX - textMetrics.width / 2 - 5,
            labelY - 15,
            textMetrics.width + 10,
            20
        );

        // Label text
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.fillText(label, labelX, labelY);
    }

    /**
     * Clear crop overlay
     */
    clearCropOverlay() {
        this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
    }

    /**
     * Get crop rectangle
     * @returns {Object|null} Crop rectangle {x, y, width, height}
     */
    getCropRect() {
        return this.cropRect;
    }

    /**
     * Check if crop mode is active
     * @returns {boolean} True if in crop mode
     */
    isActive() {
        return this.cropMode;
    }
}
