package sqlite

import (
	"log"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/sqlite3"
	_ "github.com/golang-migrate/migrate/v4/source/file"

	_ "github.com/mattn/go-sqlite3"
)

func InitDb() {
	db, err := OpenDb()
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	// Initialize the migration driver
	driver, err := sqlite3.WithInstance(db, &sqlite3.Config{})
	if err != nil {
		log.Fatal(err)
	}

	// Create a migrate instance using the file-based migration source
	m, err := migrate.NewWithDatabaseInstance(
		"file://./pkg/db/sqlite/migrations", // The path to the migrations folder
		"sqlite3",                           // The name of the database system
		driver,                              // The migration driver
	)
	if err != nil {
		log.Fatal(err)
	}

	// Apply the migrations
	err = m.Up()
	if err != nil && err != migrate.ErrNoChange {
		log.Fatal(err)
	}

	// _, err = db.Exec(`
	//     CREATE TABLE IF NOT EXISTS users (
	//         id INTEGER PRIMARY KEY AUTOINCREMENT,
	//         username TEXT NOT NULL UNIQUE,
	//         email TEXT NOT NULL UNIQUE,
	//         password TEXT NOT NULL,
	//         key TEXT NOT NULL UNIQUE,
	//         name TEXT NOT NULL,
	//         surname TEXT NOT NULL,
	//         birthdate TEXT NOT NULL,
	//         aboutme TEXT
	//     );
	// `)
	// if err != nil {
	//     log.Fatal(err)
	// }
}
