package api

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"social-network/backend/database/sqlite"
)

const defaultProfilePicturePath = "./database/pictures/pepega.png"

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
	var fileContent []byte
	var fileName string

	// Use default profile picture if no file was uploaded
	if err != nil {
		log.Println("No profile picture uploaded, using default")

		defaultFile, err := os.Open(defaultProfilePicturePath)
		if err != nil {
			log.Println(err)
			http.Error(w, "Error opening default profile picture", http.StatusInternalServerError)
			return
		}
		defer defaultFile.Close()

		fileContent, err = io.ReadAll(defaultFile)
		if err != nil {
			log.Println(err)
			http.Error(w, "Error reading default profile picture", http.StatusInternalServerError)
			return
		}

		fileName = "default_profile_picture.jpg"
	} else {
		defer file.Close()

		// Read the file's content
		fileContent, err = io.ReadAll(file)
		if err != nil {
			log.Println(err)
			http.Error(w, "Error reading profile picture", http.StatusInternalServerError)
			return
		}

		fileName = fileHeader.Filename
	}

	// Perform registration logic (e.g. insert user into database)
	err = sqlite.RegisterUser(email, nickname, password, birthday, aboutMe, firstName, lastName, fileName, fileContent)
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
}
