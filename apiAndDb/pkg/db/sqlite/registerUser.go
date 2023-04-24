package sqlite

import (
	"log"

	_ "github.com/mattn/go-sqlite3"
)

func AddUser(username string, email string, password string, key string, name string, surname string, birthdate string, aboutme string) error {
	db, err := OpenDb()
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	_, err = db.Exec(`
		INSERT INTO users (username, email, password, key, name, surname, birthdate, aboutme) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
	`, username, email, password, key, name, surname, birthdate, aboutme)
	if err != nil {
		log.Println(err)
		return err
	}
	return nil
}
