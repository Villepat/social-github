package main

import (
	"log"
	"net/http"
	sqlite "social-network/apiAndDb/pkg/db/sqlite"
	"social-network/apiAndDb/pkg/websocket"

	api "social-network/apiAndDb/pkg/APIs"
)

func main() {
	sqlite.InitDb()
	http.HandleFunc("/api/login", api.Login)
	http.HandleFunc("/api/register", api.Register)
	http.HandleFunc("/api/posting", api.ServePosting)

	websocket.SetupRoutes()
	// Listen and serve on 8393
	log.Println("Listening on 6969")
	err := http.ListenAndServe(":6969", nil)
	if err != nil {
		panic(err)
	}
}
