/**
 * Application Container Module
 * Dependency Injection container to manage application services and instances
 * Eliminates global state pollution via window object
 */

/**
 * @typedef {Object} ServiceDefinition
 * @property {*} instance - Service instance
 * @property {boolean} singleton - Whether service is singleton
 */

/**
 * AppContainer Class
 * Simple dependency injection container
 */
class AppContainer {
    constructor() {
        if (AppContainer.instance) {
            return AppContainer.instance;
        }

        /**
         * @type {Map<string, ServiceDefinition>}
         */
        this.services = new Map();

        /**
         * @type {Map<string, Function>}
         */
        this.factories = new Map();

        AppContainer.instance = this;
    }

    /**
     * Register a service instance
     * @param {string} name - Service name
     * @param {*} instance - Service instance
     * @param {boolean} singleton - Whether service is singleton (default: true)
     * @returns {AppContainer} This instance for chaining
     */
    register(name, instance, singleton = true) {
        this.services.set(name, {
            instance,
            singleton
        });
        return this;
    }

    /**
     * Register a factory function for lazy instantiation
     * @param {string} name - Service name
     * @param {Function} factory - Factory function that returns service instance
     * @param {boolean} singleton - Whether to cache the instance (default: true)
     * @returns {AppContainer} This instance for chaining
     */
    registerFactory(name, factory, singleton = true) {
        this.factories.set(name, {
            factory,
            singleton,
            instance: null
        });
        return this;
    }

    /**
     * Get a service by name
     * @param {string} name - Service name
     * @returns {*} Service instance or undefined
     */
    get(name) {
        // Check if it's a registered instance
        if (this.services.has(name)) {
            return this.services.get(name).instance;
        }

        // Check if it's a factory
        if (this.factories.has(name)) {
            const factoryDef = this.factories.get(name);

            // If singleton and already instantiated, return cached instance
            if (factoryDef.singleton && factoryDef.instance !== null) {
                return factoryDef.instance;
            }

            // Create new instance
            const instance = factoryDef.factory(this);

            // Cache if singleton
            if (factoryDef.singleton) {
                factoryDef.instance = instance;
            }

            return instance;
        }

        console.warn(`Service "${name}" not found in container`);
        return undefined;
    }

    /**
     * Check if service exists
     * @param {string} name - Service name
     * @returns {boolean} True if service is registered
     */
    has(name) {
        return this.services.has(name) || this.factories.has(name);
    }

    /**
     * Remove a service from container
     * @param {string} name - Service name
     * @returns {boolean} True if service was removed
     */
    remove(name) {
        const hadService = this.services.delete(name);
        const hadFactory = this.factories.delete(name);
        return hadService || hadFactory;
    }

    /**
     * Clear all services
     */
    clear() {
        this.services.clear();
        this.factories.clear();
    }

    /**
     * Get all registered service names
     * @returns {string[]} Array of service names
     */
    getServiceNames() {
        return [
            ...Array.from(this.services.keys()),
            ...Array.from(this.factories.keys())
        ];
    }

    /**
     * Resolve dependencies and create instance
     * Useful for auto-wiring dependencies
     * @param {Function} Class - Class constructor
     * @param {string[]} dependencies - Array of dependency names
     * @returns {*} Class instance with injected dependencies
     */
    resolve(Class, dependencies = []) {
        const resolvedDeps = dependencies.map(dep => this.get(dep));
        return new Class(...resolvedDeps);
    }

    /**
     * Create a scoped container (child container)
     * Services in parent are accessible, but child services don't affect parent
     * @returns {AppContainer} New scoped container
     */
    createScope() {
        const scope = new AppContainer();

        // Override get to check parent if not found
        const parentGet = this.get.bind(this);
        const originalGet = scope.get.bind(scope);

        scope.get = function(name) {
            const service = originalGet(name);
            return service !== undefined ? service : parentGet(name);
        };

        return scope;
    }
}

// Create and export singleton instance
export const container = new AppContainer();

// Export class for custom instances if needed
export { AppContainer };

/**
 * Convenience function to get service
 * @param {string} name - Service name
 * @returns {*} Service instance
 */
export function getService(name) {
    return container.get(name);
}

/**
 * Convenience function to register service
 * @param {string} name - Service name
 * @param {*} instance - Service instance
 * @param {boolean} singleton - Singleton flag
 * @returns {AppContainer} Container instance
 */
export function registerService(name, instance, singleton = true) {
    return container.register(name, instance, singleton);
}

export default container;
