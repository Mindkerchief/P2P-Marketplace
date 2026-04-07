package model

import "time"

type NotificationFromDb struct {
	Id        string    `gorm:"column:id"`
	UserId    string    `gorm:"column:user_id"`
	Type      string    `gorm:"column:type"`
	Message   string    `gorm:"column:message"`
	IsRead    bool      `gorm:"column:is_read"`
	CreatedAt time.Time `gorm:"column:created_at"`
}
