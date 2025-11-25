/**
 * Photo Export Module
 * Handles exporting edited photos to various formats
 */

/**
 * Photo Exporter Class
 * Manages photo export operations
 */
export class PhotoExporter {
    constructor(canvasEditor, options = {}) {
        this.canvasEditor = canvasEditor;
        this.canvasSize = options.canvasSize || 600;

        // Callbacks
        this.onExportStart = options.onExportStart || null;
        this.onExportSuccess = options.onExportSuccess || null;
        this.onExportError = options.onExportError || null;
    }

    /**
     * Export to PNG file
     * @param {string} filename - Output filename
     */
    async exportToPNG(filename = 'passport-photo.png') {
        try {
            if (this.onExportStart) {
                this.onExportStart({ format: 'png', filename });
            }

            const dataURL = this.canvasEditor.toDataURL('image/png', 1.0);
            this.downloadFile(dataURL, filename);

            if (this.onExportSuccess) {
                this.onExportSuccess({ format: 'png', filename });
            }

            return true;
        } catch (error) {
            console.error('PNG export error:', error);

            if (this.onExportError) {
                this.onExportError(error);
            }

            return false;
        }
    }

    /**
     * Export to Photo Maker (index.html)
     * Stores photo in localStorage and redirects
     */
    async exportToPhotoMaker() {
        try {
            if (this.onExportStart) {
                this.onExportStart({ format: 'photomaker' });
            }

            const dataURL = this.canvasEditor.toDataURL('image/png', 1.0);

            // Store in localStorage using the same key as PhotoStorage class
            // This ensures the photo-editor's adjusted photo is picked up by index.html
            const photoData = {
                dataURL,
                metadata: {
                    width: this.canvasSize,
                    height: this.canvasSize,
                    source: 'photo-editor',
                    timestamp: Date.now(),
                    type: 'image/png',
                    uploadedAt: new Date().toISOString()
                }
            };

            // Use 'currentPhoto' key to match PhotoStorage in photoHandler.js
            localStorage.setItem('currentPhoto', JSON.stringify(photoData));

            if (this.onExportSuccess) {
                this.onExportSuccess({ format: 'photomaker' });
            }

            // Redirect to photo maker
            window.location.href = 'index.html';

            return true;
        } catch (error) {
            console.error('Photo Maker export error:', error);

            if (this.onExportError) {
                this.onExportError(error);
            }

            return false;
        }
    }

    /**
     * Download file helper
     * @param {string} dataURL - Data URL
     * @param {string} filename - Filename
     */
    downloadFile(dataURL, filename) {
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataURL;
        link.click();
    }

    /**
     * Get export data URL without downloading
     * @param {string} format - Image format ('image/png' or 'image/jpeg')
     * @param {number} quality - Image quality 0-1
     * @returns {string} Data URL
     */
    getDataURL(format = 'image/png', quality = 1.0) {
        return this.canvasEditor.toDataURL(format, quality);
    }

    /**
     * Get export blob
     * @param {string} format - Image format ('image/png' or 'image/jpeg')
     * @param {number} quality - Image quality 0-1
     * @returns {Promise<Blob>} Image blob
     */
    async getBlob(format = 'image/png', quality = 1.0) {
        return await this.canvasEditor.toBlob(format, quality);
    }
}
