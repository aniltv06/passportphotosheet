/**
 * Translation Module
 *
 * This file imports all translation files and exports them as a single object.
 *
 * To add a new locale:
 * 1. Create a new file in this folder named with the locale code (e.g., 'nl.js' for Dutch)
 * 2. Export the translation object from that file
 * 3. Import it here and add it to the translations object below
 * 4. The translations will automatically be available to the application
 */

import en from './en.js';
import es from './es.js';
import fr from './fr.js';
import de from './de.js';
import pt from './pt.js';
import it from './it.js';
import ja from './ja.js';
import ko from './ko.js';
import zh from './zh.js';
import ar from './ar.js';
import hi from './hi.js';
import ru from './ru.js';

// Combine all translations into a single object
const translations = {
    en,
    es,
    fr,
    de,
    pt,
    it,
    ja,
    ko,
    zh,
    ar,
    hi,
    ru
};

// Export for use in the application
// This maintains compatibility with the existing window.translations pattern
export default translations;

// Also assign to window for backward compatibility with existing code
if (typeof window !== 'undefined') {
    window.translations = translations;
}
