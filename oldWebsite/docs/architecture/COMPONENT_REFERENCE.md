# Component Quick Reference
**Fast lookup for developers**

---

## Navigation

```html
<nav class="c-nav" role="navigation">
    <div class="c-nav__container">
        <a class="c-nav__logo">Logo</a>
        <div class="c-nav__links">
            <a class="c-nav__link c-nav__link--active">Home</a>
            <a class="c-nav__link">About</a>
        </div>
        <select class="c-nav__language">...</select>
        <button class="c-nav__toggle">☰</button>
    </div>
</nav>
```

**Modifiers:** `--active`, `--featured`
**States:** `.c-nav__links.is-active` (mobile menu)

---

## Buttons

```html
<!-- Primary -->
<button class="c-button c-button--primary">
    <span class="c-button__icon">⬇️</span>
    <span class="c-button__text">Download</span>
</button>

<!-- Secondary -->
<button class="c-button c-button--secondary">Reset</button>

<!-- Demo -->
<button class="c-button c-button--demo">Try Demo</button>
```

**Modifiers:** `--primary`, `--secondary`, `--demo`

---

## Forms

```html
<form class="c-form c-form--stack">
    <div class="c-form__group">
        <label class="c-form__label" for="field">Label</label>
        <select class="c-form__select" id="field">
            <option>Option 1</option>
        </select>
        <div class="c-form__hint">Helper text</div>
    </div>
</form>
```

**Modifiers:** `--stack` (vertical layout)

---

## Cards

### Feature Card
```html
<div class="c-feature-card">
    <div class="c-feature-card__icon">🎨</div>
    <h3 class="c-feature-card__title">Title</h3>
    <p class="c-feature-card__description">Description</p>
</div>
```

### Workflow Card
```html
<div class="c-workflow-card c-workflow-card--featured">
    <div class="c-workflow-card__icon">✂️</div>
    <h3 class="c-workflow-card__title">Title</h3>
    <p class="c-workflow-card__description">Description</p>
    <button class="c-button">Action</button>
</div>
```

**Modifiers:** `--upload`, `--featured`

### Stat Card
```html
<div class="c-stat-card">
    <span class="c-stat-card__value">20</span>
    <span class="c-stat-card__label">Photos</span>
</div>
```

### Info Banner
```html
<div class="c-info-banner">
    <h2 class="c-info-banner__title">💡 Title</h2>
    <ul class="c-info-banner__list">
        <li>Item 1</li>
        <li>Item 2</li>
    </ul>
</div>
```

---

## Upload

```html
<div class="c-upload" id="uploadArea" tabindex="0">
    <div class="c-upload__icon">📷</div>
    <div class="c-upload__text">Choose Photo</div>
    <div class="c-upload__hint">Click or drag</div>
    <div class="c-upload__success">✓ Success</div>
    <input type="file" class="c-upload__input">
</div>
```

**States:** `.is-dragover`, `.has-image`

---

## Layouts

### Container
```html
<div class="l-container">
    <!-- Content -->
</div>
```

### Feature Grid
```html
<div class="l-feature-grid">
    <div class="c-feature-card">...</div>
    <div class="c-feature-card">...</div>
</div>
```

### Customize & Preview
```html
<div class="l-customize-preview">
    <div class="customize-panel">Options</div>
    <div class="preview-panel">Preview</div>
</div>
```

### Button Group
```html
<div class="l-button-group">
    <button class="c-button">Button 1</button>
    <button class="c-button">Button 2</button>
</div>
```

---

## Utilities

### Visually Hidden
```html
<div class="u-visually-hidden">
    Hidden but accessible to screen readers
</div>
```

---

## Testing Attributes

```html
<!-- Component -->
<nav data-testid="main-nav"
     data-component="navigation">

<!-- Button -->
<button data-testid="download-button"
        data-component="button"
        data-variant="primary"
        data-action="download">

<!-- Form Field -->
<select data-testid="form-select-size"
        data-field="paperSize">

<!-- State -->
<a data-state="active">
```

