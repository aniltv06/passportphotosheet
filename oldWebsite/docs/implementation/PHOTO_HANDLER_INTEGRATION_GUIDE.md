# Photo Handler Module - Integration Guide

## Overview

The new modular photo handling system provides:
- ✅ **Unified photo management** across all pages
- ✅ **Persistent storage** - photos saved in localStorage
- ✅ **Automatic cross-page sharing** - upload once, use everywhere
- ✅ **Reusable UI components** with customizable text (i18n ready)
- ✅ **Future-ready** for multiple photo support
- ✅ **Clean separation** of concerns

## File Structure

```
js/
├── photoHandler.js           # Core module (PhotoStorage + PhotoUploadHandler)
├── photoHandler-index.js     # Index page integration helpers
└── photoHandler-editor.js    # Photo editor integration helpers
```

---

## How It Works

### 1. Photo Flow Between Pages

**Old System:**
- User uploads photo on index.html → stored locally in page
- User edits photo in photo-editor.html → saved as 'editedPhoto' in localStorage
- User returns to index.html → loads 'editedPhoto', then deletes it

**New System:**
- User uploads photo on ANY page → automatically saved as 'currentPhoto' in localStorage
- Photo persists across ALL pages until user clicks "Start Over"
- Both pages read from same 'currentPhoto' source
- No manual sync needed

### 2. Storage Structure

```javascript
// localStorage key: 'currentPhoto'
{
  dataURL: "data:image/jpeg;base64,/9j/4AAQ...",  // Base64 image
  metadata: {
    width: 600,
    height: 600,
    size: 245678,
    type: "image/jpeg",
    uploadedAt: "2025-01-22T10:30:00.000Z",
    // ... additional metadata
  }
}
```

---

## Integration Steps

### Step 1: Add Module Import to HTML

Add this at the **bottom** of your HTML file, just before the closing `</body>` tag:

#### For `index.html`:

```html
<!-- Photo Handler Module -->
<script type="module">
    import { initIndexPagePhotoUpload, handleStartOver } from './js/photoHandler-index.js';

    // Your existing variables
    let uploadedImage = null;
    let photoHandler = null;

    // Initialize photo handler when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        // Get current language for translations
        const currentLang = localStorage.getItem('preferredLanguage') || 'en';
        const trans = translations[currentLang] || translations.en;

        // Initialize photo upload with your createComposite callback
        photoHandler = initIndexPagePhotoUpload(trans, (image, dataURL, metadata) => {
            // Set the uploadedImage for your existing code
            uploadedImage = image;

            // Call your existing createComposite function
            createComposite();
        });
    });

    // Hook up the "Start Over" button
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            handleStartOver(photoHandler, () => {
                // Your additional reset logic
                uploadedImage = null;
                // Clear canvas, reset UI, etc.
            });
        });
    }

    // Update text when language changes
    function onLanguageChange(newLang) {
        const trans = translations[newLang] || translations.en;
        if (photoHandler) {
            photoHandler.updateText({
                uploadText: trans.uploadText,
                uploadHint: trans.uploadHint,
                successMessage: trans.uploadSuccess
            });
        }
    }
</script>
```

#### For `photo-editor.html`:

```html
<!-- Photo Handler Module -->
<script type="module">
    import { PhotoStorage } from './js/photoHandler.js';
    import {
        initPhotoEditorUpload,
        handleUsePhoto,
        handleDownloadPhoto
    } from './js/photoHandler-editor.js';

    // Your existing variables
    let originalImage = null;
    let currentImage = null;
    let photoHandler = null;
    const photoStorage = new PhotoStorage();

    // Initialize photo handler when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        // Get current language for translations
        const currentLang = getLanguage();
        const trans = translations[currentLang] || translations.en;

        // Initialize photo upload with your image loading callback
        photoHandler = initPhotoEditorUpload(trans, (image, dataURL, metadata) => {
            // Set images for your existing editor code
            originalImage = image;
            currentImage = image;

            // Call your existing functions
            resetTransform();
            render();
            enableControls();
        }, updateProgressStep);  // Pass your progress update function
    });

    // Hook up the "Use Photo" button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            handleUsePhoto(editCanvas, photoStorage, updateProgressStep);
        });
    }

    // Hook up the "Download" button
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            handleDownloadPhoto(editCanvas, 'passport-photo-edited.jpg');
        });
    }

    // Update text when language changes
    function applyTranslations(lang) {
        const trans = translations[lang] || translations.en;

        // Update page translations
        // ... your existing translation code ...

        // Update photo upload text
        if (photoHandler) {
            photoHandler.updateText({
                uploadText: trans.upload_text,
                uploadHint: trans.upload_hint,
                successMessage: trans.uploadSuccess
            });
        }
    }
</script>
```

---

## Step 2: Remove Old Upload Code

### From `index.html` - Remove these sections:

1. **Remove the old handleImageUpload function** (around line 1789-1832)
2. **Remove the old upload event listeners** (around line 1835-1859)
3. **Remove the old localStorage.getItem('editedPhoto') check** (around line 2332-2356)

### From `photo-editor.html` - Remove these sections:

