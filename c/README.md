# Nova402 C Library

Low-level cryptographic and protocol utilities for x402 payment protocol.

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![C](https://img.shields.io/badge/C-99-blue.svg)](https://en.wikipedia.org/wiki/C99)

C library for x402 protocol operations. Designed for embedded systems, IoT devices, HFT systems, and FFI bindings.

## Features

✧ High performance - Optimized for critical operations  
✧ Low memory - Minimal footprint  
✧ Cryptographic operations - Keccak-256, SHA-256, ECDSA  
✧ Merkle trees - Proof generation and verification  
✧ Multi-platform - Linux, macOS, Windows, embedded  
✧ Zero dependencies - Optional OpenSSL for optimization

## Installation

### From Source

```bash
mkdir build && cd build
cmake ..
make
sudo make install
```

### CMake

Add to your `CMakeLists.txt`:

```cmake
find_package(Nova402 REQUIRED)
target_link_libraries(your_target Nova402::nova402)
```

## Quick Start

### Hashing

```c
#include <nova402.h>
#include <stdio.h>

int main() {
    const uint8_t data[] = "Hello, x402!";
    nova402_hash_t hash;
    
    // Compute Keccak-256 hash
    int result = nova402_keccak256(data, sizeof(data) - 1, &hash);
    if (result == NOVA402_SUCCESS) {
        // Convert to hex
        char hex[67];
        nova402_bytes_to_hex(hash.bytes, NOVA402_HASH_SIZE, hex, sizeof(hex));
        printf("Hash: %s\n", hex);
    }
    
    return 0;
}
```

### Signature Verification

```c
#include <nova402.h>

int main() {
    nova402_payment_data_t payment = {
        // ... initialize payment data
    };
    
    nova402_signature_t signature = {
        // ... signature from payment header
    };
    
    nova402_address_t expected_signer = {
        // ... expected signer address
    };
    
    bool valid = nova402_verify_signature(&payment, &signature, &expected_signer);
    
    if (valid) {
        printf("Signature is valid\n");
    } else {
        printf("Invalid signature\n");
    }
    
    return 0;
}
```

### Merkle Proof Verification

```c
#include <nova402.h>

int main() {
    // Create leaves
    nova402_hash_t leaves[4] = {
        // ... leaf hashes
    };
    
    // Compute Merkle root
    nova402_hash_t root;
    nova402_merkle_root(leaves, 4, &root);
    
    // Generate and verify proof
    nova402_hash_t proof[2] = {
        // ... proof hashes
    };
    
    bool valid = nova402_verify_merkle_proof(
        &leaves[0],
        proof,
        2,
        &root,
        0
    );
    
    return valid ? 0 : 1;
}
```

## API Reference

### Hashing

- `nova402_keccak256()` - Keccak-256 hash (Ethereum)
- `nova402_sha256()` - SHA-256 hash
- `nova402_double_keccak256()` - Double Keccak-256

### Signatures

- `nova402_sign_payment()` - Sign payment with private key
- `nova402_verify_signature()` - Verify payment signature
- `nova402_recover_signer()` - Recover signer from signature

### Validation

- `nova402_validate_address()` - Validate Ethereum address
- `nova402_validate_chain_id()` - Validate chain ID
- `nova402_validate_not_expired()` - Check payment not expired
- `nova402_validate_time_window()` - Validate time window

### Utilities

- `nova402_hex_to_bytes()` - Convert hex to bytes
- `nova402_bytes_to_hex()` - Convert bytes to hex
- `nova402_generate_nonce()` - Generate random nonce
- `nova402_timestamp()` - Get current timestamp

### Networks

- `nova402_get_network_config()` - Get network configuration
- `nova402_get_usdc_address()` - Get USDC address for network

### Merkle Trees

- `nova402_merkle_root()` - Compute Merkle root
- `nova402_verify_merkle_proof()` - Verify Merkle proof

## Building

### Requirements

- CMake 3.15+
- C99-compatible compiler (GCC, Clang, MSVC)
- OpenSSL (optional, for optimized crypto)

### Standard Build

```bash
mkdir build && cd build
cmake ..
make
```

### Optimized Build

```bash
mkdir build && cd build
cmake -DCMAKE_BUILD_TYPE=Release ..
make
```

### Cross-Compilation

```bash
cmake -DCMAKE_TOOLCHAIN_FILE=toolchain.cmake ..
make
```

## Platform Support

- ✅ Linux (x86_64, ARM, ARM64)
- ✅ macOS (x86_64, ARM64)
- ✅ Windows (x86_64)
- ✅ Embedded systems (ARM Cortex-M, RISC-V)
- ✅ WebAssembly (via Emscripten)

## Performance

Benchmarks on Intel Core i7 @ 3.0 GHz:

- Keccak-256: ~0.8 μs per hash
- SHA-256: ~0.6 μs per hash
- Signature verification: ~35 μs
- Merkle root (1000 leaves): ~0.9 ms

## FFI Bindings

The C library can be used from other languages:

### Python (ctypes)

```python
import ctypes

lib = ctypes.CDLL('libnova402.so')

# Keccak-256
nova402_keccak256 = lib.nova402_keccak256
nova402_keccak256.argtypes = [
    ctypes.POINTER(ctypes.c_uint8),
    ctypes.c_size_t,
    ctypes.POINTER(ctypes.c_uint8 * 32)
]
nova402_keccak256.restype = ctypes.c_int
```

### Node.js (node-ffi)

```javascript
const ffi = require('ffi-napi');

const lib = ffi.Library('libnova402', {
  'nova402_keccak256': ['int', ['pointer', 'size_t', 'pointer']],
  'nova402_verify_signature': ['bool', ['pointer', 'pointer', 'pointer']],
});
```

### Rust (FFI)

```rust
extern "C" {
    fn nova402_keccak256(
        data: *const u8,
        length: usize,
        hash: *mut [u8; 32]
    ) -> i32;
}
```

## Use Cases

- **Embedded Systems** - IoT devices making x402 payments
- **High-Frequency Trading** - Ultra-low latency payment verification
- **Game Engines** - In-game micropayments
- **Mobile Apps** - Native mobile SDKs (iOS, Android)
- **Hardware Wallets** - Secure payment signing
- **Language Bindings** - FFI for Python, Ruby, etc.

## Examples

See the [examples directory](./examples) for complete examples:

- **[Basic Usage](./examples/basic.c)** - Simple hashing and signing
- **[Payment Verification](./examples/payment.c)** - Full payment verification
- **[Merkle Proofs](./examples/merkle.c)** - Merkle tree operations
- **[FFI Example](./examples/ffi/)** - Python/Node.js bindings

## Testing

```bash
# Build and run tests
mkdir build && cd build
cmake -DBUILD_TESTING=ON ..
make
ctest
```

## Documentation

Generate documentation with Doxygen:

```bash
doxygen Doxyfile
```

## License

Apache-2.0

## Links

- [GitHub](https://github.com/nova402/nova-utils)
- [Documentation](https://docs.nova402.com)
- [Website](https://nova402.com)

