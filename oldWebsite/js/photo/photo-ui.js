/**
 * Photo UI Module
 * Helper functions for generating photo-related UI components
 * Separated from upload logic for better reusability
 */

/**
 * @typedef {Object} UploadUIConfig
 * @property {boolean} [showTitle=true] - Show title
 * @property {boolean} [showDescription=true] - Show description
 * @property {string} [title='I Have a Ready Photo'] - Title text
 * @property {string} [description] - Description text
 */

/**
 * @typedef {Object} UploadUIText
 * @property {string} [uploadIcon='📁'] - Upload icon
 * @property {string} [uploadText='Choose Your Photo'] - Upload button text
 * @property {string} [uploadHint='Click or drag and drop'] - Upload hint text
 * @property {string} [successMessage='Photo uploaded successfully'] - Success message
 */

/**
 * Create upload area HTML
 * @param {string} uploadAreaId - ID for upload area element
 * @param {string} fileInputId - ID for file input element
 * @param {UploadUIConfig} uiConfig - UI configuration
 * @param {UploadUIText} textConfig - Text configuration
 * @returns {string} HTML string for upload area
 */
export function createUploadAreaHTML(uploadAreaId, fileInputId, uiConfig, textConfig) {
    const {
        showTitle = true,
        showDescription = true,
        title = 'I Have a Ready Photo',
        description = 'Upload your 2×2" passport photo and create a professional photo sheet for printing'
    } = uiConfig;

    const {
        uploadIcon = '📁',
        uploadText = 'Choose Your Photo',
        uploadHint = 'Click or drag and drop',
        successMessage = 'Photo uploaded successfully'
    } = textConfig;

    return `
        <div class="c-upload"
             id="${uploadAreaId}"
             role="button"
             tabindex="0"
             aria-label="Upload your passport photo"
             aria-describedby="uploadHint"
             data-testid="upload-dropzone"
             data-component="upload"
             data-state="ready">
            ${showTitle ? `<h3 class="c-upload__title" data-i18n="haveReadyPhoto" data-testid="upload-title">${title}</h3>` : ''}
            ${showDescription ? `<p class="c-upload__description" data-testid="upload-description">${description}</p>` : ''}
            <div class="c-upload__icon" aria-hidden="true" data-testid="upload-icon">${uploadIcon}</div>
            <div class="c-upload__text" data-i18n="uploadText" data-testid="upload-text">${uploadText}</div>
            <div class="c-upload__hint" id="uploadHint" data-i18n="uploadHint" data-testid="upload-hint">${uploadHint}</div>
            <div class="c-upload__success" data-i18n="uploadSuccess" data-testid="upload-success">✓ ${successMessage}</div>
            <input type="file"
                   class="c-upload__input"
                   id="${fileInputId}"
                   accept="image/*"
                   aria-label="Choose photo file"
                   data-testid="upload-input"
                   data-component="file-input">
        </div>
    `;
}

/**
 * Update upload area text (useful for language switching)
 * @param {HTMLElement} uploadArea - Upload area element
 * @param {UploadUIText} newText - New text configuration
 */
export function updateUploadAreaText(uploadArea, newText) {
    if (!uploadArea) return;

    const iconEl = uploadArea.querySelector('.c-upload__icon');
    const textEl = uploadArea.querySelector('.c-upload__text');
    const hintEl = uploadArea.querySelector('.c-upload__hint');
    const successEl = uploadArea.querySelector('.c-upload__success');

    if (iconEl && newText.uploadIcon) {
        iconEl.textContent = newText.uploadIcon;
    }

    if (textEl && newText.uploadText) {
        textEl.textContent = newText.uploadText;
    }

    if (hintEl && newText.uploadHint) {
        hintEl.textContent = newText.uploadHint;
    }

    if (successEl && newText.successMessage) {
        successEl.textContent = `✓ ${newText.successMessage}`;
    }
}

/**
 * Set upload area state
 * @param {HTMLElement} uploadArea - Upload area element
 * @param {string} state - State: 'ready', 'dragover', 'has-image', 'uploading', 'error'
 */
export function setUploadAreaState(uploadArea, state) {
    if (!uploadArea) return;

    // Remove all state classes (using is- prefix for states)
    uploadArea.classList.remove('is-dragover', 'is-uploading', 'is-error');
    uploadArea.classList.remove('has-image'); // Keep has- prefix

    // Update data-state attribute for testing
    uploadArea.setAttribute('data-state', state);

    // Add new state class (use is- prefix for transient states, has- for persistent conditions)
    switch(state) {
        case 'dragover':
            uploadArea.classList.add('is-dragover');
            break;
        case 'uploading':
            uploadArea.classList.add('is-uploading');
            break;
        case 'error':
            uploadArea.classList.add('is-error');
            break;
        case 'has-image':
            uploadArea.classList.add('has-image');
            break;
        case 'ready':
        default:
            // No additional classes for ready state
            break;
    }
}

/**
 * Create screen reader announcement element
 * @param {string} message - Message to announce
 * @param {number} duration - How long to keep element in DOM (ms)
 */
export function announceToScreenReader(message, duration = 3000) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'visually-hidden';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
        if (announcement.parentNode) {
            announcement.parentNode.removeChild(announcement);
        }
    }, duration);
}

/**
 * Validate image file
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @param {number} [options.maxSizeMB] - Maximum file size in MB
 * @param {string[]} [options.allowedTypes] - Allowed MIME types
 * @returns {Object} Validation result {valid: boolean, error: string|null}
 */
export function validateImageFile(file, options = {}) {
    const {
        maxSizeMB = null,
        allowedTypes = null  // Changed to null to accept all image types by default
    } = options;

    // Check if file exists
    if (!file) {
        return {
            valid: false,
            error: 'No file provided'
        };
    }

    // Check file type - accept all image formats
    if (!file.type.startsWith('image/')) {
        return {
            valid: false,
            error: 'Please upload an image file.'
        };
    }

    // Check specific allowed types only if explicitly provided
    if (allowedTypes && Array.isArray(allowedTypes) && allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
        return {
            valid: false,
            error: `File type ${file.type} is not supported. Please use ${allowedTypes.join(', ')}`
        };
    }

    // Check file size if specified
    if (maxSizeMB !== null) {
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            return {
                valid: false,
                error: `File size exceeds ${maxSizeMB}MB limit`
            };
        }
    }

    return {
        valid: true,
        error: null
    };
}

/**
 * Load image from data URL
 * @param {string} dataURL - Base64 encoded image data
 * @returns {Promise<HTMLImageElement>} Promise that resolves with loaded image
 */
export function loadImageFromDataURL(dataURL) {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => resolve(img);

        img.onerror = (e) => {
            console.error('Image load error:', e);

            let errorMsg = 'Failed to load image. ';

            // Check if it's a very large image
            if (dataURL && dataURL.length > 10 * 1024 * 1024) {
                errorMsg += 'The image might be too large for your browser to handle.';
            } else {
                errorMsg += 'Please try a different file.';
            }

            reject(new Error(errorMsg));
        };

        img.src = dataURL;
    });
}

/**
 * Read file as data URL
 * @param {File} file - File to read
 * @returns {Promise<string>} Promise that resolves with data URL
 */
export function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error('Failed to read file'));

        reader.readAsDataURL(file);
    });
}

export default {
    createUploadAreaHTML,
    updateUploadAreaText,
    setUploadAreaState,
    announceToScreenReader,
    validateImageFile,
    loadImageFromDataURL,
    readFileAsDataURL
};
