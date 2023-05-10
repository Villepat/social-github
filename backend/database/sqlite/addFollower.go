package sqlite

import "log"

func AddFollower(follower, followee int) error {
	// open the database connection
	db, err := OpenDb()
	if err != nil {
		return err
	}

	// defer the closing of the database connection
	defer db.Close()

	// start a new transaction
	tx, err := db.Begin()
	if err != nil {
		log.Println(err)
		tx.Rollback()
		return err
	}

	status := 2
	log.Println("follower: ", follower)
	log.Println("followee: ", followee)

	// insert user into table
	statement, err := tx.Prepare("INSERT INTO followers (user_id, follower_id, status) VALUES (?, ?, ?)")
	if err != nil {
		log.Println(err)
		tx.Rollback()
		return err
	}

	// execute the prepared statement and insert the new user
	result, err := statement.Exec(followee, follower, status)
	if err != nil {
		log.Println(err)
		tx.Rollback()
		return err
	}

	// check if the insert operation succeeded
	lastInsertID, err := result.LastInsertId()
	if err != nil || lastInsertID == 0 {
		log.Println(err)
		tx.Rollback()
		return err
	}

	// commit the transaction
	err = tx.Commit()
	if err != nil {
		log.Println(err)
		tx.Rollback()
		return err
	}

	return nil

}