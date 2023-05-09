package api

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"social-network/backend/database/sqlite"
	"strconv"
)

// ServeGroups is the handler for the /groups endpoint

type CommentForResponse struct {
	CommentID int    `json:"comment_id"`
	PostID    int    `json:"post_id"`
	UserID    int    `json:"user_id"`
	FullName  string `json:"full_name"`
	Content   string `json:"content"`
	Image     string `json:"image"`
	CreatedAt string `json:"created_at"`
}

func ServeComments(w http.ResponseWriter, r *http.Request) {
	// set cors headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")

	// if the request method is not GET or OPTIONS, return
	if r.Method != http.MethodGet && r.Method != http.MethodOptions {
		log.Println("Method not allowed")
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	// if the request method is OPTIONS, return
	if r.Method == http.MethodOptions {
		log.Println("Method options")
		w.WriteHeader(http.StatusOK)
		return
	}

	// get the post id from the request
	PostID := r.URL.Query().Get("id")
	PostIDInt, err := strconv.Atoi(PostID)
	if err != nil {
		log.Println(err)
		fmt.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// get the posts from the database
	comments, err := GetComments(PostIDInt)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// write the posts to the response
	w.WriteHeader(http.StatusOK)
	err = json.NewEncoder(w).Encode(struct {
		Comments []CommentForResponse `json:"comments"`
	}{Comments: comments})
	if err != nil {
		log.Println("Error encoding JSON:", err)
		fmt.Println("Error encoding JSON:", err)
		return
	}

}

// GetComments gets all the comments from the database
func GetComments(PostID int) ([]CommentForResponse, error) {
	log.Println("GetComments")
	log.Println("PostID:", PostID)
	db, err := sqlite.OpenDb()
	if err != nil {
		return nil, err
	}

	defer db.Close()

	// get all the comments from the database
	rows, err := db.Query("SELECT id, post_id, user_id, content, image, created_at FROM comments WHERE post_id = ?", PostID)
	if err != nil {
		return nil, err
	}

	// create a slice of comments
	comments := []CommentForResponse{}

	// iterate over the rows
	for rows.Next() {
		// create a comment
		comment := CommentForResponse{}

		// scan the rows into the comment
		err := rows.Scan(&comment.CommentID, &comment.PostID, &comment.UserID, &comment.Content, &comment.Image, &comment.CreatedAt)
		if err != nil {
			return nil, err
		}
		log.Println("comment.UserID:", comment.UserID)
		db.QueryRow("SELECT fullname FROM users WHERE user_id = ?", comment.UserID).Scan(&comment.FullName)

		// append the comment to the slice
		comments = append(comments, comment)
	}

	return comments, nil
}
