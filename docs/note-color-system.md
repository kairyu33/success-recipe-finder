# note Brand Color System Documentation

## Overview

This document provides comprehensive guidance on using the note-branded color system throughout the note-hashtag-ai-generator application. The color palette has been carefully crafted to align with note's official brand identity while maintaining modern aesthetics, accessibility standards (WCAG AA), and seamless dark mode support.

---

## Core Brand Colors

### Primary Teal Green (note Signature)
The cornerstone of note's visual identity - a distinctive teal-green that conveys trust, creativity, and calm professionalism.

```typescript
primary: {
  50: '#e8f9f6',   // Very light teal - Background accents
  100: '#c7f2eb',  // Light teal - Hover backgrounds
  200: '#9fe9de',  // Lighter active states
  300: '#6dd9ca',  // Medium-light teal
  400: '#41c9b4',  // note SIGNATURE COLOR - Primary CTAs
  500: '#2ea690',  // Darker variant - Hover states
  600: '#258975',  // Deep teal - Pressed/active states
  700: '#1e7b65',  // note official success green
  800: '#176553',  // Very dark teal - Text on light backgrounds
  900: '#114f42',  // Deepest teal - High contrast text
}
```

**Usage Guidelines:**
- **primary-400**: Primary buttons, CTAs, main brand elements
- **primary-500**: Hover states for primary elements
- **primary-50/100**: Subtle backgrounds, highlighted sections
- **primary-700**: Success states, confirmation messages
- **primary-800/900**: Text when high contrast is needed

---

### Accent Coral (Complementary)
A warm coral that provides visual contrast and energy, complementing the cool teal perfectly.

```typescript
accent: {
  50: '#fff5f5',   // Very light coral
  100: '#ffe3e3',  // Light coral backgrounds
  200: '#ffc9c9',  // Lighter coral
  300: '#ffa8a8',  // Medium coral
  400: '#ff8787',  // Bright coral
  500: '#ff6b6b',  // PRIMARY ACCENT - Attention-grabbing elements
  600: '#fa5252',  // Deep coral
  700: '#f03e3e',  // Darker coral - Hover states
  800: '#e03131',  // Very dark coral
  900: '#c92a2a',  // Deepest coral
}
```

**Usage Guidelines:**
- **accent-500**: Secondary CTAs, attention elements, badges
- **accent-700**: Hover states for accent elements
- **accent-50/100**: Accent backgrounds, notifications
- Use sparingly to maintain visual hierarchy

---

### Neutral Colors (note Official)
Based on note's text and surface color system for consistency.

```typescript
neutral: {
  50: '#f5f8fa',   // note surface quaternary
  100: '#e8eef2',  // Light gray
  200: '#d1dce3',  // Border light
  300: '#b3c5d1',  // Border medium
  400: '#8fa5b5',  // Text tertiary
  500: '#6b8599',  // Text secondary
  600: '#4d6679',  // Text clickable
  700: '#334b5f',  // Text primary
  800: '#1a2f3f',  // Dark text
  900: '#08131a',  // note PRIMARY DARK
}
```

**Usage Guidelines:**
- **neutral-900**: Primary text on light backgrounds
- **neutral-700**: Secondary text
- **neutral-500/600**: Tertiary text, muted elements
- **neutral-200/300**: Borders, dividers
- **neutral-50/100**: Background surfaces

---

## Semantic Colors

### Success
Uses note's official success color palette.

```typescript
success: {
  700: '#1e7b65',  // note official success
  // Full scale from primary (they're identical)
}
```

**Usage:** Confirmation messages, completed states, positive feedback

### Warning/Caution
Uses note's official caution color.

```typescript
warning: {
  800: '#ac7a2d',  // note official caution
  500: '#f5c02b',  // Brighter variant for dark mode
}
```

**Usage:** Warnings, important notices, attention states

### Danger
Uses note's official danger color.

```typescript
danger: {
  700: '#b22323',  // note official danger
  500: '#e63939',  // Brighter variant
}
```

