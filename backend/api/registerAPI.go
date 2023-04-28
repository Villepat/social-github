package api

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"social-network/backend/database/sqlite"
)

type RegisterRequest struct {
	Email     string `json:"email"`
	Nickname  string `json:"nickname"`
	Password  string `json:"password"`
	Birthdate string `json:"birthday"`
	AboutMe   string `json:"aboutme"`
	FirstName string `json:"firstname"`
	LastName  string `json:"lastname"`
}
type RegisterResponse struct {
	Message string `json:"message"`
}

func RegisterAPI(w http.ResponseWriter, r *http.Request) {
	log.Println("RegisterAPI called")
	// Enable CORS for all the frontend
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Parse the multipart form data
	err := r.ParseMultipartForm(32 << 20) // Set the maximum memory to 32MB
	if err != nil {
		log.Println(err)
		http.Error(w, "Error parsing multipart form data", http.StatusBadRequest)
		return
	}

	// Access form fields
	email := r.FormValue("email")
	password := r.FormValue("password")
	nickname := r.FormValue("nickname")
	firstName := r.FormValue("firstName")
	lastName := r.FormValue("lastName")
	birthday := r.FormValue("birthday")
	aboutMe := r.FormValue("aboutMe")

	// Access uploaded file
	file, fileHeader, err := r.FormFile("profilePicture")
	if err != nil {
		log.Println(err)
		http.Error(w, "Error retrieving profile picture", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Read the file's content
	fileContent, err := io.ReadAll(file)
	if err != nil {
		http.Error(w, "Error reading profile picture", http.StatusInternalServerError)
		return
	}

	// Perform registration logic (e.g. insert user into database)
	err = sqlite.RegisterUser(email, nickname, password, birthday, aboutMe, firstName, lastName, fileHeader.Filename, fileContent)
	if err != nil {
		log.Println(err)
		http.Error(w, "Error registering user", http.StatusInternalServerError)
		return
	}

	// Send a success response to the client
	response := RegisterResponse{
		Message: "User registered successfully",
	}
	json.NewEncoder(w).Encode(response)

	// // Parse the JSON request body into a RegisterRequest struct
	// var request RegisterRequest
	// err := json.NewDecoder(r.Body).Decode(&request)
	// if err != nil {
	// 	w.WriteHeader(http.StatusBadRequest)
	// 	return
	// }

	// // Perform validation on the request fields
	// if request.Email == "" || request.Nickname == "" || request.Password == "" {
	// 	w.WriteHeader(http.StatusBadRequest)
	// 	return
	// }

	// log.Println(request)

	// // Perform registration logic (e.g. insert user into database)
	// err = sqlite.RegisterUser(request.Email, request.Nickname, request.Password, request.Birthdate, request.AboutMe, request.FirstName, request.LastName)
	// if err != nil {
	// 	log.Println(err)
	// 	w.WriteHeader(http.StatusInternalServerError)
	// 	return
	// }

	// // Send a success response to the client
	// response := RegisterResponse{
	// 	Message: "User registered successfully",
	// }
	// json.NewEncoder(w).Encode(response)
}
