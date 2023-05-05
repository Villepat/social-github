package api

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"social-network/backend/database/sqlite"
	"time"
)

// struct for the post
type Post struct {
	Content string `json:"content"`
	Privacy string `json:"privacy"`
	Picture string `json:"picture"`
}

// AddPosts adds a post to the database
func ServePosting(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
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
	log.Println("session found", session.UserID)

	// Parse the multipart form data
	err = r.ParseMultipartForm(10 << 20) // 10 MB max size
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "{\"status\": 400, \"message\": \"bad request\"}")
		log.Println(err)
		return
	}

	// Get the form values
	content := r.FormValue("content")
	privacy := r.FormValue("privacy")

	// Access the file
	file, fileHeader, err := r.FormFile("picture")
	var fileContent []byte
	var fileName string
	var pic bool

	if err != nil {
		log.Println(err)
		pic = false
	} else {
		defer file.Close()
		fileContent, err = io.ReadAll(file)
		if err != nil {
			log.Println(err)
			pic = false
		} else {
			fileName = fileHeader.Filename
			pic = true
		}
	}

	// get the user data from the database
	userId := session.UserID
	poster, err := sqlite.GetUserById(userId)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	if !pic {
		err = sqlite.AddPosts(userId, content, time.Now().Format("2006-01-02 15:04:05"), poster.FullName, privacy)
		if err != nil {
			fmt.Fprintf(w, "{\"status\": 500, \"message\": \"internal server error\"}")
			return
		}
	} else {
		err = sqlite.AddPosts2(userId, content, time.Now().Format("2006-01-02 15:04:05"), poster.FullName, privacy, fileName, fileContent)
		if err != nil {
			fmt.Fprintf(w, "{\"status\": 500, \"message\": \"internal server error\"}")
			return
		}
	}

	// Return the response
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "{\"status\": 200, \"message\": \"success\"}")
}
