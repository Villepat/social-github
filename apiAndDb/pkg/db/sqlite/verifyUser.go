package sqlite

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

// VerifyUser checks if the user exists and if the password is correct

func VerifyUser(username string, password string) int {
	log.Println("Verifying user")
	db, err := OpenDb()
	if err != nil {
		log.Println(err)
		return -1
	}
	defer db.Close()

	var userPassword string
	var userId int
	err = db.QueryRow(`
	SELECT password, id
	FROM users
	WHERE username = ?;
`, username).Scan(&userPassword, &userId)
	if err != nil {
		if err == sql.ErrNoRows {
			log.Printf("User %s not found", username)
			return -1
		}
		log.Println(err)
		return -1
	}

	if userPassword == password {
		return userId
	}
	return -1
}
