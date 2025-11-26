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
            // Enhanced visibility with shadow
            this.ctx.strokeStyle = 'rgba(0, 122, 255, 0.6)'; // Increased from 0.45
            this.ctx.lineWidth = 3;
            this.ctx.setLineDash([8, 6]);
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.6)'; // Add shadow for better visibility
            this.ctx.shadowBlur = 3;

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
            this.ctx.strokeStyle = 'rgba(0, 122, 255, 0.5)'; // Increased from 0.3
            this.ctx.lineWidth = 1.5; // Thicker
            this.ctx.shadowBlur = 2;

            // Top of head marker (crown)
            const topY = centerY - radiusY;
            this.ctx.beginPath();
            this.ctx.moveTo(centerX - 30, topY);
            this.ctx.lineTo(centerX + 30, topY);
            this.ctx.stroke();

            // Add label for crown with enhanced readability
            this.ctx.fillStyle = 'rgba(0, 122, 255, 0.85)'; // Increased from 0.6
            this.ctx.font = 'bold 11px -apple-system, sans-serif'; // Made bold
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'; // Text shadow for readability
            this.ctx.shadowBlur = 3;
            this.ctx.fillText('Crown', centerX + 35, topY + 4);

            // Bottom of chin marker
            const bottomY = centerY + radiusY;
            this.ctx.beginPath();
            this.ctx.moveTo(centerX - 30, bottomY);
            this.ctx.lineTo(centerX + 30, bottomY);
            this.ctx.stroke();

            // Add label for chin
            this.ctx.fillText('Chin', centerX + 35, bottomY + 4);

            // Reset shadow
            this.ctx.shadowBlur = 0;
            this.ctx.shadowColor = 'transparent';
        }

        // Grid with scale markings - Enhanced for better visibility
        if (this.gridVisible) {
            const gridInterval = 75; // 0.25 inch at 300 DPI
            const majorInterval = gridInterval * 4; // 1 inch intervals for major lines

            // Draw minor grid lines (every 0.25")
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)'; // Increased from 0.15
            this.ctx.lineWidth = 1;
            this.ctx.setLineDash([4, 4]);
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; // Add shadow for better visibility
            this.ctx.shadowBlur = 2;

            // Vertical lines
            for (let x = 0; x <= this.canvasSize; x += gridInterval) {
                if (x === this.canvasSize / 2 || x % majorInterval === 0) continue; // Skip center and major lines
                this.ctx.beginPath();
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, this.canvasSize);
                this.ctx.stroke();
            }

            // Horizontal lines
            for (let y = 0; y <= this.canvasSize; y += gridInterval) {
                if (y === this.canvasSize / 2 || y % majorInterval === 0) continue; // Skip center and major lines
                this.ctx.beginPath();
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(this.canvasSize, y);
                this.ctx.stroke();
            }

            // Draw major grid lines (every 1 inch)
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'; // More visible than minor lines
            this.ctx.lineWidth = 1.5;
            this.ctx.setLineDash([6, 3]); // Different dash pattern
            this.ctx.shadowBlur = 3;

            // Vertical major lines
            for (let x = 0; x <= this.canvasSize; x += majorInterval) {
                if (x === this.canvasSize / 2) continue; // Skip center
                this.ctx.beginPath();
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, this.canvasSize);
                this.ctx.stroke();
            }

            // Horizontal major lines
            for (let y = 0; y <= this.canvasSize; y += majorInterval) {
                if (y === this.canvasSize / 2) continue; // Skip center
                this.ctx.beginPath();
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(this.canvasSize, y);
                this.ctx.stroke();
            }

            // Center cross (most important) - Draw last so it's on top
            this.ctx.strokeStyle = 'rgba(0, 122, 255, 0.7)'; // Use brand blue color
            this.ctx.lineWidth = 2.5; // Thicker
            this.ctx.setLineDash([8, 4]); // Longer dashes
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            this.ctx.shadowBlur = 4;

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

            // Add measurement labels (inches) with better visibility
            this.ctx.setLineDash([]);
            this.ctx.shadowBlur = 0;
            this.ctx.font = '11px -apple-system, BlinkMacSystemFont, sans-serif';
            this.ctx.textAlign = 'left';

            // Add text shadow for better readability
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            this.ctx.shadowBlur = 3;
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'; // Increased from 0.7

            // Top labels - only major intervals (every inch)
            for (let x = 0; x <= this.canvasSize; x += majorInterval) {
                const inches = (x / 300).toFixed(1);
                this.ctx.fillText(`${inches}"`, x + 5, 15);
            }

            // Left labels - only major intervals (every inch)
            for (let y = 0; y <= this.canvasSize; y += majorInterval) {
                const inches = (y / 300).toFixed(1);
                this.ctx.save();
                this.ctx.translate(8, y - 5);
                this.ctx.rotate(-Math.PI / 2);
                this.ctx.fillText(`${inches}"`, 0, 0);
                this.ctx.restore();
            }

            // Grid title with enhanced visibility
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'; // Increased from 0.8
            this.ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, sans-serif'; // Slightly larger
            this.ctx.shadowBlur = 4;
            this.ctx.fillText('Grid with Scale (¼" intervals, 1" major lines)', this.canvasSize / 2, this.canvasSize - 12);

            // Reset context state
            this.ctx.shadowBlur = 0;
            this.ctx.shadowColor = 'transparent';
        }
    }

    /**
     * Clear all guidelines
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
    }
}
