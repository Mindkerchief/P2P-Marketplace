package middleware

import (
	// "net/http"

	"golang.org/x/crypto/bcrypt"
	// "p2p_marketplace/backend/controller"
)

func IsPasswordMatch(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// func AuthMiddleware(next http.Handler) http.Handler {
// 	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
// 		cookie, err := r.Cookie("session_id")
// 		if err != nil {
// 			http.Error(w, "Unauthorized", http.StatusUnauthorized)
// 			return
// 		}

// 		session, err := GetSessionFromDB(cookie.Value)
// 		if err != nil || session.Expired() {
// 			http.Error(w, "Unauthorized", http.StatusUnauthorized)
// 			return
// 		}

// 		ctx := context.WithValue(r.Context(), "userID", session.UserID)
// 		next.ServeHTTP(w, r.WithContext(ctx))
// 	})
// }
