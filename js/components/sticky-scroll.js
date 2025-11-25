/**
 * Sticky Scroll Module
 * Makes elements sticky on scroll with configurable behavior
 */

// Safe analytics tracking - won't break if analytics isn't available
function trackEvent(eventName, params) {
    try {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'Sticky Scroll',
                ...params
            });
        }
    } catch (e) {
        // Silently fail if analytics not available
    }
}

/**
 * Sticky Scroll Manager
 * Handles multiple sticky elements with smart positioning
 */
export class StickyScrollManager {
    constructor() {
        this.stickyElements = new Map();
        this.isScrolling = false;
        this.scrollTimeout = null;
        this.initialized = false;
    }

    init() {
        // Prevent double initialization
        if (this.initialized) return;
        this.initialized = true;

        // Auto-detect elements with data-sticky attribute
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.autoDetect();
                this.attachScrollListener();
            });
        } else {
            // DOM already loaded
            this.autoDetect();
            this.attachScrollListener();
        }
    }

    /**
     * Auto-detect sticky elements from DOM
     */
    autoDetect() {
        const elements = document.querySelectorAll('[data-sticky]');
        elements.forEach(element => {
            const config = {
                offset: parseInt(element.dataset.stickyOffset) || 0,
                container: element.dataset.stickyContainer || null,
                behavior: element.dataset.stickyBehavior || 'fixed', // 'fixed' or 'relative'
                zIndex: parseInt(element.dataset.stickyZindex) || 100
            };
            this.register(element, config);
        });
    }

    /**
     * Register an element to be sticky
     * @param {HTMLElement} element - Element to make sticky
     * @param {Object} config - Configuration options
     */
    register(element, config = {}) {
        const defaultConfig = {
            offset: 0,
            container: null,
            behavior: 'fixed',
            zIndex: 100,
            onStick: null,
            onUnstick: null
        };

        const finalConfig = { ...defaultConfig, ...config };

        // Store original position info
        const rect = element.getBoundingClientRect();
        const originalTop = rect.top + window.pageYOffset;
        const originalPosition = window.getComputedStyle(element).position;

        this.stickyElements.set(element, {
            ...finalConfig,
            originalTop,
            originalPosition,
            isStuck: false
        });

        // Initial check
        this.checkElement(element);
    }

    /**
     * Attach scroll listener
     */
    attachScrollListener() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        // Also check on resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    /**
     * Handle scroll event
     */
    handleScroll() {
        this.stickyElements.forEach((config, element) => {
            this.checkElement(element);
        });

        // Debounced scroll end detection
        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => {
            this.isScrolling = false;
        }, 150);
    }

    /**
     * Check if element should be sticky
     */
    checkElement(element) {
        const config = this.stickyElements.get(element);
        if (!config) return;

        const scrollTop = window.pageYOffset;
        const triggerPoint = config.originalTop - config.offset;
        const shouldStick = scrollTop > triggerPoint;

        if (shouldStick && !config.isStuck) {
            this.stickElement(element, config);
        } else if (!shouldStick && config.isStuck) {
            this.unstickElement(element, config);
        }

        // Handle container boundaries
        if (config.container && config.isStuck) {
            this.handleContainerBoundary(element, config);
        }
    }

    /**
     * Make element sticky
     */
    stickElement(element, config) {
        const rect = element.getBoundingClientRect();

        // Apply sticky styles
        element.style.position = config.behavior;
        element.style.top = `${config.offset}px`;
        element.style.zIndex = config.zIndex;
        element.style.width = `${rect.width}px`;

        // Add class for custom styling
        element.classList.add('is-stuck');

        // Mark as stuck
        config.isStuck = true;

        // Callback
        if (config.onStick) {
            config.onStick(element);
        }

        // Track event
        trackEvent('sticky_element_stuck', {
            element: element.id || element.className
        });
    }

    /**
     * Unstick element
     */
    unstickElement(element, config) {
        // Restore original position
        element.style.position = config.originalPosition;
        element.style.top = '';
        element.style.zIndex = '';
        element.style.width = '';

        // Remove class
        element.classList.remove('is-stuck');

        // Mark as not stuck
        config.isStuck = false;

        // Callback
        if (config.onUnstick) {
            config.onUnstick(element);
        }
    }

    /**
     * Handle container boundary
     */
    handleContainerBoundary(element, config) {
        const container = document.querySelector(config.container);
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const containerBottom = containerRect.bottom;
        const elementHeight = elementRect.height;

        // Check if element should stop at container bottom
        if (containerBottom < elementHeight + config.offset) {
            const adjustment = elementHeight + config.offset - containerBottom;
            element.style.transform = `translateY(-${adjustment}px)`;
        } else {
            element.style.transform = '';
        }
    }

    /**
     * Handle resize
     */
    handleResize() {
        // Recalculate all positions
        this.stickyElements.forEach((config, element) => {
            if (!config.isStuck) {
                const rect = element.getBoundingClientRect();
                config.originalTop = rect.top + window.pageYOffset;
            }
            this.checkElement(element);
        });
    }

    /**
     * Unregister an element
     */
    unregister(element) {
        const config = this.stickyElements.get(element);
        if (config && config.isStuck) {
            this.unstickElement(element, config);
        }
        this.stickyElements.delete(element);
    }

    /**
     * Destroy manager
     */
    destroy() {
        this.stickyElements.forEach((config, element) => {
            this.unregister(element);
        });
        this.stickyElements.clear();
    }
}

/**
 * Simple sticky utility function
 * For quick one-off sticky elements
 */
export function makeSticky(selector, options = {}) {
    const element = typeof selector === 'string'
        ? document.querySelector(selector)
        : selector;

    if (!element) {
        console.warn(`Sticky element not found: ${selector}`);
        return null;
    }

    const manager = new StickyScrollManager();
    manager.register(element, options);
    return manager;
}

/**
 * Initialize sticky scroll for the page
 */
export function initStickyScroll() {
    // Create global manager instance
    if (typeof window !== 'undefined') {
        if (!window.stickyScrollManager) {
            window.stickyScrollManager = new StickyScrollManager();
            window.stickyScrollManager.init(); // Initialize the manager

            // Make utilities available globally
            window.makeSticky = makeSticky;
        }
    }
}

// Note: Auto-initialization removed to prevent double initialization
// Call initStickyScroll() explicitly when needed
