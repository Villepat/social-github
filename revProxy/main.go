package main

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
)

func main() {
	// create a new reverse proxy to the backend
	backendURL, err := url.Parse("http://localhost:8393")
	if err != nil {
		panic(err)
	}
	backendProxy := httputil.NewSingleHostReverseProxy(backendURL)

	// create a new reverse proxy to the frontend
	frontendURL, err := url.Parse("http://localhost:3000")
	if err != nil {
		panic(err)
	}
	frontendProxy := httputil.NewSingleHostReverseProxy(frontendURL)

	// create a new multiplexer
	mux := http.NewServeMux()

	// add the reverse proxies to the multiplexer
	mux.Handle("/api/", backendProxy)
	mux.Handle("/", frontendProxy)

	// create a new HTTP server with the multiplexer as the handler
	server := &http.Server{
		Addr:    ":8080",
		Handler: mux,
	}

	// start the server
	log.Println("Starting server on :8080")
	log.Fatal(server.ListenAndServe())
	if err != nil {
		log.Fatal(err)
	}
}
