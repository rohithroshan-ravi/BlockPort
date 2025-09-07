package api

import (
	"net/http"

	"github.com/rohithroshan/BlockPort/backend/internal/services"

	"github.com/labstack/echo/v4"
)

type TransactionRequest struct {
	Chain  string `json:"chain"`
	From   string `json:"from"`
	To     string `json:"to"`
	Amount string `json:"amount"`
	Asset  string `json:"asset"`
}

func createTransactionHandler(c echo.Context) error {
	var req TransactionRequest

	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid request"})
	}

	txHash, err := services.CreateTransaction(req.Chain, req.From, req.To, req.Amount, req.Asset)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]string{"txHash": txHash})
}
