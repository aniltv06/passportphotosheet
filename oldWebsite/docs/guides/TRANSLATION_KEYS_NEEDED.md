# New Translation Keys Added

The following translation keys have been added to support the new UX components. They need to be properly translated for all languages.

## Keys Added

### Navigation (3 keys)
- `photoMaker`: "Photo Maker"
- `photoEditor`: "Photo Editor"
- `help`: "Help"

### Workflow Selector (6 keys)
- `chooseWorkflow`: "Choose Your Workflow"
- `haveReadyPhoto`: "I Have a Ready Photo"
- `readyPhotoDesc`: "Upload your 2×2\" passport photo and create a sheet"
- `continueToUpload`: "Continue to Upload"
- `needToEdit`: "I Need to Edit a Photo"
- `needToEditDesc`: "Crop, resize, or remove background first"
- `openPhotoEditor`: "Open Photo Editor"

### Editor Banner (3 keys)
- `bannerTitle`: "Don't have a 2×2\" photo?"
- `bannerDesc`: "Use our Photo Editor to crop, resize, and prepare your photo"
- `tryPhotoEditor`: "Try Photo Editor →"

### Progress Steps (3 keys)
- `stepUpload`: "Upload"
- `stepCustomize`: "Customize"
- `stepDownload`: "Download"

## Translation Status

### ✅ Complete
- `en.js` - English (complete)
- `es.js` - Spanish (complete)
- `fr.js` - French (complete)

### ⚠️ Needs Translation
- `de.js` - German
- `pt.js` - Portuguese
- `it.js` - Italian
- `ja.js` - Japanese
- `ko.js` - Korean
- `zh.js` - Chinese
- `ar.js` - Arabic
- `hi.js` - Hindi
- `ru.js` - Russian

## How to Translate

1. Open the language file (e.g., `translations/de.js`)
2. Find the section with `// TODO: Translate these keys`
3. Replace the English placeholders with proper translations
4. Remove the TODO comment when done
5. Test the translations by switching to that language on the website

## Example

```javascript
// Before (English placeholder)
photoMaker: "Photo Maker",  // TODO: Translate

// After (Properly translated to German)
photoMaker: "Foto-Ersteller",
```

## Notes

- The keys are already added to all language files with English placeholders
- The website will work with English fallbacks until properly translated
- Please maintain the exact same key names (don't change `photoMaker` to `photoMakerGerman`)
- Preserve any special characters like `→` in `tryPhotoEditor`
- Keep the format consistent with existing translations in each file
