# Sticky Scroll Module

A modular, flexible sticky scroll system that makes elements stick to the viewport on scroll with configurable behavior.

## Features

- ✅ **Auto-detection** - Automatically finds elements with `data-sticky` attributes
- ✅ **Configurable offset** - Set custom top offset for sticky positioning
- ✅ **Container boundaries** - Elements stop at container bottom
- ✅ **Performance optimized** - Uses `requestAnimationFrame` for smooth scrolling
- ✅ **Mobile responsive** - Automatically disables on small screens
- ✅ **Accessibility friendly** - Respects `prefers-reduced-motion`
- ✅ **Multiple elements** - Supports multiple sticky elements on the same page
- ✅ **Callbacks** - Optional `onStick` and `onUnstick` callbacks

## Installation

### 1. Include CSS and JavaScript

```html
<!-- Add to <head> -->
<link rel="stylesheet" href="css/sticky-scroll.css">

<!-- Add as module -->
<script type="module">
    import { initStickyScroll } from './js/sticky-scroll.js';
    initStickyScroll();
</script>
```

### 2. Mark Elements as Sticky

Add `data-sticky` attribute to any element you want to make sticky:

```html
<div class="sidebar" data-sticky data-sticky-offset="80">
    <!-- Sidebar content -->
</div>
```

## Usage

### Basic Usage (Auto-Detection)

The simplest way is to use data attributes:

```html
<!-- This element will automatically become sticky -->
<div data-sticky>
    Sticky content
</div>
```

### With Configuration

Use data attributes to configure behavior:

```html
<div class="panel"
     data-sticky
     data-sticky-offset="100"
     data-sticky-behavior="fixed"
     data-sticky-zindex="500">
    Sticky panel with custom configuration
</div>
```

### Programmatic Usage

You can also register sticky elements programmatically:

```javascript
import { makeSticky, StickyScrollManager } from './js/sticky-scroll.js';

// Quick one-off sticky element
makeSticky('.my-sidebar', {
    offset: 80,
    onStick: (element) => {
        console.log('Element is now sticky!');
    },
    onUnstick: (element) => {
        console.log('Element is no longer sticky');
    }
});

// Or use the manager for more control
const manager = new StickyScrollManager();
const element = document.querySelector('.my-element');
manager.register(element, {
    offset: 100,
    behavior: 'fixed',
    zIndex: 200
});
```

## Configuration Options

### Data Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data-sticky` | - | - | Marks element as sticky (required) |
| `data-sticky-offset` | number | `0` | Distance from top of viewport (in pixels) |
| `data-sticky-behavior` | string | `"fixed"` | CSS position value: `"fixed"` or `"relative"` |
| `data-sticky-zindex` | number | `100` | Z-index for sticky element |
| `data-sticky-container` | string | `null` | CSS selector for container boundary |

### JavaScript Options

When using programmatic API:

```javascript
{
    offset: 80,                  // Distance from viewport top (pixels)
    container: '.main-content',  // Container selector (optional)
    behavior: 'fixed',           // 'fixed' or 'relative'
    zIndex: 100,                 // Z-index value
    onStick: (element) => {},    // Callback when element becomes sticky
    onUnstick: (element) => {}   // Callback when element unsticks
}
```

## Examples

### Example 1: Sidebar with Offset

```html
<div class="sidebar" data-sticky data-sticky-offset="80">
    <h3>Navigation</h3>
    <ul>
        <li><a href="#section1">Section 1</a></li>
        <li><a href="#section2">Section 2</a></li>
    </ul>
</div>
```

### Example 2: Multiple Sticky Panels

```html
<!-- Left sidebar -->
<div class="left-panel" data-sticky data-sticky-offset="80">
    Left content
</div>

<!-- Center content (not sticky) -->
<div class="main-content">
    Main content
</div>

<!-- Right sidebar -->
<div class="right-panel" data-sticky data-sticky-offset="80">
    Right content
</div>
```

### Example 3: Sticky with Container Boundary

```html
<div class="container" id="mainContainer">
    <aside class="sidebar"
           data-sticky
           data-sticky-offset="80"
           data-sticky-container="#mainContainer">
        <!-- Sidebar will stop at container bottom -->
        Sidebar content
    </aside>
    <main>
        Long main content...
    </main>
</div>
```

### Example 4: Programmatic with Callbacks

