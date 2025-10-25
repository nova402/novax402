# End-to-End Tests

End-to-end tests for Nova402 utilities across all supported languages and networks.

## Test Structure

```
e2e/
├── typescript/          # TypeScript e2e tests
│   ├── payment-flow.test.ts
│   ├── multi-chain.test.ts
│   └── facilitator.test.ts
├── python/              # Python e2e tests
│   ├── test_payment_flow.py
│   ├── test_multi_chain.py
│   └── test_facilitator.py
├── cross-language/      # Cross-language compatibility tests
│   ├── ts-python.test.ts
│   ├── rust-go.test.rs
│   └── integration.test.ts
└── networks/            # Network-specific tests
    ├── base.test.ts
    ├── solana.test.ts
    └── polygon.test.ts
```

## Running Tests

### All Tests

```bash
pnpm test:e2e
```

### TypeScript Tests

```bash
cd e2e/typescript
pnpm test
```

### Python Tests

```bash
cd e2e/python
pytest
```

### Network-Specific

```bash
# Base network
TEST_NETWORK=base-sepolia pnpm test:e2e

# Solana network
TEST_NETWORK=solana-devnet pnpm test:e2e
```

## Test Scenarios

### 1. Complete Payment Flow

Tests the full x402 protocol flow:

1. Client makes initial request
2. Server returns 402 with payment requirements
3. Client creates and signs payment authorization
4. Client retries with X-PAYMENT header
5. Server verifies payment
6. Server settles payment
7. Server returns response with settlement receipt

### 2. Multi-Chain Compatibility

Tests payment processing across networks:

- Base Mainnet (EVM)
- Base Sepolia (EVM testnet)
- Solana Mainnet
- Solana Devnet
- Polygon (coming soon)
- BSC (coming soon)

### 3. Cross-Language Interoperability

Tests compatibility between language implementations:

- TypeScript client → Python server
- Python client → TypeScript server
- Rust crypto → All other languages
- Go server → TypeScript client

### 4. Facilitator Integration

Tests interaction with PayAI facilitator:

- Payment verification
- Payment settlement
- Error handling
- Timeout scenarios

### 5. Error Scenarios

Tests error handling:

- Invalid signatures
- Expired payments
- Insufficient amounts
- Network mismatches
- Settlement failures

## Test Configuration

### Environment Variables

```bash
# Network configuration
TEST_NETWORK=base-sepolia
TEST_CHAIN_ID=84532

# Wallet configuration
TEST_PRIVATE_KEY=0x...
TEST_TREASURY_WALLET=0x...

# Facilitator
TEST_FACILITATOR_URL=https://testnet-facilitator.payai.network

# RPC URLs
BASE_RPC_URL=https://sepolia.base.org
SOLANA_RPC_URL=https://api.devnet.solana.com

# Test tokens
TEST_USDC_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e
```

### Test Data

Test wallets and tokens are configured in `e2e/config/`:

- `wallets.json` - Test wallet addresses and keys
- `tokens.json` - Test token contracts
- `services.json` - Test service endpoints

## Prerequisites

- Test wallets with funds on testnets
- Access to facilitator testnet
- RPC endpoints for all test networks

## Continuous Integration

E2E tests run automatically on:

- Pull requests to main/develop
- Pushes to main/develop
- Nightly scheduled runs
- Manual workflow dispatch

## Writing New Tests

### TypeScript

```typescript
import { describe, it, expect } from 'vitest';
import { createX402Client } from '@nova402/client';

describe('Payment Flow', () => {
  it('should complete full payment', async () => {
    const client = createX402Client({
      network: 'base-sepolia',
      privateKey: process.env.TEST_PRIVATE_KEY
    });
    
    const response = await client.post('/api/test', { data: 'test' });
    expect(response.status).toBe(200);
  });
});
```

### Python

```python
import pytest
from nova402 import X402Client

def test_payment_flow():
    client = X402Client(
        network="base-sepolia",
        private_key=os.getenv("TEST_PRIVATE_KEY")
    )
    
    response = client.post("/api/test", json={"data": "test"})
    assert response.status_code == 200
```

## Debugging

Enable verbose logging:

```bash
DEBUG=nova402:* pnpm test:e2e
```

View facilitator logs:

```bash
FACILITATOR_DEBUG=true pnpm test:e2e
```

## Test Reports

Test reports are generated in:

- `e2e/reports/typescript/` - TypeScript test results
- `e2e/reports/python/` - Python test results
- `e2e/reports/coverage/` - Coverage reports

## License

Apache-2.0

