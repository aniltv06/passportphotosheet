/**
 * State Manager Module
 * Centralized state management with pub/sub pattern
 * Provides reactive state updates with subscriber notifications
 */

/**
 * @typedef {Object} StateSubscription
 * @property {Function} callback - Subscriber callback
 * @property {Function} unsubscribe - Function to unsubscribe
 */

/**
 * StateManager Class
 * Manages application state with reactive updates
 */
export class StateManager {
    /**
     * @param {Object} initialState - Initial state object
     */
    constructor(initialState = {}) {
        this.state = { ...initialState };
        this.listeners = new Set();
        this.debug = false;
    }

    /**
     * Get current state (returns a copy to prevent mutations)
     * @returns {Object} Current state object
     */
    getState() {
        return { ...this.state };
    }

    /**
     * Get a specific state value
     * @param {string} key - State key (supports dot notation: 'user.name')
     * @param {*} defaultValue - Default value if key not found
     * @returns {*} State value
     */
    get(key, defaultValue = undefined) {
        const keys = key.split('.');
        let value = this.state;

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return defaultValue;
            }
        }

        return value;
    }

    /**
     * Set state (merges with existing state)
     * @param {Object|Function} updates - State updates or updater function
     * @param {boolean} silent - If true, don't notify listeners
     */
    setState(updates, silent = false) {
        const previousState = { ...this.state };

        // If updates is a function, call it with current state
        const newState = typeof updates === 'function'
            ? updates(this.state)
            : updates;

        // Merge updates into state
        this.state = {
            ...this.state,
            ...newState
        };

        if (this.debug) {
            console.log('[StateManager] State updated:', {
                previous: previousState,
                updates: newState,
                current: this.state
            });
        }

        // Notify listeners
        if (!silent) {
            this.notify(this.state, previousState);
        }
    }

    /**
     * Set a specific state value
     * @param {string} key - State key (supports dot notation: 'user.name')
     * @param {*} value - Value to set
     * @param {boolean} silent - If true, don't notify listeners
     */
    set(key, value, silent = false) {
        const previousState = { ...this.state };
        const keys = key.split('.');
        const lastKey = keys.pop();
        let target = this.state;

        // Navigate to the target object
        for (const k of keys) {
            if (!(k in target)) {
                target[k] = {};
            }
            target = target[k];
        }

        // Set the value
        target[lastKey] = value;

        if (this.debug) {
            console.log(`[StateManager] Set ${key}:`, value);
        }

        // Notify listeners
        if (!silent) {
            this.notify(this.state, previousState);
        }
    }

    /**
     * Reset state to initial or provided state
     * @param {Object} newState - New state (optional)
     * @param {boolean} silent - If true, don't notify listeners
     */
    reset(newState = {}, silent = false) {
        const previousState = { ...this.state };
        this.state = { ...newState };

        if (this.debug) {
            console.log('[StateManager] State reset:', this.state);
        }

        if (!silent) {
            this.notify(this.state, previousState);
        }
    }

    /**
     * Subscribe to state changes
     * @param {Function} callback - Callback function (state, previousState) => void
     * @param {Object} options - Subscription options
     * @param {string[]} options.keys - Only notify when these keys change
     * @returns {Function} Unsubscribe function
     */
    subscribe(callback, options = {}) {
        if (typeof callback !== 'function') {
            throw new TypeError('Callback must be a function');
        }

        const listener = {
            callback,
            keys: options.keys || null
        };

        this.listeners.add(listener);

        if (this.debug) {
            console.log('[StateManager] Subscriber added:', options);
        }

        // Return unsubscribe function
        return () => this.unsubscribe(listener);
    }

    /**
     * Unsubscribe from state changes
     * @param {Object|Function} listener - Listener object or callback function
     * @returns {boolean} True if unsubscribed successfully
     */
    unsubscribe(listener) {
        // If listener is a function, find the listener object
        if (typeof listener === 'function') {
            for (const l of this.listeners) {
                if (l.callback === listener) {
                    this.listeners.delete(l);
                    return true;
                }
            }
            return false;
        }

        return this.listeners.delete(listener);
    }

    /**
     * Notify all listeners of state change
     * @param {Object} state - New state
     * @param {Object} previousState - Previous state
     */
    notify(state, previousState) {
        for (const listener of this.listeners) {
            try {
                // If listener has specific keys, check if any changed
                if (listener.keys) {
                    const hasChanges = listener.keys.some(key => {
                        const newValue = this.get(key);
                        const oldValue = this.getValueFromState(previousState, key);
                        return newValue !== oldValue;
                    });

                    if (!hasChanges) continue;
                }

                listener.callback(state, previousState);
            } catch (error) {
                console.error('[StateManager] Error in subscriber:', error);
            }
        }
    }

    /**
     * Get value from a state object using dot notation
     * @param {Object} state - State object
     * @param {string} key - Key (supports dot notation)
     * @returns {*} Value
     */
    getValueFromState(state, key) {
        const keys = key.split('.');
        let value = state;

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return undefined;
            }
        }

        return value;
    }

    /**
     * Enable debug mode
     * @param {boolean} enabled - Enable debug logging
     */
    setDebug(enabled) {
        this.debug = enabled;
    }

    /**
     * Get number of subscribers
     * @returns {number} Subscriber count
     */
    getListenerCount() {
        return this.listeners.size;
    }

    /**
     * Clear all subscribers
     */
    clearListeners() {
        this.listeners.clear();

        if (this.debug) {
            console.log('[StateManager] All listeners cleared');
        }
    }

    /**
     * Create a computed value that updates when dependencies change
     * @param {Function} computeFn - Function to compute value
     * @param {string[]} dependencies - State keys this computed value depends on
     * @returns {Object} Object with getValue() and unsubscribe() methods
     */
    computed(computeFn, dependencies = []) {
        let cachedValue = computeFn(this.state);

        const unsubscribe = this.subscribe(
            (state) => {
                cachedValue = computeFn(state);
            },
            { keys: dependencies }
        );

        return {
            getValue: () => cachedValue,
            unsubscribe
        };
    }
}

export default StateManager;
