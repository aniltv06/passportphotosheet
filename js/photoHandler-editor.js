/**
 * Photo Handler Integration for Photo Editor Page
 * This file demonstrates how to integrate the photoHandler module in photo-editor.html
 */

// Import the photo handler module
import { PhotoUploadHandler } from './photoHandler.js';

/**
 * Initialize photo upload functionality for the photo editor page
 * Uses the same UI as index.html for consistency
 * @param {Object} translations - Translation object for i18n support
 * @param {Function} onPhotoReadyCallback - Callback when photo is ready (e.g., loadImageToCanvas)
 */
export function initPhotoEditorUpload(translations, onPhotoReadyCallback) {
    // Initialize the photo upload handler with photo-editor specific configuration
    const photoHandler = new PhotoUploadHandler({
        containerId: 'uploadContainer', // Container where UI will be injected

        // Show title and description
        ui: {
            showTitle: false,
            showDescription: false,
            title: translations?.haveReadyPhoto || 'I Have a Ready Photo',
            description: translations?.haveReadyPhotoDesc || 'Upload your 2×2" passport photo and create a professional photo sheet for printing'
        },

        // Customizable text for i18n
        text: {
            uploadIcon: '📁',
            uploadText: translations?.upload_text || 'Choose Your Photo',
            uploadHint: translations?.upload_hint || 'Click here or drag and drop',
            successMessage: translations?.uploadSuccess || 'Photo uploaded successfully'
        },

        // Callback when photo is loaded
        onPhotoLoaded: (image, dataURL, metadata) => {
            console.log('Photo loaded in editor:', metadata);

            // Call the page-specific callback (e.g., loadImageToCanvas)
            if (onPhotoReadyCallback) {
                onPhotoReadyCallback(image, dataURL, metadata);
            }

            // Hide upload prompt, show canvas
            const uploadPrompt = document.getElementById('uploadPrompt');
            const canvasContainer = document.getElementById('canvasContainer');
            const photoInfo = document.getElementById('photoInfo');

            if (uploadPrompt) uploadPrompt.style.display = 'none';
            if (canvasContainer) canvasContainer.style.display = 'block';
            if (photoInfo) photoInfo.style.display = 'block';
        },

        // Error handling
        onError: (errorMessage) => {
            alert(errorMessage);
            console.error('Photo upload error:', errorMessage);
        },

        // Analytics tracking
        analytics: (eventName, eventData) => {
            if (typeof gtag !== 'undefined') {
                gtag('event', eventName, {
                    'event_category': 'Photo Editor',
                    'event_label': 'Photo Upload',
                    ...eventData
                });
            }
        },

        // Auto-save enabled (photo persists across pages)
        autoSave: true
    });

    // Return the handler instance
    return photoHandler;
}

/**
 * Update upload area text when language changes
 * @param {Object} photoHandler - PhotoUploadHandler instance
 * @param {Object} translations - New translation object
 */
export function updatePhotoEditorText(photoHandler, translations) {
    if (photoHandler && translations) {
        photoHandler.updateText({
            uploadText: translations.upload_text,
            uploadHint: translations.upload_hint,
            successMessage: translations.uploadSuccess
        });
    }
}

/**
 * Export edited photo back to storage
 * This function saves the edited photo canvas back to storage
 * so it's available when returning to the index page
 *
 * @param {HTMLCanvasElement} canvas - Canvas element with edited photo
 * @param {Object} photoStorage - PhotoStorage instance
 * @param {Object} metadata - Optional additional metadata
 */
export function exportEditedPhoto(canvas, photoStorage, metadata = {}) {
    try {
        // Convert canvas to data URL (JPEG, 95% quality)
        const editedDataURL = canvas.toDataURL('image/jpeg', 0.95);

        // Get canvas dimensions
        const canvasMetadata = {
            width: canvas.width,
            height: canvas.height,
            format: 'jpeg',
            quality: 0.95,
            editedAt: new Date().toISOString(),
            source: 'photo-editor',
            ...metadata
        };

        // Save to storage
        photoStorage.saveCurrentPhoto(editedDataURL, canvasMetadata);

        console.log('Edited photo saved to storage');

        // Track export event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'photo_exported', {
                'event_category': 'Photo Editor',
                'event_label': 'Export to Storage'
            });
        }

        return true;
    } catch (error) {
        console.error('Error exporting photo:', error);

        // Track error
        if (typeof gtag !== 'undefined') {
            gtag('event', 'export_error', {
                'event_category': 'Photo Editor',
                'event_label': error.message
            });
        }

        return false;
    }
}

/**
 * Handle "Use Photo" button - export and navigate to index page
 * @param {HTMLCanvasElement} canvas - Canvas with edited photo
 * @param {Object} photoStorage - PhotoStorage instance
 */
export function handleUsePhoto(canvas, photoStorage) {
    // Export the edited photo
    const success = exportEditedPhoto(canvas, photoStorage, {
        action: 'use_photo',
        destination: 'index'
    });

    if (success) {
        // Navigate to index page
        window.location.href = 'index.html';
    } else {
        alert('Failed to save edited photo. Please try again.');
    }
}

/**
 * Handle "Download Photo" button - download canvas as file
 * @param {HTMLCanvasElement} canvas - Canvas with edited photo
 * @param {string} filename - Optional filename (default: passport-photo-edited.jpg)
 */
export function handleDownloadPhoto(canvas, filename = 'passport-photo-edited.jpg') {
    try {
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/jpeg', 0.95);
        link.click();

        // Track download event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'photo_downloaded', {
                'event_category': 'Photo Editor',
                'event_label': 'Download Photo'
            });
        }

        console.log('Photo downloaded:', filename);
    } catch (error) {
        console.error('Error downloading photo:', error);
        alert('Failed to download photo. Please try again.');
    }
}
