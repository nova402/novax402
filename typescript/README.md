# Nova402 TypeScript Packages

> TypeScript/JavaScript SDK packages for Nova402 x402 payment protocol

This workspace contains the TypeScript implementation of Nova402 utilities, providing the primary SDK layer for web and Node.js applications.

## Packages

### Published Packages

- **[@nova402/core](./packages/core)** ✅ - Core x402 protocol implementation
- **[@nova402/express](./packages/express)** 📋 - Express.js middleware (coming soon)
- **[@nova402/next](./packages/next)** 📋 - Next.js App Router integration (coming soon)
- **[@nova402/react](./packages/react)** 📋 - React hooks and components (coming soon)
- **[@nova402/client](./packages/client)** 📋 - Universal HTTP client (coming soon)
- **[@nova402/solana](./packages/solana)** 📋 - Solana payment adapter (coming soon)

## Installation

```bash
# Install specific package
pnpm add @nova402/core

# Or with npm
npm install @nova402/core
```

## Quick Start

### Core Protocol

```typescript
import {
  createPaymentRequirements,
  verifyEVMPayment,
  getUSDCAddress,
} from '@nova402/core';

// Create payment requirements
const requirements = createPaymentRequirements({
  price: '100000', // 0.10 USDC
  asset: getUSDCAddress('base-mainnet'),
  network: 'eip155:8453',
  payTo: '0x...',
  resource: '/api/endpoint',
  description: 'API access',
});

// Verify payment
const result = verifyEVMPayment(payment, requirements);
if (result.valid) {
  // Payment is valid
}
```

## Development

### Setup

```bash
pnpm install
```

### Build

```bash
# Build all packages
pnpm build

# Build specific package
pnpm --filter @nova402/core build
```

### Test

```bash
# Run all tests
pnpm test

# Run specific package tests
pnpm --filter @nova402/core test

# Watch mode
pnpm test:watch
```

### Lint

```bash
pnpm lint
pnpm typecheck
```

## Examples

See [examples directory](./examples) for complete working examples:

- **[Express Server](../examples/typescript/express-server)** - Complete Express.js API
- **[Next.js App](../examples/typescript/next-app)** - Next.js 15 application
- **[Client Usage](../examples/typescript/client-example)** - HTTP client

## Package Development

### Creating a New Package

```bash
mkdir -p packages/my-package/src
cd packages/my-package

# Create package.json
cat > package.json << EOF
{
  "name": "@nova402/my-package",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest"
  }
}
EOF

# Create tsconfig.json
cat > tsconfig.json << EOF
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
EOF
```

### Publishing

```bash
# Build packages
pnpm build

# Create changeset
pnpm changeset

# Version packages
pnpm changeset version

# Publish
pnpm changeset publish
```

## Architecture

```
@nova402/core (Base layer)
    ↓
@nova402/express  @nova402/next  @nova402/react
    ↓                 ↓              ↓
Application Layer (Your apps)
```

## Conventions

- **Naming**: kebab-case for packages, camelCase for code
- **Exports**: Named exports preferred over default
- **Types**: Explicit type annotations
- **Async**: Use async/await, not callbacks
- **Errors**: Throw typed errors, catch at boundaries

## Testing

- **Unit tests**: vitest
- **Type tests**: TypeScript compiler
- **Integration tests**: vitest with test servers
- **E2E tests**: In `../../e2e/typescript`

## Performance

- **Bundle size**: Keep packages small
- **Tree shaking**: Ensure proper tree shaking
- **No circular deps**: Avoid circular dependencies
- **Lazy loading**: Load heavy deps on demand

## Documentation

- **TSDoc comments**: All public APIs
- **README**: Per-package documentation
- **Examples**: Working code examples
- **Type exports**: Export all useful types

## License

Apache-2.0

## Links

- [Main Repository](https://github.com/nova402/nova-utils)
- [Documentation](https://docs.nova402.com)
- [Website](https://nova402.com)

