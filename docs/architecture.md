# Architecture Overview

Nova402 utilities provide a multi-layered architecture for the x402 payment protocol ecosystem.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Application Layer                            │
│   (Nova402 Website, Service Hub, Token Mint, Native Agent)      │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                      SDK Layer (nova-utils)                      │
│  ┌──────────────┐  ┌──────────┐  ┌────────┐  ┌──────────┐     │
│  │  TypeScript  │  │  Python  │  │  Rust  │  │    Go    │     │
│  │  Packages    │  │   SDK    │  │  Core  │  │   SDK    │     │
│  └──────────────┘  └──────────┘  └────────┘  └──────────┘     │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                   x402 Protocol Layer                            │
│  ┌───────────────┐  ┌──────────────┐  ┌──────────────────┐    │
│  │   Payment     │  │ Verification │  │   Settlement     │    │
│  │ Requirements  │  │   Engine     │  │     Engine       │    │
│  └───────────────┘  └──────────────┘  └──────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    Blockchain Layer                              │
│  ┌──────┐  ┌────────┐  ┌─────────┐  ┌──────┐  ┌──────┐       │
│  │ Base │  │ Solana │  │ Polygon │  │ BSC  │  │ Peaq │       │
│  └──────┘  └────────┘  └─────────┘  └──────┘  └──────┘       │
└─────────────────────────────────────────────────────────────────┘
```

## Language-Specific Roles

### TypeScript (60%)

**Primary SDK layer** - The main interface for developers

**Packages:**
- `@nova402/core` - Protocol implementation
- `@nova402/express` - Express middleware
- `@nova402/next` - Next.js integration
- `@nova402/react` - React hooks
- `@nova402/client` - HTTP client
- `@nova402/solana` - Solana adapter

**Use Cases:**
- Web applications (frontend & backend)
- API servers (Express, Next.js)
- React/Next.js clients
- Node.js services

### Python (25%)

**Data processing & ML integration**

**Package:**
- `nova402` - Full Python SDK

**Features:**
- FastAPI/Flask server integrations
- Async/await support
- Data analytics integration
- AI/ML service monetization

**Use Cases:**
- AI/ML APIs
- Data processing services
- Python backend services
- Jupyter notebook integration

### Rust (10%)

**Performance-critical operations**

**Packages:**
- `nova402-core` - Crypto primitives
- `nova402-cli` - Command-line tools
- `nova402-wasm` - WebAssembly bindings

**Features:**
- High-performance hashing
- Signature verification
- Merkle tree operations
- FFI bindings

**Use Cases:**
- Performance-critical services
- CLI tools
- WebAssembly modules
- FFI layer for other languages

### Go (5%)

**Microservices & CLI tools**

**Package:**
- `nova402` - Go SDK

**Features:**
- HTTP client/server
- CLI tools
- Microservice integration
- Cloud-native deployment

**Use Cases:**
- Microservices architecture
- Cloud infrastructure
- CLI utilities
- Backend services

### C (<1%)

**Embedded systems & FFI**

**Library:**
- `libnova402` - Core C library

**Features:**
- Zero dependencies
- Minimal memory footprint
- Platform-agnostic
- FFI-compatible

**Use Cases:**
- Embedded systems
- IoT devices
- Mobile native SDKs
- FFI bindings

## Component Architecture

### Core Protocol Layer

```
┌─────────────────────────────────────────┐
│         Core Protocol (@nova402/core)    │
├─────────────────────────────────────────┤
│ • Payment Requirements Generation        │
│ • Payment Header Encoding/Decoding       │
│ • Signature Verification (EIP-712)       │
│ • Network Configuration                  │
│ • Validation Utilities                   │
└─────────────────────────────────────────┘
```

**Responsibilities:**
- Define protocol types and schemas
- Implement payment requirements creation
- Handle payment header encoding
- Verify signatures and payment data
- Manage network configurations

### Server Integration Layer

```
┌─────────────────────────────────────────┐
│    Server SDKs (Express, Next, FastAPI) │
├─────────────────────────────────────────┤
│ • Middleware Integration                 │
│ • Request Interception                   │
│ • Payment Verification                   │
│ • Settlement Coordination                │
│ • Response Formatting                    │
└─────────────────────────────────────────┘
```

**Responsibilities:**
- Extract payment headers from requests
- Verify payments (local or via facilitator)
- Gate access to paid resources
- Settle payments on blockchain
- Return settlement receipts

### Client Integration Layer

```
┌─────────────────────────────────────────┐
│   Client SDKs (Axios, Fetch, Requests)  │
├─────────────────────────────────────────┤
│ • 402 Response Handling                  │
│ • Payment Creation                       │
│ • Signature Generation                   │
│ • Request Retry Logic                    │
│ • Session Management                     │
└─────────────────────────────────────────┘
```

**Responsibilities:**
- Detect 402 responses
- Create payment authorizations
- Sign payments with user wallet
- Retry requests with payment
- Manage payment sessions

### Blockchain Adapter Layer

```
┌────────────────┐  ┌─────────────────┐
│   EVM Adapter  │  │ Solana Adapter  │
├────────────────┤  ├─────────────────┤
│ • EIP-3009     │  │ • SPL Token     │
│ • Web3.js      │  │ • @solana/web3  │
│ • Ethers.js    │  │ • Ed25519       │
└────────────────┘  └─────────────────┘
```

**Responsibilities:**
- Abstract blockchain specifics
- Handle chain-specific signing
- Execute token transfers
- Wait for confirmations
- Parse transaction receipts

## Data Flow

### Payment Processing Flow

```
Client Request
    │
    ├─> No Payment Header?
    │   ├─> Generate Payment Requirements
    │   └─> Return 402 + Requirements
    │
    ├─> Extract Payment Header
    │
    ├─> Verify Signature
    │   ├─> EVM: Verify EIP-712
    │   └─> Solana: Verify Ed25519
    │
    ├─> Validate Amount & Recipient
    │
    ├─> Execute Business Logic
    │
    ├─> Settle Payment
    │   ├─> Local: Direct blockchain tx
    │   └─> Facilitator: Delegate to PayAI
    │
    └─> Return Response + Settlement Receipt
