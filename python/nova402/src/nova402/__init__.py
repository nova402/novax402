"""
Nova402 Python SDK
==================

Python implementation of the x402 payment protocol for Nova402 ecosystem.

Basic usage:

Server-side (FastAPI):
    >>> from nova402 import x402_required
    >>> @app.get("/api/data")
    >>> @x402_required(price="0.05", network="base-mainnet")
    >>> def get_data():
    >>>     return {"data": "premium content"}

Client-side:
    >>> from nova402 import X402Client
    >>> client = X402Client(network="base-mainnet", private_key="0x...")
    >>> response = client.get("https://api.example.com/data")
"""

from .client import X402Client, PaymentSession
from .protocol import (
    create_payment_requirements,
    verify_evm_payment,
    settle_payment,
)
from .types import (
    PaymentRequirements,
    PaymentHeader,
    Payment402Response,
    EIP3009Authorization,
    VerificationResult,
    SettlementResult,
    NetworkConfig,
)
from .errors import (
    Nova402Error,
    PaymentRequiredError,
    InvalidPaymentError,
    NetworkMismatchError,
    InsufficientAmountError,
    ExpiredPaymentError,
    InvalidSignatureError,
    SettlementFailedError,
)
from .constants import (
    X402_VERSION,
    NETWORKS,
    USDC_ADDRESSES,
    SUPPORTED_SCHEMES,
)
from .crypto import (
    sign_eip712,
    verify_eip712_signature,
    keccak256,
    generate_nonce,
)
from .validation import (
    validate_address,
    validate_chain_id,
    validate_network,
    validate_payment_data,
)

# Server integrations
try:
    from .integrations.fastapi import x402_required, X402Middleware
except ImportError:
    pass  # FastAPI not installed

__version__ = "1.0.0"
__author__ = "Nova402 Team"
__email__ = "dev@nova402.com"

__all__ = [
    # Client
    "X402Client",
    "PaymentSession",
    # Protocol
    "create_payment_requirements",
    "verify_evm_payment",
    "settle_payment",
    # Types
    "PaymentRequirements",
    "PaymentHeader",
    "Payment402Response",
    "EIP3009Authorization",
    "VerificationResult",
    "SettlementResult",
    "NetworkConfig",
    # Errors
    "Nova402Error",
    "PaymentRequiredError",
    "InvalidPaymentError",
    "NetworkMismatchError",
    "InsufficientAmountError",
    "ExpiredPaymentError",
    "InvalidSignatureError",
    "SettlementFailedError",
    # Constants
    "X402_VERSION",
    "NETWORKS",
    "USDC_ADDRESSES",
    "SUPPORTED_SCHEMES",
    # Crypto
    "sign_eip712",
    "verify_eip712_signature",
    "keccak256",
    "generate_nonce",
    # Validation
    "validate_address",
    "validate_chain_id",
    "validate_network",
    "validate_payment_data",
]

