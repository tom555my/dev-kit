# dev-kit (DKIT) - Technical Documentation

## Architecture Overview

**dev-kit** is a Next.js 16 application that serves as a development toolkit with AI agent workflows. The application provides a Next.js-based web interface showcasing UI components while the core functionality resides in structured Markdown workflows that AI agents execute.

**Architecture Pattern**: Static workflow definitions + Next.js showcase application  
**Deployment Model**: Cloudflare Workers via OpenNext  
**Storage**: File system-based (`.dev-kit/` directory)

```
dev-kit/
├── .agent/
│   ├── workflows/          # Workflow definitions (6 .md files)
│   └── skills/             # Extended agent capabilities
├── .dev-kit/
│   ├── docs/               # PROJECT.md, TECH.md
│   ├── knowledge/         # Research documentation
│   └── tickets/            # Generated work items
├── app/                    # Next.js 16 App Router
├── components/             # React 19 UI components (shadcn/ui)
└── public/                 # Static assets
```

---

## Tech Stack

### Frontend Framework
- **Next.js**: 16.1.4 - React framework with App Router
- **React**: 19.2.3 - UI library with latest concurrent features
- **TypeScript**: 5.x - Type safety and developer experience

### Styling & UI
- **Tailwind CSS**: 4.x - Utility-first CSS framework (latest major version)
- **shadcn/ui**: 3.7.0 - Headless UI component collection
- **Base UI**: 1.1.0 - Unstyled, accessible React components
- **class-variance-authority**: 0.7.1 - Component variant management
- **tailwind-merge**: 3.4.0 - Utility class merging
- **clsx**: 2.1.1 - Conditional className construction

### UI Components & Libraries
- **Tabler Icons**: 3.36.1 - Icon set for UI
- **cmdk**: 1.1.1 - Command palette component
- **embla-carousel-react**: 8.6.0 - Carousel/slider functionality
- **react-resizable-panels**: 4.4.1 - Resizable panel layouts
- **recharts**: 2.15.4 - Charting library
- **react-day-picker**: 9.13.0 - Date picker component
- **input-otp**: 1.4.2 - OTP input component
- **vaul**: 1.1.2 - Drawer component
- **sonner**: 2.0.7 - Toast notifications
- **next-themes**: 0.4.6 - Theme management (dark mode)

### Development Tooling
- **pnpm**: Workspace-enabled package manager (via `pnpm-workspace.yaml`)
- **oxlint**: 1.41.0 - Fast, Rust-based linter (ESLint alternative)
- **oxfmt**: 0.26.0 - Fast, Rust-based formatter (Prettier alternative)
- **TypeScript**: 5.x - Static type checking

### Deployment
- **@opennextjs/cloudflare**: 1.15.0 - Next.js adapter for Cloudflare Workers
- **wrangler**: 4.59.3 - Cloudflare Workers CLI
- **OpenNext**: Enables Next.js SSR on Cloudflare Workers edge runtime

### Date & Utilities
- **date-fns**: 4.1.0 - Date utility library

---

## Project Structure

### Directory Layout

```
dev-kit/
├── .agent/
│   ├── workflows/              # AI agent workflow definitions
│   │   ├── dev-kit.init.md
│   │   ├── dev-kit.ticket.md
│   │   ├── dev-kit.research.md
│   │   ├── dev-kit.work.md
│   │   ├── dev-kit.refine.md
│   │   └── dev-kit.review.md
│   └── skills/                 # Extended capabilities
│
├── .dev-kit/                   # Project artifacts (generated)
│   ├── docs/                   # PROJECT.md, TECH.md
│   ├── knowledge/             # Research documentation
│   └── tickets/                # Work items
│
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page (component showcase)
│   ├── globals.css             # Global styles
│   └── favicon.ico
│
├── components/                 # React components
│   ├── ui/                     # shadcn/ui components (53 components)
│   ├── component-example.tsx   # Component showcase
│   └── example.tsx             # Example wrapper
│
├── hooks/                      # React custom hooks
├── lib/                        # Utility functions
├── public/                     # Static assets
│
├── .oxlintrc.json              # Linter configuration
├── .oxfmtrc.json               # Formatter configuration
├── components.json             # shadcn/ui configuration
├── next.config.ts              # Next.js configuration
├── open-next.config.ts         # OpenNext configuration
├── postcss.config.mjs          # PostCSS configuration
├── pnpm-workspace.yaml         # pnpm workspace config
├── tsconfig.json               # TypeScript configuration
└── wrangler.json               # Cloudflare deployment config
```

