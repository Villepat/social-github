package api

import (
	"encoding/json"
	"log"
	"net/http"
	"social-network/backend/database/sqlite"
	"strconv"
)

type Group struct {
	Id          int             `json:"id"`
	Name        string          `json:"name"`
	Description string          `json:"description"`
	Members     []sqlite.Member `json:"members"`
}

func ServeSingleGroup(w http.ResponseWriter, r *http.Request) {
	// set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")

	// if the request method is not GET or OPTIONS, return
	if r.Method != http.MethodGet && r.Method != http.MethodOptions {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	// if the request method is OPTIONS, return
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	// get the group id from the request
	groupID := r.URL.Query().Get("id")
	log.Println("groupID:", groupID)
	groupIDInt, err := strconv.Atoi(groupID)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// get the group data from the database
	group, err := GetGroupData(groupIDInt)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	log.Println(group)

	// write the group data to the response
	w.WriteHeader(http.StatusOK)
	err = json.NewEncoder(w).Encode(struct {
		Group Group `json:"group"`
	}{Group: group})
	if err != nil {
		log.Println("Error encoding JSON:", err)
		return
	}
}

func GetGroupData(groupID int) (Group, error) {
	db, err := sqlite.OpenDb()
	if err != nil {
		log.Println(err)
		return Group{}, err
	}

	defer db.Close()

	stmt, err := db.Prepare("SELECT id, title, description FROM groups WHERE id = ?")
	if err != nil {
		log.Println(err)
		return Group{}, err
	}

	defer stmt.Close()

	var group Group
	err = stmt.QueryRow(groupID).Scan(&group.Id, &group.Name, &group.Description)
	if err != nil {
		log.Println(err)
		return Group{}, err
	}

	log.Println(group)
	return group, nil
}