1. **Remove the old loadImage function** (around line 2027-2053)
2. **Remove the old upload event listeners** (around line 1991-2024)
3. **Remove the old exportBtn click handler** (around line 3128-3145)
4. **Remove the old downloadBtn click handler** (around line 3148-3164)

---

## Step 3: Update Translation Keys

Make sure your translation files have these keys:

```javascript
// translations/en.js
export default {
    // ... existing keys ...

    // Upload section (used by both pages)
    uploadText: "Choose Your Photo",
    uploadHint: "Click here or drag and drop your 2×2\" photo",
    uploadSuccess: "✓ Photo uploaded successfully!",

    // Photo editor specific
    upload_text: "Choose Your Photo",
    upload_hint: "Click or drag and drop",

    // ... rest of translations ...
};
```

---

## Step 4: Test the Integration

### Test Checklist:

1. **Upload on Index Page:**
   - [ ] Upload a photo on index.html
   - [ ] Verify photo sheet preview appears
   - [ ] Navigate to photo-editor.html
   - [ ] Verify same photo loads automatically

2. **Upload on Editor Page:**
   - [ ] Start fresh (clear localStorage if needed)
   - [ ] Navigate to photo-editor.html
   - [ ] Upload a photo
   - [ ] Edit and click "Create Photo Sheet"
   - [ ] Verify navigates to index.html with photo loaded

3. **Start Over:**
   - [ ] Upload a photo on index.html
   - [ ] Click "Start Over"
   - [ ] Verify photo is cleared
   - [ ] Verify localStorage is cleared
   - [ ] Navigate to photo-editor.html
   - [ ] Verify no photo loads (upload prompt shows)

4. **Language Switching:**
   - [ ] Upload a photo
   - [ ] Change language
   - [ ] Verify upload area text updates
   - [ ] Verify functionality still works

---

## API Reference

### PhotoStorage Class

```javascript
import { PhotoStorage } from './js/photoHandler.js';

const storage = new PhotoStorage();

// Save photo
storage.saveCurrentPhoto(dataURL, { width: 600, height: 600 });

// Get photo
const photo = storage.getCurrentPhoto();  // Returns { dataURL, metadata }

// Check if photo exists
if (storage.hasCurrentPhoto()) { ... }

// Clear current photo
storage.clearCurrentPhoto();

// Clear all (including future history)
storage.clearAll();
```

### PhotoUploadHandler Class

```javascript
import { PhotoUploadHandler } from './js/photoHandler.js';

const handler = new PhotoUploadHandler({
    uploadAreaId: 'uploadArea',
    fileInputId: 'fileInput',

    text: {
        uploadIcon: '📁',
        uploadText: 'Upload Photo',
        uploadHint: 'Click or drag',
        successMessage: 'Success!'
    },

    onPhotoLoaded: (image, dataURL, metadata) => {
        // Your callback
    },

    onError: (errorMessage) => {
        alert(errorMessage);
    },

    analytics: (eventName, data) => {
        gtag('event', eventName, data);
    },

    autoSave: true  // Auto-save to localStorage
});

// Update text (for i18n)
handler.updateText({ uploadText: 'New Text' });

// Get current image
const img = handler.getCurrentImage();

// Check if image loaded
if (handler.hasImage()) { ... }

// Reset (clear UI + storage)
handler.reset();
```

---

## Advanced: Future Multi-Photo Support

The system is designed to support multiple photos in the future. To enable:

1. Uncomment history methods in PhotoStorage class
2. Implement UI for photo selection
3. Update MAX_HISTORY limit as needed

```javascript
// Future implementation
class PhotoStorage {
    _addToHistory(photoData) {
        // Add to history array in localStorage
    }

    getHistory() {
        // Return array of previous photos
    }

    clearHistory() {
        // Clear photo history
    }
}
```

---

## Troubleshooting

### Photo not persisting across pages
- Check that `autoSave: true` is set in PhotoUploadHandler config
- Verify localStorage is not disabled in browser
- Check browser console for errors

### Upload area not responding
- Verify `uploadAreaId` and `fileInputId` match your HTML element IDs
- Check that elements exist when PhotoUploadHandler initializes
- Ensure module is imported correctly

### "Start Over" not working
- Verify `handleStartOver` is connected to your reset button
- Check that photoHandler instance is accessible in click handler scope
- Ensure additional reset logic clears your page-specific state

---

## Migration Checklist

- [ ] Created js/photoHandler.js
- [ ] Created js/photoHandler-index.js
- [ ] Created js/photoHandler-editor.js
- [ ] Added module import to index.html
- [ ] Added module import to photo-editor.html
- [ ] Removed old upload code from index.html
- [ ] Removed old upload code from photo-editor.html
- [ ] Updated translation files with new keys
- [ ] Tested upload on index page
- [ ] Tested upload on editor page
- [ ] Tested cross-page navigation
- [ ] Tested "Start Over" functionality
- [ ] Tested language switching
- [ ] Removed backup files (*.backup)

---

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify all file paths are correct
3. Ensure modules are properly imported
4. Check that HTML element IDs match configuration

For questions, refer to the inline JSDoc comments in the module files.
