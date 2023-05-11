package api

import (
	"encoding/json"
	"log"
	"net/http"
	"social-network/backend/database/sqlite"
	"strconv"
)

func ServeGroupPosts(w http.ResponseWriter, r *http.Request) {
	log.Println("ServeGroupPosts called")
	// Enable CORS for all the frontend
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	groupID := r.URL.Query().Get("id")
	log.Println("groupID:", groupID)

	groupIDInt, err := strconv.Atoi(groupID)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	posts, err := sqlite.GetGroupPosts(groupIDInt)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// Send response
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(posts); err != nil {
		log.Println(err)
		http.Error(w, "Error in ServeGroupPosts", http.StatusInternalServerError)
		return
	}

	log.Println("ServeGroupPosts successfully finished")

}
