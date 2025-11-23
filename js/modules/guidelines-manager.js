/**
 * Guidelines Module
 * Handles face guide and grid overlays for passport photo editing
 */

/**
 * Guidelines Manager Class
 * Manages visual guides for passport photo composition
 */
export class GuidelinesManager {
    constructor(overlayCanvas, options = {}) {
        this.overlayCanvas = overlayCanvas;
        this.ctx = overlayCanvas.getContext('2d', { alpha: true });
        this.canvasSize = options.canvasSize || 600;

        // State
        this.faceGuideVisible = true;
        this.gridVisible = false;
    }

    /**
     * Toggle face guide visibility
     * @param {boolean} visible - Show or hide face guide
     */
    toggleFaceGuide(visible) {
        this.faceGuideVisible = visible;
        this.render();
    }

    /**
     * Toggle grid visibility
     * @param {boolean} visible - Show or hide grid
     */
    toggleGrid(visible) {
        this.gridVisible = visible;
        this.render();
    }

    /**
     * Render all active guidelines
     */
    render() {
        // Clear overlay canvas
        this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);

        // Face guide (oval) - US passport spec:
        // Photo: 2x2 inches
        // Head: 1 to 1.4 inches (50% to 70% of photo) - we'll show 60% (1.2 inches) as ideal
        if (this.faceGuideVisible) {
            this.ctx.strokeStyle = 'rgba(0, 122, 255, 0.45)';
            this.ctx.lineWidth = 3;
            this.ctx.setLineDash([8, 6]);

            const centerX = this.canvasSize / 2;

            // Head height: 60% of photo (1.2" ideal)
            const headHeightPercent = 0.60;
            const radiusY = this.canvasSize * (headHeightPercent / 2); // 30% radius = 60% height

            // Eyes are typically 1/3 down from crown of head
            // If eyes should be at ~37.5% from top (middle of 31-44% range)
            // And eyes are 1/3 down from crown, then crown is at:
            const eyePositionPercent = 0.375;
            const eyesToCrownPercent = headHeightPercent / 3; // ~20%
            const crownPercent = eyePositionPercent - eyesToCrownPercent; // ~17.5%

            // Face center is halfway between crown and chin
            const centerY = this.canvasSize * (crownPercent + (headHeightPercent / 2)); // ~47.5%

            // Face width: typically 70-75% of face height for realistic oval
            const radiusX = radiusY * 0.72; // More realistic face proportions

            this.ctx.beginPath();
            this.ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
            this.ctx.stroke();

            // Add reference markers at top and bottom of face guide
            this.ctx.setLineDash([]);
            this.ctx.strokeStyle = 'rgba(0, 122, 255, 0.3)';
            this.ctx.lineWidth = 1;

            // Top of head marker (crown)
            const topY = centerY - radiusY;
            this.ctx.beginPath();
            this.ctx.moveTo(centerX - 30, topY);
            this.ctx.lineTo(centerX + 30, topY);
            this.ctx.stroke();

            // Add label for crown
            this.ctx.fillStyle = 'rgba(0, 122, 255, 0.6)';
            this.ctx.font = '11px -apple-system, sans-serif';
            this.ctx.fillText('Crown', centerX + 35, topY + 4);

            // Bottom of chin marker
            const bottomY = centerY + radiusY;
            this.ctx.beginPath();
            this.ctx.moveTo(centerX - 30, bottomY);
            this.ctx.lineTo(centerX + 30, bottomY);
            this.ctx.stroke();

            // Add label for chin
            this.ctx.fillText('Chin', centerX + 35, bottomY + 4);
        }

        // Grid with scale markings
        if (this.gridVisible) {
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
            this.ctx.lineWidth = 1;
            this.ctx.setLineDash([4, 4]);

            // Center cross (most important)
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            this.ctx.lineWidth = 2;

            // Vertical center
            this.ctx.beginPath();
            this.ctx.moveTo(this.canvasSize / 2, 0);
            this.ctx.lineTo(this.canvasSize / 2, this.canvasSize);
            this.ctx.stroke();

            // Horizontal center
            this.ctx.beginPath();
            this.ctx.moveTo(0, this.canvasSize / 2);
            this.ctx.lineTo(this.canvasSize, this.canvasSize / 2);
            this.ctx.stroke();

            // Grid lines every 0.25 inch (75 pixels at 300 DPI)
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            this.ctx.lineWidth = 1;

            const gridInterval = 75; // 0.25 inch at 300 DPI

            // Vertical lines
            for (let x = 0; x <= this.canvasSize; x += gridInterval) {
                if (x !== this.canvasSize / 2) { // Skip center (already drawn)
                    this.ctx.beginPath();
                    this.ctx.moveTo(x, 0);
                    this.ctx.lineTo(x, this.canvasSize);
                    this.ctx.stroke();
                }
            }

            // Horizontal lines
            for (let y = 0; y <= this.canvasSize; y += gridInterval) {
                if (y !== this.canvasSize / 2) { // Skip center (already drawn)
                    this.ctx.beginPath();
                    this.ctx.moveTo(0, y);
                    this.ctx.lineTo(this.canvasSize, y);
                    this.ctx.stroke();
                }
            }

            // Add measurement labels (inches)
            this.ctx.setLineDash([]);
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            this.ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
            this.ctx.textAlign = 'left';

            // Top labels
            for (let x = 0; x <= this.canvasSize; x += gridInterval) {
                const inches = (x / 300).toFixed(2); // Convert pixels to inches
                this.ctx.fillText(inches + '"', x + 5, 12);
            }

            // Left labels
            for (let y = 0; y <= this.canvasSize; y += gridInterval) {
                const inches = (y / 300).toFixed(2); // Convert pixels to inches
                this.ctx.save();
                this.ctx.translate(5, y - 5);
                this.ctx.rotate(-Math.PI / 2);
                this.ctx.fillText(inches + '"', 0, 0);
                this.ctx.restore();
            }

            // Grid title
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            this.ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, sans-serif';
            this.ctx.fillText('Grid with Scale (0.25" intervals)', this.canvasSize / 2, this.canvasSize - 10);
        }
    }

    /**
     * Clear all guidelines
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
    }
}
