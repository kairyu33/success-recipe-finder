# note Brand Color Reference Card
**Quick Reference for Developers** | Version 1.0.0 | 2025-10-27

---

## 🎨 Primary Palette (note Teal)

```
┌────────────────────────────────────────────────┐
│  50  #e8f9f6  ░░░░░░░  Very light backgrounds │
│ 100  #c7f2eb  ░░░░░░░  Light hover states     │
│ 200  #9fe9de  ░░░░░░░  Active states          │
│ 300  #6dd9ca  ▒▒▒▒▒▒▒  Medium teal            │
│ 400  #41c9b4  ▓▓▓▓▓▓▓  ⭐ PRIMARY BRAND       │
│ 500  #2ea690  ▓▓▓▓▓▓▓  Hover states           │
│ 600  #258975  ███████  Pressed states         │
│ 700  #1e7b65  ███████  Success green          │
│ 800  #176553  ███████  Dark teal              │
│ 900  #114f42  ███████  Text on light          │
└────────────────────────────────────────────────┘
```

**Use for:** Buttons, links, icons, brand elements, success states

---

## 🔥 Accent Palette (Coral)

```
┌────────────────────────────────────────────────┐
│  50  #fff5f5  ░░░░░░░  Very light coral       │
│ 100  #ffe3e3  ░░░░░░░  Light backgrounds      │
│ 200  #ffc9c9  ░░░░░░░  Lighter coral          │
│ 300  #ffa8a8  ▒▒▒▒▒▒▒  Medium coral           │
│ 400  #ff8787  ▒▒▒▒▒▒▒  Bright coral           │
│ 500  #ff6b6b  ▓▓▓▓▓▓▓  ⭐ PRIMARY ACCENT      │
│ 600  #fa5252  ▓▓▓▓▓▓▓  Deep coral             │
│ 700  #f03e3e  ███████  Hover states           │
│ 800  #e03131  ███████  Dark coral             │
│ 900  #c92a2a  ███████  Deepest coral          │
└────────────────────────────────────────────────┘
```

**Use for:** Secondary CTAs, highlights, new badges, warm accents

---

## 🌈 Semantic Colors (note Official)

```
┌─────────────────────────────────────────────────┐
│ SUCCESS   #1e7b65  ███  note official success  │
│ WARNING   #ac7a2d  ███  note official caution  │
│ DANGER    #b22323  ███  note official danger   │
│ LIKE      #d13e5c  ███  note official like     │
└─────────────────────────────────────────────────┘
```

---

## 🌑 Dark Mode Colors

```
┌──────────────────────────────────────────────────┐
│ BG Primary    #08131a  ███  Main background     │
│ BG Secondary  #0f1c24  ███  Section backgrounds │
│ BG Tertiary   #162730  ███  Card backgrounds    │
│ BG Quaternary #1d323d  ███  Elevated surfaces   │
│ Border        #2a424f  ███  Dark borders        │
│ Text Primary  rgba(255,255,255,0.90)  90% white │
│ Text Secondary rgba(255,255,255,0.70) 70% white │
│ Text Tertiary  rgba(255,255,255,0.50) 50% white │
└──────────────────────────────────────────────────┘
```

---

## 🎯 Most Common Use Cases

### Buttons

```tsx
// Primary (teal)
className="bg-gradient-primary text-white shadow-primary"
className="btn-note-primary" // utility

// Outline
className="border-2 border-primary-400 text-primary-500"
className="btn-note-outline" // utility

// Accent (coral)
className="bg-gradient-accent text-white shadow-accent"
```

### Text Colors

```tsx
// Primary text
className="text-neutral-900 dark:text-dark-text-primary"

// Secondary text
className="text-neutral-600 dark:text-dark-text-secondary"

// Brand text
className="text-primary-500 dark:text-primary-400"

// Gradient text
className="gradient-text" // teal gradient
```

### Backgrounds

```tsx
// Main background
className="bg-white dark:bg-dark-bg-primary"

// Card background
className="bg-white dark:bg-dark-bg-tertiary"

// Subtle accent
className="bg-primary-50 dark:bg-primary-900/20"
```

### Borders

```tsx
// Standard
className="border border-neutral-200 dark:border-dark-border"

// Accent
className="border border-primary-400 dark:border-primary-600"

// On hover
className="hover:border-primary-400 dark:hover:border-primary-500"
```

---

## 🚀 Quick Gradients

```css
/* Primary brand */
background: linear-gradient(135deg, #41c9b4, #2ea690);

/* Accent coral */
background: linear-gradient(135deg, #ff6b6b, #f03e3e);

/* Hero (3-stop) */
background: linear-gradient(135deg, #41c9b4, #258975, #1e7b65);

/* Mesh (light) */
background:
  radial-gradient(at 40% 20%, rgba(65,201,180,0.4), transparent 50%),
  radial-gradient(at 80% 0%, rgba(255,107,107,0.3), transparent 50%),
  radial-gradient(at 0% 50%, rgba(46,166,144,0.3), transparent 50%);
```

---

## 🎨 Tailwind Utilities

### Pre-built Classes

```
btn-note-primary     → Primary button with gradient
btn-note-outline     → Outline button with teal border
badge-note           → Primary badge (teal)
badge-accent         → Accent badge (coral)
card-note-hover      → Card with hover effect
glass-note           → Subtle glass effect
glass-note-strong    → Strong glass effect
gradient-text        → Teal gradient text
gradient-text-accent → Coral gradient text
border-note          → Teal border
bg-note-subtle       → Subtle teal background
hover-note           → Interactive hover state
focus-note           → Teal focus ring
```

### Background Gradients

