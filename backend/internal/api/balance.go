package api

import (
	"net/http"

	"github.com/rohithroshan/BlockPort/backend/internal/services"

	"github.com/labstack/echo/v4"
)

func getBalanceHandler(c echo.Context) error {
	chain := c.Param("chain")
	address := c.Param("address")

	balance, err := services.GetBalance(chain, address)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": err.Error(),
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"chain":   chain,
		"address": address,
		"balance": balance,
	})
}