### Key Files

- **`.agent/workflows/*.md`**: Workflow definitions in YAML frontmatter + Markdown format
- **`components/ui/`**: 53 shadcn/ui components (Button, Card, Dialog, etc.)
- **`app/page.tsx`**: Component showcase demonstrating UI capabilities
- **`package.json`**: Dependencies and scripts
- **`tsconfig.json`**: TypeScript compiler options with strict mode enabled

---

## Workflows System

### Workflow Structure

Each workflow is defined as a Markdown file in `.agent/workflows/` with YAML frontmatter:

```markdown
---
description: [short title]
---
[detailed workflow instructions]
```

### Available Workflows

1. **`/dev-kit.init`**: Generate PROJECT.md and TECH.md from codebase analysis
2. **`/dev-kit.ticket`**: Create structured tickets with dependencies
3. **`/dev-kit.research`**: Research tech stack components and document findings
4. **`/dev-kit.work`**: Execute tickets with context and guidance
5. **`/dev-kit.refine`**: Consolidate and verify documentation accuracy
6. **`/dev-kit.review`**: Review completed tickets against acceptance criteria

### Workflow Annotations

- **`// turbo`**: Marks a single step as safe for auto-execution
- **`// turbo-all`**: Marks entire workflow as safe for auto-execution

---

## Development Environment

### Prerequisites

- **Node.js**: Version specified in project (check `.node-version` or `.nvmrc` if present)
- **pnpm**: Latest version (workspace support required)
- **Git**: For version control

### Local Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run linter
pnpm lint

# Auto-fix linting issues
pnpm lint:fix

# Format code
pnpm format

# Check formatting
pnpm format:check
```

### Available Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "build:worker": "opennextjs-cloudflare",
  "deploy": "pnpm build:worker && wrangler deploy",
  "preview": "pnpm build:worker && wrangler dev",
  "lint": "oxlint",
  "lint:fix": "oxlint --fix",
  "format": "oxfmt",
  "format:check": "oxfmt --check"
}
```

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "strict": true,
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

- **Strict mode enabled**: Enforces type safety
- **Path alias**: `@/*` maps to project root for cleaner imports
- **Next.js plugin**: Automatic type generation for routes

---

## Deployment

### Cloudflare Workers Deployment

dev-kit deploys to **Cloudflare Workers** using **OpenNext** for Next.js compatibility.

#### Build Process

```bash
# Build OpenNext worker
pnpm build:worker

# Deploy to Cloudflare
wrangler deploy
```

#### Local Preview

```bash
# Build and preview locally
pnpm preview
```

#### Deployment Configuration

**`wrangler.json`**: Cloudflare Workers configuration
- Runtime: Cloudflare Workers
- Compatibility: Next.js SSR via OpenNext adapter

**`open-next.config.ts`**: OpenNext adapter configuration
- Converts Next.js app to Cloudflare Workers-compatible format
- Handles SSR, API routes, and static assets

### Deployment Flow

1. **Build**: `pnpm build:worker` runs `opennextjs-cloudflare`
2. **Convert**: OpenNext transforms Next.js app for Cloudflare runtime
3. **Deploy**: `wrangler deploy` publishes to Cloudflare Workers
4. **Edge Runtime**: App runs on Cloudflare's global edge network

---

## Component System

### shadcn/ui Integration

dev-kit uses **shadcn/ui** for UI components with Base UI as the headless foundation.

