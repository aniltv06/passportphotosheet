/**
 * Notification Manager Module
 * Provides toast-style notifications to replace alert() dialogs
 * Accessible, non-blocking, and user-friendly
 */

import { APP_CONFIG } from '../config/app-config.js';

/**
 * @typedef {Object} NotificationOptions
 * @property {number} [duration] - How long to show notification (ms)
 * @property {boolean} [closable=true] - Whether notification can be manually closed
 * @property {string} [position] - Override default position
 * @property {Function} [onClick] - Click handler for notification
 * @property {Function} [onClose] - Callback when notification closes
 */

/**
 * NotificationManager Class
 * Singleton pattern for managing toast notifications
 */
class NotificationManager {
    constructor() {
        if (NotificationManager.instance) {
            return NotificationManager.instance;
        }

        this.notifications = [];
        this.container = null;
        this.config = APP_CONFIG.NOTIFICATION;
        this.initialized = false;

        NotificationManager.instance = this;
    }

    /**
     * Initialize the notification system
     */
    init() {
        if (this.initialized) return;

        // Create container
        this.container = document.createElement('div');
        this.container.id = 'notification-container';
        this.container.className = `notification-container notification-${this.config.POSITION}`;
        this.container.setAttribute('aria-live', 'polite');
        this.container.setAttribute('aria-atomic', 'false');

        document.body.appendChild(this.container);
        this.initialized = true;
    }

    /**
     * Show a notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, info, warning)
     * @param {NotificationOptions} options - Additional options
     * @returns {Object} Notification instance with close method
     */
    show(message, type = 'info', options = {}) {
        this.init();

        const notification = this.createNotification(message, type, options);
        this.addToContainer(notification);

        // Auto-close after duration
        const duration = options.duration || this.config.DURATION[type.toUpperCase()] || this.config.DURATION.INFO;
        if (duration > 0) {
            notification.timeout = setTimeout(() => {
                this.close(notification);
            }, duration);
        }

        // Limit visible notifications
        this.limitVisibleNotifications();

        return {
            close: () => this.close(notification),
            element: notification.element
        };
    }

    /**
     * Create notification element
     * @param {string} message - Message text
     * @param {string} type - Notification type
     * @param {NotificationOptions} options - Options
     * @returns {Object} Notification object
     */
    createNotification(message, type, options) {
        const notification = {
            id: Date.now() + Math.random(),
            type,
            message,
            options,
            element: null,
            timeout: null
        };

        // Create element
        const element = document.createElement('div');
        element.className = `notification notification-${type} notification-enter`;
        element.setAttribute('role', type === 'error' ? 'alert' : 'status');
        element.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');

        // Icon
        const icon = document.createElement('span');
        icon.className = 'notification-icon';
        icon.setAttribute('aria-hidden', 'true');
        icon.textContent = this.getIcon(type);

        // Message
        const messageEl = document.createElement('span');
        messageEl.className = 'notification-message';
        messageEl.textContent = message;

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'notification-close';
        closeBtn.setAttribute('aria-label', 'Close notification');
        closeBtn.textContent = '×';
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.close(notification);
        });

        // Assemble
        element.appendChild(icon);
        element.appendChild(messageEl);

        if (options.closable !== false) {
            element.appendChild(closeBtn);
        }

        // Click handler
        if (options.onClick) {
            element.style.cursor = 'pointer';
            element.addEventListener('click', () => {
                options.onClick();
                this.close(notification);
            });
        }

        notification.element = element;

        // Trigger enter animation
        requestAnimationFrame(() => {
            element.classList.remove('notification-enter');
            element.classList.add('notification-visible');
        });

        return notification;
    }

    /**
     * Add notification to container
     * @param {Object} notification - Notification object
     */
    addToContainer(notification) {
        this.notifications.push(notification);
        this.container.appendChild(notification.element);
    }

    /**
     * Close a notification
     * @param {Object} notification - Notification to close
     */
    close(notification) {
        if (!notification || !notification.element) return;

        // Clear timeout
        if (notification.timeout) {
            clearTimeout(notification.timeout);
        }

        // Trigger exit animation
        notification.element.classList.remove('notification-visible');
        notification.element.classList.add('notification-exit');

        // Remove after animation
        setTimeout(() => {
            if (notification.element && notification.element.parentNode) {
                notification.element.parentNode.removeChild(notification.element);
            }

            // Remove from array
            const index = this.notifications.indexOf(notification);
            if (index > -1) {
                this.notifications.splice(index, 1);
            }

            // Call onClose callback
            if (notification.options.onClose) {
                notification.options.onClose();
            }
        }, this.config.ANIMATION_DURATION);
    }

    /**
     * Limit number of visible notifications
     */
    limitVisibleNotifications() {
        if (this.notifications.length > this.config.MAX_VISIBLE) {
            const toRemove = this.notifications.length - this.config.MAX_VISIBLE;
            for (let i = 0; i < toRemove; i++) {
                this.close(this.notifications[0]);
            }
        }
    }

    /**
     * Close all notifications
     */
    closeAll() {
        // Create copy to avoid mutation during iteration
        const notificationsCopy = [...this.notifications];
        notificationsCopy.forEach(notification => this.close(notification));
    }

    /**
     * Get icon for notification type
     * @param {string} type - Notification type
     * @returns {string} Icon character
     */
    getIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }

    /**
     * Show success notification
     * @param {string} message - Success message
     * @param {NotificationOptions} options - Additional options
     * @returns {Object} Notification instance
     */
    success(message, options = {}) {
        return this.show(message, 'success', options);
    }

    /**
     * Show error notification
     * @param {string} message - Error message
     * @param {NotificationOptions} options - Additional options
     * @returns {Object} Notification instance
     */
    error(message, options = {}) {
        return this.show(message, 'error', options);
    }

    /**
     * Show warning notification
     * @param {string} message - Warning message
     * @param {NotificationOptions} options - Additional options
     * @returns {Object} Notification instance
     */
    warning(message, options = {}) {
        return this.show(message, 'warning', options);
    }

    /**
     * Show info notification
     * @param {string} message - Info message
     * @param {NotificationOptions} options - Additional options
     * @returns {Object} Notification instance
     */
    info(message, options = {}) {
        return this.show(message, 'info', options);
    }
}

// Export singleton instance
export const notificationManager = new NotificationManager();

// Export convenience functions
export const showNotification = (message, type, options) => notificationManager.show(message, type, options);
export const showSuccess = (message, options) => notificationManager.success(message, options);
export const showError = (message, options) => notificationManager.error(message, options);
export const showWarning = (message, options) => notificationManager.warning(message, options);
export const showInfo = (message, options) => notificationManager.info(message, options);
export const closeAllNotifications = () => notificationManager.closeAll();

export default notificationManager;
