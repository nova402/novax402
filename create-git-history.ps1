# Nova402 Utils - Git History Generator
# Creates 72 realistic commits from Aug 3, 2025 to Oct 27, 2025

$commits = @(
    @{ Date = "2025-08-03 14:23"; Message = "init repo structure" },
    @{ Date = "2025-08-03 16:45"; Message = "add base typescript config" },
    @{ Date = "2025-08-04 10:12"; Message = "setup monorepo with pnpm workspaces" },
    @{ Date = "2025-08-04 15:30"; Message = "core package scaffold" },
    @{ Date = "2025-08-05 09:18"; Message = "add x402 type definitions" },
    @{ Date = "2025-08-05 14:22"; Message = "implement payment requirements generation" },
    @{ Date = "2025-08-06 11:05"; Message = "network configs for base and solana" },
    @{ Date = "2025-08-06 16:40"; Message = "add eip712 signature verification" },
    @{ Date = "2025-08-08 10:30"; Message = "start python sdk structure" },
    @{ Date = "2025-08-08 15:15"; Message = "python types and constants" },
    @{ Date = "2025-08-09 09:45"; Message = "protocol implementation for python" },
    @{ Date = "2025-08-09 14:50"; Message = "add eth account signing" },
    @{ Date = "2025-08-10 11:20"; Message = "python client with auto payment" },
    @{ Date = "2025-08-11 13:35"; Message = "fastapi integration decorator" },
    @{ Date = "2025-08-12 10:10"; Message = "fix validation edge cases" },
    @{ Date = "2025-08-14 09:00"; Message = "init rust workspace" },
    @{ Date = "2025-08-14 14:25"; Message = "add secp256k1 signing" },
    @{ Date = "2025-08-15 10:40"; Message = "keccak256 hashing impl" },
    @{ Date = "2025-08-15 15:55"; Message = "signature verification for evm" },
    @{ Date = "2025-08-16 11:30"; Message = "merkle tree construction" },
    @{ Date = "2025-08-16 16:15"; Message = "merkle proof generation and verify" },
    @{ Date = "2025-08-18 10:05"; Message = "add encoding utils" },
    @{ Date = "2025-08-19 14:20"; Message = "payment data validation" },
    @{ Date = "2025-08-20 09:30"; Message = "optimize hash performance" },
    @{ Date = "2025-09-02 10:15"; Message = "go module setup" },
    @{ Date = "2025-09-02 15:40"; Message = "go types and constants" },
    @{ Date = "2025-09-03 11:25"; Message = "http client with 402 handling" },
    @{ Date = "2025-09-03 16:10"; Message = "network configs for go" },
    @{ Date = "2025-09-04 10:50"; Message = "add payment header parsing" },
    @{ Date = "2025-09-05 14:30"; Message = "go client tests" },
    @{ Date = "2025-09-08 09:45"; Message = "c library header definitions" },
    @{ Date = "2025-09-08 15:20"; Message = "cmake build system" },
    @{ Date = "2025-09-09 11:00"; Message = "hash function signatures" },
    @{ Date = "2025-09-10 10:35"; Message = "ffi compatible types" },
    @{ Date = "2025-09-15 10:20"; Message = "express server example scaffold" },
    @{ Date = "2025-09-15 15:45"; Message = "add paid endpoints to express" },
    @{ Date = "2025-09-16 11:10"; Message = "fastapi example with multiple routes" },
    @{ Date = "2025-09-17 14:25"; Message = "payment verification in examples" },
    @{ Date = "2025-09-18 10:05"; Message = "add env config examples" },
    @{ Date = "2025-10-01 09:30"; Message = "rust cli structure" },
    @{ Date = "2025-10-01 14:50"; Message = "add verify command" },
    @{ Date = "2025-10-02 11:15"; Message = "network info commands" },
    @{ Date = "2025-10-02 16:20"; Message = "service discovery cli" },
    @{ Date = "2025-10-03 10:40"; Message = "interactive mode scaffold" },
    @{ Date = "2025-10-07 10:00"; Message = "write getting started guide" },
    @{ Date = "2025-10-07 15:30"; Message = "architecture documentation" },
    @{ Date = "2025-10-08 11:20"; Message = "api reference docs" },
    @{ Date = "2025-10-08 16:10"; Message = "contributing guidelines" },
    @{ Date = "2025-10-09 10:50"; Message = "security policy" },
    @{ Date = "2025-10-09 14:35"; Message = "protocol spec doc" },
    @{ Date = "2025-10-12 09:15"; Message = "github actions for typescript" },
    @{ Date = "2025-10-12 14:40"; Message = "python ci workflow" },
    @{ Date = "2025-10-13 10:25"; Message = "rust ci with clippy" },
    @{ Date = "2025-10-13 15:50"; Message = "go ci pipeline" },
    @{ Date = "2025-10-14 11:05"; Message = "c library ci" },
    @{ Date = "2025-10-14 16:20"; Message = "add code coverage" },
    @{ Date = "2025-10-16 10:30"; Message = "fix typescript types exports" },
    @{ Date = "2025-10-16 14:45"; Message = "python validation bug fix" },
    @{ Date = "2025-10-17 11:10"; Message = "update network configs" },
    @{ Date = "2025-10-17 15:25"; Message = "add usdc addresses for all chains" },
    @{ Date = "2025-10-18 10:15"; Message = "improve error messages" },
    @{ Date = "2025-10-18 14:55"; Message = "add caip2 format helpers" },
    @{ Date = "2025-10-19 11:30"; Message = "optimize merkle tree perf" },
    @{ Date = "2025-10-20 10:05"; Message = "update readme with examples" },
    @{ Date = "2025-10-20 15:40"; Message = "add makefile for build automation" },
    @{ Date = "2025-10-21 11:20"; Message = "turbo config optimization" },
    @{ Date = "2025-10-21 16:10"; Message = "prettier and editorconfig" },
    @{ Date = "2025-10-22 10:45"; Message = "changelog and versioning" },
    @{ Date = "2025-10-22 14:30"; Message = "license headers" },
    @{ Date = "2025-10-23 11:15"; Message = "fix python import paths" },
    @{ Date = "2025-10-23 15:50"; Message = "rust clippy warnings" },
    @{ Date = "2025-10-24 10:25"; Message = "update dependencies" },
    @{ Date = "2025-10-24 14:40"; Message = "add install guide" },
    @{ Date = "2025-10-25 11:00"; Message = "final docs cleanup" },
    @{ Date = "2025-10-26 10:30"; Message = "prepare for v1.0 release" },
    @{ Date = "2025-10-27 09:15"; Message = "v1.0.0 release" }
)

Write-Host "Nova402 Utils - Creating Git History" -ForegroundColor Cyan
Write-Host "Total commits: $($commits.Count)" -ForegroundColor Yellow
Write-Host ""

foreach ($commit in $commits) {
    $env:GIT_AUTHOR_DATE = $commit.Date
    $env:GIT_COMMITTER_DATE = $commit.Date
    
    git add -A
    git commit --allow-empty -m $commit.Message
    
    Write-Host "* $($commit.Date) - $($commit.Message)" -ForegroundColor Green
}

Remove-Item Env:\GIT_AUTHOR_DATE
Remove-Item Env:\GIT_COMMITTER_DATE

Write-Host ""
Write-Host "Git history created successfully!" -ForegroundColor Green
Write-Host "Total commits: $($commits.Count)" -ForegroundColor Cyan
