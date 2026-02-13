# Style Guide & Component Documentation
**Project:** Passport Photo Sheet Maker
**Version:** 2.0
**Last Updated:** 2025-01-23
**Architecture:** BEM (Block Element Modifier)

---

## Table of Contents

1. [Design System](#1-design-system)
2. [BEM Naming Convention](#2-bem-naming-convention)
3. [Component Library](#3-component-library)
4. [Layout Patterns](#4-layout-patterns)
5. [Utility Classes](#5-utility-classes)
6. [Testing Attributes](#6-testing-attributes)
7. [Accessibility Guidelines](#7-accessibility-guidelines)
8. [Code Examples](#8-code-examples)
9. [Best Practices](#9-best-practices)

---

## 1. Design System

### CSS Custom Properties

Our design system is built on CSS custom properties for consistency and easy theming.

#### Colors

```css
:root {
    /* Primary Colors */
    --primary-color: #007AFF;
    --primary-hover: #0051D5;
    --secondary-color: #5856D6;
    --accent-color: #FF2D55;

    /* Semantic Colors */
    --success-color: #34C759;
    --warning-color: #FF9500;
    --danger-color: #FF3B30;

    /* Text Colors */
    --text-primary: #1D1D1F;
    --text-secondary: #86868B;

    /* Surface Colors */
    --background: #FFFFFF;
    --surface: #FFFFFF;
    --border: #D2D2D7;

    /* Shadows */
    --shadow: rgba(0, 0, 0, 0.08);
    --shadow-md: rgba(0, 0, 0, 0.12);
    --shadow-lg: rgba(0, 0, 0, 0.16);
}
```

**Usage:**
```css
.my-component {
    color: var(--primary-color);
    background: var(--surface);
    box-shadow: 0 4px 12px var(--shadow-md);
}
```

#### Spacing

```css
:root {
    --spacing-xs: 8px;
    --spacing-sm: 12px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
    --spacing-2xl: 48px;
    --spacing-3xl: 64px;
    --spacing-4xl: 96px;
}
```

**Scale:** 8px base unit (xs → 4xl)

**Usage:**
```css
.my-component {
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
    gap: var(--spacing-md);
}
```

#### Border Radius

```css
:root {
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 20px;
    --radius-xl: 24px;
}
```

**Usage:**
```css
.my-component {
    border-radius: var(--radius-lg);
}
```

#### Typography

```css
:root {
    --font-system: -apple-system, BlinkMacSystemFont, 'SF Pro Display',
                    'SF Pro Text', 'Segoe UI', 'Roboto', 'Helvetica Neue',
                    Arial, sans-serif;
}
```

**Font Sizes:**
- Headings: `clamp()` responsive sizes
- Body: 16px base
- Small: 14px
- Tiny: 13px

#### Transitions

```css
:root {
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-smooth: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
```

**Standard:** 0.3s ease-out
**Smooth:** 0.6s ease-out (for hero animations)

---

## 2. BEM Naming Convention

### Prefix System

We use a 3-prefix system for clarity:

| Prefix | Purpose | Example |
|--------|---------|---------|
| `c-` | Component | `.c-button`, `.c-nav` |
| `l-` | Layout | `.l-container`, `.l-grid` |
| `u-` | Utility | `.u-visually-hidden` |

### BEM Structure

```
.{prefix}-{block}                    Block
.{prefix}-{block}__{element}         Element
.{prefix}-{block}--{modifier}        Modifier
```

### State Classes

State classes don't use prefixes:

```
.is-{state}    Current state    .is-active, .is-loading
.has-{state}   Has something    .has-image, .has-error
```

### Examples

#### ✅ Correct:
```html
<!-- Block -->
<nav class="c-nav">
    <!-- Element -->
    <div class="c-nav__container">
        <!-- Element with modifier -->
        <a class="c-nav__link c-nav__link--active">Home</a>
        <!-- Element with state -->
        <a class="c-nav__link is-disabled">Settings</a>
    </div>
</nav>
```

#### ❌ Incorrect:
```html
<!-- Don't nest elements -->
<nav class="c-nav">
    <div class="c-nav__container">
        <!-- Wrong: c-nav__container__link -->
        <a class="c-nav__container__link">Home</a>
    </div>
</nav>

<!-- Don't use modifiers alone -->
<button class="c-button--primary">Click</button>
<!-- Correct: -->
<button class="c-button c-button--primary">Click</button>
```

---

## 3. Component Library

### 3.1 Navigation Component

**Block:** `.c-nav`

**Purpose:** Sticky navigation header with logo, links, and language selector

**HTML:**
```html
<nav class="c-nav"
     role="navigation"
     aria-label="Main navigation"
     data-testid="main-nav">
    <div class="c-nav__container">
        <!-- Logo -->
        <a href="index.html"
           class="c-nav__logo"
           aria-label="Home">
            <div class="c-nav__icon">
                <div class="c-nav__icon-body">
                    <div class="c-nav__icon-lens">
                        <div class="c-nav__icon-lens-inner">
                            <div class="c-nav__icon-lens-glare"></div>
                        </div>
                    </div>
                    <div class="c-nav__icon-flash"></div>
                    <div class="c-nav__icon-viewfinder"></div>
                </div>
            </div>
            <span class="c-nav__logo-text">Photo Sheet Maker</span>
        </a>

        <!-- Links -->
        <div class="c-nav__links">
            <a href="index.html"
               class="c-nav__link c-nav__link--active"
               aria-current="page">
                Photo Maker
            </a>
            <a href="photo-editor.html"
               class="c-nav__link c-nav__link--featured">
                ✂️ Photo Editor
            </a>
            <a href="faq.html" class="c-nav__link">Help</a>
        </div>

        <!-- Language Selector -->
        <select class="c-nav__language"
                aria-label="Select language">
            <option value="en">🇺🇸 English</option>
            <option value="es">🇪🇸 Español</option>
        </select>

        <!-- Mobile Toggle -->
        <button class="c-nav__toggle"
                aria-label="Toggle mobile menu"
                aria-expanded="false">
            ☰
        </button>
    </div>
</nav>
```

**Elements:**
- `.c-nav__container` - Inner container (max-width)
- `.c-nav__logo` - Logo link with icon
- `.c-nav__icon` - Camera icon wrapper
- `.c-nav__icon-*` - Icon sub-elements
- `.c-nav__links` - Navigation links container
- `.c-nav__link` - Individual nav link
- `.c-nav__language` - Language selector dropdown
- `.c-nav__toggle` - Mobile menu toggle

**Modifiers:**
- `.c-nav__link--active` - Active/current page
- `.c-nav__link--featured` - Featured link with gradient

**States:**
- `.c-nav__links.is-active` - Mobile menu open

---

### 3.2 Button Component

**Block:** `.c-button`

**Purpose:** Interactive buttons with consistent styling

**HTML:**
```html
<!-- Primary Button -->
<button type="button"
        class="c-button c-button--primary"
        data-testid="primary-button">
    <span class="c-button__icon">⬇️</span>
    <span class="c-button__text">Download</span>
</button>

<!-- Secondary Button -->
<button type="button"
        class="c-button c-button--secondary"
        data-testid="secondary-button">
    <span class="c-button__icon">↻</span>
    <span class="c-button__text">Reset</span>
</button>

<!-- Demo Button -->
<button type="button"
        class="c-button c-button--demo"
        data-testid="demo-button">
    <span class="c-button__text">🎨 Try Demo</span>
</button>

<!-- Disabled Button -->
<button type="button"
        class="c-button c-button--primary"
        disabled
        data-testid="disabled-button">
    <span class="c-button__text">Disabled</span>
</button>
```

**Elements:**
- `.c-button__icon` - Optional icon (emoji or SVG)
- `.c-button__text` - Button text content

**Modifiers:**
- `.c-button--primary` - Primary action (blue gradient)
- `.c-button--secondary` - Secondary action (white with border)
- `.c-button--demo` - Special featured button (purple gradient)

**States:**
- `:hover` - Lift and shadow effect
- `:active` - Pressed state
- `:disabled` - Greyed out, no hover effect

**CSS:**
```css
.c-button {
    padding: 18px 32px;
    border: none;
    border-radius: var(--radius-md);
    font-size: 17px;
    font-weight: 700;
    cursor: pointer;
    transition: var(--transition);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
}

.c-button--primary {
    background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%);
    color: white;
    box-shadow: 0 4px 16px rgba(0, 122, 255, 0.4);
}

.c-button--primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 122, 255, 0.5);
}
```

---

### 3.3 Form Components

**Block:** `.c-form`

**Purpose:** Form inputs, labels, and groups

**HTML:**
```html
<form class="c-form c-form--stack">
    <!-- Form Group -->
    <div class="c-form__group">
        <label for="paperSize" class="c-form__label">
            Sheet Size
        </label>
        <select id="paperSize"
                class="c-form__select"
                aria-label="Select print sheet size">
            <option value="4x6">Standard 4×6" Print</option>
            <option value="5x7">Medium 5×7" Print</option>
            <option value="8x10">Large 8×10" Print ⭐</option>
        </select>
        <div class="c-form__hint">
            Choose the print size you want to order
        </div>
    </div>
</form>
```

**Elements:**
- `.c-form__group` - Groups label + input + hint
- `.c-form__label` - Form label (bold, semantic)
- `.c-form__select` - Styled select dropdown
- `.c-form__input` - Text/number input field
- `.c-form__hint` - Helper text below input

**Modifiers:**
- `.c-form--stack` - Vertical stacking layout

**CSS:**
```css
.c-form__select {
    padding: 16px 18px;
    border: 2px solid var(--border);
    border-radius: var(--radius-md);
    font-size: 16px;
    background: var(--surface);
    cursor: pointer;
    transition: var(--transition);
}

.c-form__select:hover {
    border-color: var(--primary-color);
}

.c-form__select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.12);
}
```

---

### 3.4 Card Components

#### Feature Card

**Block:** `.c-feature-card`

**Purpose:** Showcase features with icon, title, description

**HTML:**
```html
<div class="c-feature-card" data-testid="feature-card">
    <div class="c-feature-card__icon">
        <svg><!-- icon SVG --></svg>
    </div>
    <h3 class="c-feature-card__title">Upload Your Photo</h3>
    <p class="c-feature-card__description">
        Simply upload your 2×2 inch passport photo.
        Works with JPG and PNG formats.
    </p>
</div>
```

#### Workflow Card

**Block:** `.c-workflow-card`

**Purpose:** Large interactive cards for workflow selection

**HTML:**
```html
<!-- Upload Card -->
<div class="c-workflow-card c-workflow-card--upload"
     tabindex="0"
     aria-label="Upload ready photo">
    <!-- Upload UI inserted here -->
</div>

<!-- Featured Card -->
<div class="c-workflow-card c-workflow-card--featured"
     tabindex="0"
     role="button">
    <div class="c-workflow-card__icon">✂️</div>
    <h3 class="c-workflow-card__title">
        I Need to Edit a Photo
    </h3>
    <p class="c-workflow-card__description">
        Crop, resize, or rotate first
    </p>
    <a href="photo-editor.html"
       class="c-button c-button--primary">
        Open Photo Editor
    </a>
</div>
```

**Modifiers:**
- `.c-workflow-card--upload` - Upload variant (no padding)
- `.c-workflow-card--featured` - Purple gradient with badge

#### Stat Card

**Block:** `.c-stat-card`

**Purpose:** Display statistics with large number

**HTML:**
```html
<div class="c-stat-card" data-testid="stat-card">
    <span class="c-stat-card__value">20</span>
    <span class="c-stat-card__label">Photos Included</span>
</div>
```

#### Info Banner

**Block:** `.c-info-banner`

**Purpose:** Informational content with icon and list

**HTML:**
```html
<div class="c-info-banner"
     role="complementary"
     aria-label="Quick start guide">
    <h2 class="c-info-banner__title">
        <span aria-hidden="true">💡</span>
        Why Use Photo Sheet Maker?
    </h2>
    <ul class="c-info-banner__list">
        <li>Upload your 2×2 inch passport photo</li>
        <li>Arrange multiple copies on one sheet</li>
        <li>Download and print anywhere</li>
    </ul>
</div>
```

---

### 3.5 Upload Component

**Block:** `.c-upload`

**Purpose:** Drag-and-drop file upload area

**HTML:**
```html
<div class="c-upload"
     id="uploadArea"
     role="button"
     tabindex="0"
     aria-label="Upload photo">
    <div class="c-upload__icon" aria-hidden="true">📷</div>
    <div class="c-upload__text">Choose Your Photo</div>
    <div class="c-upload__hint">
        Click here or drag and drop your 2×2" photo
    </div>
    <div class="c-upload__success">
        ✓ Photo uploaded successfully!
    </div>
    <input type="file"
           id="fileInput"
           class="c-upload__input"
           accept="image/*"
           aria-label="Upload photo file">
</div>
```

**Elements:**
- `.c-upload__icon` - Large emoji/icon
- `.c-upload__text` - Main call-to-action
- `.c-upload__hint` - Helper text
- `.c-upload__success` - Success message (hidden by default)
- `.c-upload__input` - Hidden file input

**States:**
- `.c-upload.is-dragover` - During drag hover (green border)
- `.c-upload.has-image` - After successful upload (green background)

**CSS:**
```css
.c-upload {
    border: 2px dashed var(--border);
    border-radius: var(--radius-xl);
    padding: var(--spacing-2xl);
    text-align: center;
    cursor: pointer;
    transition: var(--transition-smooth);
    min-height: 280px;
}

.c-upload:hover {
    border-color: var(--primary-color);
    transform: scale(1.01);
}

.c-upload.is-dragover {
    border-color: var(--primary-color);
    background: rgba(0, 122, 255, 0.05);
    transform: scale(1.02);
}

.c-upload.has-image {
    border-color: var(--success-color);
    background: rgba(52, 199, 89, 0.05);
    border-style: solid;
}
```

---

## 4. Layout Patterns

### 4.1 Container

**Class:** `.l-container`

**Purpose:** Max-width content wrapper

```html
<div class="l-container">
    <!-- Content -->
</div>
```

**CSS:**
```css
.l-container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 var(--spacing-lg);
}
```

---

### 4.2 Feature Grid

**Class:** `.l-feature-grid`

**Purpose:** Responsive grid for feature cards

```html
<section class="l-feature-grid">
    <div class="c-feature-card">...</div>
    <div class="c-feature-card">...</div>
    <div class="c-feature-card">...</div>
</section>
```

**CSS:**
```css
.l-feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--spacing-xl);
}
```

---

### 4.3 Customize & Preview Layout

**Class:** `.l-customize-preview`

**Purpose:** Two-column layout for options + preview

```html
<div class="l-customize-preview">
    <!-- Left: Options -->
    <div class="customize-panel">
        <form>...</form>
    </div>

    <!-- Right: Preview -->
    <div class="preview-panel">
        <canvas id="canvas"></canvas>
    </div>
</div>
```

**CSS:**
```css
.l-customize-preview {
    display: grid;
    grid-template-columns: 380px 1fr;
    gap: var(--spacing-3xl);
    align-items: start;
}

@media (max-width: 1024px) {
    .l-customize-preview {
        grid-template-columns: 1fr;
    }
}
```

---

### 4.4 Button Group

**Class:** `.l-button-group`

**Purpose:** Horizontal button layout

```html
<div class="l-button-group">
    <button class="c-button c-button--primary">Download</button>
    <button class="c-button c-button--secondary">Reset</button>
</div>
```

**CSS:**
```css
.l-button-group {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: var(--spacing-md);
}
```

---

## 5. Utility Classes

### 5.1 Visually Hidden

**Class:** `.u-visually-hidden`

**Purpose:** Hide content visually but keep for screen readers

```html
<div class="u-visually-hidden">
    This text is hidden but announced by screen readers
</div>
```

**CSS:**
```css
.u-visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
```

---

## 6. Testing Attributes

### Attribute Patterns

We use data attributes for testing and debugging:

```html
<!-- Component identification -->
<nav data-testid="main-nav"
     data-component="navigation">

<!-- Element identification -->
<a data-testid="nav-link-home"
   data-action="navigate-home">

<!-- State tracking -->
<a data-state="active">

<!-- Variant identification -->
<button data-variant="primary">

<!-- Layout identification -->
<div data-layout="container">
```

### Naming Convention

| Attribute | Purpose | Format |
|-----------|---------|--------|
| `data-testid` | E2E testing | `{component}-{element}-{variant}` |
| `data-component` | Component type | `{component-name}` |
| `data-variant` | Style variant | `{variant-name}` |
| `data-action` | User action | `{action-description}` |
| `data-state` | Current state | `{state-value}` |
| `data-layout` | Layout type | `{layout-type}` |

### Examples

```html
<!-- Navigation Link -->
<a href="index.html"
   class="c-nav__link c-nav__link--active"
   aria-current="page"
   data-testid="nav-link-home"
   data-state="active">
    Home
</a>

<!-- Button -->
<button type="button"
        class="c-button c-button--primary"
        data-testid="download-button"
        data-component="button"
        data-variant="primary"
        data-action="download">
    Download
</button>

<!-- Form Select -->
<select id="paperSize"
        class="c-form__select"
        data-testid="form-select-size"
        data-component="select"
        data-field="paperSize">
    <option value="4x6">4×6"</option>
</select>
```

---

## 7. Accessibility Guidelines

### 7.1 Semantic HTML

**Always use semantic HTML elements:**

```html
<!-- ✅ Correct -->
<nav role="navigation" aria-label="Main navigation">
<main id="main-content">
<header role="banner">
<footer role="contentinfo">
<button type="button">Click</button>

<!-- ❌ Avoid -->
<div class="nav">
<div class="main">
<span onclick="...">Click</span>
```

### 7.2 ARIA Attributes

**Required ARIA attributes:**

```html
<!-- Navigation -->
<nav role="navigation" aria-label="Main navigation">

<!-- Skip Link -->
<a href="#main-content" class="c-skip-link">
    Skip to main content
</a>

<!-- Live Region -->
<div id="ariaLiveRegion"
     role="status"
     aria-live="polite"
     aria-atomic="true"
     class="u-visually-hidden">
</div>

<!-- Buttons -->
<button aria-label="Close modal" aria-expanded="false">

<!-- Form Controls -->
<select aria-label="Select language">
<input aria-label="Enter your name">

<!-- Current Page -->
<a aria-current="page">Home</a>
```

### 7.3 Keyboard Navigation

**All interactive elements must be keyboard accessible:**

```html
<!-- Focusable with Tab -->
<button type="button">Click</button>
<a href="page.html">Link</a>

<!-- Custom interactive elements -->
<div tabindex="0" role="button" aria-label="Upload">
    Click to upload
</div>
```

**Keyboard shortcuts:**
- `Tab` - Navigate forward
- `Shift+Tab` - Navigate backward
- `Enter` or `Space` - Activate button/link
- `Escape` - Cancel/close modal

### 7.4 Focus Styles

**All focusable elements have visible focus indicators:**

```css
*:focus-visible {
    outline: 3px solid var(--primary-color);
    outline-offset: 3px;
    border-radius: 4px;
}

/* High contrast mode */
@media (prefers-contrast: high) {
    *:focus-visible {
        outline-width: 4px !important;
        outline-offset: 2px !important;
    }
}
```

### 7.5 Screen Reader Announcements

**Use ARIA live regions for dynamic updates:**

```javascript
// Announce to screen readers
function announceToScreenReader(message) {
    const liveRegion = document.getElementById('ariaLiveRegion');
    if (liveRegion) {
        liveRegion.textContent = '';
        setTimeout(() => {
            liveRegion.textContent = message;
        }, 100);
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 3000);
    }
}

// Usage
announceToScreenReader('Photo uploaded successfully!');
```

### 7.6 Color Contrast

**All text meets WCAG AA contrast requirements:**

- Normal text: 4.5:1 minimum
- Large text (18px+): 3:1 minimum
- Interactive elements: 3:1 minimum

**Test with:**
- Chrome DevTools (Lighthouse)
- WAVE browser extension
- Contrast Checker tools

### 7.7 Alternative Text

**All images have descriptive alt text:**

```html
<!-- Decorative images -->
<img src="icon.svg" alt="" aria-hidden="true">

<!-- Informative images -->
<img src="diagram.png" alt="Workflow diagram showing 3 steps">

<!-- Complex images -->
<img src="chart.png"
     alt="Bar chart showing sales increase"
     aria-describedby="chart-details">
<div id="chart-details" class="u-visually-hidden">
    Detailed description of chart data...
</div>
```

---

## 8. Code Examples

### 8.1 Creating a New Component

**Step 1: Define HTML structure**

```html
<!-- Block -->
<div class="c-alert" role="alert" data-testid="alert">
    <!-- Elements -->
    <div class="c-alert__icon">⚠️</div>
    <div class="c-alert__content">
        <h3 class="c-alert__title">Warning</h3>
        <p class="c-alert__message">This action cannot be undone.</p>
    </div>
    <button class="c-alert__close" aria-label="Close alert">×</button>
</div>
```

**Step 2: Add CSS**

```css
/* Block */
.c-alert {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
    background: var(--surface);
    border-radius: var(--radius-md);
    border-left: 4px solid var(--warning-color);
    box-shadow: 0 4px 12px var(--shadow);
}

/* Elements */
.c-alert__icon {
    font-size: 24px;
    flex-shrink: 0;
}

.c-alert__content {
    flex: 1;
}

.c-alert__title {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: var(--spacing-xs);
}

.c-alert__message {
    font-size: 15px;
    color: var(--text-secondary);
}

.c-alert__close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    color: var(--text-secondary);
}

.c-alert__close:hover {
    color: var(--text-primary);
}

/* Modifiers */
.c-alert--success {
    border-left-color: var(--success-color);
}

.c-alert--error {
    border-left-color: var(--danger-color);
}
```

**Step 3: Add JavaScript (if needed)**

```javascript
// Initialize alert close buttons
document.querySelectorAll('.c-alert__close').forEach(button => {
    button.addEventListener('click', (e) => {
        const alert = e.target.closest('.c-alert');
        alert.style.display = 'none';
        announceToScreenReader('Alert dismissed');
    });
});
```

### 8.2 Responsive Component

```html
<div class="c-card-grid">
    <div class="c-card">Card 1</div>
    <div class="c-card">Card 2</div>
    <div class="c-card">Card 3</div>
</div>
```

```css
.c-card-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-lg);
}

/* Tablet */
@media (max-width: 1024px) {
    .c-card-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* Mobile */
@media (max-width: 768px) {
    .c-card-grid {
        grid-template-columns: 1fr;
    }
}
```

### 8.3 Interactive Component with States

```html
<button class="c-toggle"
        data-testid="toggle"
        aria-pressed="false">
    <span class="c-toggle__label">Enable Feature</span>
    <span class="c-toggle__switch"></span>
</button>
```

```css
.c-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background: var(--surface);
    border: 2px solid var(--border);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: var(--transition);
}

.c-toggle[aria-pressed="true"] {
    background: rgba(0, 122, 255, 0.1);
    border-color: var(--primary-color);
}

.c-toggle__switch {
    width: 48px;
    height: 28px;
    background: var(--border);
    border-radius: 14px;
    position: relative;
    transition: var(--transition);
}

.c-toggle__switch::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 24px;
    height: 24px;
    background: white;
    border-radius: 50%;
    transition: var(--transition);
}

.c-toggle[aria-pressed="true"] .c-toggle__switch {
    background: var(--primary-color);
}

.c-toggle[aria-pressed="true"] .c-toggle__switch::before {
    transform: translateX(20px);
}
```

```javascript
document.querySelectorAll('.c-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
        const isPressed = toggle.getAttribute('aria-pressed') === 'true';
        toggle.setAttribute('aria-pressed', !isPressed);
        announceToScreenReader(
            isPressed ? 'Feature disabled' : 'Feature enabled'
        );
    });
});
```

---

## 9. Best Practices

### 9.1 Component Design

**✅ DO:**
- Keep components small and focused
- Use semantic HTML
- Follow BEM naming consistently
- Add ARIA attributes for accessibility
- Include testing attributes
- Document component usage
- Support keyboard navigation
- Provide visual feedback for states

**❌ DON'T:**
- Nest BEM elements (no `__element__element`)
- Use modifiers alone (always include base class)
- Override component styles from outside
- Use !important unless absolutely necessary
- Create deep CSS specificity
- Forget mobile responsive styles
- Ignore accessibility requirements

### 9.2 CSS Organization

**File structure:**
```
css/
├── common.css          (Base styles, variables, utilities)
├── components.css      (All component styles)
├── ux-components.css   (UX-specific components)
└── sticky-scroll.css   (Feature-specific styles)
```

**Order within CSS file:**
1. Variables
2. Base/reset styles
3. Layout classes (l-)
4. Component blocks (c-)
5. Utility classes (u-)
6. State classes (is-, has-)
7. Media queries
8. Print styles

### 9.3 JavaScript Integration

**✅ DO:**
```javascript
// Use semantic selectors
const button = document.getElementById('downloadBtn');
const nav = document.querySelector('.c-nav');

// Add classes for state changes
element.classList.add('is-active');
element.classList.remove('is-loading');

// Update ARIA attributes
button.setAttribute('aria-pressed', 'true');

// Announce changes to screen readers
announceToScreenReader('Action completed successfully');
```

**❌ DON'T:**
```javascript
// Don't manipulate styles directly
element.style.display = 'none'; // Use classes instead

// Don't create style strings
element.style.cssText = 'color: red; font-size: 20px;';

// Don't forget accessibility
button.click(); // Also update aria-pressed

// Don't skip announcements
// Always inform screen reader users of changes
```

### 9.4 Performance

**Optimize:**
- Use CSS transforms for animations (GPU accelerated)
- Debounce resize/scroll events
- Minimize reflows and repaints
- Load images lazily
- Use CSS containment where applicable

```css
/* Good for performance */
.c-button:hover {
    transform: translateY(-2px); /* GPU accelerated */
}

/* Avoid if possible */
.c-button:hover {
    top: -2px; /* Causes reflow */
}
```

### 9.5 Maintainability

**Code comments:**
```css
/* ============================================
   COMPONENT NAME (BEM)
   ============================================ */

/* Block: Component Name */
.c-component {
    /* Base styles */
}

/* Element: Sub-element */
.c-component__element {
    /* Element styles */
}

/* Modifier: Variation */
.c-component--modifier {
    /* Modifier styles */
}

/* State: Dynamic state */
.c-component.is-active {
    /* State styles */
}

/* Responsive */
@media (max-width: 768px) {
    .c-component {
        /* Mobile adjustments */
    }
}
```

### 9.6 Testing

**Manual testing checklist:**
- [ ] Visual appearance matches design
- [ ] Hover/focus states work
- [ ] Mobile responsive (320px - 1920px)
- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly
- [ ] High contrast mode looks good
- [ ] Works in all target browsers
- [ ] Performance is acceptable (no jank)

**Automated testing:**
```javascript
// Example E2E test (Playwright/Cypress)
test('Button shows correct state', async () => {
    const button = await page.locator('[data-testid="primary-button"]');
    await expect(button).toHaveAttribute('data-variant', 'primary');
    await expect(button).toBeVisible();
    await button.click();
    await expect(button).toHaveClass(/is-loading/);
});
```

---

## Summary

This style guide documents the complete component library and design system for the Passport Photo Sheet Maker. All components follow BEM naming convention, include accessibility features, and support responsive design.

**Key Principles:**
1. **Consistency** - Use design tokens and BEM naming
2. **Accessibility** - WCAG 2.1 Level AA compliance
3. **Performance** - Optimized CSS and animations
4. **Maintainability** - Clear structure and documentation
5. **Testing** - Comprehensive testing attributes

**For More Information:**
- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) - Original refactoring plan
- [TESTING_REPORT.md](./TESTING_REPORT.md) - Testing and validation
- [ACCESSIBILITY_ENHANCEMENTS.md](./ACCESSIBILITY_ENHANCEMENTS.md) - Accessibility details
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Overall architecture

**Questions or Issues?**
- Review component examples above
- Check existing code in `index.html` and `css/` files
- Refer to BEM documentation: [getbem.com](http://getbem.com)
- Check WCAG guidelines: [w3.org/WAI/WCAG21](https://www.w3.org/WAI/WCAG21)

---

**Version History:**
- 2.0 (2025-01-23) - Complete style guide with BEM refactoring
- 1.0 (2024) - Initial version

**Maintainer:** Claude Code Assistant
**Last Updated:** 2025-01-23
