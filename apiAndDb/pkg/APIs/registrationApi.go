package api

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	sqlite "social-network/apiAndDb/pkg/db/sqlite"
)

// regiserUser is the struct that will be used to decode the json
type RegisterUser struct {
	Username  string `json:"username"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	Name      string `json:"name"`
	Surname   string `json:"surname"`
	Birthdate string `json:"birthdate"`
	Aboutme   string `json:"aboutme"`
}

// register function will handle the registration request
func Register(w http.ResponseWriter, r *http.Request) {
	// Set the response headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// Check if the request method is POST
	if r.Method != "POST" && r.Method != "OPTIONS" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		fmt.Fprintf(w, "{\"status\": 405, \"message\": \"method not allowed\"}")
		return
	}
	// Limit the size of the request body
	maxSize := int64(1024 * 1024) // 1MB
	r.Body = http.MaxBytesReader(w, r.Body, maxSize)

	// Read the entire request body
	body, err := io.ReadAll(r.Body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "{\"status\": 400, \"message\": \"bad request\"}")
		return
	}
	log.Println(string(body))

	// Decode the json
	var user RegisterUser
	err = json.Unmarshal(body, &user)
	if err != nil {
		log.Fatal(err)
	}

	// Add the user to the database
	sqlite.AddUser(user.Username, user.Email, user.Password, "1", user.Name, user.Surname, user.Birthdate, user.Aboutme)

	// Return the response
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "{\"status\": 200, \"message\": \"success\"}")
}