```
bg-gradient-primary  → Teal gradient
bg-gradient-accent   → Coral gradient
bg-gradient-success  → Success gradient
bg-gradient-hero     → 3-stop teal gradient
bg-gradient-mesh     → Mesh background (light)
bg-gradient-mesh-dark → Mesh background (dark)
```

### Shadows

```
shadow-primary       → Teal glow
shadow-primary-lg    → Large teal glow
shadow-accent        → Coral glow
shadow-accent-lg     → Large coral glow
shadow-soft          → Subtle neutral shadow
```

---

## ⚡ One-Line Component Examples

```tsx
// Hero heading
<h1 className="gradient-text text-6xl font-bold">Title</h1>

// Primary button
<button className="btn-note-primary px-6 py-3 rounded-xl">Click</button>

// Card
<div className="card-note-hover bg-white dark:bg-dark-bg-tertiary rounded-2xl p-6">

// Input
<input className="focus-note bg-neutral-50 dark:bg-dark-bg-tertiary rounded-lg px-4 py-2" />

// Badge
<span className="badge-note">Active</span>

// Link
<a className="text-primary-500 hover:text-primary-600 underline">Link</a>

// Glass card
<div className="glass-note rounded-xl p-6">Content</div>
```

---

## ✅ Accessibility Checklist

```
✓ Primary-700 on white: 5.2:1 (AA)
✓ Neutral-900 on white: 14.5:1 (AAA)
✓ Primary-400 on dark-bg: 6.2:1 (AA)
✓ Text-primary on dark-bg: 12.1:1 (AAA)
✓ All interactive elements have focus states
✓ Color never sole indicator of state
```

---

## 🔧 Common Patterns

### Pattern 1: Primary CTA Button
```tsx
<button className="bg-gradient-primary hover:bg-gradient-success
                   text-white shadow-primary hover:shadow-primary-lg
                   px-8 py-4 rounded-xl font-semibold
                   transition-all duration-200">
  Generate Hashtags
</button>
```

### Pattern 2: Feature Card
```tsx
<div className="card-note-hover bg-white dark:bg-dark-bg-tertiary
                rounded-2xl p-6 group">
  <div className="w-12 h-12 bg-gradient-primary rounded-xl
                  flex items-center justify-center mb-4
                  group-hover:scale-110 transition-transform">
    <Icon className="w-6 h-6 text-white" />
  </div>
  <h3 className="text-xl font-bold mb-2
                 text-neutral-900 dark:text-dark-text-primary">
    Title
  </h3>
  <p className="text-neutral-600 dark:text-dark-text-secondary">
    Description
  </p>
</div>
```

### Pattern 3: Input with Label
```tsx
<div>
  <label className="block mb-2 font-medium
                    text-neutral-700 dark:text-dark-text-primary">
    Label
  </label>
  <input className="w-full bg-neutral-50 dark:bg-dark-bg-tertiary
                    border border-neutral-200 dark:border-dark-border
                    focus:border-primary-400 focus:ring-2
                    focus:ring-primary-400/20
                    rounded-lg px-4 py-2 transition-all" />
</div>
```

### Pattern 4: Status Badge
```tsx
<span className="inline-flex items-center gap-2
                 badge-note px-3 py-1 rounded-full">
  <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
  Active
</span>
```

---

## 🎯 Migration Quick Reference

| Old (Purple/Cyan) | New (note Teal/Coral) |
|-------------------|----------------------|
| `#a855f7` | `#41c9b4` |
| `#06b6d4` | `#ff6b6b` |
| `bg-primary-500` | `bg-primary-400` |
| Purple shadow | `shadow-primary` |
| Cyan shadow | `shadow-accent` |

---

## 📱 Responsive Breakpoints

```
sm:   640px   @media (min-width: 640px)
md:   768px   @media (min-width: 768px)
lg:   1024px  @media (min-width: 1024px)
xl:   1280px  @media (min-width: 1280px)
2xl:  1536px  @media (min-width: 1536px)
```

**Example:**
```tsx
className="text-2xl md:text-4xl lg:text-6xl
           bg-primary-100 md:bg-primary-200 lg:bg-primary-300"
```

---

## 🐛 Troubleshooting

**Colors not showing?**
→ Restart dev server: `npm run dev`
→ Clear browser cache: Ctrl+Shift+R

**Dark mode not working?**
→ Check for `dark` class on html/root element
→ Verify `darkMode: 'class'` in tailwind.config.ts

**Low contrast?**
→ Use darker shades for text (700+)
→ Test with WebAIM contrast checker

**Focus ring invisible?**
→ Use `focus-note` utility class
→ Or add `focus:ring-2 focus:ring-primary-400/20`

---

## 📚 Full Documentation

- **Complete Guide:** `docs/note-color-system.md`
- **Visual Comparison:** `docs/color-migration-visual-guide.md`
- **JSON Reference:** `docs/note-colors-reference.json`
- **Implementation:** `docs/color-implementation-checklist.md`
- **Summary:** `COLOR-SYSTEM-SUMMARY.md`

---

## 💡 Pro Tips

1. **Always use utility classes** instead of custom CSS when possible
2. **Test in dark mode** immediately after building in light mode
3. **Use gradients** on primary CTAs for depth and interest
4. **Add transitions** to all color changes: `transition-colors duration-200`
5. **Layer shadows** with borders for glass effects
6. **Use opacity** for hover states: `hover:bg-primary-500/10`
7. **Group hover** for card animations: `group` + `group-hover:`
8. **Prefer semantic colors** (success, warning, danger) over custom

---

**Print this card and keep it nearby while developing!**

**Last Updated:** 2025-10-27 | **Version:** 1.0.0
**Project:** note-hashtag-ai-generator | **Color System:** note Brand
