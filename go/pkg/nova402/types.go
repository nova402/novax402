package nova402

import "time"

// PaymentScheme represents the payment scheme type
type PaymentScheme string

const (
	SchemeExact        PaymentScheme = "exact"
	SchemeUpto         PaymentScheme = "upto"
	SchemeSubscription PaymentScheme = "subscription"
)

// NetworkType represents the blockchain type
type NetworkType string

const (
	NetworkTypeEVM    NetworkType = "evm"
	NetworkTypeSolana NetworkType = "solana"
)

// PaymentRequirements represents x402 payment requirements
type PaymentRequirements struct {
	X402Version        int                    `json:"x402Version"`
	Scheme             string                 `json:"scheme"`
	Network            string                 `json:"network"`
	MaxAmountRequired  string                 `json:"maxAmountRequired"`
	Resource           string                 `json:"resource"`
	Description        string                 `json:"description"`
	MimeType           string                 `json:"mimeType"`
	PayTo              string                 `json:"payTo"`
	MaxTimeoutSeconds  int                    `json:"maxTimeoutSeconds"`
	Asset              string                 `json:"asset"`
	Extra              map[string]interface{} `json:"extra,omitempty"`
}

// EIP3009Authorization represents EIP-3009 authorization data
type EIP3009Authorization struct {
	From        string `json:"from"`
	To          string `json:"to"`
	Value       string `json:"value"`
	ValidAfter  int64  `json:"validAfter"`
	ValidBefore int64  `json:"validBefore"`
	Nonce       string `json:"nonce"`
	V           int    `json:"v"`
	R           string `json:"r"`
	S           string `json:"s"`
}

// PaymentPayload represents the payment payload
type PaymentPayload struct {
	Authorization *EIP3009Authorization `json:"authorization,omitempty"`
	Transaction   *string               `json:"transaction,omitempty"`
	Signatures    []string              `json:"signatures,omitempty"`
}

// PaymentHeader represents the X-PAYMENT header structure
type PaymentHeader struct {
	X402Version int            `json:"x402Version"`
	Scheme      string         `json:"scheme"`
	Network     string         `json:"network"`
	Payload     PaymentPayload `json:"payload"`
}

// Payment402Response represents a 402 Payment Required response
type Payment402Response struct {
	X402Version int                   `json:"x402Version"`
	Accepts     []PaymentRequirements `json:"accepts"`
	Error       *string               `json:"error,omitempty"`
}

// VerificationResult represents payment verification result
type VerificationResult struct {
	IsValid       bool                   `json:"isValid"`
	InvalidReason *string                `json:"invalidReason,omitempty"`
	Details       map[string]interface{} `json:"details,omitempty"`
}

// SettlementResult represents payment settlement result
type SettlementResult struct {
	Success     bool    `json:"success"`
	TxHash      *string `json:"txHash,omitempty"`
	NetworkID   *string `json:"networkId,omitempty"`
	BlockNumber *int64  `json:"blockNumber,omitempty"`
	Error       *string `json:"error,omitempty"`
}

// NetworkConfig represents blockchain network configuration
type NetworkConfig struct {
	ChainID  interface{} `json:"chainId"` // int for EVM, string for Solana
	Name     string      `json:"name"`
	Type     NetworkType `json:"type"`
	RPCUrl   string      `json:"rpcUrl"`
	Explorer string      `json:"explorer,omitempty"`
	Currency Currency    `json:"currency"`
}

// Currency represents network currency information
type Currency struct {
	Name     string `json:"name"`
	Symbol   string `json:"symbol"`
	Decimals int    `json:"decimals"`
}

// Payment represents a payment transaction
type Payment struct {
	ID        string                 `json:"id"`
	From      string                 `json:"from"`
	To        string                 `json:"to"`
	Amount    string                 `json:"amount"`
	Network   string                 `json:"network"`
	Status    PaymentStatus          `json:"status"`
	TxHash    *string                `json:"txHash,omitempty"`
	CreatedAt time.Time              `json:"createdAt"`
	ExpiresAt time.Time              `json:"expiresAt"`
	Metadata  map[string]interface{} `json:"metadata,omitempty"`
}

// PaymentStatus represents payment state
type PaymentStatus string

const (
	StatusPending    PaymentStatus = "pending"
	StatusProcessing PaymentStatus = "processing"
	StatusConfirmed  PaymentStatus = "confirmed"
	StatusFailed     PaymentStatus = "failed"
	StatusExpired    PaymentStatus = "expired"
)

// Service represents an x402 service
type Service struct {
	ID          string                 `json:"id"`
	Name        string                 `json:"name"`
	Description string                 `json:"description"`
	Category    string                 `json:"category"`
	Provider    string                 `json:"provider"`
	Endpoint    string                 `json:"endpoint"`
	Price       PaymentPrice           `json:"price"`
	Network     string                 `json:"network"`
	Status      string                 `json:"status"`
	Metadata    map[string]interface{} `json:"metadata,omitempty"`
}

// PaymentPrice represents service pricing
type PaymentPrice struct {
	Amount string `json:"amount"`
	Asset  string `json:"asset"`
	Symbol string `json:"symbol"`
}

