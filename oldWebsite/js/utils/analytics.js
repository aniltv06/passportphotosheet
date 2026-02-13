/**
 * Analytics Utilities Module
 * Helper functions for tracking user interactions
 */

/**
 * Track event in Google Analytics and Microsoft Clarity
 * @param {string} eventName - Event name
 * @param {Object} eventParams - Event parameters
 */
export function trackEvent(eventName, eventParams = {}) {
    // Google Analytics 4
    if (typeof gtag === 'function') {
        try {
            gtag('event', eventName, eventParams);
        } catch (error) {
            console.warn('GA tracking error:', error);
        }
    }

    // Microsoft Clarity Custom Tags
    if (typeof clarity === 'function') {
        try {
            clarity('set', eventName, JSON.stringify(eventParams));
        } catch (error) {
            console.warn('Clarity tracking error:', error);
        }
    }
}

/**
 * Track page view
 */
export function trackPageView() {
    if (typeof gtag === 'function') {
        try {
            gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href,
                page_path: window.location.pathname
            });
        } catch (error) {
            console.warn('Page view tracking error:', error);
        }
    }
}

/**
 * Track photo upload
 * @param {Object} metadata - Photo metadata
 */
export function trackPhotoUpload(metadata = {}) {
    trackEvent('photo_uploaded', {
        event_category: 'Photo Upload',
        ...metadata
    });
}

/**
 * Track photo sheet download
 * @param {Object} options - Download options
 */
export function trackDownload(options = {}) {
    trackEvent('photo_sheet_downloaded', {
        event_category: 'Download',
        ...options
    });
}

/**
 * Track form option change
 * @param {string} option - Option name
 * @param {*} value - Option value
 */
export function trackOptionChange(option, value) {
    trackEvent('option_changed', {
        event_category: 'Form',
        option,
        value
    });
}

/**
 * Track demo usage
 */
export function trackDemoUsage() {
    trackEvent('demo_photo_used', {
        event_category: 'Demo'
    });
}

/**
 * Track error
 * @param {string} errorType - Error type
 * @param {Object} errorDetails - Error details
 */
export function trackError(errorType, errorDetails = {}) {
    trackEvent('error_occurred', {
        event_category: 'Error',
        error_type: errorType,
        ...errorDetails
    });
}
