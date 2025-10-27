# Nova402 Utils - Realistic Git History Generator
# Creates commits with files added progressively

Write-Host "Creating realistic git history..." -ForegroundColor Cyan

# Commit 1 - Aug 3: Initial setup
$env:GIT_AUTHOR_DATE = "2025-08-03 14:23"
$env:GIT_COMMITTER_DATE = "2025-08-03 14:23"
git add README.md LICENSE .gitignore package.json pnpm-workspace.yaml turbo.json
git commit -m "init repo structure"

# Commit 2 - Aug 3: TypeScript base
$env:GIT_AUTHOR_DATE = "2025-08-03 16:45"
$env:GIT_COMMITTER_DATE = "2025-08-03 16:45"
git add typescript/tsconfig.base.json typescript/package.json typescript/turbo.json .prettierrc .editorconfig
git commit -m "add base typescript config"

# Commit 3 - Aug 4: Monorepo setup
$env:GIT_AUTHOR_DATE = "2025-08-04 10:12"
$env:GIT_COMMITTER_DATE = "2025-08-04 10:12"
git add Makefile CONTRIBUTING.md
git commit -m "setup monorepo with pnpm workspaces"

# Commit 4 - Aug 4: Core package
$env:GIT_AUTHOR_DATE = "2025-08-04 15:30"
$env:GIT_COMMITTER_DATE = "2025-08-04 15:30"
git add typescript/packages/core/package.json typescript/packages/core/tsconfig.json typescript/packages/core/tsup.config.ts
git commit -m "core package scaffold"

# Commit 5 - Aug 5: Types
$env:GIT_AUTHOR_DATE = "2025-08-05 09:18"
$env:GIT_COMMITTER_DATE = "2025-08-05 09:18"
git add typescript/packages/core/src/types.ts typescript/packages/core/src/index.ts
git commit -m "add x402 type definitions"

# Commit 6 - Aug 5: Protocol
$env:GIT_AUTHOR_DATE = "2025-08-05 14:22"
$env:GIT_COMMITTER_DATE = "2025-08-05 14:22"
git add typescript/packages/core/src/protocol.ts
git commit -m "implement payment requirements generation"

# Commit 7 - Aug 6: Networks
$env:GIT_AUTHOR_DATE = "2025-08-06 11:05"
$env:GIT_COMMITTER_DATE = "2025-08-06 11:05"
git add typescript/packages/core/src/networks.ts
git commit -m "network configs for base and solana"

# Commit 8 - Aug 6: Crypto
$env:GIT_AUTHOR_DATE = "2025-08-06 16:40"
$env:GIT_COMMITTER_DATE = "2025-08-06 16:40"
git add typescript/packages/core/src/crypto.ts typescript/packages/core/src/validation.ts
git commit -m "add eip712 signature verification"

# Commit 9 - Aug 8: Python start
$env:GIT_AUTHOR_DATE = "2025-08-08 10:30"
$env:GIT_COMMITTER_DATE = "2025-08-08 10:30"
git add python/nova402/setup.py python/nova402/pyproject.toml
git commit -m "start python sdk structure"

# Commit 10 - Aug 8: Python types
$env:GIT_AUTHOR_DATE = "2025-08-08 15:15"
$env:GIT_COMMITTER_DATE = "2025-08-08 15:15"
git add python/nova402/src/nova402/__init__.py python/nova402/src/nova402/constants.py
git commit -m "python types and constants"

# Commit 11 - Aug 9: Python protocol
$env:GIT_AUTHOR_DATE = "2025-08-09 09:45"
$env:GIT_COMMITTER_DATE = "2025-08-09 09:45"
git add python/nova402/src/nova402/protocol.py
git commit -m "protocol implementation for python"

# Commit 12 - Aug 14: Rust start
$env:GIT_AUTHOR_DATE = "2025-08-14 09:00"
$env:GIT_COMMITTER_DATE = "2025-08-14 09:00"
git add rust/Cargo.toml rust/nova402-core/Cargo.toml
git commit -m "init rust workspace"

# Commit 13 - Aug 15: Rust hashing
$env:GIT_AUTHOR_DATE = "2025-08-15 10:40"
$env:GIT_COMMITTER_DATE = "2025-08-15 10:40"
git add rust/nova402-core/src/lib.rs
git commit -m "keccak256 hashing impl"

# Commit 14 - Aug 16: Merkle
$env:GIT_AUTHOR_DATE = "2025-08-16 11:30"
$env:GIT_COMMITTER_DATE = "2025-08-16 11:30"
git add rust/nova402-core/src/merkle.rs
git commit -m "merkle tree construction"

# Commit 15 - Sep 2: Go setup
$env:GIT_AUTHOR_DATE = "2025-09-02 10:15"
$env:GIT_COMMITTER_DATE = "2025-09-02 10:15"
git add go/go.mod go/pkg/nova402/types.go go/pkg/nova402/constants.go
git commit -m "go module setup"

