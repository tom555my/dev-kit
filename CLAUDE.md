# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

dev-kit is a development toolkit for developers and AI-assisted development workflows. It uses Next.js 16 with React 19, deployed to Cloudflare Workers via OpenNext. The project includes agent workflows, documentation generation, and a comprehensive UI component library based on shadcn/ui with Radix UI primitives.

## Development Commands

### Core Development
```bash
pnpm dev              # Start Next.js development server (uses Turbopack by default)
pnpm build            # Build for production
pnpm start            # Start production server
```

### Cloudflare Workers Deployment
```bash
pnpm build:worker     # Build using OpenNext Cloudflare adapter (runs opennextjs-cloudflare)
pnpm deploy           # Build and deploy to Cloudflare Workers
pnpm preview          # Build and run local worker (wrangler dev)
```

### Code Quality
```bash
pnpm lint             # Run oxlint
pnpm lint:fix         # Fix oxlint issues automatically
pnpm format           # Format code with oxfmt
pnpm format:check     # Check formatting without making changes
```

### Debugging
```bash
next dev --inspect    # Start dev server with Node inspector enabled
ANALYZE=true pnpm build  # Run bundle analyzer on production build
```

## Architecture

### Framework Stack
- **Next.js 16.1.4**: App Router with React Server Components (RSC) by default
- **React 19.2.3**: Latest React with Server Actions and new hooks
- **TypeScript**: Strict mode enabled with path aliases (`@/*` maps to root)

### Deployment Architecture
- **OpenNext Cloudflare** (@opennextjs/cloudflare): Adapts Next.js for Cloudflare Workers
- **Wrangler**: Cloudflare Workers CLI for deployment and local development
- Build output goes to `.open-next/` directory
- Assets served from `.open-next/assets` with binding name `ASSETS`

### Styling System
- **Tailwind CSS 4**: CSS-first configuration via `@theme` in `app/globals.css`
- **PostCSS**: Uses `@tailwindcss/postcss` plugin (configured in `postcss.config.mjs`)
- **shadcn/ui (v3)**: Component library with "radix-maia" style variant
- **Radix UI**: Unstyled component primitives for accessibility
- **tw-animate-css**: Additional animations
- CSS variables defined in `:root` and `.dark` for theming (OKLCH color space)

### Component Architecture
- **Server Components by default**: All `app/` routes and most components are Server Components
- **Client Components**: Must add `'use client';` directive for hooks, event handlers, or browser APIs
- **Component location**: `components/` for shared components, `components/ui/` for UI primitives
- **Utility functions**: `lib/utils.ts` contains `cn()` for merging Tailwind classes using `clsx` and `tailwind-merge`

### Agent Workflows
The `.agent/workflows/` directory contains skill definitions for AI-assisted development:
- `dev-kit.init`: Initialize project documentation (PROJECT.md and TECH.md)
- `dev-kit.ticket`: Create work tickets from requirements
- `dev-kit.research`: Research topics and generate knowledge files
- `dev-kit.work`: Execute work from generated tickets
- `dev-kit.refine`: Refine generated documentation
- `dev-kit.review`: Review completed tickets

### Documentation Structure
- `.dev-kit/docs/`: Project documentation (PROJECT.md, TECH.md)
- `.dev-kit/knowledge/`: Technology-specific knowledge files (e.g., nextjs-16.md, tailwind-4.md)
- `.dev-kit/tickets/`: Generated work tickets

## Configuration Files

- **next.config.ts**: Next.js configuration (currently minimal)
- **open-next.config.ts**: OpenNext Cloudflare adapter configuration
- **wrangler.json**: Cloudflare Workers deployment config (nodejs_compat enabled)
- **tsconfig.json**: TypeScript config with strict mode and path aliases
- **components.json**: shadcn/ui configuration (aliases: `@/components`, `@/lib`, `@/hooks`)
- **postcss.config.mjs**: PostCSS with Tailwind CSS 4 plugin
- **.oxlintrc.json**: oxlint configuration
- **.oxfmtrc.json**: oxfmt (code formatter) configuration

## Key Patterns

### Server vs Client Components
```tsx
// Server Component (default in app/)
export default function Page() {
  return <div>No hooks or events here</div>;
}

// Client Component (needs 'use client')
'use client';
import { useState } from 'react';
export function InteractiveComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### Import Aliases
Use `@/` prefix for imports from project root:
```tsx
import { ComponentExample } from '@/components/component-example';
import { cn } from '@/lib/utils';
```

### Caching in Next.js 16
```tsx
'use cache'; // New cache directive

export async function getData() {
  const res = await fetch('https://api.example.com/data');
  return res.json();
}
```

### Proxy instead of Middleware
Next.js 16 prefers `proxy.ts` over `middleware.ts` (though middleware still works):
```tsx
// proxy.ts
export function proxy(request: NextRequest) {
  // Handle request at network boundary
}
```

## Font Configuration
- **JetBrains Mono**: Primary font (variable: `--font-sans`)
- **Geist Sans**: Secondary sans-serif (variable: `--font-geist-sans`)
- **Geist Mono**: Monospace (variable: `--font-geist-mono`)
- Font variables applied in `app/layout.tsx`

## Color System
Uses OKLCH color space with CSS variables:
- Light mode: `--background: oklch(1 0 0)` (white)
- Dark mode: `--background: oklch(0.145 0 0)` (dark gray)
- Primary color: `oklch(0.6 0.13 163)` (teal/green)
- Semantic tokens for card, popover, muted, accent, destructive, border, input, ring

## Build and Deployment Notes

1. **Local Development**: Uses Turbopack with file system caching for fast cold starts
2. **Production Build**: Standard Next.js build outputs optimized bundles
3. **Worker Build**: `opennextjs-cloudflare` creates `.open-next/worker.js` entry point
4. **Deployment**: `wrangler deploy` pushes to Cloudflare Workers network
5. **Asset Binding**: Assets served from separate binding for optimal caching

## Testing Locally Before Deploy
```bash
pnpm preview  # Runs wrangler dev with built worker
```

This is the recommended way to test the Cloudflare Workers build locally before deployment.
