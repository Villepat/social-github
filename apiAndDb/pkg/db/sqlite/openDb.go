package sqlite

import (
	"database/sql"

	_ "github.com/mattn/go-sqlite3"
)

var (
	// Db is the database connection handle
	Db *sql.DB
)

// OpenDb opens the database connection
func OpenDb() (*sql.DB, error) {
	var err error
	Db, err = sql.Open("sqlite3", "../database.db")
	if err != nil {
		return nil, err
	}
	return Db, nil
}
