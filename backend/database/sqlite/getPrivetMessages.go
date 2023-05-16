package sqlite

import (
	"log"
)

type PrivetMessage struct {
	ID        int    `json:"id"`
	Content   string `json:"content"`
	Image     []byte `json:"image"`
	CreatedAt string `json:"created_at"`
}

func GetPrivetMessages(userID int) ([]PrivetMessage, error) {
	db, err := OpenDb()
	if err != nil {
		log.Println(err)
		return nil, err
	}

	defer db.Close()

	// get all messages from the group
	rows, err := db.Query("SELECT * FROM privet_messages WHERE user_id = ?", userID)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	defer rows.Close()

	messages := make([]PrivetMessage, 0)

	for rows.Next() {
		var message PrivetMessage
		err := rows.Scan(&message.ID, &message.Content, &message.Image, &message.CreatedAt)
		if err != nil {
			log.Println(err)
			return nil, err
		}

		messages = append(messages, message)
	}

	return messages, nil

}
