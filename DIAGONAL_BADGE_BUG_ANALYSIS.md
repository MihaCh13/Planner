# DIAGONAL VIEW BADGE OVERLAP & COLOR BUG ANALYSIS

## ROOT CAUSES IDENTIFIED

### BUG 1: Color Distortion in Week Badge (TRANSPARENCY OVERLAY)

**Symptom:** Week Badge appears washed out or has wrong color in diagonal view.

**Root Cause:** The `.glassy-badge` class (Group Badge) has **semi-transparent background** that renders **on top of** the Week Badge.

**Exact CSS Issue - app/globals.css, lines 206-207:**
```css
.glassy-badge {
  display: inline-block;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.7);  /* ← 70% WHITE TRANSPARENCY */
  backdrop-filter: blur(12px);
  /* ... */
}
```

The `.glassy-badge.mini` (Group Badge) is rendered **SECOND** in the DOM (lines 151-154 in event-block.tsx):
1. Week Badge (pink/blue) renders FIRST
2. Group Badge (glassy white 0.7 opacity) renders SECOND → **sits on top**
3. The semi-transparent white (0.7 opacity) filters/desaturates the Week Badge color below it

**Diagram:**
```
ODD CORNER Layout (Top-Left):
┌─────────────────────────────┐
│ [Week Badge НЕЧ] [Group A] │  ← Both in same flex row
│ (Pink #F06595)  (Glassy)    │
│                             │
│ Problem: Group Badge (0.7   │
│ opacity white) sits on top,  │
│ filtering the pink badge     │
│ underneath it.              │
└─────────────────────────────┘
```

---

### BUG 2: Badge Overlap (DOM Rendering Order Issue)

**Symptom:** Badges appear to be physically stacking on top of each other, not side-by-side.

**Root Cause:** In `flex flex-row items-center gap-1` container, the badges are rendering but the **z-index layering** combined with **opacity** makes the second badge appear to overlap the first.

**Current Code Structure - event-block.tsx, lines 142-154:**
```tsx
{/* ODD WEEK CORNER (Top-Left): [Week] [Group] INLINE */}
{event.week_cycle === 'odd' && (displayWeekBadge || groupLabel) && (
  <div className="absolute top-1 left-1 flex flex-row items-center gap-1 z-20 pointer-events-none">
    {displayWeekBadge && (
      <div className="week-badge odd-badge">        {/* renders FIRST */}
        НЕЧ
      </div>
    )}
    {groupLabel && (
      <div className="glassy-badge mini">           {/* renders SECOND (on top) */}
        {groupLabel}
      </div>
    )}
  </div>
)}
```

**Why It Overlaps:**
1. Flex container has `flex-row` + `gap-1` (which adds only 0.25rem spacing = 4px)
2. Week Badge: `padding: 3px 8px` (width ≈ 35-40px)
3. Glassy Badge: `padding: 4px 10px` (width ≈ 35-50px depending on text)
4. The glassy badge's **semi-transparent background** + **gap-1** makes the visual overlap appear worse
5. Flex layout is correct, but the transparency creates a visual illusion of stacking

**Diagram:**
```
Actual Layout (Correct Flex):
┌───────────────┬─────────────────┐
│ [НЕЧ Badge]  │ gap=4px │ [A Badge]   │
└───────────────┴─────────────────┘
  Week Badge        (correct spacing)    Group Badge

Visual Perception (Due to Transparency):
┌───────────────┐
│ [НЕЧ Badge]   │
│  └────────────────────┐
│     [A Badge (0.7 opacity white)]
│     Appears to obscure week badge
└─────────────────────┘
```

---

## DETAILED CODE ANALYSIS

### Issue Locations

**1. event-block.tsx - Diagonal ODD Corner (lines 142-154)**
```tsx
<div className="absolute top-1 left-1 flex flex-row items-center gap-1 z-20 pointer-events-none">
  {displayWeekBadge && (
    <div className="week-badge odd-badge">
      НЕЧ
    </div>
  )}
  {groupLabel && (
    <div className="glassy-badge mini">  {/* ← Semi-transparent (0.7 opacity white) */}
      {groupLabel}
    </div>
  )}
</div>
```

**2. event-block.tsx - Diagonal EVEN Corner (lines 155-167)**
```tsx
<div className="absolute bottom-1 right-1 flex flex-row items-center gap-1 z-20 pointer-events-none">
  {groupLabel && (
    <div className="glassy-badge mini">  {/* ← Renders FIRST */}
      {groupLabel}
    </div>
  )}
  {displayWeekBadge && (
    <div className="week-badge even-badge">  {/* ← Renders SECOND (on top) */}
      ЧЕТ
    </div>
  )}
</div>
```

**3. app/globals.css - Glassy Badge (line 206-207)**
```css
.glassy-badge {
  display: inline-block;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.7);  {/* ← HIGH OPACITY WHITE FILTER */}
  backdrop-filter: blur(12px);
  /* ... */
}
```

---

## SOLUTION STRATEGY

### Fix 1: Increase Gap Between Badges
**Problem:** `gap-1` (4px) is too small; badges appear to touch/overlap
**Solution:** Increase to `gap-2` (8px) or `gap-3` (12px)

### Fix 2: Reduce Glassy Badge Opacity (Optional)
**Problem:** Semi-transparent white (0.7) filters the color below it
**Solution:** Reduce opacity to 0.6 or make it more opaque (0.85)

OR

**Alternative:** Change glassy-badge background to be more transparent or use a colored background instead of white

### Fix 3: Ensure Z-Index Separation (Already in place)
- Parent container: `z-20`
- Both badges inherit z-index
- Week-badge class has `z-index: 20` (redundant but doesn't hurt)
- Status: ✓ Correct

---

## RECOMMENDED FIXES

### Option A: Increase Badge Gap (BEST - Simple & Effective)
Change flex container from `gap-1` to `gap-2`:
```tsx
<div className="absolute top-1 left-1 flex flex-row items-center gap-2 z-20 pointer-events-none">
  {/* badges */}
</div>
```

### Option B: Reduce Glassy Badge Opacity
Change in app/globals.css:
```css
.glassy-badge {
  background: rgba(255, 255, 255, 0.85);  /* was 0.7 */
}
```

### Option C: Reorder Badges in EVEN Corner
In event-block.tsx lines 155-167, swap the order:
```tsx
{/* Render Week Badge FIRST, Group Badge SECOND */}
{displayWeekBadge && (
  <div className="week-badge even-badge">
    ЧЕТ
  </div>
)}
{groupLabel && (
  <div className="glassy-badge mini">
    {groupLabel}
  </div>
)}
```

This ensures Week Badge renders **first** in EVEN corner (like ODD corner), so it appears **underneath** visually.

---

## SUMMARY

| Issue | Root Cause | Location | Fix |
|-------|-----------|----------|-----|
| **Color Distortion** | Glassy Badge (0.7 opacity white) renders on top of Week Badge, filtering its color | event-block.tsx + app/globals.css | Increase gap OR reduce opacity |
| **Visual Overlap** | Small gap (4px) + semi-transparent badge makes badges appear to touch | event-block.tsx lines 142-167 | Change `gap-1` to `gap-2` or `gap-3` |
| **EVEN Corner Order Issue** | Group Badge renders FIRST, Week Badge SECOND (reversed from ODD), causing visual hierarchy confusion | event-block.tsx lines 155-167 | Reorder so Week Badge is first |

