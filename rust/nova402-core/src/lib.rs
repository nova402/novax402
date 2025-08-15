//! # nova402-core
//!
//! High-performance cryptographic utilities for the Nova402 x402 payment protocol.
//!
//! This crate provides Rust implementations of performance-critical operations including:
//! - Keccak-256 and SHA3 hashing
//! - EVM (secp256k1) signature creation and verification
//! - Payment data encoding and decoding
//! - Merkle tree construction and proof generation
//! - Address and payment validation
//!
//! ## Features
//!
//! - **High Performance**: Optimized for speed and low memory usage
//! - **Type Safety**: Leverages Rust's type system for correctness
//! - **Zero-Cost Abstractions**: No runtime overhead
//! - **Well Tested**: Comprehensive test suite
//! - **FFI Ready**: Can be compiled to C-compatible library
//!
//! ## Examples
//!
//! ```rust
//! use nova402_core::{keccak256, sign_payment, verify_signature};
//!
//! // Hash data
//! let hash = keccak256(b"Hello, x402!");
//!
//! // Sign payment (example with test key)
//! let private_key = [1u8; 32];
//! let message = b"Payment data";
//! let signature = sign_payment(message, &private_key).unwrap();
//!
//! // Verify signature
//! let recovered_address = recover_signer(message, &signature).unwrap();
//! ```

pub mod encoding;
pub mod errors;
pub mod hashing;
pub mod merkle;
pub mod signature;
pub mod validation;

// Re-export main types and functions
pub use encoding::{
    decode_payment_from_base64, decode_x402_payload, encode_payment_to_base64,
    encode_x402_payload, EIP3009Authorization, PaymentAuthorization, PaymentData,
    PaymentPayload, PaymentRequirements,
};
pub use errors::{CryptoError, Result};
pub use hashing::{
    double_keccak256, hash_concat, hash_payment_data, hash_string, keccak256, keccak256_hash,
    sha256, sha3_256,
};
pub use merkle::{
    compute_merkle_root, generate_merkle_proof, verify_merkle_proof, MerkleTree,
};
pub use signature::{recover_signer, sign_payment, verify_signature, SignatureComponents};
pub use validation::{
    is_payment_expired, is_payment_valid_now, validate_address, validate_amount,
    validate_chain_id, validate_network, validate_payment_data, validate_scheme,
};

/// x402 protocol version
pub const X402_VERSION: u32 = 1;

/// Maximum payment deadline in seconds from now (30 days)
pub const MAX_DEADLINE_SECONDS: u64 = 30 * 24 * 60 * 60;

/// Default payment timeout (5 minutes)
pub const DEFAULT_TIMEOUT_SECONDS: u64 = 300;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_keccak256() {
        let data = b"Hello, x402!";
        let hash = keccak256(data);
        assert_eq!(hash.len(), 32);
    }

    #[test]
    fn test_validate_chain_id() {
        assert!(validate_chain_id(1));
        assert!(validate_chain_id(8453));
        assert!(!validate_chain_id(0));
    }

    #[test]
    fn test_validate_network() {
        assert!(validate_network("eip155:8453"));
        assert!(validate_network("solana:mainnet"));
        assert!(!validate_network("invalid"));
    }
}

