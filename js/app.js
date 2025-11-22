/**
 * Photo Sheet Maker - Main Application
 * Core logic for creating passport photo sheets
 */

import { trackEvent } from './analytics.js';
import { loadImage, downloadCanvas } from './common.js';

// Configuration
const LAYOUTS = {
    '4x6': { width: 4, height: 6, cols: 2, rows: 3, photos: 6, icon: '💰' },
    '5x7': { width: 5, height: 7, cols: 2, rows: 3, photos: 6, icon: '💵' },
    '8x10': { width: 8, height: 10, cols: 4, rows: 5, photos: 20, icon: '💎' }
};

const PHOTO_SIZE_INCHES = 2;

/**
 * Photo Sheet Maker Application Class
 */
export class PhotoSheetApp {
    constructor() {
        this.uploadedImage = null;
        this.initializeElements();
        this.attachEventListeners();
        this.updateSpacingAvailability();
    }

    /**
     * Initialize DOM elements
     */
    initializeElements() {
        this.elements = {
            uploadArea: document.getElementById('uploadArea'),
            fileInput: document.getElementById('fileInput'),
            paperSize: document.getElementById('paperSize'),
            quality: document.getElementById('quality'),
            spacing: document.getElementById('spacing'),
            border: document.getElementById('border'),
            previewSection: document.getElementById('previewSection'),
            canvas: document.getElementById('canvas'),
            downloadBtn: document.getElementById('downloadBtn'),
            resetBtn: document.getElementById('resetBtn'),
            demoBtn: document.getElementById('demoBtn'),
            photoCount: document.getElementById('photoCount'),
            sheetSize: document.getElementById('sheetSize'),
            costEstimate: document.getElementById('costEstimate'),
            spacingDisabledHint: document.getElementById('spacingDisabledHint')
        };

        this.ctx = this.elements.canvas.getContext('2d', { alpha: false });
    }