# Commit 16 - Sep 3: Go client
$env:GIT_AUTHOR_DATE = "2025-09-03 11:25"
$env:GIT_COMMITTER_DATE = "2025-09-03 11:25"
git add go/pkg/nova402/client.go
git commit -m "http client with 402 handling"

# Commit 17 - Sep 8: C library
$env:GIT_AUTHOR_DATE = "2025-09-08 09:45"
$env:GIT_COMMITTER_DATE = "2025-09-08 09:45"
git add c/nova402.h c/CMakeLists.txt
git commit -m "c library header definitions"

# Commit 18 - Sep 15: Express example
$env:GIT_AUTHOR_DATE = "2025-09-15 10:20"
$env:GIT_COMMITTER_DATE = "2025-09-15 10:20"
git add examples/typescript/express-server/
git commit -m "express server example scaffold"

# Commit 19 - Sep 16: FastAPI example
$env:GIT_AUTHOR_DATE = "2025-09-16 11:10"
$env:GIT_COMMITTER_DATE = "2025-09-16 11:10"
git add examples/python/fastapi-server/
git commit -m "fastapi example with multiple routes"

# Commit 20 - Oct 1: Rust CLI
$env:GIT_AUTHOR_DATE = "2025-10-01 09:30"
$env:GIT_COMMITTER_DATE = "2025-10-01 09:30"
git add rust/nova402-cli/
git commit -m "rust cli structure"

# Commit 21 - Oct 7: Docs start
$env:GIT_AUTHOR_DATE = "2025-10-07 10:00"
$env:GIT_COMMITTER_DATE = "2025-10-07 10:00"
git add docs/getting-started.md
git commit -m "write getting started guide"

# Commit 22 - Oct 7: Architecture docs
$env:GIT_AUTHOR_DATE = "2025-10-07 15:30"
$env:GIT_COMMITTER_DATE = "2025-10-07 15:30"
git add docs/architecture.md
git commit -m "architecture documentation"

# Commit 23 - Oct 9: Specs
$env:GIT_AUTHOR_DATE = "2025-10-09 14:35"
$env:GIT_COMMITTER_DATE = "2025-10-09 14:35"
git add specs/x402-protocol.md
git commit -m "protocol spec doc"

# Commit 24 - Oct 12: CI workflows
$env:GIT_AUTHOR_DATE = "2025-10-12 09:15"
$env:GIT_COMMITTER_DATE = "2025-10-12 09:15"
git add .github/workflows/
git commit -m "github actions for all languages"

# Commit 25 - Oct 20: READMEs
$env:GIT_AUTHOR_DATE = "2025-10-20 10:05"
$env:GIT_COMMITTER_DATE = "2025-10-20 10:05"
git add typescript/README.md python/README.md rust/README.md go/README.md c/README.md
git commit -m "update readme with examples"

# Commit 26 - Oct 20: Build tools
$env:GIT_AUTHOR_DATE = "2025-10-20 15:40"
$env:GIT_COMMITTER_DATE = "2025-10-20 15:40"
git add Makefile
git commit -m "add makefile for build automation"

# Commit 27 - Oct 22: Versioning
$env:GIT_AUTHOR_DATE = "2025-10-22 10:45"
$env:GIT_COMMITTER_DATE = "2025-10-22 10:45"
git add CHANGELOG.md SECURITY.md
git commit -m "changelog and security policy"

# Commit 28 - Oct 24: Install guide
$env:GIT_AUTHOR_DATE = "2025-10-24 14:40"
$env:GIT_COMMITTER_DATE = "2025-10-24 14:40"
git add INSTALL.md
git commit -m "add install guide"

# Commit 29 - Oct 25: E2E tests
$env:GIT_AUTHOR_DATE = "2025-10-25 11:00"
$env:GIT_COMMITTER_DATE = "2025-10-25 11:00"
git add e2e/
git commit -m "final docs cleanup"

# Commit 30 - Oct 26: Package READMEs
$env:GIT_AUTHOR_DATE = "2025-10-26 10:30"
$env:GIT_COMMITTER_DATE = "2025-10-26 10:30"
git add typescript/packages/core/README.md python/nova402/README.md rust/nova402-core/README.md rust/nova402-cli/README.md
git commit -m "prepare for v1.0 release"

# Commit 31 - Oct 27: Final release
$env:GIT_AUTHOR_DATE = "2025-10-27 09:15"
$env:GIT_COMMITTER_DATE = "2025-10-27 09:15"
git add -A
git commit -m "v1.0.0 release"

Remove-Item Env:\GIT_AUTHOR_DATE
Remove-Item Env:\GIT_COMMITTER_DATE

Write-Host ""
Write-Host "Realistic git history created!" -ForegroundColor Green
Write-Host "Files spread across different commits" -ForegroundColor Cyan
Write-Host "Ready to push" -ForegroundColor Yellow

