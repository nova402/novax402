# @nova402/core

Core x402 protocol implementation for Nova402.

[![npm version](https://img.shields.io/npm/v/@nova402/core.svg)](https://www.npmjs.com/package/@nova402/core)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Foundational package for implementing the x402 payment protocol in TypeScript/JavaScript applications.

## Installation

```bash
npm install @nova402/core
# or
pnpm add @nova402/core
```

## Features

✧ Payment requirements generation - x402-compliant specifications  
✧ EIP-712 signature verification - Verify EVM payments  
✧ Payment encoding/decoding - X-PAYMENT header handling  
✧ Multi-chain support - Base, Solana, Polygon, BSC, Peaq, Sei  
✧ Type safety - Full TypeScript with Zod validation  
✧ Network utilities - CAIP-2 format, network configs

## Quick Start

### Creating Payment Requirements

```typescript
import { createPaymentRequirements, getUSDCAddress } from '@nova402/core';

const requirements = createPaymentRequirements({
  price: '100000', // 0.1 USDC (6 decimals)
  asset: getUSDCAddress('base-mainnet'),
  network: 'eip155:8453',
  payTo: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  resource: '/api/ai/generate',
  description: 'AI content generation'
});
```

### Verifying Payment Signatures

```typescript
import { verifyEVMPayment, parsePaymentHeader } from '@nova402/core';

const paymentHeader = req.headers['x-payment'];
const payment = parsePaymentHeader(paymentHeader);

const result = verifyEVMPayment(payment, requirements);
if (result.valid) {
  // Payment is valid, proceed with request
} else {
  // Invalid payment
  console.error(result.reason);
}
```

### Working with Networks

```typescript
import { 
  getNetworkConfig, 
  getUSDCAddress, 
  toCAIP2,
  isEVMNetwork 
} from '@nova402/core';

// Get network configuration
const baseConfig = getNetworkConfig('base-mainnet');
console.log(baseConfig.rpcUrl); // https://mainnet.base.org

// Get USDC address for network
const usdcAddress = getUSDCAddress('base-mainnet');

// Convert to CAIP-2 format
const caip2 = toCAIP2('base-mainnet'); // "eip155:8453"

// Check network type
const isEVM = isEVMNetwork('base-mainnet'); // true
```

## API Reference

### Payment Functions

#### `createPaymentRequirements(config: PaymentConfig): PaymentRequirements`

Creates payment requirements for a resource.

**Parameters:**
- `config.price` - Payment amount in smallest unit (e.g., "100000" for 0.1 USDC)
- `config.asset` - Token contract address
- `config.network` - Network identifier in CAIP-2 format
- `config.payTo` - Recipient wallet address
- `config.resource` - Resource URL
- `config.description` - Human-readable description
- `config.scheme?` - Payment scheme (default: "exact")
- `config.mimeType?` - Response MIME type (default: "application/json")
- `config.timeout?` - Timeout in seconds (default: 300)

#### `parsePaymentHeader(headerValue: string): PaymentHeader | null`

Parses base64-encoded X-PAYMENT header.

#### `encodePaymentHeader(payment: PaymentHeader): string`

Encodes payment header to base64.

#### `create402Response(requirements, error?): Payment402Response`

Creates a 402 Payment Required response object.

#### `verifyEVMPayment(payment, requirements): VerificationResult`

Verifies EVM payment signature and validates payment data.

### Crypto Functions

#### `keccak256(data: string | Buffer): string`

Computes Keccak-256 hash (Ethereum compatible).

#### `hashData(data: string | Buffer): string`

Computes SHA-256 hash.

#### `signEVM(data, privateKey): Promise<SignatureResult>`

Signs data with EVM private key.

#### `verifyEVMSignature(data, signature, expectedAddress): boolean`

Verifies EVM signature.

#### `signEIP712(domain, types, value, privateKey): Promise<string>`

Signs EIP-712 typed data.

#### `verifyEIP712Signature(domain, types, value, signature, expectedAddress): boolean`

Verifies EIP-712 signature.

### Network Functions

#### `getNetworkConfig(network: SupportedNetwork): NetworkConfig`

Gets configuration for a supported network.

#### `getUSDCAddress(network: SupportedNetwork): string`

Gets USDC contract address for a network.

#### `isEVMNetwork(network: SupportedNetwork): boolean`

Checks if network is EVM-based.

#### `isSolanaNetwork(network: SupportedNetwork): boolean`

Checks if network is Solana-based.

#### `toCAIP2(network: SupportedNetwork): string`

Converts network identifier to CAIP-2 format.

#### `fromCAIP2(caip2: string): SupportedNetwork | null`

Parses CAIP-2 format to network identifier.

### Validation Functions

#### `validateAddress(address: string): boolean`

Validates Ethereum address format.

#### `validateChainId(chainId: number): boolean`

Validates chain ID.

#### `validateNetwork(network: string): boolean`

Validates network identifier (CAIP-2 format).

#### `validateScheme(scheme: string): boolean`

Validates payment scheme.

#### `validateAmount(amount: string): boolean`

Validates payment amount.

#### `validatePaymentRequirements(requirements): ValidationResult`

Validates payment requirements using Zod schema.

#### `validatePaymentHeader(header): ValidationResult`

Validates payment header using Zod schema.

## Supported Networks

- **Base Mainnet** (`base-mainnet`) - Chain ID: 8453
- **Base Sepolia** (`base-sepolia`) - Chain ID: 84532
- **Solana Mainnet** (`solana-mainnet`)
- **Solana Devnet** (`solana-devnet`)
- **Polygon** (`polygon`) - Chain ID: 137
- **BSC** (`bsc`) - Chain ID: 56
- **Peaq** (`peaq`) - Chain ID: 3338
- **Sei** (`sei`) - Chain ID: 1329

## Types

All types are exported and available for TypeScript users:

```typescript
import type {
  PaymentRequirements,
  PaymentHeader,
  Payment402Response,
  PaymentConfig,
  NetworkConfig,
  SupportedNetwork,
  VerificationResult,
  SettlementResult,
} from '@nova402/core';
```

## Constants

```typescript
import { 
  X402_VERSION,        // Current protocol version
  DEFAULT_TIMEOUT,     // Default payment timeout (300s)
  NETWORKS,            // Network configurations
  USDC_ADDRESSES,      // USDC addresses by network
} from '@nova402/core';
```

## Examples

See the [examples directory](../../examples) for complete working examples.

## Related Packages

- [@nova402/express](../express) - Express.js middleware
- [@nova402/next](../next) - Next.js integration
- [@nova402/react](../react) - React hooks
- [@nova402/solana](../solana) - Solana adapter

## License

Apache-2.0

## Links

- [Documentation](https://docs.nova402.com)
- [GitHub](https://github.com/nova402/nova-utils)
- [Website](https://nova402.com)