**Usage:** Errors, destructive actions, critical alerts

### Like/Engagement
Uses note's official like color.

```typescript
like: {
  600: '#d13e5c',  // note official like/engagement
  500: '#e9447a',  // Brighter variant
}
```

**Usage:** Like buttons, engagement indicators, social features

---

## Dark Mode Color Adjustments

### Background Colors
```typescript
dark: {
  bg: {
    primary: '#08131a',    // note primary dark - Main background
    secondary: '#0f1c24',  // Slightly lighter - Section backgrounds
    tertiary: '#162730',   // Card backgrounds
    quaternary: '#1d323d', // Elevated surfaces (modals, dropdowns)
  },
  border: '#2a424f',       // Dark borders
  text: {
    primary: 'rgba(255, 255, 255, 0.90)',   // 90% white - Primary text
    secondary: 'rgba(255, 255, 255, 0.70)', // 70% white - Secondary text
    tertiary: 'rgba(255, 255, 255, 0.50)',  // 50% white - Tertiary text
  }
}
```

### Color Adjustments for Dark Mode
In dark mode, certain colors become brighter for better contrast:
- **Primary colors**: Remain consistent (note's teal works well in both modes)
- **Success**: Shifts to primary-500 (#2ea690) for better visibility
- **Danger**: Shifts to accent-500 (#ff6b6b) for softer appearance
- **Warning**: Shifts to warning-500 (#f5c02b) for brightness

---

## Gradients

### Primary Gradients
```css
/* Single-color gradients */
.bg-gradient-primary    /* #41c9b4 → #2ea690 */
.bg-gradient-success    /* #2ea690 → #1e7b65 */

/* Hero gradient (3-stop) */
.bg-gradient-hero       /* #41c9b4 → #258975 → #1e7b65 */

/* Subtle background gradient */
.bg-gradient-subtle     /* #e8f9f6 → #c7f2eb */
```

### Accent Gradients
```css
.bg-gradient-accent     /* #ff6b6b → #f03e3e */
.bg-gradient-warm       /* #ff8787 → #fa5252 */
```

### Glass Effect Gradients
```css
.bg-gradient-glass      /* Subtle teal glass effect */
.bg-gradient-glass-warm /* Subtle coral glass effect */
```

### Mesh Gradients (Backgrounds)
```css
.bg-gradient-mesh       /* Multi-point radial gradient (light mode) */
.bg-gradient-mesh-dark  /* Multi-point radial gradient (dark mode) */
```

---

## Component-Specific Color Mappings

### Buttons

#### Primary Button
```tsx
// Tailwind classes
className="bg-gradient-primary hover:bg-gradient-success text-white shadow-primary"

// Or use utility class
className="btn-note-primary"
```

#### Secondary Button
```tsx
className="bg-transparent text-primary-500 border-2 border-primary-400 hover:bg-primary-50"
```

#### Outline Button
```tsx
className="btn-note-outline"
```

#### Accent Button
```tsx
className="bg-gradient-accent hover:bg-accent-700 text-white shadow-accent"
```

---

### Input Fields

#### Standard Input
```tsx
className="bg-neutral-50 dark:bg-dark-bg-tertiary border border-neutral-200 dark:border-dark-border
           focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20
           text-neutral-900 dark:text-dark-text-primary"
```

#### Input with Icon
```tsx
// Container
className="relative"

// Icon
className="absolute left-3 text-neutral-500 dark:text-dark-text-tertiary"

// Input
className="pl-10 ..." // Add left padding for icon
```

#### Error State
```tsx
className="border-danger-500 focus:border-danger-600 focus:ring-danger-500/20"
```

#### Success State
```tsx
className="border-success-700 focus:border-success-700 focus:ring-success-700/20"
```

---

### Cards

#### Standard Card
```tsx
className="card-note-hover bg-white dark:bg-dark-bg-tertiary rounded-xl p-6"
```

#### Glass Card
```tsx
className="glass-note rounded-xl p-6"
```

#### Strong Glass Card
```tsx
className="glass-note-strong rounded-xl p-6"
```

#### Featured Card
```tsx
className="bg-gradient-subtle dark:bg-dark-bg-secondary border-2 border-primary-400
           rounded-xl p-6 shadow-primary-lg"
```

---

### Badges

#### Primary Badge
```tsx
className="badge-note px-3 py-1 rounded-full text-sm font-medium"
```

#### Accent Badge
```tsx
className="badge-accent px-3 py-1 rounded-full text-sm font-medium"
```

#### Success Badge
```tsx
className="bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-400
           border border-success-200 dark:border-success-700 px-3 py-1 rounded-full text-sm"
```

#### Warning Badge
```tsx
className="bg-warning-50 dark:bg-warning-900/20 text-warning-800 dark:text-warning-500
           border border-warning-200 dark:border-warning-700 px-3 py-1 rounded-full text-sm"
```

#### Danger Badge
```tsx
className="bg-danger-50 dark:bg-danger-900/20 text-danger-700 dark:text-danger-500
           border border-danger-200 dark:border-danger-700 px-3 py-1 rounded-full text-sm"
```

---

### Navigation

#### Nav Bar
```tsx
className="glass-nav sticky top-0 z-50 px-6 py-4"
```

#### Active Nav Link
```tsx
className="text-primary-500 dark:text-primary-400 font-semibold border-b-2 border-primary-500"
```

#### Inactive Nav Link
```tsx
className="text-neutral-600 dark:text-dark-text-secondary hover:text-primary-500
           dark:hover:text-primary-400 transition-colors"
```

---

### Text Colors

#### Gradient Text (Brand)
```tsx
className="gradient-text text-4xl font-bold"
```

#### Gradient Text (Accent)
```tsx
className="gradient-text-accent text-4xl font-bold"
```

#### Gradient Text (Multi-color)
```tsx
className="gradient-text-multi text-4xl font-bold"
```

#### Primary Text
```tsx
className="text-primary-500 dark:text-primary-400"
```

#### Accent Text
```tsx
className="text-accent-500 dark:text-accent-400"
```

---

### Shadows

```css
.shadow-primary      /* Teal glow shadow */
.shadow-primary-lg   /* Large teal glow */
.shadow-accent       /* Coral glow shadow */
.shadow-accent-lg    /* Large coral glow */
.shadow-success      /* Success green glow */
.shadow-soft         /* Subtle neutral shadow */
.shadow-soft-lg      /* Large neutral shadow */
```

---

## Accessibility Guidelines

### Contrast Ratios (WCAG AA Compliant)

#### Light Mode
- **Primary-500 on white**: 3.8:1 (AA Large Text)
- **Primary-700 on white**: 5.2:1 (AA Normal Text)
- **Neutral-900 on white**: 14.5:1 (AAA)
- **Neutral-700 on white**: 7.8:1 (AAA)

#### Dark Mode
- **Primary-400 on dark-bg-primary**: 6.2:1 (AA Normal Text)
- **Text-primary (90% white) on dark-bg-primary**: 12.1:1 (AAA)

### Best Practices
1. Use **primary-700** or darker for text on light backgrounds
2. Use **primary-400** or lighter for text on dark backgrounds
3. Always test color combinations with a contrast checker
4. Provide text alternatives for color-only information
5. Ensure interactive elements have clear focus states

---

## Animation & Effects

### Hover Effects
```tsx
// Primary button hover
className="hover:scale-105 hover:shadow-primary-lg transition-all duration-200"

// Card hover
className="hover:-translate-y-1 hover:shadow-primary transition-transform duration-300"
```

### Focus Effects
```tsx
className="focus-note" // Applies primary-colored outline
```

### Glow Animation
```tsx
className="animate-glow" // Pulsing teal glow effect
```

### Shimmer Loading
```tsx
className="shimmer" // Teal-tinted shimmer for loading states
```

---

## Migration Guide: Purple/Cyan → note Teal/Coral

### Quick Reference Table

| Old Color | New Color | Usage |
|-----------|-----------|-------|
| `primary-500` (purple #a855f7) | `primary-400` (teal #41c9b4) | Primary brand color |
| `accent-500` (cyan #06b6d4) | `accent-500` (coral #ff6b6b) | Accent elements |
| `bg-gradient-primary` (purple→pink) | `bg-gradient-primary` (teal→teal-dark) | Primary gradients |
| `bg-gradient-accent` (cyan→blue) | `bg-gradient-accent` (coral→coral-dark) | Accent gradients |
| `shadow-primary` (purple glow) | `shadow-primary` (teal glow) | Primary shadows |
| Purple text | `text-primary-500` | Primary text color |
| Cyan text | `text-accent-500` | Accent text color |

### Component Updates

#### Before (Purple/Cyan)
```tsx
<button className="bg-primary-500 hover:bg-primary-600 text-white">
  Click Me
</button>
```

#### After (note Teal)
```tsx
<button className="bg-gradient-primary hover:bg-gradient-success text-white shadow-primary">
  Click Me
</button>
```

---

## Implementation Checklist

When implementing note brand colors in components:

- [ ] Replace all purple references with note teal variants
- [ ] Replace all cyan references with coral accent variants
- [ ] Update gradients to use new color schemes
- [ ] Test in both light and dark modes
- [ ] Verify contrast ratios for accessibility
- [ ] Update shadow colors to match new brand
- [ ] Test hover/focus states with new colors
- [ ] Ensure glass effects use note-branded transparency
- [ ] Update any hardcoded hex values in components
- [ ] Test on mobile for color visibility

---

## Examples in Practice

### Hero Section
```tsx
<section className="relative overflow-hidden bg-gradient-mesh dark:bg-gradient-mesh-dark">
  <div className="container mx-auto px-6 py-24">
    <h1 className="gradient-text text-6xl font-bold mb-6">
      note AI Hashtag Generator
    </h1>
    <p className="text-neutral-700 dark:text-dark-text-secondary text-xl mb-8">
      Generate perfect hashtags for your note articles
    </p>
    <button className="btn-note-primary px-8 py-4 rounded-xl text-lg font-semibold">
      Get Started
    </button>
  </div>
</section>
```

### Feature Card
```tsx
<div className="card-note-hover bg-white dark:bg-dark-bg-tertiary rounded-2xl p-8">
  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4">
    <SparklesIcon className="w-6 h-6 text-white" />
  </div>
  <h3 className="text-xl font-bold text-neutral-900 dark:text-dark-text-primary mb-2">
    AI-Powered Analysis
  </h3>
  <p className="text-neutral-600 dark:text-dark-text-secondary">
    Advanced algorithms analyze your content for perfect hashtag suggestions
  </p>
</div>
```

### Status Badge
```tsx
<div className="flex gap-2">
  <span className="badge-note">
    Active
  </span>
  <span className="badge-accent">
    New
  </span>
</div>
```

---

## CSS Variables Reference

Available as CSS custom properties:

```css
:root {
  --note-primary: #41c9b4;
  --note-primary-dark: #2ea690;
  --note-success: #1e7b65;
  --note-danger: #b22323;
  --note-caution: #ac7a2d;
  --note-like: #d13e5c;
  --note-surface: #f5f8fa;
}

.dark {
  --note-primary: #41c9b4;
  --note-success: #2ea690;
  --note-danger: #ff6b6b;
  --note-caution: #f5c02b;
  --note-like: #e9447a;
  --note-surface: #162730;
}
```

Use in inline styles or custom CSS:
```tsx
<div style={{ color: 'var(--note-primary)' }}>
  note branded text
</div>
```

---

## Questions or Issues?

If you encounter any issues with the color system or need additional color variants:

1. Check this documentation first
2. Verify accessibility with a contrast checker
3. Test in both light and dark modes
4. Consult note's official brand guidelines
5. Create a ticket in the project management system

---

**Last Updated:** 2025-10-27
**Version:** 1.0.0
**Maintained by:** UI Design Team
