/**
 * Network configurations for supported blockchains
 */

import { NetworkConfig, SupportedNetwork } from './types';

/**
 * Network configurations
 */
export const NETWORKS: Record<SupportedNetwork, NetworkConfig> = {
  'base-mainnet': {
    chainId: 8453,
    name: 'Base Mainnet',
    type: 'evm',
    rpcUrl: 'https://mainnet.base.org',
    currency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    explorer: 'https://basescan.org',
  },
  'base-sepolia': {
    chainId: 84532,
    name: 'Base Sepolia',
    type: 'evm',
    rpcUrl: 'https://sepolia.base.org',
    currency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    explorer: 'https://sepolia.basescan.org',
  },
  'solana-mainnet': {
    chainId: 0,
    name: 'Solana Mainnet',
    type: 'solana',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    currency: {
      name: 'Solana',
      symbol: 'SOL',
      decimals: 9,
    },
    explorer: 'https://explorer.solana.com',
  },
  'solana-devnet': {
    chainId: 0,
    name: 'Solana Devnet',
    type: 'solana',
    rpcUrl: 'https://api.devnet.solana.com',
    currency: {
      name: 'Solana',
      symbol: 'SOL',
      decimals: 9,
    },
    explorer: 'https://explorer.solana.com?cluster=devnet',
  },
  polygon: {
    chainId: 137,
    name: 'Polygon',
    type: 'evm',
    rpcUrl: 'https://polygon-rpc.com',
    currency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    explorer: 'https://polygonscan.com',
  },
  bsc: {
    chainId: 56,
    name: 'BNB Smart Chain',
    type: 'evm',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    currency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    explorer: 'https://bscscan.com',
  },
  sei: {
    chainId: 1329,
    name: 'Sei Network',
    type: 'evm',
    rpcUrl: 'https://evm-rpc.sei-apis.com',
    currency: {
      name: 'SEI',
      symbol: 'SEI',
      decimals: 18,
    },
    explorer: 'https://seitrace.com',
  },
  peaq: {
    chainId: 3338,
    name: 'Peaq Network',
    type: 'evm',
    rpcUrl: 'https://peaq.api.onfinality.io/public',
    currency: {
      name: 'PEAQ',
      symbol: 'PEAQ',
      decimals: 18,
    },
    explorer: 'https://peaq.subscan.io',
  },
};

/**
 * USDC contract addresses by network
 */
export const USDC_ADDRESSES: Record<string, string> = {
  'base-mainnet': '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  'base-sepolia': '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
  'polygon': '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  'bsc': '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  'solana-mainnet': 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  'solana-devnet': '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
};

/**
 * Get network configuration
 * 
 * @param network - Network identifier
 * @returns Network configuration
 * @throws Error if network is unknown
 */
export function getNetworkConfig(network: SupportedNetwork): NetworkConfig {
  const config = NETWORKS[network];
  if (!config) {
    throw new Error(`Unknown network: ${network}`);
  }
  return config;
}

/**
 * Get USDC address for a network
 * 
 * @param network - Network identifier
 * @returns USDC contract address
 * @throws Error if USDC not configured for network
 */
export function getUSDCAddress(network: SupportedNetwork): string {
  const address = USDC_ADDRESSES[network];
  if (!address) {
    throw new Error(`USDC not configured for network: ${network}`);
  }
  return address;
}

/**
 * Check if network is EVM-based
 * 
 * @param network - Network identifier
 * @returns True if EVM network
 */
export function isEVMNetwork(network: SupportedNetwork): boolean {
  return getNetworkConfig(network).type === 'evm';
}

/**
 * Check if network is Solana-based
 * 
 * @param network - Network identifier
 * @returns True if Solana network
 */
export function isSolanaNetwork(network: SupportedNetwork): boolean {
  return getNetworkConfig(network).type === 'solana';
}

/**
 * Convert network identifier to CAIP-2 format
 * 
 * @param network - Network identifier
 * @returns CAIP-2 formatted network string
 */
export function toCAIP2(network: SupportedNetwork): string {
  const config = getNetworkConfig(network);
  
  if (config.type === 'evm') {
    return `eip155:${config.chainId}`;
  } else if (config.type === 'solana') {
    return network.includes('devnet') ? 'solana:devnet' : 'solana:mainnet';
  }
  
  throw new Error(`Unsupported network type: ${config.type}`);
}

/**
 * Parse CAIP-2 network identifier
 * 
 * @param caip2 - CAIP-2 formatted string
 * @returns Network identifier
 */
export function fromCAIP2(caip2: string): SupportedNetwork | null {
  const [namespace, reference] = caip2.split(':');
  
  if (namespace === 'eip155') {
    const chainId = parseInt(reference);
    for (const [network, config] of Object.entries(NETWORKS)) {
      if (config.type === 'evm' && config.chainId === chainId) {
        return network as SupportedNetwork;
      }
    }
  } else if (namespace === 'solana') {
    return reference === 'devnet' ? 'solana-devnet' : 'solana-mainnet';
  }
  
  return null;
}

