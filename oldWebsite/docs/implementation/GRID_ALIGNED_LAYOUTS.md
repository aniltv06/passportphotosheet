# Grid-Aligned Photo Layouts

**Date:** November 25, 2025
**Status:** ✅ COMPLETED
**Feature:** Grid-aligned positioning for 4×6" 2-photo and 5×7" 6-photo layouts

## User Request

> "proceed with option 1, could you also add grid for 5x7? and align them?"

## Intent

1. Implement Option 1 (0.5" start) for 4×6" 2-photo layout
2. Add background measurement grid to 5×7" layout
3. Align all photos to clean grid intervals

## What Was Changed

### 1. 4×6" with 2 Photos - Fixed Grid Alignment ✅

**Before (Equal spacing):**
- Calculated spacing: ~0.67" (doesn't align to grid)
- Photo positions: ~0.67", ~2.67", ~3.34", ~5.34"
- ❌ Photos start at odd measurements

**After (0.5" intervals):**
```
0"─────1"─────2"─────3"─────4"
┌─────────────────────────────┐ 0"
│░░░░░░░(0.5" margin)░░░░░░░░░│
│░░░░░┌──────────────┐░░░░░░░░│ 0.5" ← Grid-aligned!
│░░░░░│   PHOTO 1    │░░░░░░░░│
│░░░░░│   (2" tall)  │░░░░░░░░│
│░░░░░└──────────────┘░░░░░░░░│ 2.5"
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░(1.0" gap)░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░┌──────────────┐░░░░░░░░│ 3.5" ← Grid-aligned!
│░░░░░│   PHOTO 2    │░░░░░░░░│
│░░░░░│   (2" tall)  │░░░░░░░░│
│░░░░░└──────────────┘░░░░░░░░│ 5.5"
│░░░░░░░(0.5" margin)░░░░░░░░░│
└─────────────────────────────┘ 6"
```

**Measurements:**
- Top margin: **0.5"** (2 grid squares)
- Photo 1: **0.5" to 2.5"**
- Middle gap: **1.0"** (4 grid squares) - easy cutting!
- Photo 2: **3.5" to 5.5"**
- Bottom margin: **0.5"** (2 grid squares)

**Benefits:**
✅ All positions at clean half-inch marks
✅ Symmetric layout (0.5" top and bottom)
✅ Generous 1" gap between photos
✅ Easy to measure and cut
✅ Perfect grid alignment

### 2. 5×7" with 6 Photos - New Grid-Aligned Layout ✅

**Layout Analysis:**
- Sheet: 5" wide × 7" tall
- Photos: 2" × 2" each (2 columns × 3 rows)
- Horizontal space: 5" - (2 × 2") = 1" → 0.5" margins
- Vertical space: 7" - (3 × 2") = 1" → distributed as gaps

**Grid-Aligned Positioning:**
```
0"────1"────2"────3"────4"────5"
┌───────────────────────────────┐ 0"
│░░(0.25" top margin)░░░░░░░░░░░│
│░┌────────┐┌────────┐░░░░░░░░░│ 0.25" ← Grid-aligned!
│░│ PHOTO ││ PHOTO │░░░░░░░░░░░│
│░│   1   ││   2   │░░░░░░░░░░░│
│░└────────┘└────────┘░░░░░░░░░│ 2.25"
│░░░░(0.25" gap)░░░░░░░░░░░░░░░│
│░┌────────┐┌────────┐░░░░░░░░░│ 2.5" ← Grid-aligned!
│░│ PHOTO ││ PHOTO │░░░░░░░░░░░│
│░│   3   ││   4   │░░░░░░░░░░░│
│░└────────┘└────────┘░░░░░░░░░│ 4.5"
│░░░░(0.25" gap)░░░░░░░░░░░░░░░│
│░┌────────┐┌────────┐░░░░░░░░░│ 4.75" ← Grid-aligned!
│░│ PHOTO ││ PHOTO │░░░░░░░░░░░│
│░│   5   ││   6   │░░░░░░░░░░░│
│░└────────┘└────────┘░░░░░░░░░│ 6.75"
│░░(0.25" bottom margin)░░░░░░░│
└───────────────────────────────┘ 7"
```

**Horizontal positions:**
- Left margin: **0.5"**
- Photo column 1: **0.5" to 2.5"**
- Photo column 2: **2.5" to 4.5"** (touching)
- Right margin: **0.5"**

**Vertical positions:**
- Top margin: **0.25"**
- Photo row 1: **0.25" to 2.25"**
- Gap: **0.25"**
- Photo row 2: **2.5" to 4.5"**
- Gap: **0.25"**
- Photo row 3: **4.75" to 6.75"**
- Bottom margin: **0.25"**

**Benefits:**
✅ All positions align to 0.25" grid intervals
✅ Quarter-inch gaps between rows for clean cutting
✅ Symmetric horizontal margins (0.5" each side)
✅ Photos touch horizontally (no horizontal waste)
✅ Professional grid-based layout

## Technical Implementation

### New Spacing Type: `grid-aligned`

Added to support layouts with precise grid alignment and variable gap sizes.

**Configuration flags:**
```javascript
customSpacing: true
spacingType: 'grid-aligned'
```

### 4×6" 2-Photo: Fixed `vertical-apart` Spacing

**Before (Calculated):**
```javascript
const spacing = availableSpace / (layout.rows + 1); // ~0.67"
const y = spacing + (row * (photoSizePx + spacing));
```

**After (Fixed):**
```javascript
const topMargin = 0.5 * dpi;    // 0.5" top
const middleGap = 1.0 * dpi;    // 1.0" between photos
const y = topMargin + (row * (photoSizePx + middleGap));
```

**Result:**
- Photo 1 Y: 0.5" (0.5 × DPI)
- Photo 2 Y: 3.5" (0.5 + 2.0 + 1.0) × DPI

### 5×7" 6-Photo: New `grid-aligned` Implementation

```javascript
const leftMargin = 0.5 * dpi;   // 0.5" left
const topMargin = 0.25 * dpi;   // 0.25" top
const rowGap = 0.25 * dpi;      // 0.25" between rows

for (let row = 0; row < layout.rows; row++) {
    for (let col = 0; col < layout.cols; col++) {
        const x = leftMargin + (col * photoSizePx); // Photos touching
        const y = topMargin + (row * (photoSizePx + rowGap)); // 0.25" gaps

        // Draw photo at (x, y)
    }
}
```

## Files Modified

### 1. `js/modules/layout-config.js`

**Updated 5×7" layout:**
```javascript
'5x7': {
    width: 5,
    height: 7,
    cols: 2,
    rows: 3,
    photos: 6,
    icon: '💵',
    label: 'Medium 5×7"',
    customSpacing: true,              // ← Added
    spacingType: 'grid-aligned'       // ← Added
},
```

### 2. `js/modules/canvas-renderer.js`

**Updated `vertical-apart` (lines 97-123):**
- Changed from calculated spacing to fixed 0.5" margins
- Fixed 1.0" gap between photos
- Added comments explaining alignment

**Added `grid-aligned` (lines 150-180):**
- New spacing type for 5×7" layout
- Fixed 0.5" horizontal margins
- Fixed 0.25" vertical margins and gaps
- Photos touch horizontally, gaps between rows
- Calls `drawBackgroundGrid()` for visual guidance

### 3. `index.html`

**Updated LAYOUTS object (line 716):**
```javascript
'5x7': {
    width: 5, height: 7, cols: 2, rows: 3, photos: 6, icon: '💵',
    customSpacing: true, spacingType: 'grid-aligned'
},
```

**Updated `createComposite()` function:**

**Lines 1057-1088:** Updated `vertical-apart` with fixed spacing
```javascript
const topMargin = 0.5 * dpi;
const middleGap = 1.0 * dpi;
const y = topMargin + (row * (photoSizePx + middleGap));
```

**Lines 1123-1160:** Added `grid-aligned` handling
```javascript
else if (layout.spacingType === 'grid-aligned') {
    const leftMargin = 0.5 * dpi;
    const topMargin = 0.25 * dpi;
    const rowGap = 0.25 * dpi;
    // ... positioning logic
}
```

## Comparison: Before vs After

### 4×6" with 2 Photos

| Aspect | Before (Calculated) | After (Grid-Aligned) |
|--------|---------------------|---------------------|
| Top margin | ~0.67" | **0.5"** ✅ |
| Photo 1 start | ~0.67" | **0.5"** ✅ |
| Photo 1 end | ~2.67" | **2.5"** ✅ |
| Middle gap | ~0.67" | **1.0"** ✅ |
| Photo 2 start | ~3.34" | **3.5"** ✅ |
| Photo 2 end | ~5.34" | **5.5"** ✅ |
| Bottom margin | ~0.67" | **0.5"** ✅ |
| Grid alignment | ❌ Poor | ✅ Perfect |
| Cutting ease | Good | **Better** ✅ |

### 5×7" with 6 Photos

| Aspect | Before (Centered) | After (Grid-Aligned) |
|--------|------------------|---------------------|
| Layout | Centered group | **Grid-aligned** ✅ |
| Background grid | ❌ None | ✅ Quarter-inch |
| Measurement scales | ❌ None | ✅ Included |
| Horizontal gaps | Calculated | **0"** (touching) |
| Vertical gaps | Calculated | **0.25"** (aligned) |
| Top margin | Calculated | **0.25"** ✅ |
| Side margins | Calculated | **0.5"** each ✅ |
| Grid alignment | ❌ Poor | ✅ Perfect |
| Cutting guidance | None | **Excellent** ✅ |

## User Benefits

### 4×6" with 2 Photos
✅ **Perfect half-inch alignment** - Start at 0.5", end at 5.5"
✅ **Full 1" middle gap** - Generous cutting clearance
✅ **Easy measurements** - "Half inch to two and a half, then three and a half to five and a half"
✅ **Symmetric** - Same margins top and bottom
✅ **Grid-aligned** - Photos align with visible grid lines

### 5×7" with 6 Photos
✅ **Quarter-inch precision** - All positions at 0.25" intervals
✅ **Background grid** - Visual cutting guide included
✅ **Measurement scales** - Ruler marks on edges
✅ **Clean row gaps** - 0.25" between each row
✅ **Efficient horizontal use** - Photos touch (no wasted space)
✅ **Professional appearance** - Grid-based layout

### Overall Improvements
✅ **Consistent grid alignment** across both layouts
✅ **Easier cutting** with visible measurement references
✅ **Professional results** with precise positioning
✅ **No guesswork** - All measurements clearly marked
✅ **Better value** - Maximum photos with optimal spacing

## Build Status

```bash
✓ Build successful in 307ms
✓ 58 modules transformed
✓ No errors or warnings
✓ All layouts tested
```

## Testing Checklist

**4×6" with 2 Photos:**
- ✅ Photo 1 starts at 0.5" mark
- ✅ Photo 1 ends at 2.5" mark
- ✅ 1.0" gap between photos
- ✅ Photo 2 starts at 3.5" mark
- ✅ Photo 2 ends at 5.5" mark
- ✅ Grid visible in background
- ✅ Measurement scales present
- ✅ Symmetric top/bottom margins

**5×7" with 6 Photos:**
- ✅ Photos start at 0.25" from top
- ✅ 0.5" left and right margins
- ✅ Photos touch horizontally (no gap)
- ✅ 0.25" gaps between rows
- ✅ All positions align to 0.25" grid
- ✅ Grid visible in background
- ✅ Measurement scales present
- ✅ All 6 photos render correctly

## Grid Alignment Verification

### 4×6" Layout Grid Points
```
Grid marks at 0.25" intervals: 0, 0.25, 0.5, 0.75, 1.0, ...

Photo positions:
- 0.5" ✅ (2nd grid mark)
- 2.5" ✅ (10th grid mark)
- 3.5" ✅ (14th grid mark)
- 5.5" ✅ (22nd grid mark)

All positions align perfectly!
```

### 5×7" Layout Grid Points
```
Grid marks at 0.25" intervals: 0, 0.25, 0.5, 0.75, 1.0, ...

Photo positions:
Horizontal:
- 0.5" ✅ (2nd grid mark)
- 2.5" ✅ (10th grid mark)
- 4.5" ✅ (18th grid mark)

Vertical:
- 0.25" ✅ (1st grid mark)
- 2.25" ✅ (9th grid mark)
- 2.5" ✅ (10th grid mark)
- 4.5" ✅ (18th grid mark)
- 4.75" ✅ (19th grid mark)
- 6.75" ✅ (27th grid mark)

All positions align perfectly!
```

## Cutting Instructions

### For 4×6" with 2 Photos:
1. **Use the grid:** Align sheet with cutting mat
2. **First cut:** Horizontal at 0.5" (top margin)
3. **Second cut:** Horizontal at 2.5" (between photos, leaving 1" gap)
4. **Third cut:** Horizontal at 5.5" (bottom of Photo 2)
5. **Vertical cuts:** Trim sides to 2" width using grid as guide

Result: Two perfect 2×2" photos!

### For 5×7" with 6 Photos:
1. **Use the grid:** Align sheet with cutting mat
2. **Vertical cuts first:**
   - Cut at 0.5" (left margin)
   - Cut at 2.5" (between columns)
   - Cut at 4.5" (right edge of photos)
3. **Horizontal cuts:**
   - Cut at 0.25" (top margin)
   - Cut at 2.25" (after row 1)
   - Cut at 4.5" (after row 2)
   - Cut at 6.75" (after row 3)

Result: Six perfect 2×2" photos!

## Architecture Notes

### Spacing Type Strategy

**Three spacing types supported:**

1. **`vertical-apart`** (4×6" 2-photo)
   - Fixed vertical spacing
   - Horizontally centered
   - Large gaps for easy cutting

2. **`vertical-centered`** (4×6" 4-photo)
   - 2×2 grid centered vertically
   - Gaps at top and bottom
   - Standard spacing between photos

3. **`grid-aligned`** (5×7" 6-photo) ← NEW
   - Fixed margins and gaps
   - Photos touch horizontally
   - Quarter-inch vertical gaps
   - Perfect grid alignment

### Code Reusability

The `drawBackgroundGrid()` function is reused for both layouts:
- Same grid pattern (0.25" intervals)
- Same measurement scales
- Same styling
- Only sheet dimensions differ

This ensures consistency and reduces code duplication.

## Future Enhancements

### Possible improvements:

1. **More grid-aligned layouts:**
   - 4×6" 4-photo with grid alignment
   - 8×10" with grid alignment option

2. **User controls:**
   - Toggle grid on/off
   - Adjust grid interval (0.125", 0.25", 0.5")
   - Choose alignment strategy

3. **Visual indicators:**
   - Highlight cutting lines
   - Show safe zones
   - Add corner registration marks

4. **Export options:**
   - Print with/without grid
   - Include cutting template
   - Professional print shop format

## Conclusion

Successfully implemented grid-aligned positioning for both 4×6" 2-photo and 5×7" 6-photo layouts. Both layouts now:

✅ **Align perfectly to grid intervals** (0.5" and 0.25" respectively)
✅ **Include background measurement grids** for cutting guidance
✅ **Have clear measurement scales** on edges
✅ **Provide optimal spacing** for ease of cutting
✅ **Maintain professional appearance**

**The result:** Users can now confidently cut photos with precise measurements, knowing exactly where to position their ruler or cutting tool. The visible grid and scales eliminate guesswork and reduce cutting errors.

**Status: Ready for deployment!** 🎉

Both layouts provide a professional, print-shop-quality experience with maximum cutting ease and precision.
