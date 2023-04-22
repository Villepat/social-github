package api

import (
	"encoding/json"
	"net/http"
)

// DummyAPI is a dummy API
type DummyAPI struct {
	Data     string `json:"data"`
	MoreData string `json:"moreData"`
}

// NewDummyAPI returns a new DummyAPI
func NewDummyAPI() *DummyAPI {
	return &DummyAPI{
		Data:     "Hello, world!",
		MoreData: "This is more data.",
	}
}

// Handler is the HTTP handler for the DummyAPI
func (api *DummyAPI) Handler(w http.ResponseWriter, r *http.Request) {
	// Set the response headers
	w.Header().Set("Content-Type", "application/json")

	// Encode the response as JSON
	json.NewEncoder(w).Encode(api)
}
