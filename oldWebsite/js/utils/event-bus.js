/**
 * Event Bus Module
 * Centralized event system for decoupled module communication
 * Implements pub/sub pattern for clean module interactions
 */

/**
 * @typedef {Object} EventSubscription
 * @property {string} event - Event name
 * @property {Function} callback - Callback function
 * @property {Function} unsubscribe - Function to unsubscribe
 */

/**
 * EventBus Class
 * Singleton event bus for application-wide event management
 */
class EventBus {
    constructor() {
        if (EventBus.instance) {
            return EventBus.instance;
        }

        /**
         * @type {Map<string, Set<Function>>}
         */
        this.events = new Map();

        /**
         * @type {Map<string, Set<Function>>}
         */
        this.onceListeners = new Map();

        /**
         * @type {boolean}
         */
        this.debug = false;

        EventBus.instance = this;
    }

    /**
     * Subscribe to an event
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     * @param {Object} options - Subscription options
     * @param {*} options.context - Context to bind callback to
     * @returns {Function} Unsubscribe function
     */
    on(event, callback, options = {}) {
        if (typeof callback !== 'function') {
            throw new TypeError('Callback must be a function');
        }

        // Get or create event listeners set
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }

        // Bind context if provided
        const boundCallback = options.context
            ? callback.bind(options.context)
            : callback;

        // Store original callback reference for removal
        boundCallback._original = callback;

        this.events.get(event).add(boundCallback);

        if (this.debug) {
            console.log(`[EventBus] Subscribed to "${event}"`);
        }

        // Return unsubscribe function
        return () => this.off(event, callback);
    }

    /**
     * Subscribe to an event (fires only once)
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     * @param {Object} options - Subscription options
     * @returns {Function} Unsubscribe function
     */
    once(event, callback, options = {}) {
        if (typeof callback !== 'function') {
            throw new TypeError('Callback must be a function');
        }

        // Get or create once listeners set
        if (!this.onceListeners.has(event)) {
            this.onceListeners.set(event, new Set());
        }

        // Bind context if provided
        const boundCallback = options.context
            ? callback.bind(options.context)
            : callback;

        // Store original callback reference
        boundCallback._original = callback;

        this.onceListeners.get(event).add(boundCallback);

        if (this.debug) {
            console.log(`[EventBus] Subscribed to "${event}" (once)`);
        }

        // Return unsubscribe function
        return () => {
            const listeners = this.onceListeners.get(event);
            if (listeners) {
                for (const listener of listeners) {
                    if (listener === boundCallback || listener._original === callback) {
                        listeners.delete(listener);
                        break;
                    }
                }
            }
        };
    }

    /**
     * Unsubscribe from an event
     * @param {string} event - Event name
     * @param {Function} callback - Callback function to remove
     * @returns {boolean} True if callback was removed
     */
    off(event, callback) {
        let removed = false;

        // Remove from regular listeners
        if (this.events.has(event)) {
            const listeners = this.events.get(event);
            for (const listener of listeners) {
                if (listener === callback || listener._original === callback) {
                    listeners.delete(listener);
                    removed = true;
                    break;
                }
            }

            // Clean up empty event sets
            if (listeners.size === 0) {
                this.events.delete(event);
            }
        }

        // Remove from once listeners
        if (this.onceListeners.has(event)) {
            const listeners = this.onceListeners.get(event);
            for (const listener of listeners) {
                if (listener === callback || listener._original === callback) {
                    listeners.delete(listener);
                    removed = true;
                    break;
                }
            }

            // Clean up empty event sets
            if (listeners.size === 0) {
                this.onceListeners.delete(event);
            }
        }

        if (this.debug && removed) {
            console.log(`[EventBus] Unsubscribed from "${event}"`);
        }

        return removed;
    }

    /**
     * Emit an event
     * @param {string} event - Event name
     * @param {*} data - Data to pass to listeners
     * @returns {number} Number of listeners that were called
     */
    emit(event, data) {
        let callCount = 0;

        if (this.debug) {
            console.log(`[EventBus] Emitting "${event}"`, data);
        }

        // Call regular listeners
        if (this.events.has(event)) {
            const listeners = this.events.get(event);
            for (const callback of listeners) {
                try {
                    callback(data);
                    callCount++;
                } catch (error) {
                    console.error(`[EventBus] Error in listener for "${event}":`, error);
                }
            }
        }

        // Call once listeners and remove them
        if (this.onceListeners.has(event)) {
            const listeners = this.onceListeners.get(event);
            const listenersCopy = Array.from(listeners);

            // Clear once listeners before calling (prevents issues if callback emits same event)
            this.onceListeners.delete(event);

            for (const callback of listenersCopy) {
                try {
                    callback(data);
                    callCount++;
                } catch (error) {
                    console.error(`[EventBus] Error in once listener for "${event}":`, error);
                }
            }
        }

        return callCount;
    }

    /**
     * Remove all listeners for an event
     * @param {string} event - Event name (if not provided, removes all events)
     */
    removeAllListeners(event) {
        if (event) {
            this.events.delete(event);
            this.onceListeners.delete(event);

            if (this.debug) {
                console.log(`[EventBus] Removed all listeners for "${event}"`);
            }
        } else {
            this.events.clear();
            this.onceListeners.clear();

            if (this.debug) {
                console.log('[EventBus] Removed all listeners');
            }
        }
    }

    /**
     * Get all registered event names
     * @returns {string[]} Array of event names
     */
    getEventNames() {
        const regularEvents = Array.from(this.events.keys());
        const onceEvents = Array.from(this.onceListeners.keys());
        return [...new Set([...regularEvents, ...onceEvents])];
    }

    /**
     * Get listener count for an event
     * @param {string} event - Event name
     * @returns {number} Number of listeners
     */
    listenerCount(event) {
        let count = 0;

        if (this.events.has(event)) {
            count += this.events.get(event).size;
        }

        if (this.onceListeners.has(event)) {
            count += this.onceListeners.get(event).size;
        }

        return count;
    }

    /**
     * Enable debug mode
     * @param {boolean} enabled - Enable debug logging
     */
    setDebug(enabled) {
        this.debug = enabled;
    }

    /**
     * Wait for an event (returns a Promise)
     * @param {string} event - Event name
     * @param {number} timeout - Optional timeout in milliseconds
     * @returns {Promise<*>} Promise that resolves with event data
     */
    waitFor(event, timeout = 0) {
        return new Promise((resolve, reject) => {
            let timeoutId;

            const unsubscribe = this.once(event, (data) => {
                if (timeoutId) clearTimeout(timeoutId);
                resolve(data);
            });

            if (timeout > 0) {
                timeoutId = setTimeout(() => {
                    unsubscribe();
                    reject(new Error(`Timeout waiting for event "${event}"`));
                }, timeout);
            }
        });
    }
}

// Create and export singleton instance
export const eventBus = new EventBus();

// Export class for custom instances if needed
export { EventBus };

// Convenience functions
export const on = (event, callback, options) => eventBus.on(event, callback, options);
export const once = (event, callback, options) => eventBus.once(event, callback, options);
export const off = (event, callback) => eventBus.off(event, callback);
export const emit = (event, data) => eventBus.emit(event, data);
export const waitFor = (event, timeout) => eventBus.waitFor(event, timeout);

export default eventBus;
