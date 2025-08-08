"""
Constants for Nova402 x402 protocol implementation
"""

from typing import Dict
from .types import NetworkConfig

# x402 Protocol Version
X402_VERSION = 1

# Default timeout for payments (seconds)
DEFAULT_TIMEOUT_SECONDS = 300

# Default validity buffer (seconds)
DEFAULT_VALIDITY_BUFFER = 60

# Default MIME type
DEFAULT_MIME_TYPE = "application/json"

# Supported payment schemes
SUPPORTED_SCHEMES = ["exact", "upto", "subscription"]

# Network configurations
NETWORKS: Dict[str, NetworkConfig] = {
    "base-mainnet": NetworkConfig(
        chain_id=8453,
        name="Base Mainnet",
        type="evm",
        rpc_url="https://mainnet.base.org",
        explorer="https://basescan.org",
        currency_name="Ethereum",
        currency_symbol="ETH",
        currency_decimals=18,
    ),
    "base-sepolia": NetworkConfig(
        chain_id=84532,
        name="Base Sepolia",
        type="evm",
        rpc_url="https://sepolia.base.org",
        explorer="https://sepolia.basescan.org",
        currency_name="Ethereum",
        currency_symbol="ETH",
        currency_decimals=18,
    ),
    "solana-mainnet": NetworkConfig(
        chain_id="mainnet",
        name="Solana Mainnet",
        type="solana",
        rpc_url="https://api.mainnet-beta.solana.com",
        explorer="https://explorer.solana.com",
        currency_name="Solana",
        currency_symbol="SOL",
        currency_decimals=9,
    ),
    "solana-devnet": NetworkConfig(
        chain_id="devnet",
        name="Solana Devnet",
        type="solana",
        rpc_url="https://api.devnet.solana.com",
        explorer="https://explorer.solana.com?cluster=devnet",
        currency_name="Solana",
        currency_symbol="SOL",
        currency_decimals=9,
    ),
    "polygon": NetworkConfig(
        chain_id=137,
        name="Polygon",
        type="evm",
        rpc_url="https://polygon-rpc.com",
        explorer="https://polygonscan.com",
        currency_name="MATIC",
        currency_symbol="MATIC",
        currency_decimals=18,
    ),
    "bsc": NetworkConfig(
        chain_id=56,
        name="BNB Smart Chain",
        type="evm",
        rpc_url="https://bsc-dataseed.binance.org",
        explorer="https://bscscan.com",
        currency_name="BNB",
        currency_symbol="BNB",
        currency_decimals=18,
    ),
    "sei": NetworkConfig(
        chain_id=1329,
        name="Sei Network",
        type="evm",
        rpc_url="https://evm-rpc.sei-apis.com",
        explorer="https://seitrace.com",
        currency_name="SEI",
        currency_symbol="SEI",
        currency_decimals=18,
    ),
    "peaq": NetworkConfig(
        chain_id=3338,
        name="Peaq Network",
        type="evm",
        rpc_url="https://peaq.api.onfinality.io/public",
        explorer="https://peaq.subscan.io",
        currency_name="PEAQ",
        currency_symbol="PEAQ",
        currency_decimals=18,
    ),
}

# USDC contract addresses by network
USDC_ADDRESSES: Dict[str, str] = {
    "base-mainnet": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    "base-sepolia": "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    "polygon": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    "bsc": "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
    "solana-mainnet": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "solana-devnet": "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
}

# PayAI Facilitator endpoints
FACILITATOR_ENDPOINTS = {
    "mainnet": "https://facilitator.payai.network",
    "testnet": "https://testnet-facilitator.payai.network",
    "local": "http://localhost:3001",
}

# Echo Merchant endpoints for testing
ECHO_MERCHANT_ENDPOINTS = {
    "mainnet": "https://x402.payai.network",
    "testnet": "https://x402-testnet.payai.network",
}


def get_network_config(network: str) -> NetworkConfig:
    """
    Get network configuration.
    
    Args:
        network: Network identifier
        
    Returns:
        Network configuration
        
    Raises:
        ValueError: If network is not supported
    """
    config = NETWORKS.get(network)
    if not config:
        raise ValueError(f"Unsupported network: {network}")
    return config


def get_usdc_address(network: str) -> str:
    """
    Get USDC contract address for network.
    
    Args:
        network: Network identifier
        
    Returns:
        USDC contract address
        
    Raises:
        ValueError: If USDC not configured for network
    """
    address = USDC_ADDRESSES.get(network)
    if not address:
        raise ValueError(f"USDC not configured for network: {network}")
    return address


def is_evm_network(network: str) -> bool:
    """Check if network is EVM-based."""
    config = get_network_config(network)
    return config.type == "evm"


def is_solana_network(network: str) -> bool:
    """Check if network is Solana-based."""
    config = get_network_config(network)
    return config.type == "solana"


def to_caip2(network: str) -> str:
    """
    Convert network identifier to CAIP-2 format.
    
    Args:
        network: Network identifier
        
    Returns:
        CAIP-2 formatted string
    """
    config = get_network_config(network)
    
    if config.type == "evm":
        return f"eip155:{config.chain_id}"
    elif config.type == "solana":
        return f"solana:{config.chain_id}"
    else:
        raise ValueError(f"Unsupported network type: {config.type}")

