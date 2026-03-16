# CSS Architecture

**Location:** `packages/ui/src/styles/`

---

## Dependency Direction

CSS imports flow **top to bottom only.** Each layer depends only on the layer above it.

```
palette.css          ← Color tokens (single source of truth)
     │
theme.css           ← Semantic mapping (consumes tokens)
     │
globals.css          ← Entry point (composes everything)
     │
apps/web/src/        ← App CSS (@import "@workspace/ui/globals.css")
```

---

## File Responsibilities

| File          | Role                                        | Changes When                                   |
| ------------- | ------------------------------------------- | ---------------------------------------------- |
| `palette.css` | Base color scales (50-950) via `@theme`     | Adding/adjusting a color value                 |
| `theme.css`  | Semantic variable mapping + `@theme inline` | Changing which palette color a UI role uses    |
| `globals.css` | Tailwind imports, `@source`, `@layer base`  | Changing global base styles or Tailwind config |

Each file has **one reason to change.** Adjusting a hue touches `palette.css`. Remapping dark mode touches `theme.css`. Neither requires modifying `globals.css`.

---

## Layer Details

### palette.css — Color Tokens

Defines base color scales using Tailwind v4's `@theme` directive. This generates both CSS variables (`--color-gray-50`) and utility classes (`bg-gray-50`, `text-red-600`).

```css
@theme {
  --color-gray-50: oklch(0.985 0 0);
  --color-gray-100: oklch(0.97 0 0);
  /* ... 200-950 */

  --color-red-50: oklch(0.971 0.013 17.38);
  /* ... */
}
```

**Available scales:** gray, red, blue, orange, green, yellow, purple

**Rules:**

- All color values use oklch format.
- Values must form a perceptually smooth gradient within each scale.
- No semantic meaning here — just raw color definitions.

### theme.css — Semantic Mapping

Maps shadcn's semantic variables to palette tokens. Contains two sections:

1. **`@theme inline`** — Registers semantic names as Tailwind utilities (`bg-primary`, `text-muted-foreground`).
2. **`:root` / `.dark`** — Assigns palette colors to semantic roles per theme.

```css
@theme inline {
  --color-primary: var(--primary);
  /* ... */
}

:root {
  --primary: var(--color-gray-900);
  /* ... */
}

.dark {
  --primary: var(--color-gray-200);
  /* ... */
}
```

**Why `@theme inline` lives here, not in `globals.css`:**
Semantic utility registration and semantic variable definition are the same concern. Co-locating them prevents cross-file dependency for a single change.

### globals.css — Entry Point

Composes everything and defines global base styles. This is the file apps import.

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "./palette.css";
@import "./theme.css";

@source "..";

@custom-variant dark (&:is(.dark *));

@layer base {
  /* ... */
}
```

**`@source ".."`** points to `packages/ui/src/` so Tailwind scans all component files for class usage.

---

## How to Use Colors in Code

### Palette utilities — direct color reference

```tsx
<div className="bg-gray-100 text-gray-900" />
<span className="text-red-600" />
```

Use when the color is context-independent (e.g., a one-off decorative element).

### Semantic utilities — role-based reference

```tsx
<div className="bg-background text-foreground" />
<button className="bg-primary text-primary-foreground" />
```

Use for UI roles that change between light/dark themes. All shadcn components use these.

---

## Adding a New Color Scale

1. Add the scale to `palette.css`:

```css
@theme {
  --color-teal-50: oklch(...);
  --color-teal-100: oklch(...);
  /* ... 200-950 */
}
```

2. If a semantic variable should use it, update `theme.css`:

```css
:root {
  --chart-3: var(--color-teal-600);
}
```

No other files need modification.

## Changing a Theme Color

To change the primary color from gray to blue:

```css
/* theme.css */
:root {
  --primary: var(--color-blue-700); /* was gray-900 */
  --primary-foreground: var(--color-blue-50); /* was gray-50 */
}

.dark {
  --primary: var(--color-blue-400); /* was gray-200 */
  --primary-foreground: var(--color-blue-950); /* was gray-900 */
}
```

`palette.css` and `globals.css` remain untouched.
