# OpenNext & Cloudflare - Knowledge Reference

## Overview

**OpenNext** is an open-source adapter that enables Next.js applications to run on platforms other than Vercel. For **Cloudflare Workers**, it provides a bridge to run Next.js App Router features, including SSR, streaming, and Partial Prerendering (PPR), on the edge.

---

## Key Features

### 1. Edge-First SSR
Runs the Next.js server directly on Cloudflare's global edge network, minimizing latency for users worldwide.

### 2. Streaming & PPR
Supports Next.js response streaming, allowing parts of the UI to be sent immediately while slow data requests finish in the background.

### 3. Node.js Compatibility
Leverages Cloudflare's Node.js compatibility layer to run standard Next.js logic.

---

## Deployment in dev-kit

The project uses `@opennextjs/cloudflare` and `wrangler`.

### Architecture
1. **Next.js Build**: Standard Next.js production build.
2. **OpenNext Conversion**: Converts the build output into a Cloudflare Workers-compatible worker script.
3. **Wrangler Upload**: Deploys the worker to the Cloudflare network.

### Commands
```bash
# Build the worker
pnpm build:worker

# Cloudflare preview
pnpm preview

# Deploy to production
pnpm deploy
```

---

## Configuration

**`open-next.config.ts`**:
Configures how OpenNext should transform the Next.js application.

**`wrangler.json`**:
Defines the Cloudflare Worker name, compatibility flags, and bindings.

---

## Best Practices

1. **Keep Bundles Small**: Cloudflare Workers have a 1MB/10MB script size limit (depending on the plan). Use dynamic imports for large libraries.
2. **Use Edge-Safe APIs**: Stick to standardized Web APIs or the specific Node.js APIs supported by Cloudflare.
3. **Environment Variables**: Use `wrangler secret` for sensitive information and the `env` block in `wrangler.json` for non-sensitive data.

---

## Resources
- [OpenNext Home](https://opennext.js.org/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)

---

## Status

✅ **Implemented in dev-kit**  
📚 **OpenNext-Cloudflare Version**: 1.15.0  
📚 **Wrangler Version**: 4.59.3  
🔄 **Last Updated**: 2026-01-22
