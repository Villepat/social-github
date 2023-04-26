package sqlite

import (
	"log"
)

// GetUserKey returns the key of the user
func GetUserKey(username string) (string, error) {
	log.Println("Getting user key")
	db, err := OpenDb()
	if err != nil {
		log.Println(err)
		return "", err
	}
	defer db.Close()

	var userKey string
	err = db.QueryRow(`
		SELECT secret_key
		FROM users
		WHERE nickname = ?;
	`, username).Scan(&userKey)
	if err != nil {
		log.Println(err)
		return "", err
	}
	return userKey, nil
}
