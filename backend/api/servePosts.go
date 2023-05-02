package api

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"social-network/backend/database/sqlite"
)

// struct for the response
type Response struct {
	Posts []PostForResponse `json:"posts"`
}

// struct for the posts
type PostForResponse struct {
	Id      int    `json:"id"`
	UserId  int    `json:"userId"`
	Title   string `json:"title"`
	Content string `json:"content"`
	Date    string `json:"date"`
}

func ServePosts(w http.ResponseWriter, r *http.Request) {
	// set the response headers
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method != "GET" && r.Method != "OPTIONS" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		fmt.Fprintf(w, "{\"status\": 405, \"message\": \"method not allowed\"}")
		return
	}

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, "{\"status\": 200, \"message\": \"success\"}")
		return
	}

	// get the posts
	posts, err := GetPosts()
	if err != nil {
		fmt.Println(err)
		// send a response with the error
		fmt.Fprintf(w, "{\"status\": 500, \"message\": \"internal server error\"}")
	}

	// create the response
	response := Response{
		Posts: posts,
	}

	// convert the response to json
	responseJSON, err := json.Marshal(response)
	if err != nil {
		fmt.Println(err)
		// send a response with the error
		fmt.Fprintf(w, "{\"status\": 500, \"message\": \"internal server error\"}")
	}

	// write the response
	w.Write(responseJSON)
}

func GetPosts() ([]PostForResponse, error) {
	db, err := sqlite.OpenDb()
	if err != nil {
		log.Println("Error opening the database, GetPosts(): ", err)
	}

	defer db.Close()

	// get the posts
	posts := []PostForResponse{}

	rows, err := db.Query("SELECT id, user_id, title, content, created_at FROM posts")
	if err != nil {
		log.Println("Error getting the posts, GetPosts(): ", err)
	}

	defer rows.Close()

	for rows.Next() {
		var post PostForResponse
		err := rows.Scan(&post.Id, &post.UserId, &post.Title, &post.Content, &post.Date)
		if err != nil {
			log.Println("Error scanning the posts, GetPosts(): ", err)
		}

		posts = append(posts, post)
	}

	return posts, nil
}
