package api

import (
	"encoding/base64"
	"fmt"
	"log"
	"net/http"
	sqlite "social-network/apiAndDb/pkg/db/sqlite"
	"strings"
)

func Login(w http.ResponseWriter, r *http.Request) {
	// Set the response headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

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

	// Extract the username and password from the Authorization header
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Fprintf(w, "{\"status\": 401, \"message\": \"unauthorized\"}")
		return
	}

	// Decode the base64-encoded credentials
	decodedAuthHeader, err := base64.StdEncoding.DecodeString(authHeader[6:])
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Fprintf(w, "{\"status\": 401, \"message\": \"unauthorized\"}")
		return
	}

	// Split the username and password
	credentials := strings.Split(string(decodedAuthHeader), ":")
	if len(credentials) != 2 {
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Fprintf(w, "{\"status\": 401, \"message\": \"unauthorized\"}")
		return
	}
	username := strings.ToLower(credentials[0])
	password := credentials[1]
	// Encrypt the password to match the one in the database...

	// Verify the user in the database
	if sqlite.VerifyUser(username, password) >= 0 {
		w.WriteHeader(http.StatusOK)
		userKey, err := sqlite.GetUserKey(username)
		log.Println(userKey)
		fmt.Fprintf(w, "{\"status\": 200, \"message\": \"success\", \"token\": \"%s\"}", userKey)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintf(w, "{\"status\": 500, \"message\": \"internal server error\"}")
		}
		return
	} else if sqlite.VerifyUser(username, password) == -1 {
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Fprintf(w, "{\"status\": 401, \"message\": \"unauthorized\"}")
		return
	} else {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "{\"status\": 500, \"message\": \"internal server error\"}")
		return
	}
}
