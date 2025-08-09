"""
Core x402 protocol implementation
"""

import json
import base64
import time
from typing import Dict, Any, Optional
from web3 import Web3
from eth_account.messages import encode_structured_data

from .types import (
    PaymentRequirements,
    PaymentHeader,
    Payment402Response,
    EIP3009Authorization,
    VerificationResult,
    SettlementResult,
)
from .constants import (
    X402_VERSION,
    DEFAULT_TIMEOUT_SECONDS,
    DEFAULT_MIME_TYPE,
)
from .errors import InvalidPaymentError


def create_payment_requirements(
    price: str,
    asset: str,
    network: str,
    pay_to: str,
    resource: str,
    description: str,
    scheme: str = "exact",
    mime_type: str = DEFAULT_MIME_TYPE,
    timeout: int = DEFAULT_TIMEOUT_SECONDS,
    extra: Optional[Dict[str, Any]] = None,
) -> PaymentRequirements:
    """
    Create payment requirements for a resource.
    
    Args:
        price: Payment amount in smallest unit (e.g., "100000" for 0.1 USDC)
        asset: Token contract address
        network: Network identifier (e.g., "base-mainnet")
        pay_to: Recipient wallet address
        resource: Resource URL
        description: Human-readable description
        scheme: Payment scheme (default: "exact")
        mime_type: Response MIME type (default: "application/json")
        timeout: Timeout in seconds (default: 300)
        extra: Additional scheme-specific data
        
    Returns:
        Payment requirements dict
    """
    return {
        "x402Version": X402_VERSION,
        "scheme": scheme,
        "network": network,
        "maxAmountRequired": price,
        "resource": resource,
        "description": description,
        "mimeType": mime_type,
        "payTo": pay_to,
        "maxTimeoutSeconds": timeout,
        "asset": asset,
        "extra": extra,
    }


def parse_payment_header(header_value: str) -> Optional[PaymentHeader]:
    """
    Parse base64-encoded X-PAYMENT header.
    
    Args:
        header_value: Base64-encoded payment header
        
    Returns:
        Parsed payment header or None if invalid
    """
    try:
        decoded = base64.b64decode(header_value).decode("utf-8")
        return json.loads(decoded)
    except Exception:
        return None


def encode_payment_header(payment: PaymentHeader) -> str:
    """
    Encode payment header to base64.
    
    Args:
        payment: Payment header dict
        
    Returns:
        Base64-encoded string
    """
    json_str = json.dumps(payment)
    return base64.b64encode(json_str.encode("utf-8")).decode("utf-8")


def create_402_response(
    requirements: PaymentRequirements | list[PaymentRequirements],
    error: Optional[str] = None,
) -> Payment402Response:
    """
    Create 402 Payment Required response.
    
    Args:
        requirements: Payment requirements (single or list)
        error: Optional error message
        
    Returns:
        402 response dict
    """
    accepts = requirements if isinstance(requirements, list) else [requirements]
    
    response: Payment402Response = {
        "x402Version": X402_VERSION,
        "accepts": accepts,
    }
    
    if error:
        response["error"] = error
    
    return response


