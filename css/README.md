# CSS Modules

This folder contains modular CSS files for the Photo Sheet Maker application.

## File Structure

```
css/
├── common.css       # Core styles, variables, reset, and utilities
└── components.css   # Reusable UI components
```

## File Descriptions

### common.css
Core styles used across all pages:
- **CSS Variables**: Design system tokens (colors, spacing, typography)
- **Reset Styles**: Normalized base styles
- **Accessibility**: Skip links, visually hidden elements
- **Container**: Max-width container for content
- **Buttons**: Base button styles and variants
- **Language Selector**: Fixed position language dropdown
- **Footer**: Common footer styling
- **Animations**: Keyframe animations (float, pulse, fadeIn)
- **Responsive**: Mobile breakpoints
- **Print Styles**: Print-friendly styles

### components.css
Reusable UI components:
- **Floating Home Button**: Fixed position home button with camera icon
- **Loading Spinner**: Animated loading indicator
- **Cards**: Card component with hover effects
- **Alerts**: Info, success, warning, danger messages
- **Badges**: Small status indicators
- **Form Elements**: Styled inputs, selects, labels
- **Grid Layout**: Responsive grid system
- **Tooltips**: Hover tooltips

## Usage

### In HTML Files

**Include in the `<head>` section:**

```html
<head>
    <!-- Common styles -->
    <link rel="stylesheet" href="css/common.css">
    <link rel="stylesheet" href="css/components.css">

    <!-- Page-specific styles -->
    <style>
        /* Your page-specific styles here */
    </style>
</head>
```

### Using CSS Variables

All design tokens are available as CSS variables:

```css
/* Colors */
var(--primary-color)    /* #007AFF */
var(--success-color)    /* #34C759 */
var(--text-primary)     /* #1D1D1F */

/* Spacing */
var(--spacing-xs)       /* 8px */
var(--spacing-sm)       /* 12px */
var(--spacing-md)       /* 16px */
var(--spacing-lg)       /* 24px */

/* Radius */
var(--radius-sm)        /* 8px */
var(--radius-md)        /* 12px */
var(--radius-lg)        /* 20px */

/* Typography */
var(--font-system)      /* System font stack */

/* Transitions */
var(--transition)       /* 0.3s cubic-bezier */
var(--transition-smooth)/* 0.6s cubic-bezier */
```

### Example Components

**Button:**
```html
<button class="btn">Primary Button</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-outline">Outline</button>
```

**Card:**
```html
<div class="card">
    <h3 class="card-title">Card Title</h3>
    <p class="card-description">Card description goes here.</p>
</div>
```

**Alert:**
```html
<div class="alert alert-info">Information message</div>
<div class="alert alert-success">Success message</div>
<div class="alert alert-warning">Warning message</div>
<div class="alert alert-danger">Danger message</div>
```

**Grid:**
```html
<div class="grid grid-3">
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
</div>
```

## Design System

### Color Palette

| Variable | Hex | Usage |
|----------|-----|-------|
| `--primary-color` | #007AFF | Primary actions, links |
| `--secondary-color` | #5856D6 | Secondary actions |
| `--success-color` | #34C759 | Success states |
| `--warning-color` | #FF9500 | Warning states |
| `--danger-color` | #FF3B30 | Danger/error states |
| `--text-primary` | #1D1D1F | Primary text |
| `--text-secondary` | #86868B | Secondary text |

### Spacing Scale

| Variable | Value | Usage |
|----------|-------|-------|
| `--spacing-xs` | 8px | Tight spacing |
| `--spacing-sm` | 12px | Small spacing |
| `--spacing-md` | 16px | Medium spacing |
| `--spacing-lg` | 24px | Large spacing |
| `--spacing-xl` | 32px | Extra large |
| `--spacing-2xl` | 48px | 2x extra large |
| `--spacing-3xl` | 64px | 3x extra large |
| `--spacing-4xl` | 96px | 4x extra large |

### Border Radius

| Variable | Value | Usage |
|----------|-------|-------|
| `--radius-sm` | 8px | Small elements |
| `--radius-md` | 12px | Medium elements |
| `--radius-lg` | 20px | Large elements |
| `--radius-xl` | 24px | Extra large |

## Benefits

✅ **Consistency**: Unified design system across all pages
✅ **Maintainability**: Change once, apply everywhere
✅ **Performance**: Single CSS file cached by browser
✅ **Accessibility**: Built-in accessible components
✅ **Responsive**: Mobile-first responsive design
✅ **Customization**: Easy to override with CSS variables

## Customization

To customize the design system, modify the CSS variables in `common.css`:

```css
:root {
    /* Change primary color */
    --primary-color: #0066CC;

    /* Change spacing scale */
    --spacing-lg: 32px;

    /* Change font */
    --font-system: 'Inter', -apple-system, sans-serif;
}
```

## Adding New Components

When adding new reusable components:

1. Add to `components.css`
2. Follow the existing naming convention
3. Use CSS variables for values
4. Add mobile responsive styles
5. Document in this README

Example:
```css
/* New Component */
.my-component {
    padding: var(--spacing-md);
    background: var(--surface);
    border-radius: var(--radius-md);
    transition: var(--transition);
}
```

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- iOS Safari: Latest 2 versions
- Samsung Internet: Latest 2 versions
