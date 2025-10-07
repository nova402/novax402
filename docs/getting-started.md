# Getting Started with Nova402 Utilities

Welcome to Nova402! This guide will help you integrate x402 payment protocol into your applications.

## What is Nova402?

Nova402 provides infrastructure for the x402 payment protocol, enabling:

- **Pay-per-request APIs** - Monetize every API call with instant micropayments
- **Multi-chain support** - Base, Solana, Polygon, BSC, Peaq, Sei
- **Service discovery** - Browse x402-enabled services on the Service Hub
- **Developer tools** - Complete SDKs for TypeScript, Python, Rust, and Go

Built on the [x402 protocol specification](https://github.com/coinbase/x402).

## Installation

### TypeScript/JavaScript

```bash
npm install @nova402/core @nova402/express
# or
pnpm add @nova402/core @nova402/express
```

### Python

```bash
pip install nova402
```

### Rust

```bash
cargo add nova402-core
```

### Go

```bash
go get github.com/nova402/nova-utils/go/pkg/nova402
```

## Quick Start

### 1. Build a Payment-Gated API (Server)

#### TypeScript/Express

```typescript
import express from 'express';
import { x402Middleware } from '@nova402/express';
import { getUSDCAddress } from '@nova402/core';

const app = express();

app.post('/api/ai/generate',
  x402Middleware({
    price: '100000', // 0.10 USDC
    asset: getUSDCAddress('base-mainnet'),
    network: 'eip155:8453',
    payTo: process.env.TREASURY_WALLET,
    description: 'AI content generation',
  }),
  async (req, res) => {
    const result = await generateAI(req.body.prompt);
    res.json({ result });
  }
);

app.listen(3000);
```

#### Python/FastAPI

```python
from fastapi import FastAPI
from nova402 import x402_required

app = FastAPI()

@app.post("/api/ai/generate")
@x402_required(price="0.10", network="base-mainnet")
async def generate_ai(prompt: str):
    result = await generate_ai_content(prompt)
    return {"result": result}
```

### 2. Make Paid Requests (Client)

#### TypeScript

```typescript
import { createX402Client } from '@nova402/client';

const client = createX402Client({
  network: 'base-mainnet',
  privateKey: process.env.PRIVATE_KEY,
});

const response = await client.post('https://api.example.com/ai/generate', {
  prompt: 'Generate a blog post'
});

console.log(response.data);
```

#### Python

```python
from nova402 import X402Client

client = X402Client(
    network="base-mainnet",
    private_key=os.getenv("PRIVATE_KEY")
)

response = client.post(
    "https://api.example.com/ai/generate",
    json={"prompt": "Generate a blog post"}
)

print(response.json())
```

## Core Concepts

### Payment Requirements

When a server requires payment, it returns HTTP 402 with payment details:

```json
{
  "x402Version": 1,
  "accepts": [{
    "scheme": "exact",
    "network": "eip155:8453",
    "maxAmountRequired": "100000",
    "payTo": "0x...",
    "asset": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    "resource": "/api/ai/generate",
    "description": "AI generation",
    "mimeType": "application/json",
    "maxTimeoutSeconds": 300
  }]
}
```

### Payment Header

Client sends payment authorization in `X-PAYMENT` header (base64-encoded JSON):

```json
{
  "x402Version": 1,
  "scheme": "exact",
  "network": "eip155:8453",
  "payload": {
    "authorization": {
      "from": "0x...",
      "to": "0x...",
      "value": "100000",
      "validAfter": 1234567890,
      "validBefore": 1234567990,
      "nonce": "0x...",
      "v": 28,
      "r": "0x...",
      "s": "0x..."
    }
  }
}
```

### Payment Flow

```
1. Client → Server: GET /api/resource
2. Server → Client: 402 Payment Required + payment requirements
3. Client: Create & sign payment authorization
4. Client → Server: GET /api/resource + X-PAYMENT header
5. Server: Verify payment signature
6. Server: Process request
7. Server: Settle payment on blockchain
8. Server → Client: 200 OK + X-PAYMENT-RESPONSE header
```

## Supported Networks

| Network | Chain ID | Type | USDC Address |
|---------|----------|------|--------------|
| Base Mainnet | 8453 | EVM | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |
| Base Sepolia | 84532 | EVM | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` |
| Solana Mainnet | - | Solana | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` |
| Solana Devnet | - | Solana | `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU` |

## Configuration

### Environment Variables

```bash
# Network (base-mainnet, base-sepolia, solana-mainnet, etc.)
NETWORK=base-sepolia

# Your wallet address (receives payments)
TREASURY_WALLET=0xYourWalletAddress

# Facilitator API URL
FACILITATOR_URL=https://facilitator.payai.network

# Optional: Custom RPC URLs
BASE_RPC_URL=https://mainnet.base.org
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

## Next Steps

1. **[API Reference](./api-reference.md)** - Complete API documentation
2. **[Architecture](./architecture.md)** - System architecture
3. **[Examples](../examples)** - Working code examples
4. **[Protocol Spec](../specs/x402-protocol.md)** - x402 protocol details

## Common Use Cases

### AI/ML APIs

Monetize AI inference, training, or predictions:

```typescript
app.post('/api/ai/chat', x402Middleware({ price: '0.05' }), handleChat);
app.post('/api/ai/image', x402Middleware({ price: '0.25' }), generateImage);
```

### Data Services

Charge for real-time data, analytics, or queries:

```python
@app.get("/api/market-data")
@x402_required(price="0.03")
def market_data():
    return {"price": get_price(), "volume": get_volume()}
```

### Content Access

Paywall articles, videos, or premium content:

```typescript
app.get('/api/article/:id', x402Middleware({ price: '0.01' }), getArticle);
```

### Compute Services

Charge for computation, rendering, or processing:

```python
@app.post("/api/render")
@x402_required(price="0.50")
def render_video(video_data):
    return render_service(video_data)
```

## Troubleshooting

### Payment Verification Fails

- Check network matches between client and server
- Verify USDC contract address is correct for network
- Ensure payment amount >= required amount
- Check payment hasn't expired (validBefore > current time)

### Settlement Fails

- Verify facilitator URL is correct
- Check facilitator has funds for gas
- Ensure nonce hasn't been used
- Verify recipient address matches payTo

### Network Issues

- Confirm RPC URL is accessible
- Check network/chain ID is correct
- Verify wallet has sufficient balance
- Test with testnet first (Base Sepolia)

## Support

- **Documentation**: [docs.nova402.com](https://docs.nova402.com)
- **Discord**: [discord.gg/nova402](https://discord.gg/nova402)
- **GitHub Issues**: [Report bugs](https://github.com/nova402/nova-utils/issues)
- **Email**: dev@nova402.com

---

**Ready to build?** Check out our [complete examples](../examples) or dive into the [API Reference](./api-reference.md)!

