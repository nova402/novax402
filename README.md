# Nova402 Utilities

Multi-chain x402 payment infrastructure utilities and SDKs for the Nova402 ecosystem.

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-blue)](https://www.python.org/)
[![Rust](https://img.shields.io/badge/Rust-1.75+-orange)](https://www.rust-lang.org/)

Core infrastructure, SDKs, and tools for building payment-native services using the x402 protocol across Base, Solana, and supported blockchains.

## Overview

Nova402 Utilities enables:

✧ Pay-per-request APIs with instant micropayments  
✧ Multi-chain support: Base, Solana, Polygon, BSC, Peaq, Sei  
✧ Service discovery and integration  
✧ Developer SDKs for TypeScript, Python, Rust, Go, C  
✧ Sub-second payment settlement

Built on the [x402 protocol specification](https://github.com/coinbase/x402).

## Packages

### TypeScript

✧ [@nova402/core](./typescript/packages/core) - Core x402 protocol implementation  
✧ [@nova402/next](./typescript/packages/next) - Next.js App Router integration  
✧ [@nova402/express](./typescript/packages/express) - Express.js middleware  
✧ [@nova402/react](./typescript/packages/react) - React hooks and components  
✧ [@nova402/solana](./typescript/packages/solana) - Solana payment adapter  
✧ [@nova402/client](./typescript/packages/client) - Universal HTTP client

### Python

✧ [nova402](./python/nova402) - Python SDK for x402 services  
✧ Server integrations for FastAPI, Flask, Django  
✧ Client library for making x402 payments

### Rust

✧ [nova402-core](./rust/nova402-core) - High-performance crypto utilities  
✧ [nova402-cli](./rust/nova402-cli) - Command-line tools  
✧ [nova402-wasm](./rust/nova402-wasm) - WebAssembly bindings

### Go

✧ [nova402](./go/pkg/nova402) - Go SDK for microservices  
✧ [nova402-cli](./go/cmd/nova402) - Go-based CLI tools

### C

✧ [libnova402](./c) - Low-level library for embedded systems and FFI

## Quick Start

### TypeScript/Node.js

```bash
# Install packages
pnpm add @nova402/express @nova402/core

# Server Example
import { x402Middleware } from '@nova402/express';

app.post('/api/ai/generate',
  x402Middleware({
    price: '0.10',
    asset: 'USDC',
    network: 'base-mainnet',
    payTo: process.env.TREASURY_WALLET
  }),
  async (req, res) => {
    const result = await generateAI(req.body);
    res.json(result);
  }
);
```

### Python

```bash
pip install nova402

# Server Example
from nova402 import x402_required

@app.route('/api/data')
@x402_required(price='0.05', asset='USDC', network='base-mainnet')
def get_data():
    return {"data": "premium content"}
```

### Rust

```bash
cargo add nova402-core

// Crypto utilities
use nova402_core::{sign_payment, verify_signature, keccak256};

let signature = sign_payment(&payment_data, &private_key)?;
```

## Supported Networks

| Network | Chain ID | Status | Currency |
|---------|----------|--------|----------|
| Base Mainnet | 8453 | ✅ Live | USDC |
| Base Sepolia | 84532 | ✅ Live | USDC |
| Solana Mainnet | - | ✅ Live | USDC, SOL |
| Solana Devnet | - | ✅ Live | USDC |
| Polygon | 137 | 🔄 Soon | USDC |
| BSC | 56 | 🔄 Soon | USDC |
| Peaq | 3338 | 📋 Planned | USDC |
| Sei | 1329 | 📋 Planned | USDC |

## Architecture

```
┌─────────────────────────────────────────────────────┐
│              Nova402 Platform Layer                  │
│  (Service Hub, Indexer, Token Mint, Native Agent)   │
└─────────────────────────────────────────────────────┘
                         │
┌─────────────────────────────────────────────────────┐
│              SDK Layer (nova-utils)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │TypeScript│  │  Python  │  │   Rust   │          │
│  │   SDKs   │  │   SDK    │  │  Utils   │          │
│  └──────────┘  └──────────┘  └──────────┘          │
└─────────────────────────────────────────────────────┘
                         │
┌─────────────────────────────────────────────────────┐
│            x402 Protocol Layer                       │
│  (Payment Requirements, Verification, Settlement)    │
└─────────────────────────────────────────────────────┘
                         │
┌─────────────────────────────────────────────────────┐
│         Blockchain Layer                             │
│  (Base, Solana, Polygon, BSC, Peaq, Sei)           │
└─────────────────────────────────────────────────────┘
```

## Examples

✧ [Express API](./examples/typescript/express-server) - Express.js API with x402 payments  
✧ [Python FastAPI](./examples/python/fastapi-server) - FastAPI service with x402  
✧ [Rust CLI](./rust/nova402-cli) - Command-line tools  
✧ [Go Client](./go/pkg/nova402) - Go HTTP client implementation

## Development

### Prerequisites

✧ Node.js 18+  
✧ Python 3.8+  
✧ Rust 1.75+  
✧ Go 1.21+  
✧ pnpm 9+

### Setup

```bash
# Clone repository
git clone https://github.com/nova402/nova-utils.git
cd nova-utils

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test
```

### Monorepo Structure

```
nova-utils/
├── typescript/          # TypeScript packages and examples
│   ├── packages/       # Published npm packages
│   └── examples/       # Working examples
├── python/             # Python SDK
│   ├── nova402/       # Core package
│   └── examples/      # Python examples
├── rust/               # Rust utilities
│   ├── nova402-core/  # Core library
│   ├── nova402-cli/   # CLI tools
│   └── nova402-wasm/  # WASM bindings
├── go/                 # Go SDK
│   ├── pkg/           # Go packages
│   └── cmd/           # CLI commands
├── specs/              # Protocol specifications
├── e2e/                # End-to-end tests
└── docs/               # Documentation
```

## Documentation

✧ [Getting Started](./docs/getting-started.md) - Quick start guide  
✧ [x402 Protocol](./specs/x402-protocol.md) - Protocol specification  
✧ [Architecture](./docs/architecture.md) - System architecture  
✧ [Contributing](./CONTRIBUTING.md) - Contribution guidelines

## Use Cases

Service Providers:
✧ AI/ML APIs - Monetize inference, training, predictions  
✧ Data Services - Real-time feeds, analytics, market data  
✧ Content APIs - Articles, media, premium content  
✧ Compute Services - On-demand processing, rendering

Developers:
✧ API monetization without subscriptions  
✧ Micropayments as low as $0.001  
✧ Usage-based pricing models  
✧ Instant on-chain settlement

## Security

✧ Non-custodial - Users maintain full control  
✧ Cryptographic verification - EIP-712 (EVM), Ed25519 (Solana)  
✧ On-chain settlement - All payments verifiable  
✧ Open source - Fully auditable

## Contributing

See [Contributing Guide](./CONTRIBUTING.md) for development workflow, code style, and submission guidelines.

## License

Apache License 2.0 - see [LICENSE](./LICENSE) file.

## Links

✧ Website: [nova402.com](https://nova402.com)  
✧ Documentation: [docs.nova402.com](https://docs.nova402.com)  
✧ GitHub: [github.com/nova402](https://github.com/nova402)  
✧ x402 Protocol: [github.com/coinbase/x402](https://github.com/coinbase/x402)

