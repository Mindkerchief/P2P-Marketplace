package controller

import (
	"fmt"
	"strings"
<<<<<<< HEAD
=======
	"time"
>>>>>>> 0aa9d209a90512ff389a93e9fdf7c8bce7b66fb7

	"p2p_marketplace/backend/repository"

	"github.com/gofiber/fiber/v2"
)

func GetNotifications(c *fiber.Ctx) error {
<<<<<<< HEAD
	userId := fmt.Sprintf("%v", c.Locals("userId"))
	if strings.TrimSpace(userId) == "" || userId == "%!v(<nil>)" {
		return SendErrorResponse(c, 401, "User is not authenticated", nil)
	}

	notifications, err := repository.GetNotificationsByUserId(userId)
=======
	userId := strings.TrimSpace(fmt.Sprintf("%v", c.Locals("userId")))
	if userId == "" || userId == "%!v(<nil>)" {
		return SendErrorResponse(c, 401, "User is not authenticated", nil)
	}

	rows, err := repository.GetNotificationsByUser(userId)
>>>>>>> 0aa9d209a90512ff389a93e9fdf7c8bce7b66fb7
	if err != nil {
		return SendErrorResponse(c, 500, err.Error(), err)
	}

<<<<<<< HEAD
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
=======
	items := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		items = append(items, map[string]any{
			"id":        row.Id,
			"userId":    row.UserId,
			"type":      row.Type,
			"message":   row.Message,
			"link":      row.Link,
			"isRead":    row.IsRead,
			"createdAt": row.CreatedAt.UTC().Format(time.RFC3339),
		})
	}

	return SendSuccessResponse(c, 200, "Notifications fetched successfully", map[string]any{"notifications": items})
}

func MarkAllNotificationsRead(c *fiber.Ctx) error {
	userId := strings.TrimSpace(fmt.Sprintf("%v", c.Locals("userId")))
	if userId == "" || userId == "%!v(<nil>)" {
>>>>>>> 0aa9d209a90512ff389a93e9fdf7c8bce7b66fb7
		return SendErrorResponse(c, 401, "User is not authenticated", nil)
	}

	if err := repository.MarkAllNotificationsRead(userId); err != nil {
		return SendErrorResponse(c, 500, err.Error(), err)
	}

<<<<<<< HEAD
	return SendSuccessResponse(c, 200, "Notifications marked as read", nil)
=======
	return SendSuccessResponse(c, 200, "Notifications marked as read", map[string]any{"isSuccess": true})
}

func MarkNotificationRead(c *fiber.Ctx) error {
	userId := strings.TrimSpace(fmt.Sprintf("%v", c.Locals("userId")))
	if userId == "" || userId == "%!v(<nil>)" {
		return SendErrorResponse(c, 401, "User is not authenticated", nil)
	}

	notificationId := strings.TrimSpace(c.Params("id"))
	if notificationId == "" {
		return SendErrorResponse(c, 400, "Notification ID is required", nil)
	}

	if err := repository.MarkNotificationRead(userId, notificationId); err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "not found") {
			return SendErrorResponse(c, 404, err.Error(), nil)
		}
		return SendErrorResponse(c, 500, err.Error(), err)
	}

	return SendSuccessResponse(c, 200, "Notification marked as read", map[string]any{"isSuccess": true})
>>>>>>> 0aa9d209a90512ff389a93e9fdf7c8bce7b66fb7
}
