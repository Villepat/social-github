package sqlite

import (
	"bytes"
	"fmt"
)

func UpdateUserProfile(userID, email, nickname, aboutMe, fileName string, fileContent []byte) error {
	db, err := OpenDb()
	if err != nil {
		return err
	}
	defer db.Close()
	//print received data
	fmt.Println(userID, email, nickname, aboutMe, fileName, "at updateuserprofile in sqlite")

	// Update user data
	var updateFields bytes.Buffer
	var updateValues []interface{}

	if email != "" {
		updateFields.WriteString("email = ?,")
		updateValues = append(updateValues, email)
	}

	if nickname != "" {
		updateFields.WriteString(" nickname = ?,")
		updateValues = append(updateValues, nickname)
	}

	if aboutMe != "" {
		updateFields.WriteString(" aboutme = ?,")
		updateValues = append(updateValues, aboutMe)
	}

	// Remove the trailing comma
	updateFields.Truncate(updateFields.Len() - 1)

	// Prepare the statement only if there are fields to update
	if updateFields.Len() > 0 {
		stmt, err := db.Prepare(fmt.Sprintf("UPDATE users SET %s WHERE user_id = ?", updateFields.String()))
		if err != nil {
			return err
		}
		updateValues = append(updateValues, userID)
		_, err = stmt.Exec(updateValues...)
		if err != nil {
			return err
		}
	}

	// Update avatar if a new one was uploaded
	if fileName != "" {
		stmt, err := db.Prepare("UPDATE users SET avatar = ? WHERE user_id = ?")
		if err != nil {
			fmt.Println("error at updateuserprofile in sqlite")
			return err
		}
		_, err = stmt.Exec(fileContent, userID)
		if err != nil {
			fmt.Println("error at updateuserprofile in sqlite")
			return err
		}
	}
	fmt.Println("no error at updateuserprofile in sqlite")

	return nil
}