    /**
     * Attach all event listeners
     */
    attachEventListeners() {
        const { uploadArea, fileInput, paperSize, quality, spacing, border, downloadBtn, resetBtn, demoBtn } = this.elements;

        // Upload area events
        uploadArea.addEventListener('click', () => fileInput.click());

        uploadArea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fileInput.click();
            }
        });

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file) this.handleImageUpload(file);
        });

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) this.handleImageUpload(file);
        });

        // Options events
        paperSize.addEventListener('change', () => {
            this.updateSpacingAvailability();
            this.handleOptionsChange();
        });
        quality.addEventListener('change', () => this.handleOptionsChange());
        spacing.addEventListener('change', () => this.handleOptionsChange());
        border.addEventListener('change', () => this.handleOptionsChange());

        // Button events
        downloadBtn.addEventListener('click', () => this.handleDownload());
        resetBtn.addEventListener('click', () => this.handleReset());
        demoBtn.addEventListener('click', () => this.loadDemoPhoto());
    }

    /**
     * Handle image upload
     */
    async handleImageUpload(file) {
        try {
            this.uploadedImage = await loadImage(file);
            this.elements.uploadArea.classList.add('has-image');
            this.createComposite();
            this.elements.previewSection.classList.add('active');
            this.announceToScreenReader('Photo uploaded successfully. Your photo sheet preview is ready.');

            trackEvent('photo_uploaded', {
                file_size: file.size,
                file_type: file.type,
                image_width: this.uploadedImage.width,
                image_height: this.uploadedImage.height
            });

            setTimeout(() => {
                this.elements.previewSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        } catch (error) {
            this.showError(error.message);
            trackEvent('photo_upload_error', { error: error.message });
        }
    }

    /**
     * Handle options change
     */
    handleOptionsChange() {
        if (this.uploadedImage) {
            this.createComposite();
            this.announceToScreenReader('Photo sheet updated with new settings.');

            trackEvent('options_changed', {
                paper_size: this.elements.paperSize.value,
                quality: this.elements.quality.value,
                spacing: this.elements.spacing.value,
                border: this.elements.border.value
            });
        }
    }

    /**
     * Update spacing availability based on paper size
     */
    updateSpacingAvailability() {
        const size = this.elements.paperSize.value;
        const { spacing, spacingDisabledHint } = this.elements;

        if (size === '4x6' || size === '8x10') {
            spacing.value = 'none';
            spacing.disabled = true;
            spacing.style.opacity = '0.5';
            spacing.style.cursor = 'not-allowed';
            spacingDisabledHint.style.display = 'block';
        } else {
            spacing.disabled = false;
            spacing.style.opacity = '1';
            spacing.style.cursor = 'pointer';
            spacingDisabledHint.style.display = 'none';
        }
    }

    /**
     * Create composite photo sheet
     */
    createComposite() {
        const size = this.elements.paperSize.value;
        const layout = LAYOUTS[size];
        const dpi = this.elements.quality.value === 'high' ? 300 : 200;
        const gapEnabled = this.elements.spacing.value === 'small';
        const gapSize = gapEnabled ? 0.05 : 0;
        const borderEnabled = this.elements.border.value === 'thin';

        // Update stats
        this.elements.photoCount.textContent = layout.photos;
        this.elements.sheetSize.textContent = size.replace('x', '×') + '"';
        this.elements.costEstimate.textContent = layout.icon;

        // Calculate dimensions
        const canvasWidth = layout.width * dpi;
        const canvasHeight = layout.height * dpi;
        const photoSizePx = PHOTO_SIZE_INCHES * dpi;
        const gapSizePx = gapSize * dpi;

        // Set canvas size
        this.elements.canvas.width = canvasWidth;
        this.elements.canvas.height = canvasHeight;

        // Fill background
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Calculate grid positioning
        const totalPhotosWidth = (layout.cols * photoSizePx) + ((layout.cols - 1) * gapSizePx);
        const totalPhotosHeight = (layout.rows * photoSizePx) + ((layout.rows - 1) * gapSizePx);
        const startX = (canvasWidth - totalPhotosWidth) / 2;
        const startY = (canvasHeight - totalPhotosHeight) / 2;

        // Enable image smoothing for better quality
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';

        // Draw photos in grid
        for (let row = 0; row < layout.rows; row++) {
            for (let col = 0; col < layout.cols; col++) {
                const x = startX + (col * (photoSizePx + gapSizePx));
                const y = startY + (row * (photoSizePx + gapSizePx));

                // Draw the image
                this.ctx.drawImage(this.uploadedImage, x, y, photoSizePx, photoSizePx);

                // Draw cutting guides if spacing is enabled
                if (gapEnabled) {
                    this.ctx.strokeStyle = '#CCCCCC';
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeRect(x, y, photoSizePx, photoSizePx);
                }

                // Draw thin border inside photo if enabled
                if (borderEnabled) {
                    this.ctx.strokeStyle = '#CCCCCC';
                    this.ctx.lineWidth = Math.max(0.5, dpi / 150);
                    const borderOffset = this.ctx.lineWidth / 2;
                    this.ctx.strokeRect(
                        x + borderOffset,
                        y + borderOffset,
                        photoSizePx - this.ctx.lineWidth,
                        photoSizePx - this.ctx.lineWidth
                    );
                }
            }
        }
    }

    /**
     * Handle download
     */
    handleDownload() {
        try {
            const size = this.elements.paperSize.value;
            const timestamp = new Date().toISOString().slice(0, 10);
            const filename = `photo-sheet-${size}-${timestamp}.jpg`;

            downloadCanvas(this.elements.canvas, filename, 'jpg', 0.95);

            this.announceToScreenReader('Your photo sheet has been downloaded successfully.');

            trackEvent('photo_sheet_downloaded', {
                paper_size: size,
                quality: this.elements.quality.value,
                has_cutting_guides: this.elements.spacing.value !== 'none',
                photo_count: LAYOUTS[size].photos
            });
        } catch (error) {
            this.showError('Could not download the file. Please try again.');
            trackEvent('download_error', { error: error.message });
        }
    }

    /**
     * Handle reset
     */
    handleReset() {
        this.uploadedImage = null;
        this.elements.fileInput.value = '';
        this.elements.uploadArea.classList.remove('has-image');
        this.elements.previewSection.classList.remove('active');
        this.ctx.clearRect(0, 0, this.elements.canvas.width, this.elements.canvas.height);

        this.announceToScreenReader('Form reset. You can upload a new photo.');
        trackEvent('form_reset');

        this.elements.uploadArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    /**
     * Load demo photo
     */
    loadDemoPhoto() {
        const demoCanvas = document.createElement('canvas');
        demoCanvas.width = 600;
        demoCanvas.height = 600;
        const demoCtx = demoCanvas.getContext('2d');

        // Background
        const gradient = demoCtx.createLinearGradient(0, 0, 600, 600);
        gradient.addColorStop(0, '#e8f4f8');
        gradient.addColorStop(1, '#d4e8f0');
        demoCtx.fillStyle = gradient;
        demoCtx.fillRect(0, 0, 600, 600);

        // Draw demo face (simplified)
        this.drawDemoFace(demoCtx);

        // Convert to image
        demoCanvas.toBlob((blob) => {
            const img = new Image();
            img.onload = () => {
                this.uploadedImage = img;
                this.elements.uploadArea.classList.add('has-image');
                this.createComposite();
                this.elements.previewSection.classList.add('active');

                trackEvent('demo_loaded');

                setTimeout(() => {
                    this.elements.previewSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            };
            img.src = URL.createObjectURL(blob);
        });
    }

    /**
     * Draw demo face on canvas
     */
    drawDemoFace(ctx) {
        // Head
        ctx.fillStyle = '#ffd4a3';
        ctx.beginPath();
        ctx.ellipse(300, 280, 140, 160, 0, 0, Math.PI * 2);
        ctx.fill();

        // Hair
        ctx.fillStyle = '#4a3428';
        ctx.beginPath();
        ctx.ellipse(300, 160, 150, 140, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.ellipse(260, 260, 18, 22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(340, 260, 18, 22, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#4a3428';
        ctx.beginPath();
        ctx.arc(260, 265, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(340, 265, 10, 0, Math.PI * 2);
        ctx.fill();

        // Nose
        ctx.fillStyle = '#e6b88a';
        ctx.beginPath();
        ctx.moveTo(300, 290);
        ctx.lineTo(290, 310);
        ctx.lineTo(310, 310);
        ctx.closePath();
        ctx.fill();

        // Mouth
        ctx.strokeStyle = '#d4a574';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(300, 330, 30, 0.1, Math.PI - 0.1);
        ctx.stroke();

        // Shoulders
        ctx.fillStyle = '#1e3a8a';
        ctx.beginPath();
        ctx.moveTo(160, 450);
        ctx.lineTo(160, 600);
        ctx.lineTo(440, 600);
        ctx.lineTo(440, 450);
        ctx.quadraticCurveTo(380, 420, 300, 420);
        ctx.quadraticCurveTo(220, 420, 160, 450);
        ctx.fill();
    }

    /**
     * Show error message
     */
    showError(message) {
        alert(message);
        console.error(message);
    }

    /**
     * Announce to screen reader
     */
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'visually-hidden';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    }
}

/**
 * Initialize the application
 */
export function initPhotoSheetApp() {
    return new PhotoSheetApp();
}
