/**
 * Layout Configuration Module
 * Defines print sheet layouts and photo sizing
 */

/**
 * Print sheet layouts configuration
 * Each layout defines dimensions and grid arrangement
 */
export const LAYOUTS = {
    '4x6': {
        width: 4,
        height: 6,
        cols: 2,
        rows: 3,
        photos: 6,
        icon: '💰',
        label: 'Standard 4×6"'
    },
    '5x7': {
        width: 5,
        height: 7,
        cols: 2,
        rows: 3,
        photos: 6,
        icon: '💵',
        label: 'Medium 5×7"'
    },
    '8x10': {
        width: 8,
        height: 10,
        cols: 4,
        rows: 5,
        photos: 20,
        icon: '💎',
        label: 'Large 8×10"'
    }
};

/**
 * Standard passport photo size in inches
 */
export const PHOTO_SIZE_INCHES = 2;

/**
 * DPI settings for quality options
 */
export const DPI_SETTINGS = {
    high: 300,
    medium: 200
};

/**
 * Get layout configuration by size key
 * @param {string} sizeKey - Layout size key (e.g., '4x6')
 * @returns {Object} Layout configuration
 */
export function getLayout(sizeKey) {
    return LAYOUTS[sizeKey] || LAYOUTS['4x6'];
}

/**
 * Get DPI value by quality setting
 * @param {string} quality - Quality setting ('high' or 'medium')
 * @returns {number} DPI value
 */
export function getDPI(quality) {
    return DPI_SETTINGS[quality] || DPI_SETTINGS.high;
}

/**
 * Calculate canvas dimensions for a given layout and DPI
 * @param {Object} layout - Layout configuration
 * @param {number} dpi - DPI setting
 * @returns {Object} Canvas dimensions {width, height, photoSize}
 */
export function calculateCanvasDimensions(layout, dpi) {
    return {
        width: layout.width * dpi,
        height: layout.height * dpi,
        photoSize: PHOTO_SIZE_INCHES * dpi
    };
}
