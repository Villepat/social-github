package sqlite

import (
	"log"

	_ "github.com/mattn/go-sqlite3"
	"golang.org/x/crypto/bcrypt"
)

func AddUser(username string, email string, password string, key string, name string, surname string, birthdate string, aboutme string) error {
	db, err := OpenDb()
	if err != nil {
		log.Println(err)
		return err
	}
	defer db.Close()

	newPW, err := hashPassword(password)
	if err != nil {
		log.Println(err)
		return err
	}

	_, err = db.Exec(`
		INSERT INTO users (username, email, password, key, name, surname, birthdate, aboutme) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
	`, username, email, newPW, key, name, surname, birthdate, aboutme)
	if err != nil {
		log.Println(err)
		return err
	}
	return nil
}

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}
