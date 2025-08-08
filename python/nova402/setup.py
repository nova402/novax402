from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="nova402",
    version="1.0.0",
    author="Nova402 Team",
    author_email="dev@nova402.com",
    description="Python SDK for Nova402 x402 payment protocol",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/nova402/nova-utils",
    project_urls={
        "Bug Tracker": "https://github.com/nova402/nova-utils/issues",
        "Documentation": "https://docs.nova402.com",
        "Source Code": "https://github.com/nova402/nova-utils",
    },
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "Topic :: Software Development :: Libraries :: Python Modules",
        "License :: OSI Approved :: Apache Software License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
    ],
    python_requires=">=3.8",
    install_requires=[
        "web3>=6.11.0",
        "eth-account>=0.10.0",
        "eth-utils>=2.3.0",
        "eth-abi>=4.2.0",
        "cryptography>=41.0.0",
        "requests>=2.31.0",
        "pydantic>=2.5.0",
    ],
    extras_require={
        "dev": [
            "pytest>=7.4.0",
            "pytest-asyncio>=0.21.0",
            "pytest-cov>=4.1.0",
            "black>=23.0.0",
            "mypy>=1.7.0",
            "ruff>=0.1.0",
        ],
        "server": [
            "fastapi>=0.104.0",
            "flask>=3.0.0",
            "uvicorn>=0.24.0",
        ],
    },
    keywords=[
        "x402",
        "http-402",
        "payments",
        "blockchain",
        "base",
        "solana",
        "nova402",
        "micropayments",
        "api",
        "web3",
    ],
)

