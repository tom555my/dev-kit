# Tailwind CSS 4.0 - Knowledge Reference

## Overview

Tailwind CSS 4.0 is a major overhaul of the framework, built for performance and modern CSS standards. It features a new high-performance engine (Lightning CSS), a CSS-first configuration model, and zero-runtime overhead.

**Version**: 4.x  
**Key Focus**: Performance, CSS-first API, Automatic content detection.

---

## Key Features

### 1. High-Performance Engine (Lightning CSS)
- Up to 10x faster builds.
- Integrated CSS minification and vendor prefixing.
- No longer depends on individual PostCSS plugins for many tasks.

### 2. CSS-First Configuration
Instead of `tailwind.config.js`, you now configure Tailwind directly in your CSS using standard CSS variables and the `@theme` directive.

```css
@import "tailwindcss";

@theme {
  --color-brand: #3b82f6;
  --font-sans: "Inter", sans-serif;
}
```

### 3. Automatic Content Detection
Tailwind 4 automatically scans your project for utility classes. Manual `content` arrays in a config file are no longer required for most projects.

### 4. Zero-Runtime Design
All processing happens at build time, resulting in static CSS files optimized for browser delivery.

---

## Migration from v3

### Core Changes
- **No `tailwind.config.ts`**: Existing configs can be migrated to CSS variables or used via `@config` but the preferred way is `@theme`.
- **Imports**: Use `@import "tailwindcss";` instead of the old `@tailwind base;`, etc.
- **Removed Utilities**: Some legacy utilities have been renamed or replaced by standard CSS features.

### Update Path
1. Update dependency to `tailwindcss@4`.
2. Update PostCSS config to use `@tailwindcss/postcss`.
3. Move theme extensions to the `@theme` block in your CSS.

---

## Integration in dev-kit

The project utilizes Tailwind 4 via PostCSS:

**`postcss.config.mjs`**:
```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

**`app/globals.css`**:
Contains the main Tailwind import and theme overrides.

---

## Best Practices

1. **Use CSS Variables**: Define project-specific tokens in the `@theme` block to maintain a clean design system.
2. **Container Queries**: Leverage native support for container queries using `@container`.
3. **Avoid Legacy Config**: Try to put as much configuration as possible into the CSS file rather than a JS config.

---

## Resources

- [Tailwind CSS 4.0 Blog Post](https://tailwindcss.com/blog/tailwindcss-v4-alpha)
- [Official Documentation](https://tailwindcss.com/docs)

---

## Status

✅ **Implemented in dev-kit**  
📚 **Version**: 4.x (alpha/beta)  
🔄 **Last Updated**: 2026-01-22
