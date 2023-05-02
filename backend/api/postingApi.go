package api

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"social-network/backend/database/sqlite"
	"time"
)

// struct for the post
type Post struct {
	UserID  int    `json:"user_id"`
	Title   string `json:"title"`
	Content string `json:"content"`
	Privacy int    `json:"privacy"`
}

// AddPosts adds a post to the database
func ServePosting(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method != "POST" && r.Method != "OPTIONS" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		fmt.Fprintf(w, "{\"status\": 405, \"message\": \"method not allowed\"}")
		return
	}

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, "{\"status\": 200, \"message\": \"success\"}")
		return
	}

	// receive the post data from the request
	var post Post
	err := json.NewDecoder(r.Body).Decode(&post)
	if err != nil {
		fmt.Fprintf(w, "{\"status\": 400, \"message\": \"bad request\"}")
		log.Println(err)
	}

	err = sqlite.AddPosts(post.UserID, post.Title, post.Content, time.Now().Format("2006-01-02 15:04:05"), post.Privacy)
	if err != nil {
		fmt.Fprintf(w, "{\"status\": 500, \"message\": \"internal server error\"}")
		return
	}

	// Return the response
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "{\"status\": 200, \"message\": \"success\"}")
}