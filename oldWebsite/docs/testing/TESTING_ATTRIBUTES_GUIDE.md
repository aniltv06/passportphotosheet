# Testing Attributes & Test Automation Strategy

**Version:** 1.0
**Date:** 2025-01-23
**Status:** Official Standard

---

## Table of Contents

1. [Overview](#overview)
2. [Why Testing Attributes?](#why-testing-attributes)
3. [Naming Convention](#naming-convention)
4. [Attribute Types](#attribute-types)
5. [Examples](#examples)
6. [Best Practices](#best-practices)
7. [Testing Frameworks](#testing-frameworks)
8. [Migration Guide](#migration-guide)

---

## Overview

Testing attributes are **data attributes** added to HTML elements to provide stable hooks for automated testing. They decouple tests from implementation details like CSS classes or element structure.

### Key Principle
**Tests should never depend on CSS classes or DOM structure. They should use dedicated testing attributes.**

---

## Why Testing Attributes?

### ❌ Without Testing Attributes

```javascript
// Bad: Test depends on CSS class
const button = document.querySelector('.upload-area');

// Bad: Test depends on DOM structure
const button = document.querySelector('div > button:nth-child(2)');

// Bad: Test depends on text content
const button = document.querySelectorAll('button').find(b => b.textContent === 'Download');
```

**Problems:**
- Tests break when CSS changes
- Tests break when structure changes
- Tests break when text changes (i18n!)
- Brittle and hard to maintain

### ✅ With Testing Attributes

```javascript
// Good: Test uses stable attribute
const button = document.querySelector('[data-testid="download-button"]');

// Good: Use testing library
const button = screen.getByTestId('download-button');
```

**Benefits:**
- Stable across refactors
- Self-documenting
- i18n-proof
- Refactor-safe
- Clear intent

---

## Naming Convention

### Our Standard

```
data-{attribute-name}="{prefix}-{component}-{element}-{variant}"
```

### Attribute Naming Rules

1. **Use kebab-case** (lowercase with hyphens)
2. **Be specific** (not too generic)
3. **Be descriptive** (indicate purpose)
4. **Be consistent** (follow patterns)

---

## Attribute Types

### 1. `data-testid` - Testing Identifier

**Primary attribute for testing.**

#### Pattern
```
data-testid="{component}-{element}-{variant}"
```

#### Examples
```html
<!-- Buttons -->
<button data-testid="download-button">Download</button>
<button data-testid="upload-button-primary">Upload</button>
<button data-testid="cancel-button">Cancel</button>

<!-- Inputs -->
<input data-testid="file-input" type="file">
<input data-testid="email-input" type="email">
<select data-testid="language-select"></select>

<!-- Containers -->
<div data-testid="upload-container"></div>
<div data-testid="preview-section"></div>
<nav data-testid="main-nav"></nav>

<!-- Links -->
<a data-testid="nav-link-home" href="/">Home</a>
<a data-testid="nav-link-editor" href="/editor">Editor</a>

<!-- Specific instances -->
<div data-testid="feature-card-1"></div>
<div data-testid="feature-card-2"></div>
<div data-testid="feature-card-3"></div>
```

### 2. `data-component` - Component Type

**Identifies the component type.**

#### Pattern
```
data-component="{component-name}"
```

#### Examples
```html
<button data-testid="download-button"
        data-component="button">
    Download
</button>

<div data-testid="upload-container"
     data-component="upload">
</div>

<nav data-testid="main-nav"
     data-component="navigation">
</nav>
```

### 3. `data-state` - Current State

**Tracks component state for testing.**

#### Pattern
```
data-state="{current-state}"
```

#### Examples
```html
<!-- Button states -->
<button data-testid="submit-button"
        data-state="enabled">
    Submit
</button>

<button data-testid="submit-button"
        data-state="loading">
    <span class="c-spinner"></span>
</button>

<button data-testid="submit-button"
        data-state="disabled"
        disabled>
    Submit
</button>

<!-- Upload states -->
<div data-testid="upload-container"
     data-state="ready">
</div>

<div data-testid="upload-container"
     data-state="uploading">
</div>

<div data-testid="upload-container"
     data-state="complete">
</div>

<div data-testid="upload-container"
     data-state="error">
</div>
```

### 4. `data-action` - User Action

**Indicates the action this element performs.**

#### Pattern
```
data-action="{action-name}"
```

#### Examples
```html
<button data-testid="download-button"
        data-action="download">
    Download
</button>

<button data-testid="reset-button"
        data-action="reset">
    Start Over
</button>

<a href="/editor"
   data-testid="editor-link"
   data-action="navigate-editor">
    Open Editor
</a>
```

### 5. `data-value` - Current Value

**Stores current value for testing.**

#### Pattern
```
data-value="{current-value}"
```

#### Examples
```html
<select data-testid="paper-size-select"
        data-value="4x6">
    <option value="4x6">4×6"</option>
    <option value="5x7">5×7"</option>
</select>

<div data-testid="photo-count"
     data-value="6">
    6 photos
</div>
```

### 6. `data-variant` - Component Variant

**Identifies specific variant of a component.**

#### Pattern
```
data-variant="{variant-name}"
```

#### Examples
```html
<button data-testid="button-primary"
        data-variant="primary">
    Primary
</button>

<button data-testid="button-secondary"
        data-variant="secondary">
    Secondary
</button>

<div data-testid="card-feature"
     data-variant="feature">
</div>
```

---

## Examples

### Complete Component Examples

#### 1. Navigation Component

```html
<nav class="c-nav"
     data-testid="main-nav"
     data-component="navigation"
     role="navigation">

    <a href="/"
       class="c-nav__logo"
       data-testid="nav-logo"
       data-action="navigate-home">
        <span class="c-nav__logo-icon">📸</span>
        <span class="c-nav__logo-text">Photo Sheet Maker</span>
    </a>

    <ul class="c-nav__list">
        <li class="c-nav__item">
            <a href="/"
               class="c-nav__link c-nav__link--active"
               data-testid="nav-link-home"
               data-state="active"
               aria-current="page">
                Home
            </a>
        </li>

        <li class="c-nav__item">
            <a href="/editor"
               class="c-nav__link c-nav__link--featured"
               data-testid="nav-link-editor"
               data-variant="featured">
                ✂️ Photo Editor
            </a>
        </li>

        <li class="c-nav__item">
            <a href="/faq"
               class="c-nav__link"
               data-testid="nav-link-faq">
                Help
            </a>
        </li>
    </ul>

    <select class="c-nav__language"
            data-testid="language-select"
            data-component="select"
            data-value="en"
            aria-label="Select language">
        <option value="en">🇺🇸 English</option>
        <option value="es">🇪🇸 Español</option>
    </select>

    <button class="c-nav__toggle"
            data-testid="nav-toggle"
            data-action="toggle-menu"
            aria-label="Toggle menu">
        ☰
    </button>
</nav>
```

#### 2. Upload Component

```html
<div class="c-upload"
     data-testid="upload-container"
     data-component="upload"
     data-state="ready">

    <div class="c-upload__dropzone"
         data-testid="upload-dropzone"
         role="button"
         tabindex="0">

        <div class="c-upload__icon"
             data-testid="upload-icon"
             aria-hidden="true">
            📁
        </div>

        <div class="c-upload__text c-upload__text--primary"
             data-testid="upload-text">
            Choose Your Photo
        </div>

        <div class="c-upload__hint"
             data-testid="upload-hint">
            Click or drag and drop
        </div>
    </div>

    <input type="file"
           class="c-upload__input"
           data-testid="upload-input"
           data-component="file-input"
           accept="image/*"
           aria-label="Choose photo file">
</div>

<!-- When uploading -->
<div class="c-upload"
     data-testid="upload-container"
     data-state="uploading">
    <div class="c-spinner" data-testid="upload-spinner"></div>
</div>

<!-- When complete -->
<div class="c-upload"
     data-testid="upload-container"
     data-state="complete"
     data-has-image="true">
    <!-- ... -->
</div>
```

#### 3. Form Component

```html
<form class="c-form"
      data-testid="options-form"
      data-component="form">

    <!-- Paper Size -->
    <div class="c-form__group"
         data-testid="form-group-paper-size">
        <label for="paperSize"
               class="c-form__label"
               data-testid="label-paper-size">
            Sheet Size
        </label>

        <select id="paperSize"
                class="c-form__select"
                data-testid="paper-size-select"
                data-component="select"
                data-value="4x6"
                aria-label="Select paper size">
            <option value="4x6" data-testid="option-4x6">4×6"</option>
            <option value="5x7" data-testid="option-5x7">5×7"</option>
            <option value="8x10" data-testid="option-8x10">8×10"</option>
        </select>

        <div class="c-form__hint"
             data-testid="hint-paper-size">
            Choose the print size you want
        </div>
    </div>

    <!-- Quality -->
    <div class="c-form__group"
         data-testid="form-group-quality">
        <label for="quality"
               class="c-form__label"
               data-testid="label-quality">
            Photo Quality
        </label>

        <select id="quality"
                class="c-form__select"
                data-testid="quality-select"
                data-value="high">
            <option value="high" data-testid="option-high">300 DPI</option>
            <option value="medium" data-testid="option-medium">200 DPI</option>
        </select>
    </div>
</form>
```

#### 4. Button Component

```html
<!-- Primary Button -->
<button class="c-button c-button--primary"
        data-testid="download-button"
        data-component="button"
        data-variant="primary"
        data-action="download"
        data-state="enabled">
    <span class="c-button__icon" aria-hidden="true">📥</span>
    <span class="c-button__text">Download</span>
</button>

<!-- Loading State -->
<button class="c-button c-button--primary is-loading"
        data-testid="download-button"
        data-state="loading"
        disabled>
    <span class="c-spinner c-spinner--small" data-testid="button-spinner"></span>
    <span class="c-button__text">Downloading...</span>
</button>

<!-- Disabled State -->
<button class="c-button c-button--primary"
        data-testid="download-button"
        data-state="disabled"
        disabled>
    <span class="c-button__text">Download</span>
</button>
```

---

## Best Practices

### ✅ DO

1. **Use data-testid for all interactive elements**
   ```html
   <button data-testid="submit-button">Submit</button>
   <input data-testid="email-input" type="email">
   <select data-testid="language-select"></select>
   ```

2. **Combine with ARIA for accessibility**
   ```html
   <button data-testid="close-button"
           aria-label="Close dialog">
       ✕
   </button>
   ```

3. **Update data-state when state changes**
   ```javascript
   // In your code
   button.setAttribute('data-state', 'loading');
   button.disabled = true;
   ```

4. **Keep testid values stable**
   ```html
   <!-- Good: Stable identifier -->
   <button data-testid="download-button">Download</button>

   <!-- Bad: Dynamic identifier -->
   <button data-testid="button-${Math.random()}">Download</button>
   ```

5. **Use specific names**
   ```html
   <!-- Good -->
   <button data-testid="upload-photo-button">Upload</button>

   <!-- Bad: Too generic -->
   <button data-testid="button">Upload</button>
   ```

### ❌ DON'T

1. **Don't use CSS classes in tests**
   ```javascript
   // Bad
   const button = document.querySelector('.c-button--primary');

   // Good
   const button = document.querySelector('[data-testid="download-button"]');
   ```

2. **Don't use text content in tests**
   ```javascript
   // Bad: Breaks with i18n
   const button = screen.getByText('Download');

   // Good
   const button = screen.getByTestId('download-button');
   ```

3. **Don't use complex selectors**
   ```javascript
   // Bad
   const button = document.querySelector('div > section > button:nth-child(3)');

   // Good
   const button = document.querySelector('[data-testid="submit-button"]');
   ```

4. **Don't duplicate IDs as testids**
   ```html
   <!-- Bad -->
   <button id="downloadBtn" data-testid="downloadBtn">Download</button>

   <!-- Good -->
   <button id="downloadBtn" data-testid="download-button">Download</button>
   ```

---

## Testing Frameworks

### Playwright Example

```javascript
import { test, expect } from '@playwright/test';

test('upload photo flow', async ({ page }) => {
    await page.goto('/');

    // Find upload input
    const uploadInput = page.locator('[data-testid="upload-input"]');

    // Upload file
    await uploadInput.setInputFiles('test-photo.jpg');

    // Wait for upload complete
    const uploadContainer = page.locator('[data-testid="upload-container"]');
    await expect(uploadContainer).toHaveAttribute('data-state', 'complete');

    // Check preview is visible
    const preview = page.locator('[data-testid="preview-section"]');
    await expect(preview).toBeVisible();

    // Select paper size
    await page.locator('[data-testid="paper-size-select"]').selectOption('8x10');

    // Download
    await page.locator('[data-testid="download-button"]').click();
});
```

### Cypress Example

```javascript
describe('Photo Sheet Maker', () => {
    it('should upload and download photo sheet', () => {
        cy.visit('/');

        // Upload photo
        cy.get('[data-testid="upload-input"]')
            .selectFile('test-photo.jpg');

        // Verify upload complete
        cy.get('[data-testid="upload-container"]')
            .should('have.attr', 'data-state', 'complete');

        // Change options
        cy.get('[data-testid="paper-size-select"]')
            .select('8x10');

        cy.get('[data-testid="quality-select"]')
            .select('high');

        // Download
        cy.get('[data-testid="download-button"]')
            .click();

        // Verify download started
        cy.get('[data-testid="download-button"]')
            .should('have.attr', 'data-state', 'loading');
    });
});
```

### Jest + Testing Library Example

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

test('button toggles state', () => {
    render(<Button />);

    const button = screen.getByTestId('toggle-button');

    expect(button).toHaveAttribute('data-state', 'inactive');

    fireEvent.click(button);

    expect(button).toHaveAttribute('data-state', 'active');
});
```

---

## Migration Guide

### Step 1: Audit Elements
List all interactive elements that need testing:
- Buttons
- Links
- Inputs
- Selects
- Forms
- Containers

### Step 2: Add data-testid
Add to all interactive elements:
```html
<!-- Before -->
<button class="c-button" onclick="download()">
    Download
</button>

<!-- After -->
<button class="c-button"
        data-testid="download-button"
        data-action="download"
        onclick="download()">
    Download
</button>
```

### Step 3: Add data-state
Add state tracking where relevant:
```javascript
// In your JavaScript
function startUpload() {
    const uploadContainer = document.querySelector('[data-testid="upload-container"]');
    uploadContainer.setAttribute('data-state', 'uploading');

    // ... upload logic

    uploadContainer.setAttribute('data-state', 'complete');
}
```

### Step 4: Update Tests
Refactor tests to use data-testid:
```javascript
// Before
const button = document.querySelector('.download-btn');

// After
const button = document.querySelector('[data-testid="download-button"]');
```

### Step 5: Document
Document all testids in a central file for reference.

---

## Quick Reference

### Common Patterns

```html
<!-- Button -->
<button data-testid="action-button"
        data-component="button"
        data-action="action-name"
        data-state="enabled">
</button>

<!-- Input -->
<input data-testid="field-input"
       data-component="input"
       data-value="current-value">

<!-- Container -->
<div data-testid="component-container"
     data-component="component-name"
     data-state="current-state">
</div>

<!-- Link -->
<a href="/path"
   data-testid="nav-link-name"
   data-action="navigate">
</a>
```

---

## Testing Checklist

- [ ] All buttons have `data-testid`
- [ ] All inputs have `data-testid`
- [ ] All links have `data-testid`
- [ ] All forms have `data-testid`
- [ ] Interactive elements have `data-action`
- [ ] Stateful elements have `data-state`
- [ ] Tests use `data-testid` (not CSS classes)
- [ ] Tests are i18n-proof
- [ ] Tests are refactor-safe

---

**Questions?** Refer to this guide or the BEM Guidelines!

**Last Updated:** 2025-01-23
