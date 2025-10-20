# Nova402 Python SDK

> Python implementation of the x402 payment protocol for Nova402 ecosystem

Complete Python SDK for building x402-enabled services, with support for FastAPI, Flask, and async operations.

## Packages

### nova402

Main Python SDK providing:
- Core protocol implementation
- Server integrations (FastAPI, Flask)
- HTTP client with automatic payment handling
- Cryptographic utilities
- Comprehensive type hints

## Installation

```bash
pip install nova402
```

### Development Installation

```bash
cd nova402
pip install -e ".[dev,server]"
```

## Quick Start

### Server (FastAPI)

```python
from fastapi import FastAPI
from nova402 import x402_required

app = FastAPI()

@app.post("/api/ai/generate")
@x402_required(price="0.10", network="base-mainnet")
async def generate_ai(prompt: str):
    result = await generate_content(prompt)
    return {"result": result}
```

### Server (Flask)

```python
from flask import Flask
from nova402 import x402_required

app = Flask(__name__)

@app.route("/api/data", methods=["GET"])
@x402_required(price="0.05", network="base-mainnet")
def get_data():
    return {"data": "premium content"}
```

### Client

```python
from nova402 import X402Client

client = X402Client(
    network="base-mainnet",
    private_key=os.getenv("PRIVATE_KEY")
)

response = client.post(
    "https://api.example.com/ai/generate",
    json={"prompt": "Generate content"}
)

print(response.json())
```

## Features

- ✅ **Protocol compliant** - Follows x402 specification
- ✅ **Multi-chain** - Base, Solana, Polygon, BSC
- ✅ **Type safe** - Full type hints with Pydantic
- ✅ **Async support** - asyncio and async/await
- ✅ **Server integrations** - FastAPI, Flask decorators
- ✅ **Client library** - Automatic payment handling
- ✅ **Well documented** - Comprehensive docstrings
- ✅ **Tested** - High test coverage

## Examples

See [examples directory](./examples) for complete examples:

- **[FastAPI Server](../examples/python/fastapi-server)** - Complete FastAPI service
- **[Flask Server](../examples/python/flask-server)** - Flask application
- **[Client Usage](../examples/python/client-example)** - HTTP client

## Development

### Setup

```bash
pip install -e ".[dev]"
```

### Testing

```bash
# Run tests
pytest

# With coverage
pytest --cov=nova402 --cov-report=html

# Specific test
pytest tests/test_protocol.py -v
```

### Linting

```bash
# Format
black src/nova402

# Lint
ruff check src/nova402

# Type check
mypy src/nova402
```

### Building

```bash
# Build package
python -m build

# Install locally
pip install -e .
```

## Package Structure

```
nova402/
├── src/
│   └── nova402/
│       ├── __init__.py          # Package exports
│       ├── client.py            # HTTP client
│       ├── protocol.py          # Protocol implementation
│       ├── types.py             # Type definitions
│       ├── errors.py            # Error classes
│       ├── constants.py         # Constants
│       ├── crypto.py            # Cryptographic utilities
│       ├── validation.py        # Validation functions
│       └── integrations/
│           ├── fastapi.py       # FastAPI integration
│           └── flask.py         # Flask integration
├── tests/                       # Test suite
├── examples/                    # Usage examples
├── setup.py                     # Setup script
├── pyproject.toml               # Project metadata
└── README.md
```

## Publishing

### PyPI

```bash
# Build
python -m build

# Check
twine check dist/*

# Upload to TestPyPI
twine upload --repository testpypi dist/*

# Upload to PyPI
twine upload dist/*
```

## Python Version Support

- Python 3.8+
- Python 3.9+
- Python 3.10+
- Python 3.11+
- Python 3.12+

## Dependencies

### Core

- web3 >= 6.11.0
- eth-account >= 0.10.0
- eth-utils >= 2.3.0
- pydantic >= 2.5.0
- requests >= 2.31.0

### Server (Optional)

- fastapi >= 0.104.0
- flask >= 3.0.0
- uvicorn >= 0.24.0

### Development

- pytest >= 7.4.0
- black >= 23.0.0
- mypy >= 1.7.0
- ruff >= 0.1.0

## License

Apache-2.0

## Links

- [PyPI Package](https://pypi.org/project/nova402/)
- [Documentation](https://docs.nova402.com/python)
- [GitHub](https://github.com/nova402/nova-utils)
- [Website](https://nova402.com)

