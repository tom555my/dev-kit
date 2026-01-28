# shadcn/ui v3 - Knowledge Reference

## Overview

shadcn/ui v3 marks a major evolution of the popular component collection. It focuses on flexibility, improved accessibility via Radix and Base UI, and full compatibility with React 19 and Tailwind CSS 4.

**Version**: 3.7.0+  
**Key Focus**: Choice of primitives (Radix vs Base UI), React 19 support, and enhanced internal slot-based styling.

---

## Key Features

### 1. Radix vs. Base UI
In v3, you can choose between **Radix UI** (legacy) and **Base UI** (new unstyled primitives by MUI) when initializing or adding components. 
- **Base UI** provides the "headless" logic with a focus on ease of styling and modern accessibility patterns.
- **Radix UI** remains the stable, feature-rich powerhouse for traditional implementations.

### 2. React 19 & Tailwind 4 Support
- All components have been updated to remove `forwardRef` (since React 19 treats `ref` as a prop).
- Designs are optimized for Tailwind 4's CSS-first model.

### 3. Slot-based Styling (`data-slot`)
Components now use a `data-slot` attribute internally. This allows better targeting of sub-elements within a component using CSS or Tailwind, making them more customizable without bloating the prop list.

---

## Usage in dev-kit

The project has a massive collection of 53 components in `components/ui/`.

**Configuration (`components.json`)**:
```json
{
  "style": "new-york",
  "rsc": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "neutral"
  },
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui"
  }
}
```

### Adding New Components
```bash
npx shadcn@latest add [component-name]
```

---

## Best Practices

1. **Keep it Local**: Remember that these components are copied into your project. Don't be afraid to modify the code in `components/ui/` to fit your specific design needs.
2. **Accessible by Default**: Always utilize the built-in accessibility features (ARIA, roles) provided by the primitives.
3. **Compound Components**: Follow the pattern of `Component`, `ComponentHeader`, `ComponentContent` for complex UI pieces like Dialogs or Cards.

---

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Base UI Documentation](https://base-ui.com/)

---

## Status

✅ **Implemented in dev-kit**  
📚 **Version**: 3.7.0  
🔄 **Last Updated**: 2026-01-22
