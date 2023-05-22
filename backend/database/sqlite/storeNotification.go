package sqlite

func AddNotification(userID int, content string, nType string, createdAt string, readStatus int) error {
	db, err := OpenDb()
	if err != nil {
		return err
	}

	defer db.Close()

	_, err = db.Exec("INSERT INTO notifications (user_id, content, type, is_read, created_at) VALUES (?, ?, ?, ?, ?)", userID, content, nType, readStatus, createdAt)
	if err != nil {
		return err
	}

	return nil
}
