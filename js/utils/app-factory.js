/**
 * Application Factory Module
 * Provides factory methods for creating and configuring application modules
 * Simplifies initialization with sensible defaults and dependency injection
 */

import { CanvasRenderer } from '../modules/canvas-renderer.js';
import { FormHandler } from '../modules/form-handler.js';
import { DownloadHandler } from '../modules/download-handler.js';
import { PhotoUploadHandler } from '../photo/photo-uploader.js';
import { PhotoStorage } from '../photo/photo-storage.js';
import StateManager from './state-manager.js';
import { container } from './app-container.js';
import { APP_CONFIG, getElementId } from '../config/app-config.js';
import { debounce } from './dom-utils.js';

/**
 * @typedef {Object} AppFactoryConfig
 * @property {string} [canvasId] - Canvas element ID
 * @property {string} [formId] - Form element ID
 * @property {Function} [onOptionsChange] - Options change callback
 * @property {Object} [defaults] - Default values
 */

/**
 * AppFactory Class
 * Factory for creating application modules with proper configuration
 */
export class AppFactory {
    /**
     * Create CanvasRenderer instance
     * @param {string|HTMLCanvasElement} canvas - Canvas ID or element
     * @returns {CanvasRenderer} Canvas renderer instance
     */
    static createCanvasRenderer(canvas) {
        const canvasElement = typeof canvas === 'string'
            ? document.getElementById(canvas)
            : canvas;

        if (!canvasElement) {
            throw new Error(`Canvas element not found: ${canvas}`);
        }

        return new CanvasRenderer(canvasElement);
    }

    /**
     * Create FormHandler instance with dependency injection
     * @param {Object} config - Configuration object
     * @returns {FormHandler} Form handler instance
     */
    static createFormHandler(config = {}) {
        const formId = config.formId || getElementId('OPTIONS_FORM');
        const form = document.getElementById(formId);

        if (!form) {
            throw new Error(`Form element not found: ${formId}`);
        }

        const formConfig = {
            form,
            paperSizeSelect: config.paperSizeSelect || document.getElementById(getElementId('PAPER_SIZE_SELECT')),
            qualitySelect: config.qualitySelect || document.getElementById(getElementId('QUALITY_SELECT')),
            cuttingGuideSelect: config.cuttingGuideSelect || document.getElementById(getElementId('CUTTING_GUIDE_SELECT')),
            cuttingGuideHint: config.cuttingGuideHint || document.getElementById(getElementId('CUTTING_GUIDE_HINT')),
            onChange: config.onChange || (() => {}),
            defaults: config.defaults || APP_CONFIG.DEFAULTS
        };

        return new FormHandler(formConfig);
    }

    /**
     * Create DownloadHandler instance
     * @param {CanvasRenderer} canvasRenderer - Canvas renderer instance
     * @param {Object} callbacks - Callback functions
     * @returns {DownloadHandler} Download handler instance
     */
    static createDownloadHandler(canvasRenderer, callbacks = {}) {
        return new DownloadHandler(canvasRenderer, {
            onSuccess: callbacks.onSuccess || (() => {}),
            onError: callbacks.onError || ((error) => console.error(error))
        });
    }

    /**
     * Create PhotoUploadHandler instance
     * @param {Object} config - Configuration object
     * @returns {PhotoUploadHandler} Photo upload handler instance
     */
    static createPhotoUploadHandler(config = {}) {
        if (!config.containerId) {
            throw new Error('PhotoUploadHandler requires a containerId');
        }

        return new PhotoUploadHandler({
            containerId: config.containerId,
            ui: config.ui || {},
            text: config.text || {},
            onPhotoLoaded: config.onPhotoLoaded || (() => {}),
            onError: config.onError || ((error) => console.error(error)),
            analytics: config.analytics || null,
            autoSave: config.autoSave !== false,
            useEventBus: config.useEventBus !== false
        });
    }

    /**
     * Create PhotoStorage instance
     * @returns {PhotoStorage} Photo storage instance
     */
    static createPhotoStorage() {
        return new PhotoStorage();
    }

    /**
     * Create StateManager instance
     * @param {Object} initialState - Initial state
     * @returns {StateManager} State manager instance
     */
    static createStateManager(initialState = {}) {
        return new StateManager(initialState);
    }

    /**
     * Create a fully configured Photo Sheet App
     * @param {AppFactoryConfig} config - Configuration object
     * @returns {Object} Configured app modules
     */
    static createPhotoSheetApp(config = {}) {
        const canvasId = config.canvasId || getElementId('CANVAS');
        const formId = config.formId || getElementId('OPTIONS_FORM');

        // Create canvas renderer
        const canvasRenderer = this.createCanvasRenderer(canvasId);

        // Create form handler with debounced callback
        const formHandler = this.createFormHandler({
            formId,
            onChange: config.onOptionsChange
                ? debounce(config.onOptionsChange, APP_CONFIG.DEFAULTS.DEBOUNCE_DELAY)
                : undefined,
            defaults: config.defaults
        });

        // Create download handler
        const downloadHandler = this.createDownloadHandler(canvasRenderer, {
            onSuccess: config.onDownloadSuccess,
            onError: config.onDownloadError
        });

        // Register in container
        container.register('canvasRenderer', canvasRenderer);
        container.register('formHandler', formHandler);
        container.register('downloadHandler', downloadHandler);

        return {
            canvasRenderer,
            formHandler,
            downloadHandler
        };
    }

    /**
     * Create a fully configured Photo Editor App
     * @param {Object} config - Configuration object
     * @returns {Object} Configured editor modules
     */
    static createPhotoEditorApp(config = {}) {
        // Import editor modules dynamically when needed
        // This keeps the bundle size small for the index page
        return import('../editor-app.js').then(module => {
            return module.createEditorApp(config);
        });
    }

    /**
     * Register all core services in the app container
     * @param {Object} services - Services to register
     */
    static registerServices(services = {}) {
        Object.entries(services).forEach(([name, service]) => {
            container.register(name, service);
        });
    }

    /**
     * Create app with state management
     * @param {Object} config - Configuration
     * @returns {Object} App with state manager
     */
    static createStatefulApp(config = {}) {
        const initialState = config.initialState || {
            currentLanguage: localStorage.getItem('preferredLanguage') || APP_CONFIG.DEFAULTS.LANGUAGE,
            uploadedImage: null,
            options: {
                paperSize: APP_CONFIG.DEFAULTS.PAPER_SIZE,
                quality: APP_CONFIG.DEFAULTS.QUALITY,
                cuttingGuide: APP_CONFIG.DEFAULTS.CUTTING_GUIDE
            }
        };

        const stateManager = this.createStateManager(initialState);
        const app = this.createPhotoSheetApp(config);

        // Register state manager
        container.register('stateManager', stateManager);

        return {
            ...app,
            stateManager
        };
    }
}

export default AppFactory;

// Export convenience functions
export const createCanvasRenderer = (canvas) => AppFactory.createCanvasRenderer(canvas);
export const createFormHandler = (config) => AppFactory.createFormHandler(config);
export const createDownloadHandler = (renderer, callbacks) => AppFactory.createDownloadHandler(renderer, callbacks);
export const createPhotoUploadHandler = (config) => AppFactory.createPhotoUploadHandler(config);
export const createPhotoStorage = () => AppFactory.createPhotoStorage();
export const createStateManager = (state) => AppFactory.createStateManager(state);
export const createPhotoSheetApp = (config) => AppFactory.createPhotoSheetApp(config);
