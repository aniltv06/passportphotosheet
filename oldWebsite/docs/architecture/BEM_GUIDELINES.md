# BEM (Block Element Modifier) Naming Convention Guidelines

**Version:** 1.0
**Date:** 2025-01-23
**Status:** Official Standard

---

## Table of Contents

1. [What is BEM?](#what-is-bem)
2. [Why BEM?](#why-bem)
3. [Naming Convention](#naming-convention)
4. [Prefixes](#prefixes)
5. [Examples](#examples)
6. [Best Practices](#best-practices)
7. [Migration Guide](#migration-guide)

---

## What is BEM?

**BEM** (Block Element Modifier) is a naming methodology that helps create reusable, maintainable, and scalable CSS.

### Structure
```
block__element--modifier
```

- **Block:** Standalone entity (`.c-button`, `.c-card`)
- **Element:** Part of a block (`.c-button__icon`, `.c-card__title`)
- **Modifier:** Variation of block/element (`.c-button--primary`, `.c-card--large`)

---

## Why BEM?

### Problems BEM Solves
❌ **Without BEM:**
```css
.upload-area { }
.upload-icon { }
.featured { }
.active { }
```
**Issues:** Name collisions, unclear relationships, hard to maintain

✅ **With BEM:**
```css
.c-upload { }
.c-upload__icon { }
.c-upload--featured { }
.c-upload.is-active { }
```
**Benefits:** Clear relationships, no collisions, self-documenting

---

## Naming Convention

### Our BEM Standard

```
[prefix]-[block]__[element]--[modifier]
```

### Syntax Rules
- Use **lowercase**
- Use **hyphens** for word separation
- Use **double underscore** (`__`) for elements
- Use **double dash** (`--`) for modifiers
- No more than one element level deep

---

## Prefixes

We use **prefixes** to indicate the purpose of a class:

### Component Prefix: `c-`
```css
.c-button { }
.c-card { }
.c-upload { }
.c-navigation { }
.c-modal { }
```
**Usage:** Reusable UI components

### Layout Prefix: `l-`
```css
.l-container { }
.l-grid { }
.l-sidebar { }
.l-header { }
.l-main { }
```
**Usage:** Page layout structures

### Utility Prefix: `u-`
```css
.u-text-center { }
.u-hidden { }
.u-margin-top-lg { }
.u-visually-hidden { }
```
**Usage:** Single-purpose utility classes

### State Prefix: `is-` / `has-`
```css
.is-active { }
.is-disabled { }
.is-loading { }
.has-error { }
.has-icon { }
.has-dropdown { }
```
**Usage:** State classes (combined with BEM)

### JavaScript Prefix: `js-`
```css
.js-toggle { }
.js-accordion { }
.js-modal-trigger { }
```
**Usage:** JavaScript hooks (no styling)

---

## Examples

### 1. Button Component

**HTML:**
```html
<!-- Primary Button -->
<button class="c-button c-button--primary c-button--large">
    <span class="c-button__icon">📥</span>
    <span class="c-button__text">Download</span>
</button>

<!-- Secondary Button (Disabled) -->
<button class="c-button c-button--secondary is-disabled">
    <span class="c-button__text">Cancel</span>
</button>

<!-- Icon-only Button -->
<button class="c-button c-button--icon" aria-label="Close">
    <span class="c-button__icon">✕</span>
</button>
```

**CSS:**
```css
/* Block */
.c-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
}

/* Elements */
.c-button__icon {
    font-size: 20px;
}

.c-button__text {
    font-weight: 600;
}

/* Modifiers */
.c-button--primary {
    background: var(--primary-color);
    color: white;
}

.c-button--secondary {
    background: var(--secondary-color);
    color: white;
}

.c-button--large {
    padding: 16px 32px;
    font-size: 18px;
}

.c-button--icon {
    padding: 12px;
    border-radius: 50%;
}

/* States */
.c-button.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
}

.c-button.is-loading {
    position: relative;
    color: transparent;
}
```

### 2. Upload Component

**HTML:**
```html
<div class="c-upload c-upload--ready" data-testid="upload-container">
    <div class="c-upload__dropzone c-upload__dropzone--active">
        <div class="c-upload__icon">📁</div>
        <div class="c-upload__text c-upload__text--primary">
            Choose Your Photo
        </div>
        <div class="c-upload__hint">Click or drag and drop</div>
    </div>

    <input
        type="file"
        class="c-upload__input"
        data-testid="upload-input"
        accept="image/*">
</div>

<!-- Upload with image -->
<div class="c-upload c-upload--ready has-image">
    <!-- ... -->
</div>

<!-- Upload in dragover state -->
<div class="c-upload c-upload--ready is-dragover">
    <!-- ... -->
</div>
```

**CSS:**
```css
/* Block */
.c-upload {
    position: relative;
    width: 100%;
}

/* Elements */
.c-upload__dropzone {
    padding: 40px;
    border: 2px dashed var(--border);
    border-radius: 12px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.c-upload__icon {
    font-size: 48px;
    margin-bottom: 16px;
}

.c-upload__text {
    font-size: 18px;
    margin-bottom: 8px;
}

.c-upload__text--primary {
    font-weight: 600;
    color: var(--primary-color);
}

.c-upload__hint {
    font-size: 14px;
    color: var(--text-secondary);
}

.c-upload__input {
    display: none;
}

/* Modifiers */
.c-upload--ready .c-upload__dropzone {
    border-color: var(--border);
}

.c-upload--compact {
    max-width: 400px;
}

/* States */
.c-upload.is-dragover .c-upload__dropzone {
    border-color: var(--success-color);
    background: rgba(52, 199, 89, 0.05);
    transform: scale(1.02);
}

.c-upload.has-image .c-upload__dropzone {
    border-color: var(--success-color);
    background: rgba(52, 199, 89, 0.1);
}
```

### 3. Card Component

**HTML:**
```html
<article class="c-card c-card--feature" data-testid="feature-card">
    <div class="c-card__header">
        <div class="c-card__icon">
            <svg>...</svg>
        </div>
    </div>

    <div class="c-card__body">
        <h3 class="c-card__title">Upload Your Photo</h3>
        <p class="c-card__description">
            Simply upload your 2×2 inch passport photo.
        </p>
    </div>

    <div class="c-card__footer">
        <button class="c-button c-button--primary">
            Learn More
        </button>
    </div>
</article>
```

**CSS:**
```css
/* Block */
.c-card {
    display: flex;
    flex-direction: column;
    padding: 24px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
}

/* Elements */
.c-card__header {
    margin-bottom: 16px;
}

.c-card__icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 122, 255, 0.1);
    border-radius: 12px;
}

.c-card__body {
    flex: 1;
    margin-bottom: 16px;
}

.c-card__title {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 8px;
    color: var(--text-primary);
}

.c-card__description {
    font-size: 15px;
    color: var(--text-secondary);
    line-height: 1.5;
}

.c-card__footer {
    margin-top: auto;
}

/* Modifiers */
.c-card--feature {
    padding: 32px;
}

.c-card--compact {
    padding: 16px;
}

.c-card--highlighted {
    border: 2px solid var(--primary-color);
}

/* States */
.c-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
```

### 4. Navigation Component

**HTML:**
```html
<nav class="c-nav" role="navigation" data-testid="main-nav">
    <div class="l-container">
        <div class="c-nav__wrapper">
            <!-- Logo -->
            <a href="/" class="c-nav__logo" data-testid="nav-logo">
                <span class="c-nav__logo-icon">📸</span>
                <span class="c-nav__logo-text">Photo Sheet Maker</span>
            </a>

            <!-- Links -->
            <ul class="c-nav__list">
                <li class="c-nav__item">
                    <a href="/"
                       class="c-nav__link c-nav__link--active"
                       aria-current="page"
                       data-testid="nav-link-home">
                        Home
                    </a>
                </li>
                <li class="c-nav__item">
                    <a href="/editor"
                       class="c-nav__link c-nav__link--featured"
                       data-testid="nav-link-editor">
                        ✂️ Editor
                    </a>
                </li>
            </ul>

            <!-- Actions -->
            <div class="c-nav__actions">
                <select class="c-nav__language" data-testid="language-select">
                    <option value="en">🇺🇸 English</option>
                    <option value="es">🇪🇸 Español</option>
                </select>

                <button class="c-nav__toggle"
                        aria-label="Toggle menu"
                        data-testid="nav-toggle">
                    ☰
                </button>
            </div>
        </div>
    </div>
</nav>
```

**CSS:**
```css
/* Block */
.c-nav {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.c-nav__wrapper {
    display: flex;
    align-items: center;
    gap: 32px;
    padding: 16px 0;
}

/* Elements */
.c-nav__logo {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    color: var(--text-primary);
    font-weight: 700;
    font-size: 18px;
}

.c-nav__logo-icon {
    font-size: 24px;
}

.c-nav__list {
    display: flex;
    gap: 8px;
    list-style: none;
    margin: 0;
    padding: 0;
}

.c-nav__link {
    display: block;
    padding: 8px 16px;
    text-decoration: none;
    color: var(--text-secondary);
    font-weight: 500;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.c-nav__link:hover {
    background: rgba(0, 122, 255, 0.1);
    color: var(--primary-color);
}

.c-nav__link--active {
    background: rgba(0, 122, 255, 0.1);
    color: var(--primary-color);
}

.c-nav__link--featured {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.c-nav__actions {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 16px;
}

.c-nav__language {
    padding: 8px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: white;
    cursor: pointer;
}

.c-nav__toggle {
    display: none;
    padding: 8px;
    border: none;
    background: none;
    font-size: 24px;
    cursor: pointer;
}

@media (max-width: 768px) {
    .c-nav__toggle {
        display: block;
    }

    .c-nav__list {
        display: none;
    }
}
```

---

## Best Practices

### ✅ DO

1. **Keep it Simple**
   ```html
   <div class="c-button c-button--primary">Click</div>
   ```

2. **One Level Deep for Elements**
   ```html
   <!-- Good -->
   <div class="c-card">
       <div class="c-card__header"></div>
   </div>

   <!-- Avoid (too deep) -->
   <div class="c-card">
       <div class="c-card__header">
           <div class="c-card__header__icon"></div> <!-- ❌ -->
       </div>
   </div>

   <!-- Better -->
   <div class="c-card">
       <div class="c-card__header">
           <div class="c-card__icon"></div> <!-- ✅ -->
       </div>
   </div>
   ```

3. **Use State Classes**
   ```html
   <button class="c-button c-button--primary is-loading">
       Submit
   </button>
   ```

4. **Combine with Data Attributes**
   ```html
   <div class="c-upload"
        data-testid="upload-container"
        data-state="ready">
   </div>
   ```

### ❌ DON'T

1. **Don't Nest Too Deep**
   ```html
   <!-- Bad -->
   <div class="c-card__body__content__text__paragraph"></div>

   <!-- Good -->
   <div class="c-card__text"></div>
   ```

2. **Don't Use Generic Names**
   ```html
   <!-- Bad -->
   <div class="container"></div>
   <div class="wrapper"></div>
   <div class="item"></div>

   <!-- Good -->
   <div class="l-container"></div>
   <div class="c-card"></div>
   <div class="c-list__item"></div>
   ```

3. **Don't Mix BEM with Other Methodologies**
   ```html
   <!-- Bad -->
   <div class="c-button btn-primary large"></div>

   <!-- Good -->
   <div class="c-button c-button--primary c-button--large"></div>
   ```

---

## Migration Guide

### Step 1: Identify Components
List all UI patterns:
- Navigation
- Buttons
- Cards
- Forms
- Upload areas
- Modals
- etc.

### Step 2: Create BEM Names
Map old names to new BEM names:
```
upload-area        → c-upload
feature-card       → c-card c-card--feature
btn                → c-button
nav-link active    → c-nav__link c-nav__link--active
```

### Step 3: Update HTML
Replace old classes with BEM:
```html
<!-- Before -->
<div class="upload-area">
    <div class="upload-icon"></div>
</div>

<!-- After -->
<div class="c-upload">
    <div class="c-upload__icon"></div>
</div>
```

### Step 4: Update CSS
Rename CSS selectors:
```css
/* Before */
.upload-area { }
.upload-icon { }
.upload-area.active { }

/* After */
.c-upload { }
.c-upload__icon { }
.c-upload.is-active { }
```

### Step 5: Test
- Visual regression testing
- Accessibility testing
- Functionality testing

---

## Quick Reference

### Syntax
```
.c-block { }                    /* Block */
.c-block__element { }           /* Element */
.c-block--modifier { }          /* Modifier */
.c-block__element--modifier { } /* Element Modifier */
.c-block.is-state { }          /* State */
```

### Prefixes
```
c-  Component
l-  Layout
u-  Utility
is- State
has- Condition
js- JavaScript hook
```

### Example
```html
<article class="c-card c-card--featured has-image is-active"
         data-testid="feature-card">
    <div class="c-card__header">
        <div class="c-card__icon"></div>
    </div>
    <div class="c-card__body">
        <h3 class="c-card__title"></h3>
        <p class="c-card__description"></p>
    </div>
</article>
```

---

## Resources

- [BEM Official](https://en.bem.info/)
- [BEM 101](https://css-tricks.com/bem-101/)
- [Our Component Library](#) (coming soon)

---

**Questions?** Refer to this guide or ask the team!

**Last Updated:** 2025-01-23
