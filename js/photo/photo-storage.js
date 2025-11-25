/**
 * Photo Storage Module
 * Handles persistent storage of photos in localStorage
 * Separated from upload handling for better modularity
 */

import { APP_CONFIG } from '../config/app-config.js';

/**
 * @typedef {Object} PhotoMetadata
 * @property {number} [width] - Image width in pixels
 * @property {number} [height] - Image height in pixels
 * @property {number} [size] - File size in bytes
 * @property {string} [type] - MIME type
 * @property {string} [name] - Original filename
 * @property {string} uploadedAt - ISO timestamp
 */

/**
 * @typedef {Object} PhotoData
 * @property {string} dataURL - Base64 encoded image data
 * @property {PhotoMetadata} metadata - Photo metadata
 */

/**
 * PhotoStorage Class
 * Manages photo persistence in localStorage
 */
export class PhotoStorage {
    constructor() {
        this.STORAGE_KEY = APP_CONFIG.STORAGE_KEYS.CURRENT_PHOTO;
        this.PHOTOS_HISTORY_KEY = APP_CONFIG.STORAGE_KEYS.PHOTOS_HISTORY;
        this.MAX_HISTORY = APP_CONFIG.IMAGE.MAX_HISTORY;
    }

    /**
     * Save the current photo to localStorage
     * @param {string} photoDataURL - Base64 encoded image data
     * @param {Partial<PhotoMetadata>} metadata - Photo metadata
     * @returns {boolean} True if save was successful
     */
    saveCurrentPhoto(photoDataURL, metadata = {}) {
        const photoData = {
            dataURL: photoDataURL,
            metadata: {
                width: metadata.width || null,
                height: metadata.height || null,
                size: metadata.size || null,
                type: metadata.type || null,
                name: metadata.name || null,
                uploadedAt: new Date().toISOString(),
                ...metadata
            }
        };

        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(photoData));
            return true;
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                console.warn(APP_CONFIG.ERROR_MESSAGES.STORAGE_QUOTA_EXCEEDED);
                return false;
            } else {
                console.error('Error saving photo to storage:', error);
                return false;
            }
        }
    }

    /**
     * Get the current photo from localStorage
     * @returns {PhotoData|null} Photo data object or null if none exists
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
     * @returns {boolean} True if photo exists
     */
    hasCurrentPhoto() {
        return this.getCurrentPhoto() !== null;
    }

    /**
     * Clear the current photo
     * @returns {boolean} True if cleared successfully
     */
    clearCurrentPhoto() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            return true;
        } catch (error) {
            console.error('Error clearing photo:', error);
            return false;
        }
    }

    /**
     * Clear all photos including history
     * @returns {boolean} True if cleared successfully
     */
    clearAll() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            localStorage.removeItem(this.PHOTOS_HISTORY_KEY);
            return true;
        } catch (error) {
            console.error('Error clearing all photos:', error);
            return false;
        }
    }

    /**
     * Get storage size used by photos
     * @returns {number} Size in bytes
     */
    getStorageSize() {
        try {
            const current = localStorage.getItem(this.STORAGE_KEY);
            return current ? current.length * 2 : 0; // Rough estimate (UTF-16)
        } catch (error) {
            console.error('Error getting storage size:', error);
            return 0;
        }
    }

    /**
     * Check if storage quota is available
     * @param {number} requiredSize - Required size in bytes
     * @returns {Promise<boolean>} True if enough space available
     */
    async hasQuota(requiredSize) {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            try {
                const estimate = await navigator.storage.estimate();
                const available = estimate.quota - estimate.usage;
                return available > requiredSize;
            } catch (error) {
                console.warn('Could not estimate storage quota:', error);
                return true; // Assume available if can't check
            }
        }
        return true; // Assume available if API not supported
    }

    // Future: History management methods
    // _addToHistory(photoData) { ... }
    // getHistory() { ... }
    // clearHistory() { ... }
}

export default PhotoStorage;
