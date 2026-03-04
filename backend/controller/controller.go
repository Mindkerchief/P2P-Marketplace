package controller

import (
	"p2p_marketplace/backend/middleware"
	"p2p_marketplace/backend/model/data"
	"p2p_marketplace/backend/model/response"

	"github.com/gofiber/fiber/v2"
)

func SignUpUser(c *fiber.Ctx) error {
	// Call database connection and initialize user struct
	db := middleware.DBConn
	var user = data.User{}

	// Parse request body into user struct
	if err := c.BodyParser(&user); err != nil {
		return SendErrorResponse(c, 400, "Invalid request body", err)
	}

	// Basic validation for required fields
	if user.FirstName == "" || user.LastName == "" || user.Email == "" || user.Password == "" {
		return SendErrorResponse(c, 400, "All fields are required", nil)
	}

	// Check if email already exists
	var existingUserCount int64
	if err := db.Raw("SELECT COUNT(*) FROM public.users WHERE email=$1",
		user.Email).Scan(&existingUserCount).Error; err != nil {
		return SendErrorResponse(c, 500, "User data retrieval failed", err)
	}

	// If email exists, return conflict response
	if existingUserCount > 0 {
		return SendErrorResponse(c, 409, "Email already exists", nil)
	}

	// Validate password strength (example: minimum 8 characters)
	if len(user.Password) < 8 {
		return SendErrorResponse(c, 400, "Password must be at least 8 characters long", nil)
	}

	// Hash the password
	hashedPassword := GenerateHashPassword(user.Password)

	// Insert into database
	if res := db.Exec("INSERT INTO public.users (first_name, last_name, email, password_hash) VALUES ($1,$2,$3,$4)",
		user.FirstName, user.LastName, user.Email, hashedPassword); res.Error != nil {
		return SendErrorResponse(c, 500, "New user data insertion failed", res.Error)
	}

	// Clear password before returning
	user.Password = ""

	// Success response
	return c.Status(201).JSON(response.ResponseModel{
		RetCode: "201",
		Message: "User created successfully",
		Data:    user,
	})
}

func LogInUser(c *fiber.Ctx) error {
	// Call database connection and initialize user struct
	db := middleware.DBConn
	var user = data.User{}

	// Parse request body into user struct
	if err := c.BodyParser(&user); err != nil {
		return SendErrorResponse(c, 400, "Invalid request body", err)
	}

	var storedPassword string

	// Query database
	if err := db.Raw("SELECT password_hash FROM public.users WHERE email=$1",
		user.Email).Scan(&storedPassword).Error; err != nil {
		return SendErrorResponse(c, 500, "User data retrieval failed", err)
	}

	// Check password
	if !middleware.IsPasswordMatch(user.Password, storedPassword) {
		return SendErrorResponse(c, 401, "Incorrect password", nil)
	}

	// Clear password before returning
	user.Password = ""

	// Success response
	// TODO: Generate Session and return session token
	return SendSuccessResponse(c, 200, "Valid user credentials", user)
}

// func GetSessionFromDB(sessionID string) (Session, error) {
// 	// Placeholder for actual database retrieval logic
// 	return Session{}, nil
// }
