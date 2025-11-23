/**
 * Photo Handler Module
 * Centralized photo management system for uploading, storing, and retrieving photos
 * Supports persistence across pages and future multi-photo functionality
 * Now with dynamic UI generation for true code reuse
 */

// ============================================
// PHOTO STORAGE MANAGER
// ============================================

/**
 * PhotoStorage - Handles persistent storage of photos
 * Future-ready for multiple photo support
 */
class PhotoStorage {
    constructor() {
        this.STORAGE_KEY = 'currentPhoto';
        this.PHOTOS_HISTORY_KEY = 'photosHistory'; // For future use
        this.MAX_HISTORY = 10; // For future use
    }

    /**
     * Save the current photo to localStorage
     * @param {string} photoDataURL - Base64 encoded image data
     * @param {Object} metadata - Photo metadata (width, height, size, type, etc.)
     */
    saveCurrentPhoto(photoDataURL, metadata = {}) {
        const photoData = {
            dataURL: photoDataURL,
            metadata: {
                width: metadata.width || null,
                height: metadata.height || null,
                size: metadata.size || null,
                type: metadata.type || null,
                uploadedAt: new Date().toISOString(),
                ...metadata
            }
        };

        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(photoData));
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                console.warn('Image too large to save in browser storage. The photo will work for this session but will not persist after page reload.');
                // Still allow the photo to be used in the current session
                // Just don't save it to localStorage
            } else {
                console.error('Error saving photo to storage:', error);
            }
        }

        // Future: Add to history
        // this._addToHistory(photoData);
    }

    /**
     * Get the current photo from localStorage
     * @returns {Object|null} Photo data object or null if none exists
     */
    getCurrentPhoto() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error retrieving photo:', error);
            return null;
        }
    }

    /**
     * Check if a photo exists
     * @returns {boolean}
     */
    hasCurrentPhoto() {
        return this.getCurrentPhoto() !== null;
    }

    /**
     * Clear the current photo
     */
    clearCurrentPhoto() {
        localStorage.removeItem(this.STORAGE_KEY);
    }

    /**
     * Clear all photos including history (for future use)
     */
    clearAll() {
        localStorage.removeItem(this.STORAGE_KEY);
        localStorage.removeItem(this.PHOTOS_HISTORY_KEY);
    }

    // Future: History management methods
    // _addToHistory(photoData) { ... }
    // getHistory() { ... }
    // clearHistory() { ... }
}

// ============================================
// PHOTO UPLOAD HANDLER WITH DYNAMIC UI
// ============================================

/**
 * PhotoUploadHandler - Manages photo upload with dynamically generated UI
 */
class PhotoUploadHandler {
    /**
     * @param {Object} config - Configuration object
     * @param {string} config.containerId - ID of container element where UI will be injected
     * @param {Object} config.ui - UI configuration (optional, for customization)
     * @param {boolean} config.ui.showTitle - Show title (default: false for photo-editor)
     * @param {boolean} config.ui.showDescription - Show description (default: false for photo-editor)
     * @param {string} config.ui.title - Custom title text
     * @param {string} config.ui.description - Custom description text
     * @param {Object} config.text - Customizable text labels
     * @param {Function} config.onPhotoLoaded - Callback when photo is loaded
     * @param {Function} config.onError - Callback when error occurs
     * @param {Function} config.analytics - Optional analytics tracking function
     * @param {boolean} config.autoSave - Auto-save to localStorage (default: true)
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
                successMessage: config.text?.successMessage || 'Photo uploaded successfully',
                ...config.text
            },
            onPhotoLoaded: config.onPhotoLoaded || (() => {}),
            onError: config.onError || ((error) => console.error(error)),
            analytics: config.analytics || null,
            autoSave: config.autoSave !== false // Default true
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
        this._createUploadUI();

        // Get references to generated elements
        this.uploadArea = document.getElementById(this.uploadAreaId);
        this.fileInput = document.getElementById(this.fileInputId);

        if (!this.uploadArea || !this.fileInput) {
            console.error('Failed to create upload elements');
            return;
        }

        this._setupEventListeners();
        this._checkForExistingPhoto();
    }

    /**
     * Create and inject the upload UI dynamically
     * Uses index.html UI structure as template
     */
    _createUploadUI() {
        const { ui, text } = this.config;

        // Create upload area HTML based on index.html structure
        const uploadHTML = `
            <div class="upload-area"
                 id="${this.uploadAreaId}"
                 role="button"
                 tabindex="0"
                 aria-label="Upload your passport photo"
                 aria-describedby="uploadHint">
                ${ui.showTitle ? `<h3 data-i18n="haveReadyPhoto" style="margin-bottom: 12px; font-size: 24px; color: var(--text-primary);">${ui.title}</h3>` : ''}
                ${ui.showDescription ? `<p style="margin-bottom: 20px; color: var(--text-secondary); font-size: 15px;">${ui.description}</p>` : ''}
                <div class="upload-icon" aria-hidden="true">${text.uploadIcon}</div>
                <div class="upload-text" data-i18n="uploadText">${text.uploadText}</div>
                <div class="upload-hint" id="uploadHint" data-i18n="uploadHint">${text.uploadHint}</div>
                <div class="upload-success" data-i18n="uploadSuccess">✓ ${text.successMessage}</div>
                <input type="file"
                       id="${this.fileInputId}"
                       accept="image/*"
                       aria-label="Choose photo file"
                       style="display: none;">
            </div>
        `;

        this.container.innerHTML = uploadHTML;
    }

