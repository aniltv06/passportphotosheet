# Photo Handler - Quick Reference

## 📁 Files Created

```
js/
├── photoHandler.js                    # ⭐ Core module - PhotoStorage + PhotoUploadHandler classes
├── photoHandler-index.js              # 🏠 Helper functions for index.html integration
├── photoHandler-editor.js             # ✂️ Helper functions for photo-editor.html integration
└── PHOTO_HANDLER_INTEGRATION_GUIDE.md # 📖 Complete integration guide
```

---

## 🎯 Key Concepts

### Before (Old System)
```
index.html            photo-editor.html
    |                       |
    | upload photo          | upload photo
    | (local var)           | (local var)
    |                       |
    |                       | export to localStorage['editedPhoto']
    |<----------------------|
    | load from localStorage
    | delete from localStorage
```
**Problems:**
- Duplicate code
- Manual sync required
- Photo lost after one use

### After (New System)
```
           localStorage['currentPhoto']
                    ↑ ↓
        ┌───────────┴───────────┐
        |                       |
   index.html            photo-editor.html
        |                       |
        └─── photoHandler.js ───┘
             (shared module)
```
**Benefits:**
- Single source of truth
- Auto-sync across pages
- Photo persists until "Start Over"
- Reusable code

---

## 🚀 Quick Start (Copy-Paste Examples)

### For index.html (Add before `</body>`):

```html
<script type="module">
import { initIndexPagePhotoUpload, handleStartOver } from './js/photoHandler-index.js';

let uploadedImage = null;
let photoHandler = null;

document.addEventListener('DOMContentLoaded', () => {
    const trans = translations[currentLanguage] || translations.en;

    photoHandler = initIndexPagePhotoUpload(trans, (image, dataURL, metadata) => {
        uploadedImage = image;
        createComposite();  // Your existing function
    });
});

// Connect reset button
document.getElementById('resetBtn')?.addEventListener('click', () => {
    handleStartOver(photoHandler, () => {
        uploadedImage = null;
        // Your reset logic here
    });
});
</script>
```

### For photo-editor.html (Add before `</body>`):

```html
<script type="module">
import { PhotoStorage } from './js/photoHandler.js';
import { initPhotoEditorUpload, handleUsePhoto, handleDownloadPhoto } from './js/photoHandler-editor.js';

let originalImage = null;
let currentImage = null;
let photoHandler = null;
const photoStorage = new PhotoStorage();

document.addEventListener('DOMContentLoaded', () => {
    const trans = translations[currentLanguage] || translations.en;

    photoHandler = initPhotoEditorUpload(trans, (image, dataURL, metadata) => {
        originalImage = image;
        currentImage = image;
        resetTransform();
        render();
        enableControls();
    }, updateProgressStep);
});

// Connect export button
document.getElementById('exportBtn')?.addEventListener('click', () => {
    handleUsePhoto(editCanvas, photoStorage, updateProgressStep);
});

// Connect download button
document.getElementById('downloadBtn')?.addEventListener('click', () => {
    handleDownloadPhoto(editCanvas);
});
</script>
```

---

## 🔧 Common Tasks

### Save a photo to storage
```javascript
import { PhotoStorage } from './js/photoHandler.js';
const storage = new PhotoStorage();
storage.saveCurrentPhoto(dataURL, { width: 600, height: 600 });
```

### Load existing photo
```javascript
const photo = storage.getCurrentPhoto();
if (photo) {
    const img = new Image();
    img.src = photo.dataURL;
    // Use img...
}
```

### Clear photo (Start Over)
```javascript
storage.clearCurrentPhoto();  // Clears from localStorage
```

### Update upload text (language change)
```javascript
photoHandler.updateText({
    uploadText: 'Nuevo Texto',
    uploadHint: 'Haz clic o arrastra',
    successMessage: '¡Éxito!'
});
```

---

## 🗑️ What to Delete from Existing Code

### From index.html:
1. Old `handleImageUpload` function
2. Old upload event listeners (click, drag, drop)
3. Old `localStorage.getItem('editedPhoto')` code block
4. Old file input change listener

### From photo-editor.html:
1. Old `loadImage` function
2. Old upload event listeners (uploadArea, fileInput)
3. Old exportBtn click handler
4. Old downloadBtn click handler
5. `localStorage.setItem('editedPhoto', ...)` code

---

## ✅ Testing Checklist

- [ ] Upload photo on index.html → shows preview
- [ ] Navigate to photo-editor.html → same photo loads
- [ ] Upload photo on photo-editor.html → loads in editor
- [ ] Click "Create Photo Sheet" → navigates to index with photo
- [ ] Click "Start Over" on index → clears photo
- [ ] Change language → upload text updates
- [ ] Refresh page → photo still loaded
- [ ] Clear browser data → photo cleared

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Photo not loading | Check `autoSave: true` in config |
| Upload not working | Verify element IDs match HTML |
| Module not found | Check file paths in import statements |
| Photo not persisting | Check localStorage not disabled |
| "Start Over" broken | Verify handleStartOver is connected |

---

## 📊 Storage Structure

```json
// localStorage key: "currentPhoto"
{
  "dataURL": "data:image/jpeg;base64,...",
  "metadata": {
    "width": 600,
    "height": 600,
    "size": 245678,
    "type": "image/jpeg",
    "uploadedAt": "2025-01-22T10:30:00Z",
    "source": "photo-editor" // or "index"
  }
}
```

---

## 🔮 Future Enhancement: Multiple Photos

Already designed for future multi-photo support:

```javascript
// Future: Uncomment in PhotoStorage class
_addToHistory(photoData) {
    let history = JSON.parse(localStorage.getItem(this.PHOTOS_HISTORY_KEY) || '[]');
    history.unshift(photoData);
    if (history.length > this.MAX_HISTORY) history.pop();
    localStorage.setItem(this.PHOTOS_HISTORY_KEY, JSON.stringify(history));
}

getHistory() {
    return JSON.parse(localStorage.getItem(this.PHOTOS_HISTORY_KEY) || '[]');
}
```

Then add UI to select from history!

---

## 📝 Summary

**3 files to integrate:**
1. `photoHandler.js` - Core functionality
2. `photoHandler-index.js` - Index page helpers
3. `photoHandler-editor.js` - Editor page helpers

**2 pages to update:**
1. `index.html` - Remove old code, add new module import
2. `photo-editor.html` - Remove old code, add new module import

**1 storage key:**
- `currentPhoto` - Contains photo data + metadata

**Result:**
✅ Clean, modular code
✅ Photo persists across pages
✅ Easy to maintain
✅ Ready for future enhancements
