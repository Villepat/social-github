package websocket

import (
	"encoding/base64"
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

type UserConnection struct {
	UserID     int
	Username   string
	Connection *websocket.Conn
}

var Connections = make(map[*websocket.Conn]*UserConnection)
var ConnectionsByName = make(map[string]*websocket.Conn)

type Message struct {
	Command   string `json:"command"`
	Text      string `json:"text"`
	Receiver  string `json:"receiver"`
	Sender    string `json:"sender"`
	Timestamp string
}

func chat(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "index.html")
}

func reader(ws *websocket.Conn) {
	for {
		var msg Message
		err := ws.ReadJSON(&msg)
		if err != nil {
			ws.Close()
			delete(Connections, ws)
			return
		}
		switch msg.Command {
		case "join":
			Connections[ws].Username = msg.Sender
			ConnectionsByName[msg.Sender] = ws
		case "message":
			ConnectionsByName[msg.Receiver].WriteJSON(msg)
		}
	}
}

func wsEndpoint(w http.ResponseWriter, r *http.Request) {
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	authHeade := r.Header.Get("Authorization")
	if authHeade == "" {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	// Decode the base64-encoded credentials
	decodedAuthHeader, err := base64.StdEncoding.DecodeString(authHeade[6:])
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	username := strings.Split(string(decodedAuthHeader), ":")[0]
	log.Println(username)

	Connections[ws] = &UserConnection{Connection: ws}
	go reader(ws)
}

func SetupRoutes() {
	http.HandleFunc("/chat", chat)
	http.HandleFunc("/ws", wsEndpoint)
}