**Configuration**: `components.json`
```json
{
  "style": "new-york",
  "rsc": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

### Component Showcase

**`components/component-example.tsx`**: Demonstrates UI components including:
- **Card**: With media, actions, badges
- **Form**: Multi-field user input with validation
- **Dialog**: Alert dialogs with media support
- **Dropdown Menu**: Multi-level nested menus with keyboard shortcuts
- **Select**: Dropdown selection
- **Combobox**: Searchable selection
- **Input/Textarea**: Text entry
- **Button**: Primary, secondary, outline, destructive variants
- **Badge**: Status indicators

---

## Styling System

### Tailwind CSS 4

Using **Tailwind CSS 4.x** (latest major version) with PostCSS integration.

**`postcss.config.mjs`**: PostCSS configuration
**`app/globals.css`**: Global styles and Tailwind directives (4315 bytes)

### CSS Variables

- **baseColor**: neutral
- **CSS Variables enabled**: Theme customization via CSS variables
- **Dark mode support**: Via `next-themes` package

### Animation

- **tw-animate-css**: 1.4.0 - Tailwind animation utilities

---

## Code Quality

### Linting: oxlint

**oxlint** (1.41.0) - Rust-based linter, significantly faster than ESLint.

**Configuration**: `.oxlintrc.json` (203 bytes)

```bash
# Run linter
pnpm lint

# Auto-fix issues
pnpm lint:fix
```

### Formatting: oxfmt

**oxfmt** (0.26.0) - Rust-based formatter, alternative to Prettier.

**Configuration**: `.oxfmtrc.json` (189 bytes)

```bash
# Format code
pnpm format

