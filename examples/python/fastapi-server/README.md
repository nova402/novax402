# Nova402 FastAPI Server Example

FastAPI server with x402 payment integration for pay-per-request Python APIs.

## Features

✧ Multiple paid endpoints - AI, data, image processing  
✧ Tiered pricing - $0.03 to $0.25 per request  
✧ Async/await - Modern Python patterns  
✧ Type safety - Pydantic models  
✧ Auto documentation - Swagger UI at `/docs`  
✧ CORS enabled - Frontend ready

## Installation

```bash
pip install -r requirements.txt
```

## Configuration

Create `.env` file:

```env
TREASURY_WALLET=0xYourWalletAddress
NETWORK=base-sepolia
FACILITATOR_URL=https://facilitator.payai.network
PORT=8000
```

## Running

### Development

```bash
python main.py
```

Or with uvicorn directly:

```bash
uvicorn main:app --reload
```

### Production

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Documentation

Visit http://localhost:8000/docs for interactive Swagger UI documentation.

## Endpoints

### Free Endpoints

- `GET /` - Service information
- `GET /health` - Health check
- `GET /api/info` - Service details

### Paid Endpoints

| Endpoint | Method | Price | Description |
|----------|--------|-------|-------------|
| `/api/ai/generate` | POST | $0.10 | AI content generation |
| `/api/data/premium` | GET | $0.05 | Premium market data |
| `/api/image/process` | POST | $0.25 | Image processing |
| `/api/data/query` | POST | $0.03 | Data queries |

## Testing

### 1. Test Free Endpoint

```bash
curl http://localhost:8000/health
```

### 2. Test Payment Required

```bash
curl -X POST http://localhost:8000/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Generate content"}'
```

Should return 402 with payment requirements.

### 3. Make Paid Request

```python
from nova402 import X402Client

client = X402Client(
    network="base-sepolia",
    private_key="0x..."
)

response = client.post(
    "http://localhost:8000/api/ai/generate",
    json={"prompt": "Generate a blog post"}
)

print(response.json())
```

## Deployment

### Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:

```bash
docker build -t nova402-fastapi .
docker run -p 8000:8000 --env-file .env nova402-fastapi
```

### Cloud Platforms

- **Railway**: `railway up`
- **Heroku**: `git push heroku main`
- **AWS**: Deploy with Elastic Beanstalk
- **GCP**: Deploy to Cloud Run

## Integration with Nova402

Register this service on Nova402 Service Hub:

1. Deploy server publicly
2. Visit https://nova402.com/dapp
3. Click "Register Service"
4. Enter your endpoint URL
5. Users can discover and pay for your API!

## License

Apache-2.0

