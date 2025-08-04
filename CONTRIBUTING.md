# Contributing to Nova402 Utilities

Thank you for your interest in contributing to Nova402! This document provides guidelines and instructions for contributing.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please be respectful and constructive in all interactions.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/nova402/nova-utils/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node version, etc.)
   - Code samples if applicable

### Suggesting Features

1. Check [existing feature requests](https://github.com/nova402/nova-utils/issues?q=is%3Aissue+label%3Aenhancement)
2. Create a new issue with:
   - Clear use case description
   - Expected behavior
   - Potential implementation approach
   - Alternative solutions considered

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Update documentation
7. Commit with clear messages
8. Push to your fork
9. Open a Pull Request

## Development Setup

### Prerequisites

- Node.js 18+
- Python 3.8+
- Rust 1.75+
- Go 1.21+
- pnpm 9+

### Getting Started

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/nova-utils.git
cd nova-utils

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test
```

### Language-Specific Setup

#### TypeScript

```bash
cd typescript
pnpm install
pnpm build
pnpm test
```

#### Python

```bash
cd python/nova402
pip install -e ".[dev]"
pytest
```

#### Rust

```bash
cd rust/nova402-core
cargo build
cargo test
```

#### Go

```bash
cd go
go mod download
go test ./...
```

## Code Style

### TypeScript

- Follow [TypeScript style guide](https://google.github.io/styleguide/tsguide.html)
- Use Prettier for formatting
- Use ESLint for linting
- Maximum line length: 100 characters

```bash
pnpm format   # Format code
pnpm lint     # Lint code
```

### Python

- Follow [PEP 8](https://pep8.org/)
- Use Black for formatting
- Use Ruff for linting
- Type hints required
- Maximum line length: 100 characters

```bash
black src/nova402
ruff check src/nova402
mypy src/nova402
```

### Rust

- Follow [Rust style guide](https://doc.rust-lang.org/nightly/style-guide/)
- Use `rustfmt` for formatting
- Use `clippy` for linting

```bash
cargo fmt
cargo clippy
```

### Go

- Follow [Effective Go](https://golang.org/doc/effective_go.html)
- Use `gofmt` for formatting
- Use `golangci-lint` for linting

```bash
go fmt ./...
golangci-lint run
```

## Testing Requirements

### Unit Tests

All new code must include unit tests:

- **TypeScript**: Use Vitest
- **Python**: Use pytest
- **Rust**: Use built-in test framework
- **Go**: Use Go testing package

### Integration Tests

For complex features, add integration tests in the `e2e/` directory.

### Test Coverage

- Aim for >80% code coverage
- Critical paths (crypto, payment verification) require >95% coverage

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add Solana payment support
fix: correct EIP-712 signature verification
docs: update API reference
test: add unit tests for payment validation
refactor: simplify network configuration
chore: update dependencies
```

## Documentation

### Code Documentation

- **TypeScript**: Use TSDoc comments
- **Python**: Use docstrings (Google style)
- **Rust**: Use rustdoc comments
- **Go**: Use godoc comments

### README Updates

Update relevant README files when adding features or changing APIs.

### API Documentation

Update `docs/api-reference.md` for public API changes.

## Release Process

We use semantic versioning (MAJOR.MINOR.PATCH):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backwards compatible)
- **PATCH**: Bug fixes

Releases are managed by maintainers using Changesets.

## Project Structure

```
nova-utils/
├── typescript/          # TypeScript packages
│   ├── packages/       # Published packages
│   └── examples/       # Example applications
├── python/             # Python SDK
│   ├── nova402/       # Core package
│   └── examples/      # Python examples
├── rust/               # Rust utilities
│   ├── nova402-core/  # Core library
│   └── nova402-cli/   # CLI tools
├── go/                 # Go SDK
│   ├── pkg/           # Go packages
│   └── cmd/           # Command-line tools
├── specs/              # Protocol specifications
├── e2e/                # End-to-end tests
└── docs/               # Documentation
```

## Getting Help

- **Discord**: [Join our Discord](https://discord.gg/nova402)
- **GitHub Discussions**: [Ask questions](https://github.com/nova402/nova-utils/discussions)
- **Email**: dev@nova402.com

## Recognition

Contributors will be:

- Listed in README.md
- Mentioned in release notes
- Invited to contributor Discord channel

## License

By contributing, you agree that your contributions will be licensed under Apache-2.0.

---

**Thank you for contributing to Nova402!** 🚀

