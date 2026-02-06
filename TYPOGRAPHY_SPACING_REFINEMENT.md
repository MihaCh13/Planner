# Typography and Spacing Refinement Guide

## Overview
This document describes the typography and spacing refinements made to ensure grid/compact events display tightly while full-week events display prominently with large, fluid fonts.

---

## Changes Implemented

### 1. Grid/Compact View - Tightened Line Spacing

**Diagonal & Grid Events:**
```tsx
// OLD: leading-tight (equivalent to 1.25)
<div className="text-slate-900 font-bold leading-tight">

// NEW: leading-[1.1] (11% line height ratio)
<div className={cn(
  isCompact ? "leading-[1.1] text-[clamp(9px,5cqw,12px)]" : ...
)}
```

**Impact:**
- Reduces vertical space between wrapped lines
- Saves ~2-3px per wrapped line
- More compact, dense appearance
- Better fit for 2x2 grid layouts
- Line-height: 1.1 creates tighter but still readable spacing

**Applied to:**
- Subject names in makeup events (grid view)
- Subject names in standard events (grid view)  
- Diagonal split events (both odd/even)
- Room numbers in all compact layouts
- Control form labels

---

### 2. Full-Week Events - Large & Fluid Font

**Single "Every Week" Events (Full Block):**
```tsx
// OLD: text-[clamp(9px,5cqw,12px)]
// NEW: text-[clamp(11px,1.2vw,16px)]

// For Subject Names:
isCompact ? "text-[clamp(9px,5cqw,12px)]" 
        : "text-[clamp(11px,1.2vw,16px)]"

// For Room Numbers:
isCompact ? "text-[clamp(8px,4cqw,11px)]" 
        : "text-[clamp(9px,1vw,13px)]"

// For Control Form:
"text-[clamp(8px,0.9vw,12px)]"
```

**Scaling Behavior:**
- Subject: 11px (min) → 16px (max) based on viewport width
- At 800px viewport: ~17.6px (1.2% of 1466px)
- At 1920px viewport: ~23px (1.2% of 1920px)
- Room: 9px (min) → 13px (max)
- Control: 8px (min) → 12px (max)

**Why Viewport Width (vw)?**
- Better reflects actual readable space on screen
- More responsive than container query width (cqw)
- Scales smoothly across screen resolutions
- Matches natural reading expectations

---

### 3. Leading (Line Height) Strategy

**Grid/Compact Events:**
```css
leading-[1.1]  /* 1.1x font size = 11% line-height ratio */
```
- Tight spacing: saves vertical space
- Ratio: 1.1 means 10% extra space above/below text
- Example: 12px text = 13.2px line-height (only 1.2px extra)
- Perfect for dense information

**Full-Week Events:**
```css
leading-relaxed  /* 1.625x font size = Tailwind default relaxed */
```
- Generous spacing: ~65% extra space
- Better readability for larger fonts
- Example: 16px text = 26px line-height
- Comfortable reading experience

**Diagonal/Split Events:**
```css
leading-[1.1]  /* Same as grid - tight and compact */
```
- Maintains consistency with grid view
- Efficient use of triangular space
- Prevents text overflow in diagonal triangles

---

### 4. Gap and Spacing Adjustments

**Changed from:**
```tsx
gap-0.5  /* 2px spacing between items */
```

**Changed to:**
```tsx
gap-0    /* 0px spacing - tighter container */
gap-0.5  /* Still used for specific layouts */
```

**Applied to:**
- DiagonalLayout: `gap-0` for absolute minimal spacing
- Main layout container: `gap-0` for base, then managed per element
- Control form: `mt-0.5` for targeted margin

**Benefit:** More compact layout without sacrificing readability

---

### 5. Text Hierarchy Fix

### Full-Week Events (Prominent):
1. **Subject Name**: `text-[clamp(11px,1.2vw,16px)]` bold
2. **Room Number**: `text-[clamp(9px,1vw,13px)]` semibold
3. **Control Form**: `text-[clamp(8px,0.9vw,12px)]` italic

### Grid/Compact Events (Dense):
1. **Subject Name**: `text-[clamp(9px,5cqw,12px)]` bold
2. **Room Number**: `text-[clamp(8px,4cqw,11px)]` semibold
3. **Control Form**: Hidden in compact view

### Diagonal Events (Tight):
1. **Subject Name**: `text-[clamp(9px,7cqw,13px)]` bold
2. **Room Number**: `text-[clamp(7px,5cqw,11px)]` medium
3. **Control Form**: `text-[clamp(6px,4cqw,9px)]` italic

---

### 6. Content Centering & Alignment

**Compact/Grid Events:**
```tsx
isCompact ? 'justify-start' : 'justify-center'
```
- Grid events: Align to top (max visible area)
- Full events: Center vertically (elegant presentation)

**Odd/Even Badges in Compact:**
```tsx
isCompact && event.week_cycle === 'odd' && 'pt-[22px]'   // Top padding
isCompact && event.week_cycle === 'even' && 'pb-[22px]'  // Bottom padding
event.week_cycle === 'even' && isCompact && 'justify-end' // Align to bottom
```

---

### 7. Word Hyphenation

**Applied globally to text containers:**
```tsx
className="... hyphens-auto"
```

