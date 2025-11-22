# Translations

This folder contains all language translations for the Photo Sheet Maker application.

## File Structure

```
translations/
├── index.js       # Main entry point that combines all translations
├── en.js          # English translations
├── es.js          # Spanish translations
├── fr.js          # French translations
├── de.js          # German translations
├── pt.js          # Portuguese translations
├── it.js          # Italian translations
├── ja.js          # Japanese translations
├── ko.js          # Korean translations
├── zh.js          # Chinese translations
├── ar.js          # Arabic translations
├── hi.js          # Hindi translations
└── ru.js          # Russian translations
```

## Adding a New Locale

To add support for a new language, follow these steps:

### 1. Create a new translation file

Create a new file named with the locale code (e.g., `nl.js` for Dutch, `sv.js` for Swedish).

```javascript
// Dutch translations
export default {
    skipToContent: "Ga naar hoofdinhoud",
    title: "Foto Sheet Maker",
    subtitle: "Maak professionele pasfoto sheets...",
    // ... add all translation keys
};
```

### 2. Import and add to index.js

Edit `index.js` to import your new translation:

```javascript
import nl from './nl.js';

const translations = {
    en,
    es,
    // ... existing locales
    nl  // Add your new locale here
};
```

### 3. Test your translations

Open the application and select your new language from the language selector to verify all translations are working correctly.

## Translation Keys

Each translation file should contain the same keys as the English (en.js) file. Make sure all keys are present to avoid missing translations.

## Guidelines

- Keep translation keys consistent across all locale files
- Use native speakers or professional translation services for accuracy
- Test with the actual UI to ensure translations fit the available space
- Maintain the same formatting (line breaks, special characters) where appropriate
- Keep HTML entities and special symbols (like ⭐) consistent across languages

## Supported Locales

| Code | Language   | Native Name |
|------|------------|-------------|
| en   | English    | English     |
| es   | Spanish    | Español     |
| fr   | French     | Français    |
| de   | German     | Deutsch     |
| pt   | Portuguese | Português   |
| it   | Italian    | Italiano    |
| ja   | Japanese   | 日本語      |
| ko   | Korean     | 한국어      |
| zh   | Chinese    | 中文        |
| ar   | Arabic     | العربية     |
| hi   | Hindi      | हिन्दी      |
| ru   | Russian    | Русский     |
