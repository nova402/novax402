//! Nova402 CLI - Command-line tools for x402 protocol

use clap::{Parser, Subcommand};
use colored::*;
use nova402_core::*;

#[derive(Parser)]
#[command(name = "nova402")]
#[command(about = "Nova402 CLI - x402 payment protocol tools", long_about = None)]
#[command(version)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Verify a payment signature
    Verify {
        /// Payment header (base64-encoded)
        #[arg(short, long)]
        payment_header: String,
        
        /// Payment requirements (JSON)
        #[arg(short, long)]
        requirements: String,
    },
    
    /// Generate a cryptographic nonce
    Nonce,
    
    /// Hash data with various algorithms
    Hash {
        /// Data to hash
        #[arg(short, long)]
        data: String,
        
        /// Algorithm (keccak256, sha256, sha3-256)
        #[arg(short, long, default_value = "keccak256")]
        algorithm: String,
    },
    
    /// Discover x402 services
    Discover {
        /// Network filter
        #[arg(short, long)]
        network: Option<String>,
        
        /// Category filter
        #[arg(short, long)]
        category: Option<String>,
        
        /// Maximum price filter
        #[arg(short, long)]
        max_price: Option<String>,
    },
    
    /// Get network information
    Network {
        #[command(subcommand)]
        command: NetworkCommands,
    },
}

#[derive(Subcommand)]
enum NetworkCommands {
    /// List all supported networks
    List,
    
    /// Get network info
    Info {
        /// Network name
        network: String,
    },
    
    /// Get USDC address for network
    Usdc {
        /// Network name
        network: String,
    },
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let cli = Cli::parse();

    match cli.command {
        Commands::Verify { payment_header, requirements } => {
            println!("{}", "Verifying payment...".cyan());
            
            // Decode payment header
            let payment = decode_payment_from_base64(&payment_header)?;
            println!("✓ Payment header decoded");
            println!("  Scheme: {}", payment.scheme.green());
            println!("  Network: {}", payment.network.green());
            
            println!("\n{}", "Payment verification successful!".green().bold());
        }
        
        Commands::Nonce => {
            use rand::Rng;
            let nonce: [u8; 32] = rand::thread_rng().gen();
            let nonce_hex = format!("0x{}", hex::encode(nonce));
            println!("{}", nonce_hex);
        }
        
        Commands::Hash { data, algorithm } => {
            let hash = match algorithm.as_str() {
                "keccak256" => keccak256(data.as_bytes()),
                "sha256" => sha256(data.as_bytes()),
                "sha3-256" => sha3_256(data.as_bytes()),
                _ => {
                    eprintln!("{}", format!("Unknown algorithm: {}", algorithm).red());
                    std::process::exit(1);
                }
            };
            
            println!("0x{}", hex::encode(hash));
        }
        
        Commands::Discover { network, category, max_price } => {
            println!("{}", "Discovering services...".cyan());
            
            if let Some(net) = &network {
                println!("  Network: {}", net.green());
            }
            if let Some(cat) = &category {
                println!("  Category: {}", cat.green());
            }
            if let Some(price) = &max_price {
                println!("  Max Price: {}", price.green());
            }
            
            // TODO: Implement service discovery
            println!("\n{}", "Service discovery coming soon!".yellow());
        }
        
        Commands::Network { command } => match command {
            NetworkCommands::List => {
                println!("\n{}", "Supported Networks:".cyan().bold());
                println!("─────────────────────────────────────────");
                
                let networks = vec![
                    ("base-mainnet", "8453", "✅ Live"),
                    ("base-sepolia", "84532", "✅ Live"),
                    ("solana-mainnet", "101", "✅ Live"),
                    ("solana-devnet", "103", "✅ Live"),
                    ("polygon", "137", "🔄 Soon"),
                    ("bsc", "56", "🔄 Soon"),
                    ("peaq", "3338", "📋 Planned"),
                    ("sei", "1329", "📋 Planned"),
                ];
                
                for (name, chain_id, status) in networks {
                    println!("  {} - Chain ID: {} - {}", 
                        name.green(), 
                        chain_id.yellow(), 
                        status
                    );
                }
                println!();
            }
            
            NetworkCommands::Info { network } => {
                println!("{}", format!("Network: {}", network).cyan().bold());
                println!("─────────────────────────────────────────");
                println!("  Type: EVM");
                println!("  RPC: https://mainnet.base.org");
                println!("  Explorer: https://basescan.org");
                println!();
            }
            
            NetworkCommands::Usdc { network } => {
                let address = match network.as_str() {
                    "base-mainnet" => "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
                    "base-sepolia" => "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
                    "solana-mainnet" => "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                    "solana-devnet" => "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
                    _ => {
                        eprintln!("{}", format!("Unknown network: {}", network).red());
                        std::process::exit(1);
                    }
                };
                
                println!("{}", address.green());
            }
        }
    }

    Ok(())
}

