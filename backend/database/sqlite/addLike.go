package sqlite

import "log"

func AddLike(userID, postID int, status int) error {
	db, err := OpenDb()
	if err != nil {
		log.Println(err)
		return err
	}

	defer db.Close()

	// check if user has liked the post
	if status == 0 {
		_, err = db.Exec("INSERT INTO reactions (user_id, post_id, reaction_type) VALUES (?, ?, ?)", userID, postID, status)
		if err != nil {
			log.Println(err)
			return err
		}
	} else {
		_, err = db.Exec("UPDATE reactions SET reaction_type = ? WHERE user_id = ? AND post_id = ?", status, userID, postID)
		if err != nil {
			log.Println(err)
			return err
		}
	}

	return nil
}
