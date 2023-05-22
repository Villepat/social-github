package api

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"social-network/backend/database/sqlite"
	"strconv"
)

// struct for the response
type Response struct {
	Posts []PostForResponse `json:"posts"`
}

// struct for the posts
type PostForResponse struct {
	Id        int    `json:"id"`
	UserId    int    `json:"user_id"`
	FullName  string `json:"full_name"`
	Content   string `json:"content"`
	Picture   string `json:"picture"`
	Date      string `json:"date"`
	LikeCount int    `json:"like_count"`
	Likers    []int  `json:"likers"`
}

func ServePosts(w http.ResponseWriter, r *http.Request) {
	const internalServerErrorMessage = "{\"status\": 500, \"message\": \"internal server error\"}"

	// set the response headers
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")

	if r.Method != "GET" && r.Method != "OPTIONS" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		fmt.Fprintf(w, "{\"status\": 405, \"message\": \"method not allowed\"}")
		return
	}

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, "{\"status\": 200, \"message\": \"success\"}")
		return
	}

	postID := r.URL.Query().Get("id")
	if postID != "" {
		log.Println("request is for single post", postID)
		postIDInt, err := strconv.Atoi(postID)
		if err != nil {
			log.Println(err)
			fmt.Println(err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		posts, err := fetchSinglePost(postIDInt)
		if err != nil {
			log.Println(err)
			fmt.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		// create the response
		response := Response{
			Posts: []PostForResponse{posts},
		}

		// convert the response to json
		responseJSON, err := json.Marshal(response)
		if err != nil {
			fmt.Println(err)
			// send a response with the error
			fmt.Fprint(w, internalServerErrorMessage)
		}

		// write the response
		w.Write(responseJSON)
		return
	}

	// get the posts
	posts, err := GetPosts()
	if err != nil {
		fmt.Println(err)
		// send a response with the error
		fmt.Fprint(w, internalServerErrorMessage)
	}

	// create the response
	response := Response{
		Posts: posts,
	}

	// convert the response to json
	responseJSON, err := json.Marshal(response)
	if err != nil {
		fmt.Println(err)
		// send a response with the error
		fmt.Fprint(w, internalServerErrorMessage)
	}

	// write the response
	w.Write(responseJSON)
}

func GetPosts() ([]PostForResponse, error) {
	db, err := sqlite.OpenDb()
	if err != nil {
		log.Println("Error opening the database, GetPosts(): ", err)
	}

	defer db.Close()

	// get the posts
	posts := []PostForResponse{}

	rows, err := db.Query("SELECT id, user_id, content, author, created_at, image FROM posts ORDER BY created_at DESC")
	if err != nil {
		log.Println("Error getting the posts, GetPosts(): ", err)
	}

	defer rows.Close()

	for rows.Next() {
		var post PostForResponse
		var imageData []byte
		err := rows.Scan(&post.Id, &post.UserId, &post.Content, &post.FullName, &post.Date, &imageData)
		if err != nil {
			log.Println("Error scanning the posts, GetPosts(): ", err)
		}

		// Encode the image data to base64
		if imageData != nil {
			post.Picture = base64.StdEncoding.EncodeToString(imageData)
		}

		// get the like count
		likeCount, err := sqlite.GetLikes(post.Id)
		if err != nil {
			log.Println("Error getting the like count, GetPosts(): ", err)
		}
		post.LikeCount = likeCount

		// get the likers
		likers, err := getLikersList(post.Id)
		if err != nil {
			log.Println("Error getting the likers, GetPosts(): ", err)
		}
		post.Likers = likers

		posts = append(posts, post)
	}

	return posts, nil
}

func fetchSinglePost(PostID int) (PostForResponse, error) {
	db, err := sqlite.OpenDb()
	if err != nil {
		log.Println("Error opening the database, GetPosts(): ", err)
	}

	defer db.Close()

	// get the post
	post := PostForResponse{}

	rows, err := db.Query("SELECT id, user_id, content, author, created_at, image FROM posts WHERE id = ?", PostID)

	if err != nil {
		log.Println("Error getting the posts, GetPosts(): ", err)
	}

	defer rows.Close()

	for rows.Next() {
		var imageData []byte
		err := rows.Scan(&post.Id, &post.UserId, &post.Content, &post.FullName, &post.Date, &imageData)
		if err != nil {
			log.Println("Error scanning the posts, GetPosts(): ", err)
		}

		// Encode the image data to base64
		if imageData != nil {
			post.Picture = base64.StdEncoding.EncodeToString(imageData)
			log.Println("has image")
		}

		// get the like count
		likeCount, err := sqlite.GetLikes(post.Id)
		if err != nil {
			log.Println("Error getting the like count, GetPosts(): ", err)
		}
		post.LikeCount = likeCount
	}

	return post, nil
}

func getLikersList(postID int) ([]int, error) {
	db, err := sqlite.OpenDb()
	if err != nil {
		log.Println("Error opening the database, GetPosts(): ", err)
		return nil, err
	}

	defer db.Close()

	// get the likers
	likers := []int{}

	rows, err := db.Query("SELECT user_id FROM reactions WHERE post_id = ?", postID)

	if err != nil {
		log.Println("Error getting the likers, GetPosts(): ", err)
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var liker int
		err := rows.Scan(&liker)
		if err != nil {
			log.Println("Error scanning the likers, GetPosts(): ", err)
			return nil, err
		}

		likers = append(likers, liker)
	}

	return likers, nil
}
