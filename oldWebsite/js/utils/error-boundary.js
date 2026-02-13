/**
 * Error Boundary Module
 * Centralized error handling with user-friendly messages and analytics tracking
 * Provides try-catch wrappers and error recovery mechanisms
 */

import { APP_CONFIG } from '../config/app-config.js';
import { showError } from './notification-manager.js';

/**
 * @typedef {Object} ErrorContext
 * @property {string} context - Error context/location
 * @property {Error} error - Original error object
 * @property {*} [metadata] - Additional metadata
 */

/**
 * ErrorBoundary Class
 * Provides error handling utilities and centralized error management
 */
class ErrorBoundary {
    constructor() {
        this.errorHandlers = new Map();
        this.errorLog = [];
        this.maxLogSize = 50;
        this.onErrorCallback = null;
        this.trackingCallback = null;
    }

    /**
     * Execute a function with error handling
     * @param {Function} fn - Function to execute
     * @param {string} context - Error context (e.g., 'Photo Upload', 'Canvas Rendering')
     * @param {Object} options - Additional options
     * @param {boolean} options.showNotification - Show error notification to user
     * @param {boolean} options.rethrow - Re-throw error after handling
     * @param {*} options.fallbackValue - Value to return if error occurs
     * @returns {Promise<*>} Result of function or fallback value
     */
    static async execute(fn, context = 'Unknown', options = {}) {
        const {
            showNotification = true,
            rethrow = false,
            fallbackValue = null
        } = options;

        try {
            return await fn();
        } catch (error) {
            this.handleError(error, context, { showNotification });

            if (rethrow) {
                throw error;
            }

            return fallbackValue;
        }
    }

    /**
     * Handle an error
     * @param {Error} error - Error object
     * @param {string} context - Error context
     * @param {Object} options - Handling options
     */
    static handleError(error, context, options = {}) {
        const { showNotification = true } = options;

        // Log to console
        console.error(`[${context}]`, error);

        // Log error for debugging
        this.logError(error, context);

        // Track in analytics
        this.trackError(context, {
            message: error.message,
            stack: error.stack,
            name: error.name
        });

        // Show user-friendly message
        if (showNotification) {
            const userMessage = this.getUserMessage(error, context);
            showError(userMessage);
        }

        // Call custom error handler if registered
        const instance = ErrorBoundary.getInstance();
        if (instance.onErrorCallback) {
            instance.onErrorCallback({ error, context });
        }
    }

    /**
     * Get user-friendly error message
     * @param {Error} error - Error object
     * @param {string} context - Error context
     * @returns {string} User-friendly message
     */
    static getUserMessage(error, context) {
        // Check for known error types
        const errorMessages = {
            'QuotaExceededError': APP_CONFIG.ERROR_MESSAGES.STORAGE_QUOTA_EXCEEDED,
            'NetworkError': APP_CONFIG.ERROR_MESSAGES.NETWORK_ERROR,
            'TypeError': APP_CONFIG.ERROR_MESSAGES.GENERIC_ERROR,
            'ReferenceError': APP_CONFIG.ERROR_MESSAGES.GENERIC_ERROR
        };

        // Check for context-specific messages
        const contextMessages = {
            'Photo Upload': APP_CONFIG.ERROR_MESSAGES.FILE_READ_ERROR,
            'Image Loading': APP_CONFIG.ERROR_MESSAGES.IMAGE_LOAD_ERROR,
            'Download': APP_CONFIG.ERROR_MESSAGES.DOWNLOAD_FAILED,
            'Demo Generation': APP_CONFIG.ERROR_MESSAGES.DEMO_GENERATION_FAILED
        };

        // Return context-specific message if available
        if (contextMessages[context]) {
            return contextMessages[context];
        }

        // Return error-type-specific message if available
        if (errorMessages[error.name]) {
            return errorMessages[error.name];
        }

        // Return error message if it's user-friendly
        if (error.message && error.message.length < 100 && !error.message.includes('undefined')) {
            return error.message;
        }

        // Default generic message
        return APP_CONFIG.ERROR_MESSAGES.GENERIC_ERROR;
    }

