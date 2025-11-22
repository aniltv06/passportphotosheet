# JavaScript Modules

This folder contains modular JavaScript files for the Photo Sheet Maker application.

## File Structure

```
js/
├── analytics.js      # Google Analytics & Microsoft Clarity tracking
├── i18n.js           # Internationalization and translation system
├── common.js         # Shared utility functions
├── app.js            # Main application logic for index.html (to be created)
└── photo-editor-app.js  # Photo editor application logic (to be created)
```

## Module Descriptions

### analytics.js
Handles all analytics tracking including:
- Google Analytics 4 initialization and configuration
- Microsoft Clarity integration
- Event tracking helpers
- Page view tracking

**Usage:**
```javascript
import { trackEvent, trackPageView, initAnalytics } from './js/analytics.js';

// Initialize (auto-initialized on load)
initAnalytics();

// Track custom events
trackEvent('button_click', { button_name: 'download' });

// Track page views
trackPageView();
```

### i18n.js
Internationalization module for multi-language support:
- Language detection and storage
- Translation application
- Language selector initialization
- Translation helper functions

**Usage:**
```javascript
import { initLanguageSelector, applyTranslations, getLanguage, t } from './js/i18n.js';

// Initialize language selector
initLanguageSelector('languageSelect', window.translations, (lang) => {
    console.log('Language changed to:', lang);
});

// Get translated string
const title = t('title', 'en', translations);

// Apply translations manually
applyTranslations('es', translations);
```

### common.js
Shared utility functions:
- Image loading and validation
- Canvas download helper
- DOM manipulation utilities
- Debounce/throttle functions
- File size formatting

**Usage:**
```javascript
import { loadImage, downloadCanvas, validateImageFile, setCurrentYear } from './js/common.js';

// Load image from file
const img = await loadImage(file);

// Download canvas
downloadCanvas(canvas, 'photo-sheet.jpg', 'jpg', 0.95);

// Validate image file
const validation = validateImageFile(file, 10); // 10MB max
if (!validation.valid) {
    console.error(validation.error);
}
```

### app.js (Main Application)
Contains the core photo sheet maker logic:
- Photo upload handling
- Canvas rendering
- Layout generation
- Download functionality
- Demo mode

### photo-editor-app.js (Photo Editor)
Photo editor application logic:
- Image cropping
- Filters and adjustments
- Background removal
- Export functionality

## Benefits of Modular Structure

1. **Reusability**: Modules can be imported and used across different pages
2. **Maintainability**: Each module has a single responsibility
3. **Testability**: Functions can be tested independently
4. **Performance**: Modules can be loaded on-demand
5. **Collaboration**: Different team members can work on different modules
6. **Code Organization**: Clear separation of concerns

## Adding New Modules

To add a new module:
1. Create a new `.js` file in this directory
2. Export functions using ES6 export syntax
3. Import in HTML files using `<script type="module">`
4. Update this README with documentation
