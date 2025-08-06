/**
 * Validation utilities for x402 protocol
 */

import { ethers } from 'ethers';
import {
  PaymentRequirements,
  PaymentHeader,
  PaymentRequirementsSchema,
  PaymentHeaderSchema,
} from './types';

/**
 * Validate Ethereum address format
 * 
 * @param address - Address to validate
 * @returns True if valid
 */
export function validateAddress(address: string): boolean {
  return ethers.isAddress(address);
}

/**
 * Validate chain ID
 * 
 * @param chainId - Chain ID to validate
 * @returns True if valid
 */
export function validateChainId(chainId: number): boolean {
  return chainId > 0 && chainId < Number.MAX_SAFE_INTEGER;
}

/**
 * Validate network identifier (CAIP-2 format)
 * 
 * @param network - Network string to validate
 * @returns True if valid
 */
export function validateNetwork(network: string): boolean {
  const parts = network.split(':');
  if (parts.length !== 2) {
    return false;
  }

  const [namespace, reference] = parts;

  // Namespace must be 3-8 lowercase alphanumeric
  if (namespace.length < 3 || namespace.length > 8) {
    return false;
  }

  if (!/^[a-z0-9]+$/.test(namespace)) {
    return false;
  }

  // Reference must be 1-32 alphanumeric
  if (reference.length === 0 || reference.length > 32) {
    return false;
  }

  return /^[a-zA-Z0-9]+$/.test(reference);
}

/**
 * Validate payment scheme
 * 
 * @param scheme - Scheme to validate
 * @returns True if valid
 */
export function validateScheme(scheme: string): boolean {
  return ['exact', 'upto', 'subscription'].includes(scheme);
}

/**
 * Validate payment amount
 * 
 * @param amount - Amount string to validate
 * @returns True if valid positive number
 */
export function validateAmount(amount: string): boolean {
  try {
    const value = BigInt(amount);
    return value > 0n;
  } catch {
    return false;
  }
}

/**
 * Validate payment requirements using Zod schema
 * 
 * @param requirements - Requirements to validate
 * @returns Validation result
 */
export function validatePaymentRequirements(
  requirements: unknown
): { valid: boolean; errors?: string[] } {
  const result = PaymentRequirementsSchema.safeParse(requirements);
  
  if (result.success) {
    return { valid: true };
  }
  
  return {
    valid: false,
    errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`),
  };
}

/**
 * Validate payment header using Zod schema
 * 
 * @param header - Header to validate
 * @returns Validation result
 */
export function validatePaymentHeader(
  header: unknown
): { valid: boolean; errors?: string[] } {
  const result = PaymentHeaderSchema.safeParse(header);
  
  if (result.success) {
    return { valid: true };
  }
  
  return {
    valid: false,
    errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`),
  };
}

/**
 * Validate payment data completeness
 * 
 * @param payment - Payment header
 * @param requirements - Payment requirements
 * @returns Validation result with details
 */
export function validatePaymentData(
  payment: PaymentHeader,
  requirements: PaymentRequirements
): { valid: boolean; reason?: string } {
  // Check version match
  if (payment.x402Version !== requirements.x402Version) {
    return { valid: false, reason: 'Version mismatch' };
  }

  // Check scheme match
  if (payment.scheme !== requirements.scheme) {
    return { valid: false, reason: 'Scheme mismatch' };
  }

  // Check network match
  if (payment.network !== requirements.network) {
    return { valid: false, reason: 'Network mismatch' };
  }

  // Scheme-specific validation
  if (payment.scheme === 'exact' || payment.scheme === 'upto') {
    if (!payment.payload.authorization && !payment.payload.transaction) {
      return { valid: false, reason: 'Missing payment authorization or transaction' };
    }
  }

  return { valid: true };
}

/**
 * Check if payment is expired
 * 
 * @param validBefore - Validity deadline timestamp
 * @returns True if expired
 */
export function isPaymentExpired(validBefore: number): boolean {
  const now = Math.floor(Date.now() / 1000);
  return now > validBefore;
}

/**
 * Check if payment is valid in current time window
 * 
 * @param validAfter - Validity start timestamp
 * @param validBefore - Validity end timestamp
 * @returns True if currently valid
 */
export function isPaymentValidNow(validAfter: number, validBefore: number): boolean {
  const now = Math.floor(Date.now() / 1000);
  return now >= validAfter && now <= validBefore;
}

