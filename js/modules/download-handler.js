/**
 * Download Handler Module
 * Handles photo sheet download functionality
 */

/**
 * Download Handler Class
 * Manages photo sheet downloads
 */
export class DownloadHandler {
    constructor(canvasRenderer, options = {}) {
        this.canvasRenderer = canvasRenderer;
        this.onSuccess = options.onSuccess || null;
        this.onError = options.onError || null;
    }

    /**
     * Download photo sheet
     * @param {string} paperSize - Paper size for filename
     * @param {Object} options - Download options
     */
    download(paperSize, options = {}) {
        const {
            format = 'image/jpeg',
            quality = 0.95,
            prefix = 'photo-sheet'
        } = options;

        try {
            const link = document.createElement('a');
            const timestamp = new Date().toISOString().slice(0, 10);
            link.download = `${prefix}-${paperSize}-${timestamp}.jpg`;
            link.href = this.canvasRenderer.toDataURL(format, quality);
            link.click();

            if (this.onSuccess) {
                this.onSuccess({
                    filename: link.download,
                    paperSize,
                    format,
                    quality
                });
            }

            return true;
        } catch (error) {
            console.error('Download error:', error);

            if (this.onError) {
                this.onError(error);
            }

            return false;
        }
    }

    /**
     * Get download data URL without triggering download
     * @param {string} format - Image format
     * @param {number} quality - Image quality
     * @returns {string} Data URL
     */
    getDataURL(format = 'image/jpeg', quality = 0.95) {
        return this.canvasRenderer.toDataURL(format, quality);
    }
}
