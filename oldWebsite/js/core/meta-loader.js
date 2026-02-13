/**
 * Meta Loader - Dynamic Cache Control and Common Meta Management
 *
 * This module automatically detects development vs production environment
 * and adds appropriate cache control meta tags.
 *
 * Development: Disables all caching for easier testing
 * Production: Allows normal caching for better performance
 */

/**
 * Detect if we're running in development environment
 * @returns {boolean} true if development, false if production
 */
function isDevelopment() {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;

    // Development indicators
    const isDev = (
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.') ||
        protocol === 'file:' ||
        hostname.includes('.local')
    );

    return isDev;
}

/**
 * Add cache control meta tags for development
 */
function addDevelopmentCacheControl() {
    const cacheControlTags = [
        { httpEquiv: 'Cache-Control', content: 'no-cache, no-store, must-revalidate' },
        { httpEquiv: 'Pragma', content: 'no-cache' },
        { httpEquiv: 'Expires', content: '0' }
    ];

    cacheControlTags.forEach(tag => {
        const meta = document.createElement('meta');
        meta.httpEquiv = tag.httpEquiv;
        meta.content = tag.content;
        document.head.insertBefore(meta, document.head.firstChild);
    });

    console.log('🔧 Development mode: Cache control disabled for easier testing');
}

/**
 * Add production cache optimization meta tags
 */
function addProductionCacheOptimization() {
    // For production, we can add cache-friendly meta tags
    // These help with performance but allow caching
    const prodTags = [
        { httpEquiv: 'Cache-Control', content: 'public, max-age=3600' }, // Cache for 1 hour
    ];

    prodTags.forEach(tag => {
        const meta = document.createElement('meta');
        meta.httpEquiv = tag.httpEquiv;
        meta.content = tag.content;
        document.head.insertBefore(meta, document.head.firstChild);
    });

    console.log('🚀 Production mode: Caching enabled for better performance');
}

/**
 * Initialize meta loader - Call this on page load
 */
export function initMetaLoader() {
    if (isDevelopment()) {
        addDevelopmentCacheControl();
    } else {
        addProductionCacheOptimization();
    }
}

/**
 * Get common meta configuration
 * This provides a template for meta tags that should be consistent across pages
 */
export const commonMetaConfig = {
    // Author and basic info
    author: 'Photo Sheet Maker',
    robots: 'index, follow',

    // Theme and Mobile
    themeColor: '#007AFF',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'default',

    // Social Media defaults
    ogType: 'website',
    ogSiteName: 'Photo Sheet Maker',
    ogLocale: 'en_US',
    ogImageWidth: '1200',
    ogImageHeight: '630',
    twitterCard: 'summary_large_image',

    // Favicons (common paths)
    faviconIco: 'favicon/favicon.ico',
    favicon32: 'favicon/favicon-32x32.png',
    favicon16: 'favicon/favicon-16x16.png',
    appleTouchIcon: 'favicon/apple-touch-icon.png',
    manifest: 'manifest.json',

    // Base URL
    baseUrl: 'https://aniltv06.github.io/passportphotosheet/',
    ogImage: 'https://aniltv06.github.io/passportphotosheet/og-image.jpg',
    twitterImage: 'https://aniltv06.github.io/passportphotosheet/twitter-image.jpg'
};

/**
 * Helper to create page-specific meta configuration
 * @param {Object} pageConfig - Page-specific overrides
 * @returns {Object} Complete meta configuration
 */
export function createPageMeta(pageConfig) {
    return {
        ...commonMetaConfig,
        ...pageConfig
    };
}

// Auto-initialize on page load
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMetaLoader);
    } else {
        // DOM already loaded
        initMetaLoader();
    }
}
