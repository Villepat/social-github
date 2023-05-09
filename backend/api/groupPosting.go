package api

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"social-network/backend/database/sqlite"
	"strconv"
	"time"
)

func GroupPosting(w http.ResponseWriter, r *http.Request) {
	// set CORS headers
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

	// get the group name from the request body
	var request struct {
		GroupId string `json:"group_id"`
		Content string `json:"content"`
	}
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	log.Println("request:", request)

	// get the group name from the request
	groupId := request.GroupId
	log.Println("groupId:", groupId)

	// get the user id from the session
	//check if the request cookie is in the sessions map
	cookie, err := r.Cookie("session_token")
	if err != nil {
		fmt.Println("Error getting cookie:", err)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	session, ok := Sessions[cookie.Value]
	if !ok {
		fmt.Println("session not found")
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	// get the user id from the session
	userId := session.UserID
	log.Println("session found", userId)

	groupIdInt, err := strconv.Atoi(groupId)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// add the post to the group_posts table
	err = sqlite.AddGroupPost(groupIdInt, userId, request.Content, nil, time.Now().Format("2006-01-02 15:04:05"))
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// write the response
	w.WriteHeader(http.StatusOK)
}
