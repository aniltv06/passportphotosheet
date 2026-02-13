/**
 * Photo Uploader Module
 * Manages photo upload with refactored dependencies
 * Uses PhotoStorage, PhotoUI, and EventBus for clean separation of concerns
 */

import { PhotoStorage } from './photo-storage.js';
import {
    createUploadAreaHTML,
    updateUploadAreaText,
    setUploadAreaState,
    announceToScreenReader,
    validateImageFile,
    loadImageFromDataURL,
    readFileAsDataURL
} from './photo-ui.js';
import { emit } from '../utils/event-bus.js';
import { APP_CONFIG } from '../config/app-config.js';

/**
 * @typedef {Object} PhotoUploaderConfig
 * @property {string} containerId - ID of container element
 * @property {Object} [ui] - UI configuration
 * @property {Object} [text] - Text configuration
 * @property {Function} [onPhotoLoaded] - Callback when photo loads
 * @property {Function} [onError] - Callback when error occurs
 * @property {Function} [analytics] - Analytics tracking function
 * @property {boolean} [autoSave=true] - Auto-save to localStorage
 * @property {boolean} [useEventBus=true] - Emit events via EventBus
 */

/**
 * PhotoUploadHandler Class
 * Handles photo upload with dynamic UI generation
 */
export class PhotoUploadHandler {
    /**
     * @param {PhotoUploaderConfig} config - Configuration object
     */
    constructor(config) {
        this.config = {
            containerId: config.containerId,
            ui: {
                showTitle: config.ui?.showTitle !== undefined ? config.ui.showTitle : true,
                showDescription: config.ui?.showDescription !== undefined ? config.ui.showDescription : true,
                title: config.ui?.title || 'I Have a Ready Photo',
                description: config.ui?.description || 'Upload your 2×2" passport photo and create a professional photo sheet for printing',
                ...config.ui
            },
            text: {
                uploadIcon: config.text?.uploadIcon || '📁',
                uploadText: config.text?.uploadText || 'Choose Your Photo',
                uploadHint: config.text?.uploadHint || 'Click or drag and drop',
                successMessage: config.text?.successMessage || APP_CONFIG.SUCCESS_MESSAGES.PHOTO_UPLOADED,
                ...config.text
            },
            onPhotoLoaded: config.onPhotoLoaded || (() => {}),
            onError: config.onError || ((error) => console.error(error)),
            analytics: config.analytics || null,
            autoSave: config.autoSave !== false,
            useEventBus: config.useEventBus !== false
        };

        this.storage = new PhotoStorage();
        this.uploadedImage = null;
        this.uploadAreaId = `upload-area-${Date.now()}`;
        this.fileInputId = `file-input-${Date.now()}`;

        this.init();
    }

    /**
     * Initialize upload UI and event listeners
     */
    init() {
        this.container = document.getElementById(this.config.containerId);

        if (!this.container) {
            console.error(`Container element with id "${this.config.containerId}" not found`);
            return;
        }

        // Generate and inject the upload UI
        this.createUploadUI();

        // Get references to generated elements
        this.uploadArea = document.getElementById(this.uploadAreaId);
        this.fileInput = document.getElementById(this.fileInputId);

        if (!this.uploadArea || !this.fileInput) {
            console.error('Failed to create upload elements');
            return;
        }

        this.setupEventListeners();
        this.checkForExistingPhoto();
    }

    /**
     * Create and inject the upload UI
     */
    createUploadUI() {
        const html = createUploadAreaHTML(
            this.uploadAreaId,
            this.fileInputId,
            this.config.ui,
            this.config.text
        );

        this.container.innerHTML = html;
    }

