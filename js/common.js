/**
 * Common Utilities Module
 * Shared utility functions used across the application
 */

/**
 * Set the current year in footer
 */
export function setCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function to limit execution rate
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Load an image from a file or URL
 * @param {File|string} source - File object or URL string
 * @returns {Promise<HTMLImageElement>} Promise that resolves with loaded image
 */
export function loadImage(source) {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load image'));

        if (source instanceof File) {
            const reader = new FileReader();
            reader.onload = (e) => {
                img.src = e.target.result;
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(source);
        } else {
            img.src = source;
        }
    });
}

/**
 * Download a canvas as an image file
 * @param {HTMLCanvasElement} canvas - Canvas element to download
 * @param {string} filename - Name of the downloaded file
 * @param {string} format - Image format ('png' or 'jpg')
 * @param {number} quality - JPEG quality (0-1), only used for 'jpg' format
 */
export function downloadCanvas(canvas, filename = 'photo-sheet.jpg', format = 'jpg', quality = 0.95) {
    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';

    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, mimeType, quality);
}

/**
 * Show/hide an element
 * @param {string|HTMLElement} element - Element or selector
 * @param {boolean} show - True to show, false to hide
 */
export function toggleElement(element, show) {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (el) {
        el.style.display = show ? '' : 'none';
    }
}

/**
 * Add class to element
 * @param {string|HTMLElement} element - Element or selector
 * @param {string} className - Class name to add
 */
export function addClass(element, className) {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (el) {
        el.classList.add(className);
    }
}

/**
 * Remove class from element
 * @param {string|HTMLElement} element - Element or selector
 * @param {string} className - Class name to remove
 */
export function removeClass(element, className) {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (el) {
        el.classList.remove(className);
    }
}

/**
 * Validate image file
 * @param {File} file - File to validate
 * @returns {Object} Validation result {valid: boolean, error: string}
 */
export function validateImageFile(file) {
    // Basic check to ensure it's an image file
    if (!file.type.startsWith('image/')) {
        return {
            valid: false,
            error: 'Please upload an image file.'
        };
    }

    return { valid: true, error: null };
}

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size string
 */
export function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

/**
 * Initialize common page elements
 */
export function initCommon() {
    setCurrentYear();
}

// Auto-initialize common functionality
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCommon);
    } else {
        initCommon();
    }
}
