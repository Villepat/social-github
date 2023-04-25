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

	websocket.SetupRoutes()
	// Listen and serve on 8393
	log.Println("Listening on 8393")
	err := http.ListenAndServe(":8393", nil)
	if err != nil {
		panic(err)
	}
}
