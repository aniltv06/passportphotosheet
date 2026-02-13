/**
 * DOM Utilities Module
 * Helper functions for DOM manipulation and events
 */

import { showError as showErrorNotification, showSuccess, showWarning, showInfo } from './notification-manager.js';

/**
 * Debounce function to limit event handler execution
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
 * Show error message to user using notification system
 * @param {string} message - Error message
 * @param {Object} options - Notification options
 */
export function showError(message, options = {}) {
    console.error(message);
    showErrorNotification(message, options);
}

/**
 * Show success message to user
 * @param {string} message - Success message
 * @param {Object} options - Notification options
 */
export { showSuccess };

/**
 * Show warning message to user
 * @param {string} message - Warning message
 * @param {Object} options - Notification options
 */
export { showWarning };

/**
 * Show info message to user
 * @param {string} message - Info message
 * @param {Object} options - Notification options
 */
export { showInfo };

/**
 * Announce message to screen readers
 * @param {string} message - Message to announce
 */
export function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'visually-hidden';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
}

/**
 * Safely query element by ID
 * @param {string} id - Element ID
 * @returns {HTMLElement|null} Element or null
 */
export function getElement(id) {
    return document.getElementById(id);
}

/**
 * Toggle element visibility
 * @param {HTMLElement} element - Element to toggle
 * @param {boolean} visible - Visibility state
 */
export function toggleVisibility(element, visible) {
    if (!element) return;

    if (visible) {
        element.classList.add('active');
    } else {
        element.classList.remove('active');
    }
}

/**
 * Smooth scroll to element
 * @param {HTMLElement} element - Element to scroll to
 * @param {Object} options - Scroll options
 */
export function scrollToElement(element, options = {}) {
    if (!element) return;

    const defaultOptions = {
        behavior: 'smooth',
        block: 'nearest'
    };

    element.scrollIntoView({ ...defaultOptions, ...options });
}
