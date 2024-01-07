package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	e := echo.New()
	// e.GET("/", func(c echo.Context) error {
	// 	return c.String(http.StatusOK, "Hello, World!")
	// })
	// e.GET("/test", func(c echo.Context) error {
	// 	return c.String(http.StatusOK, "Hello, World This is test!")
	// })
	e.GET("/api/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World This is api!")
	})
	e.ServeHTTP(w, r)
}
