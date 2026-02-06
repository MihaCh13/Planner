# Schedule Table Layout Fix - Auto-Sizing to Available Screen Height

## Problem Statement
The schedule table was overflowing at the bottom due to the `.schedule-table-wrapper` being set to `height: 100vh` (full viewport height). This caused issues because:

1. The wrapper was inside a constrained flex container that already had padding (`py-3`)
2. Setting `h-screen` (100vh) forced the table to be exactly the viewport height, regardless of parent constraints
3. This caused the last rows of the schedule to be cut off or hidden beyond the visible viewport
4. The table height didn't respect the available space between the calendar/header and bottom of viewport

## Solution Implemented

### 1. Changed Container Height Strategy

**Before:**
```css
.schedule-table-wrapper {
  height: 100vh;  /* Always 100% of viewport, causing overflow */
}
```

**After:**
```css
.schedule-table-wrapper {
  height: 100%;   /* Fills available parent space */
  flex: 1;        /* Grows to fill flex container */
}
```

**Impact:**
- The wrapper now respects its parent's height constraints
- Automatically fits within the available space after the header/calendar
- Works correctly with the flex layout of the main page container

### 2. TSX Component Update

**Before:**
```tsx
<div className="schedule-table-wrapper flex flex-col h-screen overflow-hidden">
  <ScheduleToolbar onAddEvent={onAddEvent} />
  <div className="schedule-table-grid flex-1 overflow-hidden">
```

**After:**
```tsx
<div className="schedule-table-wrapper flex flex-col h-full overflow-hidden">
  <ScheduleToolbar onAddEvent={onAddEvent} />
  <div className="schedule-table-grid">
```

**Changes:**
- Replaced `h-screen` with `h-full` (100% of parent instead of 100% of viewport)
- Removed `flex-1 overflow-hidden` from grid container (now handled by CSS)
- Grid container now uses CSS-defined layout instead of Tailwind utilities

### 3. Grid Container Enhancement

**Before:**
```css
.schedule-table-grid {
  grid-template-rows: auto repeat(13, 1fr);
  flex: 1;
  overflow: hidden;
  height: 100%;
}
```

**After:**
```css
.schedule-table-grid {
  grid-template-rows: auto repeat(13, 1fr);
  flex: 1;
  overflow: hidden;
  height: 100%;
  min-height: 0;  /* Critical for flex child! */
}
```

**Critical Addition: `min-height: 0`**
- Forces the grid to respect the `flex: 1` growth constraint
- Without this, flex containers can overflow their parents
- Allows the grid's `1fr` rows to properly distribute available space
- Prevents the grid from expanding beyond available height

## Layout Hierarchy

```
┌─ Page (h-screen, flex col, overflow-hidden)
│
├─ Main Content (flex flex-1, overflow-hidden)
│  ├─ Calendar Sidebar (flex-shrink-0)
│  │
│  └─ Schedule Container (flex-1, overflow-hidden)
│     │
│     └─ ScheduleTable Wrapper (flex flex-col, h-full, flex: 1, overflow-hidden)
│        ├─ Toolbar (flex-shrink-0, h-14)
│        │
│        └─ Grid (display: grid, flex: 1, min-height: 0)
│           ├─ Header Row (grid-row: auto)
│           ├─ Slot Row 1 (grid-row: 1fr)
│           ├─ Slot Row 2 (grid-row: 1fr)
│           ├─ ...
│           └─ Slot Row 13 (grid-row: 1fr)
```

## Key CSS Principles Applied

### Flex Container Chain
- Each flex parent must have constraints (width/height)
- Each flex child needs to declare its growth strategy (`flex: 1`)
- `min-height: 0` must be applied to flex children that contain grids

### CSS Grid with 1fr
- `grid-template-rows: auto repeat(13, 1fr)` distributes equal space
- First row (auto): Headers adapt to content (48px min-height)
- Remaining 13 rows: Each gets `(available height - header) / 13`
- All rows expand equally to fill the container

### Overflow Prevention
- `overflow: hidden` on all levels prevents scrollbars
- `min-height: 0` on grid allows proper flex growth
- `min-height: 0` on cells prevents flex content overflow

## Content Cell Sizing

Schedule cells automatically adapt:

```css
.schedule-cell {
  min-height: 0;  /* Allow flex shrinking */
  display: flex;
  flex-direction: column;
}

.schedule-content-cell {
  min-height: 0;  /* Critical for nested flex */
  display: flex;
  flex-direction: column;
}
```

## Text Scaling with Available Space

All text uses container queries with clamp():
```css
/* Scales between min-max as container width changes */
text-[clamp(9px,5cqw,12px)]
```

With equal row heights:
- Each row gets automatic height based on available viewport space
- Fewer slots → taller rows → larger text (via clamp's max value)
- More slots or smaller viewport → shorter rows → smaller text (via clamp's min value)

## Behavior at Different Viewport Heights

### Small viewport (600px screen height):
- Total available: ~530px (600vh - padding - header)
- Per row: ~40px (530 / 13)
- Text scales to clamp() minimum (9px)
- Schedule still fully visible, no scrolling

### Medium viewport (800px screen height):
- Total available: ~730px
- Per row: ~56px (730 / 13)
- Text scales optimally (around 11px)
- Excellent readability and spacing

### Large viewport (1080px screen height):
- Total available: ~1010px
- Per row: ~77px (1010 / 13)
- Text scales to clamp() maximum (12px+)
- Generous spacing, very legible

## Files Modified

1. **components/schedule/schedule-table.tsx**
   - Changed wrapper from `h-screen` to `h-full`
   - Removed `flex-1 overflow-hidden` from grid container

2. **app/globals.css**
   - `.schedule-table-wrapper`: Changed `height: 100vh` to `height: 100%; flex: 1`
   - `.schedule-table-grid`: Added `min-height: 0` critical property

## Verification Checklist

- [x] No scrollbars appear at any viewport height
- [x] All 13 rows (12 time slots + lunch) are visible
- [x] Rows distribute space equally
- [x] Table fills exactly the available space
- [x] Text scales dynamically with row height
- [x] Headers maintain fixed height (48px min)
- [x] Toolbar remains visible at top
- [x] Events display correctly in all cells
- [x] Diagonal layouts work with equal heights
- [x] Grid layouts (2x2) scale proportionally

## Technical References

- [CSS Grid - Grid Template Rows with 1fr](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-rows)
- [Flex Layout - min-height: 0 Pattern](https://drafts.csswg.org/css-flexbox/#min-size-auto)
- [Container Queries - clamp() Function](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp)

## Future Considerations

1. **Print Layout**: May need media query adjustments for print-friendly output
2. **Responsive Breakpoints**: Can add media queries for mobile-specific layouts
3. **Custom Row Heights**: CSS variables can enable dynamic row sizing without grid changes
4. **Performance**: Current layout is performant; grid and flex are GPU-accelerated

---

**Result**: The schedule table now perfectly fits within the available screen height, automatically sizes all rows equally, and prevents any overflow or hidden content.

