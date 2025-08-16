//! Merkle tree implementation for x402 protocol

use crate::errors::{CryptoError, Result};
use crate::hashing::keccak256;

/// Merkle tree for efficient payment verification
pub struct MerkleTree {
    leaves: Vec<[u8; 32]>,
    layers: Vec<Vec<[u8; 32]>>,
}

impl MerkleTree {
    /// Create a new Merkle tree from leaves
    pub fn new(mut leaves: Vec<[u8; 32]>) -> Result<Self> {
        if leaves.is_empty() {
            return Err(CryptoError::MerkleError("Cannot create tree with no leaves".to_string()));
        }

        let mut layers = vec![leaves.clone()];

        while layers.last().unwrap().len() > 1 {
            let current_layer = layers.last().unwrap();
            let mut next_layer = Vec::new();

            for i in (0..current_layer.len()).step_by(2) {
                if i + 1 < current_layer.len() {
                    let mut left = current_layer[i];
                    let mut right = current_layer[i + 1];

                    // Sort for deterministic ordering
                    if left > right {
                        std::mem::swap(&mut left, &mut right);
                    }

                    let mut combined = Vec::with_capacity(64);
                    combined.extend_from_slice(&left);
                    combined.extend_from_slice(&right);

                    next_layer.push(keccak256(&combined));
                } else {
                    // Odd leaf, promote to next level
                    next_layer.push(current_layer[i]);
                }
            }

            layers.push(next_layer);
        }

        Ok(Self { leaves, layers })
    }

    /// Get the Merkle root
    pub fn root(&self) -> [u8; 32] {
        self.layers.last().unwrap()[0]
    }

    /// Generate Merkle proof for a leaf at given index
    pub fn generate_proof(&self, index: usize) -> Result<Vec<[u8; 32]>> {
        if index >= self.leaves.len() {
            return Err(CryptoError::MerkleError(format!(
                "Index {} out of bounds for {} leaves",
                index,
                self.leaves.len()
            )));
        }

        let mut proof = Vec::new();
        let mut current_index = index;

        for layer_idx in 0..self.layers.len() - 1 {
            let layer = &self.layers[layer_idx];
            let sibling_index = if current_index % 2 == 0 {
                current_index + 1
            } else {
                current_index - 1
            };

            if sibling_index < layer.len() {
                proof.push(layer[sibling_index]);
            }

            current_index /= 2;
        }

        Ok(proof)
    }

    /// Verify a Merkle proof
    pub fn verify_proof(&self, leaf: &[u8; 32], proof: &[[u8; 32]], index: usize) -> bool {
        let mut computed_hash = *leaf;
        let mut current_index = index;

        for sibling in proof {
            let mut left = computed_hash;
            let mut right = *sibling;

            // Determine order based on index
            if current_index % 2 != 0 {
                std::mem::swap(&mut left, &mut right);
            }

            // Sort for deterministic ordering
            if left > right {
                std::mem::swap(&mut left, &mut right);
            }

            let mut combined = Vec::with_capacity(64);
            combined.extend_from_slice(&left);
            combined.extend_from_slice(&right);

            computed_hash = keccak256(&combined);
            current_index /= 2;
        }

        computed_hash == self.root()
    }

    /// Get number of leaves
    pub fn leaf_count(&self) -> usize {
        self.leaves.len()
    }
}

/// Compute Merkle root from leaves
pub fn compute_merkle_root(leaves: &[[u8; 32]]) -> Result<[u8; 32]> {
    if leaves.is_empty() {
        return Err(CryptoError::MerkleError("Cannot compute root of empty tree".to_string()));
    }

    if leaves.len() == 1 {
        return Ok(leaves[0]);
    }

    let tree = MerkleTree::new(leaves.to_vec())?;
    Ok(tree.root())
}

/// Generate Merkle proof for a leaf
pub fn generate_merkle_proof(
    leaves: &[[u8; 32]],
    index: usize,
) -> Result<Vec<[u8; 32]>> {
    let tree = MerkleTree::new(leaves.to_vec())?;
    tree.generate_proof(index)
}

/// Verify a Merkle proof
pub fn verify_merkle_proof(
    leaf: &[u8; 32],
    proof: &[[u8; 32]],
    root: &[u8; 32],
    index: usize,
) -> bool {
    let mut computed_hash = *leaf;
    let mut current_index = index;

    for sibling in proof {
        let mut left = computed_hash;
        let mut right = *sibling;

        if current_index % 2 != 0 {
            std::mem::swap(&mut left, &mut right);
        }

        if left > right {
            std::mem::swap(&mut left, &mut right);
        }

        let mut combined = Vec::with_capacity(64);
        combined.extend_from_slice(&left);
        combined.extend_from_slice(&right);

        computed_hash = keccak256(&combined);
        current_index /= 2;
    }

    computed_hash == *root
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::hashing::keccak256;

    #[test]
    fn test_merkle_tree_single_leaf() {
        let leaf = keccak256(b"test");
        let tree = MerkleTree::new(vec![leaf]).unwrap();
        assert_eq!(tree.root(), leaf);
    }

    #[test]
    fn test_merkle_tree_multiple_leaves() {
        let leaves: Vec<[u8; 32]> = (0..4)
            .map(|i| keccak256(format!("tx{}", i).as_bytes()))
            .collect();

        let tree = MerkleTree::new(leaves.clone()).unwrap();
        assert_eq!(tree.leaf_count(), 4);

        // Verify proof for first leaf
        let proof = tree.generate_proof(0).unwrap();
        assert!(tree.verify_proof(&leaves[0], &proof, 0));
    }

    #[test]
    fn test_merkle_proof_verification() {
        let leaves: Vec<[u8; 32]> = (0..8)
            .map(|i| keccak256(format!("tx{}", i).as_bytes()))
            .collect();

        let root = compute_merkle_root(&leaves).unwrap();
        let proof = generate_merkle_proof(&leaves, 3).unwrap();

        assert!(verify_merkle_proof(&leaves[3], &proof, &root, 3));
    }

    #[test]
    fn test_merkle_tree_odd_leaves() {
        let leaves: Vec<[u8; 32]> = (0..5)
            .map(|i| keccak256(format!("tx{}", i).as_bytes()))
            .collect();

        let tree = MerkleTree::new(leaves.clone()).unwrap();
        
        for i in 0..leaves.len() {
            let proof = tree.generate_proof(i).unwrap();
            assert!(tree.verify_proof(&leaves[i], &proof, i));
        }
    }
}

