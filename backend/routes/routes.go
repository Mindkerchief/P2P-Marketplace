package routes

import (
	"p2p_marketplace/backend/controller"

	"github.com/gofiber/fiber/v2"
)

func AppRoutes(app *fiber.App) {
	// Create API endpoints
	app.Post("/signup", controller.SignUpUser)
	app.Post("/login", controller.LogInUser)
}
