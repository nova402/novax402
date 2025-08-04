# Nova402 Utilities - Makefile
#
# Common tasks for building, testing, and deploying Nova402 utilities

.PHONY: help install build test clean lint format docker-build

# Default target
help:
	@echo "Nova402 Utilities - Available Commands:"
	@echo ""
	@echo "  make install        Install all dependencies"
	@echo "  make build          Build all packages"
	@echo "  make test           Run all tests"
	@echo "  make lint           Lint all code"
	@echo "  make format         Format all code"
	@echo "  make clean          Clean build artifacts"
	@echo "  make docker-build   Build Docker images"
	@echo ""
	@echo "Language-specific:"
	@echo "  make ts-build       Build TypeScript packages"
	@echo "  make py-test        Test Python packages"
	@echo "  make rust-bench     Run Rust benchmarks"
	@echo "  make go-build       Build Go packages"
	@echo "  make c-build        Build C library"

# Install all dependencies
install:
	@echo "📦 Installing dependencies..."
	pnpm install
	cd python/nova402 && pip install -e ".[dev]"
	cd rust && cargo build
	cd go && go mod download

# Build all packages
build: ts-build py-build rust-build go-build c-build
	@echo "✅ All packages built"

# TypeScript build
ts-build:
	@echo "🔷 Building TypeScript packages..."
	pnpm build

# Python build
py-build:
	@echo "🐍 Building Python package..."
	cd python/nova402 && pip install -e .

# Rust build
rust-build:
	@echo "🦀 Building Rust crates..."
	cd rust && cargo build --release

# Go build
go-build:
	@echo "🐹 Building Go packages..."
	cd go && go build ./...

# C build
c-build:
	@echo "⚙️  Building C library..."
	mkdir -p c/build
	cd c/build && cmake .. && make

# Run all tests
test: ts-test py-test rust-test go-test c-test
	@echo "✅ All tests passed"

# TypeScript tests
ts-test:
	@echo "🔷 Testing TypeScript packages..."
	pnpm test

# Python tests
py-test:
	@echo "🐍 Testing Python package..."
	cd python/nova402 && pytest

# Rust tests
rust-test:
	@echo "🦀 Testing Rust crates..."
	cd rust && cargo test --all

# Go tests
go-test:
	@echo "🐹 Testing Go packages..."
	cd go && go test ./...

# C tests
c-test:
	@echo "⚙️  Testing C library..."
	cd c/build && ctest

# Run Rust benchmarks
rust-bench:
	@echo "🦀 Running Rust benchmarks..."
	cd rust/nova402-core && cargo bench

# Lint all code
lint:
	@echo "🔍 Linting code..."
	pnpm lint
	cd python/nova402 && ruff check src/nova402
	cd rust && cargo clippy --all
	cd go && golangci-lint run

# Format all code
format:
	@echo "✨ Formatting code..."
	pnpm format
	cd python/nova402 && black src/nova402
	cd rust && cargo fmt --all
	cd go && go fmt ./...

# Clean build artifacts
clean:
	@echo "🧹 Cleaning build artifacts..."
	pnpm clean
	cd python/nova402 && rm -rf build dist *.egg-info
	cd rust && cargo clean
	cd go && go clean
	cd c && rm -rf build
	find . -type d -name "node_modules" -exec rm -rf {} +
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type d -name "target" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete

# Docker build
docker-build:
	@echo "🐳 Building Docker images..."
	docker build -t nova402/typescript -f docker/Dockerfile.typescript .
	docker build -t nova402/python -f docker/Dockerfile.python .

# Watch mode for development
watch:
	pnpm dev

# Type checking
typecheck:
	@echo "📝 Type checking..."
	pnpm typecheck
	cd python/nova402 && mypy src/nova402

# Security audit
audit:
	@echo "🔒 Running security audit..."
	pnpm audit
	cd python/nova402 && safety check
	cd rust && cargo audit
	cd go && govulncheck ./...

# Release (for maintainers)
release:
	@echo "🚀 Creating release..."
	pnpm changeset version
	pnpm install
	pnpm build
	git add .
	git commit -m "chore: version packages"
	pnpm changeset publish

# Development server (TypeScript example)
dev-server:
	cd examples/typescript/express-server && pnpm dev

# Show repository statistics
stats:
	@echo "📊 Repository Statistics:"
	@echo ""
	@echo "Lines of Code:"
	@cloc typescript python rust go c --exclude-dir=node_modules,target,build,dist || echo "Install cloc for detailed stats"
	@echo ""
	@echo "Packages:"
	@find . -name "package.json" -not -path "*/node_modules/*" | wc -l | xargs echo "  TypeScript:"
	@find . -name "setup.py" -or -name "pyproject.toml" | wc -l | xargs echo "  Python:"
	@find . -name "Cargo.toml" | wc -l | xargs echo "  Rust:"
	@find . -name "go.mod" | wc -l | xargs echo "  Go:"

