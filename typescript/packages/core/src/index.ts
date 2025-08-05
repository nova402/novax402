/**
 * @nova402/core - Core x402 protocol implementation
 * 
 * Provides the fundamental building blocks for x402 payment protocol:
 * - Payment requirements generation
 * - Payment payload encoding/decoding
 * - EIP-712 signature verification
 * - Network and scheme validation
 * 
 * @packageDocumentation
 */

export * from './types';
export * from './protocol';
export * from './crypto';
export * from './networks';
export * from './validation';

/**
 * x402 Protocol Version
 */
export const X402_VERSION = 1;

/**
 * Default payment timeout in seconds (5 minutes)
 */
export const DEFAULT_TIMEOUT = 300;

/**
 * Default validity buffer in seconds (1 minute)
 */
export const DEFAULT_VALIDITY_BUFFER = 60;