```javascript
import { makeSticky } from './js/sticky-scroll.js';

makeSticky('.controls-panel', {
    offset: 100,
    onStick: (element) => {
        element.classList.add('sticky-active');
        console.log('Controls are now sticky');
    },
    onUnstick: (element) => {
        element.classList.remove('sticky-active');
        console.log('Controls are no longer sticky');
    }
});
```

## CSS Classes

The module automatically adds CSS classes:

- `.is-stuck` - Added when element becomes sticky
- Custom classes can be added via callbacks

## Styling Sticky Elements

Customize the appearance of sticky elements:

```css
/* Base sticky element */
[data-sticky] {
    transition: box-shadow 0.3s ease;
}

/* When stuck */
.is-stuck {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(10px);
}

/* Custom sticky panel */
.my-panel.is-stuck {
    border-bottom: 2px solid #007AFF;
}
```

## Mobile Behavior

Sticky scroll is **automatically disabled on screens < 768px** to prevent layout issues on mobile devices.

To customize mobile behavior:

```css
@media (max-width: 768px) {
    [data-sticky] {
        position: static !important;
    }
}
```

## Accessibility

The module respects user preferences:

- **Reduced Motion**: Animations are disabled when `prefers-reduced-motion: reduce`
- **Print**: Sticky positioning is removed for print media

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- All modern browsers with ES6 module support

## Performance

The module is optimized for performance:

- Uses `requestAnimationFrame` for smooth scrolling
- Passive event listeners for scroll events
- Debounced resize handling
- Minimal DOM manipulation

## Troubleshooting

### Sticky element not working?

1. Check that `data-sticky` attribute is present
2. Verify element has content and dimensions
3. Check browser console for errors
4. Ensure `initStickyScroll()` is called

### Element jumping or flickering?

- Increase the `offset` value
- Check for conflicting CSS `position` rules
- Verify no JavaScript is modifying styles

### Not working on mobile?

- This is intentional! Sticky is disabled on screens < 768px
- To enable, modify the CSS media query in `sticky-scroll.css`

## API Reference

### `initStickyScroll()`

Initializes the sticky scroll system and auto-detects sticky elements.

```javascript
import { initStickyScroll } from './js/sticky-scroll.js';
initStickyScroll();
```

### `makeSticky(selector, options)`

Quick utility to make a single element sticky.

**Parameters:**
- `selector` (string|HTMLElement) - Element selector or DOM element
- `options` (Object) - Configuration options (optional)

**Returns:** StickyScrollManager instance

```javascript
const manager = makeSticky('.sidebar', { offset: 80 });
```

### `StickyScrollManager`

Main class for managing multiple sticky elements.

#### Methods

**`register(element, config)`**
Register an element to be sticky.

```javascript
manager.register(element, {
    offset: 80,
    behavior: 'fixed'
});
```

**`unregister(element)`**
Remove sticky behavior from an element.

```javascript
manager.unregister(element);
```

**`destroy()`**
Clean up and remove all sticky elements.

```javascript
manager.destroy();
```

## Advanced Usage

### Custom Sticky Behavior

```javascript
const manager = new StickyScrollManager();

const element = document.querySelector('.custom-sticky');
manager.register(element, {
    offset: 80,
    onStick: (el) => {
        // Custom logic when element sticks
        el.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
        document.body.classList.add('has-sticky-element');
    },
    onUnstick: (el) => {
        // Custom logic when element unsticks
        el.style.boxShadow = '';
        document.body.classList.remove('has-sticky-element');
    }
});
```

### Conditional Sticky

```javascript
// Only make sticky on large screens
if (window.innerWidth > 1024) {
    makeSticky('.sidebar', { offset: 80 });
}
```

### Dynamic Content

```javascript
// Re-register after content changes
const manager = window.stickyScrollManager;
const element = document.querySelector('.dynamic-panel');

// Update content
element.innerHTML = 'New content...';

// Re-register to recalculate positions
manager.unregister(element);
manager.register(element, { offset: 80 });
```

## Integration with Current Project

The sticky scroll module is already integrated in:

### photo-editor.html
- Left panel (upload & guidelines)
- Right panel (controls & face validation)

### index.html
- Customize panel (left side)
- Preview panel (right side)

All panels use:
- `data-sticky` - Enable sticky behavior
- `data-sticky-offset="80"` - 80px offset from top
- `data-sticky-behavior="fixed"` - Fixed positioning

## License

Part of the Passport Photo Sheet Maker project.
