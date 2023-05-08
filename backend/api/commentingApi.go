package api

import (
	"encoding/base64"
	"encoding/json"
	"log"
	"net/http"
	"social-network/backend/database/sqlite"
)

// request body:
// {
// 	"post_id": 1,
// 	"user_id": "1",
// 	"content": "Hello World!",
// 	"image": "base64 encoded image",
// 	"created_at": "2020-01-01 00:00:00"
// }

type Comment struct {
	PostId    int    `json:"post_id"`
	UserId    string `json:"user_id"`
	Content   string `json:"content"`
	Image     string `json:"image"`
	CreatedAt string `json:"created_at"`
}

func CommentingAPI(w http.ResponseWriter, r *http.Request) {
	// set cors headers
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")

	// if the request method is not POST or OPTIONS, return
	if r.Method != http.MethodPost && r.Method != http.MethodOptions {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	// if the request method is OPTIONS, return
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	// parse the JSON request body into a Comment struct
	var comment Comment
	err := json.NewDecoder(r.Body).Decode(&comment)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// get the user id from the session
	//check if the request cookie is in the sessions map
	cookie, err := r.Cookie("session_token")
	if err != nil {
		log.Println("Error getting cookie:", err)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	session, ok := Sessions[cookie.Value]
	if !ok {
		log.Println("session not found")
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	// modify image to []byte
	image, err := base64.StdEncoding.DecodeString(comment.Image)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if image != nil {
		err = sqlite.AddComment(comment.PostId, session.UserID, comment.Content, image, comment.CreatedAt)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	} else {
		err = sqlite.AddComment(comment.PostId, session.UserID, comment.Content, nil, comment.CreatedAt)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	}

	w.WriteHeader(http.StatusOK)
}
