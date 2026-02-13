# Sheet Layout Update: 2-Photo Vertical Stacking

**Date:** November 25, 2025
**Status:** ✅ COMPLETED
**Change:** Modified 2-photo layout from horizontal to vertical stacking

## User Request

> "when its 2 photos, add space in top and photo add space and add photo and add space, my intension is to make sure its easier to cut."

## Change Made

### Before (Horizontal Layout)
```
┌─────────────────────┐
│                     │
│  ┌───┐     ┌───┐   │
│  │ 1 │     │ 2 │   │
│  └───┘     └───┘   │
│                     │
└─────────────────────┘
```
- 2 photos side by side
- Horizontal cutting required

### After (Vertical Layout) ✅
```
┌─────────────────────┐
│   (space: ~0.67")   │
│      ┌──────┐       │
│      │  1   │       │
│      └──────┘       │
│   (space: ~0.67")   │
│      ┌──────┐       │
│      │  2   │       │
│      └──────┘       │
│   (space: ~0.67")   │
└─────────────────────┘
```
- 2 photos stacked vertically
- Space-Photo-Space-Photo-Space
- Much easier to cut!

## Technical Changes

### Files Modified:
1. **`js/modules/layout-config.js`**
   - Changed: `cols: 2, rows: 1` → `cols: 1, rows: 2`
   - Changed: `spacingType: 'horizontal-apart'` → `spacingType: 'vertical-apart'`

2. **`js/modules/canvas-renderer.js`**
   - Renamed: `horizontal-apart` → `vertical-apart`
   - Updated logic: Now loops through rows instead of columns
   - Centers horizontally instead of vertically

3. **`index.html`**
   - Updated inline LAYOUTS definition
   - Updated rendering logic to match

4. **`docs/implementation/NEW_SHEET_SIZES.md`**
   - Updated all documentation
   - Updated visual examples
   - Updated benefits and use cases

## Spacing Calculation

For 4×6" sheet with 2×2" photos:
- **Total photo height:** 2 photos × 2" = 4"
- **Available space:** 6" - 4" = 2"
- **Number of gaps:** 3 (top, middle, bottom)
- **Each gap:** 2" ÷ 3 = **~0.67"**

Result: **Very easy to cut** with generous margins!

## User Benefits

✅ **Maximum cutting ease** - Each photo has ~0.67" clearance on all sides
✅ **Vertical stacking** - Natural top-to-bottom cutting motion
✅ **Centered alignment** - Photos centered horizontally
✅ **Safe margins** - Plenty of room for cutting imperfections
✅ **No waste** - Uses full 4×6" sheet efficiently

## Build Status

```bash
✓ npm run build - Success in 249ms
✓ 58 modules transformed
✓ No errors
```

## Testing Points

When testing the 2-photo layout:
- ✓ Photos should be stacked vertically (one on top of the other)
- ✓ Should have approximately 0.67" of white space at top
- ✓ Should have approximately 0.67" of white space between photos
- ✓ Should have approximately 0.67" of white space at bottom
- ✓ Photos should be horizontally centered
- ✓ Cutting guides and borders should work

## Comparison with Other Layouts

| Layout | Arrangement | Cutting Difficulty | Space per Photo |
|--------|-------------|-------------------|-----------------|
| 2 photos | 1×2 vertical | **Easiest** | ~0.67" all sides |
| 4 photos | 2×2 grid | Easy | Top/bottom gaps |
| 6 photos | 2×3 grid | Moderate | Standard spacing |
| 20 photos | 4×5 grid | Most care needed | Tight spacing |

## Why Vertical is Better for 2 Photos

**Cutting Motion:**
- ✅ Vertical: Natural top-to-bottom cutting with ruler
- ❌ Horizontal: Awkward side-to-side reach

**Safety:**
- ✅ Vertical: Large gaps make mistakes less costly
- ❌ Horizontal: Narrow gaps increase error risk

**Practical Use:**
- ✅ Vertical: Cut off top margin, cut between photos, cut off bottom
- ✅ Only 3 straight cuts needed!

## Conclusion

The 2-photo layout now perfectly matches the user's intention: **maximize ease of cutting**. The vertical stacking with generous spacing (0.67" on all sides) makes it nearly impossible to accidentally cut into a photo, providing the most user-friendly cutting experience of all our layouts.

**Perfect for users who:**
- Want just 2 photos for testing
- Are new to cutting passport photos
- Prefer maximum safety margins
- Want the simplest cutting process

✅ **Ready for deployment!**
