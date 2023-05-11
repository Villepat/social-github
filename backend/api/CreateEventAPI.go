package api

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"social-network/backend/database/sqlite"
	"strconv"
)

type CreateEventRequest struct {
	GroupId          string `json:"group_id"`
	EventTitle       string `json:"title"`
	EventDescription string `json:"description"`
	EventDateTime    string `json:"date_time"`
}

// CreateEventAPI is the API handler for creating a new event
func CreateEventAPI(w http.ResponseWriter, r *http.Request) {
	log.Println("CreateEventAPI called")
	// set cors headers
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")

	// if the request method is not POST or OPTIONS, return
	if r.Method != http.MethodPost && r.Method != http.MethodOptions {
		w.WriteHeader(http.StatusMethodNotAllowed)
		fmt.Println("method not allowed")
		return
	}

	// if the request method is OPTIONS, return
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	// parse the JSON request body into a CreateEventRequest struct
	var request CreateEventRequest
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		fmt.Println("error decoding json")
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// get the event details from the request
	groupId := request.GroupId
	eventTitle := request.EventTitle
	eventDescription := request.EventDescription
	eventDateTime := request.EventDateTime

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

	//print request data and user id
	log.Println("request data:", groupId, eventTitle, eventDescription, eventDateTime)
	log.Println("user id:", session.UserID)
	//make groupid into int
	groupIdInt, err := strconv.Atoi(groupId)
	fmt.Println(groupId, "aaaaaaaa")
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// create the event in the database
	err = sqlite.CreateEvent(groupIdInt, session.UserID, eventTitle, eventDescription, eventDateTime)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// return a success status code
	w.WriteHeader(http.StatusOK)
}
