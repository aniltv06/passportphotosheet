/**
 * Application Configuration
 * Central configuration for all app constants and settings
 */

/**
 * @typedef {Object} AppConfig
 * @property {Object} STORAGE_KEYS - LocalStorage key constants
 * @property {Object} ELEMENT_IDS - DOM element ID constants
 * @property {Object} DEFAULTS - Default values for app settings
 * @property {Object} IMAGE - Image processing settings
 * @property {Object} NOTIFICATION - Notification system settings
 * @property {Object} ANALYTICS - Analytics configuration
 */

export const APP_CONFIG = {
    /**
     * LocalStorage keys
     */
    STORAGE_KEYS: {
        CURRENT_PHOTO: 'currentPhoto',
        PHOTOS_HISTORY: 'photosHistory',
        PREFERRED_LANGUAGE: 'preferredLanguage'
    },

    /**
     * DOM Element IDs for main index page
     */
    ELEMENT_IDS: {
        // Form elements
        PAPER_SIZE_SELECT: 'paperSize',
        QUALITY_SELECT: 'quality',
        CUTTING_GUIDE_SELECT: 'cuttingGuide',
        CUTTING_GUIDE_HINT: 'cuttingGuideDisabledHint',

        // Canvas and preview
        CANVAS: 'canvas',
        PREVIEW_SECTION: 'previewSection',
        PROGRESS_STEPS: 'progressSteps',

        // Buttons
        DOWNLOAD_BTN: 'downloadBtn',
        RESET_BTN: 'resetBtn',
        DEMO_BTN: 'demoBtn',

        // Forms
        OPTIONS_FORM: 'optionsForm',

        // Stats
        PHOTO_COUNT: 'photoCount',
        SHEET_SIZE: 'sheetSize'
    },

    /**
     * Default values for application
     */
    DEFAULTS: {
        PAPER_SIZE: '4x6',
        QUALITY: 'high',
        CUTTING_GUIDE: 'none-none',
        LANGUAGE: 'en',
        GAP_SIZE: 0.05,
        DEBOUNCE_DELAY: 100
    },

    /**
     * Image processing settings
     */
    IMAGE: {
        MAX_HISTORY: 10,
        QUALITY: 0.95,
        FORMAT: 'image/jpeg',
        DOWNLOAD_PREFIX: 'photo-sheet',
        SMOOTHING_QUALITY: 'high'
    },

    /**
     * Notification system configuration
     */
    NOTIFICATION: {
        DURATION: {
            SUCCESS: 5000,
            ERROR: 7000,
            INFO: 4000,
            WARNING: 6000
        },
        POSITION: 'top-right', // top-right, top-left, bottom-right, bottom-left, top-center
        MAX_VISIBLE: 3,
        ANIMATION_DURATION: 300
    },

    /**
     * Analytics configuration
     */
    ANALYTICS: {
        ENABLED: true,
        DEBUG: false
    },

    /**
     * Photo size limits
     */
    PHOTO: {
        MAX_FILE_SIZE_MB: null, // No limit
        SUPPORTED_FORMATS: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    },

    /**
     * UI/UX settings
     */
    UI: {
        SCROLL_BEHAVIOR: 'smooth',
        SCROLL_BLOCK: 'nearest',
        SCREEN_READER_ANNOUNCEMENT_DURATION: 3000
    },

    /**
     * Error messages (can be overridden by i18n)
     */
    ERROR_MESSAGES: {
        INVALID_FILE_TYPE: 'Please upload an image file (JPG, PNG, etc.)',
        FILE_READ_ERROR: 'Failed to read file. Please try again.',
        IMAGE_LOAD_ERROR: 'Failed to load image. Please try a different file.',
        IMAGE_TOO_LARGE: 'The image might be too large for your browser to handle. Try using a smaller image or reducing its quality.',
        DOWNLOAD_FAILED: 'Could not download the file. Please try again.',
        DEMO_GENERATION_FAILED: 'Could not generate demo photo. Please try again.',
        STORAGE_QUOTA_EXCEEDED: 'Image too large to save in browser storage. The photo will work for this session but will not persist after page reload.',
        NETWORK_ERROR: 'Network connection issue. Please check your connection.',
        GENERIC_ERROR: 'An error occurred. Please try again.'
    },

    /**
     * Success messages (can be overridden by i18n)
     */
    SUCCESS_MESSAGES: {
        PHOTO_UPLOADED: 'Photo uploaded successfully',
        PHOTO_SHEET_UPDATED: 'Photo sheet updated with new settings',
        DOWNLOAD_SUCCESS: 'Your photo sheet has been downloaded successfully',
        DEMO_LOADED: 'Demo photo loaded successfully'
    }
};

/**
 * Get a config value safely
 * @param {string} path - Dot notation path to config value (e.g., 'DEFAULTS.PAPER_SIZE')
 * @param {*} defaultValue - Default value if path not found
 * @returns {*} Config value or default
 */
export function getConfig(path, defaultValue = null) {
    const keys = path.split('.');
    let value = APP_CONFIG;

    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            return defaultValue;
        }
    }

    return value;
}

/**
 * Get element ID from config
 * @param {string} key - Element ID key (e.g., 'CANVAS')
 * @returns {string} Element ID
 */
export function getElementId(key) {
    return APP_CONFIG.ELEMENT_IDS[key] || key;
}

/**
 * Get default value from config
 * @param {string} key - Default value key (e.g., 'PAPER_SIZE')
 * @returns {*} Default value
 */
export function getDefault(key) {
    return APP_CONFIG.DEFAULTS[key];
}

export default APP_CONFIG;