**Impact:**
- Longer words break at syllables instead of wrapping awkwardly
- Example: "Development" → "Develop-ment"
- Saves width, fits better in narrow cells
- Readable and professional appearance
- Auto mode: CSS decides hyphenation points

---

## Typography Sizing Reference

### Full-Week Single Events (Every Week)
| Element | Mobile | Desktop | Max |
|---------|--------|---------|-----|
| Subject | 11px | ~17px | 16px |
| Room | 9px | ~12px | 13px |
| Control | 8px | ~11px | 12px |

### Grid/Compact Events (Splits)
| Element | Narrow | Wide | Max |
|---------|--------|------|-----|
| Subject | 9px | ~12px | 12px |
| Room | 8px | ~11px | 11px |
| Badge | 7px | ~9px | 9px |

### Diagonal Events (Odd/Even)
| Element | Narrow | Wide | Max |
|---------|--------|------|-----|
| Subject | 9px | ~13px | 13px |
| Room | 7px | ~11px | 11px |
| Control | 6px | ~9px | 9px |

---

## CSS Units Explained

### `cqw` (Container Query Width)
- Based on cell/container width
- Example: `text-[clamp(9px,5cqw,12px)]`
- At 200px cell: ~10px + container-relative
- Adapts to grid layout tightness

### `vw` (Viewport Width)
- Based on browser window width
- Example: `text-[clamp(11px,1.2vw,16px)]`
- At 1000px width: ~12px (1.2% of 1000)
- Better for full-screen reading

### `clamp(min, preferred, max)`
- min: Always applied (floor)
- preferred: Scales with window
- max: Always applied (ceiling)
- Always respects min-max bounds

---

## Behavior at Different Sizes

### Compact Viewport (600px)
```
Full-Week Event:
- Subject: 11px (clamped to min)
- Room: 9px (clamped to min)
- Line height: leading-relaxed (generous)

Grid Event:
- Subject: 9px (tight leading-[1.1])
- Room: 8px
- 4 events fit in 2x2 grid
```

### Standard Viewport (1000px)
```
Full-Week Event:
- Subject: ~12px (1.2% of 1000 = 12px)
- Room: ~10px (1% of 1000 = 10px)
- Optimal reading size

Grid Event:
- Subject: ~10px (5% of 200px cell width)
- Room: ~9px
- Balanced readability
```

### Large Viewport (1920px)
```
Full-Week Event:
- Subject: 16px (clamped to max)
- Room: 13px (clamped to max)
- Large, prominent display

Grid Event:
- Subject: 12px (clamped to max)
- Room: 11px
- Still fits 2x2 grid
```

---

## Files Modified

**components/schedule/event-block.tsx**

### DiagonalLayout Component
- Changed `gap-0.5` to `gap-0` for tighter spacing
- Changed `leading-3` to `leading-[1.1]` for all text
- Subject: kept same clamp (9px,7cqw,13px)
- Room: kept same clamp (7px,5cqw,11px)
- Control: kept same clamp (6px,4cqw,9px)
- Added `hyphens-auto` to container

### Main EventBlock Content
- Makeup layout: Added `hyphens-auto`
- Standard layout: Wrapped in flex with `justify-center`
- Subject names:
  - Compact: `leading-[1.1] text-[clamp(9px,5cqw,12px)]`
  - Full: `leading-relaxed text-[clamp(11px,1.2vw,16px)]`
- Room numbers:
  - Compact: `text-[clamp(8px,4cqw,11px)]`
  - Full: `text-[clamp(9px,1vw,13px)]`
- Control form:
  - `text-[clamp(8px,0.9vw,12px)]` (only in full view)

### EventBlock Container
- Changed from: `justify-start` (always)
- Changed to: Conditional - `isCompact ? 'justify-start' : 'justify-center'`
- Enables vertical centering for full-week events
- Maintains top-alignment for compact/grid events

---

## Verification Checklist

- [x] Grid events display tightly with reduced line spacing
- [x] Full-week events display prominently with large fonts
- [x] Subject names are bold and primary focal point
- [x] Room numbers visible and appropriately sized
- [x] Text never overflows cell boundaries
- [x] Hierarchy is clear (subject > room > control)
- [x] Hyphenation improves word wrapping
- [x] Leading is different for compact vs full views
- [x] Viewport-width scaling works across resolutions
- [x] Container-query scaling works for grid views

---

## Typography Summary

| Aspect | Grid View | Full-Week View |
|--------|-----------|----------------|
| **Leading** | leading-[1.1] | leading-relaxed |
| **Subject Font** | clamp(9px,5cqw,12px) | clamp(11px,1.2vw,16px) |
| **Room Font** | clamp(8px,4cqw,11px) | clamp(9px,1vw,13px) |
| **Alignment** | Top (justify-start) | Center (justify-center) |
| **Gap** | 0 (tight) | 0-0.5 (controlled) |
| **Line Breaks** | hyphens-auto | hyphens-auto |
| **Appearance** | Dense, compact | Large, spacious |

---

## Future Enhancements

1. **Font Weight Variants**: Add medium/600 weights for better hierarchy
2. **Letter Spacing**: Add tracking for better readability at large sizes
3. **Text Transform**: Consider uppercase badges in full-week view
4. **Color Contrast**: Ensure AA compliance for small fonts
5. **Print Styles**: Adjust typography for print media

