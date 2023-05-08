package sqlite

import (
	"log"
)

func AddComment(postId, userId int, content string, image []byte, createdAt string) error {
	db, err := OpenDb()
	if err != nil {
		log.Println(err)
		return err
	}

	defer db.Close()

	if image != nil {
		_, err = db.Exec("INSERT INTO comments (post_id, user_id, content, image, created_at) VALUES (?, ?, ?, ?, ?)", postId, userId, content, image, createdAt)
		if err != nil {
			log.Println(err)
			return err
		}
	} else {
		_, err = db.Exec("INSERT INTO comments (post_id, user_id, content, created_at) VALUES (?, ?, ?, ?)", postId, userId, content, createdAt)
		if err != nil {
			log.Println(err)
			return err
		}
	}

	return nil
}
