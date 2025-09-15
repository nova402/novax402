# Nova402 Express Server Example

Express.js server with x402 payment integration for pay-per-request API monetization.

## Features

✧ Multiple payment-gated endpoints  
✧ Tiered pricing ($0.05 - $0.25 USDC)  
✧ Automatic payment verification  
✧ Facilitator-based settlement  
✧ Error handling and logging  
✧ Production-ready structure

## Prerequisites

- Node.js 18+
- pnpm or npm
- Wallet address for receiving payments
- Access to Base or Solana network

## Installation

```bash
pnpm install
```

## Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` with your configuration:
```env
TREASURY_WALLET=0xYourWalletAddress
NETWORK=base-sepolia
FACILITATOR_URL=https://facilitator.payai.network
```

## Running

### Development

```bash
pnpm dev
```

### Production

```bash
pnpm build
pnpm start
```

## API Endpoints

### Free Endpoints

- `GET /health` - Health check
- `GET /api/free/info` - Service information

### Paid Endpoints

| Endpoint | Method | Price | Description |
|----------|--------|-------|-------------|
| `/api/ai/generate` | POST | $0.10 USDC | AI content generation |
| `/api/data/premium` | GET | $0.05 USDC | Premium market data |
| `/api/image/process` | POST | $0.25 USDC | Image processing |

## Testing

### 1. Health Check (Free)

```bash
curl http://localhost:3000/health
```

### 2. Test Payment Required Response

```bash
curl http://localhost:3000/api/ai/generate
```

Response:
```json
{
  "x402Version": 1,
  "accepts": [{
    "scheme": "exact",
    "network": "eip155:84532",
    "maxAmountRequired": "100000",
    "payTo": "0x...",
    "asset": "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    ...
  }],
  "error": "X-PAYMENT header required"
}
```

### 3. Make Paid Request

Use the Nova402 client or manual payment creation:

```bash
# Using nova402 TypeScript client
import { createX402Client } from '@nova402/client';

const client = createX402Client({
  network: 'base-sepolia',
  privateKey: '0x...'
});

const response = await client.post('http://localhost:3000/api/ai/generate', {
  prompt: 'Generate a blog post about x402'
});
```

## Project Structure

```
express-server/
├── src/
│   └── index.ts         # Main server file
├── .env.example         # Environment template
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
└── README.md           # This file
```

## Integration with Nova402 Platform

This server can be registered on the Nova402 Service Hub:

1. Deploy your server publicly
2. Visit [nova402.com/dapp](https://nova402.com/dapp)
3. Click "Register Service"
4. Fill in your endpoint details
5. Start receiving payments!

## Payment Flow

1. Client requests paid endpoint
2. Server returns `402 Payment Required` with payment details
3. Client creates and signs payment authorization (EIP-3009)
4. Client retries request with `X-PAYMENT` header
5. Server verifies payment with facilitator
6. Server processes request
7. Server settles payment on-chain
8. Server returns response with settlement receipt

## Error Handling

The server handles various payment errors:

- Invalid payment signature
- Insufficient payment amount
- Expired payment authorization
- Network mismatch
- Settlement failures

## Production Deployment

### Environment Variables

Set these in production:

```env
NODE_ENV=production
TREASURY_WALLET=0xYourProductionWallet
NETWORK=base-mainnet
FACILITATOR_URL=https://facilitator.payai.network
```

### Recommended Setup

- **Hosting**: Railway, Vercel, AWS
- **Monitoring**: Add logging service (Datadog, LogRocket)
- **Caching**: Redis for payment verification results
- **Database**: PostgreSQL for transaction history

## License

Apache-2.0

## Links

- [Nova402 Platform](https://nova402.com)
- [Documentation](https://docs.nova402.com)
- [x402 Protocol](https://github.com/coinbase/x402)

