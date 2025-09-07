package services

import "fmt"

// GetBalance fetches wallet balance for given chain and address
func GetBalance(chain, address string) (string, error) {
	// Placeholder logic
	switch chain {
	case "evm":
		return "1.2345 ETH", nil
	case "solana":
		return "10 SOL", nil
	case "bitcoin":
		return "0.05 BTC", nil
	default:
		return "", fmt.Errorf("unsupported chain: %s", chain)
	}
}
