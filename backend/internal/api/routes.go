package api

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// RegisterRoutes adds all API routes
func RegisterRoutes(e *echo.Echo) {
	v1 := e.Group("/api/v1")

	v1.GET("/health", healthCheckHandler)
	v1.GET("/balance/:chain/:address", getBalanceHandler)
	v1.POST("/transaction", createTransactionHandler)
}

func healthCheckHandler(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{"status": "ok"})
}
