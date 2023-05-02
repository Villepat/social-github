package main

import (
	"log"
	"net/http"
	"social-network/backend/api"
	"social-network/backend/database/sqlite"
)

func main() {
	log.SetFlags(log.LstdFlags | log.Lshortfile) //!!!!!! very nice for debugging
	// create database
	sqlite.CreateDB()

	http.HandleFunc("/api/register", api.RegisterAPI)
	http.HandleFunc("/api/login", api.LoginAPI)
	http.HandleFunc("/api/check-login", api.CheckLoginStatus)
	http.HandleFunc("/api/logout", api.LogoutAPI)
	http.HandleFunc("/api/posting", api.ServePosting)
	http.HandleFunc("/api/posts", api.ServePosts)
	http.HandleFunc("/api/user", api.ServeUser)

	log.Println("Server running on port 6969")
	log.Fatal(http.ListenAndServe(":6969", nil))
}