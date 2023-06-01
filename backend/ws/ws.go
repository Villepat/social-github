package ws

import (
	"encoding/json"
	"log"
	"net/http"
	"social-network/backend/api"
	"social-network/backend/database/sqlite"
	"strconv"
	"time"

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
	Text      string `json:"message"`
	Receiver  string `json:"receiver"`
	Sender    string `json:"sender"`
	Timestamp string
}

// function to read the data from the websocket connection
func reader(conn *websocket.Conn) {
	// Set up a close handler for the WebSocket connection
	conn.SetCloseHandler(func(code int, text string) error {
		log.Printf("WebSocket closed with code %d and text: %s", code, text)
		delete(Connections, conn) // Remove the connection from the map.
		// Broadcast the "USER_LEFT" message to all other connections.
		// for c := range Connections {
		// 	err := c.WriteMessage(websocket.TextMessage, []byte("USER_LEFT"))
		// 	if err != nil {
		// 		log.Println(err)
		// 		delete(Connections, c) // Remove the connection from the map.
		// 	}
		// }
		return nil
	})
	for {
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		// Create a map to store the connections by username
		for _, conn := range Connections {
			ConnectionsByName[conn.Username] = conn.Connection
		}
		log.Println("message received: ")
		log.Println("messageType: ", messageType)
		log.Println(string(p))
		var message Message
		err = json.Unmarshal(p, &message)
		if err != nil {
			log.Println(err)
			return
		}
		if message.Command == "NEW_MESSAGE" {
			log.Printf("Received message: %v\n", message)
			// get the sender username
			sender, ok := Connections[conn]
			if !ok {
				log.Println("Sender not found")
			}
			senderUsername := sender.Username
			message.Sender = senderUsername
			log.Println("Sender: ", senderUsername)
			message.Timestamp = time.Now().Format("2006-01-02 15:04:05")

			// add message to database
			log.Println("Message: ", message)
			// Send message to sender
			log.Println("Sending message to sender: ", message)
			err = conn.WriteJSON(message)
			if err != nil {
				log.Println(err)
				return
			}
			// Check if receiver is online
			log.Println("connectionsByName: ", ConnectionsByName)
			for c := range ConnectionsByName {
				log.Println(c)
			}
			receiverConn, ok := ConnectionsByName[message.Receiver]
			if !ok {
				log.Printf("Receiver %v is not online, message will be saved to database\n", message.Receiver)
				continue
			}
			// Send message to receiver
			if message.Receiver != message.Sender {
				log.Println("Sending message to receiver: ", message)
				err = receiverConn.WriteJSON(message)
				if err != nil {
					log.Println(err)
				}
			}
		}
		if message.Command == "GROUP_MESSAGE" {
			sender, ok := Connections[conn]
			if !ok {
				log.Println("Sender not found")
			}

			senderUsername := sender.Username
			message.Sender = senderUsername
			log.Println("Sender: ", senderUsername)
			message.Timestamp = time.Now().Format("2006-01-02 15:04:05")

			// add message to database
			log.Println("Message: ", message)
			// Send message to sender
			log.Println("Sending message to sender: ", message)
			err = conn.WriteJSON(message)
			if err != nil {
				log.Println(err)
				return
			}
			groupID, err := strconv.Atoi(message.Receiver)
			if err != nil {
				log.Println(err)
			}

			// get all users in the group
			members, err := sqlite.GetGroupMembers(groupID)
			if err != nil {
				log.Println(err)
			}

			log.Println("members: ", members)

			// Send message to all group members
			for _, member := range members {
				if member.FullName != message.Sender {
					receiverConn, ok := ConnectionsByName[member.FullName]
					if !ok {
						log.Printf("Receiver %v is not online, message will be saved to database\n", message.Receiver)
						continue
					}
					log.Println("Sending message to receiver: ", message)
					err = receiverConn.WriteJSON(message)
					if err != nil {
						log.Println(err)
					}
				}
			}
		}
	}
}

// function to set up the websocket endpoint
func wsEndpoint(w http.ResponseWriter, r *http.Request) {
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
	}
	c, err := r.Cookie("session_token")
	if err != nil {
		log.Println("User is not logged in")
		return
	}

	userInfo, ok := api.Sessions[c.Value]
	if !ok {
		log.Println("Session error user is not logged in")
		return
	}

	userconn := &UserConnection{
		UserID:     userInfo.UserID,
		Username:   userInfo.Username,
		Connection: ws,
	}

	// Add the connection to the list of active connections.
	Connections[ws] = userconn
	// for c := range Connections {
	// 	if c != ws {
	// 		err := c.WriteMessage(websocket.TextMessage, []byte("USER_JOINED"))
	// 		if err != nil {
	// 			log.Println(err)
	// 			delete(Connections, c) // Remove the connection from the map.
	// 		}
	// 	}
	// }
	log.Printf("User %s with ID %d successfully connected", userconn.Username, userconn.UserID)
	log.Println("connections: ", Connections)
	go reader(ws)
}

// function to broadcast a message when new user is created
func BroadcastNewUser(username string) {
	log.Println("new user created")
	for c := range Connections {
		err := c.WriteMessage(websocket.TextMessage, []byte("USER_CREATED"))
		if err != nil {
			log.Println(err)
			delete(Connections, c) // Remove the connection from the map.
		}
	}
}

// function to set up the routes for the websocket server.
func SetupRoutes() {
	http.HandleFunc("/ws", wsEndpoint)
}
