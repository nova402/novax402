# Nova402 Rust Workspace

> High-performance Rust implementations for Nova402 x402 protocol

This workspace contains Rust crates for performance-critical operations in the Nova402 ecosystem.

## Packages

### [nova402-core](./nova402-core)

Core cryptographic library providing:
- Keccak-256, SHA-256, SHA3 hashing
- EVM signature creation and verification
- Merkle tree operations
- Payment validation
- Encoding/decoding utilities

**Use cases:**
- High-performance backend services
- Cryptographic operations
- FFI layer for other languages
- WebAssembly modules

### [nova402-cli](./nova402-cli)

Command-line tools for:
- Payment verification and settlement
- Service discovery and testing
- Network information
- Cryptographic operations
- Interactive mode

**Use cases:**
- DevOps automation
- Service management
- Testing and debugging
- System administration

### [nova402-wasm](./nova402-wasm) (Coming Soon)

WebAssembly bindings for:
- Browser crypto operations
- Node.js integration
- TypeScript types
- Zero-copy optimizations

**Use cases:**
- Frontend applications
- Node.js performance boost
- Cross-platform compatibility

## Building

### Build all crates

```bash
cargo build --release
```

### Build specific crate

```bash
cd nova402-core
cargo build --release
```

### Run all tests

```bash
cargo test --all
```

### Run benchmarks

```bash
cargo bench --all
```

## Installation

### From crates.io

```bash
cargo add nova402-core
cargo install nova402-cli
```

### From source

```bash
git clone https://github.com/nova402/nova-utils.git
cd nova-utils/rust
cargo build --release
```

## Performance

Benchmarks on Apple M2:

| Operation | Time | Throughput |
|-----------|------|------------|
| Keccak-256 | 1.1 μs | 910k ops/s |
| SHA-256 | 0.8 μs | 1.25M ops/s |
| Signature verify | 42 μs | 23k ops/s |
| Merkle root (1k) | 1.1 ms | 900 ops/s |

Run your own benchmarks:
```bash
cargo bench
```

## Features

### Core Features

- ⚡ **Zero-cost abstractions**
- 🔒 **Memory safe**
- 🚀 **Performance optimized**
- 📦 **Minimal dependencies**
- 🧪 **Comprehensive tests**
- 📚 **Full documentation**

### Platform Support

- ✅ Linux (x86_64, ARM64)
- ✅ macOS (x86_64, ARM64)
- ✅ Windows (x86_64)
- ✅ WebAssembly
- ✅ Embedded (no_std support planned)

## Usage Examples

### Hashing

```rust
use nova402_core::keccak256;

let hash = keccak256(b"Hello, x402!");
println!("Hash: 0x{}", hex::encode(hash));
```

### Signature Verification

```rust
use nova402_core::{sign_payment, verify_signature};

let signature = sign_payment(message, &private_key)?;
let valid = verify_signature(message, &signature, expected_address)?;
```

### Merkle Trees

```rust
use nova402_core::{MerkleTree, keccak256};

let leaves: Vec<_> = (0..100)
    .map(|i| keccak256(format!("tx{}", i).as_bytes()))
    .collect();

let tree = MerkleTree::new(leaves)?;
let root = tree.root();
let proof = tree.generate_proof(50)?;
```

## Documentation

- **API Docs**: Run `cargo doc --open`
- **Book**: [docs.nova402.com/rust](https://docs.nova402.com/rust)
- **Examples**: See `examples/` directory in each crate

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## License

Apache-2.0

## Links

- [Crates.io](https://crates.io/search?q=nova402)
- [Docs.rs](https://docs.rs/nova402-core)
- [GitHub](https://github.com/nova402/nova-utils)
- [Website](https://nova402.com)