---

## Accessibility Patterns

### Skip Link
```html
<a href="#main-content" class="c-skip-link">
    Skip to main content
</a>
```

### ARIA Live Region
```html
<div id="ariaLiveRegion"
     role="status"
     aria-live="polite"
     aria-atomic="true"
     class="u-visually-hidden">
</div>
```

### Screen Reader Announcement
```javascript
announceToScreenReader('Message');
```

### Focus Management
```javascript
// Move focus with announcement
manageFocus('#element', 'Announcement');

// Trap focus in modal
const cleanup = trapFocus(container);
// Later: cleanup();
```

---

## CSS Variables

### Colors
```css
var(--primary-color)      /* #007AFF */
var(--primary-hover)      /* #0051D5 */
var(--success-color)      /* #34C759 */
var(--warning-color)      /* #FF9500 */
var(--danger-color)       /* #FF3B30 */
var(--text-primary)       /* #1D1D1F */
var(--text-secondary)     /* #86868B */
```

### Spacing
```css
var(--spacing-xs)         /* 8px */
var(--spacing-sm)         /* 12px */
var(--spacing-md)         /* 16px */
var(--spacing-lg)         /* 24px */
var(--spacing-xl)         /* 32px */
var(--spacing-2xl)        /* 48px */
var(--spacing-3xl)        /* 64px */
var(--spacing-4xl)        /* 96px */
```

### Border Radius
```css
var(--radius-sm)          /* 8px */
var(--radius-md)          /* 12px */
var(--radius-lg)          /* 20px */
var(--radius-xl)          /* 24px */
```

### Shadows
```css
var(--shadow)             /* rgba(0, 0, 0, 0.08) */
var(--shadow-md)          /* rgba(0, 0, 0, 0.12) */
var(--shadow-lg)          /* rgba(0, 0, 0, 0.16) */
```

### Transitions
```css
var(--transition)         /* 0.3s ease-out */
var(--transition-smooth)  /* 0.6s ease-out */
```

---

## BEM Naming Cheat Sheet

```
Block:     .c-button
Element:   .c-button__text
Modifier:  .c-button--primary
State:     .c-button.is-active
```

**Prefixes:**
- `c-` = Component
- `l-` = Layout
- `u-` = Utility

**States:**
- `.is-{state}` = Current state
- `.has-{state}` = Has something

---

## Responsive Breakpoints

```css
/* Mobile First */
@media (max-width: 768px) {
    /* Mobile styles */
}

@media (max-width: 1024px) {
    /* Tablet styles */
}

/* Desktop default (1100px max-width) */
```

---

## Common Patterns

### Hover Effect
```css
.component {
    transition: var(--transition);
}

.component:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px var(--shadow-md);
}
```

### Focus Styles
```css
.component:focus-visible {
    outline: 3px solid var(--primary-color);
    outline-offset: 3px;
}
```

### Loading State
```css
.component.is-loading {
    opacity: 0.6;
    pointer-events: none;
}
```

### Disabled State
```css
.component:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
```

---

## JavaScript Helpers

### Get Element
```javascript
const el = document.getElementById('id');
const el = document.querySelector('.class');
const els = document.querySelectorAll('.class');
```

### Add/Remove Class
```javascript
element.classList.add('is-active');
element.classList.remove('is-loading');
element.classList.toggle('is-visible');
```

### ARIA Attributes
```javascript
button.setAttribute('aria-pressed', 'true');
button.setAttribute('aria-expanded', 'false');
button.setAttribute('aria-label', 'Close');
```

### Event Listeners
```javascript
button.addEventListener('click', (e) => {
    // Handle click
});

// Debounced event
const handleResize = debounce(() => {
    // Handle resize
}, 100);
window.addEventListener('resize', handleResize);
```

---

**For detailed documentation, see [STYLE_GUIDE.md](./STYLE_GUIDE.md)**
