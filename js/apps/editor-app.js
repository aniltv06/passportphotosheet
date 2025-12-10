/**
 * Photo Editor Application
 * Main coordinator for photo editing functionality
 */

import { CanvasEditor } from '../modules/canvas-editor.js';
import { GuidelinesManager } from '../modules/guidelines-manager.js';
import { CropManager } from '../modules/crop-manager.js';
import { PhotoExporter } from '../modules/photo-exporter.js';
import { debounce, showError, announceToScreenReader, getElement, toggleVisibility } from '../utils/dom-utils.js';
import { trackEvent, trackPageView, trackPhotoUpload, trackError } from '../utils/analytics.js';

/**
 * Photo Editor App Class
 * Coordinates all photo editing modules
 */
export class PhotoEditorApp {
    constructor() {
        // Canvas dimensions - support both 2x2 and 630x810
        this.dimensions = {
            '2x2': { width: 600, height: 600, label: '2×2 inches (51×51 mm)', info: '<strong>Size:</strong> 2×2 inches (51×51 mm) • <strong>Resolution:</strong> 600×600 pixels @ 300 DPI' },
            '630x810': { width: 630, height: 810, label: '630×810 pixels', info: '<strong>Resolution:</strong> 630×810 pixels (Digital Format)' }
        };
        this.currentDimension = '2x2'; // Default dimension

        // Get DOM elements
        this.editCanvas = getElement('editCanvas');
        this.overlayCanvas = getElement('overlayCanvas');
        this.canvasContainer = getElement('canvasContainer');
        this.zoomSlider = getElement('zoomSlider');
        this.zoomValue = getElement('zoomValue');
        this.rotationSlider = getElement('rotationSlider');
        this.rotationValue = getElement('rotationValue');
        this.resetBtn = getElement('resetBtn');
        this.removeBackgroundBtn = getElement('removeBackgroundBtn');
        this.validateFaceBtn = getElement('validateFaceBtn');
        this.cropModeBtn = getElement('cropModeBtn');
        this.exportBtn = getElement('exportBtn');
        this.downloadBtn = getElement('downloadBtn');
        this.toggleFaceGuide = getElement('toggleFaceGuide');
        this.toggleGrid = getElement('toggleGrid');
        this.loadingIndicator = getElement('loadingIndicator');
        this.validationResults = getElement('validationResults');
        this.photoInfo = getElement('photoInfo');
        this.photoInfoText = getElement('photoInfoText');
        this.dimensionSelect = getElement('dimensionSelect');
        this.qualitySelect = getElement('qualitySelect');

        // Initialize modules with default dimension
        this.initializeModules();

        this.init();
    }

    /**
     * Initialize or re-initialize modules with current dimension
     */
    initializeModules() {
        const dim = this.dimensions[this.currentDimension];

        // Initialize canvas editor
        this.canvasEditor = new CanvasEditor(this.editCanvas, this.overlayCanvas, {
            canvasWidth: dim.width,
            canvasHeight: dim.height,
            onChange: (changes) => this.handleCanvasChange(changes),
            onReady: (img) => this.handlePhotoReady(img)
        });

        // Initialize guidelines manager
        this.guidelines = new GuidelinesManager(this.overlayCanvas, {
            canvasWidth: dim.width,
            canvasHeight: dim.height
        });

        // Initialize crop manager
        this.cropManager = new CropManager(this.overlayCanvas, {
            canvasSize: Math.max(dim.width, dim.height), // Use larger dimension for crop
            onCropStart: () => this.handleCropStart(),
            onCropEnd: (rect) => this.handleCropEnd(rect),
            onCropCancel: () => this.handleCropCancel()
        });

        // Initialize exporter
        this.exporter = new PhotoExporter(this.canvasEditor, {
            canvasSize: Math.max(dim.width, dim.height),
            onExportStart: (data) => this.handleExportStart(data),
            onExportSuccess: (data) => this.handleExportSuccess(data),
            onExportError: (error) => this.handleExportError(error)
        });
    }

