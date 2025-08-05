/**
 * Core x402 protocol functions
 */

import { ethers } from 'ethers';
import {
  PaymentRequirements,
  PaymentHeader,
  Payment402Response,
  PaymentConfig,
  ValidityWindow,
  X402_VERSION,
  DEFAULT_TIMEOUT,
  DEFAULT_VALIDITY_BUFFER,
} from './index';

/**
 * Create payment requirements for a resource
 * 
 * @param config - Payment configuration
 * @returns Payment requirements object
 * 
 * @example
 * ```typescript
 * const requirements = createPaymentRequirements({
 *   price: '100000', // 0.1 USDC (6 decimals)
 *   asset: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
 *   network: 'eip155:8453',
 *   payTo: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
 *   resource: '/api/ai/generate',
 *   description: 'AI content generation'
 * });
 * ```
 */
export function createPaymentRequirements(
  config: PaymentConfig
): PaymentRequirements {
  return {
    x402Version: X402_VERSION,
    scheme: config.scheme || 'exact',
    network: config.network,
    maxAmountRequired: config.price,
    resource: config.resource,
    description: config.description,
    mimeType: config.mimeType || 'application/json',
    payTo: config.payTo,
    maxTimeoutSeconds: config.timeout || DEFAULT_TIMEOUT,
    asset: config.asset,
    extra: config.extra || null,
  };
}

/**
 * Parse x402 payment header from base64-encoded JSON
 * 
 * @param headerValue - Base64-encoded payment header
 * @returns Parsed payment header or null if invalid
 */
export function parsePaymentHeader(headerValue: string): PaymentHeader | null {
  try {
    const decoded = Buffer.from(headerValue, 'base64').toString('utf-8');
    return JSON.parse(decoded) as PaymentHeader;
  } catch (error) {
    return null;
  }
}

/**
 * Encode payment header to base64
 * 
 * @param payment - Payment header object
 * @returns Base64-encoded string
 */
export function encodePaymentHeader(payment: PaymentHeader): string {
  const json = JSON.stringify(payment);
  return Buffer.from(json).toString('base64');
}

/**
 * Create 402 Payment Required response
 * 
 * @param requirements - Payment requirements (single or array)
 * @param error - Optional error message
 * @returns 402 response object
 */
export function create402Response(
  requirements: PaymentRequirements | PaymentRequirements[],
  error?: string
): Payment402Response {
  return {
    x402Version: X402_VERSION,
    accepts: Array.isArray(requirements) ? requirements : [requirements],
    ...(error && { error }),
  };
}

/**
 * Generate a cryptographically secure nonce
 * 
 * @returns Hex-encoded nonce (32 bytes)
 */
export function generateNonce(): string {
  return ethers.hexlify(ethers.randomBytes(32));
}

/**
 * Calculate validity window for a payment
 * 
 * @param durationSeconds - Duration in seconds (default: 300)
 * @returns Validity window with validAfter and validBefore timestamps
 */
export function getValidityWindow(durationSeconds: number = DEFAULT_TIMEOUT): ValidityWindow {
  const now = Math.floor(Date.now() / 1000);
  return {
    validAfter: now - DEFAULT_VALIDITY_BUFFER,
    validBefore: now + durationSeconds,
  };
}

/**
 * Format payment amount for display
 * 
 * @param amount - Amount in smallest unit (e.g., wei, lamports)
 * @param decimals - Token decimals (default: 6 for USDC)
 * @returns Formatted amount as string
 */
export function formatPaymentAmount(
  amount: string,
  decimals: number = 6
): string {
  return ethers.formatUnits(amount, decimals);
}

/**
 * Parse payment amount from user input
 * 
 * @param amount - Amount as decimal string
 * @param decimals - Token decimals (default: 6 for USDC)
 * @returns Amount in smallest unit
 */
export function parsePaymentAmount(
  amount: string,
  decimals: number = 6
): string {
  return ethers.parseUnits(amount, decimals).toString();
}

/**
 * Verify EVM payment signature and data
 * 
 * @param payment - Payment header
 * @param requirements - Payment requirements
 * @returns Verification result
 */
export function verifyEVMPayment(
  payment: PaymentHeader,
  requirements: PaymentRequirements
): { valid: boolean; reason?: string } {
  try {
    const { payload } = payment;

    if (!payload.authorization) {
      return { valid: false, reason: 'Missing authorization' };
    }

    const auth = payload.authorization;

    // Verify network match
    if (payment.network !== requirements.network) {
      return { valid: false, reason: 'Network mismatch' };
    }

    // Verify amount
    if (BigInt(auth.value) < BigInt(requirements.maxAmountRequired)) {
      return { valid: false, reason: 'Insufficient amount' };
    }

    // Verify recipient
    if (auth.to.toLowerCase() !== requirements.payTo.toLowerCase()) {
      return { valid: false, reason: 'Invalid recipient' };
    }

    // Verify time validity
    const now = Math.floor(Date.now() / 1000);
    if (now < auth.validAfter || now > auth.validBefore) {
      return { valid: false, reason: 'Payment expired' };
    }

    // Verify EIP-712 signature
    const chainId = parseInt(payment.network.split(':')[1]);
    const domain = {
      name: requirements.extra?.name || 'USD Coin',
      version: requirements.extra?.version || '2',
      chainId,
      verifyingContract: requirements.asset,
    };

    const types = {
      TransferWithAuthorization: [
        { name: 'from', type: 'address' },
        { name: 'to', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'validAfter', type: 'uint256' },
        { name: 'validBefore', type: 'uint256' },
        { name: 'nonce', type: 'bytes32' },
      ],
    };

    const value = {
      from: auth.from,
      to: auth.to,
      value: auth.value,
      validAfter: auth.validAfter,
      validBefore: auth.validBefore,
      nonce: auth.nonce,
    };

    const recoveredAddress = ethers.verifyTypedData(
      domain,
      types,
      value,
      ethers.Signature.from({ v: auth.v, r: auth.r, s: auth.s })
    );

    if (recoveredAddress.toLowerCase() !== auth.from.toLowerCase()) {
      return { valid: false, reason: 'Invalid signature' };
    }

    return { valid: true };
  } catch (error: any) {
    return { valid: false, reason: `Verification error: ${error.message}` };
  }
}

