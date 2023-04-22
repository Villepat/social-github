package main

import (
	"net/http"
	handlers "social-network/apiAndDb/pkg/handlers"
)

func main() {
	http.HandleFunc("/api/login", handlers.Handler)
	// Listen and serve on 8393
	err := http.ListenAndServe(":8393", nil)
	if err != nil {
		panic(err)
	}
}
