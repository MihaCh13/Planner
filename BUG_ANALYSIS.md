# UI BUG ROOT CAUSE ANALYSIS

## BUG 1: BADGE COLLISION (Overlapping Week & Group Badges)

### Symptom
In the corner of event blocks, the Week Type Badge (НЕЧ/ЧЕТ) is physically overlapping with the Group Badge, obscuring it.

### Root Cause
**PRIMARY CULPRIT: Global CSS on `.week-badge` class (app/globals.css, lines 577-610)**

```css
.week-badge {
  position: absolute;  /* <-- THIS IS THE PROBLEM */
  padding: 3px 8px;
  font-size: 9px;
  /* ... other styles ... */
  z-index: 20;
}
```

**DETAIL:** The `.week-badge` class has `position: absolute` defined globally. Even though the component tries to override this with `relative !static transform-none top-auto left-auto` inline classes, the absolute positioning is still being applied because:

1. The CSS class `.week-badge { position: absolute }` is in the stylesheet (higher specificity chain for positioning)
2. Tailwind's `!static` has trouble overriding when children of a flex container expect relative behavior
3. Both badges inside `flex flex-row gap-1` container are trying to be `position: absolute`, causing them to stack at the parent's (0, 0) instead of flowing in flex layout

### Affected Code Locations in `event-block.tsx`:
- **Line 142-152** (Diagonal ODD corner): Week badge + Group badge in same flex container
- **Line 154-164** (Diagonal EVEN corner): Group badge + Week badge in same flex container  
- **Line 203-213** (Compact ODD corner): Week badge + Group badge in same flex container
- **Line 215-225** (Compact EVEN corner): Group badge + Week badge in same flex container

### Why Current Fix Doesn't Work
The component includes `relative !static transform-none top-auto left-auto` classes, but these are fighting against the global `position: absolute` in CSS. The Tailwind `!static` modifier should work, but CSS specificity + browser rendering order makes the absolute positioning persist.

---

## BUG 2: MAKEUP CONTENT LAYOUT (Text Appearing Merged)

### Symptom
Inside the makeup event block, the Exercise Type, Room, and Group Badge appear to be stuck on the same line or merging visually, despite being placed in separate elements.

### Root Cause
**PRIMARY CULPRIT: The `.glassy-badge` class using `display: inline-block` (app/globals.css, line 206-207)**

```css
.glassy-badge {
  display: inline-block;  /* <-- THIS CAUSES FLOW ISSUES */
  padding: 4px 10px;
  /* ... other styles ... */
}
```

**SECONDARY ISSUE: Type abbr in markup is `<div>` with `block` class, but glassy-badge is `inline-block`**

When the makeup layout renders (event-block.tsx, lines 171-192):
1. ROW 1: Subject (block div) ✓ Correct
2. ROW 2: Type abbr (block div) ✓ Correct  
3. ROW 3: Room (block div) ✓ Correct
4. ROW 4: Group badge (glassy-badge with `display: inline-block`) ✗ **PROBLEM**

The `.glassy-badge.mini` inherits `display: inline-block` from line 206-207 in globals.css. Even though the component wraps it in a `block mt-1` container (line 186-188), the inline-block badge might:
- Not break to a new line properly if there's preceding text
- Cause vertical alignment issues with surrounding text

### Affected Code Location in `event-block.tsx`:
- **Lines 171-192**: The entire makeup layout block

```tsx
<div className="flex flex-col w-full">
  {/* ROW 1 */}
  <div className={cn("text-slate-900 font-bold ...", ...)}>
    {event.subject_name}
  </div>
  {/* ROW 2 */}
  <div className="block w-full font-bold text-slate-700 text-[12px] mt-0.5">
    {MAKEUP_ABBREVIATIONS[event.subject_type] || ''}
  </div>
  {/* ROW 3 */}
  <div className={cn("block w-full font-semibold ...", ...)}>
    {event.room || '-'}
  </div>
  {/* ROW 4 */}
  {event.group_number && (
    <div className="block mt-1">
      <div className="glassy-badge mini w-fit text-[10px]">  {/* inline-block! */}
        Група {event.group_number}
      </div>
    </div>
  )}
</div>
```

### Why Current Layout Doesn't Solve It Completely
The component correctly uses `flex flex-col` + `block` elements + `mt-0.5` margins. However, the `.glassy-badge` class still uses `display: inline-block`, which might:
- Cause layout shift issues in compact views
- Create visual merging due to line-height and vertical alignment interactions
- Not respect the `w-full` or wrapping behavior correctly in all cases

---

## SUMMARY TABLE

| Bug | Root Cause | Location | Solution |
|-----|-----------|----------|----------|
| **Badge Collision** | `.week-badge { position: absolute }` in global CSS | `app/globals.css:577-610` | Change `.week-badge` from `position: absolute` to `position: static` or add `position: relative` to flex container |
| **Makeup Layout Merge** | `.glassy-badge { display: inline-block }` in global CSS | `app/globals.css:206-207` | Change `.glassy-badge` from `display: inline-block` to `display: block` in makeup context OR add flex-specific badge class |

---

## Recommended Fixes

### Fix 1: Remove absolute positioning from week-badge (BEST)
```css
/* app/globals.css, line 577 */
.week-badge {
  /* position: absolute;  <-- DELETE THIS LINE */
  padding: 3px 8px;
  /* ... rest of styles ... */
}

/* Then move positioning to individual state classes */
.week-badge.odd-badge {
  /* positioning handled by parent flex container */
  background-color: rgba(240, 101, 149, 0.85);
  /* ... */
}
```

### Fix 2: Create makeup-specific badge variant
```css
/* app/globals.css */
.glassy-badge.makeup-group {
  display: block;  /* Override inline-block */
  width: fit-content;
  margin-top: 0.5rem;
}
```

Then in event-block.tsx:
```tsx
<div className="glassy-badge mini makeup-group">
  Група {event.group_number}
</div>
```

