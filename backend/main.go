package main

import (
	"log"
	"net/http"
	"social-network/backend/api"
	"social-network/backend/database/sqlite"
	"social-network/backend/ws"
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
	http.HandleFunc("/api/like-counter", api.ServeLikeCounter)
	http.HandleFunc("/api/user/", api.ServeUser)
	http.HandleFunc("/api/userlist", api.UserListAPI)
	http.HandleFunc("/api/create-group", api.CreateGroupAPI)
	http.HandleFunc("/api/groups", api.ServeGroups)
	http.HandleFunc("/api/user/update", api.UpdateProfileAPI)
	http.HandleFunc("/api/commenting", api.CommentingAPI)
	http.HandleFunc("/api/serve-group-data", api.ServeSingleGroup)
	http.HandleFunc("/api/serve-comments", api.ServeComments)
	http.HandleFunc("/api/group-posting", api.GroupPosting)
	http.HandleFunc("/api/serve-group-posts", api.ServeGroupPosts)
	http.HandleFunc("/api/follow", api.FollowAPI)
	http.HandleFunc("/api/post/like", api.HandlingLikes)

	ws.SetupRoutes()

	log.Println("Server running on port 6969")
	log.Fatal(http.ListenAndServe(":6969", nil))
}