# Check formatting without changes
pnpm format:check
```

### Type Checking

```bash
# Type checking is handled by TypeScript
tsc --noEmit
```

---

## Dependencies Summary

### Production Dependencies (19)

| Package | Version | Purpose |
|---------|---------|---------|
| next | 16.1.4 | React framework |
| react | 19.2.3 | UI library |
| react-dom | 19.2.3 | React DOM rendering |
| @base-ui/react | 1.1.0 | Headless components |
| shadcn | 3.7.0 | Component CLI |
| tailwind-merge | 3.4.0 | Utility merging |
| clsx | 2.1.1 | Conditional classes |
| class-variance-authority | 0.7.1 | Variant management |
| @tabler/icons-react | 3.36.1 | Icons |
| date-fns | 4.1.0 | Date utilities |
| cmdk | 1.1.1 | Command palette |
| embla-carousel-react | 8.6.0 | Carousel |
| input-otp | 1.4.2 | OTP input |
| next-themes | 0.4.6 | Theme management |
| react-day-picker | 9.13.0 | Date picker |
| react-resizable-panels | 4.4.1 | Resizable panels |
| recharts | 2.15.4 | Charts |
| sonner | 2.0.7 | Notifications |
| vaul | 1.1.2 | Drawer |

### Development Dependencies (8)

| Package | Version | Purpose |
|---------|---------|---------|
| typescript | 5.x | Type checking |
| @types/node | 20.x | Node.js types |
| @types/react | 19.x | React types |
| @types/react-dom | 19.x | React DOM types |
| oxlint | 1.41.0 | Linting |
| oxfmt | 0.26.0 | Formatting |
| @tailwindcss/postcss | 4.x | Tailwind PostCSS |
| tailwindcss | 4.x | CSS framework |
| @opennextjs/cloudflare | 1.15.0 | Cloudflare adapter |
| wrangler | 4.59.3 | Cloudflare CLI |

---

## Architecture Decisions

### Why Next.js 16?
- Latest version with improved App Router performance
- Server Components for optimal rendering
- React 19 support with concurrent features
- Native TypeScript support

### Why Cloudflare Workers?
- Global edge deployment for low latency
- Serverless scaling without infrastructure management
- Cost-effective for low-to-medium traffic
- Excellent developer experience with Wrangler

### Why oxlint/oxfmt over ESLint/Prettier?
- **Performance**: 50-100x faster than ESLint/Prettier (Rust-based)
- **Zero config**: Sensible defaults out of the box
- **Consistency**: Single toolchain for linting and formatting
- **Modern**: Built for current JavaScript/TypeScript best practices

### Why pnpm over npm/yarn?
- **Disk efficiency**: Symlinked node_modules saves space
- **Speed**: Faster installation than npm
- **Workspace support**: Native monorepo capabilities
- **Strictness**: Better dependency resolution

### Why shadcn/ui?
- **Ownership**: Copy components into project (not a dependency)
- **Customization**: Full control over component code
- **Accessibility**: Built on Base UI (accessible by default)
- **Modern**: Tailwind CSS 4 and React 19 compatible

---

## Testing Strategy

### Current State
- No testing framework currently integrated
- Component showcase serves as visual regression testing

### Future Considerations
- **Unit testing**: Vitest (fast, Vite-powered)
- **Component testing**: React Testing Library
- **E2E testing**: Playwright (Cloudflare Workers compatible)
- **Visual regression**: Chromatic or Percy

---

## Performance Considerations

### Build Optimization
- **Server Components**: Reduced client-side JavaScript
- **Code splitting**: Automatic via Next.js App Router
- **Tree shaking**: Dead code elimination
- **Image optimization**: Next.js Image component (if needed)

### Runtime Performance
- **Edge deployment**: Low latency via Cloudflare global network
- **SSR**: Server-side rendering for fast initial load
- **Streaming**: React 19 streaming capabilities
- **Client-side navigation**: Fast SPA-like transitions

### Tooling Performance
- **oxlint**: ~100x faster than ESLint
- **oxfmt**: ~50x faster than Prettier
- **pnpm**: Faster installs than npm/yarn

---

## Security Considerations

- **TypeScript strict mode**: Catches type-related bugs
- **No external API calls**: File system-based workflows
- **Cloudflare Workers**: Isolated runtime environment
- **Dependency auditing**: Regular `pnpm audit` checks
- **Modern dependencies**: Using latest stable versions

---

## Monitoring & Observability

### Current State
- No observability tooling integrated
- Relies on Cloudflare Workers analytics

### Future Integration Points
- **Error tracking**: Sentry or Cloudflare Workers Analytics
- **Performance monitoring**: Cloudflare Web Analytics
- **Logging**: Cloudflare Workers Tail or structured logging
- **Metrics**: Custom metrics via Cloudflare Analytics Engine

---

## Migration & Upgrade Paths

### Technology Migrations Completed
- ✅ **ESLint → oxlint**: Modern, faster linting
- ✅ **Prettier → oxfmt**: Modern, faster formatting
- ✅ **npm/yarn → pnpm**: Efficient package management

### Future Upgrade Considerations
- **Next.js**: Monitor for Next.js 17+ releases
- **React**: Already on latest (19.2.3)
- **Tailwind CSS**: Already on latest (4.x)
- **TypeScript**: Monitor for TypeScript 6.x

---

## Assumptions & Open Questions

### Assumptions
1. Cloudflare Workers is the target deployment platform (no serverless functions elsewhere)
2. File system access is available for `.dev-kit/` directory operations
3. pnpm is the standard package manager (no npm/yarn support)
4. oxlint/oxfmt provide sufficient linting/formatting (no ESLint/Prettier needed)
5. Component showcase is for demonstration, not production feature
6. No authentication or multi-user support required
7. All UI state is client-side (no database persistence)

### Open Questions
1. **Node.js version**: Should we add `.node-version` or `.nvmrc` for consistency?
2. **Testing**: Which testing framework should be integrated (Vitest, Jest)?
3. **CI/CD**: Should we add GitHub Actions for linting, formatting, and type checking?
4. **Environment variables**: Do workflows need configurable parameters?
5. **API routes**: Are Next.js API routes needed for workflow execution?
6. **Monorepo**: Will dev-kit expand into a monorepo with multiple packages?
7. **Database**: Will `.dev-kit/` artifacts eventually need database storage?
8. **Multi-project**: Should dev-kit support managing multiple projects simultaneously?
9. **Plugin system**: Should workflows support plugin extensions?
10. **Versioning**: How should workflow definitions be versioned?
