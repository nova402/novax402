# x402 Protocol Specification - Nova402 Implementation

> Nova402's implementation of the x402 payment protocol

**Version:** 1.0  
**Status:** Production  
**Based on:** [Coinbase x402 Protocol](https://github.com/coinbase/x402)

## Overview

The x402 protocol extends HTTP with standardized payment capabilities, enabling micropayments for API requests. Nova402 implements the full x402 specification with support for multiple blockchains.

## Protocol Flow

```
1. Client → Server: HTTP Request
2. Server → Client: 402 Payment Required + Payment Requirements
3. Client → Server: HTTP Request + X-PAYMENT Header
4. Server: Verify Payment (local or via facilitator)
5. Server: Process Request
6. Server: Settle Payment (blockchain transaction)
7. Server → Client: 200 OK + X-PAYMENT-RESPONSE Header
```

## Core Components

### 1. Payment Requirements

Sent by server in 402 response to indicate payment details:

```json
{
  "x402Version": 1,
  "scheme": "exact",
  "network": "eip155:8453",
  "maxAmountRequired": "100000",
  "resource": "/api/ai/generate",
  "description": "AI content generation",
  "mimeType": "application/json",
  "payTo": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "maxTimeoutSeconds": 300,
  "asset": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  "extra": {
    "name": "USD Coin",
    "version": "2"
  }
}
```

### 2. Payment Header

Sent by client in X-PAYMENT header (base64-encoded JSON):

```json
{
  "x402Version": 1,
  "scheme": "exact",
  "network": "eip155:8453",
  "payload": {
    "authorization": {
      "from": "0x857b06519E91e3A54538791bDbb0E22373e36b66",
      "to": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      "value": "100000",
      "validAfter": 1740672089,
      "validBefore": 1740672389,
      "nonce": "0xf3746613c2d920b5fdabc0856f2aeb2d4f88ee6037b8cc5d04a71a4462f13480",
      "v": 28,
      "r": "0x...",
      "s": "0x..."
    }
  }
}
```

### 3. Settlement Response

Returned in X-PAYMENT-RESPONSE header (base64-encoded JSON):

```json
{
  "success": true,
  "txHash": "0x1234...abcd",
  "networkId": "eip155:8453",
  "blockNumber": 12345678
}
```

## Payment Schemes

### Exact Scheme

Transfer a specific amount for a resource.

- **Use case**: Fixed-price API calls, content access
- **Amount**: Exact value specified in `maxAmountRequired`
- **Settlement**: Immediate upon verification

### Upto Scheme (Coming Soon)

Transfer up to a maximum amount based on usage.

- **Use case**: AI token generation, metered usage
- **Amount**: Variable, up to `maxAmountRequired`
- **Settlement**: After resource delivery

## Network Support

### EVM Networks (EIP-3009)

Uses `transferWithAuthorization` from EIP-3009 compliant USDC contracts:

- **Base Mainnet** - Chain ID: 8453
- **Base Sepolia** - Chain ID: 84532
- **Polygon** - Chain ID: 137
- **BSC** - Chain ID: 56
- **Peaq** - Chain ID: 3338
- **Sei** - Chain ID: 1329

**Network Format:** `eip155:<chainId>`

### Solana Networks

Uses SPL Token transfers with Ed25519 signatures:

- **Solana Mainnet**
- **Solana Devnet**

**Network Format:** `solana:mainnet` or `solana:devnet`

## Security

### Signature Verification

**EVM (EIP-712):**
- Domain: Token name, version, chainId, verifyingContract
- Type: TransferWithAuthorization
- Signature: ECDSA (secp256k1)

**Solana (Ed25519):**
- Message: Serialized transaction
- Signature: Ed25519
- Verification: Native Solana verification

### Replay Protection

- **Nonce**: Unique per authorization (32 bytes)
- **Time Window**: validAfter to validBefore timestamps
- **On-chain Check**: Nonce state tracked in smart contract

### Amount Verification

- Verify `value >= maxAmountRequired`
- Verify `to == payTo`
- Verify `asset == token contract`

## Facilitator API

### POST /verify

Verify payment authorization:

**Request:**
```json
{
  "x402Version": 1,
  "paymentHeader": "<base64>",
  "paymentRequirements": { ... }
}
```

**Response:**
```json
{
  "isValid": true,
  "invalidReason": null
}
```

### POST /settle

Settle payment on-chain:

**Request:**
```json
{
  "x402Version": 1,
  "paymentHeader": "<base64>",
  "paymentRequirements": { ... }
}
```

**Response:**
```json
{
  "success": true,
  "txHash": "0x...",
  "networkId": "eip155:8453",
  "blockNumber": 12345678
}
```

### GET /supported

Get supported schemes and networks:

**Response:**
```json
{
  "kinds": [
    {
      "scheme": "exact",
      "network": "eip155:8453"
    },
    {
      "scheme": "exact",
      "network": "solana:mainnet"
    }
  ]
}
```

## Implementation Notes

### Base64 Encoding

All payment headers are base64-encoded JSON for HTTP header compatibility.

### CAIP-2 Format

Network identifiers use CAIP-2 format: `namespace:reference`

- EVM: `eip155:<chainId>`
- Solana: `solana:<network>`

### Amount Format

All amounts are strings representing values in the token's smallest unit:

- USDC (6 decimals): "1000000" = 1.00 USDC
- SOL (9 decimals): "1000000000" = 1.00 SOL

### Timestamp Format

Unix timestamps in seconds since epoch.

## Error Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 402 | Payment Required | No valid payment provided |
| 400 | Bad Request | Invalid payment data |
| 401 | Unauthorized | Invalid signature |
| 403 | Forbidden | Payment amount insufficient |
| 408 | Request Timeout | Payment expired |
| 500 | Server Error | Settlement failed |

## Nova402 Extensions

### Service Discovery

Nova402 adds service discovery on top of base x402:

- Service registry with metadata
- Category and tag filtering
- Performance metrics
- Provider reputation

### Integration Layer

Developer tools for easier integration:

- Code generation
- Testing interfaces
- Documentation
- Analytics

### Token Indexer

Real-time visibility into x402 ecosystem:

- All registered services
- Transaction history
- Network statistics
- Service health monitoring

## References

- [x402 Specification](https://github.com/coinbase/x402)
- [EIP-3009](https://eips.ethereum.org/EIPS/eip-3009)
- [EIP-712](https://eips.ethereum.org/EIPS/eip-712)
- [CAIP-2](https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-2.md)

## License

Apache-2.0

---

**Nova402** - Making HTTP 402 Payment Required work for the real internet

