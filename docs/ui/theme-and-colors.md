# Theme and Colors System Documentation

This document provides a comprehensive technical overview of how theme switching and color variables are implemented in the SMS Parking App. It covers the architecture, implementation details, and usage patterns.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture Diagram](#architecture-diagram)
3. [CSS Variables System (Design Tokens)](#css-variables-system-design-tokens)
4. [Theme Context & Provider](#theme-context--provider)
5. [useTheme Hook](#usetheme-hook)
6. [Flash-of-Wrong-Theme Prevention](#flash-of-wrong-theme-prevention)
7. [ThemeSwitch Component](#themeswitch-component)
8. [Usage Patterns in Components](#usage-patterns-in-components)
9. [Adding New Colors or Tokens](#adding-new-colors-or-tokens)
10. [Key Files Reference](#key-files-reference)

---

## Overview

The theming system implements **light** and **dark** modes using a combination of:

- **CSS Custom Properties (Variables)** for colors that automatically switch based on theme
- **React Context** for programmatic access to the current theme and toggle function
- **`data-theme` HTML attribute** on `<html>` element as the single source of truth for CSS
- **localStorage** for persistence across sessions
- **System preference detection** via `prefers-color-scheme` media query

The approach ensures:

- ✅ No flash of incorrect theme on page load
- ✅ Respects user's OS/browser preference by default
- ✅ User preference persists across sessions
- ✅ Automatic reactivity when system preference changes
- ✅ Zero JavaScript required for most color changes (CSS-only)

---

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              index.html                                       │
│   <script> runs BEFORE React → sets data-theme immediately                   │
│   Prevents flash of wrong theme                                               │
└───────────────────────────────────┬──────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                               App.tsx                                         │
│   <ThemeProvider> wraps the entire application                               │
└───────────────────────────────────┬──────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                          ThemeContext.tsx                                     │
│   • Manages theme state: 'light' | 'dark'                                    │
│   • Listens to system preference changes (MediaQueryList)                    │
│   • Persists preference to localStorage('theme-preference')                  │
│   • Updates data-theme attribute on <html> when theme changes                │
└───────────────────────────────────┬──────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                             index.css                                         │
│   :root { /* Light mode - default variables */ }                             │
│   [data-theme='dark'] { /* Dark mode - overridden variables */ }             │
└───────────────────────────────────┬──────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                             Components                                        │
│   • SCSS/CSS: Use var(--token-name) → automatic theme switching              │
│   • React: Use useTheme() hook → conditional rendering (images, logic)       │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## CSS Variables System (Design Tokens)

Location: `src/index.css`

The color system uses a **three-tier token architecture**:

### Tier 1: Primitives

Raw color values with no semantic meaning. These are the actual hex codes.

```css
:root {
  /* Grays */
  --gray-white: #ffffff;
  --gray-gray50: #f8f8fa;
  --gray-gray100: #939eac;
  --gray-gray200: #3f4e64;
  --gray-gray300: #2c394b;
  --gray-gray400: #222c39;
  --gray-gray500: #1b242f;

  /* Blues */
  --blue-blue50: #e7edf0;
  --blue-blue100: #cfd8e4;
  --blue-blue200: #1c74e8;
  --blue-blue300: #1667d1;

  /* Reds */
  --red-red50: #fceef0;
  --red-red100: #ee4e62;
  --red-red200: #d63044;
  --red-red300: #6b373d;

  /* Greens */
  --green-green50: #ebfff4;
  --green-green100: #33c676;
  --green-green200: #26ae65;
  --green-green300: #1e3428;

  /* Yellows */
  --yellow-yellow100: #fffad8;
  --yellow-yellow200: #efdb99;
  --yellow-yellow300: #645934;
  --yellow-yellow400: #444024;

  /* Orange */
  --orange-orange100: #ec661a;
}
```

### Tier 2: Semantic Aliases

Named references to primitives. These add meaning but are theme-agnostic.

```css
:root {
  --brand-blue: var(--blue-blue300);
  --brand-blue-lighter: var(--blue-blue200);
  --blue-light: var(--blue-blue100);
  --blue-lighter: var(--blue-blue50);
  --darkest: var(--gray-gray500);
  --darker: var(--gray-gray400);
  --dark: var(--gray-gray300);
  --light: var(--gray-gray200);
  --lighter: var(--gray-gray100);
  --lightest: var(--gray-gray50);
  --white: var(--gray-white);
  --orange: var(--orange-orange100);
  --red-dark: var(--red-red200);
  --red-light: var(--red-red100);
  --success-dark: var(--green-green200);
  --success-light: var(--green-green100);
  /* ... */
}
```

### Tier 3: Component/Mapped Tokens (Theme-Aware)

These are the tokens you actually use in components. They reference semantic aliases and **change based on the active theme**.

#### Light Mode (default in `:root`):

```css
:root {
  /* Surfaces */
  --surface-action-primary-static: var(--brand-blue);
  --surface-action-primary-hover: var(--brand-blue-lighter);
  --surface-action-primary-disabled: var(--lighter);
  --surface-action-secondary-static: var(--white);
  --surface-action-secondary-hover: var(--lightest);
  --surface-action-destructive-static: var(--red-dark);
  --surface-action-destructive-hover: var(--red-light);
  --surface-background-light: var(--white);
  --surface-background-dark: var(--blue-lighter);
  --surface-background-gray: var(--lightest);
  --surface-dropdown: var(--white);

  /* Text & Icons */
  --text-icon-primary-dark: var(--darker);
  --text-icon-primary-light: var(--white);
  --text-icon-secondary-dark: var(--lighter);
  --text-icon-brand-static: var(--brand-blue);
  --text-icon-brand-hover: var(--brand-blue-lighter);
  --text-icon-destructive: var(--red-dark);

  /* Borders */
  --border-dark: var(--blue-light);
  --border-light: var(--blue-lighter);
  --border-brand: var(--brand-blue);
  --border-destructive: var(--red-dark);
  --border-success: var(--surface-success-static);

  /* ... */
}
```

#### Dark Mode (`[data-theme='dark']` selector):

```css
[data-theme='dark'] {
  /* Surfaces - inverted/adjusted for dark backgrounds */
  --surface-action-primary-static: var(--brand-blue-lighter);
  --surface-action-primary-hover: var(--brand-blue);
  --surface-action-secondary-static: var(--darker);
  --surface-action-secondary-hover: var(--dark);
  --surface-background-light: var(--darker);
  --surface-background-dark: var(--darkest);
  --surface-background-gray: var(--dark);
  --surface-dropdown: var(--darkest);

  /* Text & Icons - adjusted for dark backgrounds */
  --text-icon-primary-dark: var(--white);
  --text-icon-secondary-light: var(--darkest);
  --text-icon-brand-static: var(--brand-blue-lighter);
  --text-icon-brand-hover: var(--brand-blue);

  /* Borders */
  --border-dark: var(--light);
  --border-light: var(--darkest);

  /* ... */
}
```

### Token Naming Convention

| Prefix         | Purpose                           | Examples                                                        |
| -------------- | --------------------------------- | --------------------------------------------------------------- |
| `--surface-`   | Background colors for UI elements | `--surface-action-primary-static`, `--surface-background-light` |
| `--text-icon-` | Colors for text and icons         | `--text-icon-primary-dark`, `--text-icon-brand-static`          |
| `--border-`    | Border colors                     | `--border-dark`, `--border-brand`                               |

| Suffix                    | Meaning               |
| ------------------------- | --------------------- |
| `-static`                 | Default/resting state |
| `-hover`                  | Hover/focus state     |
| `-disabled`               | Disabled state        |
| `-light` / `-dark`        | Contrast variant      |
| `-primary` / `-secondary` | Importance level      |

---

## Theme Context & Provider

Location: `src/context/ThemeContext.tsx`

### Interface

```typescript
export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
```

### Key Functions

#### `getColorPreference()`

Determines the initial theme on app load:

```typescript
const getColorPreference = (): 'light' | 'dark' => {
  // 1. Check localStorage for saved preference
  const storedPreference = localStorage.getItem('theme-preference');
  if (storedPreference) {
    return storedPreference as 'light' | 'dark';
  }

  // 2. Fall back to system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};
```

#### `reflectPreference()`

Syncs the theme to the DOM:

```typescript
const reflectPreference = (theme: 'light' | 'dark') => {
  document.documentElement.setAttribute('data-theme', theme);
};
```

### ThemeProvider Component

```typescript
export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(getColorPreference);

  useEffect(() => {
    // Apply theme to DOM
    reflectPreference(theme);

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'dark' : 'light';
      setTheme(newTheme);
      localStorage.setItem('theme-preference', newTheme);
      reflectPreference(newTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme-preference', newTheme);
    reflectPreference(newTheme);
  };

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};
```

### How It's Used in App

In `App.tsx`, the `ThemeProvider` wraps the entire application:

```tsx
<ThemeProvider>
  <RouterProvider router={router} />
</ThemeProvider>
```

---

## useTheme Hook

Location: `src/hooks/useTheme.ts`

A convenience hook to access the theme context:

```typescript
import {ThemeContext, ThemeContextType} from '@/context/ThemeContext';
import {useContext} from 'react';

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

### Returns

| Property      | Type                | Description                       |
| ------------- | ------------------- | --------------------------------- |
| `theme`       | `'light' \| 'dark'` | Current active theme              |
| `toggleTheme` | `() => void`        | Function to switch between themes |

---

## Flash-of-Wrong-Theme Prevention

Location: `index.html`

A critical inline script runs **before React loads** to prevent users seeing the wrong theme briefly:

```html
<script>
  const getTheme = () => {
    const storageKey = 'theme-preference';
    const storedPreference = localStorage.getItem(storageKey);
    if (storedPreference) {
      return storedPreference;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const reflectPreference = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
  };

  reflectPreference(getTheme());
</script>
```

**Why this matters:**

- React takes time to hydrate/render
- Without this script, the page would briefly show light mode (CSS default) before React sets the theme
- This script runs synchronously in the `<head>`, so `data-theme` is set before any content renders

---

## ThemeSwitch Component

Location: `src/components/ThemeSwitch/`

The UI toggle component for switching themes:

```tsx
import {useTheme} from '@/hooks/useTheme';

const ThemeSwitch = () => {
  const {theme, toggleTheme} = useTheme();
  const isLightMode = theme === 'light';

  return (
    <div
      className={classNames('theme-switch', {
        'theme-switch--toggled': !isLightMode,
      })}
      role="switch"
      aria-checked={!isLightMode}
      onClick={() => toggleTheme()}
    >
      <div className="theme-switch__circle"></div>
      <span
        className={classNames('theme-switch__icon', {
          'theme-switch__icon--active': isLightMode,
        })}
      >
        <FontAwesomeIcon icon={'fa-solid fa-sun-bright'} />
      </span>
      <span
        className={classNames('theme-switch__icon', {
          'theme-switch__icon--active': !isLightMode,
        })}
      >
        <FontAwesomeIcon icon={'fa-solid fa-moon'} />
      </span>
    </div>
  );
};
```

### Styling Notes

- Uses CSS variables for colors (`--surface-background-dark`, `--text-icon-brand-static`, etc.)
- Animated sliding circle controlled by `--toggled` modifier class
- Transition: `left 0.2s ease-in-out`

---

## Usage Patterns in Components

### Pattern A: CSS Variables (Recommended for Colors)

Most theming is handled purely through CSS. Components reference semantic tokens, and colors automatically update when `data-theme` changes:

```scss
// Example: Button.scss
.btn--primary {
  background-color: var(--surface-action-primary-static);
  color: var(--text-icon-primary-light);
  border: 1px solid var(--border-brand);

  &:hover {
    background-color: var(--surface-action-primary-hover);
  }

  &:disabled {
    background-color: var(--surface-action-primary-disabled);
  }
}

.btn--secondary {
  background-color: var(--surface-action-secondary-static);
  color: var(--text-icon-brand-static);

  &:hover {
    background-color: var(--surface-action-secondary-hover);
  }
}
```

**Benefits:**

- No JavaScript required for color changes
- Zero re-renders when theme changes
- CSS handles the transition automatically

### Pattern B: useTheme Hook (For Conditional Assets)

When you need different images, SVGs, or logic per theme:

```tsx
// Example: Loading different images per theme
import {useTheme} from '@/hooks/useTheme';

const ZeroState = () => {
  const {theme} = useTheme();
  const isLightMode = theme === 'light';

  return <img src={isLightMode ? '/zero-state-light.svg' : '/zero-state-dark.svg'} alt="No data" />;
};
```

```tsx
// Example: Sidebar collapse icons
const Sidebar = () => {
  const {theme} = useTheme();
  const isLightMode = theme === 'light';

  return (
    <>
      <img src="/collapsing-icon-light.svg" style={{display: isLightMode ? 'block' : 'none'}} />
      <img src="/collapsing-icon-dark.svg" style={{display: isLightMode ? 'none' : 'block'}} />
    </>
  );
};
```

**When to use this pattern:**

- Different image/SVG assets per theme
- Theme-specific conditional logic
- Third-party libraries that don't support CSS variables

---

## Adding New Colors or Tokens

### Step 1: Add Primitive (if needed)

If you're introducing a new base color, add it to the primitives section:

```css
:root {
  /* Add new primitive */
  --purple-purple100: #8b5cf6;
  --purple-purple200: #7c3aed;
}
```

### Step 2: Add Semantic Alias (optional)

If the color has a semantic meaning:

```css
:root {
  --accent-purple: var(--purple-purple100);
  --accent-purple-dark: var(--purple-purple200);
}
```

### Step 3: Add Mapped/Component Tokens

Add the token in both light and dark mode sections:

```css
:root {
  /* Light mode */
  --surface-accent-secondary: var(--accent-purple);
}

[data-theme='dark'] {
  /* Dark mode - might use different shade or same */
  --surface-accent-secondary: var(--accent-purple-dark);
}
```

### Step 4: Use in Components

```scss
.my-component {
  background-color: var(--surface-accent-secondary);
}
```

---

## Key Files Reference

| File                           | Purpose                                                        |
| ------------------------------ | -------------------------------------------------------------- |
| `src/index.css`                | CSS variables definitions (primitives, aliases, mapped tokens) |
| `src/context/ThemeContext.tsx` | React context & provider for theme state management            |
| `src/hooks/useTheme.ts`        | Hook to access theme context                                   |
| `src/components/ThemeSwitch/`  | UI toggle component                                            |
| `index.html`                   | Inline script for flash prevention                             |
| `src/sass/_variables.scss`     | SASS variables (fonts only, not colors)                        |
| `src/sass/_functions.scss`     | Utility functions like `pxToRem()`                             |

---

## Summary

| Aspect                 | Implementation                                       |
| ---------------------- | ---------------------------------------------------- | ------- |
| **Theme Storage**      | `localStorage.getItem('theme-preference')`           |
| **DOM Indicator**      | `<html data-theme="light                             | dark">` |
| **Default Theme**      | System preference via `prefers-color-scheme`         |
| **Theme Toggle**       | `useTheme().toggleTheme()`                           |
| **Color System**       | 3-tier CSS variables (primitives → aliases → mapped) |
| **Component Styling**  | Use `var(--token-name)` in CSS/SCSS                  |
| **Conditional Assets** | Use `useTheme()` hook in React components            |
| **Flash Prevention**   | Inline script in `<head>` before React               |

---

## Best Practices

1. **Always use mapped tokens** in component styles, never primitives or aliases directly
2. **Prefer CSS variables** over `useTheme()` for colors - it's more performant
3. **Use `useTheme()` only** when you need theme-specific logic or different assets
4. **Test both themes** when adding new UI components
5. **Follow the naming convention** (`--surface-*`, `--text-icon-*`, `--border-*`)
6. **Add tokens to both** `:root` and `[data-theme='dark']` when creating new mapped tokens
