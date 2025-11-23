/**
 * Form Handler Module
 * Manages form inputs and option changes for photo sheet customization
 */

import { getLayout, getDPI } from './layout-config.js';

/**
 * Form Handler Class
 * Handles form state and option changes
 */
export class FormHandler {
    constructor(formElement, onChangeCallback) {
        this.form = formElement;
        this.onChangeCallback = onChangeCallback;

        // Get form elements
        this.paperSizeSelect = document.getElementById('paperSize');
        this.qualitySelect = document.getElementById('quality');
        this.cuttingGuideSelect = document.getElementById('cuttingGuide');

        this.init();
    }

    /**
     * Initialize form handlers
     */
    init() {
        // Set up event listeners
        this.paperSizeSelect?.addEventListener('change', () => {
            this.updateCuttingGuideAvailability();
            this.handleChange();
        });

        this.qualitySelect?.addEventListener('change', () => {
            this.handleChange();
        });

        this.cuttingGuideSelect?.addEventListener('change', () => {
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
        const paperSize = this.paperSizeSelect?.value || '4x6';
        const quality = this.qualitySelect?.value || 'high';
        const cuttingGuide = this.cuttingGuideSelect?.value || 'none-none';

        const [spacing, border] = cuttingGuide.split('-');

        return {
            layout: getLayout(paperSize),
            dpi: getDPI(quality),
            paperSize,
            quality,
            cuttingGuide,
            gapEnabled: spacing === 'small',
            gapSize: 0.05,
            borderEnabled: border === 'thin'
        };
    }

    /**
     * Update cutting guide availability based on paper size
     * 4x6 and 8x10 are edge-to-edge, so cutting lines would scale photos down
     * Only 5x7 has margins for cutting lines
     */
    updateCuttingGuideAvailability() {
        const size = this.paperSizeSelect?.value || '4x6';
        const cuttingGuideDisabledHint = document.getElementById('cuttingGuideDisabledHint');
        const currentValue = this.cuttingGuideSelect?.value || 'none-none';
        const [currentSpacing] = currentValue.split('-');

        // Only 5x7 has margins for cutting lines
        const disableCuttingLines = (size === '4x6' || size === '8x10');

        // Get all options
        const options = this.cuttingGuideSelect?.querySelectorAll('option') || [];
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

        // Reset to "none-none" if current selection was disabled
        if (shouldResetValue && this.cuttingGuideSelect) {
            this.cuttingGuideSelect.value = 'none-none';
        }

        // Show/hide disabled hint
        if (cuttingGuideDisabledHint) {
            if (disableCuttingLines && currentSpacing === 'small') {
                cuttingGuideDisabledHint.style.display = 'block';
            } else {
                cuttingGuideDisabledHint.style.display = 'none';
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
