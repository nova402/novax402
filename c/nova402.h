/**
 * Nova402 C Library
 * 
 * Low-level cryptographic and protocol utilities for x402 payment protocol.
 * Designed for embedded systems, high-performance applications, and FFI bindings.
 * 
 * @file nova402.h
 * @version 1.0.0
 * @license Apache-2.0
 */

#ifndef NOVA402_H
#define NOVA402_H

#include <stdint.h>
#include <stddef.h>
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

/* ============================================
 * VERSION AND CONSTANTS
 * ============================================ */

#define NOVA402_VERSION_MAJOR 1
#define NOVA402_VERSION_MINOR 0
#define NOVA402_VERSION_PATCH 0

#define NOVA402_HASH_SIZE 32
#define NOVA402_ADDRESS_SIZE 20
#define NOVA402_SIGNATURE_SIZE 65
#define NOVA402_NONCE_SIZE 32

#define NOVA402_SUCCESS 0
#define NOVA402_ERROR_INVALID_INPUT -1
#define NOVA402_ERROR_INVALID_SIGNATURE -2
#define NOVA402_ERROR_BUFFER_TOO_SMALL -3
#define NOVA402_ERROR_VERIFICATION_FAILED -4

/* ============================================
 * TYPES
 * ============================================ */

/**
 * Ethereum address (20 bytes)
 */
typedef struct {
    uint8_t bytes[NOVA402_ADDRESS_SIZE];
} nova402_address_t;

/**
 * Hash (32 bytes)
 */
typedef struct {
    uint8_t bytes[NOVA402_HASH_SIZE];
} nova402_hash_t;

/**
 * ECDSA signature components
 */
typedef struct {
    uint8_t r[32];
    uint8_t s[32];
    uint8_t v;
} nova402_signature_t;

/**
 * Payment data for signing
 */
typedef struct {
    nova402_address_t from;
    nova402_address_t to;
    uint64_t value;
    uint64_t valid_after;
    uint64_t valid_before;
    uint8_t nonce[NOVA402_NONCE_SIZE];
} nova402_payment_data_t;

/**
 * Network type
 */
typedef enum {
    NOVA402_NETWORK_EVM = 0,
    NOVA402_NETWORK_SOLANA = 1
} nova402_network_type_t;

/**
 * Network configuration
 */
typedef struct {
    uint64_t chain_id;
    const char *name;
    nova402_network_type_t type;
    const char *rpc_url;
} nova402_network_config_t;

/* ============================================
 * HASHING FUNCTIONS
 * ============================================ */

/**
 * Compute Keccak-256 hash (Ethereum compatible)
 * 
 * @param data Input data
 * @param length Data length
 * @param hash Output hash (32 bytes)
 * @return NOVA402_SUCCESS on success, error code otherwise
 */
int nova402_keccak256(const uint8_t *data, size_t length, nova402_hash_t *hash);

/**
 * Compute SHA-256 hash
 * 
 * @param data Input data
 * @param length Data length
 * @param hash Output hash (32 bytes)
 * @return NOVA402_SUCCESS on success, error code otherwise
 */
int nova402_sha256(const uint8_t *data, size_t length, nova402_hash_t *hash);

/**
 * Compute double Keccak-256 hash
 * 
 * @param data Input data
 * @param length Data length
 * @param hash Output hash (32 bytes)
 * @return NOVA402_SUCCESS on success, error code otherwise
 */
int nova402_double_keccak256(const uint8_t *data, size_t length, nova402_hash_t *hash);

/* ============================================
 * SIGNATURE FUNCTIONS
 * ============================================ */

/**
 * Sign payment data with private key
 * 
 * @param payment Payment data to sign
 * @param private_key Private key (32 bytes)
 * @param signature Output signature
 * @return NOVA402_SUCCESS on success, error code otherwise
 */
int nova402_sign_payment(
    const nova402_payment_data_t *payment,
    const uint8_t *private_key,
    nova402_signature_t *signature
);

/**
 * Verify payment signature
 * 
 * @param payment Payment data
 * @param signature Signature to verify
 * @param expected_signer Expected signer address
 * @return true if valid, false otherwise
 */
bool nova402_verify_signature(
    const nova402_payment_data_t *payment,
    const nova402_signature_t *signature,
    const nova402_address_t *expected_signer
);

/**
 * Recover signer address from signature
 * 
 * @param message Message hash
 * @param signature Signature
 * @param signer Output signer address
 * @return NOVA402_SUCCESS on success, error code otherwise
 */
