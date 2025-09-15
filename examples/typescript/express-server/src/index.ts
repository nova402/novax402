/**
 * Nova402 Express Server Example
 * 
 * Demonstrates x402 payment integration with Express.js
 */

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { x402Middleware } from '@nova402/express';
import { getUSDCAddress } from '@nova402/core';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration
const TREASURY_WALLET = process.env.TREASURY_WALLET || '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
const NETWORK = process.env.NETWORK || 'base-sepolia';
const FACILITATOR_URL = process.env.FACILITATOR_URL || 'https://facilitator.payai.network';

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Health check (free)
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    network: NETWORK,
  });
});

// Free endpoint
app.get('/api/free/info', (req, res) => {
  res.json({
    message: 'This endpoint is free to use',
    documentation: 'https://docs.nova402.com',
    paidEndpoints: [
      '/api/ai/generate',
      '/api/data/premium',
      '/api/image/process',
    ],
  });
});

// Paid AI generation endpoint ($0.10)
app.post(
  '/api/ai/generate',
  x402Middleware({
    price: '100000', // 0.10 USDC
    asset: getUSDCAddress(NETWORK as any),
    network: NETWORK,
    payTo: TREASURY_WALLET,
    description: 'AI content generation',
    facilitatorUrl: FACILITATOR_URL,
  }),
  async (req, res) => {
    const { prompt } = req.body;

    // Simulate AI generation
    const result = await generateAI(prompt);

    res.json({
      result,
      cost: '0.10 USDC',
      timestamp: new Date().toISOString(),
    });
  }
);

// Paid premium data endpoint ($0.05)
app.get(
  '/api/data/premium',
  x402Middleware({
    price: '50000', // 0.05 USDC
    asset: getUSDCAddress(NETWORK as any),
    network: NETWORK,
    payTo: TREASURY_WALLET,
    description: 'Premium market data',
    facilitatorUrl: FACILITATOR_URL,
  }),
  async (req, res) => {
    const premiumData = await fetchPremiumData();

    res.json({
      data: premiumData,
      cost: '0.05 USDC',
      timestamp: new Date().toISOString(),
    });
  }
);

// Paid image processing endpoint ($0.25)
app.post(
  '/api/image/process',
  x402Middleware({
    price: '250000', // 0.25 USDC
    asset: getUSDCAddress(NETWORK as any),
    network: NETWORK,
    payTo: TREASURY_WALLET,
    description: 'AI image processing',
    facilitatorUrl: FACILITATOR_URL,
  }),
  async (req, res) => {
    const { imageUrl, operation } = req.body;

    const processedImage = await processImage(imageUrl, operation);

    res.json({
      processedImage,
      cost: '0.25 USDC',
      timestamp: new Date().toISOString(),
    });
  }
);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Nova402 Express Server`);
  console.log(`📍 Running on http://localhost:${PORT}`);
  console.log(`🌐 Network: ${NETWORK}`);
  console.log(`💰 Treasury: ${TREASURY_WALLET}`);
  console.log(`🔗 Facilitator: ${FACILITATOR_URL}`);
  console.log(`\n💡 Paid endpoints:`);
  console.log(`   POST /api/ai/generate - $0.10 USDC`);
  console.log(`   GET  /api/data/premium - $0.05 USDC`);
  console.log(`   POST /api/image/process - $0.25 USDC`);
});

// Mock functions
async function generateAI(prompt: string): Promise<string> {
  await delay(500);
  return `Generated content for: "${prompt}". This is a simulated AI response.`;
}

async function fetchPremiumData(): Promise<any> {
  await delay(300);
  return {
    marketPrice: 42850.23,
    volume24h: 28500000000,
    change24h: 2.45,
    premium: true,
  };
}

async function processImage(imageUrl: string, operation: string): Promise<string> {
  await delay(800);
  return `https://cdn.nova402.com/processed/${operation}/${imageUrl.split('/').pop()}`;
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

