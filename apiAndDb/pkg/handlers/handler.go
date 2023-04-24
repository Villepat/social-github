package handler

import (
	"fmt"
	"net/http"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" && r.Method != "GET" {
		// return a JSON response with a 405 status code
		fmt.Fprintf(w, `{"status": 405, "message": "method not allowed"}`)
	}
}