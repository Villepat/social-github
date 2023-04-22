package sqlite

import (
	"log"

	_ "github.com/mattn/go-sqlite3"
)

func InitDb() {
	db, err := OpenDb()
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			username TEXT NOT NULL UNIQUE,
			email TEXT NOT NULL UNIQUE,
			password TEXT NOT NULL,
			key TEXT NOT NULL UNIQUE,
			name TEXT NOT NULL,
			surname TEXT NOT NULL,
			birthdate TEXT NOT NULL,
			aboutme TEXT NOT NULL
		);
	`)
	if err != nil {
		log.Fatal(err)
	}
}
