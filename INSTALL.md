# Installation Guide

## TypeScript/JavaScript

### npm

```bash
npm install @nova402/core
```

### pnpm

```bash
pnpm add @nova402/core
```

### yarn

```bash
yarn add @nova402/core
```

## Python

### pip

```bash
pip install nova402
```

### Development

```bash
git clone https://github.com/nova402/nova-utils.git
cd nova-utils/python/nova402
pip install -e ".[dev]"
```

## Rust

### Cargo

```bash
cargo add nova402-core
```

### CLI Tool

```bash
cargo install nova402-cli
```

## Go

### go get

```bash
go get github.com/nova402/nova-utils/go/pkg/nova402
```

## C

### From Source

```bash
git clone https://github.com/nova402/nova-utils.git
cd nova-utils/c
mkdir build && cd build
cmake ..
make
sudo make install
```

### CMake

```cmake
find_package(Nova402 REQUIRED)
target_link_libraries(your_target Nova402::nova402)
```

## Verification

### TypeScript

```bash
node -e "console.log(require('@nova402/core').X402_VERSION)"
```

### Python

```bash
python -c "import nova402; print(nova402.__version__)"
```

### Rust

```bash
cargo tree | grep nova402
```

### Go

```bash
go list -m github.com/nova402/nova-utils/go/pkg/nova402
```

## Platform-Specific Notes

### Windows

TypeScript and Python packages work natively. For Rust/C, install Visual Studio Build Tools.

### macOS

Install Xcode command-line tools:
```bash
xcode-select --install
```

### Linux

Install build essentials:
```bash
sudo apt-get install build-essential cmake
```

## Troubleshooting

### Node.js Version

Requires Node.js 18+. Update with:
```bash
nvm install 18
nvm use 18
```

### Python Version

Requires Python 3.8+. Check version:
```bash
python --version
```

### Rust Toolchain

Install via rustup:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Go Version

Requires Go 1.21+. Download from [golang.org](https://golang.org/dl/).

## License

Apache-2.0

