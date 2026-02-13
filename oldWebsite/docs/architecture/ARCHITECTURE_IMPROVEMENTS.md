# Architecture Improvements - Complete Implementation Guide

## Overview

This document describes the comprehensive architectural improvements implemented to enhance code quality, maintainability, testability, and user experience.

## Table of Contents

1. [What Changed](#what-changed)
2. [New Modules](#new-modules)
3. [Migration Guide](#migration-guide)
4. [Usage Examples](#usage-examples)
5. [Benefits](#benefits)
6. [Best Practices](#best-practices)

---

## What Changed

### Priority 1: High-Impact Improvements ✅

1. **NotificationManager** - Replaced `alert()` with toast notifications
2. **Dependency Injection** - Improved module testability and reusability
3. **Config Pattern** - Centralized all configuration constants
4. **EventBus** - Decoupled module communication
5. **ErrorBoundary** - Centralized error handling

### Priority 2: Medium-Impact Improvements ✅

6. **PhotoHandler Split** - Separated into 3 focused modules
7. **StateManager** - Reactive state management
8. **AppContainer** - Dependency injection container
9. **AppFactory** - Simplified module creation

### Code Quality Improvements ✅

10. **JSDoc annotations** - Comprehensive type documentation
11. **Error handling** - User-friendly error messages
12. **Global state removal** - No more window object pollution

---

## New Modules

### 1. Configuration (`js/config/app-config.js`)

Central configuration for all app constants.

```javascript
import { APP_CONFIG, getConfig, getElementId } from './js/config/app-config.js';

// Access configuration
const defaultPaperSize = APP_CONFIG.DEFAULTS.PAPER_SIZE; // '4x6'
const canvasId = getElementId('CANVAS'); // 'canvas'
const errorMsg = APP_CONFIG.ERROR_MESSAGES.FILE_READ_ERROR;
```

**Benefits:**
- Single source of truth
- Easy to modify defaults
- No magic strings in code
- Type-safe with JSDoc

### 2. NotificationManager (`js/utils/notification-manager.js`)

Toast-style notifications replacing alert dialogs.

```javascript
import { showSuccess, showError, showWarning, showInfo } from './js/utils/notification-manager.js';

// Show notifications
showSuccess('Photo uploaded successfully');
showError('Failed to load image');
showWarning('Image might be too large');
showInfo('Processing your photo...');

// With options
showError('An error occurred', {
    duration: 10000, // 10 seconds
    closable: true,
    onClick: () => console.log('Clicked!')
});
```

**Features:**
- Non-blocking UI
- Auto-dismiss with configurable duration
- Accessible (ARIA attributes)
- Responsive design
- Dark mode support
- Stacking notifications (max 3)

### 3. EventBus (`js/utils/event-bus.js`)

Centralized pub/sub event system.

```javascript
import { on, emit, once, off } from './js/utils/event-bus.js';

// Subscribe to events
const unsubscribe = on('photo:loaded', (data) => {
    console.log('Photo loaded:', data.image);
});

// Emit events
emit('photo:loaded', {
    image: imgElement,
    dataURL: 'data:image/jpeg;base64,...',
    metadata: { width: 800, height: 600 }
});

// One-time subscription
once('photo:uploaded', (data) => {
    console.log('First upload!');
});

// Unsubscribe
unsubscribe();
// or
off('photo:loaded', callbackFunction);
```

**Benefits:**
- Decoupled modules
- Easy to add/remove listeners
- Type-safe events
- Debug mode available

### 4. StateManager (`js/utils/state-manager.js`)

Reactive state management with pub/sub.

```javascript
import StateManager from './js/utils/state-manager.js';

const state = new StateManager({
    uploadedImage: null,
    options: {
        paperSize: '4x6',
        quality: 'high'
    }
});

// Subscribe to changes
state.subscribe((newState, oldState) => {
    console.log('State changed:', newState);
});

// Subscribe to specific keys
state.subscribe((newState) => {
    console.log('Paper size changed:', newState.options.paperSize);
}, { keys: ['options.paperSize'] });

// Update state
state.setState({ uploadedImage: imgElement });

// Set specific value
state.set('options.paperSize', '5x7');

// Get state
const currentPaperSize = state.get('options.paperSize');
```

**Features:**
- Reactive updates
- Selective subscriptions
- Computed values
- Debug logging
- Immutable state copies

### 5. AppContainer (`js/utils/app-container.js`)

Dependency injection container.

```javascript
import { container, getService, registerService } from './js/utils/app-container.js';

// Register services
container.register('photoStorage', new PhotoStorage());
container.register('analytics', analyticsService);

// Register factory (lazy instantiation)
container.registerFactory('photoUploader', (container) => {
    return new PhotoUploadHandler({
        containerId: 'upload-container',
        analytics: container.get('analytics')
    });
});

// Get services
const photoStorage = container.get('photoStorage');
const uploader = container.get('photoUploader'); // Created on first access

// Convenience functions
registerService('myService', serviceInstance);
const service = getService('myService');
```

**Benefits:**
- No global state pollution
- Lazy instantiation
- Testable (easy to mock)
- Scoped containers

### 6. ErrorBoundary (`js/utils/error-boundary.js`)

Centralized error handling with user-friendly messages.

```javascript
import ErrorBoundary, { executeWithErrorBoundary } from './js/utils/error-boundary.js';

// Wrap function execution
await ErrorBoundary.execute(
    async () => {
        return await loadPhoto();
    },
    'Photo Loading', // Context
    {
        showNotification: true, // Show error to user
        rethrow: false, // Don't re-throw
        fallbackValue: null // Return this on error
    }
);

// Wrap a function
const safeLoadPhoto = ErrorBoundary.wrap(loadPhoto, 'Photo Loading');
await safeLoadPhoto();

// Setup global handlers
ErrorBoundary.setupGlobalHandlers({
    handleUnhandledRejections: true,
    handleWindowErrors: true
});

// Set analytics tracking
ErrorBoundary.setTracking((eventName, data) => {
    gtag('event', eventName, data);
});
```

**Features:**
- User-friendly error messages
- Analytics tracking
- Error logging
- Context-aware messages
- Global error catching

### 7. Photo Modules (Split from photoHandler.js)

#### PhotoStorage (`js/photo/photo-storage.js`)

```javascript
import { PhotoStorage } from './js/photo/photo-storage.js';

const storage = new PhotoStorage();

// Save photo
storage.saveCurrentPhoto(dataURL, {
    width: 800,
    height: 600,
    type: 'image/jpeg'
});

// Get photo
const photo = storage.getCurrentPhoto();
console.log(photo.dataURL, photo.metadata);

// Check if photo exists
if (storage.hasCurrentPhoto()) {
    // ...
}

// Clear
storage.clearCurrentPhoto();
```

#### PhotoUploader (`js/photo/photo-uploader.js`)

```javascript
import { PhotoUploadHandler } from './js/photo/photo-uploader.js';

const uploader = new PhotoUploadHandler({
    containerId: 'upload-area',
    ui: {
        showTitle: true,
        showDescription: true
    },
    onPhotoLoaded: (image, dataURL, metadata) => {
        console.log('Photo loaded:', metadata);
    },
    onError: (error) => {
        console.error('Upload error:', error);
    },
    useEventBus: true // Emit events via EventBus
});

// Listen to events
on('photo:loaded', (data) => {
    renderPhotoSheet(data.image);
});
```

#### PhotoUI Helpers (`js/photo/photo-ui.js`)

```javascript
import {
    validateImageFile,
    loadImageFromDataURL,
    readFileAsDataURL,
    announceToScreenReader
} from './js/photo/photo-ui.js';

// Validate file
const validation = validateImageFile(file, {
    maxSizeMB: 10,
    allowedTypes: ['image/jpeg', 'image/png']
});

if (validation.valid) {
    const dataURL = await readFileAsDataURL(file);
    const image = await loadImageFromDataURL(dataURL);
}
```

### 8. AppFactory (`js/utils/app-factory.js`)

Simplified module creation with sensible defaults.

```javascript
import AppFactory from './js/utils/app-factory.js';

// Create individual modules
const canvasRenderer = AppFactory.createCanvasRenderer('canvas');
const formHandler = AppFactory.createFormHandler({
    formId: 'optionsForm',
    onChange: (options) => console.log(options)
});

// Create complete app
const app = AppFactory.createPhotoSheetApp({
    canvasId: 'canvas',
    formId: 'optionsForm',
    onOptionsChange: (options) => renderPhotoSheet(options),
    onDownloadSuccess: (data) => console.log('Downloaded:', data),
    onDownloadError: (error) => console.error('Download error:', error)
});

// With state management
const statefulApp = AppFactory.createStatefulApp({
    initialState: {
        uploadedImage: null,
        currentLanguage: 'en'
    }
});

statefulApp.stateManager.subscribe((state) => {
    console.log('State changed:', state);
});
```

---

## Migration Guide

### From Old PhotoHandler

**Before:**
```javascript
// Old approach (still works)
import { PhotoUploadHandler } from './js/photoHandler.js';

const handler = new PhotoUploadHandler({
    containerId: 'upload-container',
    onPhotoLoaded: (img) => { /* ... */ }
});
```

**After:**
```javascript
// New approach (recommended)
import { PhotoUploadHandler } from './js/photo/photo-uploader.js';
import { on } from './js/utils/event-bus.js';

const uploader = new PhotoUploadHandler({
    containerId: 'upload-container',
    useEventBus: true
});

on('photo:loaded', ({ image, dataURL, metadata }) => {
    renderPhoto(image);
});
```

### From Direct DOM Access

**Before:**
```javascript
class MyModule {
    constructor() {
        this.element = document.getElementById('myElement');
    }
}
```

**After:**
```javascript
import { getElementId } from './js/config/app-config.js';

class MyModule {
    constructor(config) {
        this.element = config.element ||
            document.getElementById(getElementId('MY_ELEMENT'));
    }
}
```

### From alert() to Notifications

**Before:**
```javascript
alert('Error occurred!');
```

**After:**
```javascript
import { showError } from './js/utils/notification-manager.js';

showError('Error occurred!');
```

### From window Object

**Before:**
```javascript
window.myApp = new MyApp();
window.someGlobal = value;
```

**After:**
```javascript
import { container } from './js/utils/app-container.js';

const myApp = new MyApp();
container.register('myApp', myApp);
container.register('someValue', value);

// Access anywhere
import { getService } from './js/utils/app-container.js';
const app = getService('myApp');
```

---

## Usage Examples

### Complete App Initialization

```javascript
import AppFactory from './js/utils/app-factory.js';
import { on } from './js/utils/event-bus.js';
import ErrorBoundary from './js/utils/error-boundary.js';
import { trackEvent } from './js/utils/analytics.js';

// Setup global error handling
ErrorBoundary.setupGlobalHandlers();
ErrorBoundary.setTracking(trackEvent);

// Create app
const app = await ErrorBoundary.execute(
    () => AppFactory.createStatefulApp({
        onOptionsChange: (options) => {
            app.canvasRenderer.createComposite(
                app.stateManager.get('uploadedImage'),
                options.layout,
                options.dpi,
                options
            );
        }
    }),
    'App Initialization'
);

// Subscribe to events
on('photo:loaded', ({ image }) => {
    app.stateManager.set('uploadedImage', image);
});

// Subscribe to state changes
app.stateManager.subscribe((state) => {
    if (state.uploadedImage) {
        // Re-render when image or options change
    }
}, { keys: ['uploadedImage', 'options'] });
```

### Custom Module with DI

```javascript
import { container } from './js/utils/app-container.js';
import { on, emit } from './js/utils/event-bus.js';

class CustomModule {
    constructor(dependencies) {
        this.photoStorage = dependencies.photoStorage;
        this.analytics = dependencies.analytics;

        this.init();
    }

    init() {
        on('custom:event', (data) => this.handleEvent(data));
    }

    handleEvent(data) {
        this.analytics.track('custom_event', data);
        emit('custom:processed', { result: 'success' });
    }
}

// Register dependencies
container.registerFactory('customModule', (c) => {
    return new CustomModule({
        photoStorage: c.get('photoStorage'),
        analytics: c.get('analytics')
    });
});

// Use
const module = container.get('customModule');
```

---

## Benefits

### Before vs After

| Aspect | Before | After | Improvement |
|--------|--------|-------|-------------|
| Error Handling | `alert()` dialogs | Toast notifications | Better UX |
| State Management | Scattered | Centralized | Predictable |
| Module Communication | Direct coupling | EventBus | Decoupled |
| Configuration | Magic strings | Centralized config | Maintainable |
| Dependencies | Global window | DI Container | Testable |
| Error Messages | Technical | User-friendly | Professional |
| Testability | Hard to test | Easy to mock | Quality |

### Testability Example

**Before (Hard to test):**
```javascript
class Module {
    constructor() {
        this.element = document.getElementById('hard-coded-id');
    }
}
```

**After (Easy to test):**
```javascript
class Module {
    constructor(config) {
        this.element = config.element;
    }
}

// In tests:
const mockElement = createMockElement();
const module = new Module({ element: mockElement });
```

---

## Best Practices

### 1. Use Config Object Pattern

```javascript
// Good
import { APP_CONFIG } from './js/config/app-config.js';
const defaultSize = APP_CONFIG.DEFAULTS.PAPER_SIZE;

// Bad
const defaultSize = '4x6'; // Magic string
```

### 2. Inject Dependencies

```javascript
// Good
class MyClass {
    constructor({ storage, analytics }) {
        this.storage = storage;
        this.analytics = analytics;
    }
}

// Bad
class MyClass {
    constructor() {
        this.storage = new PhotoStorage();
        this.analytics = window.analytics;
    }
}
```

### 3. Use EventBus for Decoupling

```javascript
// Good
emit('photo:loaded', data);
on('photo:loaded', handlePhoto);

// Bad
photoHandler.onPhotoLoaded = handlePhoto; // Tight coupling
```

### 4. Wrap Async Operations

```javascript
// Good
await ErrorBoundary.execute(
    () => loadPhoto(),
    'Photo Loading'
);

// Bad
try {
    await loadPhoto();
} catch (error) {
    alert('Error: ' + error.message);
}
```

### 5. Use Notifications

```javascript
// Good
showSuccess('Photo uploaded successfully');

// Bad
alert('Photo uploaded successfully');
```

### 6. Manage State Reactively

```javascript
// Good
stateManager.subscribe((state) => {
    render(state);
}, { keys: ['data'] });

// Bad
let data = null;
function updateData(newData) {
    data = newData;
    render(); // Easy to forget
}
```

---

## Backward Compatibility

All changes are **100% backward compatible**. Old code will continue to work:

- `photoHandler.js` exports remain unchanged
- All existing modules work as before
- No breaking changes to public APIs

However, **new code should use the improved patterns** documented here.

---

## Next Steps

1. **Familiarize** with new modules by reading this guide
2. **Start using** AppFactory for new features
3. **Migrate gradually** to new patterns
4. **Test thoroughly** with existing functionality
5. **Monitor** error logs and notifications

---

## Support

For questions or issues with the new architecture:

1. Check this documentation
2. Review code examples in `js/` directory
3. Look at JSDoc comments in modules
4. Check the error log: `ErrorBoundary.getErrorLog()`

---

## Summary

The architecture improvements provide:

✅ Better error handling with user-friendly notifications
✅ Centralized configuration management
✅ Dependency injection for testability
✅ Event-driven architecture for decoupling
✅ Reactive state management
✅ Professional error boundaries
✅ Comprehensive documentation

**Result:** More maintainable, testable, and professional codebase while maintaining 100% backward compatibility.
