package middleware

import (
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	DBConn *gorm.DB
	DBErr  error
)

// Initializes the database connection using environment variables.
// Assigns the connection to the global variable DBConn.
// Returns true if there was an error establishing the connection.
func ConnectDB() bool {
	dns := fmt.Sprintf("host=%s port=%s dbname=%s user=%s password=%s sslmode=%s TimeZone=%s",
		GetEnv("DB_HOST"), GetEnv("DB_PORT"), GetEnv("DB_NAME"),
		GetEnv("DB_UNME"), GetEnv("DB_PWRD"), GetEnv("DB_SSLM"),
		GetEnv("DB_TMEZ"))

	DBConn, DBErr = gorm.Open(postgres.Open(dns), &gorm.Config{})

	return DBErr != nil
}
