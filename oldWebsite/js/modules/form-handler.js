/**
 * Form Handler Module
 * Manages form inputs and option changes for photo sheet customization
 * Refactored with proper dependency injection for better testability
 */

import { getLayout, getDPI } from './layout-config.js';
import { APP_CONFIG, getElementId } from '../config/app-config.js';

/**
 * @typedef {Object} FormHandlerConfig
 * @property {HTMLFormElement} form - Form element
 * @property {HTMLSelectElement} [paperSizeSelect] - Paper size select element
 * @property {HTMLSelectElement} [qualitySelect] - Quality select element
 * @property {HTMLSelectElement} [cuttingGuideSelect] - Cutting guide select element
 * @property {HTMLElement} [cuttingGuideHint] - Cutting guide hint element
 * @property {Function} onChange - Change callback function
 * @property {Object} [defaults] - Default values
 */

/**
 * Form Handler Class
 * Handles form state and option changes with dependency injection
 */
export class FormHandler {
    /**
     * @param {FormHandlerConfig} config - Configuration object
     */
    constructor(config) {
        // Validate required fields
        if (!config.form) {
            throw new Error('FormHandler requires a form element');
        }

        this.form = config.form;
        this.onChangeCallback = config.onChange;

        // Get form elements with dependency injection (fall back to document.getElementById)
        this.elements = {
            paperSizeSelect: config.paperSizeSelect || document.getElementById(getElementId('PAPER_SIZE_SELECT')),
            qualitySelect: config.qualitySelect || document.getElementById(getElementId('QUALITY_SELECT')),
            cuttingGuideSelect: config.cuttingGuideSelect || document.getElementById(getElementId('CUTTING_GUIDE_SELECT')),
            cuttingGuideHint: config.cuttingGuideHint || document.getElementById(getElementId('CUTTING_GUIDE_HINT'))
        };

        // Store defaults
        this.defaults = {
            paperSize: config.defaults?.paperSize || APP_CONFIG.DEFAULTS.PAPER_SIZE,
            quality: config.defaults?.quality || APP_CONFIG.DEFAULTS.QUALITY,
            cuttingGuide: config.defaults?.cuttingGuide || APP_CONFIG.DEFAULTS.CUTTING_GUIDE,
            gapSize: config.defaults?.gapSize || APP_CONFIG.DEFAULTS.GAP_SIZE
        };

        this.init();
    }

    /**
     * Get element reference by name (for easier access)
     * @param {string} name - Element name
     * @returns {HTMLElement|null}
     */
    getElement(name) {
        return this.elements[name] || null;
    }

    /**
     * Initialize form handlers
     */
    init() {
        // Set up event listeners
        const { paperSizeSelect, qualitySelect, cuttingGuideSelect } = this.elements;

        paperSizeSelect?.addEventListener('change', () => {
            this.updateCuttingGuideAvailability();
            this.handleChange();
        });

        qualitySelect?.addEventListener('change', () => {
            this.handleChange();
        });

        cuttingGuideSelect?.addEventListener('change', () => {
            this.handleChange();
        });

        // Initial setup
        this.updateCuttingGuideAvailability();
    }

    /**
     * Handle form change event
     */
    handleChange() {
        if (this.onChangeCallback) {
            const options = this.getOptions();
            this.onChangeCallback(options);
        }
    }

    /**
     * Get current form options
     * @returns {Object} Current form options
     */
    getOptions() {
        const { paperSizeSelect, qualitySelect, cuttingGuideSelect } = this.elements;

        const paperSize = paperSizeSelect?.value || this.defaults.paperSize;
        const quality = qualitySelect?.value || this.defaults.quality;
        const cuttingGuide = cuttingGuideSelect?.value || this.defaults.cuttingGuide;

        const [spacing, border] = cuttingGuide.split('-');

        return {
            layout: getLayout(paperSize),
            dpi: getDPI(quality),
            paperSize,
            quality,
            cuttingGuide,
            gapEnabled: spacing === 'small',
            gapSize: this.defaults.gapSize,
            borderEnabled: border === 'thin'
        };
    }

    /**
     * Update cutting guide availability based on paper size
     * 4x6 and 8x10 are edge-to-edge, so cutting lines would scale photos down
     * Only 5x7 has margins for cutting lines
     */
    updateCuttingGuideAvailability() {
        const { paperSizeSelect, cuttingGuideSelect, cuttingGuideHint } = this.elements;

        const size = paperSizeSelect?.value || this.defaults.paperSize;
        const currentValue = cuttingGuideSelect?.value || this.defaults.cuttingGuide;
        const [currentSpacing] = currentValue.split('-');

        // Only 5x7 has margins for cutting lines
        const disableCuttingLines = (size === '4x6' || size === '8x10');

        // Get all options
        const options = cuttingGuideSelect?.querySelectorAll('option') || [];
        let shouldResetValue = false;

        options.forEach(option => {
            const [spacing] = option.value.split('-');

            // Disable options with cutting lines for 4x6 and 8x10
            if (spacing === 'small' && disableCuttingLines) {
                option.disabled = true;
                option.style.color = '#999';

                // If current selection is being disabled, reset
                if (option.value === currentValue) {
                    shouldResetValue = true;
                }
            } else {
                option.disabled = false;
                option.style.color = '';
            }
        });

        // Reset to default if current selection was disabled
        if (shouldResetValue && cuttingGuideSelect) {
            cuttingGuideSelect.value = this.defaults.cuttingGuide;
        }

        // Show/hide disabled hint
        if (cuttingGuideHint) {
            if (disableCuttingLines && currentSpacing === 'small') {
                cuttingGuideHint.style.display = 'block';
            } else {
                cuttingGuideHint.style.display = 'none';
            }
        }
    }

    /**
     * Update stats display
     * @param {Object} layout - Layout configuration
     * @param {string} paperSize - Paper size key
     */
    updateStats(layout, paperSize) {
        const photoCountEl = document.getElementById('photoCount');
        const sheetSizeEl = document.getElementById('sheetSize');

        if (photoCountEl) {
            photoCountEl.textContent = layout.photos;
        }

        if (sheetSizeEl) {
            sheetSizeEl.textContent = paperSize.replace('x', '×') + '"';
        }
    }
}