    /**
     * Initialize application
     */
    init() {
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        this.guidelines.render();
        this.updatePhotoInfoDisplay(); // Set initial photo info display

        // Track page view
        trackPageView();

        console.log('Photo Editor App initialized');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Dimension selector
        this.dimensionSelect?.addEventListener('change', (e) => {
            this.handleDimensionChange(e.target.value);
        });

        // Quality selector
        this.qualitySelect?.addEventListener('change', (e) => {
            this.handleQualityChange(e.target.value);
        });

        // Zoom slider
        this.zoomSlider?.addEventListener('input', debounce((e) => {
            const value = parseFloat(e.target.value);
            this.canvasEditor.setZoom(value);
            this.updateZoomValue(value);
        }, 10));

        // Rotation slider
        this.rotationSlider?.addEventListener('input', debounce((e) => {
            const value = parseFloat(e.target.value);
            this.canvasEditor.setRotation(value);
            this.updateRotationValue(value);
        }, 10));

        // Reset button
        this.resetBtn?.addEventListener('click', () => this.handleReset());

        // Remove background button
        this.removeBackgroundBtn?.addEventListener('click', () => this.handleRemoveBackground());

        // Validate face button
        this.validateFaceBtn?.addEventListener('click', () => this.handleValidateFace());

        // Crop mode button
        this.cropModeBtn?.addEventListener('click', () => this.toggleCropMode());

        // Export buttons
        this.exportBtn?.addEventListener('click', () => this.exporter.exportToPhotoMaker());
        this.downloadBtn?.addEventListener('click', () => this.exporter.exportToPNG());

        // Guidelines toggles
        this.toggleFaceGuide?.addEventListener('change', (e) => {
            this.guidelines.toggleFaceGuide(e.target.checked);
            trackEvent('toggle_face_guide', { enabled: e.target.checked });
        });

        this.toggleGrid?.addEventListener('change', (e) => {
            this.guidelines.toggleGrid(e.target.checked);
            trackEvent('toggle_grid', { enabled: e.target.checked });
        });
    }

    /**
     * Handle quality change
     */
    handleQualityChange(quality) {
        console.log('Quality changed to:', quality);

        // Update exporter quality setting
        this.exporter.setQuality(quality);

        // Track event
        trackEvent('quality_changed', { quality });

        // Announce to screen reader
        const preset = this.exporter.qualityPresets[quality];
        announceToScreenReader(`Export quality changed to ${preset.label}`);
    }

    /**
     * Handle dimension change
     */
    handleDimensionChange(dimension) {
        console.log('Dimension changed to:', dimension);

        // Store current photo if loaded
        const currentImage = this.canvasEditor.currentImage;
        const currentDataURL = currentImage ? this.canvasEditor.toDataURL() : null;

        // Update current dimension
        this.currentDimension = dimension;

        // Re-initialize modules with new dimension
        this.initializeModules();

        // Reload photo if one was loaded
        if (currentDataURL) {
            this.canvasEditor.loadImage(currentDataURL);
        }

        // Render guidelines
        this.guidelines.render();

        // Update photo info display
        this.updatePhotoInfoDisplay();

        // Track event
        trackEvent('dimension_changed', { dimension });

        // Announce to screen reader
        const dim = this.dimensions[dimension];
        announceToScreenReader(`Canvas dimension changed to ${dim.label}`);
    }

