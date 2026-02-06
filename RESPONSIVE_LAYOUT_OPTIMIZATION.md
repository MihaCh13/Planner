# Responsive Schedule Table - No-Scroll Optimization Guide

## Overview
This document describes the comprehensive responsive layout optimizations made to the Planner application to ensure the entire schedule fits perfectly within the viewport without scrolling, with dynamically scaling content.

---

## Key Changes Implemented

### 1. Viewport-Fit Layout (No Scrolling)

#### Files Modified
- `components/schedule/schedule-table.tsx`
- `app/globals.css`

#### Changes
- **Main Container**: Updated `.schedule-table-wrapper` to use `height: 100vh` and `overflow: hidden`
  - Ensures the entire schedule table occupies the full viewport height
  - Prevents any vertical scrolling

- **Grid Layout**: Updated `.schedule-table-grid` to use `grid-template-rows: auto repeat(13, 1fr)`
  - `auto`: First row for headers (adapts to content)
  - `repeat(13, 1fr)`: Equal distribution of remaining 13 rows (12 time slots + 1 lunch row)
  - All rows expand equally to fill available space
  - Changed from `minmax(84px, 1fr)` to pure `1fr` for perfect viewport fit
  - Changed `overflow-y: auto` to `overflow: hidden`

- **Header Sizing**: Reduced min-height of headers from 50px to 48px with `flex-shrink: 0`
  - Ensures headers maintain fixed height and don't shrink
  - Time labels also use `flex-shrink: 0` to prevent compression

---

### 2. Dynamic Text Scaling (Fluid Typography)

#### Files Modified
- `components/schedule/event-block.tsx`
- `app/globals.css`

#### CSS clamp() Implementation
All text elements now use `text-[clamp(min, preferred, max)]` syntax with container query units (cqw/cqh):

**Subject Name (Bold Title)**
- Standard: `text-[clamp(9px,5cqw,12px)]`
- Diagonal: `text-[clamp(9px,7cqw,13px)]`
- Adjusts between 9px minimum and 12px-13px maximum based on container width

**Room Number**
- `text-[clamp(8px,4cqw,11px)]`
- Ranges from 8px to 11px for readability while fitting in cells

**Control Form (e.g., "Exam")**
- `text-[clamp(7px,4cqw,10px)]`
- Smaller to avoid overwhelming compact layouts

**Group/Subgroup Labels**
- Badge: `text-[clamp(7px,4cqw,9px)]`
- Fixed with `font-size: 9px` for week badges

#### Container Queries
- All `.event-block` elements have `container-type: inline-size`
- Enables responsive sizing based on container width (cqw = container query width)
- Scales independently within each cell

---

### 3. Fixed-Size Badges

#### Files Modified
- `app/globals.css`
- `components/schedule/event-block.tsx`

#### Implementation
Week badges (Odd/Even) and glassy-badges now include:

```css
flex-shrink: 0;        /* Prevent shrinking */
min-width: fit-content; /* Don't collapse to zero */
white-space: nowrap;   /* Prevent wrapping */
```

**Week Badges**
- Padding: `2px 6px` (reduced from 3px 8px)
- Font size: Fixed `9px` (was clamp(7px,5cqw,10px))
- Never shrinks regardless of container size
- Positioned absolutely in corners (top-left for odd, bottom-right for even)

**Glassy Badges (Groups, Projects)**
- Padding: `3px 8px` for standard, `2px 5px` for mini
- Font size: Fixed `11px` for standard, `9px` for mini
- All include `flex-shrink: 0`
- Maintain visibility in grid layouts

---

### 4. Complex Cell Layouts

#### Diagonal Split (Odd/Even Weeks)

**DiagonalLayout Component** (`event-block.tsx`)
- Content positioned absolutely with proportional padding
- Odd week: Top-left with `pt-[24px] pl-1.5 pr-1`
- Even week: Bottom-right with `pb-[24px] pr-1.5 pl-1`
- Reduced padding from 26px to 24px for better scaling

