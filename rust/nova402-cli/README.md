# nova402-cli

Command-line tools for Nova402 x402 payment protocol.

[![Crates.io](https://img.shields.io/crates/v/nova402-cli.svg)](https://crates.io/crates/nova402-cli)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

CLI for interacting with x402 services, verifying payments, and managing Nova402 operations.

## Installation

### From crates.io

```bash
cargo install nova402-cli
```

### From source

```bash
git clone https://github.com/nova402/nova-utils.git
cd nova-utils/rust/nova402-cli
cargo install --path .
```

### Pre-built binaries

Download from [GitHub Releases](https://github.com/nova402/nova-utils/releases).

## Commands

### Payment Operations

#### Verify Payment

```bash
nova402 verify \
  --payment-header <base64-encoded-header> \
  --requirements <requirements-json>
```

#### Settle Payment

```bash
nova402 settle \
  --payment-header <base64-encoded-header> \
  --facilitator https://facilitator.payai.network \
  --private-key <facilitator-key>
```

#### Create Payment

```bash
nova402 create-payment \
  --to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb \
  --amount 100000 \
  --network base-mainnet \
  --private-key <your-key>
```

### Service Operations

#### Discover Services

```bash
nova402 discover \
  --network base-mainnet \
  --category ai \
  --max-price 1000000
```

#### Register Service

```bash
nova402 register \
  --name "My AI Service" \
  --endpoint https://api.example.com \
  --price 100000 \
  --network base-mainnet
```

#### Test Service

```bash
nova402 test \
  --service-id abc123 \
  --endpoint https://api.example.com/test
```

### Crypto Operations

#### Generate Nonce

```bash
nova402 nonce
```

#### Hash Data

```bash
nova402 hash --data "Hello, x402!" --algorithm keccak256
```

#### Sign Message

```bash
nova402 sign \
  --message "Payment authorization" \
  --private-key <key>
```

#### Verify Signature

```bash
nova402 verify-sig \
  --message "Payment authorization" \
  --signature <sig> \
  --address 0x...
```

### Network Operations

#### Get Network Info

```bash
nova402 network info --network base-mainnet
```

#### List Networks

```bash
nova402 network list
```

#### Get USDC Address

```bash
nova402 network usdc --network base-mainnet
```

### Utility Commands

#### Generate Wallet

```bash
nova402 wallet generate
```

#### Get Balance

```bash
nova402 wallet balance \
  --address 0x... \
  --network base-mainnet
```

#### Convert Amounts

```bash
# Convert to smallest unit
nova402 convert --amount 1.5 --decimals 6  # → 1500000

# Convert to decimal
nova402 convert --amount 1500000 --decimals 6 --reverse  # → 1.5
```

## Configuration

### Config File

Create `~/.nova402/config.toml`:

```toml
[default]
network = "base-mainnet"
facilitator_url = "https://facilitator.payai.network"

[networks.base-mainnet]
rpc_url = "https://mainnet.base.org"
treasury_wallet = "0x..."

[networks.solana-mainnet]
rpc_url = "https://api.mainnet-beta.solana.com"
treasury_wallet = "..."
```

### Environment Variables

```bash
export NOVA402_NETWORK=base-mainnet
export NOVA402_TREASURY_WALLET=0x...
export NOVA402_FACILITATOR_URL=https://facilitator.payai.network
export NOVA402_PRIVATE_KEY=0x...  # Use with caution!
```

## Examples

### Complete Payment Flow

```bash
# 1. Discover services
nova402 discover --category ai

# 2. Test service (free)
nova402 test --service-id ai-service-123

# 3. Create payment authorization
nova402 create-payment \
  --to 0x... \
  --amount 100000 \
  --network base-mainnet \
  --private-key $PRIVATE_KEY

# 4. Make paid request
curl -X POST https://api.example.com/ai/generate \
  -H "X-PAYMENT: <payment-header>" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Generate content"}'
```

### Service Provider Workflow

```bash
# 1. Register service
nova402 register \
  --name "My AI API" \
  --endpoint https://api.myservice.com \
  --price 50000 \
  --network base-mainnet \
  --description "AI content generation"

# 2. Monitor payments
nova402 payments list --service-id my-service

# 3. View analytics
nova402 analytics --service-id my-service --period 7d
```

## Output Formats

### JSON Output

```bash
nova402 discover --category ai --json
```

### Table Output (default)

```bash
nova402 network list
```

### Quiet Mode

```bash
nova402 verify --quiet
```

## Advanced Usage

### Batch Operations

```bash
# Verify multiple payments
cat payments.json | nova402 verify --batch

# Settle multiple payments
nova402 settle --batch --input settlements.json
```

### Interactive Mode

```bash
nova402 interactive
```

### Watch Mode

```bash
# Monitor service
nova402 watch --service-id abc123 --interval 5s
```

## Building from Source

```bash
git clone https://github.com/nova402/nova-utils.git
cd nova-utils/rust/nova402-cli
cargo build --release
sudo cp target/release/nova402 /usr/local/bin/
```

## License

Apache-2.0

## Links

- [GitHub](https://github.com/nova402/nova-utils)
- [Documentation](https://docs.nova402.com/cli)
- [Website](https://nova402.com)

