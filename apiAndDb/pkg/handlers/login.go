package handler

import (
	"fmt"
	"log"
	"net/http"
)

// login will handle the /api/login endpoint
func Login(w http.ResponseWriter, r *http.Request) {
	log.Println(r.Method)
	if r.Method != "POST" && r.Method != "GET" {
		// return a JSON response with a 405 status code
		fmt.Fprintf(w, `{"status": 405, "message": "method not allowed"}`)
	}

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.URL.Path == "/api/login" {
		// return a JSON response with a message of "login"

		fmt.Fprintf(w, `{"status": 200, "message": "success", "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"}`)
	} else {
		// return a JSON response with a 404 status code
		fmt.Fprintf(w, `{"status": 404, "message": "not found"}`)
	}
}
