# Nova402 Python SDK

Python implementation of the x402 payment protocol for Nova402 ecosystem.

[![PyPI version](https://badge.fury.io/py/nova402.svg)](https://badge.fury.io/py/nova402)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Python SDK for building x402-enabled services on Base, Solana, and supported blockchains.

## Installation

```bash
pip install nova402
```

### Development Installation

```bash
git clone https://github.com/nova402/nova-utils.git
cd nova-utils/python/nova402
pip install -e ".[dev]"
```

## Quick Start

### Server-Side (FastAPI)

```python
from fastapi import FastAPI
from nova402 import x402_required

app = FastAPI()

@app.get("/api/premium-data")
@x402_required(
    price="0.05",
    network="base-mainnet",
    description="Premium market data access"
)
async def get_premium_data():
    return {"data": "premium content", "timestamp": time.time()}
```

### Server-Side (Flask)

```python
from flask import Flask
from nova402 import x402_required

app = Flask(__name__)

@app.route("/api/ai/generate", methods=["POST"])
@x402_required(
    price="0.10",
    network="base-mainnet",
    description="AI content generation"
)
def generate_content():
    return {"result": "Generated content"}
```

### Client-Side

```python
from nova402 import X402Client

# Initialize client
client = X402Client(
    network="base-mainnet",
    private_key="0x..."  # Your private key
)

# Make paid request
response = client.post(
    "https://api.example.com/ai/generate",
    json={"prompt": "Generate an image"}
)

print(response.json())
```

## Features

Core Protocol:
✧ Payment requirements generation  
✧ EIP-712 signature verification  
✧ Payment encoding/decoding  
✧ Multi-chain support  
✧ Full type hints with Pydantic

Server Integrations:
✧ FastAPI - Async decorator  
✧ Flask - Payment decorator  
✧ Django - Middleware (planned)

Client Features:
✧ Automatic 402 handling  
✧ Wallet integration  
✧ Session management  
✧ Comprehensive error types

## Usage Examples

### Creating Payment Requirements

```python
from nova402 import create_payment_requirements, get_usdc_address

requirements = create_payment_requirements(
    price="100000",  # 0.1 USDC (6 decimals)
    asset=get_usdc_address("base-mainnet"),
    network="eip155:8453",
    pay_to="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    resource="/api/ai/generate",
    description="AI content generation"
)
```

### Verifying Payments

```python
from nova402 import verify_evm_payment, parse_payment_header

# Extract payment header from request
payment_header = request.headers.get("X-PAYMENT")
payment = parse_payment_header(payment_header)

# Verify payment
result = verify_evm_payment(payment, requirements)

if result["isValid"]:
    # Payment is valid, proceed
    pass
else:
    # Invalid payment
    print(result["invalidReason"])
```

### Settling Payments

```python
from nova402 import settle_payment

# Settle via facilitator
result = settle_payment(
    payment,
    requirements,
    facilitator_url="https://facilitator.payai.network"
)

if result["success"]:
    print(f"Payment settled: {result['txHash']}")
else:
    print(f"Settlement failed: {result['error']}")
```

### Using the Client

```python
from nova402 import X402Client

client = X402Client(
    network="base-mainnet",
    private_key="0x...",
    facilitator_url="https://facilitator.payai.network"
)

# Automatic payment handling
try:
    response = client.get("https://api.example.com/premium-data")
    data = response.json()
except PaymentRequiredError as e:
    # Payment was required but failed
    print(f"Payment failed: {e}")
```

## API Reference

### Protocol Functions

#### `create_payment_requirements(**kwargs) -> PaymentRequirements`

Creates payment requirements for a resource.

#### `parse_payment_header(header_value: str) -> PaymentHeader | None`

Parses base64-encoded X-PAYMENT header.

#### `encode_payment_header(payment: PaymentHeader) -> str`

Encodes payment header to base64.

#### `create_402_response(requirements, error=None) -> Payment402Response`

Creates a 402 Payment Required response.

#### `verify_evm_payment(payment, requirements) -> VerificationResult`

Verifies EVM payment signature and validates data.

#### `settle_payment(payment, requirements, facilitator_url) -> SettlementResult`

Settles payment via facilitator.

### Client Class

#### `X402Client(network, private_key, **kwargs)`

x402 protocol client for making paid requests.

**Methods:**
- `get(url, **kwargs)` - Make GET request with automatic payment
- `post(url, **kwargs)` - Make POST request with automatic payment
- `request(method, url, **kwargs)` - Generic request method

### Crypto Functions

#### `sign_eip712(domain, types, value, private_key) -> str`

Signs EIP-712 typed data.

#### `verify_eip712_signature(domain, types, value, signature, expected_address) -> bool`

Verifies EIP-712 signature.

#### `keccak256(data: bytes | str) -> bytes`

Computes Keccak-256 hash.

#### `generate_nonce() -> str`

Generates cryptographically secure nonce.

### Validation Functions

#### `validate_address(address: str) -> bool`

Validates Ethereum address format.

#### `validate_chain_id(chain_id: int) -> bool`

Validates chain ID.

#### `validate_network(network: str) -> bool`

Validates network identifier (CAIP-2).

#### `validate_payment_data(**kwargs) -> None`

Validates complete payment data (raises ValidationError if invalid).

### Constants

```python
from nova402 import (
    X402_VERSION,          # Protocol version
    NETWORKS,              # Network configurations
    USDC_ADDRESSES,        # USDC addresses by network
    FACILITATOR_ENDPOINTS, # Facilitator URLs
)
```

## Network Support

The SDK supports all Nova402 networks:

```python
from nova402 import get_network_config, is_evm_network

# Get network config
base_config = get_network_config("base-mainnet")
print(base_config.rpc_url)  # https://mainnet.base.org

# Check network type
is_evm = is_evm_network("base-mainnet")  # True
```

| Network | Identifier | Type | Status |
|---------|-----------|------|--------|
| Base Mainnet | `base-mainnet` | EVM | ✅ Live |
| Base Sepolia | `base-sepolia` | EVM | ✅ Live |
| Solana Mainnet | `solana-mainnet` | Solana | ✅ Live |
| Solana Devnet | `solana-devnet` | Solana | ✅ Live |
| Polygon | `polygon` | EVM | 🔄 Soon |
| BSC | `bsc` | EVM | 🔄 Soon |
| Peaq | `peaq` | EVM | 📋 Planned |
| Sei | `sei` | EVM | 📋 Planned |

## Error Handling

```python
from nova402 import (
    Nova402Error,
    PaymentRequiredError,
    InvalidPaymentError,
    ExpiredPaymentError,
    SettlementFailedError,
)

try:
    response = client.get("https://api.example.com/data")
except PaymentRequiredError:
    print("Payment required for this resource")
except InvalidPaymentError as e:
    print(f"Invalid payment: {e}")
except ExpiredPaymentError:
    print("Payment has expired")
except SettlementFailedError as e:
    print(f"Settlement failed: {e}")
```

## Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=nova402 --cov-report=html

# Run specific test
pytest tests/test_protocol.py
```

## Development

```bash
# Install development dependencies
pip install -e ".[dev]"

# Format code
black src/nova402

# Lint
ruff check src/nova402

# Type check
mypy src/nova402
```

## Examples

See the [examples directory](./examples) for complete working examples:

- **[FastAPI Server](./examples/fastapi-server)** - Complete FastAPI service
- **[Flask Server](./examples/flask-server)** - Flask application
- **[Python Client](./examples/python-client)** - Client library usage
- **[AI Service](./examples/ai-service)** - AI service monetization

## Contributing

Contributions are welcome! Please see the [Contributing Guide](../../CONTRIBUTING.md).

## License

Apache-2.0

## Links

- **Documentation**: [docs.nova402.com](https://docs.nova402.com)
- **GitHub**: [github.com/nova402/nova-utils](https://github.com/nova402/nova-utils)
- **Website**: [nova402.com](https://nova402.com)
- **x402 Protocol**: [github.com/coinbase/x402](https://github.com/coinbase/x402)

## Support

- **GitHub Issues**: [Report bugs](https://github.com/nova402/nova-utils/issues)
- **Discord**: [Join our community](https://discord.gg/nova402)
- **Email**: dev@nova402.com

