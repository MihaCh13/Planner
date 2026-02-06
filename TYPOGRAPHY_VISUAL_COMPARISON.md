# Typography Refinement - Visual Comparison

## Side-by-Side Comparison

### SCENARIO 1: Grid/Split View (2x2 Events)

#### Before Refinement
```
┌──────────────────────────────┐
│ Advanced Programming        │  ← leading-tight (loose)
│ Concepts                    │  
│ Lab 105                     │  
│                             │  ← Space wasted
└──────────────────────────────┘

Font Sizes:
- Subject: 9-12px (clamp with 5cqw)
- Room: 8-11px
- Line height: 1.25 (loose)
```

#### After Refinement
```
┌──────────────────────────────┐
│ Advanced Programm.          │  ← leading-[1.1] (tight)
│ Concepts                    │  
│ Lab 105                     │  
└──────────────────────────────┘

Font Sizes:
- Subject: 9-12px (same clamp)
- Room: 8-11px (same)
- Line height: 1.1 (tight)
- Hyphenation: auto

Visual Result:
✓ ~3-4px saved vertically per row
✓ Better fit in 2x2 grids
✓ Tighter, more professional appearance
✓ Still readable at all sizes
```

---

### SCENARIO 2: Full-Week Single Event

#### Before Refinement
```
┌─────────────────────────────────────┐
│                                     │
│           Database Design           │  ← 9px baseline
│           Lab 201                   │     Looks small
│                                     │
│                                     │
└─────────────────────────────────────┘

Font Sizes:
- Subject: 9-12px (clamp with 5cqw)
- Room: 8-11px
- Aligned to top
- Leading: tight
```

#### After Refinement
```
┌─────────────────────────────────────┐
│                                     │
│           Database Design           │  ← 11px baseline (larger!)
│           Lab 201                   │     Responsive to viewport
│                                     │
│                                     │
└─────────────────────────────────────┘

Font Sizes:
- Subject: 11-16px (clamp with 1.2vw) ← NEW: 1.2vw scaling
- Room: 9-13px (clamp with 1vw) ← NEW: 1vw scaling
- Centered vertically
- Leading: relaxed (1.625)

At 800px viewport:
- Subject: 11 + (800 × 1.2% = 9.6px) = ~11px base
- Actually shown: ~12px (balances with relaxed leading)

At 1920px viewport:
- Subject: clamped to 16px (max)
- Room: clamped to 13px (max)
```

---

### SCENARIO 3: Diagonal Split (Odd/Even Weeks)

#### Before Refinement
```
╱────────────────────────╲
│ Advanced    ↑ НЕЧ      │  ← Loose leading
│ Programming            │     Odd week
│ Lab 105    badge      │
╲─────────────────────────╱

╱────────────────────────╲
│                        │
│       Database      ←  │  Even week
│       201         ЧЕТ  │
╲─────────────────────────╱
```

#### After Refinement
```
╱────────────────────────╲
│ Advanced ↑ НЕЧ        │  ← Tight leading-[1.1]
│ Programm.             │     Saves space
│ Lab 105              │     Better fit
╲─────────────────────────╱

╱────────────────────────╲
│                        │
│      Database      ←  │  Even week
│      201         ЧЕТ  │
╲─────────────────────────╱

Changes:
- Leading: leading-[1.1] (was leading-3/tight)
- Gap: 0 (was 0.5)
- Subject: text-[clamp(9px,7cqw,13px)]
- Room: text-[clamp(7px,5cqw,11px)]
- Control: text-[clamp(6px,4cqw,9px)]
```

---

## Font Scaling Behavior

### Grid Events - Container Query Based (cqw)

```
Cell Width: 150px
├─ Subject font: 9px + (150 × 5%) = 9 + 7.5 = ~16px → clamped to 12px MAX
├─ Room font: 8px + (150 × 4%) = 8 + 6 = 14px → clamped to 11px MAX
└─ Result: Both at maximum

Cell Width: 100px
├─ Subject font: 9px + (100 × 5%) = 9 + 5 = 14px → OK
├─ Room font: 8px + (100 × 4%) = 8 + 4 = 12px → clamped to 11px MAX
└─ Result: Slightly reduced

Cell Width: 50px (very tight)
├─ Subject font: 9px (minimum) ✓ Still readable
├─ Room font: 8px (minimum) ✓ Still readable
└─ Result: Both at minimum - still visible!
```

### Full Events - Viewport Width Based (vw)

```
Viewport: 800px
├─ Subject: 11px + (800 × 1.2%) = 11 + 9.6 = ~20px → clamped to 16px MAX
├─ Room: 9px + (800 × 1%) = 9 + 8 = 17px → clamped to 13px MAX
├─ Control: 8px + (800 × 0.9%) = 8 + 7.2 = ~15px → clamped to 12px MAX
└─ Result: All at near-maximum - PROMINENT

Viewport: 1920px
├─ Subject: 11 + (1920 × 1.2%) = 11 + 23 = 34px → clamped to 16px MAX ✓
├─ Room: 9 + (1920 × 1%) = 9 + 19 = 28px → clamped to 13px MAX ✓
├─ Control: 8 + (1920 × 0.9%) = 8 + 17 = 25px → clamped to 12px MAX ✓
└─ Result: All at maximum - VERY PROMINENT

Viewport: 600px (mobile)
├─ Subject: 11 + (600 × 1.2%) = 11 + 7.2 = ~18px → stays near 11px minimum? 
   ACTUALLY: clamp(11px, 7.2px [relative value], 16px) = 11px (min wins)
├─ Room: 9 + (600 × 1%) = 9 + 6 = 15px → stays near 9px
├─ Control: 8 + (600 × 0.9%) = 8 + 5.4 = ~13px → stays near 8px
└─ Result: All at minimum - but still readable!
```

