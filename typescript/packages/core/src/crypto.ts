/**
 * Cryptographic utilities for x402 protocol
 */

import { createHash, randomBytes } from 'crypto';
import { ethers } from 'ethers';

/**
 * Hash data using SHA-256
 * 
 * @param data - Data to hash
 * @returns Hex-encoded hash
 */
export function hashData(data: string | Buffer): string {
  return createHash('sha256').update(data).digest('hex');
}

/**
 * Hash data using Keccak-256 (Ethereum compatible)
 * 
 * @param data - Data to hash
 * @returns Hex-encoded hash with 0x prefix
 */
export function keccak256(data: string | Buffer): string {
  return ethers.keccak256(
    typeof data === 'string' ? ethers.toUtf8Bytes(data) : data
  );
}

/**
 * Generate a cryptographically secure random hex string
 * 
 * @param length - Number of bytes (default: 32)
 * @returns Hex-encoded random string
 */
export function generateNonce(length: number = 32): string {
  return randomBytes(length).toString('hex');
}

/**
 * Sign data with EVM private key
 * 
 * @param data - Data to sign
 * @param privateKey - Private key (hex string with or without 0x prefix)
 * @returns Signature object
 */
export async function signEVM(
  data: string,
  privateKey: string
): Promise<{
  signature: string;
  publicKey: string;
  timestamp: number;
}> {
  const wallet = new ethers.Wallet(privateKey);
  const signature = await wallet.signMessage(data);

  return {
    signature,
    publicKey: wallet.address,
    timestamp: Date.now(),
  };
}

/**
 * Verify EVM signature
 * 
 * @param data - Original data
 * @param signature - Signature to verify
 * @param expectedAddress - Expected signer address
 * @returns True if signature is valid
 */
export function verifyEVMSignature(
  data: string,
  signature: string,
  expectedAddress: string
): boolean {
  try {
    const recoveredAddress = ethers.verifyMessage(data, signature);
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
  } catch (error) {
    return false;
  }
}

/**
 * Create EIP-712 typed data hash
 * 
 * @param domain - EIP-712 domain
 * @param types - Type definitions
 * @param value - Data to hash
 * @returns Hash string
 */
export function createEIP712Hash(
  domain: any,
  types: any,
  value: any
): string {
  return ethers.TypedDataEncoder.hash(domain, types, value);
}

/**
 * Sign EIP-712 typed data
 * 
 * @param domain - EIP-712 domain
 * @param types - Type definitions
 * @param value - Data to sign
 * @param privateKey - Private key
 * @returns Signature string
 */
export async function signEIP712(
  domain: any,
  types: any,
  value: any,
  privateKey: string
): Promise<string> {
  const wallet = new ethers.Wallet(privateKey);
  return await wallet.signTypedData(domain, types, value);
}

/**
 * Verify EIP-712 signature
 * 
 * @param domain - EIP-712 domain
 * @param types - Type definitions
 * @param value - Original data
 * @param signature - Signature to verify
 * @param expectedAddress - Expected signer address
 * @returns True if signature is valid
 */
export function verifyEIP712Signature(
  domain: any,
  types: any,
  value: any,
  signature: string,
  expectedAddress: string
): boolean {
  try {
    const recoveredAddress = ethers.verifyTypedData(domain, types, value, signature);
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
  } catch (error) {
    return false;
  }
}

/**
 * Generate HMAC signature
 * 
 * @param data - Data to sign
 * @param secret - Secret key
 * @returns Hex-encoded HMAC
 */
export function generateHMAC(data: string, secret: string): string {
  const hmac = createHash('sha256');
  hmac.update(data + secret);
  return hmac.digest('hex');
}

/**
 * Verify HMAC signature
 * 
 * @param data - Original data
 * @param signature - HMAC to verify
 * @param secret - Secret key
 * @returns True if HMAC is valid
 */
export function verifyHMAC(data: string, signature: string, secret: string): boolean {
  const expectedSignature = generateHMAC(data, secret);
  return signature === expectedSignature;
}

