/**
 * UX Components JavaScript
 * Interactive functionality for improved UX components
 */

import { trackEvent } from '../utils/analytics.js';

/**
 * Mobile Navigation Toggle
 */
export function initMobileNav() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (toggle && navLinks) {
        // Create backdrop overlay for mobile menu
        const backdrop = document.createElement('div');
        backdrop.className = 'mobile-nav-backdrop';
        backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
            z-index: 998;
        `;
        document.body.appendChild(backdrop);

        const toggleMenu = (open) => {
            if (open) {
                navLinks.classList.add('active');
                backdrop.style.opacity = '1';
                backdrop.style.pointerEvents = 'all';
                document.body.style.overflow = 'hidden'; // Prevent body scroll
                toggle.setAttribute('aria-expanded', 'true');
                toggle.textContent = '✕';
                trackEvent('mobile_menu_toggle', { action: 'open' });
            } else {
                navLinks.classList.remove('active');
                backdrop.style.opacity = '0';
                backdrop.style.pointerEvents = 'none';
                document.body.style.overflow = ''; // Restore body scroll
                toggle.setAttribute('aria-expanded', 'false');
                toggle.textContent = '☰';
                trackEvent('mobile_menu_toggle', { action: 'close' });
            }
        };

        toggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.contains('active');
            toggleMenu(!isOpen);
        });

        // Close menu when clicking backdrop
        backdrop.addEventListener('click', () => {
            toggleMenu(false);
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
                toggleMenu(false);
            }
        });

        // Close menu when clicking on a nav link
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                toggleMenu(false);
            });
        });

        // Close menu with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                toggleMenu(false);
            }
        });
    }
}

/**
 * Progress Steps Management
 */
export class ProgressSteps {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.steps = this.container ? this.container.querySelectorAll('.step') : [];
        this.currentStep = 0;
    }

    setStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= this.steps.length) return;

        this.currentStep = stepIndex;
        this.updateSteps();

        trackEvent('progress_step_changed', { step: stepIndex + 1 });
    }

    nextStep() {
        if (this.currentStep < this.steps.length - 1) {
            this.setStep(this.currentStep + 1);
        }
    }

    prevStep() {
        if (this.currentStep > 0) {
            this.setStep(this.currentStep - 1);
        }
    }

    completeStep(stepIndex) {
        if (stepIndex >= 0 && stepIndex < this.steps.length) {
            this.steps[stepIndex].classList.add('completed');

            // Update connector
            const connectors = this.container.querySelectorAll('.step-connector');
            if (stepIndex < connectors.length) {
                connectors[stepIndex].classList.add('completed');
            }
        }
    }

    updateSteps() {
        this.steps.forEach((step, index) => {
            if (index < this.currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (index === this.currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });

        // Update connectors
        const connectors = this.container.querySelectorAll('.step-connector');
        connectors.forEach((connector, index) => {
            if (index < this.currentStep) {
                connector.classList.add('completed');
            } else {
                connector.classList.remove('completed');
            }
        });
    }
}

/**
 * Workflow Selector
 */
export function initWorkflowSelector() {
    const workflowCards = document.querySelectorAll('.workflow-card');

    workflowCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking on a button inside
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') return;

            const button = card.querySelector('button, a');
            if (button) {
                button.click();
            }
        });

        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const button = card.querySelector('button, a');
                if (button) {
                    button.click();
                }
            }
        });

        // Track workflow selection
        const button = card.querySelector('button, a');
        if (button) {
            button.addEventListener('click', () => {
                const workflowType = card.classList.contains('featured') ? 'photo_editor' : 'photo_maker';
                trackEvent('workflow_selected', { workflow: workflowType });
            });
        }
    });
}

/**
 * Editor Banner Management
 */
export function initEditorBanner() {
    const banner = document.querySelector('.editor-banner');
    if (!banner) return;

    // Track banner view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                trackEvent('editor_banner_viewed');
                observer.disconnect();
            }
        });
    }, { threshold: 0.5 });

    observer.observe(banner);

    // Track banner clicks
    const cta = banner.querySelector('.banner-cta');
    if (cta) {
        cta.addEventListener('click', () => {
            trackEvent('editor_banner_clicked');
        });
    }
}

/**
 * Tooltip Enhancement
 */
export function initTooltips() {
    const helpIcons = document.querySelectorAll('.help-icon[data-tooltip]');

    helpIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            trackEvent('tooltip_viewed', {
                tooltip: icon.dataset.tooltip.substring(0, 50)
            });
        });
    });
}

/**
 * Sticky Navigation Enhancement
 */
export function initStickyNav() {
    const nav = document.querySelector('.main-nav');
    if (!nav) return;

    let lastScroll = 0;
    const scrollThreshold = 100;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > scrollThreshold) {
            nav.style.boxShadow = '0 4px 12px var(--shadow-md)';
        } else {
            nav.style.boxShadow = '0 2px 8px var(--shadow)';
        }

        lastScroll = currentScroll;
    });
}

/**
 * Initialize all UX components
 */
export function initUXComponents() {
    initMobileNav();
    initWorkflowSelector();
    initEditorBanner();
    initTooltips();
    initStickyNav();

    // Make available globally for debugging
    if (typeof window !== 'undefined') {
        window.UXComponents = {
            ProgressSteps
        };
    }
}

// Auto-initialize
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUXComponents);
    } else {
        initUXComponents();
    }
}
