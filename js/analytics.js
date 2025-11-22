/**
 * Analytics Module
 * Handles Google Analytics 4 and Microsoft Clarity tracking
 */

// Google Analytics Configuration
const GA_ID = 'G-BHSENQTDSF';
const CLARITY_ID = 'u9f5jiwh0y';

/**
 * Initialize Google Analytics 4
 */
export function initGoogleAnalytics() {
    // Load gtag script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    // Initialize dataLayer and gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', GA_ID, {
        'anonymize_ip': true,
        'cookie_flags': 'SameSite=None;Secure'
    });
}

/**
 * Initialize Microsoft Clarity
 */
export function initClarity() {
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", CLARITY_ID);
}

/**
 * Track a custom event
 * @param {string} eventName - Name of the event
 * @param {Object} eventParams - Event parameters
 */
export function trackEvent(eventName, eventParams = {}) {
    // Google Analytics 4
    if (typeof gtag === 'function') {
        gtag('event', eventName, eventParams);
    }

    // Microsoft Clarity Custom Tags
    if (typeof clarity === 'function') {
        clarity('set', eventName, JSON.stringify(eventParams));
    }
}

/**
 * Track a page view
 */
export function trackPageView() {
    if (typeof gtag === 'function') {
        gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href,
            page_path: window.location.pathname
        });
    }
}

/**
 * Initialize all analytics
 */
export function initAnalytics() {
    initGoogleAnalytics();
    initClarity();
}

// Auto-initialize if not in module context
if (typeof window !== 'undefined' && !window.__ANALYTICS_INITIALIZED__) {
    window.__ANALYTICS_INITIALIZED__ = true;
    initAnalytics();
}
