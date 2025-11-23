/**
 * Canvas Editor Module
 * Handles canvas operations: zoom, pan, rotate, and rendering
 */

/**
 * Canvas Editor Class
 * Manages photo editing on HTML5 canvas
 */
export class CanvasEditor {
    constructor(editCanvas, overlayCanvas, options = {}) {
        this.editCanvas = editCanvas;
        this.overlayCanvas = overlayCanvas;
        this.ctx = editCanvas.getContext('2d', { alpha: true });
        this.overlayCtx = overlayCanvas.getContext('2d', { alpha: true });

        // State
        this.originalImage = null;
        this.currentImage = null;
        this.scale = 1;
        this.rotation = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.backgroundRemoved = false;

        // Canvas size (2x2 inch photo at 300 DPI)
        this.canvasSize = options.canvasSize || 600;

        // Set canvas sizes
        this.editCanvas.width = this.canvasSize;
        this.editCanvas.height = this.canvasSize;
        this.overlayCanvas.width = this.canvasSize;
        this.overlayCanvas.height = this.canvasSize;

        // Callbacks
        this.onChange = options.onChange || null;
        this.onReady = options.onReady || null;

        this.setupCanvasInteraction();
    }

    /**
     * Load image from file or URL
     * @param {File|string} source - Image file or URL
     */
    async loadImage(source) {
        return new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = () => {
                this.originalImage = img;
                this.currentImage = img;
                this.backgroundRemoved = false;
                this.resetTransform();
                this.render();

                if (this.onReady) {
                    this.onReady(img);
                }

                resolve(img);
            };

            img.onerror = () => {
                reject(new Error('Failed to load image'));
            };

            if (source instanceof File) {
                img.src = URL.createObjectURL(source);
            } else {
                img.src = source;
            }
        });
    }

    /**
     * Setup canvas interaction (drag to pan)
     */
    setupCanvasInteraction() {
        // Mouse events
        this.editCanvas.addEventListener('mousedown', (e) => this.startDrag(e));
        this.editCanvas.addEventListener('mousemove', (e) => this.drag(e));
        this.editCanvas.addEventListener('mouseup', () => this.endDrag());
        this.editCanvas.addEventListener('mouseleave', () => this.endDrag());

        // Touch events
        this.editCanvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.startDrag({ clientX: touch.clientX, clientY: touch.clientY });
        }, { passive: false });

        this.editCanvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.drag({ clientX: touch.clientX, clientY: touch.clientY });
        }, { passive: false });

        this.editCanvas.addEventListener('touchend', () => this.endDrag());

        // Scroll to zoom
        this.editCanvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.05 : 0.05;
            this.setZoom(this.scale + delta);
        }, { passive: false });
    }

    /**
     * Start dragging
     */
    startDrag(e) {
        this.isDragging = true;
        const rect = this.editCanvas.getBoundingClientRect();
        this.dragStartX = e.clientX - rect.left - this.offsetX;
        this.dragStartY = e.clientY - rect.top - this.offsetY;
        this.editCanvas.style.cursor = 'grabbing';
    }

    /**
     * Handle drag
     */
    drag(e) {
        if (!this.isDragging) return;

        const rect = this.editCanvas.getBoundingClientRect();
        this.offsetX = e.clientX - rect.left - this.dragStartX;
        this.offsetY = e.clientY - rect.top - this.dragStartY;
        this.render();

        if (this.onChange) {
            this.onChange({ offsetX: this.offsetX, offsetY: this.offsetY });
        }
    }

    /**
     * End dragging
     */
    endDrag() {
        this.isDragging = false;
        this.editCanvas.style.cursor = 'grab';
    }

    /**
     * Set zoom level
     * @param {number} newScale - Zoom scale (0.1 to 3)
     */
    setZoom(newScale) {
        this.scale = Math.max(0.1, Math.min(3, newScale));
        this.render();

        if (this.onChange) {
            this.onChange({ scale: this.scale });
        }
    }

    /**
     * Set rotation angle
     * @param {number} angle - Rotation in degrees (-45 to 45)
     */
    setRotation(angle) {
        this.rotation = Math.max(-45, Math.min(45, angle));
        this.render();

        if (this.onChange) {
            this.onChange({ rotation: this.rotation });
        }
    }

    /**
     * Reset transform to defaults
     */
    resetTransform() {
        this.scale = 1;
        this.rotation = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.render();

        if (this.onChange) {
            this.onChange({ scale: this.scale, rotation: this.rotation, offsetX: 0, offsetY: 0 });
        }
    }

    /**
     * Render image on canvas
     */
    render() {
        if (!this.currentImage) return;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);

        // Save context
        this.ctx.save();

        // Move to center
        this.ctx.translate(this.canvasSize / 2, this.canvasSize / 2);

        // Apply rotation
        this.ctx.rotate((this.rotation * Math.PI) / 180);

        // Apply scale and offset
        this.ctx.translate(this.offsetX, this.offsetY);
        this.ctx.scale(this.scale, this.scale);

        // Draw image centered
        this.ctx.drawImage(
            this.currentImage,
            -this.currentImage.width / 2,
            -this.currentImage.height / 2,
            this.currentImage.width,
            this.currentImage.height
        );

        // Restore context
        this.ctx.restore();
    }

    /**
     * Set current image (e.g., after background removal)
     * @param {HTMLImageElement|HTMLCanvasElement} image - New image
     */
    setCurrentImage(image) {
        this.currentImage = image;
        this.render();
    }

    /**
     * Export current canvas as data URL
     * @param {string} format - Image format (default: 'image/png')
     * @param {number} quality - Image quality 0-1 (default: 1)
     * @returns {string} Data URL
     */
    toDataURL(format = 'image/png', quality = 1) {
        return this.editCanvas.toDataURL(format, quality);
    }

    /**
     * Export current canvas as blob
     * @param {string} format - Image format (default: 'image/png')
     * @param {number} quality - Image quality 0-1 (default: 1)
     * @returns {Promise<Blob>} Image blob
     */
    toBlob(format = 'image/png', quality = 1) {
        return new Promise((resolve) => {
            this.editCanvas.toBlob(resolve, format, quality);
        });
    }

    /**
     * Get current state
     * @returns {Object} Current editor state
     */
    getState() {
        return {
            scale: this.scale,
            rotation: this.rotation,
            offsetX: this.offsetX,
            offsetY: this.offsetY,
            backgroundRemoved: this.backgroundRemoved,
            hasImage: this.currentImage !== null
        };
    }

    /**
     * Mark background as removed
     */
    markBackgroundRemoved() {
        this.backgroundRemoved = true;
    }

    /**
     * Clear canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
        this.overlayCtx.clearRect(0, 0, this.canvasSize, this.canvasSize);
        this.originalImage = null;
        this.currentImage = null;
        this.resetTransform();
    }
}