    /**
     * Setup all upload-related event listeners
     */
    _setupEventListeners() {
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
            this.uploadArea.classList.add('dragover');
        });

        this.uploadArea.addEventListener('dragleave', () => {
            this.uploadArea.classList.remove('dragover');
        });

        this.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.uploadArea.classList.remove('dragover');
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
    _checkForExistingPhoto() {
        const existingPhoto = this.storage.getCurrentPhoto();
        if (existingPhoto && existingPhoto.dataURL) {
            this.loadImageFromDataURL(existingPhoto.dataURL, existingPhoto.metadata);
        }
    }

    /**
     * Validate image file
     * @param {File} file - File to validate
     * @throws {Error} If file is not valid
     */
    validateImageFile(file) {
        if (!file.type.startsWith('image/')) {
            throw new Error('Please upload an image file (JPG, PNG, etc.)');
        }

        // No file size restriction - allow images of any size

        return true;
    }

    /**
     * Handle file upload
     * @param {File} file - File to upload
     */
    handleFileUpload(file) {
        try {
            this.validateImageFile(file);

            const reader = new FileReader();

            reader.onload = (e) => {
                this.loadImageFromDataURL(e.target.result, {
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
            };

            reader.onerror = () => {
                const errorMsg = 'Failed to read file. Please try again.';
                this.config.onError(errorMsg);
            };

            reader.readAsDataURL(file);

        } catch (error) {
            this.config.onError(error.message);
        }
    }

    /**
     * Load image from data URL
     * @param {string} dataURL - Base64 encoded image data
     * @param {Object} metadata - Image metadata
     */
    loadImageFromDataURL(dataURL, metadata = {}) {
        const img = new Image();

        img.onload = () => {
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
            this.uploadArea.classList.add('has-image');

            // Announce to screen readers
            const announcement = document.createElement('div');
            announcement.setAttribute('role', 'status');
            announcement.setAttribute('aria-live', 'polite');
            announcement.className = 'visually-hidden';
            announcement.textContent = this.config.text.successMessage;
            document.body.appendChild(announcement);
            setTimeout(() => announcement.remove(), 3000);

            // Call the user's callback
            this.config.onPhotoLoaded(img, dataURL, fullMetadata);
        };

        img.onerror = (e) => {
            console.error('Image load error:', e);
            console.error('Data URL length:', dataURL?.length || 0);
            console.error('Data URL preview:', dataURL?.substring(0, 100) || 'empty');

            let errorMsg = 'Failed to load image. ';

            // Check if it's a very large image
            if (dataURL && dataURL.length > 10 * 1024 * 1024) {
                errorMsg += 'The image might be too large for your browser to handle. Try using a smaller image or reducing its quality.';
            } else {
                errorMsg += 'Please try a different file or check if the image format is supported.';
            }

            this.config.onError(errorMsg);
        };

        img.src = dataURL;
    }

    /**
     * Update UI text (useful for language switching)
     * @param {Object} newText - New text labels
     */
    updateText(newText = {}) {
        this.config.text = { ...this.config.text, ...newText };

        // Update visible elements
        const iconEl = this.uploadArea?.querySelector('.upload-icon');
        const textEl = this.uploadArea?.querySelector('.upload-text');
        const hintEl = this.uploadArea?.querySelector('.upload-hint');
        const successEl = this.uploadArea?.querySelector('.upload-success');

        if (iconEl && newText.uploadIcon) iconEl.textContent = newText.uploadIcon;
        if (textEl && newText.uploadText) textEl.textContent = newText.uploadText;
        if (hintEl && newText.uploadHint) hintEl.textContent = newText.uploadHint;
        if (successEl && newText.successMessage) successEl.textContent = `✓ ${newText.successMessage}`;
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
        if (this.uploadArea) {
            this.uploadArea.classList.remove('has-image');
        }

        // Reset file input
        if (this.fileInput) {
            this.fileInput.value = '';
        }

        console.log('Photo handler reset');
    }
}

// Export classes
export { PhotoStorage, PhotoUploadHandler };
