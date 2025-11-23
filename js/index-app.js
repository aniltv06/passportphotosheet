/**
 * Main Application Module for Index Page
 * Coordinates all modules and manages application state
 */

import { CanvasRenderer } from './modules/canvas-renderer.js';
import { FormHandler } from './modules/form-handler.js';
import { DownloadHandler } from './modules/download-handler.js';
import { generateDemoPhoto } from './modules/demo-generator.js';
import { getLayout } from './modules/layout-config.js';
import { debounce, showError, announceToScreenReader, getElement, toggleVisibility, scrollToElement } from './utils/dom-utils.js';
import { trackEvent, trackPageView, trackDownload, trackDemoUsage, trackError } from './utils/analytics.js';

/**
 * Photo Sheet Application Class
 */
export class PhotoSheetApp {
    constructor() {
        // State
        this.uploadedImage = null;
        this.currentLanguage = localStorage.getItem('preferredLanguage') || 'en';

        // Get DOM elements
        this.canvas = getElement('canvas');
        this.previewSection = getElement('previewSection');
        this.downloadBtn = getElement('downloadBtn');
        this.resetBtn = getElement('resetBtn');
        this.demoBtn = getElement('demoBtn');
        this.optionsForm = getElement('optionsForm');

        // Initialize modules
        this.canvasRenderer = new CanvasRenderer(this.canvas);
        this.formHandler = new FormHandler(
            this.optionsForm,
            debounce(() => this.handleOptionsChange(), 100)
        );
        this.downloadHandler = new DownloadHandler(this.canvasRenderer, {
            onSuccess: (data) => this.handleDownloadSuccess(data),
            onError: (error) => this.handleDownloadError(error)
        });

        this.init();
    }

    /**
     * Initialize application
     */
    init() {
        // Set up event listeners
        this.setupEventListeners();

        // Track page view
        trackPageView();

        console.log('Photo Sheet App initialized');
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Download button
        this.downloadBtn?.addEventListener('click', () => this.handleDownload());

        // Reset button
        this.resetBtn?.addEventListener('click', () => this.handleReset());

        // Demo button
        this.demoBtn?.addEventListener('click', () => this.handleDemo());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.uploadedImage) {
                this.handleReset();
            }
        });
    }

    /**
     * Handle photo loaded from photo handler
     * @param {HTMLImageElement} image - Loaded image
     * @param {string} dataURL - Image data URL
     * @param {Object} metadata - Image metadata
     */
    onPhotoLoaded(image, dataURL, metadata) {
        console.log('Photo loaded:', metadata);

        this.uploadedImage = image;
        this.renderPhotoSheet();
        this.showPreview();

        announceToScreenReader(
            this.getTranslation('srPhotoUploaded') || 'Photo uploaded successfully. Your photo sheet preview is ready.'
        );
    }

    /**
     * Handle options change
     */
    handleOptionsChange() {
        if (!this.uploadedImage) return;

        const options = this.formHandler.getOptions();

        // Update stats
        this.formHandler.updateStats(options.layout, options.paperSize);

        // Re-render photo sheet
        this.renderPhotoSheet();

        announceToScreenReader(
            this.getTranslation('srPhotoSheetUpdated') || 'Photo sheet updated with new settings.'
        );

        // Track options change
        trackEvent('options_changed', {
            paper_size: options.paperSize,
            quality: options.quality,
            cutting_guide: options.cuttingGuide
        });
    }

    /**
     * Render photo sheet on canvas
     */
    renderPhotoSheet() {
        if (!this.uploadedImage) return;

        const options = this.formHandler.getOptions();

        this.canvasRenderer.createComposite(
            this.uploadedImage,
            options.layout,
            options.dpi,
            {
                gapEnabled: options.gapEnabled,
                gapSize: options.gapSize,
                borderEnabled: options.borderEnabled
            }
        );
    }

    /**
     * Handle download
     */
    handleDownload() {
        const options = this.formHandler.getOptions();

        const success = this.downloadHandler.download(options.paperSize, {
            format: 'image/jpeg',
            quality: 0.95,
            prefix: 'photo-sheet'
        });

        if (success) {
            announceToScreenReader(
                this.getTranslation('srDownloadSuccess') || 'Your photo sheet has been downloaded successfully.'
            );
        }
    }

    /**
     * Handle download success
     * @param {Object} data - Download data
     */
    handleDownloadSuccess(data) {
        const options = this.formHandler.getOptions();

        trackDownload({
            paper_size: data.paperSize,
            quality: options.quality,
            cutting_guide: options.cuttingGuide,
            has_cutting_guides: options.gapEnabled || options.borderEnabled,
            photo_count: options.layout.photos,
            language: this.currentLanguage
        });
    }

    /**
     * Handle download error
     * @param {Error} error - Error object
     */
    handleDownloadError(error) {
        showError(
            this.getTranslation('errorDownloadFailed') || 'Could not download the file. Please try again.'
        );

        trackError('download_failed', { error: error.message });
    }

    /**
     * Handle reset/start over
     */
    handleReset() {
        this.uploadedImage = null;
        this.canvasRenderer.clear();
        this.hidePreview();

        // Notify photo handler to reset
        if (window.photoHandler?.reset) {
            window.photoHandler.reset();
        }

        trackEvent('form_reset', {
            event_category: 'Photo Upload',
            event_label: 'Start Over'
        });

        announceToScreenReader(
            this.getTranslation('srReset') || 'Photo cleared. Ready to upload a new photo.'
        );
    }

    /**
     * Handle demo button click
     */
    async handleDemo() {
        try {
            const demoImage = await generateDemoPhoto();
            this.uploadedImage = demoImage;
            this.renderPhotoSheet();
            this.showPreview();

            announceToScreenReader(
                this.getTranslation('srDemoLoaded') || 'Demo photo loaded successfully. Your photo sheet preview is ready.'
            );

            trackDemoUsage();

            // Smooth scroll to preview
            setTimeout(() => {
                scrollToElement(this.previewSection, { block: 'nearest' });
            }, 100);
        } catch (error) {
            console.error('Demo generation error:', error);
            showError('Could not generate demo photo. Please try again.');
            trackError('demo_generation_failed', { error: error.message });
        }
    }

    /**
     * Show preview section
     */
    showPreview() {
        toggleVisibility(this.previewSection, true);

        // Show progress steps if available
        const progressSteps = getElement('progressSteps');
        if (progressSteps) {
            progressSteps.style.display = 'flex';
        }
    }

    /**
     * Hide preview section
     */
    hidePreview() {
        toggleVisibility(this.previewSection, false);

        // Hide progress steps
        const progressSteps = getElement('progressSteps');
        if (progressSteps) {
            progressSteps.style.display = 'none';
        }
    }

    /**
     * Get translation for current language
     * @param {string} key - Translation key
     * @returns {string|null} Translated text or null
     */
    getTranslation(key) {
        if (window.translations && window.translations[this.currentLanguage]) {
            return window.translations[this.currentLanguage][key];
        }
        return null;
    }

    /**
     * Update language
     * @param {string} lang - Language code
     */
    updateLanguage(lang) {
        this.currentLanguage = lang;
    }
}

/**
 * Initialize application when DOM is ready
 */
export function initPhotoSheetApp() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.photoSheetApp = new PhotoSheetApp();
        });
    } else {
        window.photoSheetApp = new PhotoSheetApp();
    }
}