**Diagonal CSS** (`globals.css`)
- Odd triangle: `clip-path: polygon(0 0, 100% 0, 0 100%)`
- Even triangle: `clip-path: polygon(100% 0, 100% 100%, 0 100%)`
- Text scales with dynamic clamp() functions
- Badges positioned in safe corners with `z-index: 50`

#### Grid Layout (2x2 for 3+ Events)

**Grid Structure**
- `display: grid` with `grid-template-columns: 1fr 1fr` and `grid-template-rows: 1fr 1fr`
- Equal distribution of 4 quadrants
- Each quadrant has `min-width: 0` and `min-height: 0` for proper flex wrapping

**Event Block Padding in Grid**
- Normal: `padding: 8px`
- Compact: `padding: 4px 6px` (reduced from 6px 8px)
- Ensures multiple events remain visible with proper spacing

**Visual Dividers**
- Vertical divider at 50% (z-index: 5)
- Horizontal divider at 50% (z-index: 5)
- Subtle 1px lines with `rgba(0,0,0,0.15)`

---

## Technical Constraints & Solutions

### Container Queries
✓ All event-blocks have `container-type: inline-size`
✓ Text uses `cqw` (container query width) for responsive sizing
✓ Scales independently based on actual cell width

### Flex-Shrink Management
✓ `flex-shrink: 0` applied to:
  - `.schedule-header-time` and `.schedule-header-day`
  - `.schedule-time-label` and `.schedule-lunch-label`
  - `.week-badge` and `.glassy-badge`
  - Badge groups in corner positions

### Overflow Handling
✓ `.schedule-table-grid`: `overflow: hidden` (no scrolling)
✓ `.event-block`: `overflow: hidden` (contains content)
✓ `.event-block.diagonal`: `overflow: visible` (allows badges to escape)
✓ `.grid-quadrant`: `min-height: 0` and `min-width: 0` (flex safety)

### Z-Index Layering
- Grid dividers: `z-index: 5`
- Event block content: `z-index: 10`
- Corner badges: `z-index: 20`
- Week badge: `z-index: 30` (above glassy-badges)
- Diagonal divider: `z-index: 14`

---

## Responsive Behavior

### At Small Viewport Heights (< 600px)
- Font sizes scale down using clamp() minimums (9px-10px for titles)
- Badges maintain fixed `flex-shrink: 0` size
- Grid quadrants show 3-4 events stacked but visible
- Diagonal triangles still display both weeks

### At Medium Viewport Heights (600px-800px)
- Optimal readability with balanced text scaling
- Badges remain prominent but not oversized
- All content clearly visible without scrolling

### At Large Viewport Heights (> 800px)
- Font sizes scale to maximum values in clamp() functions
- Generous spacing between elements
- Enhanced readability with larger titles and labels

### Responsive Width
- Uses `cqw` (container query width) for dynamic font sizing
- Adapts to cell width changes
- Works with any screen resolution or responsive breakpoint

---

## Files Modified Summary

### 1. `components/schedule/schedule-table.tsx`
**Changes:**
- Updated wrapper: `h-screen overflow-hidden` added
- Updated grid container: `flex-1 overflow-hidden` added

### 2. `components/schedule/event-block.tsx`
**Changes:**
- DiagonalLayout text: Updated all clamp() functions
  - Subject: `clamp(9px,7cqw,13px)` (was `clamp(10px,8cqw,15px)`)
  - Room: `clamp(7px,5cqw,11px)` (was `clamp(8px,6cqw,12px)`)
  - Control: `clamp(6px,4cqw,9px)` (was `clamp(7px,5cqw,10px)`)
- Main layout text: Updated all clamp() for compact/standard views
- Reduced gap spacing: `gap-0` instead of `gap-0.5` where appropriate
- Badge positioning: Reduced top/bottom padding from 26px to 22px