---

## Leading (Line Height) Impact

### Grid Event with Tight Leading

```
BEFORE (leading-tight = 1.25):
Line 1: "Advanced Programming"
        +12.5% extra space = 13.2px total

Line 2: "Concepts" 
        +12.5% extra space = 13.2px total

Total height: 26.4px for 2 lines

AFTER (leading-[1.1] = 1.1):
Line 1: "Advanced Programming"
        +10% extra space = 11px total

Line 2: "Concepts"
        +10% extra space = 11px total

Total height: 22px for 2 lines

SAVED: 4.4px (16.7% reduction)
```

### Full Event with Relaxed Leading

```
Subject (16px):
- leading-relaxed = 1.625 ratio
- Line height: 16 × 1.625 = 26px
- Space below: 10px extra (comfortable reading)

Room (13px):
- Same relaxed: 13 × 1.625 = 21.1px
- Space below: 8px extra

Total with spacing:
Subject + margin: 26 + 4 = 30px
Room + margin: 21 + 4 = 25px
Total: ~55px for both lines (spacious!)

Comparison to Grid (same size):
Grid version: 22px + 18px = 40px
Full version: 30px + 25px = 55px

Difference: +15px (37.5% more generous!)
```

---

## Word Wrapping Improvement

### Without Hyphenation (hyphens: none)

```
Cell: 90px wide

BEFORE:
┌──────────────┐
│ Development │  ← Fits
│ Strategies  │
└──────────────┘

But with longer word:
┌──────────────┐
│ Biomedical  │  ← Squeezed, hard to read
│ Engineering │
└──────────────┘

And even longer:
┌──────────────┐
│ Developmen  │  ← BROKEN, cut off!
│ t Strategies│
└──────────────┘
```

### With Hyphenation (hyphens-auto) ✓

```
Cell: 90px wide

AFTER:
┌──────────────┐
│ Biomedical  │
│ Engineering │
└──────────────┘

With longer word:
┌──────────────┐
│ Develop-ment│  ← Hyphenated naturally
│ Strategies  │
└──────────────┘

Benefit: Words break at natural syllables, not awkwardly cut
```

---

## Hierarchy Before vs After

### Before (Unclear Distinction)

```
┌─────────────────────────┐
│ Database Design         │  ← Both grid and full: same size
│ Lab 201                 │
└─────────────────────────┘

┌──────────┐  ┌──────────┐
│ Database │  │ Physics  │  ← Grid cells: same as above
│ Lab 201  │  │ Lab 105  │
└──────────┘  └──────────┘

Visual: "These all look the same importance"
```

### After (Clear Hierarchy)

```
┌──────────────────────────┐
│                          │
│    Database Design       │  ← LARGE (11-16px)
│    Lab 201               │     CENTERED
│                          │     PROMINENT
└──────────────────────────┘

┌──────────┐  ┌──────────┐
│ Database │  │ Physics  │  ← COMPACT (9-12px)
│ Lab 201  │  │ Lab 105  │     Tight spacing
└──────────┘  └──────────┘

Visual: "Full event stands out, grids are efficient"
```

---

## Rendering Sequence

### 1. Browser Loads
- Interprets clamp() function
- Applies container-type: inline-size
- Measures viewport width

### 2. Grid Events Render
- Container: 150px (cell width)
- Subject: clamp(9px, 7.5%, 12px) = varies based on 150px width
- Leading: 1.1 (tight)
- Result: Compact, grid-friendly

### 3. Full Events Render
- Viewport: 1000px (example)
- Subject: clamp(11px, 12px [1% of 1000], 16px) = 12px
- Leading: 1.625 (relaxed)
- Alignment: center
- Result: Prominent, spacious

### 4. Responsive Adjustment
- Window resize → recalculates vw values
- Viewport width change → text scales smoothly
- No jump, smooth animation

---

## Summary Table

| Aspect | Grid View | Full-Week View |
|--------|-----------|----------------|
| **Font** | clamp(9px, 5cqw, 12px) | clamp(11px, 1.2vw, 16px) |
| **Leading** | 1.1 (tight) | 1.625 (relaxed) |
| **Height** | Compact | Spacious |
| **Alignment** | Top | Center |
| **Wrapping** | Auto hyphen | Auto hyphen |
| **Gap** | 0 | 0.5 |
| **Appearance** | Dense, efficient | Large, prominent |
| **Use Case** | 2x2 splits, diagonals | Single events |

---

**Result**: Users immediately recognize full-week events as primary content, while grid events are secondary and compact. Text scales smoothly and always remains readable!

