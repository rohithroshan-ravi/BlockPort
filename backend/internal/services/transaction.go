package services

import "fmt"

// CreateTransaction simulates sending a transaction
func CreateTransaction(chain, from, to, amount, asset string) (string, error) {
	// Placeholder implementation
	if chain != "evm" && chain != "solana" && chain != "bitcoin" {
		return "", fmt.Errorf("unsupported chain: %s", chain)
	}

	// Return fake tx hash
	return fmt.Sprintf("0xFAKEHASH_%s_%s", chain, asset), nil
}
