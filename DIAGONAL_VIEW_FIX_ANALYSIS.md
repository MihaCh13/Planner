# DIAGONAL VIEW FIXES NOT APPLYING - ROOT CAUSE ANALYSIS

## DIAGNOSIS: CODE IS UPDATED, BUT CSS IS BLOCKING IT

### The Problem Confirmed

**Code Status:** ✅ The `isDiagonal` block in `event-block.tsx` HAS been updated with:
- `gap-1.5` (increased spacing)
- `z-30` / `z-20` layering
- Consistent Week Badge FIRST, Group Badge SECOND ordering

**Visual Result:** ❌ Fixes do NOT appear in Diagonal view; they DO work in Grid view

**Root Cause:** The `.event-block.diagonal` CSS class is BLOCKING badge rendering

---

## EXACT ROOT CAUSE

### Location: app/globals.css, lines 512-524

```css
.event-block.diagonal {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border-radius: 0;
  box-shadow: none;
  position: relative;        /* ← CRITICAL: Creates stacking context */
  overflow: hidden;          /* ← CRITICAL: Clips absolutely positioned children! */
}

.event-block.diagonal::before {
  display: none;
}
```

### Why This Blocks Badges

1. **`overflow: hidden`** - This clips any content that extends outside the parent bounds
2. **`position: relative`** - Combined with `overflow: hidden`, this creates a **stacking context**
3. **`position: absolute` children** (the corner badge containers) - Even though they are positioned with `top-1 left-1` and `bottom-1 right-1`, they may be:
   - Getting clipped by the `overflow: hidden`
   - Rendered at the wrong z-index relative to the stacking context
   - Obscured by the content div which has `z-10`

### The Stacking Context Problem

In the diagonal view:
```
.event-block.diagonal {
  position: relative;        ← Creates stacking context
  overflow: hidden;          ← Clips content outside bounds
  
  Children with position: absolute are clipped!
  
  [Content Div] (z-10)       ← This obscures the badges
  [Badge Container] (z-20)   ← Gets clipped or stacked behind
}
```

In the grid view (no `.diagonal` class):
```
.event-block {
  position: relative;
  
  [Content Div] (z-10)
  [Badge Container] (z-20)   ← Works because no overflow: hidden
}
```

---

## COMPARISON: Diagonal vs Standard Blocks

### In Diagonal View - event-block.tsx lines 88-170

The JSX renders:
```tsx
{isDiagonal ? (
  <>
    {/* Main content - absolute positioned, z-10 */}
    <div className="absolute w-full h-full z-10 flex ...">
      {/* Subject and room */}
    </div>
    
    {/* Corner badges - absolute positioned, z-20 */}
    <div className="absolute top-1 left-1 ... z-20 ...">
      {/* Week badge z-30, Group badge z-20 */}
    </div>
  </>
)}
```

**CSS Applied to this:**
```css
.event-block.diagonal {
  position: relative;     /* Creates stacking context */
  overflow: hidden;       /* CLIPS children positioned outside! */
}
```

### In Standard/Grid View - event-block.tsx lines 195+

The JSX renders:
```tsx
{!isDiagonal && (
  <>
    {/* Main content - flex-based, no absolute positioning */}
    <div className="flex-1 flex flex-col ...">
      {/* Content */}
    </div>
    
    {/* Corner badges - absolute positioned, z-20 */}
    <div className="absolute top-1 left-1 ... z-20 ...">
      {/* Week badge z-30, Group badge z-20 */}
    </div>
  </>
)}
```

**CSS Applied to this:**
```css
.event-block {
  /* NO overflow: hidden here! */
  position: relative;
}
```

**Result:** Badges render fine because there's no `overflow: hidden` to clip them.

---

## The Solution

### Option A: Remove overflow: hidden from diagonal view (RECOMMENDED)

**File:** app/globals.css, lines 512-524

Change:
```css
.event-block.diagonal {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border-radius: 0;
  box-shadow: none;
  position: relative;
  /* overflow: hidden;  ← DELETE THIS */
}
```

**Why:** The diagonal view content is padded (pt-8, pb-8) to avoid corners, so `overflow: hidden` isn't needed. Removing it allows badges to render properly.

---

### Option B: Change z-index stacking (ALTERNATIVE - Not recommended)

Increase badge z-index to 40-50 to ensure they render above all content. But this is a band-aid - the real issue is the `overflow: hidden`.

---

### Option C: Use clip-path instead of overflow: hidden (ADVANCED)

Replace `overflow: hidden` with `clip-path: polygon(...)` that explicitly excludes corner areas. Overcomplicated and not recommended.

---

## Summary Table

| Aspect | Diagonal View | Standard/Grid View | Result |
|--------|---------------|--------------------|--------|
| **CSS Applied** | `.event-block.diagonal { overflow: hidden; }` | `.event-block { no overflow }` | Badges clipped in diagonal only |
| **Badge Position** | `position: absolute` | `position: absolute` | ✓ Same in both |
| **Z-Index** | `z-20`, `z-30` | `z-20`, `z-30` | ✓ Same in both |
| **Content Z-Index** | `z-10` | `z-10` | ✓ Same in both |
| **Visible Result** | ❌ Badges hidden | ✅ Badges visible | `overflow: hidden` is culprit |

---

## RECOMMENDED FIX

**Single line change in app/globals.css:**

Remove `overflow: hidden;` from `.event-block.diagonal` class (line 520).

This will:
- ✅ Allow badges to render in diagonal view
- ✅ Maintain padding to avoid corner overlap
- ✅ Keep the flex layout and positioning working
- ✅ Match the behavior of the Grid view

