"""
Nova402 FastAPI Server Example

Demonstrates x402 payment integration with FastAPI for building
pay-per-request APIs and AI services.
"""

import os
import time
from typing import Optional
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# Import Nova402 SDK (when available)
# from nova402 import x402_required, create_payment_requirements
# from nova402.constants import get_usdc_address

app = FastAPI(
    title="Nova402 FastAPI Example",
    description="Pay-per-request API using x402 protocol",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
TREASURY_WALLET = os.getenv("TREASURY_WALLET", "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb")
NETWORK = os.getenv("NETWORK", "base-sepolia")
FACILITATOR_URL = os.getenv("FACILITATOR_URL", "https://facilitator.payai.network")

# Request Models
class AIGenerateRequest(BaseModel):
    prompt: str
    max_tokens: Optional[int] = 1000

class ImageProcessRequest(BaseModel):
    image_url: str
    operation: str

class DataQueryRequest(BaseModel):
    query: str
    filters: Optional[dict] = None


# ============================================
# FREE ENDPOINTS
# ============================================

@app.get("/")
async def root():
    """Root endpoint - service information"""
    return {
        "service": "Nova402 FastAPI Example",
        "version": "1.0.0",
        "network": NETWORK,
        "treasury": TREASURY_WALLET,
        "endpoints": {
            "free": ["/", "/health", "/api/info"],
            "paid": [
                {"path": "/api/ai/generate", "price": "0.10 USDC"},
                {"path": "/api/data/premium", "price": "0.05 USDC"},
                {"path": "/api/image/process", "price": "0.25 USDC"},
            ]
        }
    }

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "network": NETWORK
    }

@app.get("/api/info")
async def info():
    """Service information"""
    return {
        "name": "Nova402 AI & Data Service",
        "description": "Pay-per-request APIs for AI generation, data access, and image processing",
        "network": NETWORK,
        "payment_protocol": "x402",
        "supported_tokens": ["USDC"],
        "facilitator": FACILITATOR_URL,
    }


# ============================================
# PAID ENDPOINTS
# ============================================

@app.post("/api/ai/generate")
# @x402_required(price="0.10", network=NETWORK)
async def ai_generate(request: AIGenerateRequest):
    """
    AI Content Generation - $0.10 USDC per request
    
    Generate AI content based on prompt.
    """
    # Simulate AI generation
    await simulate_processing(500)
    
    return {
        "result": f"Generated content for: '{request.prompt}'. This is a simulated AI response demonstrating x402 payments.",
        "tokens_used": request.max_tokens,
        "cost": "0.10 USDC",
        "timestamp": time.time(),
        "model": "nova-ai-v1",
    }

@app.get("/api/data/premium")
# @x402_required(price="0.05", network=NETWORK)
async def premium_data():
    """
    Premium Market Data - $0.05 USDC per request
    
    Access real-time premium market data.
    """
    await simulate_processing(300)
    
    return {
        "data": {
            "btc_price": 42850.23,
            "eth_price": 2234.56,
            "market_cap": "850B",
            "volume_24h": "45B",
            "fear_greed_index": 68,
        },
        "cost": "0.05 USDC",
        "timestamp": time.time(),
        "source": "premium-feed",
    }

@app.post("/api/image/process")
# @x402_required(price="0.25", network=NETWORK)
async def image_process(request: ImageProcessRequest):
    """
    Image Processing - $0.25 USDC per request
    
    Process images with AI operations (resize, filter, enhance).
    """
    await simulate_processing(800)
    
    return {
        "processed_url": f"https://cdn.nova402.com/processed/{request.operation}/{request.image_url.split('/')[-1]}",
        "operation": request.operation,
        "cost": "0.25 USDC",
        "timestamp": time.time(),
    }

@app.post("/api/data/query")
# @x402_required(price="0.03", network=NETWORK)
async def data_query(request: DataQueryRequest):
    """
    Data Query - $0.03 USDC per request
    
    Query structured data with custom filters.
    """
    await simulate_processing(200)
    
    return {
        "results": [
            {"id": 1, "value": "Sample data 1"},
            {"id": 2, "value": "Sample data 2"},
            {"id": 3, "value": "Sample data 3"},
        ],
        "total": 3,
        "query": request.query,
        "cost": "0.03 USDC",
        "timestamp": time.time(),
    }


# ============================================
# UTILITY FUNCTIONS
# ============================================

async def simulate_processing(ms: int):
    """Simulate processing delay"""
    import asyncio
    await asyncio.sleep(ms / 1000)


# ============================================
# MAIN
# ============================================

if __name__ == "__main__":
    print("🚀 Starting Nova402 FastAPI Server")
    print(f"📍 Network: {NETWORK}")
    print(f"💰 Treasury: {TREASURY_WALLET}")
    print(f"🔗 Facilitator: {FACILITATOR_URL}")
    print()
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=int(os.getenv("PORT", "8000")),
        log_level="info"
    )

