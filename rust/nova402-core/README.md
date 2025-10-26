# nova402-core

High-performance cryptographic utilities for Nova402 x402 protocol.

[![Crates.io](https://img.shields.io/crates/v/nova402-core.svg)](https://crates.io/crates/nova402-core)
[![Documentation](https://docs.rs/nova402-core/badge.svg)](https://docs.rs/nova402-core)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Performance-critical operations for the x402 payment protocol: cryptographic signing, verification, hashing, and Merkle trees.

## Features

✧ High performance - Optimized for speed and low memory  
✧ Cryptographic operations - EVM signing, verification, hashing  
✧ Merkle trees - Construction and proof generation  
✧ Multi-chain support - EVM and Solana  
✧ Minimal dependencies - Lean dependency footprint  
✧ Comprehensive tests - Full test coverage

## Installation

Add to your `Cargo.toml`:

```toml
[dependencies]
nova402-core = "1.0"
```

## Quick Start

### Keccak-256 Hashing

```rust
use nova402_core::{keccak256, keccak256_hash};

// Compute hash
let hash = keccak256(b"Hello, x402!");
assert_eq!(hash.len(), 32);

// Get hex string
let hex_hash = keccak256_hash(b"Hello, x402!");
println!("{}", hex_hash); // 0x...
```

### EVM Signature Verification

```rust
use nova402_core::{sign_payment, verify_signature, SignatureComponents};

// Sign payment data
let private_key = hex::decode("...").unwrap();
let message = b"Payment authorization";

let signature = sign_payment(message, &private_key)?;

// Verify signature
let is_valid = verify_signature(
    message,
    &signature,
    "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
)?;
```

### Merkle Tree Operations

```rust
use nova402_core::{MerkleTree, compute_merkle_root};

// Create leaves
let leaves: Vec<[u8; 32]> = vec![
    keccak256(b"tx1"),
    keccak256(b"tx2"),
    keccak256(b"tx3"),
];

// Compute root
let root = compute_merkle_root(&leaves)?;

// Build tree
let tree = MerkleTree::new(leaves);
let proof = tree.generate_proof(0)?;

// Verify proof
let is_valid = tree.verify_proof(&leaves[0], &proof, 0);
```

### Payment Data Validation

```rust
use nova402_core::{validate_address, validate_payment_data};

// Validate address
assert!(validate_address("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"));

// Validate complete payment
validate_payment_data(
    "0xFrom...",
    "0xTo...",
    "100000",
    1234567890,
    1234567990
)?;
```

### Encoding/Decoding

```rust
use nova402_core::{encode_x402_payload, decode_x402_payload, PaymentPayload};

let payload = PaymentPayload {
    x402_version: 1,
    scheme: "exact".to_string(),
    network: "eip155:8453".to_string(),
    payload: PaymentAuthorization {
        authorization: None,
        transaction: None,
        signatures: None,
    },
};

// Encode to JSON
let encoded = encode_x402_payload(&payload)?;

// Decode from JSON
let decoded = decode_x402_payload(&encoded)?;
```

## API Documentation

### Hashing

- `keccak256(data: &[u8]) -> [u8; 32]` - Keccak-256 hash
- `keccak256_hash(data: &[u8]) -> String` - Keccak-256 with hex encoding
- `sha3_256(data: &[u8]) -> [u8; 32]` - SHA3-256 hash
- `sha256(data: &[u8]) -> [u8; 32]` - SHA-256 hash
- `double_keccak256(data: &[u8]) -> [u8; 32]` - Double Keccak-256

### Signature Operations

- `sign_payment(message, private_key) -> Result<SignatureComponents>` - Sign with secp256k1
- `verify_signature(message, signature, expected_address) -> Result<bool>` - Verify signature
- `recover_signer(message, signature) -> Result<String>` - Recover signer address

### Validation

- `validate_address(address: &str) -> bool` - Validate Ethereum address
- `validate_chain_id(chain_id: u64) -> bool` - Validate chain ID
- `validate_network(network: &str) -> bool` - Validate network (CAIP-2)
- `validate_scheme(scheme: &str) -> bool` - Validate payment scheme
- `validate_amount(amount: &str) -> Result<bool>` - Validate payment amount
- `validate_payment_data(...) -> Result<()>` - Validate complete payment

### Merkle Trees

- `MerkleTree::new(leaves) -> Self` - Create Merkle tree
- `compute_merkle_root(leaves) -> Result<[u8; 32]>` - Compute root
- `generate_merkle_proof(leaves, index) -> Result<Vec<[u8; 32]>>` - Generate proof
- `verify_merkle_proof(leaf, proof, root, index) -> bool` - Verify proof

### Encoding

- `encode_x402_payload(payload) -> Result<String>` - Encode to JSON
- `decode_x402_payload(json) -> Result<PaymentPayload>` - Decode from JSON
- `encode_payment_to_base64(payload) -> Result<String>` - Encode to base64
- `decode_payment_from_base64(encoded) -> Result<PaymentPayload>` - Decode from base64

## Performance

Benchmarks on Apple M1:

- Keccak-256 hashing: ~1.2 μs per hash
- Signature verification: ~45 μs per signature
- Merkle root (1000 leaves): ~1.2 ms
- Payment validation: ~50 μs

Run benchmarks: `cargo bench`

## Building

```bash
# Build library
cargo build --release

# Run tests
cargo test

# Run benchmarks
cargo bench

# Generate documentation
cargo doc --open
```

## FFI Support

This crate can be compiled to a C-compatible library:

```toml
[lib]
crate-type = ["rlib", "cdylib"]
```

```bash
cargo build --release --lib
```

## WASM Support

See [nova402-wasm](../nova402-wasm) for WebAssembly bindings.

## Examples

See the [examples directory](./examples) for complete usage examples.

## License

Apache-2.0

## Links

- [Documentation](https://docs.rs/nova402-core)
- [Crates.io](https://crates.io/crates/nova402-core)
- [GitHub](https://github.com/nova402/nova-utils)

