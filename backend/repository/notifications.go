package repository

import (
	"p2p_marketplace/backend/middleware"
	"p2p_marketplace/backend/model"
)

func GetNotificationsByUserId(userId string) ([]model.NotificationFromDb, error) {
	db := middleware.DBConn
	var notifications []model.NotificationFromDb
	if err := db.Raw(`
		SELECT id, user_id, type, message, COALESCE(is_read, FALSE) AS is_read, created_at
		FROM public.notifications
		WHERE user_id = $1
		ORDER BY created_at DESC
		LIMIT 100
	`, userId).Scan(&notifications).Error; err != nil {
		return nil, err
	}
	return notifications, nil
}

func MarkAllNotificationsRead(userId string) error {
	db := middleware.DBConn
	return db.Exec(`
		UPDATE public.notifications
		SET is_read = TRUE
		WHERE user_id = $1
	`, userId).Error
}
