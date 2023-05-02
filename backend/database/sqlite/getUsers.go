package sqlite

type UserList struct {
	UserID   int    `json:"id"`
	Fullname string `json:"fullname"`
}

func GetAllUsers() ([]UserList, error) {
	db, err := OpenDb()
	if err != nil {
		return nil, err
	}
	defer db.Close()

	rows, err := db.Query("SELECT user_id, fullname FROM users")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []UserList
	for rows.Next() {
		var user UserList
		if err := rows.Scan(&user.UserID, &user.Fullname); err != nil {
			return nil, err
		}
		users = append(users, user)
	}
	return users, nil
}
