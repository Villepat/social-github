package api

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	sqlite "social-network/apiAndDb/pkg/db/sqlite"
	"strings"

	uuid "github.com/gofrs/uuid"
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

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, "{\"status\": 200, \"message\": \"success\"}")
		return
	}

	var user RegisterUser
	err := json.NewDecoder(r.Body).Decode(&user)
	log.Printf("Received request with data: %v\n", user)
	if err != nil {
		if err == io.EOF {
			w.WriteHeader(http.StatusBadRequest)
			fmt.Fprintf(w, "{\"status\": 400, \"message\": \"bad request\"}")
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "{\"status\": 500, \"message\": \"internal server error\"}")
		log.Println(err)
		return
	}

	// Generate a new UUID for the user
	uuid, err := uuid.NewV4()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "{\"status\": 500, \"message\": \"internal server error\"}")
		log.Println(err)
		return
	}

	uuidString := uuid.String()
	user.Username = strings.ToLower(user.Username)
	// Add the user to the database
	err = sqlite.AddUser(user.Username, user.Email, user.Password, uuidString, user.Name, user.Surname, user.Birthdate, user.Aboutme)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "{\"status\": 500, \"message\": \"internal server error\"}")
		log.Println(err)
		return
	}

	// Return the response
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "{\"status\": 200, \"message\": \"success\"}")
}
