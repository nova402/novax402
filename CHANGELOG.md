# Changelog

All notable changes to Nova402 Utilities will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-27

### Added

#### TypeScript Packages

- **@nova402/core** - Core x402 protocol implementation
  - Payment requirements generation
  - EIP-712 signature verification
  - Payment header encoding/decoding
  - Multi-chain network support (Base, Solana, Polygon, BSC, Peaq, Sei)
  - Comprehensive validation utilities
  - Zod schema validation

#### Python SDK

- **nova402** - Python SDK for x402 protocol
  - Full protocol implementation
  - FastAPI integration decorator
  - Flask integration support
  - Async/await support
  - Type hints throughout
  - Pydantic models

#### Rust Utilities

- **nova402-core** - High-performance cryptographic library
  - Keccak-256, SHA-256, SHA3-256 hashing
  - EVM signature creation and verification (secp256k1)
  - Merkle tree construction and proof generation
  - Payment data validation
  - Encoding/decoding utilities
  - Zero-cost abstractions

- **nova402-cli** - Command-line tools
  - Payment verification
  - Service discovery
  - Network information
  - Cryptographic operations
  - Interactive mode

#### Go SDK

- **nova402** - Go SDK for microservices
  - HTTP client with automatic payment handling
  - Server middleware
  - Multi-chain support
  - Production-ready error handling

#### C Library

- **libnova402** - Low-level C library
  - Header-only interface
  - Cryptographic primitives
  - FFI-compatible
  - Minimal dependencies
  - Cross-platform support

#### Documentation

- Complete README with architecture diagrams
- Getting started guide
- API reference documentation
- Architecture overview
- Contributing guidelines
- Security policy

#### Examples

- TypeScript Express server with multiple paid endpoints
- Python FastAPI server with x402 integration
- Complete end-to-end test suite
- Cross-language compatibility examples

#### Infrastructure

- GitHub Actions workflows for all languages
- Turborepo monorepo configuration
- pnpm workspace setup
- CMake build system for C
- Cargo workspace for Rust
- Comprehensive .gitignore

### Security

- Apache-2.0 license
- Security policy with responsible disclosure
- Cryptographic best practices
- No private key storage
- Secure random number generation

## [Unreleased]

### Planned

- WebAssembly bindings (Rust → WASM)
- React SDK with hooks
- Next.js middleware
- Facilitator client package
- Payment verifier package
- Settlement engine package
- Additional network support (Polygon, BSC, Peaq, Sei)
- GraphQL API
- Service registry implementation
- Advanced analytics

---

[1.0.0]: https://github.com/nova402/nova-utils/releases/tag/v1.0.0