```

### Service Discovery Flow

```
Discovery Request
    │
    ├─> Query Service Registry
    │   ├─> Filter by category
    │   ├─> Filter by network
    │   ├─> Filter by price range
    │   └─> Sort by performance
    │
    ├─> Fetch Service Metadata
    │   ├─> Pricing information
    │   ├─> API specifications
    │   ├─> Provider details
    │   └─> Performance metrics
    │
    └─> Return Service List
```

## Security Architecture

### Multi-Layer Security

1. **Transport Security** - TLS 1.3 for all connections
2. **Authentication** - Wallet signatures (EIP-191, Ed25519)
3. **Authorization** - Payment verification (EIP-712, Solana)
4. **Economic Security** - Payment-gated access
5. **Blockchain Security** - On-chain settlement verification

### Cryptographic Stack

```
Application Layer
    │
    ├─> EIP-712 Typed Data Signing (EVM)
    │   ├─> Domain Separator
    │   ├─> Structured Data
    │   └─> ECDSA Signature
    │
    └─> Ed25519 Signing (Solana)
        ├─> Message Hash
        └─> Ed25519 Signature
```

## Performance Optimization

### Caching Strategy

- **Network Configs**: Cached in memory (immutable)
- **Payment Verification**: Redis cache (5 min TTL)
- **Service Discovery**: CDN cache (1 hour TTL)
- **Token Metadata**: Database cache (24 hour TTL)

### Parallel Processing

- Signature verification (async)
- Multi-chain queries (parallel)
- Facilitator API calls (concurrent)

### Resource Management

- Connection pooling for RPC providers
- Request batching for blockchain queries
- Lazy loading of heavy dependencies

## Scalability

### Horizontal Scaling

- **Stateless services** - No shared state between instances
- **Load balancing** - Round-robin or least-connections
- **Service mesh** - Inter-service communication
- **Distributed caching** - Redis cluster

### Vertical Scaling

- **Resource limits** - CPU/memory constraints
- **Auto-scaling** - Based on load metrics
- **Database optimization** - Indexed queries, read replicas

## Monitoring & Observability

### Metrics

- Payment processing time
- Verification success rate
- Settlement confirmation time
- Service discovery latency
- Error rates by type

### Logging

- Structured JSON logging
- Request/response logging
- Payment event logging
- Error tracking

### Tracing

- Distributed tracing with OpenTelemetry
- Request ID propagation
- Performance profiling

## Future Architecture

### Planned Enhancements

1. **GraphQL API** - More flexible service queries
2. **WebSocket Support** - Real-time payment notifications
3. **Multi-Region** - Geographic distribution
4. **AI Optimization** - Smart payment routing
5. **Advanced Analytics** - Usage insights and forecasting

---

**Built by Nova402** - Infrastructure for the x402 ecosystem

