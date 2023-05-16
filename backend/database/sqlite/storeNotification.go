package sqlite

func AddNotification(userID int, content string, nType string, createdAt string) error {
	db, err := OpenDb()
	if err != nil {
		return err
	}

	defer db.Close()

	_, err = db.Exec("INSERT INTO notifications (user_id, content, type, created_at) VALUES (?, ?, ?, ?)", userID, content, nType, createdAt)
	if err != nil {
		return err
	}

	return nil
}
