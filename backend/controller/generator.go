package controller

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"

	"p2p_marketplace/backend/model/errors"
	"p2p_marketplace/backend/model/response"
)

func GenerateHashPassword(password string) string {
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(hashedPassword)
}

func GenerateSessionID() (string, error) {
	b := make([]byte, 32)
	_, err := rand.Read(b)
	return base64.URLEncoding.EncodeToString(b), err
}

func GetRetCodeMessage(retCode int) string {
	switch retCode {
	case 400:
		return "Unauthorized Request"
	case 401:
		return "Invalid Request"
	case 404:
		return "Bad Request"
	case 409:
		return "Conflict"
	case 419:
		return "Authentication Timeout"
	case 500:
		return "Internal Server Error"
	default:
		return "Unknown Error"
	}
}

func SendErrorResponse(c *fiber.Ctx, retCode int, message string, err error) error {
	return c.Status(retCode).JSON(response.ResponseModel{
		RetCode: fmt.Sprintf("%d", retCode),
		Message: GetRetCodeMessage(retCode),
		Data: errors.ErrorModel{
			Message:   message,
			IsSuccess: false,
			Error:     err,
		},
	})
}

func SendSuccessResponse(c *fiber.Ctx, retCode int, message string, data interface{}) error {
	return c.Status(retCode).JSON(response.ResponseModel{
		RetCode: fmt.Sprintf("%d", retCode),
		Message: message,
		Data:    data,
	})
}