    /**
     * Log error for debugging
     * @param {Error} error - Error object
     * @param {string} context - Error context
     */
    static logError(error, context) {
        const instance = ErrorBoundary.getInstance();

        const errorEntry = {
            timestamp: new Date().toISOString(),
            context,
            name: error.name,
            message: error.message,
            stack: error.stack
        };

        instance.errorLog.push(errorEntry);

        // Limit log size
        if (instance.errorLog.length > instance.maxLogSize) {
            instance.errorLog.shift();
        }
    }

    /**
     * Track error in analytics
     * @param {string} context - Error context
     * @param {Object} errorData - Error data
     */
    static trackError(context, errorData) {
        const instance = ErrorBoundary.getInstance();

        if (instance.trackingCallback) {
            try {
                instance.trackingCallback('error', {
                    error_context: context,
                    error_name: errorData.name,
                    error_message: errorData.message
                });
            } catch (trackingError) {
                console.warn('Error tracking failed:', trackingError);
            }
        }
    }

    /**
     * Wrap a function with error boundary
     * @param {Function} fn - Function to wrap
     * @param {string} context - Error context
     * @param {Object} options - Options
     * @returns {Function} Wrapped function
     */
    static wrap(fn, context, options = {}) {
        return async function(...args) {
            return ErrorBoundary.execute(
                () => fn.apply(this, args),
                context,
                options
            );
        };
    }

    /**
     * Register custom error handler
     * @param {Function} callback - Error handler callback
     */
    static onError(callback) {
        const instance = ErrorBoundary.getInstance();
        instance.onErrorCallback = callback;
    }

    /**
     * Register analytics tracking callback
     * @param {Function} callback - Tracking callback
     */
    static setTracking(callback) {
        const instance = ErrorBoundary.getInstance();
        instance.trackingCallback = callback;
    }

    /**
     * Get error log
     * @returns {Array} Error log entries
     */
    static getErrorLog() {
        const instance = ErrorBoundary.getInstance();
        return [...instance.errorLog];
    }

    /**
     * Clear error log
     */
    static clearErrorLog() {
        const instance = ErrorBoundary.getInstance();
        instance.errorLog = [];
    }

    /**
     * Get singleton instance
     * @returns {ErrorBoundary} Singleton instance
     */
    static getInstance() {
        if (!ErrorBoundary.instance) {
            ErrorBoundary.instance = new ErrorBoundary();
        }
        return ErrorBoundary.instance;
    }

    /**
     * Setup global error handlers
     * @param {Object} options - Configuration options
     */
    static setupGlobalHandlers(options = {}) {
        const {
            handleUnhandledRejections = true,
            handleWindowErrors = true
        } = options;

        // Handle unhandled promise rejections
        if (handleUnhandledRejections) {
            window.addEventListener('unhandledrejection', (event) => {
                event.preventDefault();
                ErrorBoundary.handleError(
                    event.reason || new Error('Unhandled Promise Rejection'),
                    'Unhandled Promise',
                    { showNotification: false }
                );
            });
        }

        // Handle window errors
        if (handleWindowErrors) {
            window.addEventListener('error', (event) => {
                ErrorBoundary.handleError(
                    event.error || new Error(event.message),
                    'Window Error',
                    { showNotification: false }
                );
            });
        }
    }
}

// Export static class
export default ErrorBoundary;

// Export convenience functions
export const executeWithErrorBoundary = (fn, context, options) =>
    ErrorBoundary.execute(fn, context, options);

export const wrapWithErrorBoundary = (fn, context, options) =>
    ErrorBoundary.wrap(fn, context, options);

export const handleError = (error, context, options) =>
    ErrorBoundary.handleError(error, context, options);

export const setupGlobalErrorHandlers = (options) =>
    ErrorBoundary.setupGlobalHandlers(options);