def verify_evm_payment(
    payment: PaymentHeader,
    requirements: PaymentRequirements,
) -> VerificationResult:
    """
    Verify EVM payment signature and data.
    
    Args:
        payment: Payment header
        requirements: Payment requirements
        
    Returns:
        Verification result
    """
    try:
        payload = payment["payload"]
        
        if "authorization" not in payload or not payload["authorization"]:
            return {
                "isValid": False,
                "invalidReason": "Missing authorization",
                "details": None,
            }
        
        auth: EIP3009Authorization = payload["authorization"]
        
        # Verify network match
        if payment["network"] != requirements["network"]:
            return {
                "isValid": False,
                "invalidReason": f"Network mismatch: expected {requirements['network']}, got {payment['network']}",
                "details": None,
            }
        
        # Verify amount
        if int(auth["value"]) < int(requirements["maxAmountRequired"]):
            return {
                "isValid": False,
                "invalidReason": "Insufficient amount",
                "details": None,
            }
        
        # Verify recipient
        if auth["to"].lower() != requirements["payTo"].lower():
            return {
                "isValid": False,
                "invalidReason": "Invalid recipient",
                "details": None,
            }
        
        # Verify time validity
        now = int(time.time())
        if not (auth["validAfter"] <= now <= auth["validBefore"]):
            return {
                "isValid": False,
                "invalidReason": "Payment expired or not yet valid",
                "details": None,
            }
        
        # Verify EIP-712 signature
        chain_id = int(payment["network"].split(":")[1])
        domain = {
            "name": requirements.get("extra", {}).get("name", "USD Coin"),
            "version": requirements.get("extra", {}).get("version", "2"),
            "chainId": chain_id,
            "verifyingContract": requirements["asset"],
        }
        
        types = {
            "EIP712Domain": [
                {"name": "name", "type": "string"},
                {"name": "version", "type": "string"},
                {"name": "chainId", "type": "uint256"},
                {"name": "verifyingContract", "type": "address"},
            ],
            "TransferWithAuthorization": [
                {"name": "from", "type": "address"},
                {"name": "to", "type": "address"},
                {"name": "value", "type": "uint256"},
                {"name": "validAfter", "type": "uint256"},
                {"name": "validBefore", "type": "uint256"},
                {"name": "nonce", "type": "bytes32"},
            ],
        }
        
        message = {
            "from": auth["from"],
            "to": auth["to"],
            "value": auth["value"],
            "validAfter": auth["validAfter"],
            "validBefore": auth["validBefore"],
            "nonce": auth["nonce"],
        }
        
        structured_data = {
            "types": types,
            "primaryType": "TransferWithAuthorization",
            "domain": domain,
            "message": message,
        }
        
        signable_message = encode_structured_data(structured_data)
        
        # Reconstruct signature
        from eth_account import Account
        signature = bytes.fromhex(auth["r"][2:]) + bytes.fromhex(auth["s"][2:]) + bytes([auth["v"]])
        
        recovered_address = Account.recover_message(signable_message, signature=signature)
        
        if recovered_address.lower() != auth["from"].lower():
            return {
                "isValid": False,
                "invalidReason": "Invalid signature",
                "details": None,
            }
        
        return {
            "isValid": True,
            "invalidReason": None,
            "details": {
                "from": auth["from"],
                "to": auth["to"],
                "amount": auth["value"],
            },
        }
        
    except Exception as e:
        return {
            "isValid": False,
            "invalidReason": f"Verification error: {str(e)}",
            "details": None,
        }


def settle_payment(
    payment: PaymentHeader,
    requirements: PaymentRequirements,
    facilitator_url: str,
) -> SettlementResult:
    """
    Settle payment via facilitator.
    
    Args:
        payment: Payment header
        requirements: Payment requirements
        facilitator_url: Facilitator API URL
        
    Returns:
        Settlement result
    """
    import requests
    
    try:
        # Encode payment header
        payment_header_encoded = encode_payment_header(payment)
        
        # Call facilitator /settle endpoint
        response = requests.post(
            f"{facilitator_url}/settle",
            json={
                "x402Version": X402_VERSION,
                "paymentHeader": payment_header_encoded,
                "paymentRequirements": requirements,
            },
            timeout=30,
        )
        
        if response.status_code == 200:
            data = response.json()
            return {
                "success": data.get("success", False),
                "txHash": data.get("txHash"),
                "networkId": data.get("networkId"),
                "blockNumber": data.get("blockNumber"),
                "error": data.get("error"),
            }
        else:
            return {
                "success": False,
                "txHash": None,
                "networkId": None,
                "blockNumber": None,
                "error": f"Facilitator returned {response.status_code}",
            }
            
    except Exception as e:
        return {
            "success": False,
            "txHash": None,
            "networkId": None,
            "blockNumber": None,
            "error": str(e),
        }


def generate_nonce() -> str:
    """
    Generate a cryptographically secure nonce.
    
    Returns:
        Hex-encoded nonce (32 bytes)
    """
    import secrets
    return "0x" + secrets.token_hex(32)


def get_validity_window(duration_seconds: int = DEFAULT_TIMEOUT_SECONDS) -> Dict[str, int]:
    """
    Calculate validity window for payment.
    
    Args:
        duration_seconds: Duration in seconds
        
    Returns:
        Dict with validAfter and validBefore timestamps
    """
    now = int(time.time())
    return {
        "validAfter": now - 60,  # 1 minute buffer
        "validBefore": now + duration_seconds,
    }


def format_payment_amount(amount: str, decimals: int = 6) -> str:
    """
    Format payment amount for display.
    
    Args:
        amount: Amount in smallest unit
        decimals: Token decimals (default: 6 for USDC)
        
    Returns:
        Formatted amount as decimal string
    """
    value = int(amount)
    return str(value / (10 ** decimals))


def parse_payment_amount(amount: str, decimals: int = 6) -> str:
    """
    Parse payment amount from user input.
    
    Args:
        amount: Amount as decimal string
        decimals: Token decimals (default: 6 for USDC)
        
    Returns:
        Amount in smallest unit
    """
    value = float(amount)
    return str(int(value * (10 ** decimals)))

