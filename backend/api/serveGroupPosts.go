package api

import (
	"encoding/json"
	"log"
	"net/http"
	"social-network/backend/database/sqlite"
	"strconv"
)

// struct for the posts
type GroupPostForResponse struct {
	PostId        int    `json:"id"`
	GroupId       int    `json:"group_id"`
	UserId    int    `json:"user_id"`
	FullName  string `json:"full_name"`
	Content   string `json:"content"`
	Picture   string `json:"picture"`
	Date      string `json:"date"`
	LikeCount int    `json:"like_count"`
	Likers    []int  `json:"likers"`
}

func ServeGroupPosts(w http.ResponseWriter, r *http.Request) {
	log.Println("ServeGroupPosts called")
	// Enable CORS for all the frontend
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	groupID := r.URL.Query().Get("id")
	log.Println("groupID:", groupID)

	groupPostID := r.URL.Query().Get("group-postID")
	log.Println("groupPostID:", groupPostID)

	groupIDInt, err := strconv.Atoi(groupID)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if groupPostID != "" {
		groupPostIDInt, err := strconv.Atoi(groupPostID)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		post, err := GetGroupPost(groupPostIDInt, groupIDInt)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(post); err != nil {
			log.Println(err)
			http.Error(w, "Error in ServeGroupPosts", http.StatusInternalServerError)
			return
		}
		return
	}




	// groupPostIDInt, err := strconv.Atoi(groupPostID)
	// if err != nil {
	// 	log.Println(err)
	// 	w.WriteHeader(http.StatusBadRequest)
	// 	return
	// }



	posts, err := sqlite.GetGroupPosts(groupIDInt)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	

	// Send response
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(posts); err != nil {
		log.Println(err)
		http.Error(w, "Error in ServeGroupPosts", http.StatusInternalServerError)
		return
	}

	log.Println("ServeGroupPosts successfully finished")

}

func GetGroupPost(groupPostID, groupId int) (GroupPostForResponse, error) {
	db, err := sqlite.OpenDb()
	if err != nil {
		return GroupPostForResponse{}, err
	}

	defer db.Close()

	// Get the post
	post := GroupPostForResponse{}
	err = db.QueryRow("SELECT id, user_id, group_id, content, created_at FROM group_posts WHERE id = ?", groupPostID).Scan(&post.PostId, &post.UserId, &post.GroupId, &post.Content, &post.Date)
	if err != nil {
		return GroupPostForResponse{}, err
	}

	// Get the user
	user, err := sqlite.GetUserById(post.UserId)
	if err != nil {
		return GroupPostForResponse{}, err
	}
	post.FullName = user.FullName

	return post, nil
}



