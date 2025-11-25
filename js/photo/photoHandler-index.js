/**
 * Photo Handler Integration for Index Page (Home/Photo Sheet Maker)
 * This file demonstrates how to integrate the photoHandler module in index.html
 */

// Import the photo handler module
import { PhotoUploadHandler } from './photoHandler.js';

/**
 * Initialize photo upload functionality for the index page
 * @param {Object} translations - Translation object for i18n support
 * @param {Function} onPhotoReadyCallback - Callback when photo is ready (e.g., createComposite)
 */
export function initIndexPagePhotoUpload(translations, onPhotoReadyCallback) {
    // Initialize the photo upload handler with index-page specific configuration
    const photoHandler = new PhotoUploadHandler({
        containerId: 'uploadContainer', // Container where UI will be injected

        // Show title and description (index.html style)
        ui: {
            showTitle: true,
            showDescription: true,
            title: translations?.haveReadyPhoto || 'I Have a Ready Photo',
            description: translations?.haveReadyPhotoDesc || 'Upload your 2×2" passport photo and create a professional photo sheet for printing'
        },

        // Customizable text for i18n
        text: {
            uploadIcon: '📁',
            uploadText: translations?.uploadText || 'Choose Your Photo',
            uploadHint: translations?.uploadHint || 'Click here or drag and drop your 2×2" photo',
            successMessage: translations?.uploadSuccess || 'Photo uploaded successfully'
        },

        // Callback when photo is loaded
        onPhotoLoaded: (image, dataURL, metadata) => {
            console.log('Photo loaded:', metadata);

            // Call the page-specific callback (e.g., createComposite)
            if (onPhotoReadyCallback) {
                onPhotoReadyCallback(image, dataURL, metadata);
            }

            // Show preview section
            const previewSection = document.getElementById('previewSection');
            if (previewSection) {
                previewSection.classList.add('active');

                // Smooth scroll to preview
                setTimeout(() => {
                    previewSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            }
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
                    'event_category': 'Photo Upload',
                    'event_label': 'Index Page',
                    ...eventData
                });
            }
        },

        // Auto-save enabled (photo persists across pages)
        autoSave: true
    });

    // Return the handler instance for further manipulation if needed
    return photoHandler;
}

/**
 * Update upload area text when language changes
 * @param {Object} photoHandler - PhotoUploadHandler instance
 * @param {Object} translations - New translation object
 */
export function updatePhotoUploadText(photoHandler, translations) {
    if (photoHandler && translations) {
        photoHandler.updateText({
            uploadText: translations.uploadText,
            uploadHint: translations.uploadHint,
            successMessage: translations.uploadSuccess
        });
    }
}

/**
 * Handle "Start Over" / Reset button
 * @param {Object} photoHandler - PhotoUploadHandler instance
 * @param {Function} resetCallback - Additional reset logic (e.g., clear canvas)
 */
export function handleStartOver(photoHandler, resetCallback) {
    // Reset the photo handler (clears storage and UI)
    if (photoHandler) {
        photoHandler.reset();
    }

    // Execute additional reset logic
    if (resetCallback) {
        resetCallback();
    }

    // Hide preview section
    const previewSection = document.getElementById('previewSection');
    if (previewSection) {
        previewSection.classList.remove('active');
    }

    // Announce to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'visually-hidden';
    announcement.textContent = 'Photo cleared. You can upload a new photo.';
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);

    // Track event
    if (typeof gtag !== 'undefined') {
        gtag('event', 'start_over', {
            'event_category': 'Photo Upload',
            'event_label': 'Reset Photo'
        });
    }
}
