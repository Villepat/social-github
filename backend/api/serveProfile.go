package api

import (
	"log"
	"net/http"
	"social-network/backend/database/sqlite"
)

// struct for the response
type User struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	Nickname  string `json:"nickname"`
	AboutMe   string `json:"aboutme"`
}

func ServeUser(w http.ResponseWriter, r *http.Request) {
	log.Println("ServeUser")

	// set the response headers
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")

	if r.Method != "GET" && r.Method != "OPTIONS" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	log.Println(Sessions)
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

	// get the user data from the database
	userId := session.UserID
	user, err := getUser(userId)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// send the response
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status": 200, "message": "success", "user": {"firstName": "` + user.FirstName + `", "lastName": "` + user.LastName + `", "email": "` + user.Email + `", "nickname": "` + user.Nickname + `", "aboutme": "` + user.AboutMe + `"}}`))
}

func getUser(userId int) (User, error) {
	db, err := sqlite.OpenDb()
	if err != nil {
		log.Println(err)
		return User{}, err
	}
	defer db.Close()

	var user User

	err = db.QueryRow("SELECT firstname, lastname, email, nickname, aboutme FROM users WHERE user_id = ?", userId).Scan(&user.FirstName, &user.LastName, &user.Email, &user.Nickname, &user.AboutMe)
	if err != nil {
		log.Println(err)
		return user, err
	}

	return user, nil
}