### 3. `app/globals.css`
**Changes:**
- `.schedule-table-wrapper`: Added `height: 100vh`
- `.schedule-table-grid`: 
  - Changed `grid-template-rows: auto repeat(12, minmax(84px, 1fr))` to `auto repeat(13, 1fr)`
  - Changed `overflow-y: auto` to `overflow: hidden`
- `.event-block`: 
  - Reduced padding from `10px` to `8px`
  - Added `container-type: inline-size`
- `.event-block.compact`: Reduced padding from `6px 8px` to `4px 6px`
- `.week-badge`: 
  - Fixed font-size `9px` (removed clamp)
  - Reduced padding from `3px 8px` to `2px 6px`
  - Added `flex-shrink: 0`, `min-width: fit-content`
- `.glassy-badge`: 
  - Changed display from `inline-block` to `inline-flex`
  - Added `flex-shrink: 0`, `min-width: fit-content`
  - Reduced padding from `4px 10px` to `3px 8px`
- `.glassy-badge.mini`: Reduced padding from `2px 6px` to `2px 5px`
- `.schedule-header-time/day`: 
  - Reduced min-height from `50px` to `48px`
  - Added `flex-shrink: 0`
- `.schedule-time-label`: Added `flex-shrink: 0`
- `.schedule-lunch-label`: Added `flex-shrink: 0`
- `.glassy-badge.project-badge`: Reduced padding and font-size, added `flex-shrink: 0`
- `.grid-quadrant`: Added `min-width: 0` for flex safety
- `.diagonal-odd/even` padding: Reduced from `20px`/`26px` to `18px`/`24px`

---

## Testing Checklist

- [x] No scrolling occurs at any viewport height
- [x] Text scales dynamically within cells based on available space
- [x] Badges maintain fixed size and remain legible
- [x] Diagonal layouts display both weeks with visible content
- [x] Grid layouts (2x2) show 3-4 events simultaneously without overlap
- [x] Container queries work across responsive widths
- [x] Z-index layering prevents badge-to-content overlaps
- [x] Header and time label rows maintain consistent height
- [x] All event types (lecture, seminar, lab, makeup) display correctly

---

## Browser Compatibility

### Container Queries Support
- Chrome/Edge: 105+
- Firefox: 110+
- Safari: 16+
- Note: Uses `cqw` unit which requires container-type support

### CSS Grid Support
- All modern browsers (100% coverage)
- Grid template rows with `1fr` fully supported

### Clamp() Function Support
- All modern browsers (99%+ coverage)
- Fallback: Browser will ignore invalid values, ensuring basic layout works

---

## Performance Considerations

1. **No Scroll Reflow**: Fixed `overflow: hidden` eliminates scroll-related reflows
2. **Container Queries**: Minimal performance impact with modern engines
3. **CSS Grid**: One layout pass per render (highly optimized)
4. **Flex-Shrink**: Prevents unnecessary flex recalculations

---

## Future Enhancements

1. Add media query breakpoints for touch-friendly larger event blocks
2. Implement print-friendly layout with adjusted grid-template-rows
3. Add option to toggle between compact/standard view
4. Support for custom grid spacing via CSS variables
5. Dark mode optimizations for badge visibility

---

## Troubleshooting

### Issue: Text Still Scrolling
**Solution**: Verify `.schedule-table-grid` has `overflow: hidden` and parent has `height: 100%`

### Issue: Badges Overlapping Content
**Solution**: Check z-index values: badges should be ≥ `z-index: 20`

### Issue: Cells Not Distributing Equally
**Solution**: Ensure `grid-template-rows: auto repeat(13, 1fr)` and headers have fixed height with `flex-shrink: 0`

### Issue: Text Too Small
**Solution**: Adjust clamp() values: increase middle value for larger preferred size

### Issue: Container Queries Not Working
**Solution**: Verify `.event-block` has `container-type: inline-size` and test in Chrome 105+

---

## References

- [CSS Container Queries - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries)
- [CSS Grid - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [CSS Clamp - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp)
- [Tailwind CSS - Arbitrary Values](https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values)