    /**
     * Setup all upload-related event listeners
     */
    setupEventListeners() {
        // Click to upload
        this.uploadArea.addEventListener('click', () => this.fileInput.click());

        // Keyboard accessibility
        this.uploadArea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.fileInput.click();
            }
        });

        // Drag and drop
        this.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            setUploadAreaState(this.uploadArea, 'dragover');
        });

        this.uploadArea.addEventListener('dragleave', () => {
            setUploadAreaState(this.uploadArea, this.uploadedImage ? 'has-image' : 'default');
        });

        this.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            setUploadAreaState(this.uploadArea, this.uploadedImage ? 'has-image' : 'default');

            const file = e.dataTransfer.files[0];
            if (file) {
                this.handleFileUpload(file);
            }
        });

        // File input change
        this.fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleFileUpload(file);
            }
        });
    }

    /**
     * Check if there's an existing photo in storage and load it
     */
    checkForExistingPhoto() {
        const existingPhoto = this.storage.getCurrentPhoto();
        if (existingPhoto && existingPhoto.dataURL) {
            this.loadFromDataURL(existingPhoto.dataURL, existingPhoto.metadata);
        }
    }

    /**
     * Handle file upload
     * @param {File} file - File to upload
     */
    async handleFileUpload(file) {
        try {
            // Validate file
            const validation = validateImageFile(file, {
                allowedTypes: APP_CONFIG.PHOTO.SUPPORTED_FORMATS,
                maxSizeMB: APP_CONFIG.PHOTO.MAX_FILE_SIZE_MB
            });

            if (!validation.valid) {
                throw new Error(validation.error);
            }

            // Show uploading state
            setUploadAreaState(this.uploadArea, 'uploading');

            // Read file
            const dataURL = await readFileAsDataURL(file);

            // Load image
            await this.loadFromDataURL(dataURL, {
                size: file.size,
                type: file.type,
                name: file.name
            });

            // Track upload
            if (this.config.analytics) {
                this.config.analytics('photo_uploaded', {
                    file_size: file.size,
                    file_type: file.type,
                    source: 'file_upload'
                });
            }

            // Emit event via EventBus
            if (this.config.useEventBus) {
                emit('photo:uploaded', {
                    image: this.uploadedImage,
                    dataURL,
                    metadata: {
                        size: file.size,
                        type: file.type,
                        name: file.name
                    }
                });
            }

        } catch (error) {
            setUploadAreaState(this.uploadArea, 'error');
            this.config.onError(error.message);

            // Emit error event
            if (this.config.useEventBus) {
                emit('photo:error', { error: error.message });
            }

            // Reset state after delay
            setTimeout(() => {
                setUploadAreaState(this.uploadArea, this.uploadedImage ? 'has-image' : 'default');
            }, 2000);
        }
    }

    /**
     * Load image from data URL
     * @param {string} dataURL - Base64 encoded image data
     * @param {Object} metadata - Image metadata
     */
    async loadFromDataURL(dataURL, metadata = {}) {
        try {
            const img = await loadImageFromDataURL(dataURL);

            this.uploadedImage = img;

            // Update metadata with image dimensions
            const fullMetadata = {
                ...metadata,
                width: img.width,
                height: img.height
            };

            // Auto-save to storage if enabled
            if (this.config.autoSave) {
                this.storage.saveCurrentPhoto(dataURL, fullMetadata);
            }

            // Update UI to show success state
            setUploadAreaState(this.uploadArea, 'has-image');

            // Announce to screen readers
            announceToScreenReader(this.config.text.successMessage);

            // Call the user's callback
            this.config.onPhotoLoaded(img, dataURL, fullMetadata);

            // Emit event via EventBus
            if (this.config.useEventBus) {
                emit('photo:loaded', {
                    image: img,
                    dataURL,
                    metadata: fullMetadata
                });
            }

        } catch (error) {
            console.error('Image load error:', error);
            setUploadAreaState(this.uploadArea, 'error');
            this.config.onError(error.message);

            // Emit error event
            if (this.config.useEventBus) {
                emit('photo:error', { error: error.message });
            }
        }
    }

    /**
     * Update UI text (useful for language switching)
     * @param {Object} newText - New text labels
     */
    updateText(newText = {}) {
        this.config.text = { ...this.config.text, ...newText };
        updateUploadAreaText(this.uploadArea, this.config.text);
    }

    /**
     * Get current uploaded image
     * @returns {HTMLImageElement|null}
     */
    getCurrentImage() {
        return this.uploadedImage;
    }

    /**
     * Check if image is loaded
     * @returns {boolean}
     */
    hasImage() {
        return this.uploadedImage !== null;
    }

    /**
     * Reset handler (clear image and storage)
     */
    reset() {
        this.uploadedImage = null;
        this.storage.clearCurrentPhoto();

        // Reset UI
        setUploadAreaState(this.uploadArea, 'default');

        // Reset file input
        if (this.fileInput) {
            this.fileInput.value = '';
        }

        // Emit event
        if (this.config.useEventBus) {
            emit('photo:reset');
        }

        console.log('Photo handler reset');
    }
}

export default PhotoUploadHandler;
