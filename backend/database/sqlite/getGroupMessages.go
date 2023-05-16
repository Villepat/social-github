package sqlite

import (
	"log"
)

type GroupMessage struct {
	Id        int    `json:"id"`
	GroupId   int    `json:"group_id"`
	UserId    int    `json:"user_id"`
	Content   string `json:"content"`
	Image     []byte `json:"image"`
	CreatedAt string `json:"created_at"`
}

func GetGroupMessages(groupID int) ([]GroupMessage, error) {
	db, err := OpenDb()
	if err != nil {
		log.Println(err)
		return nil, err
	}

	defer db.Close()

	// get all messages from the group
	rows, err := db.Query("SELECT * FROM group_messages WHERE group_id = ?", groupID)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	defer rows.Close()

	messages := make([]GroupMessage, 0)

	for rows.Next() {
		var message GroupMessage
		err := rows.Scan(&message.Id, &message.GroupId, &message.UserId, &message.Content, &message.Image, &message.CreatedAt)
		if err != nil {
			log.Println(err)
			return nil, err
		}

		messages = append(messages, message)
	}

	return messages, nil

}
