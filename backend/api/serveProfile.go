package api

import (
	"encoding/base64"
	"log"
	"net/http"
	"social-network/backend/database/sqlite"
	"strconv"
	"strings"
)

// struct for the response
type User struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	Nickname  string `json:"nickname"`
	AboutMe   string `json:"aboutme"`
	Avatar    string `json:"avatar"`
}

func ServeUser(w http.ResponseWriter, r *http.Request) {
	log.Println("ServeUser")

	// set the response headers
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")

	if r.Method == "OPTIONS" {
		log.Println("Method options")
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != "GET" {
		log.Println("Method not allowed")
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	// Extract userId from the request URL
	urlPath := r.URL.Path
	pathParts := strings.Split(urlPath, "/")
	userIdStr := pathParts[len(pathParts)-1]
	userId, err := strconv.Atoi(userIdStr)
	if err != nil {
		log.Println("Error converting userId to int:", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	log.Println("userId:", userId)

	// get the user data from the database
	user, err := getUser(userId)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// send the response
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status": 200, "message": "success", "user": {"firstName": "` + user.FirstName + `", "lastName": "` + user.LastName + `", "email": "` + user.Email + `", "nickname": "` + user.Nickname + `", "aboutme": "` + user.AboutMe + `", "avatar": "` + user.Avatar + `"}}`))
}

func getUser(userId int) (User, error) {
	db, err := sqlite.OpenDb()
	if err != nil {
		log.Println(err)
		return User{}, err
	}
	defer db.Close()

	var user User
	var avatar []byte

	err = db.QueryRow("SELECT firstname, lastname, email, nickname, aboutme, avatar FROM users WHERE user_id = ?", userId).Scan(&user.FirstName, &user.LastName, &user.Email, &user.Nickname, &user.AboutMe, &avatar)
	if err != nil {
		log.Println(err)
		return user, err
	}

	user.Avatar = base64.StdEncoding.EncodeToString(avatar)

	return user, nil
}