int nova402_recover_signer(
    const nova402_hash_t *message,
    const nova402_signature_t *signature,
    nova402_address_t *signer
);

/* ============================================
 * VALIDATION FUNCTIONS
 * ============================================ */

/**
 * Validate Ethereum address format
 * 
 * @param address Address string (hex with 0x prefix)
 * @return true if valid, false otherwise
 */
bool nova402_validate_address(const char *address);

/**
 * Validate chain ID
 * 
 * @param chain_id Chain ID to validate
 * @return true if valid, false otherwise
 */
bool nova402_validate_chain_id(uint64_t chain_id);

/**
 * Validate payment is not expired
 * 
 * @param valid_before Validity deadline timestamp
 * @return true if not expired, false if expired
 */
bool nova402_validate_not_expired(uint64_t valid_before);

/**
 * Validate payment is in valid time window
 * 
 * @param valid_after Validity start timestamp
 * @param valid_before Validity end timestamp
 * @return true if currently valid, false otherwise
 */
bool nova402_validate_time_window(uint64_t valid_after, uint64_t valid_before);

/* ============================================
 * UTILITY FUNCTIONS
 * ============================================ */

/**
 * Convert hex string to bytes
 * 
 * @param hex Hex string (with or without 0x prefix)
 * @param bytes Output buffer
 * @param max_bytes Maximum bytes to write
 * @return Number of bytes written, or negative error code
 */
int nova402_hex_to_bytes(const char *hex, uint8_t *bytes, size_t max_bytes);

/**
 * Convert bytes to hex string
 * 
 * @param bytes Input bytes
 * @param length Bytes length
 * @param hex Output hex string buffer
 * @param hex_size Size of hex buffer (must be >= length*2 + 3 for "0x" prefix + null)
 * @return NOVA402_SUCCESS on success, error code otherwise
 */
int nova402_bytes_to_hex(const uint8_t *bytes, size_t length, char *hex, size_t hex_size);

/**
 * Generate random nonce
 * 
 * @param nonce Output nonce buffer (32 bytes)
 * @return NOVA402_SUCCESS on success, error code otherwise
 */
int nova402_generate_nonce(uint8_t *nonce);

/**
 * Get current Unix timestamp
 * 
 * @return Current timestamp in seconds
 */
uint64_t nova402_timestamp(void);

/* ============================================
 * NETWORK FUNCTIONS
 * ============================================ */

/**
 * Get network configuration by name
 * 
 * @param network Network name (e.g., "base-mainnet")
 * @param config Output network configuration
 * @return NOVA402_SUCCESS on success, error code otherwise
 */
int nova402_get_network_config(const char *network, nova402_network_config_t *config);

/**
 * Get USDC address for network
 * 
 * @param network Network name
 * @param address Output address string buffer
 * @param address_size Size of address buffer
 * @return NOVA402_SUCCESS on success, error code otherwise
 */
int nova402_get_usdc_address(const char *network, char *address, size_t address_size);

/* ============================================
 * MERKLE TREE FUNCTIONS
 * ============================================ */

/**
 * Compute Merkle root from leaves
 * 
 * @param leaves Array of leaf hashes
 * @param leaf_count Number of leaves
 * @param root Output Merkle root
 * @return NOVA402_SUCCESS on success, error code otherwise
 */
int nova402_merkle_root(
    const nova402_hash_t *leaves,
    size_t leaf_count,
    nova402_hash_t *root
);

/**
 * Verify Merkle proof
 * 
 * @param leaf Leaf hash to verify
 * @param proof Array of proof hashes
 * @param proof_length Number of proof hashes
 * @param root Expected Merkle root
 * @param index Leaf index in tree
 * @return true if valid, false otherwise
 */
bool nova402_verify_merkle_proof(
    const nova402_hash_t *leaf,
    const nova402_hash_t *proof,
    size_t proof_length,
    const nova402_hash_t *root,
    size_t index
);

/* ============================================
 * VERSION FUNCTIONS
 * ============================================ */

/**
 * Get library version string
 * 
 * @return Version string (e.g., "1.0.0")
 */
const char *nova402_version(void);

/**
 * Get library version as integer
 * 
 * @param major Output major version
 * @param minor Output minor version
 * @param patch Output patch version
 */
void nova402_version_numbers(int *major, int *minor, int *patch);

#ifdef __cplusplus
}
#endif

#endif /* NOVA402_H */

