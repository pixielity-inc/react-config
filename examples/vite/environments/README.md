# Environment Variables

This folder contains environment-specific configuration files for the production app.

## Files

- `.env.development` - Development environment (used with `pnpm run dev`)
- `.env.production` - Production environment (used with `pnpm run build`)
- `.env.staging` - Staging environment (used with `pnpm run build --mode staging`)
- `.env.local.example` - Example local overrides (copy to `.env.local`)

## Usage

### Development
```bash
pnpm run dev
# Loads .env.development
```

### Production Build
```bash
pnpm run build
# Loads .env.production
```

### Staging Build
```bash
pnpm run build --mode staging
# Loads .env.staging
```

### Local Overrides
Create a `.env.local` file (gitignored) to override any environment variables for your local development:

```bash
cp .env.local.example .env.local
# Edit .env.local with your local settings
```

## Variable Naming

All environment variables must be prefixed with `VITE_` to be exposed to the client-side code:

```bash
# ✅ Exposed to client
VITE_API_URL=http://localhost:3000

# ❌ NOT exposed to client (server-only)
API_SECRET_KEY=secret123
```

## Accessing Variables

In your code, access environment variables using `import.meta.env`:

```typescript
// TypeScript
const apiUrl = import.meta.env.VITE_API_URL;
const appName = import.meta.env.VITE_APP_NAME;
```

## Priority Order

Vite loads environment files in this order (later files override earlier ones):

1. `.env` - Loaded in all cases
2. `.env.local` - Loaded in all cases, ignored by git
3. `.env.[mode]` - Only loaded in specified mode (e.g., `.env.development`)
4. `.env.[mode].local` - Only loaded in specified mode, ignored by git

## Security

- Never commit `.env.local` or `.env.*.local` files (they're gitignored)
- Never commit sensitive data like API keys or secrets
- Use server-side environment variables (without `VITE_` prefix) for sensitive data
- For production, set environment variables in your deployment platform (Vercel, Netlify, etc.)