    /**
     * Update photo info display based on current dimension
     */
    updatePhotoInfoDisplay() {
        if (!this.photoInfoText) return;

        const dim = this.dimensions[this.currentDimension];
        this.photoInfoText.innerHTML = dim.info;
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Skip if user is typing in input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            switch (e.key.toLowerCase()) {
                case '+':
                case '=':
                    e.preventDefault();
                    this.adjustZoom(0.1);
                    break;
                case '-':
                case '_':
                    e.preventDefault();
                    this.adjustZoom(-0.1);
                    break;
                case 'arrowleft':
                    e.preventDefault();
                    this.adjustRotation(-1);
                    break;
                case 'arrowright':
                    e.preventDefault();
                    this.adjustRotation(1);
                    break;
                case 'r':
                    e.preventDefault();
                    this.handleReset();
                    break;
                case 'c':
                    e.preventDefault();
                    this.toggleCropMode();
                    break;
                case 'v':
                    e.preventDefault();
                    this.handleValidateFace();
                    break;
                case 'escape':
                    e.preventDefault();
                    if (this.cropManager.isActive()) {
                        this.cropManager.cancel();
                    }
                    break;
            }
        });
    }

    /**
     * Handle photo loaded from photo handler
     */
    async onPhotoLoaded(image, dataURL, metadata) {
        console.log('Photo loaded:', metadata);

        try {
            await this.canvasEditor.loadImage(dataURL);
            this.showCanvas();

            trackPhotoUpload(metadata);
        } catch (error) {
            console.error('Failed to load image:', error);
            showError('Failed to load image. Please try again.');
            trackError('image_load_failed', { error: error.message });
        }
    }

    /**
     * Handle photo ready
     */
    handlePhotoReady(img) {
        this.updatePhotoInfo(img);
        this.enableControls();
        this.guidelines.render();

        announceToScreenReader('Photo loaded successfully. You can now adjust and edit your photo.');
    }

    /**
     * Handle canvas change
     */
    handleCanvasChange(changes) {
        // Update UI controls
        if ('scale' in changes && this.zoomSlider) {
            this.zoomSlider.value = changes.scale;
            this.updateZoomValue(changes.scale);
        }

        if ('rotation' in changes && this.rotationSlider) {
            this.rotationSlider.value = changes.rotation;
            this.updateRotationValue(changes.rotation);
        }

        // Enable reset button if not at defaults
        this.updateResetButton();
    }

    /**
     * Handle reset
     */
    handleReset() {
        this.canvasEditor.resetTransform();
        announceToScreenReader('Photo position reset to defaults.');
        trackEvent('photo_reset');
    }

    /**
     * Handle remove background
     */
    async handleRemoveBackground() {
        showError('Background removal feature coming soon. This requires ML model integration.');
        trackEvent('remove_background_clicked');
    }

    /**
     * Handle validate face
     */
    async handleValidateFace() {
        showError('Face validation feature coming soon. This requires ML model integration.');
        trackEvent('validate_face_clicked');
    }

    /**
     * Toggle crop mode
     */
    toggleCropMode() {
        if (this.cropManager.isActive()) {
            this.cropManager.cancel();
        } else {
            this.cropManager.enable();
            trackEvent('crop_mode_enabled');
        }
    }

    /**
     * Handle crop start
     */
    handleCropStart() {
        // Hide guidelines while cropping
        this.guidelines.clear();
        announceToScreenReader('Crop mode activated. Draw a rectangle to crop the photo.');
    }

    /**
     * Handle crop end
     */
    handleCropEnd(rect) {
        console.log('Crop completed:', rect);
        announceToScreenReader('Crop completed.');

        // Restore guidelines
        this.guidelines.render();

        trackEvent('crop_completed', {
            width: rect.width,
            height: rect.height
        });
    }

    /**
     * Handle crop cancel
     */
    handleCropCancel() {
        // Restore guidelines
        this.guidelines.render();
        announceToScreenReader('Crop cancelled.');
    }

    /**
     * Handle export start
     */
    handleExportStart(data) {
        this.showLoading();
    }

    /**
     * Handle export success
     */
    handleExportSuccess(data) {
        this.hideLoading();

        if (data.format === 'png') {
            announceToScreenReader('Photo downloaded successfully.');
        } else if (data.format === 'photomaker') {
            announceToScreenReader('Redirecting to Photo Maker...');
        }
    }

    /**
     * Handle export error
     */
    handleExportError(error) {
        this.hideLoading();
        showError('Failed to export photo. Please try again.');
        trackError('export_failed', { error: error.message });
    }

    /**
     * Adjust zoom by delta
     */
    adjustZoom(delta) {
        const currentZoom = this.canvasEditor.getState().scale;
        this.canvasEditor.setZoom(currentZoom + delta);
    }

    /**
     * Adjust rotation by delta
     */
    adjustRotation(delta) {
        const currentRotation = this.canvasEditor.getState().rotation;
        this.canvasEditor.setRotation(currentRotation + delta);
    }

    /**
     * Update zoom value display
     */
    updateZoomValue(value) {
        if (this.zoomValue) {
            this.zoomValue.textContent = `${Math.round(value * 100)}%`;
        }
    }

    /**
     * Update rotation value display
     */
    updateRotationValue(value) {
        if (this.rotationValue) {
            this.rotationValue.textContent = `${value.toFixed(1)}°`;
        }
    }

    /**
     * Update reset button state
     */
    updateResetButton() {
        if (!this.resetBtn) return;

        const state = this.canvasEditor.getState();
        const isDefault = state.scale === 1 && state.rotation === 0 &&
                         state.offsetX === 0 && state.offsetY === 0;

        this.resetBtn.disabled = isDefault;
    }

    /**
     * Update photo info display
     */
    updatePhotoInfo(img) {
        if (!this.photoInfo) return;

        const info = `${img.width} × ${img.height} px`;
        this.photoInfo.textContent = info;
    }

    /**
     * Enable controls
     */
    enableControls() {
        this.exportBtn?.removeAttribute('disabled');
        this.downloadBtn?.removeAttribute('disabled');
        this.removeBackgroundBtn?.removeAttribute('disabled');
        this.validateFaceBtn?.removeAttribute('disabled');
        this.cropModeBtn?.removeAttribute('disabled');
    }

    /**
     * Show canvas
     */
    showCanvas() {
        toggleVisibility(this.canvasContainer, true);
    }

    /**
     * Show loading indicator
     */
    showLoading() {
        toggleVisibility(this.loadingIndicator, true);
    }

    /**
     * Hide loading indicator
     */
    hideLoading() {
        toggleVisibility(this.loadingIndicator, false);
    }
}

/**
 * Initialize photo editor application
 */
export function initPhotoEditorApp() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.photoEditorApp = new PhotoEditorApp();
        });
    } else {
        window.photoEditorApp = new PhotoEditorApp();
    }
}
