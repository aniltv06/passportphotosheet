/**
 * Internationalization (i18n) Module
 * Handles language selection and translation of page content
 */

/**
 * Get the currently selected language
 * @returns {string} Language code (e.g., 'en', 'es', 'fr')
 */
export function getLanguage() {
    return localStorage.getItem('preferredLanguage') || 'en';
}

/**
 * Set the preferred language
 * @param {string} lang - Language code to set
 */
export function setLanguage(lang) {
    localStorage.setItem('preferredLanguage', lang);
}

/**
 * Apply translations to all elements with data-i18n attribute
 * @param {string} lang - Language code
 * @param {Object} translations - Translations object
 */
export function applyTranslations(lang, translations) {
    const trans = translations[lang] || translations.en;

    if (!trans) {
        console.warn(`No translations found for language: ${lang}`);
        return;
    }

    // Translate all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (trans[key]) {
            // Handle elements with HTML content
            if (element.innerHTML.includes('<')) {
                // Preserve child elements but replace text nodes
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = trans[key];
                // Only update if translation doesn't break structure
                if (tempDiv.childNodes.length > 0) {
                    element.textContent = trans[key];
                }
            } else {
                element.textContent = trans[key];
            }
        }
    });

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Update page title if translation exists
    if (trans.title) {
        const siteName = "Photo Sheet Maker";
        document.title = `${trans.title} - ${siteName}`;
    }
}

/**
 * Initialize language selector
 * @param {string} selectorId - ID of the language select element
 * @param {Object} translations - Translations object
 * @param {Function} callback - Optional callback after language change
 */
export function initLanguageSelector(selectorId, translations, callback = null) {
    const languageSelect = document.getElementById(selectorId);

    if (!languageSelect) {
        console.warn(`Language selector #${selectorId} not found`);
        return;
    }

    const currentLang = getLanguage();
    languageSelect.value = currentLang;
    applyTranslations(currentLang, translations);

    languageSelect.addEventListener('change', (e) => {
        const newLang = e.target.value;
        setLanguage(newLang);
        applyTranslations(newLang, translations);

        if (callback && typeof callback === 'function') {
            callback(newLang);
        }
    });
}

/**
 * Initialize i18n on page load
 * @param {Object} translations - Translations object
 */
export function initI18n(translations) {
    const lang = getLanguage();

    // Apply translations on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            applyTranslations(lang, translations);
        });
    } else {
        applyTranslations(lang, translations);
    }
}

/**
 * Get translated string for a specific key
 * @param {string} key - Translation key
 * @param {string} lang - Language code (optional, uses current language if not provided)
 * @param {Object} translations - Translations object
 * @returns {string} Translated string or key if not found
 */
export function t(key, lang = null, translations = null) {
    if (!translations) {
        translations = window.translations || {};
    }

    const currentLang = lang || getLanguage();
    const trans = translations[currentLang] || translations.en || {};

    return trans[key] || key;
}
