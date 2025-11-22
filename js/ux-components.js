/**
 * UX Components JavaScript
 * Interactive functionality for improved UX components
 */

import { trackEvent } from './analytics.js';

/**
 * Mobile Navigation Toggle
 */
export function initMobileNav() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const isOpen = navLinks.classList.contains('active');
            toggle.setAttribute('aria-expanded', isOpen);
            toggle.textContent = isOpen ? '✕' : '☰';

            trackEvent('mobile_menu_toggle', { action: isOpen ? 'open' : 'close' });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
                toggle.textContent = '☰';
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
 * Onboarding Modal
 */
export class OnboardingModal {
    constructor() {
        this.overlay = null;
        this.hasShown = localStorage.getItem('onboarding_shown') === 'true';
    }

    show() {
        if (this.hasShown) return;

        this.create();
        setTimeout(() => {
            this.overlay.classList.add('active');
        }, 500);

        trackEvent('onboarding_shown');
    }

    hide() {
        if (this.overlay) {
            this.overlay.classList.remove('active');
            setTimeout(() => {
                this.overlay.remove();
                this.overlay = null;
            }, 300);

            localStorage.setItem('onboarding_shown', 'true');
            this.hasShown = true;
        }

        trackEvent('onboarding_dismissed');
    }

    create() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'onboarding-overlay';
        this.overlay.innerHTML = `
            <div class="onboarding-modal" role="dialog" aria-modal="true" aria-labelledby="onboarding-title">
                <h2 id="onboarding-title">Welcome to Photo Sheet Maker! 👋</h2>

                <div class="onboarding-steps">
                    <div class="onboarding-step">
                        <div class="onboarding-step-number">1</div>
                        <div class="onboarding-step-content">
                            <h3>Upload Your Photo</h3>
                            <p>Have a 2×2" passport photo ready? Upload it directly.</p>
                        </div>
                    </div>

                    <div class="onboarding-step">
                        <div class="onboarding-step-number">2</div>
                        <div class="onboarding-step-content">
                            <h3>Choose Print Size</h3>
                            <p>Select 4×6", 5×7", or 8×10" based on your printer.</p>
                        </div>
                    </div>

                    <div class="onboarding-step">
                        <div class="onboarding-step-number">3</div>
                        <div class="onboarding-step-content">
                            <h3>Download & Print</h3>
                            <p>Get your photo sheet and print at any photo service.</p>
                        </div>
                    </div>
                </div>

                <div class="alert alert-info" style="margin: var(--spacing-lg) 0;">
                    <strong>💡 Pro Tip:</strong> Don't have a photo ready?
                    Use our <a href="photo-editor.html" style="color: var(--primary-color); font-weight: 600;">Photo Editor</a>
                    to crop, resize, or remove backgrounds first!
                </div>

                <div class="onboarding-actions">
                    <button class="btn btn-outline" onclick="this.closest('.onboarding-overlay').dispatchEvent(new Event('close'))">
                        Skip for Now
                    </button>
                    <button class="btn" onclick="this.closest('.onboarding-overlay').dispatchEvent(new Event('close'))">
                        Get Started
                    </button>
                </div>
            </div>
        `;

        // Close on overlay click
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.hide();
            }
        });

        // Close event
        this.overlay.addEventListener('close', () => {
            this.hide();
        });

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.overlay) {
                this.hide();
            }
        });

        document.body.appendChild(this.overlay);
    }

    reset() {
        localStorage.removeItem('onboarding_shown');
        this.hasShown = false;
    }
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

    // Show onboarding for first-time users
    const onboarding = new OnboardingModal();
    onboarding.show();

    // Make available globally for debugging
    if (typeof window !== 'undefined') {
        window.UXComponents = {
            ProgressSteps,
            OnboardingModal,
            resetOnboarding: () => {
                localStorage.removeItem('onboarding_shown');
                location.reload();
            }
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
