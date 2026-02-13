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

        // Quality presets with target file sizes
        this.qualityPresets = {
            'maximum': { quality: 1.0, targetSizeKB: null, label: 'Maximum Quality' },
            'high': { quality: 0.95, targetSizeKB: 500, label: 'High Quality (<500KB)' },
            'optimized': { quality: 0.85, targetSizeKB: 250, label: 'Optimized (<250KB)' },
            'small': { quality: 0.75, targetSizeKB: 100, label: 'Small Size (<100KB)' }
        };

        // Current quality setting (default: optimized)
        this.currentQuality = 'optimized';

        // Callbacks
        this.onExportStart = options.onExportStart || null;
        this.onExportSuccess = options.onExportSuccess || null;
        this.onExportError = options.onExportError || null;
    }

    /**
     * Set export quality preset
     * @param {string} preset - Quality preset name ('maximum', 'high', 'optimized', 'small')
     */
    setQuality(preset) {
        if (this.qualityPresets[preset]) {
            this.currentQuality = preset;
            console.log(`Export quality set to: ${this.qualityPresets[preset].label}`);
        } else {
            console.warn(`Unknown quality preset: ${preset}`);
        }
    }

    /**
     * Compress image to target file size
     * @param {string} format - Image format ('image/jpeg' or 'image/png')
     * @param {number} targetSizeKB - Target file size in KB
     * @param {number} initialQuality - Starting quality (0-1)
     * @returns {Object} { dataURL, quality, sizeKB }
     */
    async compressToSize(format = 'image/jpeg', targetSizeKB = 250, initialQuality = 0.9) {
        let quality = initialQuality;
        let dataURL = '';
        let sizeKB = 0;
        const minQuality = 0.1;
        const maxIterations = 10;
        let iteration = 0;

        while (iteration < maxIterations) {
            dataURL = this.canvasEditor.toDataURL(format, quality);

            // Calculate size in KB (data URL is base64, so divide by 1.37 for approximate binary size)
            const base64Length = dataURL.length - `data:${format};base64,`.length;
            sizeKB = (base64Length * 0.75) / 1024; // More accurate base64 to binary conversion

            console.log(`Iteration ${iteration + 1}: Quality ${quality.toFixed(2)}, Size ${sizeKB.toFixed(2)}KB`);

            // If we're within 10% of target or below it, we're done
            if (sizeKB <= targetSizeKB || quality <= minQuality) {
                break;
            }

            // Reduce quality for next iteration
            // Use binary search approach for faster convergence
            if (iteration === 0) {
                // First iteration: estimate required quality reduction
                const ratio = targetSizeKB / sizeKB;
                quality = Math.max(minQuality, quality * ratio * 0.9); // 0.9 for safety margin
            } else {
                // Subsequent iterations: gradual reduction
                quality = Math.max(minQuality, quality - 0.05);
            }

            iteration++;
        }

        return { dataURL, quality, sizeKB };
    }

    /**
     * Export to PNG or JPEG file with quality settings
     * @param {string} filename - Output filename
     */
    async exportToPNG(filename = 'passport-photo.jpg') {
        try {
            if (this.onExportStart) {
                this.onExportStart({ format: 'jpeg', filename });
            }

            const preset = this.qualityPresets[this.currentQuality];
            let dataURL;
            let actualSizeKB = 0;

            // If there's a target file size, compress to meet it
            if (preset.targetSizeKB) {
                const result = await this.compressToSize('image/jpeg', preset.targetSizeKB, preset.quality);
                dataURL = result.dataURL;
                actualSizeKB = result.sizeKB;
                console.log(`Compressed to ${actualSizeKB.toFixed(2)}KB (target: ${preset.targetSizeKB}KB)`);
            } else {
                // No target size, use maximum quality
                dataURL = this.canvasEditor.toDataURL('image/jpeg', preset.quality);
            }

            this.downloadFile(dataURL, filename);

            if (this.onExportSuccess) {
                this.onExportSuccess({
                    format: 'jpeg',
                    filename,
                    quality: this.currentQuality,
                    sizeKB: actualSizeKB
                });
            }

            return true;
        } catch (error) {
            console.error('JPEG export error:', error);

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

            const preset = this.qualityPresets[this.currentQuality];
            let dataURL;
            let actualSizeKB = 0;

            // If there's a target file size, compress to meet it
            if (preset.targetSizeKB) {
                const result = await this.compressToSize('image/jpeg', preset.targetSizeKB, preset.quality);
                dataURL = result.dataURL;
                actualSizeKB = result.sizeKB;
                console.log(`Compressed to ${actualSizeKB.toFixed(2)}KB (target: ${preset.targetSizeKB}KB)`);
            } else {
                // No target size, use maximum quality PNG
                dataURL = this.canvasEditor.toDataURL('image/png', preset.quality);
            }

            // Store in localStorage using the same key as PhotoStorage class
            // This ensures the photo-editor's adjusted photo is picked up by index.html
            const photoData = {
                dataURL,
                metadata: {
                    width: this.canvasSize,
                    height: this.canvasSize,
                    source: 'photo-editor',
                    timestamp: Date.now(),
                    type: preset.targetSizeKB ? 'image/jpeg' : 'image/png',
                    uploadedAt: new Date().toISOString(),
                    quality: this.currentQuality,
                    sizeKB: actualSizeKB
                }
            };

            // Use 'currentPhoto' key to match PhotoStorage in photoHandler.js
            localStorage.setItem('currentPhoto', JSON.stringify(photoData));

            if (this.onExportSuccess) {
                this.onExportSuccess({ format: 'photomaker', quality: this.currentQuality, sizeKB: actualSizeKB });
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
