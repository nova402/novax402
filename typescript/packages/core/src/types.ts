/**
 * Type definitions for x402 protocol
 * Based on the official x402 specification
 */

import { z } from 'zod';

/**
 * Payment scheme types
 */
export type PaymentScheme = 'exact' | 'upto' | 'subscription';

/**
 * Network identifier in CAIP-2 format
 * @example "eip155:8453" for Base Mainnet
 * @example "solana:mainnet" for Solana
 */
export type NetworkId = string;

/**
 * Payment requirements structure (from x402 spec)
 */
export const PaymentRequirementsSchema = z.object({
  x402Version: z.number(),
  scheme: z.enum(['exact', 'upto', 'subscription']),
  network: z.string(),
  maxAmountRequired: z.string(),
  resource: z.string(),
  description: z.string(),
  mimeType: z.string(),
  payTo: z.string(),
  maxTimeoutSeconds: z.number(),
  asset: z.string(),
  extra: z.record(z.any()).nullable().optional(),
});

export type PaymentRequirements = z.infer<typeof PaymentRequirementsSchema>;

/**
 * EIP-3009 authorization structure for EVM chains
 */
export const EIP3009AuthorizationSchema = z.object({
  from: z.string(),
  to: z.string(),
  value: z.string(),
  validAfter: z.number(),
  validBefore: z.number(),
  nonce: z.string(),
  v: z.number(),
  r: z.string(),
  s: z.string(),
});

export type EIP3009Authorization = z.infer<typeof EIP3009AuthorizationSchema>;

/**
 * Solana transaction payload structure
 */
export const SolanaTransactionSchema = z.object({
  serializedTransaction: z.string(),
  signatures: z.array(z.string()),
});

export type SolanaTransaction = z.infer<typeof SolanaTransactionSchema>;

/**
 * Payment payload structure (scheme-dependent)
 */
export const PaymentPayloadSchema = z.object({
  authorization: EIP3009AuthorizationSchema.optional(),
  transaction: SolanaTransactionSchema.optional(),
  signatures: z.array(z.string()).optional(),
});

export type PaymentPayload = z.infer<typeof PaymentPayloadSchema>;

/**
 * Payment header structure (X-PAYMENT header)
 */
export const PaymentHeaderSchema = z.object({
  x402Version: z.number(),
  scheme: z.enum(['exact', 'upto', 'subscription']),
  network: z.string(),
  payload: PaymentPayloadSchema,
});

export type PaymentHeader = z.infer<typeof PaymentHeaderSchema>;

/**
 * 402 Payment Required response
 */
export const Payment402ResponseSchema = z.object({
  x402Version: z.number(),
  accepts: z.array(PaymentRequirementsSchema),
  error: z.string().optional(),
});

export type Payment402Response = z.infer<typeof Payment402ResponseSchema>;

/**
 * Payment verification result
 */
export interface VerificationResult {
  valid: boolean;
  reason?: string;
  details?: {
    from?: string;
    to?: string;
    amount?: string;
    [key: string]: any;
  };
}

/**
 * Payment settlement result
 */
export interface SettlementResult {
  success: boolean;
  txHash?: string;
  networkId?: string;
  blockNumber?: number;
  error?: string;
}

/**
 * Network configuration
 */
export interface NetworkConfig {
  chainId: number | string;
  name: string;
  type: 'evm' | 'solana';
  rpcUrl: string;
  currency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  explorer?: string;
}

/**
 * Supported networks
 */
export type SupportedNetwork =
  | 'base-mainnet'
  | 'base-sepolia'
  | 'solana-mainnet'
  | 'solana-devnet'
  | 'polygon'
  | 'bsc'
  | 'sei'
  | 'peaq';

/**
 * Payment configuration for creating requirements
 */
export interface PaymentConfig {
  price: string;
  asset: string;
  network: NetworkId;
  payTo: string;
  resource: string;
  description: string;
  scheme?: PaymentScheme;
  mimeType?: string;
  timeout?: number;
  extra?: Record<string, any>;
}

/**
 * Validity window for payments
 */
export interface ValidityWindow {
  validAfter: number;
  validBefore: number;
}

/**
 * Payment metadata
 */
export interface PaymentMetadata {
  timestamp: number;
  nonce: string;
  scheme: PaymentScheme;
  network: NetworkId;
  amount: string;
}

