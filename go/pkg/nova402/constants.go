package nova402

import "encoding/base64"

// Protocol constants
const (
	X402Version             = 1
	DefaultTimeoutSeconds   = 300
	DefaultValidityBuffer   = 60
	DefaultMimeType         = "application/json"
)

// Supported payment schemes
var SupportedSchemes = []string{"exact", "upto", "subscription"}

// Network configurations
var Networks = map[string]NetworkConfig{
	"base-mainnet": {
		ChainID: 8453,
		Name:    "Base Mainnet",
		Type:    NetworkTypeEVM,
		RPCUrl:  "https://mainnet.base.org",
		Currency: Currency{
			Name:     "Ethereum",
			Symbol:   "ETH",
			Decimals: 18,
		},
		Explorer: "https://basescan.org",
	},
	"base-sepolia": {
		ChainID: 84532,
		Name:    "Base Sepolia",
		Type:    NetworkTypeEVM,
		RPCUrl:  "https://sepolia.base.org",
		Currency: Currency{
			Name:     "Ethereum",
			Symbol:   "ETH",
			Decimals: 18,
		},
		Explorer: "https://sepolia.basescan.org",
	},
	"solana-mainnet": {
		ChainID: "mainnet",
		Name:    "Solana Mainnet",
		Type:    NetworkTypeSolana,
		RPCUrl:  "https://api.mainnet-beta.solana.com",
		Currency: Currency{
			Name:     "Solana",
			Symbol:   "SOL",
			Decimals: 9,
		},
		Explorer: "https://explorer.solana.com",
	},
	"solana-devnet": {
		ChainID: "devnet",
		Name:    "Solana Devnet",
		Type:    NetworkTypeSolana,
		RPCUrl:  "https://api.devnet.solana.com",
		Currency: Currency{
			Name:     "Solana",
			Symbol:   "SOL",
			Decimals: 9,
		},
		Explorer: "https://explorer.solana.com?cluster=devnet",
	},
	"polygon": {
		ChainID: 137,
		Name:    "Polygon",
		Type:    NetworkTypeEVM,
		RPCUrl:  "https://polygon-rpc.com",
		Currency: Currency{
			Name:     "MATIC",
			Symbol:   "MATIC",
			Decimals: 18,
		},
		Explorer: "https://polygonscan.com",
	},
	"bsc": {
		ChainID: 56,
		Name:    "BNB Smart Chain",
		Type:    NetworkTypeEVM,
		RPCUrl:  "https://bsc-dataseed.binance.org",
		Currency: Currency{
			Name:     "BNB",
			Symbol:   "BNB",
			Decimals: 18,
		},
		Explorer: "https://bscscan.com",
	},
	"sei": {
		ChainID: 1329,
		Name:    "Sei Network",
		Type:    NetworkTypeEVM,
		RPCUrl:  "https://evm-rpc.sei-apis.com",
		Currency: Currency{
			Name:     "SEI",
			Symbol:   "SEI",
			Decimals: 18,
		},
		Explorer: "https://seitrace.com",
	},
	"peaq": {
		ChainID: 3338,
		Name:    "Peaq Network",
		Type:    NetworkTypeEVM,
		RPCUrl:  "https://peaq.api.onfinality.io/public",
		Currency: Currency{
			Name:     "PEAQ",
			Symbol:   "PEAQ",
			Decimals: 18,
		},
		Explorer: "https://peaq.subscan.io",
	},
}

// USDC contract addresses by network
var USDCAddresses = map[string]string{
	"base-mainnet":    "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
	"base-sepolia":    "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
	"polygon":         "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
	"bsc":             "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
	"solana-mainnet":  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
	"solana-devnet":   "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
}

// Facilitator endpoints
var FacilitatorEndpoints = map[string]string{
	"mainnet": "https://facilitator.payai.network",
	"testnet": "https://testnet-facilitator.payai.network",
	"local":   "http://localhost:3001",
}

// GetNetworkConfig returns configuration for a network
func GetNetworkConfig(network string) (*NetworkConfig, error) {
	config, exists := Networks[network]
	if !exists {
		return nil, fmt.Errorf("unsupported network: %s", network)
	}
	return &config, nil
}

// GetUSDCAddress returns USDC address for a network
func GetUSDCAddress(network string) (string, error) {
	address, exists := USDCAddresses[network]
	if !exists {
		return "", fmt.Errorf("USDC not configured for network: %s", network)
	}
	return address, nil
}

// IsEVMNetwork checks if network is EVM-based
func IsEVMNetwork(network string) bool {
	config, err := GetNetworkConfig(network)
	if err != nil {
		return false
	}
	return config.Type == NetworkTypeEVM
}

// IsSolanaNetwork checks if network is Solana-based
func IsSolanaNetwork(network string) bool {
	config, err := GetNetworkConfig(network)
	if err != nil {
		return false
	}
	return config.Type == NetworkTypeSolana
}

