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
        this.canvasWidth = options.canvasWidth || 600;
        this.canvasHeight = options.canvasHeight || 600;

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
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        // Detect format type based on dimensions
        const isDigitalFormat = (this.canvasWidth === 630 && this.canvasHeight === 810);

        // Face guide (oval)
        if (this.faceGuideVisible) {
            if (isDigitalFormat) {
                this.renderDigitalFormatGuide();
            } else {
                this.render2x2Guide();
            }
        }

        // Grid with scale markings - Enhanced for better visibility
        if (this.gridVisible) {
            this.renderGrid();
        }
    }

    /**
     * Render face guide for 2x2 inch format
     */
    render2x2Guide() {
        const centerX = this.canvasWidth / 2;
        const centerY = this.canvasHeight / 2;

        // US passport spec for 2x2 inches:
        // Head height requirements: 1" to 1⅜" (25-35mm) from chin to crown
        // This is 50% to 68.75% of photo height

        // Define three head heights (in percentage of canvas)
        const minHeadHeight = 0.50;    // 1.0" minimum
        const idealHeadHeight = 0.60;  // 1.2" ideal (middle of range)
        const maxHeadHeight = 0.6875;  // 1.375" (1⅜") maximum

        // Calculate vertical center position
        // Eyes should be at ~37.5% from top (1.25" from bottom on 2" photo)
        const eyePositionFromTop = 0.375;
        const eyesY = this.canvasHeight * eyePositionFromTop;

        // For ideal head: eyes are roughly 1/3 down from crown
        const eyesToCrownPercent = idealHeadHeight / 3;
        const idealCrownY = eyesY - (this.canvasHeight * eyesToCrownPercent);
        const idealCenterY = idealCrownY + (this.canvasHeight * idealHeadHeight / 2);

        // Face width: 72% of face height for realistic proportions
        const minRadiusY = this.canvasHeight * (minHeadHeight / 2);
        const idealRadiusY = this.canvasHeight * (idealHeadHeight / 2);
        const maxRadiusY = this.canvasHeight * (maxHeadHeight / 2);

        const minRadiusX = minRadiusY * 0.72;
        const idealRadiusX = idealRadiusY * 0.72;
        const maxRadiusX = maxRadiusY * 0.72;

        this.drawFaceOvals(centerX, idealCenterY, minRadiusX, minRadiusY, idealRadiusX, idealRadiusY, maxRadiusX, maxRadiusY);
        this.drawFaceLabels(centerX, idealCenterY, minRadiusY, idealRadiusY, maxRadiusY, '1.0"', '1.2"', '1⅜"', '1.0" - 1.375"');
    }

    /**
     * Render face guide for 630x810 digital format
     */
    renderDigitalFormatGuide() {
        const centerX = this.canvasWidth / 2;
        const centerY = this.canvasHeight / 2;

        // Digital passport photo spec (ICAO standard):
        // Head height should be 70-80% of image height
        // For 810px height: 70% = 567px, 75% = 607.5px, 80% = 648px

        // Define three head heights (in percentage of canvas)
        const minHeadHeight = 0.70;    // 70% minimum
        const idealHeadHeight = 0.75;  // 75% ideal
        const maxHeadHeight = 0.80;    // 80% maximum

        // For digital format, position head slightly above center
        // Top of head should be at about 10% from top for ideal 75% head
        const idealTopMargin = 0.10;  // 10% margin from top
        const idealCrownY = this.canvasHeight * idealTopMargin;
        const idealCenterY = idealCrownY + (this.canvasHeight * idealHeadHeight / 2);

        // Face width: 72% of face height for realistic proportions
        const minRadiusY = this.canvasHeight * (minHeadHeight / 2);
        const idealRadiusY = this.canvasHeight * (idealHeadHeight / 2);
        const maxRadiusY = this.canvasHeight * (maxHeadHeight / 2);

        const minRadiusX = minRadiusY * 0.72;
        const idealRadiusX = idealRadiusY * 0.72;
        const maxRadiusX = maxRadiusY * 0.72;

        this.drawFaceOvals(centerX, idealCenterY, minRadiusX, minRadiusY, idealRadiusX, idealRadiusY, maxRadiusX, maxRadiusY);
        this.drawFaceLabels(centerX, idealCenterY, minRadiusY, idealRadiusY, maxRadiusY, '70%', '75%', '80%', 'Acceptable Range: 70-80%');
    }

    /**
     * Draw face guide ovals
     */
    drawFaceOvals(centerX, centerY, minRadiusX, minRadiusY, idealRadiusX, idealRadiusY, maxRadiusX, maxRadiusY) {
        // Draw shaded acceptable zone between min and max
        this.ctx.save();
        this.ctx.globalAlpha = 0.15;
        this.ctx.fillStyle = '#00FF00'; // Green tint
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, centerY, maxRadiusX, maxRadiusY, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();

        // Draw MAXIMUM oval (outer boundary - warning)
        this.ctx.strokeStyle = 'rgba(255, 149, 0, 0.7)'; // Orange for limit
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([8, 8]); // Dashed for boundary
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        this.ctx.shadowBlur = 2;
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, centerY, maxRadiusX, maxRadiusY, 0, 0, Math.PI * 2);
        this.ctx.stroke();

        // Draw MINIMUM oval (inner boundary - warning)
        this.ctx.strokeStyle = 'rgba(255, 149, 0, 0.7)'; // Orange for limit
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([8, 8]); // Dashed for boundary
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, centerY, minRadiusX, minRadiusY, 0, 0, Math.PI * 2);
        this.ctx.stroke();

        // Draw IDEAL oval (target - prominent)
        this.ctx.strokeStyle = 'rgba(0, 122, 255, 0.8)'; // Bright blue
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([12, 4]); // Distinctive dash pattern
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        this.ctx.shadowBlur = 3;
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, centerY, idealRadiusX, idealRadiusY, 0, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    /**
     * Draw face guide labels
     */
    drawFaceLabels(centerX, centerY, minRadiusY, idealRadiusY, maxRadiusY, minLabel, idealLabel, maxLabel, rangeLabel) {
        // Add measurement labels
        this.ctx.setLineDash([]);
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        this.ctx.shadowBlur = 3;
        this.ctx.font = 'bold 11px -apple-system, sans-serif';

        // Top crown line (max)
        const maxTopY = centerY - maxRadiusY;
        this.ctx.strokeStyle = 'rgba(255, 149, 0, 0.6)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX - 35, maxTopY);
        this.ctx.lineTo(centerX + 35, maxTopY);
        this.ctx.stroke();
        this.ctx.fillStyle = 'rgba(255, 149, 0, 0.9)';
        this.ctx.fillText(`Max ${maxLabel}`, centerX + 40, maxTopY + 4);

        // Ideal crown line
        const idealTopY = centerY - idealRadiusY;
        this.ctx.strokeStyle = 'rgba(0, 122, 255, 0.6)';
        this.ctx.beginPath();
        this.ctx.moveTo(centerX - 35, idealTopY);
        this.ctx.lineTo(centerX + 35, idealTopY);
        this.ctx.stroke();
        this.ctx.fillStyle = 'rgba(0, 122, 255, 0.9)';
        this.ctx.fillText(`Ideal ${idealLabel}`, centerX + 40, idealTopY + 4);

        // Min crown line
        const minTopY = centerY - minRadiusY;
        this.ctx.strokeStyle = 'rgba(255, 149, 0, 0.6)';
        this.ctx.beginPath();
        this.ctx.moveTo(centerX - 35, minTopY);
        this.ctx.lineTo(centerX + 35, minTopY);
        this.ctx.stroke();
        this.ctx.fillStyle = 'rgba(255, 149, 0, 0.9)';
        this.ctx.fillText(`Min ${minLabel}`, centerX + 40, minTopY + 4);

        // Bottom chin line (same for all - at ideal center)
        const chinY = centerY + idealRadiusY;
        this.ctx.strokeStyle = 'rgba(0, 122, 255, 0.6)';
        this.ctx.beginPath();
        this.ctx.moveTo(centerX - 35, chinY);
        this.ctx.lineTo(centerX + 35, chinY);
        this.ctx.stroke();
        this.ctx.fillStyle = 'rgba(0, 122, 255, 0.9)';
        this.ctx.fillText('Chin', centerX + 40, chinY + 4);

        // Add range indicator at bottom
        this.ctx.font = 'bold 12px -apple-system, sans-serif';
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        this.ctx.shadowBlur = 4;
        const textWidth = this.ctx.measureText(rangeLabel).width;
        this.ctx.fillText(rangeLabel, (this.canvasWidth - textWidth) / 2, this.canvasHeight - 20);

        // Reset shadow
        this.ctx.shadowBlur = 0;
        this.ctx.shadowColor = 'transparent';
    }

    /**
     * Render grid overlay
     */
    renderGrid() {
        const gridInterval = 75; // 0.25 inch at 300 DPI
        const majorInterval = gridInterval * 4; // 1 inch intervals for major lines

        // Draw minor grid lines (every 0.25")
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)'; // Increased from 0.15
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([4, 4]);
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; // Add shadow for better visibility
        this.ctx.shadowBlur = 2;

        // Vertical lines
        for (let x = 0; x <= this.canvasWidth; x += gridInterval) {
            if (x === this.canvasWidth / 2 || x % majorInterval === 0) continue; // Skip center and major lines
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvasHeight);
            this.ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y <= this.canvasHeight; y += gridInterval) {
            if (y === this.canvasHeight / 2 || y % majorInterval === 0) continue; // Skip center and major lines
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvasWidth, y);
            this.ctx.stroke();
        }

        // Draw major grid lines (every 1 inch)
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'; // More visible than minor lines
        this.ctx.lineWidth = 1.5;
        this.ctx.setLineDash([6, 3]); // Different dash pattern
        this.ctx.shadowBlur = 3;

        // Vertical major lines
        for (let x = 0; x <= this.canvasWidth; x += majorInterval) {
            if (x === this.canvasWidth / 2) continue; // Skip center
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvasHeight);
            this.ctx.stroke();
        }

        // Horizontal major lines
        for (let y = 0; y <= this.canvasHeight; y += majorInterval) {
            if (y === this.canvasHeight / 2) continue; // Skip center
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvasWidth, y);
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
        this.ctx.moveTo(this.canvasWidth / 2, 0);
        this.ctx.lineTo(this.canvasWidth / 2, this.canvasHeight);
        this.ctx.stroke();

        // Horizontal center
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvasHeight / 2);
        this.ctx.lineTo(this.canvasWidth, this.canvasHeight / 2);
        this.ctx.stroke();

        // Add measurement labels (inches) with enhanced visibility
        this.ctx.setLineDash([]);
        this.ctx.shadowBlur = 0;
        this.ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, sans-serif'; // Increased from 11px
        this.ctx.textAlign = 'left';

        // Add strong text shadow for maximum readability
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        this.ctx.shadowBlur = 4;
        this.ctx.fillStyle = 'rgba(255, 255, 255, 1.0)'; // Full opacity white

        // Top labels - only major intervals (every inch)
        for (let x = 0; x <= this.canvasWidth; x += majorInterval) {
            const inches = (x / 300).toFixed(1);
            this.ctx.fillText(`${inches}"`, x + 8, 20);
        }

        // Left labels - only major intervals (every inch)
        for (let y = 0; y <= this.canvasHeight; y += majorInterval) {
            const inches = (y / 300).toFixed(1);
            this.ctx.save();
            this.ctx.translate(12, y - 8);
            this.ctx.rotate(-Math.PI / 2);
            this.ctx.fillText(`${inches}"`, 0, 0);
            this.ctx.restore();
        }

        // Grid title with enhanced visibility
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = 'rgba(255, 255, 255, 1.0)'; // Full opacity white
        this.ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, sans-serif'; // Increased from 12px
        this.ctx.shadowBlur = 5;
        this.ctx.fillText('Grid with Scale (¼" intervals, 1" major lines)', this.canvasWidth / 2, this.canvasHeight - 15);

        // Reset context state
        this.ctx.shadowBlur = 0;
        this.ctx.shadowColor = 'transparent';
    }

    /**
     * Clear all guidelines
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }
}
