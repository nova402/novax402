# Nova402 Go SDK

Go implementation of the x402 payment protocol for Nova402 ecosystem.

[![Go Reference](https://pkg.go.dev/badge/github.com/nova402/nova-utils/go.svg)](https://pkg.go.dev/github.com/nova402/nova-utils/go)
[![Go Report Card](https://goreportcard.com/badge/github.com/nova402/nova-utils/go)](https://goreportcard.com/report/github.com/nova402/nova-utils/go)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Go SDK for building x402-enabled microservices, CLI tools, and backend services.

## Features

✧ HTTP client - Automatic payment handling  
✧ Server integration - HTTP middleware  
✧ CLI tools - Command-line utilities  
✧ Type safety - Strong typing  
✧ Multi-chain - EVM and Solana support  
✧ Production ready - Error handling, logging

## Installation

```bash
go get github.com/nova402/nova-utils/go/pkg/nova402
```

## Quick Start

### Client Usage

```go
package main

import (
	"fmt"
	"log"
	
	"github.com/nova402/nova-utils/go/pkg/nova402"
)

func main() {
	// Create client
	client := nova402.NewClient("base-mainnet", "https://facilitator.payai.network")
	client.WithPrivateKey("0x...")

	// Make paid request (automatic 402 handling)
	resp, err := client.Post(
		"https://api.example.com/ai/generate",
		map[string]string{"prompt": "Generate content"},
		nil,
	)
	if err != nil {
		log.Fatal(err)
	}
	defer resp.Body.Close()

	fmt.Println("Response:", resp.StatusCode)
}
```

### Server Integration

```go
package main

import (
	"net/http"
	
	"github.com/nova402/nova-utils/go/pkg/nova402"
)

func main() {
	handler := nova402.NewPaymentHandler(nova402.PaymentHandlerConfig{
		Network:        "base-mainnet",
		TreasuryWallet: "0x...",
		FacilitatorURL: "https://facilitator.payai.network",
	})

	http.HandleFunc("/api/premium", handler.RequirePayment(
		"0.10", // 0.10 USDC
		func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			w.Write([]byte(`{"data": "premium content"}`))
		},
	))

	http.ListenAndServe(":8080", nil)
}
```

### Creating Payment Requirements

```go
package main

import (
	"fmt"
	
	"github.com/nova402/nova-utils/go/pkg/nova402"
)

func main() {
	usdcAddress, _ := nova402.GetUSDCAddress("base-mainnet")
	
	requirements := nova402.CreatePaymentRequirements(
		"100000",  // 0.1 USDC
		usdcAddress,
		"eip155:8453",
		"0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
		"/api/ai/generate",
		"AI content generation",
	)

	fmt.Printf("%+v\n", requirements)
}
```

## CLI Tools

### Installation

```bash
go install github.com/nova402/nova-utils/go/cmd/nova402@latest
```

### Usage

```bash
# Verify a payment
nova402 verify --payment-header <base64> --requirements <json>

# Settle a payment
nova402 settle --payment-header <base64> --facilitator https://facilitator.payai.network

# Discover facilitators
nova402 discover --network base-mainnet

# Generate payment signature
nova402 sign --data <json> --private-key <key>
```

## API Reference

### Client

#### `NewClient(network, facilitatorURL string) *Client`

Creates a new x402 client.

**Methods:**
- `WithPrivateKey(key string) *Client` - Set private key for signing
- `Get(url string, headers map[string]string) (*http.Response, error)` - GET with payment
- `Post(url string, body interface{}, headers map[string]string) (*http.Response, error)` - POST with payment

### Protocol Functions

#### `CreatePaymentRequirements(...) PaymentRequirements`

Creates payment requirements for a resource.

#### `ParsePaymentHeader(headerValue string) (*PaymentHeader, error)`

Parses base64-encoded X-PAYMENT header.

#### `EncodePaymentHeader(payment *PaymentHeader) (string, error)`

Encodes payment header to base64.

#### `Create402Response(requirements []PaymentRequirements, error *string) Payment402Response`

Creates a 402 Payment Required response.

#### `VerifyEVMPayment(payment *PaymentHeader, requirements *PaymentRequirements) (*VerificationResult, error)`

Verifies EVM payment signature and data.

### Network Functions

#### `GetNetworkConfig(network string) (*NetworkConfig, error)`

Returns configuration for a network.

#### `GetUSDCAddress(network string) (string, error)`

Returns USDC address for a network.

#### `IsEVMNetwork(network string) bool`

Checks if network is EVM-based.

#### `IsSolanaNetwork(network string) bool`

Checks if network is Solana-based.

## Supported Networks

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

## Examples

See the [examples directory](./examples) for complete examples:

- **[HTTP Client](./examples/client)** - Making paid requests
- **[HTTP Server](./examples/server)** - Payment-gated endpoints
- **[CLI Tool](./examples/cli)** - Command-line usage
- **[Microservice](./examples/microservice)** - Production microservice

## Testing

```bash
# Run tests
go test ./...

# Run tests with coverage
go test -cover ./...

# Run specific test
go test -run TestClient ./pkg/nova402
```

## Building

```bash
# Build library
go build ./pkg/nova402

# Build CLI
go build -o nova402 ./cmd/nova402

# Build with optimizations
go build -ldflags="-s -w" -o nova402 ./cmd/nova402
```

## Contributing

Contributions are welcome! Please see the [Contributing Guide](../../CONTRIBUTING.md).

## License

Apache-2.0

## Links

- **Documentation**: [pkg.go.dev](https://pkg.go.dev/github.com/nova402/nova-utils/go)
- **GitHub**: [github.com/nova402/nova-utils](https://github.com/nova402/nova-utils)
- **Website**: [nova402.com](https://nova402.com)

## Support

- **GitHub Issues**: [Report bugs](https://github.com/nova402/nova-utils/issues)
- **Discord**: [Join community](https://discord.gg/nova402)
- **Email**: dev@nova402.com

