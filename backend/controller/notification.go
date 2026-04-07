package controller

import (
	"fmt"
	"strings"

	"p2p_marketplace/backend/repository"

	"github.com/gofiber/fiber/v2"
)

func GetNotifications(c *fiber.Ctx) error {
	userId := fmt.Sprintf("%v", c.Locals("userId"))
	if strings.TrimSpace(userId) == "" || userId == "%!v(<nil>)" {
		return SendErrorResponse(c, 401, "User is not authenticated", nil)
	}

	notifications, err := repository.GetNotificationsByUserId(userId)
	if err != nil {
		return SendErrorResponse(c, 500, err.Error(), err)
	}

	mapped := make([]map[string]any, 0, len(notifications))
	for _, n := range notifications {
		mapped = append(mapped, map[string]any{
			"id":        n.Id,
			"type":      n.Type,
			"message":   n.Message,
			"isRead":    n.IsRead,
			"createdAt": n.CreatedAt,
		})
	}

	return SendSuccessResponse(c, 200, "Notifications fetched successfully", map[string]any{
		"notifications": mapped,
	})
}

func MarkNotificationsRead(c *fiber.Ctx) error {
	userId := fmt.Sprintf("%v", c.Locals("userId"))
	if strings.TrimSpace(userId) == "" || userId == "%!v(<nil>)" {
		return SendErrorResponse(c, 401, "User is not authenticated", nil)
	}

	if err := repository.MarkAllNotificationsRead(userId); err != nil {
		return SendErrorResponse(c, 500, err.Error(), err)
	}

	return SendSuccessResponse(c, 200, "Notifications marked as read", nil)
}
